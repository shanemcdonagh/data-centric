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

// Export - For use in index.js
module.exports = {retrieveStudents, retrieveModules};