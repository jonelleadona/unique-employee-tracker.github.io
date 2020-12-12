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
  const departmentArray = [];
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
            departmentArray.push(res[i].name);
          }
          return departmentArray;
        },
        message: "What department will this role be assigned to?",
      },
    ]).then((function(answer){
      const roleIndex = departmentArray.indexOf (answer.departmentName);
      const departmentId = res[roleIndex].id;

      connection.query(
        "INSERT INTO role SET ?", {
          title: answer.title,
          salary: answer.salary,
          department_id: departmentId,
        },
        function(err){
          if (err) throw err;
          console.log("Role was added");

          start();
        }
      )
    })
  )}
)};

// Adds employee info
function addEmployee() {
  const employeeRoleArray = []; 
  connection.query ("SELECT * FROM role", function(err,res){
    if (err) throw err;
    inquirer.prompt ([
      {
        name: "firstName",
        type: "input",
        message: "What is the employees's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "rawlist",
        choices: function() {
          for (var i=0; i < res.length; i++) {
            employeeRoleArray.push(res[i].title);
          }
          return employeeRoleArray;
        },
        message: "What is the employee's job role?",
      },
    ]).then (function(answer){
      const firstName = answer.firstName;
      const lastName = answer.lastName;
      const roleIndex = employeeRoleArray.indexOf (answer.role);
      const employeeRole = res[roleIndex].id;
      
      const managerArray = ["NA"];

      connection.query("SELECT * FROM employee", function(err,res){
        if(err) throw err;
        inquirer.prompt([
          {
            name: "manager",
            type: "rawlist",
            choices: function(){
              for (var i = 0; i < res.length; i++) {
                managerArray.push(res[i].first_name, res[i].last_name);
              }
              return managerArray;
            },
            message: "Who is the employee's manager?"
          },
        ]).then (function(answer){
          if (answer.manager === "NA") {
            const managerId = null;
            insertEmployee(firstName, lastName, employeeRole, managerId);
          } else {
            const managerIndex = managerArray.indexOf(answer.manager);
            const managerId = res[managerIndex].id;
            insertEmployee(firstName, lastName, employeeRole, managerId);
          }
        })
      });
    })
  });
}

function insertEmployee (firstName,lastName,role,managerId){
  connection.query(
    "INSERT INTO employee SET ?",
    {
        first_name: firstName,
        last_name: lastName,
        role_id: role,
        manager_id: managerId,
    },
    (err) => {
        if (err) throw err;
        console.log("Employee added");

        start();
    }
  );
}