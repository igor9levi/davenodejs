const data = {
  employees: [{ id: 1, name: 'Dave', lastName: 'Gray' }],
};

const getAllEmployees = (req, res) => {
  res.status(200).json(data.employees);
};

const getEmployee = (req, res) => {
  res.staus(200).json({ id: req.body.id });
};

const createNewEmployee = (req, res) => {
  res.status(201).json({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
};

const updateEmployee = (req, res) => {
  res.json({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
};

const deleteEmployee = (req, res) => {
  res.json({ id: req.body.id });
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
