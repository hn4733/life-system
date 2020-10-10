// Imports
const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({dialect: 'sqlite', storage: './db/database.sqlite', logging: false});

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
Todo.sync({alter: true}).then(() => console.log('All models synced')); // Syncs table to database

// Express routes
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/todo', async (req, res) => {
    let tasks = await Todo.findAll();
    res.render('todo/index', {tasks:tasks});
});
app.get('/todo/new', (req, res) => {
    res.render('todo/new');
});
// TODO: Add todo:id or todo:slug to routes
app.get('/todo/delete/:id', (req,res) => {
   Todo.destroy({
       where: {
           id: req.params.id
       }
   });
   res.redirect('/todo');
});
// Post requests
app.post('/todo/add', (req, res) => {
    Todo.create({
        title: req.body.title,
        description: req.body.description,
        due: req.body.due
    }).then(() => console.log("Added new todo with title \"" + req.body.title + "\""));
    res.redirect(201, '/todo');
});

// Test route
app.get('/test', (req,res) => {
    res.json({message: 'Passed!'});
})

// Tell express to listen on port 3000
module.exports = app;
