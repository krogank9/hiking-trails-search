var map;
var inited_map = false;

function setMapCenter(lat, lon) {
	if(!inited_map)
		initMap();
	map.setCenter({"lat":lat, "lng":lon});
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.9512, lng: -75.4524},
		zoom: 15,
		disableDefaultUI: true,
		zoomControl: false,
		mapTypeId: 'satellite'
	});
	inited_map = true;
}

$(function() {
	initMap();
});