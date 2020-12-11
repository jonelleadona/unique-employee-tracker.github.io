const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "MiloBoy123!",
  database: "unique_employee_tracker_db"
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
  })
  .then(function(answer) {
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

// Adds departments
function addDepartment() {
  inquirer.prompt({
    name: "newDepartment",
    type: "input",
    message: "What is the department name that is being added?",
  }).then(function(answer) {
    connection.query("INSERT INTO department SET?", {name: answer.newDepartment},
      function(err) {
        if (err) throw err;
        console.log("Department was add");

        start();
      });
  });
}

// Adds job roles
function addRole() {
  let arrayRole = [];
  connection.query("SELECT * FROM department", function(err,res) {
    if (err) throw err;
    inquirer.prompt ([
      {
        name: "title",
        type: "input",
        message: "What is the title?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the annual salary for the given role?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
            return false;
        }
      },
      {
        name: "departmentName",
        type: "rawlist",
        choices: function() {
          for (var i=0; i < res.length; i++) {
            arrayRole.push(res[i].name);
          }
          return arrayRole;
        },
        message: "What department will this role be assigned to?",
      },
    ]).then((function(answer){
      let roleIndex = arrayRole.indexOf (answer.departmentName);
      let departmentId = res[roleIndex].id;

      connection.query(
        "INSERT INTO role SET ?",

      )
    })
  )},
)};
