// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();

/* Middleware*/
// Require body-parser
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
//configuring the port 
const port = 8000;
//intiating the server with a callback function that sends a feedback to the Command Line
app.listen(port,()=>{
    console.log(`SERVER IS RUNNING\nON PORT ${port}`)
});

//setup the POST route to recieve data from the client (attached to the POST request body)
app.post('/senddata',(req,res)=>{
    console.log(req.body);
    projectData = req.body;
});

//setup the GET route to send the app Endpoint data  AKA 'projectData' to the client
app.get('/all',(req,res)=>{
    res.send(projectData);
    console.log(projectData);
});