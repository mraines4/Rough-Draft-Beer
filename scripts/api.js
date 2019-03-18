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
    else { // data doesn't exist in local - get it from API

        // stagger the fetches // Whelp, we tried to...
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
        let cleanedStateDB = getRidOfDumbCharacters(filterOutPhoneyPhones(filterOutPlanners(data))); // start calling functions
        const results = cleanedStateDB;
        return results;
        })
        .then(function (data){
            localStorage.setItem(state,JSON.stringify(data));// write it to local storage
            return data;
        })
        .then(function (data){
            // showMeTheBreweryTypes(data);
            return data; // once more, for good luck
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

function getRidOfDumbCharacters(breweriesArray){
    let normalBreweryNames = breweriesArray.filter(function (eachBrewery){
        return (!(eachBrewery.name).includes("Anheuser-Busch Inc â Cartersville"));
    });
    return normalBreweryNames;
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
    console.log("breweryTypesArray:");
    console.log(breweryTypesArray);
    // return breweryTypesArray;
}

/////////////////////
// YELP API BEGINS //
/////////////////////
function yelpAPI(phone){
    return fetch(`https://my-little-yelp-helper.herokuapp.com/${phone}/cNbPUBoVlPtwEmVX_uxtVyrH6-XkMcFut1Sh45aM-VZlSiAlbzDMGYB06yYF3QnCMfxQAx97dLVwhTiki9JfRFpmT2d32IyE4U3kdJE1j9BZwlrQCQfDrqD3O2OJXHYx`)
    .then(function (response){
        // ARE YOU DEBUGGING IN BROWSER RIGHT NOW?
        // If you just got a Syntax Error, don't worry.
        // This is one of those cases where the phone number 
        // returns 0 businesses from Yelp!
        // We'll be putting in a Chili's fix soon or
        // we'll pick a new brewery for you. 
        // // maybe pass the localBreweries object into this function 
        // // and have a new function that re-does
        // // // const randomBreweryObject = (radiusBreweryRandomizer(localBreweriesArrayofObjects_1));
        // // // const phone = breweryPhoneNumber(randomBreweryObject);
        // // // const yelpInfo = await yelpAPI(phone);
        // // which should hopefully pass the `.catch` on another try?
        let result = response.json(); // split this line up so it'd be easier to debug by console log
        return result; // workable data
    })
    .catch(function (error){
        console.log('ERROR'); // possible landing site for new function
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
function geoApi(city,state){


    geoKey = '9940fdfbec3c42328da75e23977d75a9'; //jonathan
    // geoKey = '9d9748a20c404012b1f456f51a28720b' //jonathan2
    // geoKey = 'b575d8c9334048dc86f37eefb94833f4' //jonathan3
    // geoKey = '10fd1a444a7245d9aef8755338cd29af'; //matt
    // geoKey = '1e1a5ca33b17441e848d7f47354a2236' //margaret

    const GEO_URL = `https://api.opencagedata.com/geocode/v1/json?q=${city},${state},US&key=${geoKey}`;

    return fetch(GEO_URL)
    .then(function (response) {
        return response.json();
    })
    .catch(function (error){
        console.log(error);
        return error;
    })
    .then(function (geoData) {
        return geoData.results[0].geometry; // now feed this into a function to come up with a local lat/lng range
    });
}

///////////////////////
// GOOGLE API BEGINS //
///////////////////////
function initMap(localCoordinatesObjects, arrayOfStateBreweriesObjects, radiusMeters) { //*** needs to be passed an array of brewery names
    // debugger;
    let radius = radiusMeters;
    console.log(arrayOfStateBreweriesObjects);
    console.log(radiusMeters);
    let lat = localCoordinatesObjects["lat"];
    let lng = localCoordinatesObjects["lng"];
    let userLocation = new google.maps.LatLng(lat, lng); //*** going to need to geolocate user

    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(
        document.getElementById('map'), {
            center: userLocation, 
            zoom: 10 // should be based on radius setting
        }
    );
    arrayOfStateBreweriesObjects.forEach(function (brewery){ //*** should iterate over each Brewery Name to create a marker and add it to the map
        let name = brewery.name;
        console.log(name);
        console.log(radius);
        console.log(lat);
        console.log(lng);
        return fetch(`http://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&input=${name}&inputtype=textquery&locationbias=circle:${radius}@${lat},${lng}`)
        .then(function (response){
            return response.json();
        })
        .then(function (response){
            console.log(response);
            let placeID;
            // debugger;
            if (response.candidates.length < 1){
                placeID = "ChIJ61IfWmT99IgRwH3hzwm8cug"; // need a better way of handling this besides hardcoding an Atlanta brewery
            }
            else{
                placeID = (response["candidates"][0]["place_id"]);
            }
            return placeID;
        })
        .then(function (placeID){
            return fetch(`http://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&placeid=${placeID}`);
        })
        .then(function (response){
            return response.json();
        })
        .then(function (response){
            console.log(response);
            return response;
        })
        .then(function (results){
            return(results.result);
        })
        .then(function (eachBrewery){
            let photoURL = eachBrewery.photos[0].photo_reference;
            let breweryPhotoURLArray = [photoURL,eachBrewery];
            return breweryPhotoURLArray;
        })
        .then(function (breweryPhotoURLArray){
            let photoURL = breweryPhotoURLArray[0];
            let brewery1 = breweryPhotoURLArray[1];
            let photoURL1 = `http://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&photoreference=${photoURL}&maxwidth=400`;
            // let photoURLPromise = fetch(`http://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&photoreference=${photoURL}&maxwidth=400`);
            // console.log(photoURLPromise);
            // debugger;
            createMarker(brewery1, photoURL1);
            // return [photoURL, brewery1];
            // return Promise.all([photoURL, brewery1]);
        })
        // .then(function (photoURLBreweryArray){
        //     let photoURLPreJSON = (photoURLBreweryArray[0]);
        //     console.log(photoURLPreJSON);
        //     let photoURL = photoURLPreJSON.json();
        //     debugger;
        //     let brewery1 = photoURLBreweryArray[1];
        //     return [photoURL,brewery1]
        // })
        // .then(function (photoURLBreweryArray){
        //     let photoURL = photoURLBreweryArray[0];
        //     let brewery1 = photoURLBreweryArray[1];
            
        //     return;
        // })
            // console.log(photoURL);
            // let brewery1 = photoURLBreweryArray[1];
            // createMarker(brewery1, photoURL);
        // })
            // debugger;
                    // }
                    // map.setCenter(results[0].geometry.location);
        
        });
    }
//     )
// }



function createMarker(place, photoURL) {
    console.log(place);
    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: '../img/Beermap.png'
    });
    showCard(mapDiv)
    
    google.maps.event.addListener(marker, 'mouseover', function() {
        console.log(place);
        infowindow.setContent(`<strong>${place.name}</strong>`);
        infowindow.open(map, this);
        
        // infowindow.classList.add('testclass');
        // let bubble = document.querySelector('testclass');
        // bubble.addEventListener('click', test);
        // showResult(place)
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        console.log(place.name);
        infowindow.close()

    });
    google.maps.event.addListener(marker, 'click', function() {
        // console.log(brewery);
        makeBrewery(place, photoURL);
        showCard(resultDiv)

    });
}


////////////////////
// MISC FUNCTIONS //
////////////////////
function radiusBreweryRandomizer(localBreweries){ // randomizer to pull out the 1 phone number to query Yelp
    let randomNumber = (parseInt(Math.random() * (localBreweries.length))); // get a random number from the length of the array
    return localBreweries[randomNumber]; // set that random number as the index for the array for the breweries to return a single random brewery
}

function breweryPhoneNumber(brewery){ // Checks for valid phone numbers, or close enough
    // ARE YOU DEBUGGING IN BROWSER RIGHT NOW?
    // If you just got a Syntax or Type Error, don't worry.
    // This is one of those cases where the database 
    // didn't have a brewery that the critea and so it fails out
    // We'll be putting in a Chili's fix soon.
    if ((brewery.phone).length === 11){
        return brewery.phone;
    }
    else{ 
    return '1' + (brewery.phone);
    }
}

async function inputToObject(city = "userLocation", state = "Georgia", radius = 50){ // default data
    // let userCoordinatesPromise = geoApi(city, state);
    let userCoordinatesPromise = {lat:33.8426621, lng: -84.3731155};
    let arrayOfStateBreweryObjectsPromise = breweryAPI(state); // fetches all the OpenBreweryDB's records for the state and filters them a bit
    const arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects = await Promise.all([userCoordinatesPromise, arrayOfStateBreweryObjectsPromise]);
    let localCoordinatesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[0];
    let arrayOfStateBreweriesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[1];
    let radiusMeters = radius * 1609.34;

    return [localCoordinatesObjects,arrayOfStateBreweriesObjects,radiusMeters];
    // // arrayOfStateBreweriesObjects.forEach(function (breweries){
    // //     // do a thing
    // // });
    
    // let breweriesDistanceFromCityArray = [];
    // arrayOfStateBreweriesObjects.forEach(function (brewery) {
    //     const lat1 = parseFloat(localCoordinatesObjects.lat); // start setting selected city/state's lat and lng
    //     const lng1 = parseFloat(localCoordinatesObjects.lng);
    //     // const lat1 = 33.8426621;
    //     // const lng1 = -84.3731155;
    //     if (brewery["latitude"]) { // check that they have supplied values for lat/long
    //         let lat2 = brewery["latitude"];
    //         let lng2 = brewery["longitude"];
    //         breweriesDistanceFromCityArray.push([brewery.name, (haversine(lat1, lng1, lat2, lng2))]);
    //     }
    //     else { // uh oh, product nearby lat/long by passing the brewery city/state to OpenCage API!
    //         // let breweryCity = brewery["city"];
    //         // let breweryState = brewery["state"];
    //         // geoApi(breweryCity, breweryState) // getting the brewery's lat/long given their city,state
    //         //     .then(function (breweryCoordinatesObject) {
    //         //         let lat2 = breweryCoordinatesObject["lat"];
    //         //         let lng2 = breweryCoordinatesObject["lng"];
    //         //         breweriesDistanceFromCityArray.push([brewery.name, (haversine(lat1, lng1, lat2, lng2))]);
    //         //     });
    //         breweriesDistanceFromCityArray.push([brewery.name, (haversine(lat1, lng1, 33.8486621, -84.3731155))]);
    //     }
    // });
    // // BEGIN FILTERING BY RADIUS
    // let localBreweries = breweriesDistanceFromCityArray.filter(function (brewery) {
    //     return brewery[1] <= radius; // compare them to the inputted radius
    // });
    // // CREATE AN ARRAY OF ONLY THE NAMES OF LOCAL BREWERIES
    // let localBreweriesNamesOnlyArray = [];
    // localBreweries.forEach(function (brewery) {
    //     localBreweriesNamesOnlyArray.push(brewery[0]);
    // });
    // // COMPARE THE NEARBY BREWERIES AGAINST ALL THE BREWERIES IN THE STATE
    // let localBreweriesArrayofObjects = [];
    // arrayOfStateBreweriesObjects.forEach(function (breweryObject) {
    //     if (localBreweriesNamesOnlyArray.includes(breweryObject["name"])) {
    //         localBreweriesArrayofObjects.push(breweryObject); // array of brewery objects with all their data
    //     }
    // });
    // const localBreweriesArrayofObjects_1 = localBreweriesArrayofObjects;
    // const randomBreweryObject = (radiusBreweryRandomizer(localBreweriesArrayofObjects_1));
    // const phone = breweryPhoneNumber(randomBreweryObject);
    // const yelpInfo = await yelpAPI(phone);
    // // now we do math to give the resultsArray[1] the distance between the user and the brewery
    // // const lat1 = parseFloat(localCoordinatesObjects.lat); // start setting selected city/state's lat and lng
    // // const lng1 = parseFloat(localCoordinatesObjects.lng);
    // const lat1 = 33.8426621;
    // const lng1 = -84.3731155;
    // let lat2 = (yelpInfo.coordinates.latitude);
    // let lng2 = (yelpInfo.coordinates.longitude);
    // let distanceFromUserToBrewery = (haversine(lat1, lng1, lat2, lng2));
    // const breweryWebsite = randomBreweryObject.website_url;
    // let resultsArray = [yelpInfo, distanceFromUserToBrewery, breweryWebsite];
    // return resultsArray;
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
    return Math.round(d * 10) / 10;
}

// function initMap(breweryName) {
//     let userLocation = new google.maps.LatLng(33.848555, -84.373724); // geolocate user

//     infowindow = new google.maps.InfoWindow(
//     );

//     map = new google.maps.Map(
//         document.getElementById('map'), {
//             center: userLocation, 
//             zoom: 12 // should be based on radius setting
//         }
//     );
            
//             let request = {
//                 query: `${breweryName}`, // need user input
//                 fields: ['name', 'geometry'],
//             };
//         //   console.log(breweryName)
            
//             service = new google.maps.places.PlacesService(map);
            
//             service.findPlaceFromQuery(request, function(results, status) {
//                 if (status === google.maps.places.PlacesServiceStatus.OK) 
//                 {
//                 for (let i = 0; i < results.length; i++) {
//                     createMarker(results[i]);
//                 }
//                 map.setCenter(results[0].geometry.location);
//                 }
//             });
// }
            
// function createMarker(place) {
//             let marker = new google.maps.Marker({
//                 map: map,
//                 position: place.geometry.location,
//                 icon: './../img/Beermap.png'
//             });
            
//             google.maps.event.addListener(marker, 'mouseover', function() {
//                 console.log(place);
//                 infowindow.setContent(`<strong>${place.name}</strong>`);
//                 infowindow.open(map, this);
                
//                 // infowindow.classList.add('testclass');
//                 // let bubble = document.querySelector('testclass');
//                 // bubble.addEventListener('click', test);
//                 // showResult(place)
//             });
//             google.maps.event.addListener(marker, 'mouseout', function() {
//                 console.log(place);
//                 infowindow.close()

//             });
//             google.maps.event.addListener(marker, 'click', function() {

//                 showResult(place)
//             });
// }


function eventfind (e) {
    console.log(e)
}

function makeBrewery(brewInfo, photoURL) {
    //// unhide when divs are updated!!!
    // runningDiv.classList.add('hidden');
    // mapDiv.classList.remove('hidden');
    // showCard(mapDiv);
    

    breweryPicture.setAttribute('src', photoURL);
    // debugger;
    breweryName.textContent = brewInfo.name;
    breweryPhone.textContent = brewInfo.formatted_phone_number;
    // breweryAddress.textContent = `${brewInfo.location.address1}\n\r${brewInfo.location.city}, ${brewInfo.location.state} ${brewInfo.location.zip_code}`;
    breweryAddress.textContent = brewInfo.formatted_address;
    breweryAddress.setAttribute('href', `https://www.google.com/maps?saddr=My+Location&daddr=${breweryAddress.textContent}`)
    breweryWebsite.textContent = brewInfo.website;
    breweryWebsite.setAttribute('href', brewInfo.website);
    breweryReview.setAttribute('src', `./../img/${brewInfo.rating}pint.png`);
    breweryHours.textContent = closedOrNot(brewInfo.opening_hours.open_now);
    // breweryDistance.textContent = `${brewInfo[1]} miles away`; // distance calculation may be made but this is pending reworking the calculation from the user's ipGeoLocation

}


/////////////////////////
// Testing Environment //
/////////////////////////
