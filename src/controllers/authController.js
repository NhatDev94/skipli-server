const { SECRET_KEY, ACCESS_CODE_EXPIRE } = require("../config/constant");
const { db } = require("../config/firebase");
const jwt = require("jsonwebtoken");
const { sendSMS } = require("../config/sms");
const { sendUrlActive } = require("./employeeController");
const bcrypt = require("bcryptjs");

const createAccessCode = async (phoneNumber) => {
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  const authRef = db.collection("auth");
  authRef.doc(phoneNumber).set({
    phoneNumber,
    code,
    expiresAt: Date.now() + ACCESS_CODE_EXPIRE,
  });
  // send code to phone

  sendSMS(phoneNumber, `Access code: ${code}`);
};

// SignIn token
const createToken = async (phoneNumber) => {
  const payload = {
    phoneNumber,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "48h", // Token sống trong 1 giờ
  });
  const authRef = db.collection("auth");
  const snapshot = await authRef.where("phoneNumber", "==", phoneNumber).get();
  if (!snapshot.empty) {
    const auth = snapshot.docs[0]?.data();
    authRef.doc(phoneNumber).set({
      ...auth,
      token,
    });
  }
  return token;
};

const phoneValidate = async (req, res) => {
  const { phoneNumber } = req.body;

  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("phoneNumber", "==", phoneNumber).get();
  if (snapshot.empty) {
    return res.status(200).json({
      success: true,
      data: {
        exists: false,
      },
    });
  }

  const user = snapshot.docs[0].data();
  // create access code
  if (user.role === "admin") createAccessCode(phoneNumber);
  return res.status(200).json({
    success: true,
    data: {
      exists: true,
      user,
    },
  });
};

const signIn = async (req, res) => {
  const { phoneNumber, role, code, password } = req.body;

  if (role === "admin") {
    const authRef = db.collection("auth");
    const snapshot = await authRef
      .where("phoneNumber", "==", phoneNumber)
      .get();

    const auth = snapshot.docs[0]?.data();
    if (auth && auth.code === code && auth.expiresAt > Date.now()) {
      const token = await createToken(phoneNumber);

      const userRef = db.collection("users").doc(phoneNumber);
      const doc = await userRef.get();
      const user = doc.data();

      res.status(200).json({
        success: true,
        data: {
          user,
          token,
        },
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Code không chính xác hoặc hết hạn.",
      data: null,
    });
  }
  // admin
  const usersRef = db.collection("users").doc(phoneNumber);
  const doc = await usersRef.get();
  const employee = doc.data();

  if (employee) {
    const isMatch = await bcrypt.compare(password, employee.password);
    if (isMatch) {
      const token = await createToken(phoneNumber);
      const user = {
        phoneNumber,
        email: employee.email,
        name: employee.name,
        role: employee.role,
      };
      return res.status(200).json({
        success: true,
        message: "Sign in successful.",
        data: {
          user,
          token,
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: "Password is incorrect.",
      data: null,
    });
  }
};

const resendCode = async (req, res) => {
  const { phoneNumber } = req.body;

  createAccessCode(phoneNumber);
  return res.status(200).json({
    success: true,
    message: "success",
    data: {},
  });
};

const validateTokenEmployeeAccount = async (req, res) => {
  const { token, phoneNumber } = req.body;
  const tokenRef = db.collection("employeeTokens").doc(phoneNumber);
  const doc = await tokenRef.get();
  const dbToken = doc.data();

  if (dbToken && dbToken.token === token) {
    try {
      const employeeRef = db.collection("users");
      const snapshot = await employeeRef
        .where("phoneNumber", "==", phoneNumber)
        .get();
      const employee = snapshot.docs[0]?.data();
      jwt.verify(token, SECRET_KEY);

      return res.status(200).json({
        success: true,
        message: "Authentication successful",
        data: { employee },
      });
    } catch (error) {
      return res.status(200).json({
        success: true,
        message:
          "The verification link has expired. Please request a resend of the verification email.",
        data: null,
      });
    }
  }
  return res.status(200).json({
    success: true,
    message:
      "The verification link has expired. Please request a resend of the verification email.",
    data: null,
  });
};

const resendEmailValidate = async (req, res) => {
  const { phoneNumber } = req.body;

  const employeeRef = db.collection("users");
  const snapshot = await employeeRef
    .where("phoneNumber", "==", phoneNumber)
    .get();

  if (snapshot.empty) {
    return res.status(200).json({
      success: true,
      message: "Employee does not exist",
      data: null,
    });
  }

  const employee = snapshot.docs[0]?.data();

  if (employee.role === "admin") {
    return res.status(200).json({
      success: true,
      message: "Employee does not exist",
      data: null,
    });
  }

  await sendUrlActive(employee);
  return res.status(200).json({
    success: true,
    message: "Verification email sent successfully",
    data: {},
  });
};

const createEmployeePassword = async (req, res) => {
  const { phoneNumber, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userRef = db.collection("users").doc(phoneNumber);
  const doc = await userRef.get();
  const employee = doc.data();

  const newEmployee = { ...employee, password: hashedPassword, isActive: true };
  userRef.set(newEmployee);
  const token = await createToken(phoneNumber);
  return res.status(200).json({
    success: true,
    message: "Password created successfully",
    data: { user: newEmployee, token },
  });
};

module.exports = {
  phoneValidate,
  signIn,
  resendCode,
  resendEmailValidate,
  validateTokenEmployeeAccount,
  createEmployeePassword,
};
