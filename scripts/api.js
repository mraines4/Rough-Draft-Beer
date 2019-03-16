//////////////////////////////
// OPENBREWERYDB API BEGINS //
//////////////////////////////

function page1(state){
    return fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&page=1&per_page=50`)
    .then(function (response){
        return response.json(); // workable data
    })
    .then(function (data){
        return data;
        });
}
function page2(state){
    return fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&page=2&per_page=50`)
    .then(function (response){
        return response.json(); // workable data
    })
    .then(function (data){
        return data;
        });
}
function page3(state){
    return fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&page=3&per_page=50`)
    .then(function (response){
        return response.json(); // workable data
    })
    .then(function (data){
        return data;
        });
}
function page4(state){
    return fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&page=4&per_page=50`)
    .then(function (response){
        return response.json(); // workable data
    })
    .then(function (data){
        return data;
        });
}


async function breweryAPI(state){
    if (localStorage.getItem(state)) {
        breweryData = JSON.parse(localStorage.getItem(state));
        // fill list of breweries
        console.log("sending state brewery array from storage out now");
        console.log(breweryData);
        return breweryData;
    }
    else {      //data doesn't exist in local - get it from API

        // stagger the fetches
        let prom1 = page1(state);
        let prom2 = page2(state);
        let prom3 = page3(state);
        let prom4 = page4(state);
        // // for whatever reason, timeouts below don't work
        // let prom2 = setTimeout(function (){
        //     page2(state);
        // }, 250);
        // let prom3 = setTimeout(function (){
        //     page3(state);
        // }, 500);
        // let prom4 = setTimeout(function (){
        //     page4(state);
        // }, 750);

        // const arrayOfArraysOfObjects = await Promise.all([prom1, prom2, prom3, prom4])// wait for them to come back;
        let arrayOfArraysOfObjects;
        return arrayOfArraysOfObjects = await Promise.all([prom1, prom2, prom3, prom4])// wait for them to come back;
        .then(function (arrayOfArraysOfObjects){ 
        let array1 = arrayOfArraysOfObjects[0];
        let array2 = arrayOfArraysOfObjects[1];
        let array3 = arrayOfArraysOfObjects[2];
        let array4 = arrayOfArraysOfObjects[3];
        let arrayOfObjects = [
            ...array1,
            ...array2,
            ...array3,
            ...array4,
        ];
        const data = (arrayOfObjects);
        let cleanedStateDB = filterOutPhoneyPhones(filterOutPlanners(data)); // start calling functions
        const results = cleanedStateDB;
        console.log(results);
        return results;
        })
        .then(function (data){
            localStorage.setItem(state,JSON.stringify(data));// write it to local storage
            // console.log(data);
            return data;
        })
        .then(function (data){
            console.log("last step in creating array of states for first time");
            console.log(data);
            return data;
        });
    }
}

function filterOutPhoneyPhones(breweriesArray){
    let goodPhones = breweriesArray.filter(function (eachBrewery){
        return (((eachBrewery["phone"]).length === 10) || ((eachBrewery["phone"]).length === 11)); // get rid of brewery with anything but 10 or 11 digit phone #s
    });
    return goodPhones;
}

function filterOutPlanners(breweriesArray){ // only open/operational breweries, please
    const existingBreweries = breweriesArray.filter(function (eachBrewery){
        return ((eachBrewery["brewery_type"]) !== "planning"); // get rid of any brewery still in planning
    });
    return existingBreweries;
}

function filterOutPhoneyPhones(breweriesArray){
    let goodPhones = breweriesArray.filter(function (eachBrewery){
        return (((eachBrewery["phone"]).length === 10) || ((eachBrewery["phone"]).length === 11)); // get rid of brewery with anything but 10 or 11 digit phone #s
    });
    return goodPhones;
}

function filterOutPlanners(breweriesArray){ // only open/operational breweries, please
    const existingBreweries = breweriesArray.filter(function (eachBrewery){
        return ((eachBrewery["brewery_type"]) !== "planning"); // get rid of any brewery still in planning
    });
    // console.log(existingBreweries);
    return existingBreweries;
}

function showMeTheBreweryTypes(breweriesArray){ // quick optional function to look at the different types of breweries
    let breweryTypesArray =[];
    breweriesArray.forEach(function (eachBrewery){
        if (!(breweryTypesArray.includes(eachBrewery["brewery_type"]))){
            breweryTypesArray.push(eachBrewery["brewery_type"]);
        }
        else{
        }
    });
    // console.log('here are your brewery types!');
    // console.log(breweryTypesArray);
    return breweryTypesArray;
}

/////////////////////
// YELP API BEGINS //
/////////////////////
// let phone = '16784010600'; // the "phone" should be fed from breweryAPI
// the above is a TEMPORARY global variable to feed to this function, otherwise the function should be fed from the above mentioned inputs
function yelpAPI(phone){
    return fetch(`https://my-little-yelp-helper.herokuapp.com/${phone}/cNbPUBoVlPtwEmVX_uxtVyrH6-XkMcFut1Sh45aM-VZlSiAlbzDMGYB06yYF3QnCMfxQAx97dLVwhTiki9JfRFpmT2d32IyE4U3kdJE1j9BZwlrQCQfDrqD3O2OJXHYx`)
    .catch(function (error){
        console.log('ERROR');
    })
    .then(function (response){
        // console.log(response);
        return response.json(); // workable data
    })
    .then(function (data){
        // console.log(data); // sanity checks
        // console.log('that was the data');
        return data;
    });
}

/////////////////////////
// OPENCAGE API BEGINS //
/////////////////////////
// let city = 'Atlanta'; // the "city" should be fed from the city field on input
// let state = 'Georgia'; // the "state" should be fed from the state field on input
// the above are TEMPORARY global variables to feed to this function, otherwise the function should be fed from the above mentioned inputs

function geoApi(city,state){
    geoKey = '9940fdfbec3c42328da75e23977d75a9';
    const GEO_URL = `https://api.opencagedata.com/geocode/v1/json?q=${city},${state},US&key=${geoKey}`;

    return fetch(GEO_URL)
    .then(function (response) {
        return response.json();  // <----- We're returning another Promise.
    })
    .then(function (geoData) {
        // console.log(geoData.results[0].geometry); // returns object of user's (city, state) center lat/lngs
        return geoData.results[0].geometry; // now feed this into a function to come up with a local lat/lng range
    });
}

////////////////////
// MISC FUNCTIONS //
////////////////////

function radiusBreweryRandomizer(localBreweries){ // randomizer to pull out the 1 phone number to query Yelp
    let randomNumber = (parseInt(Math.random() * (localBreweries.length))); // get a random number from the length of the array
    // console.log(`This is your random number: ${randomNumber}`);
    return localBreweries[randomNumber]; // set that random number as the index for the array for the breweries to return a single random brewery
}

function breweryPhoneNumber(brewery){ // Checks for valid phone numbers, or close enough
    if ((brewery.phone).length === 11){
        return brewery.phone;
    }
    else{ 
    return '1' + (brewery.phone);
    }
}

async function inputToObject(city = "Atlanta", state = "Georgia", radius = 50){ // default data
    let userCoordinatesPromise = geoApi(city, state);
    let arrayOfStateBreweryObjectsPromise = breweryAPI(state);
    const arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects = await Promise.all([userCoordinatesPromise, arrayOfStateBreweryObjectsPromise]);
    let localCoordinatesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[0];
    let arrayOfStateBreweriesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[1];
    let breweriesDistanceFromCityArray = [];
    // debugger;
    arrayOfStateBreweriesObjects.forEach(function (brewery) {
        const lat1 = parseFloat(localCoordinatesObjects.lat); // start setting selected city/state's lat and lng
        const lng1 = parseFloat(localCoordinatesObjects.lng);
        if (brewery["latitude"]) { // check that they have supplied values for lat/long
            let lat2 = brewery["latitude"];
            let lng2 = brewery["longitude"];
            breweriesDistanceFromCityArray.push([brewery.name, (haversine(lat1, lng1, lat2, lng2))]);
        }
        else { // uh oh, product nearby lat/long by passing the brewery city/state to OpenCage API!
            let city_1 = brewery["city"];
            let state_1 = brewery["state"];
            geoApi(city_1, state_1) // getting the brewery's lat/long given their city,state
                .then(function (breweryCoordinatesObject) {
                    let lat2_1 = breweryCoordinatesObject["lat"];
                    let lng2_1 = breweryCoordinatesObject["lng"];
                    breweriesDistanceFromCityArray.push([brewery.name, (haversine(lat1, lng1, lat2_1, lng2_1))]);
                });
        }
    });
    // BEGIN FILTERING BY RADIUS
    let localBreweries = breweriesDistanceFromCityArray.filter(function (brewery) {
        return brewery[1] <= radius; // compare them to the inputted radius
    });
    // CREATE AN ARRAY OF ONLY THE NAMES OF LOCAL BREWERIES
    let localBreweriesNamesOnlyArray = [];
    localBreweries.forEach(function (brewery) {
        localBreweriesNamesOnlyArray.push(brewery[0]);
    });
    // COMPARE THE NEARBY BREWERIES AGAINST ALL THE BREWERIES IN THE STATE
    let localBreweriesArrayofObjects = [];
    arrayOfStateBreweriesObjects.forEach(function (breweryObject) {
        if (localBreweriesNamesOnlyArray.includes(breweryObject["name"])) {
            localBreweriesArrayofObjects.push(breweryObject); // array of brewery objects with all their data
        }
    });
    const localBreweriesArrayofObjects_1 = localBreweriesArrayofObjects;
    const phone = (breweryPhoneNumber(radiusBreweryRandomizer(localBreweriesArrayofObjects_1)));
    const results = await yelpAPI(phone);
    // console.log(results);
    return results;
}

function haversine(lat1, lng1, lat2, lng2){
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
    const R = 6371; // km 
    //has a problem with the .toRad() method below.
    let x1 = lat2-lat1;
    let dLat = x1.toRad();  
    let x2 = lng2-lng1;
    let dLon = x2.toRad();  
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
    Math.cos(lat1.toRad()) * Math.cos(lat2* Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);  
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = (R * c) * 0.62137; // convert to miles
    // console.log(d);
    return (d);
}

/////////////////////////
// Testing Environment //
/////////////////////////