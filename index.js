const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { viewAllEmployees, viewAllDepartments, viewAllRoles, addEmployee, addRole, addDepartment, updateEmployee } = require('./helpers/functions.js');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'zach1234',
        database: 'employees'
    },
    console.log('Connected to the employees database.')
);

async function init() {
    const querySelector = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
            name: 'answer'
        }
    ]);
    let q;
    let query;
    let data;
    switch(querySelector.answer) {
        case 'View All Employees':
            q = viewAllEmployees();
            db.query(q, (err, results) => err ? console.log(err) : console.table('Employees', results));
            break;
        case 'View All Departments':
            q = viewAllDepartments();
            db.query(q, (err, results) => err ? console.log(err) : console.table('Departments', results));
            break;
        case 'View All Roles':
            q = viewAllRoles();
            db.query(q, (err, results) => err ? console.log(err) : console.table('Roles', results));
            break;
        case 'Add Employee':
            q = await addEmployee();
            ({ query, data } = q);
            db.query(query, data, (err, results) => err ? console.log(err) : console.log('Employee Added.'));
            break;
        case 'Add Role':
            q = await addRole();
            ({ query, data } = q);
            db.query(query, data, (err, results) => err ? console.log(err) : console.log('Role Added.'));
            break;
        case 'Add Department':
            q = await addDepartment();
            ({ query, data } = q);
            db.query(query, data, (err, results) => err ? console.log(err) : console.log('Department Added.'));
            break;
        case 'Update Employee Role':
            const getEmployees = viewAllEmployees();
            const employees = await db.promise().query(getEmployees);
            const employeesList = employees[0].map(e => `${e.first_name} ${e.last_name}`);
            const selection = await inquirer.prompt([
                {
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    choices: employeesList,
                    name: 'employee'
                }
            ]);
            q = await updateEmployee(selection.employee);
            ({ query, data } = q);
            const nameArr = selection.employee.split(' ');
            db.query(query, [data, nameArr[0], nameArr[1]], (err, results) => err ? console.log(err) : console.log('Employee Updated.'));
    }
}


init();