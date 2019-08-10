$(function() {
	$.getJSON("//extreme-ip-lookup.com/json/", function(json) {
		if (json.city && json.region) {
			$('#search_text').val(json.city + ", " + json.region);
		}
		else {
			$('#search_text').val("Philadelphia");
		}
		showSearchResults($("#search_text").val());
	});
});
// handle form submission & display results
$("#search_form").submit(function(e){
	e.preventDefault();
	showSearchResults($("#search_text").val());
});

function formatQueryParameters(params) {
	const queryItems = Object.keys(params)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryItems.join('&');
}

function queryToLatLong(query, cb) {

	let geocoder = new google.maps.Geocoder();

	geocoder.geocode( { 'address': query}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			window.searchLat = results[0].geometry.location.lat();
			window.searchLon = results[0].geometry.location.lng();

			cb(window.searchLat, window.searchLon);
		}
		else {
			cb(0,0,true);
			console.log("Error querying lat/long.");
		}
	});
}

function sortTrailsByLatLong(trails, lat, lon) {
	return trails.sort(function(a,b){
		let distA = getDistanceBetweenLatLong(lat,lon, a.latitude,a.longitude);
		let distB = getDistanceBetweenLatLong(lat,lon, b.latitude,b.longitude);
		return distA - distB;
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
			json.trails = sortTrailsByLatLong(json.trails, lat, lon);
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
		let distFromUser = getDistanceBetweenLatLong(window.searchLat,window.searchLon,trail.latitude,trail.longitude)
		trail["distFromUser"] = distFromUser; // Put in JSON to display on results page
		
		// encode park JSON info to base64 to be decoded when passed in li event callback
		return (
		`<li data-parkjson="${encodeURIComponent(escape(JSON.stringify(trail)))}">
			<span class="name">${trail.name}</span>
			<span class="dist">
				${distFromUser} mi
				/
				${trail.location.split(",")[0]}
			</span>
		</li>`);
	});
	return "\n\t"+trailsHTML.join("\n\t")+"\n"
}

function showSearchResults(query) {
	console.log("Querying google for lat/long...");
	queryToLatLong(query, function(lat, lon, error){
		if(error) {
			$("#search_results ul").html("No trails found! Please try another search query.");
			return;
		}
		console.log("Querying hiking API for nearby trails...");
		getNearbyTrails(lat, lon, function(json) {
			if(json["trails"].length == 0) {
				$("#search_results ul").html("No trails found! Please try another search query.");
				return;
			}
			let resultsHTML = trailsJSONToHTML(json);
			console.log(json)
			$("#search_results ul").html(resultsHTML);
		});
	});
}


$("#search_results").on('click', "li", function(e) {
	console.log('a');
	let b64 = $(this).data('parkjson');
	let json = JSON.parse(decodeURIComponent(unescape(b64)));
	console.log("JSON:");
	console.log(json);
	displayTrail(json);
	
	showTrailPage();
});
