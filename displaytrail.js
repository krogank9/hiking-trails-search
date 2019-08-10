function displayTrail(json) {
	$(".title").html(json.name);
	//$(".title").attr("href",json.url);
	
	$(".location").html(json.location);
	
	$(".distFromUser").html(json.distFromUser + " miles");
	
	$(".length").html(json.length);
	
	$(".ascent").html(json.ascent+"'");
	$(".descent").html(json.descent+"'");
	
	let difficulty_map = {
		"green":"Easy <img class='difficulty-img' src='img/green.svg'>",
		"greenBlue":"Easy/Intermediate <img class='difficulty-img' src='img/greenBlue.svg'>",
		"blue":"Intermediate <img class='difficulty-img' src='img/blue.svg'>",
		"blueBlack":"Intermediate/Difficult <img class='difficulty-img' src='img/blueBlack.svg'>",
		"black":"Difficult <img class='difficulty-img' src='img/black.svg'>",
		"dblack":"Extremely Difficult <img class='difficulty-img' src='img/dblack.svg'>",
	};
	$(".difficulty").html(difficulty_map[json.difficulty]||"Unknown");
	
	let num_stars = Math.floor(parseFloat(json.stars)||0);
	let add_half = (parseFloat(json.stars) - num_stars) >= 0.5;
	let num_empty = 5 - num_stars - (add_half?1:0);
	let stars_arr = Array(num_stars).fill("<img class='star' src='img/star.svg'>")
					.concat(add_half?["<img class='star' src='img/half star.svg'>"]:[])
					.concat(Array(num_empty).fill("<img class='star' src='img/empty star.svg'>"));
	$(".rating").html(stars_arr.join(""));
	$(".star").css({opacity: 0});
	$(".star").each(function(index){
		$(this).delay(index*100).animate({opacity: 1},300);
	});
	
	$(".description").html(json.summary);
	$(".read-more").attr("href",json.url);
	
	$(".preview").attr("src",json.imgMedium);
	$(".preview").parent().css("display",json.imgMedium?"inline-block":"none");
	
	$(".maps-link").attr("href","https://www.google.com/maps/search/?api=1&query="+json.latitude+","+json.longitude);
	//$(".maps-link").html("Get Directions ("+json.latitude+", "+json.longitude+")");
	
	setPanoramaLocation(json.latitude, json.longitude);
	
	setMapCenter(json.latitude, json.longitude);
}

/*
let testJSON = {
	"id": 7066091,
	"name": "Ridley Creek SP: Yellow-White-Yellow Loop", //x
	"type": "Featured Hike",
	"summary": "A nice, rolling singletrack loop in southeastern PA.", //x
	"difficulty": "blue", //
	"stars": 3.5, //x
	"starVotes": 4,
	"location": "Lima, Pennsylvania", //x
	"url": "https:\/\/www.hikingproject.com\/trail\/7066091\/ridley-creek-sp-yellow-white-yellow-loop", //x
	"imgSqSmall": "https:\/\/cdn-files.apstatic.com\/hike\/7054689_sqsmall_1555707359.jpg",
	"imgSmall": "https:\/\/cdn-files.apstatic.com\/hike\/7054689_small_1555707359.jpg",
	"imgSmallMed": "https:\/\/cdn-files.apstatic.com\/hike\/7054689_smallMed_1555707359.jpg",
	"imgMedium": "https:\/\/cdn-files.apstatic.com\/hike\/7054689_medium_1555707359.jpg", //
	"length": 5.5, //x
	"ascent": 589, //x
	"descent": -590, //x
	"high": 407,
	"low": 212,
	"longitude": -75.4524,
	"latitude": 39.9512,
	"conditionStatus": "Unknown",
	"conditionDetails": null,
	"conditionDate": "1970-01-01 00:00:00"
};

displayTrail(testJSON);
*/