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

// When the search form with the user location is submitted, start the process of querying APIs to get trail search results
$("#search_form").submit(function(e){
	e.preventDefault();
	showSearchResults($("#search_text").val());
});

// Format an api query string from a params object with keys/values
function formatQueryParameters(params) {
	const queryItems = Object.keys(params)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
	return queryItems.join("&");
}

// Converts a textual user query to lat/long via Google's API. Can handle things like cities, states, zip codes.
function queryToLatLong(query, cb) {

	let geocoder = new google.maps.Geocoder();

	geocoder.geocode( { "address": encodeURIComponent(query)}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			window.searchLat = results[0].geometry.location.lat();
			window.searchLon = results[0].geometry.location.lng();
			
			// If successful, return the lat/lon in the callback
			cb(window.searchLat, window.searchLon);
		}
		else {
			// If failed to find a lat/lon return 0,0 with a true error status
			cb(0,0,true);
		}
	});
}

// Gets distance between lat/lon's in miles
function getDistanceBetweenLatLong(fromLat,fromLng,toLat,toLng) {
	let miles = google.maps.geometry.spherical.computeDistanceBetween(
		new google.maps.LatLng(fromLat, fromLng), 
		new google.maps.LatLng(toLat, toLng)
	) / 1609.34; // Google api returns meters. Convert meters -> miles
	
	// Return miles with up to 1 decimal place
	return parseFloat(miles.toFixed(1));
}

// Simple sort incorporating getDistanceBetweenLatLong for trail list
function sortTrailsByLatLong(trails, lat, lon) {
	return trails.sort(function(a,b){
		let distA = getDistanceBetweenLatLong(lat,lon, a.latitude,a.longitude);
		let distB = getDistanceBetweenLatLong(lat,lon, b.latitude,b.longitude);
		return distA - distB;
	});
}

// Query the hiking project API for trails within 250 miles of a lat/lon
function getNearbyTrails(lat, lon, cb) {
	let queryParams = {
		lat: lat,
		lon: lon,
		maxDistance: 250,
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

function shortenStateName(state) {
	var states = {
		'Alabama': 'AL', 'Alaska': 'AK', 'American Samoa': 'AS', 'Arizona': 'AZ',
		'Arkansas': 'AR', 'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT',
		'Delaware': 'DE', 'District Of Columbia': 'DC', 'Federated States Of Micronesia': 'FM',
		'Florida': 'FL', 'Georgia': 'GA', 'Guam': 'GU', 'Hawaii': 'HI', 'Idaho': 'ID',
		'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY',
		'Louisiana': 'LA', 'Maine': 'ME', 'Marshall Islands': 'MH', 'Maryland': 'MD',
		'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
		'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH',
		'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
		'North Dakota': 'ND', 'Northern Mariana Islands': 'MP', 'Ohio': 'OH', 'Oklahoma': 'OK',
		'Oregon': 'OR', 'Palau': 'PW', 'Pennsylvania': 'PA', 'Puerto Rico': 'PR', 'Rhode Island': 'RI',
		'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
		'Vermont': 'VT', 'Virgin Islands': 'VI', 'Virginia': 'VA', 'Washington': 'WA',
		'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
	};
	
	if( states.hasOwnProperty(state) ) {
		return states[state];
	}
	
	return state;
}

// Convert the hikingproject.com search json results to an HTML representation we can display the user
function trailsJSONToHTML(json) {
	let trailsHTML = json["trails"].map(function(trail){
		let distFromUser = getDistanceBetweenLatLong(window.searchLat,window.searchLon,trail.latitude,trail.longitude)
		
		// Neccessary to modify the JSON and put trail distance in as it is also displayed on the trail info page.
		trail["distFromUser"] = distFromUser;
		
		let city = trail.location.split(", ")[0];
		let region = shortenStateName(trail.location.split(", ").pop());
		
		let location = city  + ", " + region;
		
		// Set a reasonable max length to prevent crazy long city names stretching views
		// Ellipsis done in JS because double CSS ellipsis next to each other were causing different visual glitches on different browsers.
		// Easier to add here:
		let maxLen = "Philadelphia, PA   ".length;
		if(location.length > maxLen) {
			location = city.substring(0, maxLen).trim() + "...";
		}
		
		return (
		`<li data-parkjson="${encodeURIComponent(escape(JSON.stringify(trail)))}">
			<span class="name">${trail.name}</span>
			<span>
				<span class="search_dist">${distFromUser} mi</span>
				/
				<span class="search_location">
					${location}
				</span>
			</span>
		</li>`);
	});
	
	return "<ul>\n"+trailsHTML.join("\n\t")+"\n</ul>";
}

// Put all of the API query and JSON -> HTML functions together to show the search results to the user.
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

// When a search result list item is clicked, display it on the trail page and show to the user
$("#search_results").on("click", "li", function(e) {
	let b64 = $(this).data("parkjson");
	let json = JSON.parse(decodeURIComponent(unescape(b64)));
	displayTrail(json);
	
	showTrailPage();
});
