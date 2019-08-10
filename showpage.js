// Keep track of search scroll for mobile.
// After scrolling on trail page, the scroll position is lost on the search page and is disorienting.
window.searchScroll = 0;

// Keep track of whether the search page is active to know when to save & restore the scroll position.
window.showingSearchPage = false;

$(function() {
	if(isDesktop())
		showAppInfoPage();
	else
		showSearchPage();
});


function isMobile() {
	return !isDesktop();
}

function isDesktop() {
	return $(window).width() >= 1025;
}

// Show the app landing/info page
function showAppInfoPage() {
	if(window.showingSearchPage) {
		window.searchScroll = window.scrollY;
		window.showingSearchPage = false;
	}
	
	$(".trail_info").addClass("d-none");
	$(".app_info").removeClass("d-none");
	
	$("#search_view_container").removeClass("active_view");
	$("#trail_view_container").addClass("active_view");
	
	if(isMobile())
		window.scrollTo(0,0);
}

// Show the trail info page
function showTrailPage() {
	if(window.showingSearchPage) {
		window.searchScroll = window.scrollY;
		window.showingSearchPage = false;
	}
	
	$(".trail_info").removeClass("d-none");
	$(".app_info").addClass("d-none");
	
	$("#search_view_container").removeClass("active_view");
	$("#trail_view_container").addClass("active_view");
	
	if(isMobile())
		window.scrollTo(0,0);
}

// Show the search page (only relevant for mobile where each page goes fullscreen)
function showSearchPage() {	
	$("#search_view_container").addClass("active_view");
	$("#trail_view_container").removeClass("active_view");

	window.showingSearchPage = true;
	if(isMobile())
		window.scrollTo(0,window.searchScroll);
	
	$("#search_button").val(isDesktop()?"Search For Trails":"Search");
}

// The back button on the trail page for mobile
$(".back_to_search_button").click(function(){
	showSearchPage();
});

// The "?" app info button to show the landing page
$("#app_info_button").click(function(){
	showAppInfoPage();
});