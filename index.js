// Express - Back end web application framework
var express = require("express");
var app = express();

// EJS - Templating language that uses JavaScript syntax
var ejs = require('ejs');
app.set('view engine','ejs');

// Import mySQL DAO file 
var mysql = require("./mysqlDAO");

// Used to ensure valid data is being entered by the user
const { check, validationResult} = require('express-validator');

// Parses incoming req bodies
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))


// Listening for connections to port 3000
app.listen(3004, () =>{

    console.log("Listening on port 3004")
})


// Listens for get request from '/'
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


// Listens for get request to '/students'
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


// Listens for get request to 'module/edit'
app.get('/module/edit/:mid',(req,res) => {
    
    // Invoke function from DAO and pass in value of paramater mid
    mysql.retrieveModule(req.params.mid)
    .then((data) => {

        // If user manually enters url parameter, which is incorrect
        if(data.length == 0)
        {
            res.send("<h1>No such module with id = " + req.params.mid + "</h1>")
        }
        else
        {
            // Pass retrieved data to editModule.ejs
            res.render("editModule",{errors: undefined, module: data[0]});
        }
           
    })
    .catch((error) => {
        // Send error response
        res.send("Error while retrieving specified module");
    })

    // Listens for post request to "/module/edit/:mid"
    app.post("/module/edit/:mid",
    [
        // Middleware function to run before module is updated (CONDITIONS)
        check('name').isLength({min:5}).withMessage("Module Name must be at least 5 characters"),
        check('credits').isIn([5,10,15]).withMessage("Credits can be either 5, 10, 15")

    ],
    (req,res)=>{

        // Retrieve list of errors..
        var errors = validationResult(req);

        // // If there was errors encountered..
        if(!errors.isEmpty())
        {
            // Reload the edit module page with list of errors
            res.render('editModule', {errors: errors.errors, module: req.body});
        }
        else
        {
            // Call to update module based on values entered
            mysql.updateModule(req.body.name, req.body.credits, req.body.mid)
            .then((data) => {

                // Re-direct user back to the modules page (containing updated values)
                res.redirect('/modules');    
            })
            .catch((error) => {

                // Log error in console
                res.send("<h1>Cannot update module</h1>")
            })
        }
    }
    ) 
})


// Listens for get request to 'module/students'
app.get('/module/students/:mid', (req,res)=>{

   // Invoke function from DAO to retrieve all students studying the requested module
   mysql.studyingModule(req.params.mid)
   .then((data) => {

       // If successful, render page of those students and pass in the data retrieved from the database
       res.render("listStudying",{mid: req.params.mid, students: data})
   })
   .catch((error) => {
    
    // Else, notify user of error
    res.send("Cannot retrieve list of students studying " + req.params.mid);
})
})
