const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "unique_employee_tracker_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer.prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
      "Add a department",
      "Add a job role",
      "Add an employee",
      "View departments",
      "View roles",
      "View employees",
      "Update employee roles"
    ]
  }).then(function(answer) {
    switch (answer.action) {
      case "Add a department":
        addDepartment();
        break;
      
      case "Add a job role":
        addRole();
        break;
      
      case "Add an employee":
        addEmployee();
        break;
      
      case "View all departments":
        viewDepartments();
        break;
      
      case "View all roles":
        viewRoles();
        break;
      
      case "View all employees":
        viewEmployees();
        break; 
      
      case "Update employee roles":
        updateRoles();
        break;
    }
  });
}