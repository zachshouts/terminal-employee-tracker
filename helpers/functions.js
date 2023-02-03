const inquirer = require('inquirer');

function viewAllEmployees() {
    return `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, e.manager_id FROM employee AS e
    JOIN role AS r ON e.role_id = r.id
    JOIN department AS d ON r.department_id = d.id;`
};

function viewAllDepartments() {
    return `SELECT * FROM department;`
};

function viewAllRoles() {
    return `SELECT r.title, r.id, d.name AS department, r.salary FROM role AS r JOIN department AS d ON r.department_id = d.id;`
};

async function addEmployee() {
    const data = await inquirer.prompt([
        {
            type: 'input',
            message: "Enter the employee's first name.",
            name: 'first_name'
        },
        {
            type: 'input',
            message: "Enter the employee's last name.",
            name: 'last_name'
        },
        {
            type: 'number',
            message: "Enter the employee's role ID.",
            name: 'role_id'
        },
        {
            type: 'number',
            message: "Enter the employee's manager ID (0 for null).",
            name: 'manager_id'
        }
    ]);
    if (data.manager_id === 0) {
        data.manager_id = null;
    };
    const { first_name, last_name, role_id, manager_id } = data;
    const q = {
        query: `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
        data: [first_name, last_name, role_id, manager_id]
    };
    return q;
};

async function addRole() {
    const data = await inquirer.prompt([
        {
            type: 'input',
            message: "Enter the name of the role.",
            name: 'title'
        },
        {
            type: 'number',
            message: "Enter the new role's salary.",
            name: 'salary'
        },
        {
            type: 'number',
            message: 'Enter the department ID for the new role.',
            name: 'department_id'
        }
    ]);
    const {title, salary, department_id} = data;
    const q = {
        query: `INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?);`,
        data: [title, salary, department_id]
    };
    return q;
};

async function addDepartment() {
    const data = await inquirer.prompt([
        {
            type: 'input',
            message: "Enter the new department's name.",
            name: 'name'
        }
    ]);
    const q = {
        query: `INSERT INTO department(name) VALUES (?);`,
        data: data.name
    }
    return q;
};

async function updateEmployee(employee) {
    const data = await inquirer.prompt([
        {
            type: 'input',
            message: `Enter the new role ID for ${employee}.`,
            name: 'role_id'
        }
    ]);
    const q = {
        query: `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?;`,
        data: data.role_id
    };
    return q;
};

module.exports = {
    viewAllEmployees,
    viewAllDepartments,
    viewAllRoles,
    addEmployee,
    addRole,
    addDepartment,
    updateEmployee
};