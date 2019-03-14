
let checkedValue = document.querySelector('[data-brewpub]');
console.log(checkedValue);

checkedValue.addEventListener('click',whatvalue);

function whatvalue(){
    console.log(checkedValue.checked);  /* returns true or false */
}

const URL = "data/breweries_pretty.json";
let breweries = [];

fetch(URL)
        .then(function(response) {return response.json();})
            .then(function(data) {
                // console.log(typeof(data));
                //do something with the data
                // console.log(data);
                breweries = data;
                localStorage.setItem('breweries',JSON.stringify(data));
                // console.log(breweries);
                // return data;
                // console.log(coffeeData['ajsdklf#@jdkf.sldjfl']);
                //write it to local storage
                let states= {};
                //create dictionary of 50 states that equals an array of dictionaries.
                breweries.forEach(pub => {
                    // console.log(pub);
                    if (states[pub.state]) {
                        states[pub.state].push(pub.city);

                    }
                    else {
                        states[pub.state] = [pub.city];
                        // states[pub.state].push(pub.city);
                    }
                    
                })
                
                // states.push( pub.state);
                console.log(states);
                allstates = Object.keys(states);
                allstates.forEach (eachstate => {
                    states[eachstate] = [...new Set(states[eachstate])];
                    states[eachstate].sort();
                });

            
            });
// console.log(breweries);
// console.log(typeof(breweries));