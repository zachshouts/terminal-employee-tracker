const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();
const { viewAllEmployees, viewAllDepartments, viewAllRoles, addEmployee, addRole, addDepartment, updateEmployee, getManagersQuery } = require('./helpers/functions.js');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
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
            const getManagers = getManagersQuery();
            const managers = await db.promise().query(getManagers);
            const managerList = managers[0].map(m => m.name);
            const managerIds = managers[0].map(m => m.id);
            const getRoles = viewAllRoles();
            const roles = await db.promise().query(getRoles);
            const rolesList = roles[0].map(r => r.title);
            const rolesIds = roles[0]. map(r => r.id);
            q = await addEmployee(rolesList, rolesIds, managerList, managerIds);
            ({ query, data } = q);
            db.query(query, data, (err, results) => err ? console.log(err) : console.log('Employee Added.'));
            break;
        case 'Add Role':
            const getDepartments = viewAllDepartments();
            const departments = await db.promise().query(getDepartments);
            const departmentsList = departments[0].map(d => d.name);
            const departmentsIds = departments[0].map(d => d.id);
            q = await addRole(departmentsList, departmentsIds);
            ({ query, data } = q);
            db.query(query, data, (err, results) => err ? console.log(err) : console.log('Role Added.'));
            break;
        case 'Add Department':
            q = await addDepartment();
            ({ query, data } = q);
            db.query(query, data, (err, results) => err ? console.log(err) : console.log('Department Added.'));
            break;
        case 'Update Employee Role':
            const acquireRoles = viewAllRoles();
            const roleQuery = await db.promise().query(acquireRoles);
            const roleList = roleQuery[0].map(r => r.title);
            const roleIds = roleQuery[0].map(r => r.id);
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
            q = await updateEmployee(selection.employee, roleList, roleIds);
            ({ query, data } = q);
            const nameArr = selection.employee.split(' ');
            db.query(query, [data, nameArr[0], nameArr[1]], (err, results) => err ? console.log(err) : console.log('Employee Updated.'));
            break;
        case 'Quit':
            process.exit();
    }
    
}


init();