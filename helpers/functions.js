const inquirer = require('inquirer');

function updateQuery(table, data) {
    const query = `UPDATE ${table} `
}

function selectQuery(table) {
    const query = `SELECT * FROM ${table};`;
    return query;
}

function insertQuery(table, columns, data) {
    const query = `INSERT INTO ${table}(${columns}) VALUES (${data.join(',')});`
    return query;
}


module.exports = {
    updateQuery,
    selectQuery,
    insertQuery
};