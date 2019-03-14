/////////////////////////////
//OPENBREWERYDB API BEGINS //
/////////////////////////////
const beerURL = './scripts/breweryDB.json';

fetch(beerURL) // getting the database data
.then(function (response){
    return response.json(); // workable data
})
.then(function (data){
    let cleanDB = filterOutPhoneyPhones(filterOutPlanners(data)); // start calling functions
    return cleanDB; // return a workable array of objects of breweries with real phone #s that exist
});

function filterOutPhoneyPhones(breweriesArray){
    let goodPhones = breweriesArray.filter(function (eachBrewery){
        return ((eachBrewery["phone"]).length === 10); // get rid of brewery with anything but 10 digit phone #s
    });
    return goodPhones;
}

function filterOutPlanners(breweriesArray){
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
// let phone = '16784010600';
// fetch(`https://my-little-yelp-helper.herokuapp.com/${phone}/cNbPUBoVlPtwEmVX_uxtVyrH6-XkMcFut1Sh45aM-VZlSiAlbzDMGYB06yYF3QnCMfxQAx97dLVwhTiki9JfRFpmT2d32IyE4U3kdJE1j9BZwlrQCQfDrqD3O2OJXHYx`)
// .catch(function (error){
//     console.log('ERROR');
// })
// .then(function (response){
//     console.log(response);
//     return response.json(); // workable data
//     // return response.jsonp(); // "jsonP" alternative for CORS debugging   
// })
// .then(function (data){
//     console.log(data);
//     console.log('that was the data');
//     // return cleanDB; // return a workable array of objects of breweries with real phone #s that exist
// });

/////////////////////////
// OPENCAGE API BEGINS //
/////////////////////////
// geoKey = '9940fdfbec3c42328da75e23977d75a9';
// const GEO_URL = `https://api.opencagedata.com/geocode/v1/json?q=Atlanta,Georgia,US&key=${geoKey}`;

// fetch(GEO_URL)
// .then(function (response) {
//     // Start the conversion process.
//     return response.json();  // <----- We're returning another Promise.
// })
// .then(function (geoData) {
//     console.log('Inside the function (geoData)');
//     console.log(geoData.results[0].geometry.lat);
//     console.log(geoData.results[0].geometry.lng);
//     return geoData.results[0].geometry;
// })
// .then(function (coordinates) {
//     console.log('Inside the function (coordinates)');
//     // Call the other API with yet another fetch
//     console.log(coordinates);
// });