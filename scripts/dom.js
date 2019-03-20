//////////////////////////////////////////////////////////
////////////////////// SELECTORS /////////////////////////
//////////////////////////////////////////////////////////

const currentCity = document.querySelector('[data-inputcity]');
const currentState = document.querySelector('[data-inputstate]')
const currentRadius = document.querySelector('[data-radius]')
const breweryPicture = document.querySelector('[data-bpictureimg]');
const breweryName = document.querySelector('[data-breweryname]');
const breweryPhone = document.querySelector('[data-breweryphone]');
const breweryAddress = document.querySelector('[data-breweryaddress]');
const breweryAddressTag = document.querySelector('[data-breweryaddressatag]')
const breweryWebsite = document.querySelector('[data-brewerywebsiteatag]');
const breweryReview = document.querySelector('[data-breweryreviewimg]');
const breweryHours = document.querySelector('[data-breweryhours]');
const breweryDistance = document.querySelector('[data-brewerydistance]');
const goButton = document.querySelector('[data-gobutton]');
const searchDiv = document.querySelector('[data-search]');
const runningDiv = document.querySelector('[data-running]');
const resultDiv = document.querySelector('[data-result]');
const aboutDiv = document.querySelector('[data-aboutdetail]');
const mapDiv = document.querySelector('[data-mapall]');
const aboutButton = document.querySelector('[data-about]');
const researchButton = document.querySelector('[data-research]');
const backButton = document.querySelector('[data-back]');
const weatherIcon = document.querySelector('[data-currentweathericon]');


//////////////////////////////////////////////////////////
///////////////// CITY/STATE FETCH ///////////////////////
//////////////////////////////////////////////////////////

let cityArray = {}

function goFetch() { // fetches and returns cities from state selected
    fetch('./data/statecity.json') // this fetches from json file
        .then(function (r) {
            return r.json();
        })
        .then(function(data) {
            cityArray = data;
            changeState(data);
        });
    function changeState(cityArray) { // this listens to selecting each state and for each clicked, run populateCity
        currentState.addEventListener('change', function() {
            populateCity(currentState.value);
        });
    }
}

function populateCity(state) { // this will empty the div and populate cities
    currentCity.textContent = ''
    cityArray[state].forEach(function (city) {
        let option = document.createElement('option');
        option.setAttribute('value', city);
        option.textContent = city;
        currentCity.appendChild(option);
    })
}

goFetch();

//////////////////////////////////////////////////////////
//////////////////// GIVE API INFO ///////////////////////
//////////////////////////////////////////////////////////

function unhideGo () {
    goButton.classList.remove('hidden')
}

function giveApiInfo() {
    showCard(runningDiv)
    inputToObject(currentCity.value, currentState.value, currentRadius.value)
    .then(function (result){
        let map;
        let service;
        let infoWindow;
        let arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects = result
        let localCoordinatesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[0];
        let arrayOfStateBreweriesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[1];
        let radiusMiles = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[2];
        let city = (currentCity.value); // add user defined 'city' to arguments passing into `initMap` function
        let state = (currentState.value); // add user defined 'state' to arguments passing into `initMap` function
        initMap(localCoordinatesObjects, arrayOfStateBreweriesObjects, radiusMiles, city, state);
    });
}

currentRadius.addEventListener('change', unhideGo)
goButton.addEventListener('click', giveApiInfo);

//////////////////////////////////////////////////////////
///////////////// POPULATE RESULTS ///////////////////////
//////////////////////////////////////////////////////////

function closedOrNot(status) { // checks truthiness of open status of brewery
    if (status === false) {
        return 'Closed Now';
    } else {
        return 'Open Now';
    }
}

function splitAddress(address) {
    let arr = [];             //new storage
    str = address.split(',');     //split by spaces
    arr.push(str.shift());    //add the number
    arr.push(str.join(''));
    return arr;
}

function roundToHalfNumber (rating) {
    return Math.round(rating*2)/2;
}

function showCard(card) {
    searchDiv.classList.add('hidden');
    runningDiv.classList.add('hidden');
    mapDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    aboutDiv.classList.add('hidden');
    card.classList.remove('hidden');
}

function bringAbout() {
    searchDiv.classList.add('hidden');
    runningDiv.classList.add('hidden');
    mapDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    aboutDiv.classList.remove('hidden');
    researchButton.classList.remove('hidden');
}

function goBack() {
        searchDiv.classList.add('hidden');
        runningDiv.classList.add('hidden');
        mapDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        aboutDiv.classList.add('hidden');
        backButton.classList.add('hidden');
}

function goResearch() {
    searchDiv.classList.remove('hidden');
    runningDiv.classList.add('hidden');
    mapDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    aboutDiv.classList.add('hidden');
    backButton.classList.add('hidden');
    researchButton.classList.add('hidden');
}

aboutButton.addEventListener('click', bringAbout);
backButton.addEventListener('click', goBack);
researchButton.addEventListener('click', goResearch);