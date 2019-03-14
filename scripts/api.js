//////////////////////////////
// OPENBREWERYDB API BEGINS //
//////////////////////////////
// const beerURL = './scripts/breweryDB.json';

// fetch(beerURL) // getting the database data
// .then(function (response){
//     return response.json(); // workable data
// })
// .then(function (data){
//     let cleanDB = filterOutPhoneyPhones(filterOutPlanners(data)); // start calling functions
//     return cleanDB; // return a workable array of objects of breweries with real phone #s that exist
// });

// function filterOutPhoneyPhones(breweriesArray){
//     let goodPhones = breweriesArray.filter(function (eachBrewery){
//         return ((eachBrewery["phone"]).length === 10); // get rid of brewery with anything but 10 digit phone #s
//     });
//     return goodPhones;
// }

// function filterOutPlanners(breweriesArray){
//     const existingBreweries = breweriesArray.filter(function (eachBrewery){
//         return ((eachBrewery["brewery_type"]) !== "planning"); // get rid of any brewery still in planning
//     });
//     return existingBreweries;
// }

/////////////////////
// YELP API BEGINS //
/////////////////////
let phone = '16784010600';
fetch(`http://localhost:3000/${phone}/cNbPUBoVlPtwEmVX_uxtVyrH6-XkMcFut1Sh45aM-VZlSiAlbzDMGYB06yYF3QnCMfxQAx97dLVwhTiki9JfRFpmT2d32IyE4U3kdJE1j9BZwlrQCQfDrqD3O2OJXHYx`)
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