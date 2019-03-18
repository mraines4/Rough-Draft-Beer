

//////////////////////////////////////////////////////////
////////////////////// SELECTORS /////////////////////////
//////////////////////////////////////////////////////////

const currentCity = document.querySelector('[data-inputcity]');
const currentState = document.querySelector('[data-inputstate]')
const currentRadius = document.querySelector('[data-radius]')
const breweryPicture = document.querySelector('[data-bpictureimg]');
const breweryName = document.querySelector('[data-breweryname]');
const breweryPhone = document.querySelector('[data-breweryphone]');
const breweryAddress = document.querySelector('[data-breweryaddressatag]');
const breweryWebsite = document.querySelector('[data-brewerywebsiteatag]');
const breweryReview = document.querySelector('[data-breweryreviewimg]');
const breweryHours = document.querySelector('[data-breweryhours]');
const breweryDistance = document.querySelector('[data-brewerydistance]');
const goButton = document.querySelector('[data-gobutton]');
const searchDiv = document.querySelector('[data-search]');
const runningDiv = document.querySelector('[data-running]');
const resultDiv = document.querySelector('[data-result]');
const aboutDiv = document.querySelector('[data-aboutdetail');
const mapDiv = document.querySelector('[data-mapall]');
const aboutButton = document.querySelector('[data-about]');
const researchButton = document.querySelector('[data-research]');
const backButton = document.querySelector('[data-back]');
const weatherIcon = document.querySelector('[data-currentweathericon]');


//////////////////////////////////////////////////////////
///////////////// CITY/STATE FETCH ///////////////////////
//////////////////////////////////////////////////////////

let cityArray = {}

// fetches and returns cities from state selected
function goFetch() {
    // this fetches from json file
    fetch('./data/statecity.json')
        .then(function (r) {
            return r.json();
        })
        .then(function(data) {
            // console.log(data);
            cityArray = data;
            changeState(data);
        });
        
        // this listens to selecting each state and for each clicked, run populateCity
    function changeState(cityArray) {
        currentState.addEventListener('change', function() {
            // console.log(currentState.value)
            populateCity(currentState.value);
        });
    }
}

// this will empty the div and populate cities
function populateCity(state) {
    currentCity.textContent = ''
    // console.log(state);
    // console.log('test')
    // console.log(cityArray[state]);
    cityArray[state].forEach(function (city) {
        let option = document.createElement('option');
        option.setAttribute('value', city);
        option.textContent = city;
        currentCity.appendChild(option);
        // console.log(city)
    })
}

goFetch();

//////////////////////////////////////////////////////////
//////////////////// GIVE API INFO ///////////////////////
//////////////////////////////////////////////////////////

currentState.addEventListener('change', unhideGo)

function unhideGo () {
    goButton.classList.remove('hidden')
}

goButton.addEventListener('click', giveApiInfo);

function giveApiInfo() {
    // console.log(currentCity.value)
    // console.log(currentState.value)
    // console.log(currentRadius.value)

    //// unhide when divs are updated!!!
    // searchDiv.classList.add('hidden');
    // runningDiv.classList.remove('hidden');
    showCard(runningDiv)

    inputToObject(currentCity.value, currentState.value, currentRadius.value).then(function (result){


        let map;
        let service;
        let infoWindow;
        // let breweryName = [result[0].name, "Max Lager's Wood-Fired Grill & Brewery"];
        let arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects = result
        let localCoordinatesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[0];
        // // ^^^ is the lat/lon of the User
        let arrayOfStateBreweriesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[1];
        // // ^^^ are all the breweries in the state from OpenBreweryDB
        let radiusMeters = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[2];
        console.log(localCoordinatesObjects);
        console.log(arrayOfStateBreweriesObjects);
        // debugger;
        initMap(localCoordinatesObjects, arrayOfStateBreweriesObjects, radiusMeters);
        // debugger;
        // runningDiv.classList.add('hidden');
        // mapDiv.classList.remove('hidden');
        // showCard(mapDiv);



    });

}




//////////////////////////////////////////////////////////
///////////////// POPULATE RESULTS ///////////////////////
//////////////////////////////////////////////////////////



// checks truthiness of open status of brewery
function closedOrNot(status) {
    if (status === false) {
        return 'Closed Now';
    } else {
        return 'Open Now';
    }
}


function roundToHalfNumber (rating) {
    return Math.round(rating*2)/2;
}

aboutButton.addEventListener('click', showCard(aboutDiv));
backButton.addEventListener('click', showCard(mapDiv));
researchButton.addEventListener('click', showCard(searchDiv));


function showCard(card) {
    searchDiv.classList.add('hidden');
    runningDiv.classList.add('hidden');
    mapDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    // aboutDiv.classList.add('hidden');
    card.classList.remove('hidden');
}








//////////////////////////////////////////////////////////
////////////////////// old/unused ////////////////////////
//////////////////////////////////////////////////////////

// function makeBrewery(brewInfo) {
//     //// unhide when divs are updated!!!
//     runningDiv.classList.add('hidden');
//     mapDiv.classList.remove('hidden');
//     breweryPicture.setAttribute('src', brewInfo[0].image_url);
//     breweryName.textContent = brewInfo[0].name;
//     breweryPhone.textContent = brewInfo[0].display_phone;
//     breweryAddress.textContent = `${brewInfo[0].location.address1}\n\r${brewInfo[0].location.city}, ${brewInfo[0].location.state} ${brewInfo[0].location.zip_code}`;
//     breweryAddress.setAttribute('href', `https://www.google.com/maps?saddr=My+Location&daddr=${breweryAddress.textContent}`)
//     breweryWebsite.textContent = brewInfo[2];
//     breweryWebsite.setAttribute('href', brewInfo[2].website_url);
//     breweryReview.setAttribute('src', `./../img/${brewInfo[0].rating}pint.png`);
//     breweryHours.textContent = closedOrNot(brewInfo[0].is_closed);
//     breweryDistance.textContent = `${brewInfo[1]} miles away`;
// }


// unused functions****************
// converts phone number to display
// function formatPhoneNumber(number) {
//     return `(${number.substr(0,3)}) ${number.substr(3,3)}-${number.substr(6,4)}`
// }

// finds distance from city to brewery
// function convertDistance(current, brew) {
//     // converts lat and long of brewery to numbers
//     let brewLat = parseFloat(brew.coordinates.latitude);
//     let brewLong = parseFloat(brew.coordinates.longitude);
//     // does the distance formula
//     let distance = Math.sqrt(Math.pow((current[0] - brewLat),2) + Math.pow((current[1] - brewLong),2));
//     // converts degrees to miles
//     let miles = distance * 68.703
//     // returns with 1 decimal place
//     return Math.round(miles * 10) / 10;
// }


// function distForm(current, brew){
//     let brewLat = parseFloat(brew.coordinates.latitude);
//     let brewLong = parseFloat(brew.coordinates.longitude);
//     Number.prototype.toRad = function() {
//         return this * Math.PI / 180;
//     };
//     const R = 6371; // km 
//     //has a problem with the .toRad() method below.
//     let x1 = current[0]-brewLat;
//     let dLat = x1.toRad();  
//     let x2 = current[1]-brewLong;
//     let dLon = x2.toRad();  
//     let a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
//     Math.cos(brewLat.toRad()) * Math.cos(current[0].toRad()) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2);  
//     let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//     let d = (R * c) * 0.62137; // convert to miles
    

//     // console.log(d);
//     return Math.round(d * 10) / 10;
// }

//////////////////////////////////////////////////////////
///////////////////// MAP TESTING ////////////////////////
//////////////////////////////////////////////////////////

// const mapAddress = document.querySelector('[data-mapaddress]');
// const mapGo = document.querySelector('[data-mapgo]');

// mapGo.addEventListener('click', testOutMap);

// function testOutMap () {
//     console.log(mapAddress)
// }


// function getIcon(obj) {
//     return obj.weather[0].icon;
// }

// function weatherPic (get) {
//     let imgTag = document.createElement('img');
//     imgTag.classList.add('weatherpng');
//     imgTag.setAttribute('src', `http://openweathermap.org/img/w/${get}.png`);
//     return imgTag;
// }


// function getWeather() {
//     let theWeather;
//     const url = 'https://http://api.openweathermap.org/data/2.5/weather?lat=34.04332&lon=-84.94324&appid=1efd23d575e7f6ab1b69c24ba772d747';
//     fetch(url)
//     .then(function(response) { 
//         return response.json() 
//     })
//     .then(function(weatherData) { 
//         console.log(weatherData);
//         theWeather = weatherData;
//         weatherIcon.appendChild(weatherPic(getIcon(theWeather)))
//     });
// }