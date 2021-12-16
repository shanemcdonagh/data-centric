// mySQL Data Access Object - Used to connect to a local database for data access, modification and deletion (Does so asynchronously)
var mysql = require('promise-mysql')

// Variable -  Used to to access connection pool (Multiple connections to database at once)
var pool;

// Function call - Creates connection pool of 3 connections to local database 'collegedb'
mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegedb'
})
.then(p =>{
    // If successful, intialises our variable to the pool
    pool = p;
})
.catch(e => {
    // Else, log the error to the console
    console.log("Pool error: " + e);
})

// Function - Makes a query to return all student records from its table
function retrieveStudents(){
    return new Promise((resolve,reject) =>{
        pool.query("SELECT * from student")
        .then((data) => {
            // If successful, resolve the query with the necessary data
            resolve(data);
        })
        .catch((error) => {
            // Else, reject the query with the resulting error
            reject(error);
        })
    })
}

// Function - Makes a query to remove a given student record based on its ID
function deleteStudent(sid){
    return new Promise((resolve,reject) =>{
        var myQuery = {
            sql: "DELETE from student WHERE sid = ?",
            values: [sid]
        }

        pool.query(myQuery)
        .then((data) => {
            // If successful, resolve the query with the necessary data
            resolve(data);
        })
        .catch((error) => {
            // Else, reject the query with the resulting error
            reject(error);
        })
    })
}

// Function -  Makes a query to insert a student record based on passed in object
function addStudent(newStudent){
    return new Promise((resolve,reject) =>{
        var myQuery = {
            sql: "INSERT into student (sid,name,gpa) values (?,?,?);",
            values: [newStudent.sid,newStudent.name,newStudent.gpa]
        }

        pool.query(myQuery)
        .then((data) => {
            // If successful, resolve the query with the necessary data
            resolve(data);
        })
        .catch((error) => {
            // Else, reject the query with the resulting error
            reject(error);
        })
    })
}


// Function - Makes a query to return all module records within the table
function retrieveModules(){
    return new Promise((resolve,reject) =>{
        pool.query("SELECT * from module")
        .then((data) => {
            // If successful, resolve the query with the necessary data
            resolve(data);
        })
        .catch((error) => {
            // Else, reject the query with the resulting error
            reject(error);
        })
    })
}

// Function - Makes a query to return a module record matching the passed in ID
function retrieveModule(mid){
    return new Promise((resolve,reject) =>{
        
        var myQuery = {
            sql: "SELECT * from module WHERE mid = ?",
            values: [mid]
        }
        
        pool.query(myQuery)
        .then((data) => {
            // If successful, resolve the query with the necessary data
            resolve(data);
        })
        .catch((error) => {
            // Else, reject the query with the resulting error
            reject(error);
        })
    })
}

// Function - Makes a query to update a module record based on the passed in object
function updateModule(updatedModule){
    return new Promise((resolve,reject) =>{
        
        var myQuery = {
            sql: "UPDATE module SET name = ?, credits = ? WHERE mid = ?",
            values: [updatedModule.name,updatedModule.credits,updatedModule.mid]
        }
        
        pool.query(myQuery)
        .then((data) => {
            // If successful, resolve the query with the necessary data
            resolve(data);
        })
        .catch((error) => {
            // Else, reject the query with the resulting error
            reject(error);
        })
    })
}

// Function - Makes a query to return all student records where their ID is linked to a specific module
function studyingModule(mid){
    return new Promise((resolve,reject) =>{
        
        var myQuery = { 
            sql: "SELECT m.mid,s.name,s.sid,s.name,s.gpa from student_module m INNER JOIN student s ON m.sid = s.sid WHERE m.mid = ?;",
            values: [mid]
        }
        
        pool.query(myQuery)
        .then((data) => {
            // If successful, resolve the query with the necessary data
            resolve(data);
        })
        .catch((error) => {
            // Else, reject the query with the resulting error
            reject(error);
        })
    })
}

// Function - Makes a query to return department name of record that their ID matches the passed in value
// (Used within our MongoDB query to determine if the user-specified department exists within our SQL database)
function retrieveDepartment(dept){
    return new Promise((resolve,reject) =>{
        
        var myQuery = { 
            sql: "SELECT dept from dept WHERE did = ?",
            values: [dept]
        }
        
        pool.query(myQuery)
        .then((data) => {
            // If returns match, pass along data
            console.log("match")
            resolve(data);
        })
        .catch((error) => {
            // Else, pass along an error
            console.log("fuck")
            reject(error);
        })
    })
}

// Export - For use in index.js
module.exports = {retrieveStudents, retrieveModules, retrieveModule, retrieveDepartment, updateModule, studyingModule, deleteStudent, addStudent};