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

// adds the elements that will be updated from api
const breweryPicture = document.querySelector('[data-bpictureimg]');
const breweryName = document.querySelector('[data-breweryname]');
const breweryPhone = document.querySelector('[data-breweryphone]');
const breweryAddress = document.querySelector('[data-breweryaddress]');
const breweryWebsite = document.querySelector('[data-brewerywebsite]');
const breweryReview = document.querySelector('[data-breweryreview]');
const breweryHours = document.querySelector('[data-breweryhours]');
const breweryDistance = document.querySelector('[data-brewerydistance]');

breweryPicture.setAttribute('src', dummyYelp.image_url);
breweryName.textContent = dummyYelp.name;
breweryPhone.textContent = dummyYelp.display_phone;
breweryAddress.innerHTML = `${dummyYelp.location.address1}<br>${dummyYelp.location.city}, ${dummyYelp.location.state} ${dummyYelp.location.zip_code}`;
breweryWebsite.setAttribute('href' ,dummyBrewery.website_url);
breweryReview.textContent = dummyYelp.rating;
breweryHours.textContent = closedOrNot(dummyYelp.is_closed);
breweryDistance.textContent = `${convertDistance(dummyCurrentLocation, dummyBrewery)} miles away`;

// checks truthiness of open status of brewery
function closedOrNot(status) {
    if (status) {
        return 'Closed Now';
    } else {
        return 'Open Now';
    }
}

// gets picture of brewery
function getBrewPic(pic) {
    // bring in pic
    // change href of breweryPicture
    // return
}

// converts phone number to display
// function formatPhoneNumber(number) {
//     return `(${number.substr(0,3)}) ${number.substr(3,3)}-${number.substr(6,4)}`
// }

// finds distance from city to brewery
function convertDistance(current, brew) {
    // converts lat and long of brewery to numbers
    let brewLat = parseFloat(brew.latitude);
    let brewLong = parseFloat(brew.longitude);
    // does the distance formula
    let distance = Math.sqrt(Math.pow((current[0] - brewLat),2) + Math.pow((current[1] - brewLong),2));
    // converts degrees to miles
    let miles = distance * 68.703
    // returns with 1 decimal place
    return Math.round(miles * 10) / 10;
}
