// server side
const express = require("express")
const api = express.Router()

const store = require('./data/store')

api.get('/user', (req, res) => {
    const users = store.getUsers();
    // if request /user, response json user to client side
    res.json(users);
})

api.post('/user/index', (req, res) => {
    const users = store.getUsers();
    const user = req.body;
    let userWithId;

    for (let i = users.length - 1; i >= 0; i--) {
        if (users[i].name == user.name &&
            users[i].email == user.email &&
            users[i].phone == user.phone) 
        {
            userWithId = users[i];
            res.json(JSON.stringify(userWithId));
        }
    }
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
    console.log(req.params.id)
    const id = req.params.id;
    let users = store.getUsers();
    let deleteDone = false;

    let lastIndex = users.length - 1;
    let index = lastIndex;
    while (!deleteDone && index >= 0) {
        if (users[index].id == id) {
            let temp;
            while (index != lastIndex) {
                temp = users[index];
                users[index] = users[index + 1];
                users[index + 1] = temp;
                index++;
            }
            users.pop();
            deleteDone = true;
            console.log("done")
        }
        console.log(`${index}`);
        index--;
    }

    store.saveUsers(users)
    res.json(users);
})



// api.put('user/:index', (req, res) => {

//     const newUser = req.body;
//     const users = store.getUsers();
//     users.push(newUser);

//     store.saveUsers(users);
//     res.json(users)
// })

module.exports = api