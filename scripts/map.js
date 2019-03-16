function initMap() {
    const homeBase = {lat: 33.848555, lng: -84.373724};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: homeBase // We'll want this to be the user's city lat/long
    });

    // import JSON of all the breweries info

    // probably a for loop here to iterate over breweries information
        var contentString = '<div id="content">'+ // in loop
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">ATV</h1>'+
            '<div id="bodyContent">'+
            '<p><b>ATV</b>, better known as Atlanta Tech Village, is the home ' +
            'of DigitalCrafts students as they weep freely into VS Code when asyncronous'+
            ' code misbehaves. The 4th floor of the building is infamous for its reliably'+
            ' broken coffee machine and the worst selection of vittles of all the floors.'+
            ' <b>However,</b> impressive feats of dumb-luck-coding have been witnessed in'+
            ' this hallowed space. Code fairies have been known to bless the area and are'+
            ' sacred to beleaguered coders who dumbly gape at their monitors.</p>'+
            '<p>Attribution: ATV <a href="https://atlantatechvillage.com/</a></p>'+
            '</div>'+
            '</div>';
    
        var infowindow = new google.maps.InfoWindow({ // in loop
        content: contentString
        });
    
        var marker = new google.maps.Marker({ // in loop
        position: homeBase, // this is the brewery's lat/lng 
        map: map,
        title: 'ATV' // brewery name
        });
        marker.addListener('click', function() { // in loop 
            // eventListener might need to be refactored if want hover state? how would that work on mobile?
            // alternatively, maybe the event-listened element is actually in the marker description that pops up?
            // which would then take the user to the card for that brewery's complete info??
        infowindow.open(map, marker);
        });
}