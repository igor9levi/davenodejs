const express = require('express');
const router = express.Router();
// const path = require('path');
const employeeController = require('../../controllers/employeesController');

router
  .route('/')
  // Protect only particular routes by adding middleware here
  // .get(require('../../middleware/verifyJWT'), employeeController.getAllEmployees)
  .get(employeeController.getAllEmployees)
  .post(employeeController.createNewEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteAllEmployees);

router
  .route('/:id')
  .get(employeeController.getEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;
