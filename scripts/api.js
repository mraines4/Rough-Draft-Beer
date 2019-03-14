//////////////////////////////
// OPENBREWERYDB API BEGINS //
//////////////////////////////
// let state = "georgia"; // the "state" from the state field on input or geolocate api
// the above is a TEMPORARY global variable to feed to this function, otherwise the function should be fed from the above mentioned inputs
function breweryAPI(state){ // still need to instate pagination to create full stateDB to manipulate
    const beerURL = `https://api.openbrewerydb.org/breweries?by_state=${state}`;
    // console.log(`Searching DB for ${state} breweries`);

    return fetch(beerURL) // getting the database data
    .then(function (response){
        return response.json(); // workable data
    })
    .then(function (data){
        let cleanedStateDB = filterOutPhoneyPhones(filterOutPlanners(data)); // start calling functions
        // console.log(`Here are all the breweries in the state of ${state}`);
        // console.log(cleanedStateDB);
        return cleanedStateDB; // return a workable array of objects of breweries with real phone #s that exist per state
    });
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
    console.log(existingBreweries);
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
    fetch(`https://my-little-yelp-helper.herokuapp.com/${phone}/cNbPUBoVlPtwEmVX_uxtVyrH6-XkMcFut1Sh45aM-VZlSiAlbzDMGYB06yYF3QnCMfxQAx97dLVwhTiki9JfRFpmT2d32IyE4U3kdJE1j9BZwlrQCQfDrqD3O2OJXHYx`)
    .catch(function (error){
        console.log('ERROR');
    })
    .then(function (response){
        // console.log(response);
        return response.json(); // workable data
    })
    .then(function (data){
        console.log(data);
        console.log('that was the data');
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
        console.log(geoData.results[0].geometry); // returns object of user's (city, state) center lat/lngs
        return geoData.results[0].geometry; // now feed this into a function to come up with a local lat/lng range
    });
}





////////////////////
// MISC FUNCTIONS //
////////////////////

// Build a randomizer to pull out the 1 phone number to query Yelp
function radiusBreweryRandomizer(localBreweries){
    let randomNumber = (parseInt(Math.random() * (localBreweries.length))); // get a random number from the length of the array
    console.log(`This is your random number: ${randomNumber}`);
    return localBreweries[randomNumber]; // set that random number as the index for the array for the breweries to return a single random brewery
}

function breweryPhoneNumber(brewery){
    if ((brewery.phone).length === 11){
        return brewery.phone;
    }
    else{ 
    return '1' + (brewery.phone);
    }
}

function localizeRadiusRange(localLatLngObject, radius){ // WORKING ON IT
    const lat = parseFloat(localLatLngObject.lat);
    const long = parseFloat(localLatLngObject.lng);
    const radiusKM = radius / 0.62137;

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
    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);  
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = (R * c) * 0.62137; // convert to miles
    

    console.log(d);
    return (d);
}

/////////////////////////
// Testing Environment //
/////////////////////////
// let state = (document.querySelector('[data-inputstate]')).value; // pulling input from HTML

// console.log(geoApi("Atlanta", "Georgia"));
haversine(33.7490987, -84.3901849,33.9526,-84.5499);

// breweryAPI(state).then(function (data){
//     return (breweryPhoneNumber(radiusBreweryRandomizer(data))); // this is the 11 digit number you feed into yelpAPI
// })
// .then(function (phone){
//     return (yelpAPI(phone));
// });
