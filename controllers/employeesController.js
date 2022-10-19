const Employee = require('../models/Employee');

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find(); //will get all employees

  if (!employees) {
    return res.status(204).json({ message: 'No employees found' });
  }

  res.status(200).json(employees);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'ID is required' });
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}` });
  }

  res.staus(200).json(employee);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstName || !req?.body?.lastName) {
    return res
      .status(400) // Bad request
      .json({ message: 'First and last names are required' });
  }
  try {
    const employee = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    res
      .status(201) //created
      .json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Could not create user' });
  }
  res.status(201).json({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res
      .status(400) // Bad request
      .json({ message: 'Employee ID is required' });
  }
  /**
   * Maybe better to use Employee.findById(req.body.id)
   * MongoDB by default adds an ID with underscore - _id
   */
  const employee = Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204) // No Content
      .json({ message: `No employee matches ID ${req.body.id}` });
  }
  if (req?.body?.firstName) {
    employee.firstName = req.body.firstName;
  }

  if (req.body?.lastName) {
    employee.lastName = req.body.lastName;
  }

  const result = await employee.save();

  res.status(200).json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req.body?.id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  const employee = await Employee.findById(req.body.id).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `Employee not found for ID ${req.body.id}` });
  }
  const result = await employee.deleteOne({ _id: req.body.id }); // no need for exec() on delete
  res.status(200).json(result);
};

const deleteAllEmployees = (req, res) => {
  res.json({ id: req.body.id });
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteAllEmployees,
  deleteEmployee,
};
