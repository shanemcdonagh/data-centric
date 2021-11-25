// Express - Back end web application framework
var express = require("express");
var app = express();

// EJS - Templating language that uses JavaScript syntax
var ejs = require('ejs');
app.set('view engine','ejs');

// Import mySQL DAO file 
var mysql = require("./mysqlDAO");

// Listening for connections to port 3000
app.listen(3000, () =>{

    console.log("Listening on port 3000")
})

// Listens for get request to '/'
app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/home.html")
})

// // Listens for get request to '/students'
app.get('/students', (req,res)=>{
    
    // Invoke function from DAO
    mysql.retrieveStudents()
    .then((data) => {
        // Pass retrieved data to students.ejs as 'students'
        res.render("listStudents",{students: data});
    })
    .catch((error) => {
        res.send('Error while retrieving students');
    })
})

// // Listens for get request to '/students'
app.get('/modules', (req,res)=>{
    
    // Invoke function from DAO
    mysql.retrieveModules()
    .then((data) => {
        // Pass retrieved data to module.ejs as 'module'
        res.render("listModules",{modules: data});
    })
    .catch((error) => {
        res.send('Error while retrieving modules');
    })
})
