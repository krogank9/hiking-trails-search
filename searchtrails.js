$(function() {
	// When the app starts, make a call to IP geolocation API to get user location.
	// If success, autofill the search box with their location and lookup nearby trails in hikingproject
	// If fail, internet probably down but still try to lookup nearby trails with the default search value (Philadelphia)
	$.ajax({
		dataType: "json",
		url: "//extreme-ip-lookup.com/json/",
		success: function(json) {
			if (json.city && json.region) {
				$("#search_text").val(json.city + ", " + json.region);
			}
			showSearchResults($("#search_text").val());
		},
		error: function() {
			showSearchResults($("#search_text").val());
		}
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
	return queryItems.join("&");
}

function queryToLatLong(query, cb) {

	let geocoder = new google.maps.Geocoder();

	geocoder.geocode( { "address": encodeURIComponent(query)}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			window.searchLat = results[0].geometry.location.lat();
			window.searchLon = results[0].geometry.location.lng();

			cb(window.searchLat, window.searchLon);
		}
		else {
			cb(0,0,true);
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
	};
	let formattedParams = formatQueryParameters(queryParams);
	fetch("https://www.hikingproject.com/data/get-trails?"+formattedParams)
		.then(function(response){
			if(response.ok) {
				return response.json();
			}
			else {
				throw new Error(response.statusText);
			}
		})
		.then(function(json){
			// Re-sort json as hiking project doesn't sort by exact distance between lat/lon's
			json.trails = sortTrailsByLatLong(json.trails, lat, lon);
			cb(json);
		})
		.catch(function(err) {
			// Callback with null to signify there was a problem contact hiking api.
			cb(null);
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
	return "<ul>\n"+trailsHTML.join("\n\t")+"\n</ul>";
}

function showSearchResults(query) {
	queryToLatLong(query, function(lat, lon, error){
		if(error) {
			$("#search_results").html("<p>No trails found! Please try another search query.</p>");
			return;
		}
		
		getNearbyTrails(lat, lon, function(json) {
			if(json === null) {
				$("#search_results").html("<p>There was a problem contacting the hikingproject.com API. Please try again later.</p>");
				return;
			}
			else if(json["trails"].length == 0) {
				$("#search_results").html("<p>No trails found! Please try another search query.</p>");
				return;
			}
			let resultsHTML = trailsJSONToHTML(json);
			
			$("#search_results").html(resultsHTML);
		});
	});
}

$("#search_results").on("click", "li", function(e) {
	let b64 = $(this).data("parkjson");
	let json = JSON.parse(decodeURIComponent(unescape(b64)));
	displayTrail(json);
	
	showTrailPage();
});
