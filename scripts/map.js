// Initialize and add the map
function initMap() {
    // The location of homeBase
    const homeBase = {lat: 33.848555, lng: -84.373724};
    // The map, centered at homeBase
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 16, center: homeBase});
    // The marker, positioned at homeBase
    let marker = new google.maps.Marker({position: homeBase, map: map});
}