function initMap() {
    const homeBase = {lat: 33.848555, lng: -84.373724};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: homeBase
    });
  
    var contentString = '<div id="content">'+
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
  
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
  
    var marker = new google.maps.Marker({
      position: homeBase,
      map: map,
      title: 'ATV'
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }