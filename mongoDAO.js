// mongoDAO - Handles the connection and queries to the MongoDB database

// MongoClient - Allows connections to be made to MongoDB
const MongoClient = require('mongodb').MongoClient;

// Variables - Used to specify the database and collection to work from
var database, collection;

// Makes asynchronous request to local MongoDB database...
MongoClient.connect('mongodb://localhost:27017')
.then((client) =>{
    // If successful, specify the database and collection to use
    database = client.db('lecturersDB')
    collection = database.collection('lecturers')
})
.catch((error) =>{
    // Else log the error message to the console
    console.log(error.message)
})


// Function - Queries the collection for all lecturer documents retained within 
function retrieveLecturers(){
    // Asynchronous operation - Returns results based on completion or failure
    return new Promise((resolve,reject) =>{
       
        // Find all documents within collection, sort by their ID 
        var cursor = collection.find().sort({_id:1})

        // Convert values into an array
        cursor.toArray()
        .then((data)=>{
            // If successful, return the array
            resolve(data);
        })
        .catch((error)=>{
            // Else, return the error
            reject(error);
        })
    })
}


// Function - Makes request to insert a document into the lecturer collection
function addLecturer(newLecturer){
    // Asynchronous operation - Returns results based on completion or failure
    return new Promise((resolve,reject) => {

        // Insert document based on passed in object
        collection.insertOne(newLecturer)
        .then((data) =>{
            // If successful, return data retaining to insert
            resolve(data);
        })
        .catch((error) =>{
            // Else, send an error message
            reject(error);
        })
    })
}

// Exports functions for usability within index.js
module.exports = {retrieveLecturers,addLecturer};