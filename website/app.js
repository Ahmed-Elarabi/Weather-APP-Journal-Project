/* Global Variables */
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// Assigining the URL of the weather API to fetch data from to a variable to use later
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// Personal API Key for OpenWeatherMap API
const restOfURL = '&appid=';// to setup the full url needed correctly
const apiKey = '83b41ef53cc943031dcf5f926f5a1415&units=imperial';

//Adding an event listener to the button 'generate' with a callback function 'performAction'
document.getElementById('generate').addEventListener('click',performAction);

/**
 * Defining the callback function so that it will fetch the data needed from the weather API using the async function (getData)
 * and with a chained promise will post part of the retrieved data plus the user input data and date  to the server via the async function (postData)
 * and then run the async function (retrieveData) that will get the data from the app Endpoint from server and update the UI with this data
 **/
function performAction(){
    let zipCode = document.getElementById('zip').value;
    let userFeelings = document.getElementById('feelings').value; //user input data
    getDataFromApi(baseURL,zipCode,apiKey)
    .then((x)=>{
        postData('/senddata',{date: newDate, temp:x.main.temp, userFeelings: userFeelings });
        retrieveData();
    })
}

// Defining the async function used to retrieve the data from the weather API via the url and API key and zip code the user enter
const getDataFromApi = async (url,code,key)=>{
    const respond = await fetch(url+code+restOfURL+key);
    try{
        const retrivedData = await respond.json();
        // add a pop-up message in case the zip code the user entered is not valid
        if (retrivedData.cod !== 200){
            alert("The zip code you entered is not correct!");
            alert ('please enter a valid zip code for a city in the US');
        }
        console.log(retrivedData); //needed to see the fetched data so that we can extract only the temperature and send it to the server
        return retrivedData;
    }
    catch(error){
        console.log('error',error);
    }
};

//Defining the async function used to send data to the server attached to the body of a POST request
const postData = async (url,data)=>{
    const options={
        method:'POST',
        credentials:'same-origin',
        headers:{
            'content-type':'application/json'
        },
        body: JSON.stringify(data)
    };
    const res = await fetch(url,options);
    try{
        const sentData = await res.json();
        return sentData; // can be neglected since the setup of the POST in server does not really send any respond back to the client
    }
    catch(error){
        console.log('error',error);
    }
};

//Defining the async function that will retrieve the data from our app Endpoint and update the UI with the retrieved data
const retrieveData = async () =>{
    const request = await fetch('/all');
    try{
    const allData = await request.json();
    // Write updated data to DOM elements
    document.getElementById('date').innerHTML =`<span>Date is:</span> ${allData.date}`;
    document.getElementById('temp').innerHTML = `<span>Temperature is:</span> ${Math.round(allData.temp)} degrees`;//to round the temperature to the nearest integer
    document.getElementById('content').innerHTML = `<span>Your feelings are:</span> ${allData.userFeelings}`;   
    }
    catch(error) {
      console.log('error', error);
    }
   };