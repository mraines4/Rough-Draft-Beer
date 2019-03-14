/////////////////////////////
//OPENBREWERYDB API BEGINS //
/////////////////////////////
let state = "georgia"; // the "state" from the state field on input or geolocate api
// the above is a TEMPORARY global variable to feed to this function, otherwise the function should be fed from the above mentioned inputs
function breweryAPI (state){
    const beerURL = `https://api.openbrewerydb.org/breweries?by_state=${state}`;


    fetch(beerURL) // getting the database data
    .then(function (response){
        return response.json(); // workable data
    })
    .then(function (data){
        let cleanDB = filterOutPhoneyPhones(filterOutPlanners(data)); // start calling functions
        return cleanDB; // return a workable array of objects of breweries with real phone #s that exist
    });
}

function filterOutPhoneyPhones(breweriesArray){ // only returns phone numbers 10 digits long, stretch goal to modify 9 digit results (add "1" to the beginning) and include them in the 10 digit array
    let goodPhones = breweriesArray.filter(function (eachBrewery){
        return ((eachBrewery["phone"]).length === 10); // get rid of brewery with anything but 10 digit phone #s
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
let phone = '16784010600'; // the "phone" should be fed from breweryAPI
// the above is a TEMPORARY global variable to feed to this function, otherwise the function should be fed from the above mentioned inputs
function yelpAPI(phone){
    fetch(`https://my-little-yelp-helper.herokuapp.com/${phone}/cNbPUBoVlPtwEmVX_uxtVyrH6-XkMcFut1Sh45aM-VZlSiAlbzDMGYB06yYF3QnCMfxQAx97dLVwhTiki9JfRFpmT2d32IyE4U3kdJE1j9BZwlrQCQfDrqD3O2OJXHYx`)
    .catch(function (error){
        console.log('ERROR');
    })
    .then(function (response){
        console.log(response);
        return response.json(); // workable data
        // return response.jsonp(); // "jsonP" alternative for CORS debugging   
    })
    .then(function (data){
        console.log(data);
        console.log('that was the data');
        // return cleanDB; // return a workable array of objects of breweries with real phone #s that exist
    });
}

/////////////////////////
// OPENCAGE API BEGINS //
/////////////////////////
let city = 'Atlanta'; // the "city" should be fed from the city field on input
let state_1 = 'Georgia'; // the "state" should be fed from the state field on input
// the above are TEMPORARY global variables to feed to this function, otherwise the function should be fed from the above mentioned inputs
function geoApi(city,state){
    geoKey = '9940fdfbec3c42328da75e23977d75a9';
    const GEO_URL = `https://api.opencagedata.com/geocode/v1/json?q=${city},${state_1},US&key=${geoKey}`;

    fetch(GEO_URL)
    .then(function (response) {
        // Start the conversion process.
        return response.json();  // <----- We're returning another Promise.
    })
    .then(function (geoData) {
        console.log('Inside the function (geoData)');
        console.log(geoData.results[0].geometry.lat);
        console.log(geoData.results[0].geometry.lng);
        return geoData.results[0].geometry;
    })
    .then(function (coordinates) {
        console.log('Inside the function (coordinates)');
        // Call the other API with yet another fetch
        console.log(coordinates);
    });
}