// Express - Back end web application framework
var express = require("express");
var app = express();

var path = require("path");

// Parses incoming request bodies
var bodyParser = require('body-parser');

// MongoDB connection
var MongoClient = require('mongodb').MongoClient;

// MySQL connection
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegedb'
  })

connection.connect();

// Array to store lecturers
var lecturers = [];

// Middleware function (Is run first)
app.use(bodyParser.urlencoded({extended: false}))

// Connect to MongoDB
MongoClient.connect('mongodb://localhost:27017/lecturersDB', function (err, client) {
    if (err) throw err

    var db = client.db('lecturersDB')

    db.collection('lecturers').find().toArray(function (err, result) {
        if (err) throw err

        // Initialise lecturers array 
        lecturers = result;

        // Output to console
        console.log(lecturers);
        
        // Close connection to MongoDB server
        client.close();
    })

    // Listening to requests received through port 3004
    app.listen(3004, () => {
        console.log("App running on port 3004");
    })

    // Responds to client request from '/' and redirects to '/home'
    app.get('/', (req, res) => {
        res.redirect("/lecturers");
    })
    
    // Responds to client request from'/lecturers' with array of employees
    app.get('/lecturers', (req, res) => {
        res.send(lecturers);
    })

    // Responds to client request from'/lecturers' with array of employees
    app.get('/modules', (req, res) => {
       
        connection.query('select * from module', function (err, rows, fields) {
            if (err) throw err
          
            console.log(rows)
          })
          
          connection.end();
       
       
        res.send(lecturers);
    })
})