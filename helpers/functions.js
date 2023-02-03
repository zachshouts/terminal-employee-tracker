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

function getManagersQuery() {
    return `SELECT e.id, concat(e.first_name,' ',e.last_name) AS name FROM employee AS e JOIN role ON e.role_id = role.id WHERE role.title LIKE '%Manager%';`
}

async function addEmployee(roles, roleIds, managers, managerIds) {
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
            type: 'list',
            message: "Select the employee's role.",
            choices: roles,
            name: 'role_id'
        },
        {
            type: 'list',
            message: "Select the employee's manager.",
            choices: [...managers, 'None'],
            name: 'manager_id'
        }
    ]);
    if (data.manager_id === 'None') {
        data.manager_id = null;
    } else {
        const managerInd = managers.findIndex(m => m === data.manager_id);
        data.manager_id = managerIds[managerInd];
    }
    const roleIndex = roles.findIndex(e => e === data.role_id);
    data.role_id = roleIds[roleIndex];
    const { first_name, last_name, role_id, manager_id } = data;
    const q = {
        query: `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
        data: [first_name, last_name, role_id, manager_id]
    };
    return q;
};

async function addRole(departments, ids) {
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
            type: 'list',
            message: 'Select the department for the new role.',
            choices: departments,
            name: 'department_id'
        }
    ]);
    const departmentIndex = departments.findIndex(e => e === data.department_id);
    data.department_id = ids[departmentIndex];
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

async function updateEmployee(employee, roles, roleIds) {
    const data = await inquirer.prompt([
        {
            type: 'list',
            message: `Select the new role ID for ${employee}.`,
            choices: roles,
            name: 'role_id'
        }
    ]);
    const roleIndex = roles.findIndex(e => e === data.role_id);
    data.role_id = roleIds[roleIndex];
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
    updateEmployee,
    getManagersQuery
};