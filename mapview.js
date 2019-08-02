var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 0, lng: 0},
		zoom: 15,
		zoomControl: true,
		disableDefaultUI: true,
		zoomControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		mapTypeId: 'hybrid'
	});
}
initMap();
