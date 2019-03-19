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
        console.log("Sending state brewery array from storage out now.");
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
        //     console.log("pagination process begun")
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

/////////////////////////
// OPENCAGE API BEGINS //
/////////////////////////
function geoApi(city,state){
    geoKey = '9940fdfbec3c42328da75e23977d75a9'; //jonathan1
    // geoKey = '9d9748a20c404012b1f456f51a28720b'; //jonathan2
    // geoKey = '10fd1a444a7245d9aef8755338cd29af'; //matt
    // geoKey = '1e1a5ca33b17441e848d7f47354a2236'; //margaret
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
        return geoData.results[0].geometry;
    });
}

///////////////////////
// GOOGLE API BEGINS //
///////////////////////
function initMap(localCoordinatesObjects, arrayOfStateBreweriesObjects, radius) { //*** needs to be passed an array of brewery names
    let lat = localCoordinatesObjects["lat"];
    let lng = localCoordinatesObjects["lng"];

    let userLocation = new google.maps.LatLng(lat, lng); //*** going to need to geolocate user

    infowindow = new google.maps.InfoWindow();
    let zoomValue;
    radius = parseInt(radius); // convert from incoming string to number
    if (radius === 50){
        zoomValue = 9.6;
    }
    else if (radius === 40){
        zoomValue = 9.85;
    }
    else if (radius === 30){
        zoomValue = 10.35;
    }
    else if (radius === 20){
        zoomValue = 10.9;
    }
    else if (radius === 10){
        zoomValue = 11.97;
    }
    map = new google.maps.Map(
        document.getElementById('map'), {
            center: userLocation, 
            zoom : zoomValue 
        }
    );
    arrayOfStateBreweriesObjects.forEach(function (brewery){ //iterates over each Brewery Name to create a marker and add it to the map, either from Local Storage or from a fetch
        let name = brewery.name;
        let results;
        if (localStorage.getItem(name)) { // Check localStorage for this brewery's info
            googleBreweryData = JSON.parse(localStorage.getItem(name));
            results =  googleBreweryData;
            result = results.result;
            initMapPart3(initMapPart2(result, localCoordinatesObjects))
        }
        else{ // Generate the promise chain and then store the brewery's info
            return fetch(`http://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&input=${name}&inputtype=textquery&locationbias=circle:${radius}@${lat},${lng}`)
            .then(function (response){
                return response.json();
            })
            .then(function (response){
                console.log(response);
                let placeID;
                // debugger;
                    if (response.candidates.length < 1){
                        throw new Error("Can't perform Place Details search on this brewery name, no results for name.");
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
                if (response.permanently_closed === true){
                    throw new Error("Too bad, this brewery is permanently closed!");
                }
                else{
                    return response;
                }
            })
            .then(function (data){
                localStorage.setItem(brewery.name,JSON.stringify(data));// write it to local storage
                return data;
            })
            .then(function (response){
                console.log(response);
                console.log("PROMISE CHAIN ENACTED, GIRD YOUR LOINS");
                results = response;
                result = results.result;
                initMapPart3(initMapPart2(result, localCoordinatesObjects))
            })
            .catch(function (error){
                console.log("There was no Place_ID");
                console.log(error);
            })
        }
    })
}

function initMapPart2(eachBrewery,localCoordinatesObjects){
    console.log(eachBrewery);
    if (eachBrewery.photos){
        let photoURL = eachBrewery.photos[0].photo_reference;
        let breweryPhotoURLArray = [photoURL,eachBrewery];
        let breweryPhotoURLArrayAndLocalCoordinatesObjectsArray = [breweryPhotoURLArray,localCoordinatesObjects]
        return breweryPhotoURLArrayAndLocalCoordinatesObjectsArray;
    }
    else{
        return [0,localCoordinatesObjects];
    }
}

function initMapPart3(breweryPhotoURLArrayAndLocalCoordinatesObjectsArray){
    let breweryPhotoURLArray = breweryPhotoURLArrayAndLocalCoordinatesObjectsArray[0];
    let localCoordinatesObjects = breweryPhotoURLArrayAndLocalCoordinatesObjectsArray[1];
    let brewery1;
    let photoURL1;
    if (breweryPhotoURLArray){
        let photoURL = breweryPhotoURLArray[0];
        brewery1 = breweryPhotoURLArray[1];
        photoURL1 = `http://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&photoreference=${photoURL}&maxwidth=400`;
    }
    else{
        console.log("No photo");
    }
    if (brewery1 === undefined){
        console.log("Brewery Object was undefined.");
    }
    else{
        createMarker(brewery1, photoURL1, localCoordinatesObjects);
        showCard(mapDiv)
        researchButton.classList.remove('hidden');
    }
}

function createMarker(place, photoURL, localCoordinatesObjects) {
    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: '../img/Beermap.png'
    });
    google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(`<b>${place.name}</b>`);
        infowindow.open(map, this);
        
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close()
    });
    if (photoURL){
    }
    else{
        photoURL = "";
    }
    google.maps.event.addListener(marker, 'click', function() {
        if (userGeoIP.coords !== undefined){ // checks for user's shared location stored in a global variable before using generic city/state
            let lat1 = userGeoIP.coords.latitude;
            let lng1 = userGeoIP.coords.longitude;
            let lat2 = place.geometry.location.lat;
            let lng2 = place.geometry.location.lng;
            let result = haversine(lat1, lng1, lat2, lng2);
            makeBrewery(place, photoURL, result);
            showCard(resultDiv);
            backButton.classList.remove('hidden');
        }
        else{
            let lat1 = localCoordinatesObjects.lat;
            let lng1 = localCoordinatesObjects.lng;
            let lat2 = place.geometry.location.lat;
            let lng2 = place.geometry.location.lng;
            let result = haversine(lat1, lng1, lat2, lng2);
            makeBrewery(place, photoURL, result);
            showCard(resultDiv);
            backButton.classList.remove('hidden');
        }
    });
}

////////////////////////////////
// DOM MANIPULATING FUNCTIONS //
////////////////////////////////
function makeBrewery(brewInfo, photoURL, dynamicBreweryDistance) {
    getWeather(brewInfo.geometry.location.lat, brewInfo.geometry.location.lng)
    if (photoURL){
        breweryPicture.setAttribute('src', photoURL);
    }
    else{
        breweryPicture.setAttribute('src', `./../img/nopicturebeer.jpg`);
    }
    breweryName.textContent = brewInfo.name;
    breweryPhone.textContent = brewInfo.formatted_phone_number;
    breweryAddress.textContent = `${splitAddress(brewInfo.formatted_address)[0]}\n\r${splitAddress(brewInfo.formatted_address)[1]}`;
    breweryAddressTag.setAttribute('href', `https://www.google.com/maps?saddr=My+Location&daddr=${brewInfo.formatted_address}`)
    breweryWebsite.setAttribute('href', brewInfo.website);
    breweryReview.setAttribute('src', `./../img/${roundToHalfNumber(brewInfo.rating)}pint.png`);
    breweryHours.textContent = closedOrNot(brewInfo.opening_hours.open_now);
    breweryDistance.textContent = `${dynamicBreweryDistance} miles away`; // value changes depending on where the user provied the browser access to location
}

function weatherPic (get) {
    let imgTag = document.createElement('img');
    imgTag.classList.add('weatherpng');
    imgTag.setAttribute('src', `../img/${get}.png`);
    return imgTag;
}

function getWeather(lat, long) {
    let theWeather;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=1efd23d575e7f6ab1b69c24ba772d747`;
    fetch(url)
    .then(function(response) { 
        return response.json() 
    })
    .then(function(weatherData) { 
        // console.log(weatherData);
        theWeather = weatherData;
        weatherIcon.textContent = 'Weather:';
        weatherIcon.appendChild(weatherPic(getIcon(theWeather)))
    });
}
let userGeoIP = {};
function autopopulateLocation(){
    if ("geolocation" in navigator) { // checks if user is sharing location
    return navigator.geolocation.getCurrentPosition(function(position) {
        userGeoIP = position;
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        geoKey = '9940fdfbec3c42328da75e23977d75a9'; //jonathan1
        // geoKey = '9d9748a20c404012b1f456f51a28720b'; //jonathan2
        // geoKey = '10fd1a444a7245d9aef8755338cd29af'; //matt
        // geoKey = '1e1a5ca33b17441e848d7f47354a2236'; //margaret
        const GEO_URL = `https://api.opencagedata.com/geocode/v1/json?key=${geoKey}&q=${lat}%2C${lng}`;
        return fetch(GEO_URL)
        .then(function (response) {
            return response.json();
        })
        .catch(function (error){
            console.log(error);
            return error;
        })
        .then(function (geoData) {
            const city = geoData.results[0].components.city
            const state = geoData.results[0].components.state
            const cityState = [city, state];
            return cityState;
        })
        .then(function (cityState){
            cityState;
            const city = cityState[0];
            const state = cityState[1];
            breweryAPI(state)
            .then(function (result){
            result.forEach(function (brewery){ //iterates over each Brewery Name to create a marker and add it to the map, either from Local Storage or from a fetch
                let name = brewery.name;
                let results;
                if (localStorage.getItem(name)) { // Check localStorage for this brewery's info
                    console.log("Brewery information already in storage.");
                }
                else{ // Generate the promise chain and then store the brewerie's info
                    console.log(`Storing ${name} in storage`);
                    return fetch(`http://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&input=${name}&inputtype=textquery&locationbias=ipbias`)
                    .then(function (response){
                        return response.json();
                    })
                    .then(function (response){
                        let placeID;
                            if (response.candidates.length < 1){
                                throw new Error("Can't perform Place Details search on this brewery name, no results for name.");
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
                        if (response.permanently_closed === true){
                            throw new Error("Too bad, this brewery is permanently closed!");
                        }
                        else{
                            return response;
                        }
                    })
                    .then(function (data){
                        localStorage.setItem(brewery.name,JSON.stringify(data));// write it to local storage
                    })
                    .catch(function (error){
                        console.log("There was no Place_ID");
                        console.log(error);
                    });
                }
            })
            })

        })
    });
    }
    else{
        console.log(`https://www.youtube.com/watch?v=AubJS7oWaWo`);
        console.log(`Alright then, keep your secrets! :) `);
    }
}

////////////////////
// MISC FUNCTIONS //
////////////////////
async function inputToObject(city, state, radius){
    let userCoordinatesPromise = geoApi(city, state);
    // let userCoordinatesPromise = {lat:33.8426621, lng: -84.3731155}; // for avoiding buring OpenCage's API requests
    let arrayOfStateBreweryObjectsPromise = breweryAPI(state); // fetches all the OpenBreweryDB's records for the state and filters them a bit
    const arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects = await Promise.all([userCoordinatesPromise, arrayOfStateBreweryObjectsPromise]);
    let localCoordinatesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[0];
    let arrayOfStateBreweriesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[1];
    let radiusMiles = radius; //* 1609.34 if you want convert to meters for whatever reason;
    return [localCoordinatesObjects,arrayOfStateBreweriesObjects,radiusMiles];
}

function haversine(lat1, lng1, lat2, lng2){ // for finding the distance between two sets of coordinates
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
    const R = 6371; // km 
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

function getIcon(obj) {
    return obj.weather[0].icon;
}

///////////////////////
// Unused Functions  //
///////////////////////
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
}

function radiusBreweryRandomizer(localBreweries){ // randomizer to pull out the 1 phone number to query Yelp
    let randomNumber = (parseInt(Math.random() * (localBreweries.length))); // get a random number from the length of the array
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

function eventfind (e) {
    console.log(e)
}

function yelpAPI(phone){ // Yelp API
    return fetch(`https://my-little-yelp-helper.herokuapp.com/${phone}/cNbPUBoVlPtwEmVX_uxtVyrH6-XkMcFut1Sh45aM-VZlSiAlbzDMGYB06yYF3QnCMfxQAx97dLVwhTiki9JfRFpmT2d32IyE4U3kdJE1j9BZwlrQCQfDrqD3O2OJXHYx`)
    .then(function (response){
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
// Testing Environment //
/////////////////////////
autopopulateLocation();

