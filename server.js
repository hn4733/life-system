// Imports
const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({dialect: 'sqlite', storage: './db/database.sqlite', logging: false});
const schedule = require('node-schedule');
const qs = require('qs');
const axios = require('axios');

// Test database connection
try {
    sequelize.authenticate().then(() => console.log('Connection to database has been successful'));
} catch (error) {
    console.log('\x1b[31m', 'Unable to connect to database', '\x1b[0m', error);
}

// Define express app
const app = express();

// Express config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Database Setup
const Todo = require('./db/models/Todo')(sequelize, DataTypes); // Defines the table
Todo.sync({alter: true}).then(() => console.log('Todo model synced')); // Syncs table to database

const Homework = require('./db/models/Homework')(sequelize, DataTypes); // Defines the table
Homework.sync({alter: true}).then(() => {
    console.log('Homework model synced')
    sendNotification().then(() => console.log('Notifs sent'));
}); // Syncs table to database

const sendNotification = async () => {
    let homework = await Homework.findAll();
    if (homework.length > 0) {
        for (let i = 0; i < homework.length; i++) {
            axios({
                method: "post",
                url: "",
                data: qs.stringify({
                    app_key: "QlEb5FF9JliSHpnW2SzX",
                    app_secret: "WvsXjK0oE4hD4ACPjSSkGzkIvRtooHjBexWcvl1qdL4yGjyFUFgUuCpIuIGMRb1z",
                    content: "You have " + homework[i].subject + " to do. Due in " + formatDate(homework[i].due) + "!",
                    target_type: 'app',
                    target_alias: 'TheTaskList'
                }),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
        }
    }
}



// Express routes
app.get('/', (req, res) => {
    res.render('index');
});
// Tasks Routes
app.get('/todo', async (req, res) => {
    let tasks = await Todo.findAll();
    res.render('todo/index', {tasks: tasks});
});
app.get('/todo/new', (req, res) => {
    res.render('todo/new');
});
app.get('/todo/delete/:id', (req, res) => {
    Todo.destroy({
        where: {
            id: req.params.id
        }
    });
    res.redirect('/todo');
});
// Homework routes
app.get('/homework', async (req, res) => {
    let homework = await Homework.findAll();
    res.render('homework/index', {homework: homework});
});
app.get('/homework/new', (req, res) => {
    res.render('homework/new');
});
app.get('/homework/delete/:id', (req, res) => {
    Homework.destroy({
        where: {
            id: req.params.id
        }
    });
    res.redirect('/homework');
});
// Post requests
app.post('/todo/add', (req, res) => {
    Todo.create({
        title: req.body.title,
        description: req.body.description,
        due: req.body.due
    }).then(() => console.log("Added new \"" + req.body.subject + "\"" + "homework"));
    res.redirect('/todo');
});
app.post('/homework/add', (req, res) => {
    Homework.create({
        subject: req.body.subject,
        description: req.body.description,
        location: req.body.location,
        due: req.body.due
    }).then(() => console.log("Added new homework with title \"" + req.body.title + "\""));
    res.redirect('/homework');
});

// Test route
app.get('/test', (req, res) => {
    res.json({message: 'Passed!'});
});

function formatDate(date) {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear()) {
        return "today";
    } else if (date.getDate() == tomorrow.getDate() &&
        date.getMonth() == tomorrow.getMonth() &&
        date.getFullYear() == tomorrow.getFullYear()) {
        return "tomorrow";
    } else {
        return [date.getDay(), date.getMonth() + 1, date.getFullYear()].join('-');
    }
}

var j = schedule.scheduleJob('1 6,18,20 * * *', () => {
        sendNotification().then(() => console.log('Sent notifications'));
        return;
});

// Tell express to listen on port 3000
module.exports = app;
