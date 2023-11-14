const inquirer = require("inquirer");
const mysql = require("mysql2");
// formats response from db
const ctable = require("console.table");
const db = mysql
  .createConnection(
    {
      host: "localhost",
      user: "root",
      password: "MyN3wP4ssw0rd",
      database: "CMS_db",
    },
    console.log(`Connected to the cms_db database.`)
  )
  .promise();
function startpage() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Selected",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Departments",
        ],
      },
    ])
    .then((answer) => {
      const SelectedOption = answer.Selected;
      if (SelectedOption == "View All Employees") {
        getemployee();
      } else if (SelectedOption == "View All Departments") {
        getdepartment();
      } else if (SelectedOption == "View All Roles") {
        getrole();
      } else if (SelectedOption == "Add Employee") {
        addEmployee();
      } else if (SelectedOption == "Update Employee Role") {
        console.log("not yet");
      } else if (SelectedOption == "Add Role") {
        addRole();
      } else if (SelectedOption == "Add Departments") {
        addDepartment();
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldn't be rendered in the current environment");
      } else {
        console.error(error);
      }
    });
}
async function getdepartment() {
  const [results] = await db.query("SELECT name FROM department");
  const departmentNames = results.map((row) => row.name);
  console.log(departmentNames);
  startpage();
}

async function getrole() {
  const results = await db.query("SELECT title FROM role");
  const roleNames = results.map((row) => row.name);
  console.log(roleNames);
  startpage();
}

async function getemployee() {
  const results = await db.query("SELECT first_name FROM employee");
  const employeeNames = results.map((row) => row.name);
  console.log(employeeNames);
  startpage();
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departname",
        message: "What is the name of your new department?",
      },
    ])
    .then((input) => {
      db.query(
        "INSERT INTO department SET name =?",
        [input.departname],
        (err, res) => {
          if (err) throw err;
        }
      );
      startpage();
    });
}

async function addRole() {
  const input = await inquirer.prompt([
    {
      type: "input",
      name: "roleTitle",
      message: "What is the title of the new role?",
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the salary of the new role?",
    },
    {
      type: "input",
      name: "departmentName",
      message: "Enter the department name:",
    },
  ]);
  const [departquery] = await db.query(
    "SELECT id FROM department WHERE name = ?",
    [input.departmentName]
  );
  department_id = departquery[0].id;

  const [result] = await db.query(
    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
    [input.roleTitle, input.roleSalary, department_id]
  );

  console.log("Role added successfully");
  startpage();
}

async function addEmployee() {
  const input = await inquirer.prompt([
    {
      type: "input",
      name: "employeeFirstName",
      message: "What is your firstname?",
    },
    {
      type: "input",
      name: "employeeLastName",
      message: "What is your lastname?",
    },
    {
      type: "input",
      name: "roleName",
      message: "Enter the title of your role",
    },
    {
      type: "input",
      name: "managerName",
      message: "Enter the first name of your manager",
    },
  ]);
  const [Role] = await db.query("SELECT id FROM role WHERE title = ?", [
    input.roleName,
  ]);
  const role_id = Role[0].id;

  const [Manager] = await db.query(
    "SELECT id FROM employee WHERE first_name = ?",
    [input.managerName]
  );
  const manager_id = Manager[0].id;

  const [result] = await db.query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
    [input.employeeFirstName, input.employeeLastName, role_id, manager_id]
  );

  console.log("Role added successfully", result);
  startpage();
}

startpage();
