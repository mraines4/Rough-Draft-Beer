//////////////////////////////
// OPENBREWERYDB API BEGINS //
//////////////////////////////
let allBreweriesArray = [];

function urlForPage(state, pageNumber) {
    return `https://api.openbrewerydb.org/breweries?by_state=${state}&page=${pageNumber}&per_page=50`;
}

function retrievePageOfBreweries(state, pageNumber) {
    return fetch(urlForPage(state, pageNumber))
    .then(function (response) {
        return response.json(); 
    })
    
    .then(function (response){
        accumulateBreweries(state, response)
    })
}

function accumulateBreweries(state, theActualData) {
    allBreweriesArray = [
        ...allBreweriesArray,
        ...theActualData
    ];
    storeBreweries(state, allBreweriesArray);
}

function storeBreweries(state, arrayOfBreweries) {
    const jsonCharacters = JSON.stringify(arrayOfBreweries);
    localStorage.setItem(state, jsonCharacters);
}

function breweryAPI(state){
    if (!(localStorage.getItem(state))) { // puts state breweries in local storage
        let promiseArray = [];
        let max = 12; // Handling states with a huge number of breweries
        if (state === "California"){ // California has over 900 breweries!
            max = 20;
        }
        else{
            max = 12;
        }
        for (let pageNumber=0; pageNumber<max; pageNumber++) {
            let delay = pageNumber * 50;
            
            // // Initial framework for staggering fetches, will require writing a New Promise
            // setTimeout(function () {
                // console.log("Sent a timeout!");
                promiseArray.push(retrievePageOfBreweries(state, pageNumber))
            // }, delay);
        }
        return Promise.all(promiseArray)
        .then(function (results){
            return breweryAPI2(state);
        });
    }
    else{
        return breweryAPI2(state);
    }
}

function breweryAPI2(state){
    let thePromise = new Promise(function (resolve, reject){
        breweryData = JSON.parse(localStorage.getItem(state));
        let cleanedStateDB = getRidOfAwkwardASCII(filterOutPhoneyPhones(filterOutPlanners(breweryData))); // start calling functions
        const results = cleanedStateDB;
        resolve(results);
    });
    return thePromise;
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

function getRidOfAwkwardASCII(breweriesArray){
    let uglyA = String.fromCharCode(131);
    let uglyO = String.fromCharCode(226);
    let normalBreweryNames = breweriesArray.filter(function (eachBrewery){
        return (!((eachBrewery.name).includes(uglyA)||(eachBrewery.name).includes(uglyO)));
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
        return error;
    })
    .then(function (geoData) {
        return geoData.results[0].geometry;
    });
}

///////////////////////
// GOOGLE API BEGINS //
///////////////////////
function initMap(localCoordinatesObjects, arrayOfStateBreweriesObjects, radius = 50, city, state) { // radius has defaulted value in case browser allows user to "go" before a radius is chosen so that Zoom level won't panic
    let lat = localCoordinatesObjects["lat"];
    let lng = localCoordinatesObjects["lng"];

    let userLocation = new google.maps.LatLng(lat, lng);

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
    arrayOfStateBreweriesObjects.sort(function (a, b){ // sort breweries alphabetically by city
        let nameA=a.city.toLowerCase(), nameB=b.city.toLowerCase();
        if (nameA < nameB){ //sort string ascending
            return -1 
        }
        if (nameA > nameB){
            return 1
        }
        else{
            return 0
        }
    });
    const index = arrayOfStateBreweriesObjects.findIndex(brewery => brewery.city === city); // split the list at the index of the first city matching object
    const first = arrayOfStateBreweriesObjects.slice(0, index);
    const second = arrayOfStateBreweriesObjects.slice(index);
    const arrayOfStateBreweriesObjects1 = second.concat(first); // add the first half of the list to the end
    arrayOfStateBreweriesObjects1.forEach(function (brewery){ //iterates over each Brewery Name to create a marker and add it to the map, either from Local Storage or from a fetch
        let name = brewery.name;
        let results;
        if (localStorage.getItem(name)) { // Check localStorage for this brewery's info
            googleBreweryData = JSON.parse(localStorage.getItem(name));
            results =  googleBreweryData;
            result = results.result;
            initMapPart3(initMapPart2(result, localCoordinatesObjects))
        }
        else{ // Generate the promise chain and then store the brewery's info
            return fetch(`https://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&input=${name}&inputtype=textquery&locationbias=circle:${radius}@${lat},${lng}`)
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
                return fetch(`https://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&placeid=${placeID}`);
            })
            .then(function (response){
                return response.json();
            })
            .then(function (response){
                if (response.permanently_closed === true){
                    throw new Error("Too bad, this brewery is permanently closed!");
                }
                else if (!( ((response.result.address_components[3].long_name.includes(state))||response.result.address_components[4].long_name.includes(state))||(response.result.address_components[5].long_name.includes(state))||(response.result.address_components[6].long_name.includes(state)) )){ // checks if the Google Details search found a brewery out of state and chucks it out if so
                    throw new Error("Bad Google, you think this brewery is out of state!");
                }
                else{
                    return response;
                }
            })
            .then(function (data){
                localStorage.setItem(brewery.name,JSON.stringify(data)); // write it to local storage
                return data;
            })
            .then(function (response){
                results = response;
                result = results.result;
                initMapPart3(initMapPart2(result, localCoordinatesObjects))
            })
            .catch(function (error){
            })
        }
    })
}

function initMapPart2(eachBrewery,localCoordinatesObjects){
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
        photoURL1 = `https://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&photoreference=${photoURL}&maxwidth=400`;
    }
    else{
        // console.log("No photo");
    }
    if (brewery1 === undefined){
        // console.log("Brewery Object was undefined.");
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
                // console.log(error);
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
                return breweryAPI(state);
            })
            .then(function (result){
                result.forEach(function (brewery){ //iterates over each Brewery Name to create a marker and add it to the map, either from Local Storage or from a fetch
                    let name = brewery.name;
                    if (localStorage.getItem(name)) { // Check localStorage for this brewery's info
                        // console.log(`${name} was in storage`);
                    }
                    else{ // Generate the promise chain and then store the brewery's info
                        return fetch(`https://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&input=${name}&inputtype=textquery&locationbias=ipbias`)
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
                            return fetch(`https://my-little-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyApHYZEvDSvxo93xtENN27q30mCGb29rsI&placeid=${placeID}`);
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
                            // console.log("There was no Place_ID");
                        });
                    }
                })
            })
        })
    }
    console.log(`https://www.youtube.com/watch?v=AubJS7oWaWo`);
    console.log(`Alright then, keep your secrets! :) `);
}

////////////////////
// MISC FUNCTIONS //
////////////////////
async function inputToObject(city, state, radius){
    let userCoordinatesPromise = geoApi(city, state);
    let arrayOfStateBreweryObjectsPromise = breweryAPI(state); // fetches all the OpenBreweryDB's records for the state and filters them a bit

    allBreweriesArray = []; // Have to reset what was in the accumulating array before running `breweryAPI` again, otherwise thi was causing the bug where subsequent state look ups were adding all previous state results in, cutting down on local storage space
    return Promise.all([userCoordinatesPromise, arrayOfStateBreweryObjectsPromise]) // rewritten for legibility 
    .then(function (arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects){
    let localCoordinatesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[0];
    let arrayOfStateBreweriesObjects = arrayOfLocalCoordinatesObjectsAndArrayOfStatBreweriesObjects[1];
    let radiusMiles = radius; //* 1609.34 if you want convert to meters for whatever reason;
    return [localCoordinatesObjects,arrayOfStateBreweriesObjects,radiusMiles];
    });
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

/////////////////////////
// Testing Environment //
/////////////////////////
autopopulateLocation();

