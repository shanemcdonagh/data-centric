// mySQL Data Access Object - Used to connect to a local database for data access, modification and deletion
var mysql = require('promise-mysql')

// Variable used to to access connection pool - Multiple connections to database at once
var pool;

// Creates connection pool of 3 connections to local database 'collegedb'
mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegedb'
})
.then(p =>{
    pool = p;
})
.catch(e => {
    console.log("Pool error: " + e);
})

// Queries MySQL database to return all students from its table
function retrieveStudents(){
    return new Promise((resolve,reject) =>{
        pool.query("SELECT * from student")
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

// Queries MySQL database to return all modules from its table
function retrieveModules(){
    return new Promise((resolve,reject) =>{
        pool.query("SELECT * from module")
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

// Function - Retrieves specified module from the database
function retrieveModule(mid){
    return new Promise((resolve,reject) =>{
        
        var myQuery = {
            sql: "SELECT * from module WHERE mid = ?",
            values: [mid]
        }
        
        pool.query(myQuery)
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

function updateModule(name,credits,mid){
    return new Promise((resolve,reject) =>{
        
        var myQuery = {
            sql: "UPDATE module SET name = ?, credits = ? WHERE mid = ?",
            values: [name,credits,mid]
        }
        
        pool.query(myQuery)
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

function studyingModule(mid){
    return new Promise((resolve,reject) =>{
        
        var myQuery = { 
            sql: "SELECT m.mid,s.name,s.sid,s.name,s.gpa from student_module m INNER JOIN student s ON m.sid = s.sid WHERE m.mid = ?;",
            values: [mid]
        }
        
        pool.query(myQuery)
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}





// Export - For use in index.js
module.exports = {retrieveStudents, retrieveModules, retrieveModule, updateModule, studyingModule};