const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { updateQuery, selectQuery, insertQuery } = require('./helpers/functions.js');

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
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
            name: 'answer'
        }
    ]);
    let q;
    switch(querySelector.answer) {
        case 'View All Employees':
            q = selectQuery('employee');
            db.query(q, (err, results) => console.log(results));
            break;
        case 'Add Employee':
            const data = await addEmployee();
            q = insertQuery('employee', 'first_name, last_name, role_id, manager_id', data);
            console.log(q);
            db.query(q, (err, results) => err ? console.log(err) : console.log(results));
    }
}

async function addEmployee() {
    const data = await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the employees first name.',
            name: 'firstName'
        },
        {
            type: 'input',
            message: 'Enter the employees last name.',
            name: 'lastName'
        },
        {
            type: 'number',
            message: 'Enter the employees role ID.',
            name: 'roleId'
        },
        {
            type: 'number',
            message: 'Enter the employees manager ID (0 if they have none).',
            name: 'managerId'
        }
    ]);
    const dataArr = [`'${data.firstName}'`, `'${data.lastName}'`, data.roleId, data.managerId];
    if (dataArr[3] === 0) {
        dataArr[3] = 'NULL';
    }
    console.log(dataArr);
    return dataArr;
}


init();