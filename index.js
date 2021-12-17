// Express - Back end web application framework
var express = require("express");
var app = express();

// EJS - Templating language that uses JavaScript syntax
var ejs = require('ejs');
app.set('view engine', 'ejs');

// Import mySQL DAO and Mongo DAO files for usage of their functions/queries
var mysql = require("./mysqlDAO");
var mongo = require("./mongoDAO");

// Express-Validator - Used to ensure valid data is being entered by the user
const { check, validationResult } = require('express-validator');

// BodyParser - Parses incoming data values from requests (req body)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))


// Listening for connections to port 3004
app.listen(3004, () => {
    // Note in console
    console.log("Listening on port 3004")
})

// Listens for GET request from '/'
app.get('/', (req, res) => {
    // Re-directs to a html page
    res.sendFile(__dirname + "/home.html")
})

// MYSQL DATABASE REQUEST HANDLING
// -------------------------------


// Listens for GET request to '/students'
app.get('/students', (req, res) => {

    // Invoke function from mysqlDAO (Retrieve list of students within table)
    mysql.retrieveStudents()
        .then((data) => {
            // Pass retrieved data to listStudents.ejs as 'students'
            res.render("listStudents", { students: data });
        })
        .catch((error) => {
            // Else, log error to screen (Server can't access the local database)
            res.send('<h1>Error while retrieving students, ensure MySQL database is in use/exists</h1> <p><a href="/">Home</p>');
        })
})

// Listens for GET request to '/students/delete/:sid' (from listStudents.ejs)
app.get('/students/delete/:sid', (req, res) => {

    // Invoke function from mysqlDAO (Remove student record based off student ID)
    mysql.deleteStudent(req.params.sid)
        .then((data) => {
            // If the user manually enters url parameter, which is incorrect
            if (data.length == 0) {
                res.send('<h1>No such student with id = ' + req.params.sid + '</h1> <p><a href="/">Home</p>')
            }
            else {
                // If successful, return to student page
                res.redirect("/students");
            }
        })
        .catch((error) => {
            // Else, send an error onscreen (MYSQL error)
            res.send('<h1>Error: ' + req.params.sid + ' has associated modules, student cannot be deleted</h1> <p><a href="/">Home</p>');
        })
})

// Listens for GET request to '/addStudent'
app.get('/addStudent', (req, res) => {
    // Render the addStudent Page (no errors and empty fields)
    res.render("addStudent", { errors: undefined, sid: undefined, name: undefined, gpa: undefined });
})

// Listens for POST request to '/addStudent' (from addStudent.ejs)
app.post('/addStudent',
    [
        // Middleware function to run before module is updated (CONDITIONS)
        check('sid').isLength({ min: 4 }).withMessage("Student ID must be 4 characters"),
        check('name').isLength({ min: 5 }).withMessage("Name must be atleast 5 characters"),
        check('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage("GPA must be between 0.0 & 4.0")
    ],
    (req, res) => {

        // Retrieve list of errors, if any (based on conditions)
        var errors = validationResult(req);

        // If there was errors encountered..
        if (!errors.isEmpty()) {
            // Reload the addStudent page with list of errors and pass in previously entered values
            res.render('addStudent', { errors: errors.errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa });
        }
        else {
            // Invoke function from mysqlDAO (Add the new student record to the 'student' table)
            mysql.addStudent(req.body)
                .then((data) => {
                    // If successful, return to student page
                    res.redirect("/students");
                })
                .catch((error) => {
                    // Error that is not from defined conditions but from MySQL

                    // Create object based on error message
                    err = { msg: "Error: " + error.message };

                    // Add to list of errors (only one)
                    errors = [];
                    errors.push(err);

                    // Reload the addStudent page with the error list and pass in previously entered values
                    res.render('addStudent', { errors: errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa });
                })
        }
    })

// Listens for GET request to '/modules'
app.get('/modules', (req, res) => {

    // Invoke function from mysqlDAO (Retrieves list of modules from 'module' table)
    mysql.retrieveModules()
        .then((data) => {

            // Pass retrieved data to module.ejs as 'modules'
            res.render("listModules", { modules: data });
        })
        .catch((error) => {

            // Else, log error message onscreen and a link back to the home page
            res.send('<h1>Error occured while retrieving modules, ensure MySQL database is in use/exists</h1> <p><a href="/">Home</p>');
        })
})

// Listens for GET request to 'module/edit/:mid'
app.get('/module/edit/:mid', (req, res) => {

    // Invoke function from mysqlDAO, passing the retrieved module ID value as a parameter (Returns a module record based on its ID)
    mysql.retrieveModule(req.params.mid)
        .then((data) => {

            // If the user manually enters url parameter, which is incorrect
            if (data.length == 0) {
                //Log error message onscreen and a link back to the home page
                res.send('<h1>No such module with id = ' + req.params.mid + '</h1> <p><a href="/">Home</p>')
            }
            else {
                // Pass retrieved data to editModule.ejs
                res.render("editModule", { errors: undefined, module: data[0] });
            }

        })
        .catch((error) => {
            // Send error response alongside link to the home page
            res.send('<h1>Error occured while retrieving specified module</h1> <p><a href="/">Home</p>');
        })

    // Listens for POST request to "/module/edit/:mid" (from editModule.ejs)
    app.post("/module/edit/:mid",
        [
            // Middleware function to run before module is updated (CONDITIONS)
            check('name').isLength({ min: 5 }).withMessage("Module Name must be at least 5 characters"),
            check('credits').isIn([5, 10, 15]).withMessage("Credits can be either 5, 10, 15")

        ],
        (req, res) => {

            // Retrieve list of errors..
            var errors = validationResult(req);

            // If there was errors encountered..
            if (!errors.isEmpty()) {
                // Reload the editModule page with list of errors
                res.render('editModule', { errors: errors.errors, module: req.body });
            }
            else {
                // Invoke function from mysqlDAO, passing the retrieved data from request (Updates module based on the module ID)
                mysql.updateModule(req.body)
                    .then((data) => {

                        // If successful, re-direct user back to the modules page
                        res.redirect('/modules');
                    })
                    .catch((error) => {

                        // Else, log error to screen alongside link to the home page
                        res.send('<h1>Cannot update module ' + error + '</h1> <p><a href="/">Home</p>')
                    })
            }
        }
    )
})

// Listens for GET request to 'module/students/:mid'
app.get('/module/students/:mid', (req, res) => {

    // Invoke function from mysqlDAO, passing retrieved module ID as a parameter (Retrieves students currently studying current module)
    mysql.studyingModule(req.params.mid)
        .then((data) => {

            // If data returned is empty..
            if (data.length == 0) {
                // Log message to screen, alongside link to home page
                res.send('<h1>No student is currently studying this module</h1> <p><a href="/">Home</p>')
            }
            else {
                // Render the listStudying page and pass in the data retrieved from the database
                res.render("listStudying", { mid: req.params.mid, students: data })
            }
        })
        .catch((error) => {

            // Else, notify user of error alongside link to the home page
            res.send('<h1>Cannot retrieve list of students studying ' + req.params.mid + '</h1> <p><a href="/">Home</p>');
        })
})

// MONGODB DATABASE REQUEST HANDLERS
// ---------------------------------

// Listens for GET request to '/lecturers'
app.get('/lecturers', (req, res) => {

    // Invoke function from mongoDAO(Returns all documents within lecturers collection)
    mongo.retrieveLecturers()
        .then((data) => {
            // If successful, render the lecturers page, while passing it the necessary information/data
            res.render("listLecturers", { lecturers: data })
        })
        .catch((error) => {
            // Else, render the error on-screen
            res.send(error);
        })
})

// Listens for GET request to '/addLecturer'
app.get('/addLecturer', (req, res) => {

    // Render the addLecturer Page (no errors and empty fields)
    res.render("addLecturer", { errors: undefined, _id: undefined, name: undefined, dept: undefined });
})

// Listens for POST request to '/addLecturer' (coming from addLecturer.ejs)
app.post('/addLecturer',
    [
        // Middleware function to run before module is updated (CONDITIONS)
        check('_id').isLength({ min: 4 }).withMessage("Lecturer ID must be 4 characters"),
        check('name').isLength({ min: 5 }).withMessage("Name must be atleast 5 characters"),
        check('dept').isLength({ min: 3 }).withMessage("Dept must be 3 characters")
    ],
    (req, res) => {

        // Retrieve list of errors, if any (based on conditions)
        var errors = validationResult(req);

        // If there was errors encountered.. (user entry)
        if (!errors.isEmpty()) {
            // Reload the addLecturer page with list of errors and pass in previously entered values
            res.render('addLecturer', { errors: errors.errors, _id: req.body._id, name: req.body.name, dept: req.body.dept });
        }

        // Invoke function from mysqlDAO (Search department table to see if retrieved dept ID exists)
        mysql.retrieveDepartment(req.body.dept)
            .then((data) => {

                // If the department does exist
                if (data.length != 0) {

                    // Add the new lecturer to the collection based on retrieved values
                    mongo.addLecturer(req.body)
                        .then((data) => {
                            // If successful, re-direct the user back to the lecturers page
                            res.redirect("/lecturers");
                        })
                        .catch((error) => {
                            // If error code matches 11000 (duplicate key used)
                            if (error.code == 11000) {

                                // Create object based on error message
                                err = { msg: "_id already exists" };

                                // Add to list of errors (only one)
                                errors = [];
                                errors.push(err);

                                // Reload the addLecturer page with list of errors (one) and pass in previously entered values
                                res.render('addLecturer', { errors: errors, _id: req.body._id, name: req.body.name, dept: req.body.dept });
                            }

                            console.log(error.message);
                        })
                }
                else if (errors.isEmpty() && data.length == 0) {
                    // Else, if there are no other errors listed and the department doesn't exist..

                    // Create object based on error message
                    err = { msg: "Dept doesn't exist" };

                    // Add to list of errors (only one)
                    errors = [];
                    errors.push(err);

                    // Reload the addLecturer page with list of errors and pass in previously entered values
                    res.render('addLecturer', { errors: errors, _id: req.body._id, name: req.body.name, dept: req.body.dept });
                }
            })
            .catch((error) => {
                console.log("" + error)
            })
    })