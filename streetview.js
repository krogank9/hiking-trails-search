window.sv = new google.maps.StreetViewService();
window.panorama;

$(function() {
    initialize();
});

function initialize() {
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
}

function setPanoramaLocation(lat, lon) {
	sv.getPanoramaByLocation(new google.maps.LatLng(lat, lon), 5000, processSVData);
}

function processSVData(data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
        panorama.setPano(data.location.pano);
        panorama.setPov({
            heading: 270,
            pitch: 0
        });
        panorama.setVisible(true);
    } else {
        //alert('Street View data not found for this location.');
    }
}



///////


