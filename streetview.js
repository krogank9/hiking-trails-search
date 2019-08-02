/*
 * Click the map to set a new location for the Street View camera.
 */
 
// https://www.hikingproject.com/data/get-trails?lat=39.94810&lon=&maxDistance=100&maxResults=100&sort=distance&key=200536993-480f088125ad09c34aa10be8f6283e9c

$(function() {
    initialize();
});
 
var map;
var sv = new google.maps.StreetViewService();

var panorama;

function initialize() {
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
    //setPanoramaLocation(38.94810, -75.44600);
}

function setPanoramaLocation(lat, lon) {
	sv.getPanoramaByLocation(new google.maps.LatLng(lat, lon), 5000, processSVData);
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



///////

