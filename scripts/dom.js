//////////////////////////////////////////////////////////
/////////////////////// DUMMY DATA ///////////////////////
//////////////////////////////////////////////////////////


// let dummyYelp ={
//     "businesses": [
//         {
//             "id": "-X6YB-qWX-nFqOk8vpoPcQ",
//             "alias": "red-hare-brewing-company-marietta",
//             "name": "Red Hare Brewing Company",
//             "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/_ArCLNvKl7WDfudGSf3QbQ/o.jpg",
//             "is_closed": false,
//             "url": "https://www.yelp.com/biz/red-hare-brewing-company-marietta?adjust_creative=MvuodG5DKzjWVXYRja2GlA&utm_campaign=yelp_api_v3&utm_medium=api_v3_phone_search&utm_source=MvuodG5DKzjWVXYRja2GlA",
//             "review_count": 82,
//             "categories": [
//                 {
//                     "alias": "breweries",
//                     "title": "Breweries"
//                 },
//                 {
//                     "alias": "brewingsupplies",
//                     "title": "Brewing Supplies"
//                 }
//             ],
//             "rating": 4,
//             "coordinates": {
//                 "latitude": 33.92434,
//                 "longitude": -84.49576
//             },
//             "transactions": [],
//             "price": "$",
//             "location": {
//                 "address1": "1998 Delk Industrial Blvd",
//                 "address2": "",
//                 "address3": "",
//                 "city": "Marietta",
//                 "zip_code": "30067",
//                 "country": "US",
//                 "state": "GA",
//                 "display_address": [
//                     "1998 Delk Industrial Blvd",
//                     "Marietta, GA 30067"
//                 ]
//             },
//             "phone": "+16784010600",
//             "display_phone": "(678) 401-0600"
//         }
//     ],
//     "total": 1
// }

// let dummyYelp = {
//     "businesses": [
//         {
//             "id": "YYw-k-LjkrQt2HkCJ5iFUw",
//             "alias": "wicked-weed-asheville",
//             "name": "Wicked Weed",
//             "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/drTCIycsDpP_KtHchCsnPw/o.jpg",
//             "is_closed": false,
//             "url": "https://www.yelp.com/biz/wicked-weed-asheville?adjust_creative=MvuodG5DKzjWVXYRja2GlA&utm_campaign=yelp_api_v3&utm_medium=api_v3_phone_search&utm_source=MvuodG5DKzjWVXYRja2GlA",
//             "review_count": 1767,
//             "categories": [
//                 {
//                     "alias": "brewpubs",
//                     "title": "Brewpubs"
//                 }
//             ],
//             "rating": 4,
//             "coordinates": {
//                 "latitude": 35.591706,
//                 "longitude": -82.551034
//             },
//             "transactions": [],
//             "price": "$$",
//             "location": {
//                 "address1": "91 Biltmore Ave",
//                 "address2": "",
//                 "address3": "",
//                 "city": "Asheville",
//                 "zip_code": "28801",
//                 "country": "US",
//                 "state": "NC",
//                 "display_address": [
//                     "91 Biltmore Ave",
//                     "Asheville, NC 28801"
//                 ]
//             },
//             "phone": "+18285759599",
//             "display_phone": "(828) 575-9599"
//         }
//     ],
//     "total": 1
// }

// let dummyBrewery = {
//     "id": 2183,
//     "name": "Red Hare Brewing Company",
//     "brewery_type": "micro",
//     "street": "1998 Delk Industrial Blvd SE",
//     "city": "Marietta",
//     "state": "Georgia",
//     "postal_code": "30067-8904",
//     "country": "United States",
//     "longitude": "-84.4957563035449",
//     "latitude": "33.92440825",
//     "phone": "6784010600",
//     "website_url": "http://www.redharebrewing.com",
//     "updated_at": "2018-08-24T00:29:23.424Z",
//     "tag_list": []
// }
// const dummyCurrentLocation = [33.9526,-84.5499]

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
const mapDiv = document.querySelector('[data-mapall]')


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

goButton.addEventListener('click', giveApiInfo);

function giveApiInfo() {
    // console.log(currentCity.value)
    // console.log(currentState.value)
    // console.log(currentRadius.value)

    //// unhide when divs are updated!!!
    searchDiv.classList.add('hidden');
    runningDiv.classList.remove('hidden');

    inputToObject(currentCity.value, currentState.value, currentRadius.value).then(function (result){
                    /////////////////
                    // Cheat Sheet //
                    /////////////////
        // result[0] is the yelpObject about the brewery
        // result[1] is the user distance from the brewery
        // result[2] is the brewery website
        makeBrewery(result);
        let map;
        let service;
        let infoWindow;
        let breweryName = result[0].name;
        initMap(breweryName);

    });

    // makeBrewery(dummyYelp)
}

function showResult() {
    mapDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
}


//////////////////////////////////////////////////////////
///////////////// POPULATE RESULTS ///////////////////////
//////////////////////////////////////////////////////////


function makeBrewery(brewInfo) {
    //// unhide when divs are updated!!!
    runningDiv.classList.add('hidden');
    mapDiv.classList.remove('hidden');
    breweryPicture.setAttribute('src', brewInfo[0].image_url);
    breweryName.textContent = brewInfo[0].name;
    breweryPhone.textContent = brewInfo[0].display_phone;
    breweryAddress.textContent = `${brewInfo[0].location.address1}\n\r${brewInfo[0].location.city}, ${brewInfo[0].location.state} ${brewInfo[0].location.zip_code}`;
    breweryAddress.setAttribute('href', `https://www.google.com/maps?saddr=My+Location&daddr=${breweryAddress.textContent}`)
    breweryWebsite.textContent = brewInfo[2];
    breweryWebsite.setAttribute('href' ,brewInfo[2].website_url);
    breweryReview.setAttribute('src', `./../img/${brewInfo[0].rating}pint.png`);
    breweryHours.textContent = closedOrNot(brewInfo[0].is_closed);
    breweryDistance.textContent = `${brewInfo[1]} miles away`;
}

// checks truthiness of open status of brewery
function closedOrNot(status) {
    if (status === false) {
        return 'Closed Now';
    } else {
        return 'Open Now';
    }
}

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