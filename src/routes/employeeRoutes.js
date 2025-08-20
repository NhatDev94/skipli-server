const express = require("express");
const {
  getEmployees,
  createEmployee,
  editEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

// Admin
router.get("/employees", getEmployees);
router.post("/create", createEmployee);
router.post("/edit", editEmployee);
router.post("/delete", deleteEmployee);

module.exports = router;
