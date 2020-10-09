// Imports
const express = require('express');
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({dialect: 'sqlite', storage: './db/database.sqlite'});

// Test database connection
try {
    sequelize.authenticate().then(() => console.log('\x1b[32m', 'Connection to database has been successful', '\x1b[0m'));
} catch (error) {
    console.log('\x1b[31m', 'Unable to connect to database', '\x1b[0m', error);
}

// Define express app
const app = express();

// Express config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Database Setup
const Todo = require('./db/models/Todo')(sequelize, DataTypes);
Todo.sync({alter: true}).then(() => console.log('All models synced'))

// Express routes
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/todo', (req, res) => {
    res.render('todo');
});
// TODO: Add todo:id or todo:slug to routes

// Tell express to listen on port 3000
app.listen(3000, console.log("App listening on 3000"));
