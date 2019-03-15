//////////////////////////////////////////////////////////
/////////////////////// DUMMY DATA ///////////////////////
//////////////////////////////////////////////////////////


let dummyYelp ={
    "id": "-X6YB-qWX-nFqOk8vpoPcQ",
    "alias": "red-hare-brewing-company-marietta",
    "name": "Red Hare Brewing Company",
    "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/_ArCLNvKl7WDfudGSf3QbQ/o.jpg",
    "is_claimed": true,
    "is_closed": false,
    "url": "https://www.yelp.com/biz/red-hare-brewing-company-marietta?adjust_creative=MvuodG5DKzjWVXYRja2GlA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=MvuodG5DKzjWVXYRja2GlA",
    "phone": "+16784010600",
    "display_phone": "(678) 401-0600",
    "review_count": 82,
    "categories": [
        {
            "alias": "breweries",
            "title": "Breweries"
        },
        {
            "alias": "brewingsupplies",
            "title": "Brewing Supplies"
        }
    ],
    "rating": 4,
    "location": {
        "address1": "1998 Delk Industrial Blvd",
        "address2": "",
        "address3": "",
        "city": "Marietta",
        "zip_code": "30067",
        "country": "US",
        "state": "GA",
        "display_address": [
            "1998 Delk Industrial Blvd",
            "Marietta, GA 30067"
        ],
        "cross_streets": ""
    },
    "coordinates": {
        "latitude": 33.92434,
        "longitude": -84.49576
    },
    "photos": [
        "https://s3-media2.fl.yelpcdn.com/bphoto/_ArCLNvKl7WDfudGSf3QbQ/o.jpg",
        "https://s3-media2.fl.yelpcdn.com/bphoto/fmou0E3vDCU5SgtJ38G0yg/o.jpg",
        "https://s3-media2.fl.yelpcdn.com/bphoto/cujTXoLs6teXI5-sUyEWEQ/o.jpg"
    ],
    "price": "$",
    "hours": [
        {
            "open": [
                {
                    "is_overnight": false,
                    "start": "1500",
                    "end": "2100",
                    "day": 1
                },
                {
                    "is_overnight": false,
                    "start": "1500",
                    "end": "2100",
                    "day": 2
                },
                {
                    "is_overnight": false,
                    "start": "1500",
                    "end": "2100",
                    "day": 3
                },
                {
                    "is_overnight": false,
                    "start": "1500",
                    "end": "2100",
                    "day": 4
                },
                {
                    "is_overnight": false,
                    "start": "1200",
                    "end": "2100",
                    "day": 5
                },
                {
                    "is_overnight": false,
                    "start": "1230",
                    "end": "1800",
                    "day": 6
                }
            ],
            "hours_type": "REGULAR",
            "is_open_now": true
        }
    ],
    "transactions": []
}

let dummyBrewery = {
    "id": 2183,
    "name": "Red Hare Brewing Company",
    "brewery_type": "micro",
    "street": "1998 Delk Industrial Blvd SE",
    "city": "Marietta",
    "state": "Georgia",
    "postal_code": "30067-8904",
    "country": "United States",
    "longitude": "-84.4957563035449",
    "latitude": "33.92440825",
    "phone": "6784010600",
    "website_url": "http://www.redharebrewing.com",
    "updated_at": "2018-08-24T00:29:23.424Z",
    "tag_list": []
}
const dummyCurrentLocation = [33.9526,-84.5499]

//////////////////////////////////////////////////////////
////////////////////// SELECTORS /////////////////////////
//////////////////////////////////////////////////////////

const currentCity = document.querySelector('[data-inputcity]');
const currentState = document.querySelector('[data-inputstate]')
const currentRadius = document.querySelector('[data-radius]')
const breweryPicture = document.querySelector('[data-bpictureimg]');
const breweryName = document.querySelector('[data-breweryname]');
const breweryPhone = document.querySelector('[data-breweryphone]');
const breweryAddress = document.querySelector('[data-breweryaddress]');
const breweryWebsite = document.querySelector('[data-brewerywebsiteatag]');
const breweryReview = document.querySelector('[data-breweryreviewimg]');
const breweryHours = document.querySelector('[data-breweryhours]');
const breweryDistance = document.querySelector('[data-brewerydistance]');
const goButton = document.querySelector('[data-gobutton]');
const searchDiv = document.querySelector('[data-search]');
const runningDiv = document.querySelector('[data-running]');
const resultDiv = document.querySelector('[data-result]');


//////////////////////////////////////////////////////////
///////////////// CITY/STATE FETCH ///////////////////////
//////////////////////////////////////////////////////////

let cityArray = {}

// fetches and returns cities from state selected
function goFetch() {
    // this fetches from json file
    fetch('../data/statecity.json')
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

goButton.addEventListener('click', giveApiInfo)

function giveApiInfo(city, state, dist) {
    // console.log(currentCity.value)
    // console.log(currentState.value)
    // console.log(currentRadius.value)

    breweryAPI(currentCity.value, currentState.value, currentRadius.value);

    //// unhide when divs are updated!!!
    // searchDiv.classList.add('hidden');
    // runningDiv.classList.remove('hidden');

    // jonathan will do this(take out when integrated)
    makeBrewery(dummyYelp);
}

//////////////////////////////////////////////////////////
///////////////// POPULATE RESULTS ///////////////////////
//////////////////////////////////////////////////////////


function makeBrewery(yelp) {
    //// unhide when divs are updated!!!
    // runningDiv.classList.add('hidden');
    // resultDiv.classList.remove('hidden');
    breweryPicture.setAttribute('src', yelp.image_url);
    breweryName.textContent = yelp.name;
    breweryPhone.textContent = yelp.display_phone;
    breweryAddress.textContent = `${yelp.location.address1}\n\r${yelp.location.city}, ${yelp.location.state} ${yelp.location.zip_code}`;
    breweryWebsite.textContent = dummyBrewery.website_url;
    breweryWebsite.setAttribute('href' ,dummyBrewery.website_url);
    breweryReview.setAttribute('src', `../img/${yelp.rating}pint.png`);
    breweryHours.textContent = closedOrNot(yelp.is_closed);
    breweryDistance.textContent = `${haversine(dummyCurrentLocation, yelp)} miles away`;

}

// checks truthiness of open status of brewery
function closedOrNot(status) {
    if (status) {
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

function haversine(current, brew){
    let brewLat = parseFloat(brew.coordinates.latitude);
    let brewLong = parseFloat(brew.coordinates.longitude);
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
    const R = 6371; // km 
    //has a problem with the .toRad() method below.
    let x1 = current[0]-brewLat;
    let dLat = x1.toRad();  
    let x2 = current[1]-brewLong;
    let dLon = x2.toRad();  
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
    Math.cos(brewLat.toRad()) * Math.cos(current[0].toRad()) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);  
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = (R * c) * 0.62137; // convert to miles
    

    // console.log(d);
    return Math.round(d * 10) / 10;
}