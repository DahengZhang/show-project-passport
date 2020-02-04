const mysql = require('mysql')
const { getArgv } = require('../config/util')

module.exports = mysql.createConnection({
    host: '111.231.93.160',
    user: 'root',
    password: getArgv('password'),
    database: 'passport'
})
