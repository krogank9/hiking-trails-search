// Google maps street view box used to display a preview of the park given its lat/lon

window.sv = new google.maps.StreetViewService();
window.panorama;

$(function() {
    initSV();
});

function initSV() {
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
}

function setPanoramaLocation(lat, lon) {
	sv.getPanoramaByLocation(new google.maps.LatLng(lat, lon), 5000, processSVData);
}

// Called on init and whenever street view location is changed.
function processSVData(data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
		// If google found a street view for our location, update the panorma
        panorama.setPano(data.location.pano);
        panorama.setPov({
            heading: 270,
            pitch: 0
        });
        panorama.setVisible(true);
		$("#pano").parent().css("display","inline-block");
    } else {
		// Failed to find google street view for given location.
		// It's possible for this to happen in rare cases if there is no street view
		//  or 360 degree pictures taken nearby, but not likely.
		// It's more likely to happen as a result of an internet connection failure though.
		// Either way, just hide the street view camera if it does happen.
		$("#pano").parent().css("display","none");
    }
}
