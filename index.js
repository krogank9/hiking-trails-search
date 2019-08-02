console.log('aaa') 
/*
 * Click the map to set a new location for the Street View camera.
 */
 
// https://www.hikingproject.com/data/get-trails?lat=39.94810&lon=-75.44600&maxDistance=100&maxResults=100&sort=distance&key=200536993-480f088125ad09c34aa10be8f6283e9c

 var parkAddress = "1023 Sycamore Mills Rd, Media, PA 19063";
 var parkLat = 0;
 var parkLng = 0;
 
var geocoder = new google.maps.Geocoder();
console.log('iii'):

geocoder.geocode( { 'address': parkAddress}, function(results, status) {
	
	console.log('iii'):

  if (status == google.maps.GeocoderStatus.OK) {
    window.parkLat = results[0].geometry.location.lat();
    window.parkLng = results[0].geometry.location.lng();
    
    window.berkeley = new google.maps.LatLng(parkLat, parkLng);
    
    console.log(`${window.parkLat}, ${window.parkLng}`);
    
    initialize();
  } 
}); 
 
var map;
var berkeley = new google.maps.LatLng(39.94810, -75.44600);
var sv = new google.maps.StreetViewService();

var panorama;

function initialize() {
	
	console.log('iii'):
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
    // Set the initial Street View camera to the center of the map
    sv.getPanoramaByLocation(berkeley, 5000, processSVData);
    ;
}

function processSVData(data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
        var marker = new google.maps.Marker({
            position: data.location.latLng,
            map: map,
            title: data.location.description
        });

        panorama.setPano(data.location.pano);
        panorama.setPov({
            heading: 270,
            pitch: 0
        });
        panorama.setVisible(true);

        google.maps.event.addListener(marker, 'click', function () {

            var markerPanoID = data.location.pano;
            // Set the Pano to use the passed panoID
            panorama.setPano(markerPanoID);
            panorama.setPov({
                heading: 270,
                pitch: 0
            });
            panorama.setVisible(true);
        });
    } else {
        alert('Street View data not found for this location.');
    }
}
