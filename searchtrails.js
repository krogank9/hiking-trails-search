$(function() {
	if($("#search_text").val())
		showSearchResults($("#search_text").val());
});
// handle form submission & display results
$("#search_form").submit(function(e){
	e.preventDefault();
	console.log('aa');
	showSearchResults($("#search_text").val());
});

function formatQueryParameters(params) {
	const queryItems = Object.keys(params)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryItems.join('&');
}

function queryToLatLong(query, cb) {

	var geocoder = new google.maps.Geocoder();

	geocoder.geocode( { 'address': query}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			console.log("aasd")
			window.searchLat = results[0].geometry.location.lat();
			window.searchLon = results[0].geometry.location.lng();

			cb(window.searchLat, window.searchLon);
		}
	});
}

function getNearbyTrails(lat, lon, cb) {
	let queryParams = {
		lat: lat,
		lon: lon,
		maxDistance: 100,
		maxResults: 50,
		"sort": "distance",
		key: "200536993-480f088125ad09c34aa10be8f6283e9c"
	}
	let formattedParams = formatQueryParameters(queryParams);
	fetch("https://www.hikingproject.com/data/get-trails?"+formattedParams)
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			cb(json);
		});
}

// distance between lat/lons in miles
function getDistanceBetweenLatLong(fromLat,fromLng,toLat,toLng) {
	let miles = google.maps.geometry.spherical.computeDistanceBetween(
		new google.maps.LatLng(fromLat, fromLng), 
		new google.maps.LatLng(toLat, toLng)
	) / 1609.34; // convert meters -> miles
	
	return parseFloat(miles.toFixed(1));
}

function JSONFromB64(b64) {
	return JSON.parse(atob(b64));
}

function trailsJSONToHTML(json) {
	let trailsHTML = json["trails"].map(function(trail){
		// encode park JSON info to base64 to be decoded when passed in li event callback
		return (
		`<li data-parkjson="${btoa(JSON.stringify(trail))}">
			<span class="name">${trail.name}</span>
			
			${getDistanceBetweenLatLong(window.searchLat,window.searchLon,trail.latitude,trail.longitude)} mi
			/
			${trail.location.split(",")[0]}
		</li>`);
	});
	return "\n\t"+trailsHTML.join("\n\t")+"\n"
}

function showSearchResults(query) {
	console.log('1')
	queryToLatLong(query, function(lat, lon){
		console.log('2')
		getNearbyTrails(lat, lon, function(json) {
			console.log('3')
			let resultsHTML = trailsJSONToHTML(json);
			console.log(json)
			$("#search_results ul").html(resultsHTML);
			console.log('4')
		});
	});
}


$("#search_results").on('click', "li", function(e) {
	console.log('a');
	let b64 = $(this).data('parkjson');
	let json = JSON.parse(atob(b64));
	console.log("JSON:");
	console.log(json);
	displayTrail(json);
	window.showSearch = false;
	updateShowPages();
});