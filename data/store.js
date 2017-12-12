// server side
const fs = require('fs');
const path = require('path')

// create a json file named user_data
const filename = path.resolve(__dirname, 'users_data.json');


function getUsers() {
    // sync
    try {
        const content = fs.readFileSync(filename)
        // 拿到json, return array, need parse
        return JSON.parse(content)
    } catch (err) {
        // if file is empty
        if (err.code === 'ENOENT') {
            console.log('file not exists')
            return []
        } else {
            console.log(err)
            throw err
        }
    }
}


function saveUsers(users) {
    // make it string so can store
    fs.writeFileSync(filename, JSON.stringify(users));
}

module.exports = { getUsers, saveUsers }