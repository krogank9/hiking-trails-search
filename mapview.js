// Initialize the background map with a Google Maps satellite image.
// When a trail is clicked the map is moved to its location using setMapCenter

window.map = null;

$(function() {
	initMap();
});

function setMapCenter(lat, lon) {
	map.setCenter({"lat":lat, "lng":lon});
}

function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 39.9512, lng: -75.4524},
		zoom: 15,
		disableDefaultUI: true,
		zoomControl: false,
		mapTypeId: "satellite"
	});
}