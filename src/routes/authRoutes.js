const express = require("express");
const {
  phoneValidate,
  signIn,
  resendCode,
  resendEmailValidate,
  validateTokenEmployeeAccount,
  createEmployeePassword,
} = require("../controllers/authController");

const router = express.Router();

// Admin
router.post("/phone-validate", phoneValidate);

router.post("/sign-in", signIn);
router.post("/resend-code", resendCode);

router.post("/employee-validate", validateTokenEmployeeAccount);
router.post("/resend-email-validate", resendEmailValidate);
router.post("/employee-password", createEmployeePassword);

module.exports = router;
