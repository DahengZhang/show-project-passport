const connection = require('./mysql')

const findUserById = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users;`, (error, results) => {
            if (error) {
                reject(error)
            }
            if (results.length <= 0) {
                resolve(false)
            }
            resolve(results[0])
        })
    })
}

const insertUser = ({ uuid, name, email, avatar }) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO users (uuid, name, email, avatar) VALUES (${uuid}, ${name}, ${email}, ${avatar})`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve({uuid, name, email, avatar})
        })
    })
}

const updateUser = ({ uuid, name, email, avatar }) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE users SET name=${name}, email=${email}, avatar=${avatar} WHERE uuid=${uuid}`, (error, results) => {
            if (error) {
                reject(error)
            }
            resolve({uuid, name, email, avatar})
        })
    })
}

module.exports = {
    findUserById,
    insertUser,
    updateUser
}
