const inquirer = require("inquirer");
const mysql = require("mysql2");
// formats response from db
const ctable = require("console.table");
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "MyN3wP4ssw0rd",
    database: "CMS_db",
  },
  console.log(`Connected to the books_db database.`)
);
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
      console.log(db.employee);
    } else if (SelectedOption == "View All Departments") {
      getdepartment();
    } else if (SelectedOption == "View All Roles") {
      console.log(db.role);
    } else if (SelectedOption == "Add Employee") {
      console.log("not yet");
    } else if (SelectedOption == "Update Employee Role") {
      console.log("not yet");
    } else if (SelectedOption == "Add Role") {
      console.log("not yet");
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

function getdepartment() {
  db.query("SELECT name FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
  });
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
        `INSERT INTO department SET name =? `,
        [input.departname],
        (err, res) => {
          if (err) throw err;
          getdepartment();
        }
      );
    });
}
