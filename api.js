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


api.delete('/user/:id', (req, res) => {
    const id = JSON.parse(req.body);
    const users = store.getUsers();
    const deleteDone = false;

    const lastIndex = users.length - 1;
    let index = lastIndex;
    while (deleteDone || index >= 0) {
        if (users[index].id == id) {
            let temp;
            while (index != lastIndex) {
                temp = users[index];
                users[index] = users[index + 1];
                users[index + 1] = temp;
            }
            users.pop();
            deleteDone = true;
        }
        index++;
    }

    store.saveUsers()
    res.json({message : 'deleted'});
})

// api.put('user/:index', (req, res) => {

//     const newUser = req.body;
//     const users = store.getUsers();
//     users.push(newUser);

//     store.saveUsers(users);
//     res.json(users)
// })

module.exports = api