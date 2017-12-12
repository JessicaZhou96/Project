// server side
const express = require("express")
const api = express.Router()

const store = require('./data/store')

api.get('/user', (req, res) => {
    const users = store.getUsers();
    // if request /user, response json user to client side
    res.json(users);
})

api.post('/user', (req, res) => {
    const user = req.body;
    const users = store.getUsers();

    let userId = 1

    if (users.length > 0) {
        userId = users[users.length - 1].id + 1
    }

    const newUser = {
        id: userId,
        ...user
    }

    users.push(newUser);
    store.saveUsers(users);

    res.json(users)
})

// api.put('user/:index', (req, res) => {

//     const newUser = req.body;
//     const users = store.getUsers();
//     users.push(newUser);

//     store.saveUsers(users);
//     res.json(users)
// })

module.exports = api