const { db } = require("../config/firebase");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../config/sendEmail");

const getEmployees = async (req, res) => {
  const userRef = db.collection("users");
  const snapshot = await userRef.where("role", "==", "employee").get();
  let employees = [];
  snapshot.forEach((doc) => {
    employees.push(doc.data());
  });
  return res.status(200).json({
    success: true,
    data: {
      employees,
    },
  });
};

const sendUrlActive = async (employee) => {
  const payload = {
    phoneNumber: employee.phoneNumber,
    email: employee.email,
    name: employee.name,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "2h",
  });

  // luu token vao db
  const employeeTokens = db.collection("employeeTokens");
  employeeTokens.doc(employee.phoneNumber).set({ token });
  // send to email
  sendEmail(
    "nhatdev94@gmail.com",
    "Xác thực tài khoản",
    "Đây là nội dung email thuần văn bản.",
    `<p>Chào ${employee.name},</p>
    <p>Bạn vừa được tạo tài khoản trên hệ thống của chúng tôi.</p>
    <p>Vui lòng nhấn vào link dưới đây để xác thực tài khoản của bạn:</p>
    <p><a href="http://localhost:5173/account-setup?token=${token}&phoneNumber=${employee.phoneNumber}" target="_blank">Xác thực tài khoản</a></p>
    <p>Nếu bạn không yêu cầu tạo tài khoản này, vui lòng bỏ qua email.</p>
    <p>Trân trọng, <br/>NhatLe</p>`
  );
};

const createChatRoom = (employeePhone) => {
  const roomRef = db.collection("chatRooms").doc(employeePhone);
  roomRef.set({});
};

const createEmployee = async (req, res) => {
  const { employee } = req.body;

  const employeeRef = db.collection("users");
  const snapshot = await employeeRef
    .where("phoneNumber", "==", employee.phoneNumber)
    .get();
  if (snapshot.empty) {
    await employeeRef.doc(employee.phoneNumber).set(employee);
    // send url verify email
    await sendUrlActive(employee);

    createChatRoom(employee.phoneNumber);

    return res.status(200).json({
      success: true,
      message: "Create employee successfully.",
      data: {
        employee,
      },
    });
  }
  res.status(200).json({
    success: true,
    message: "Phone number already has an account.",
    data: null,
  });
};

const editEmployee = async (req, res) => {
  const { employee, oldPhoneNumber } = req.body;
  const usersRef = db.collection("users");
  if (employee.phoneNumber === oldPhoneNumber) {
    await usersRef.doc(oldPhoneNumber).set(employee);
    return res.status(200).json({
      success: true,
      message: "Edit employee successfully.",
      data: {
        employee,
      },
    });
  }

  const snapshot = await usersRef
    .where("phoneNumber", "==", employee.phoneNumber)
    .get();
  if (!snapshot.empty) {
    return res.status(200).json({
      success: true,
      message: "Phone number already has an account.",
      data: null,
    });
  }
  // remove old phone
  // create new
  await usersRef.doc(oldPhoneNumber).delete();
  await usersRef.doc(employee.phoneNumber).set(employee);

  // delete old chat room
  const chatRooms = db.collection("chatRooms").doc(oldPhoneNumber);
  await chatRooms.delete();

  return res.status(200).json({
    success: true,
    message: "Edit employee successfully.",
    data: employee,
  });
};

const deleteEmployee = async (req, res) => {
  const { phoneNumber } = req.body;
  const usersRef = db.collection("users");
  usersRef.doc(phoneNumber).delete();

  // neu accout chua active -> xoa token active
  const tokenRef = db.collection("employeeTokens").doc(phoneNumber);
  await tokenRef.delete();

  // xoa chat room
  const chatRoomRef = db.collection("chatRooms").doc(phoneNumber);
  await chatRoomRef.delete();

  return res.status(200).json({
    success: true,
    message: "Delete employee successfully.",
    data: {},
  });
};

module.exports = {
  createEmployee,
  getEmployees,
  editEmployee,
  deleteEmployee,
  sendUrlActive,
};
