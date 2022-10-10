const express = require('express');
const router = express.Router();
// const path = require('path');
const employeeController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles');
const verifyRoles = require('../../middleware/verifyRoles');

router
  .route('/')
  // Protect only particular routes by adding middleware here
  // .get(require('../../middleware/verifyJWT'), employeeController.getAllEmployees)
  .get(employeeController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),
    employeeController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),
    employeeController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.admin), employeeController.deleteAllEmployees);

router
  .route('/:id')
  .get(employeeController.getEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;
