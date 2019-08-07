let searchScroll = 0;
let showingScrollPage = false;

function isMobile() {
	return !isDesktop();
}

function isDesktop() {
	return $(window).width() >= 1025;
}

function showAppInfoPage() {
	if(showingScrollPage) {
		searchScroll = window.scrollY;
		showingScrollPage = false;
	}
	
	$(".trail_info").addClass("d-none");
	$(".app_info").removeClass("d-none");
	
	$("#search_view_container").removeClass("active_view");
	$("#trail_view_container").addClass("active_view");
	
	if(isMobile())
		window.scrollTo(0,0);
}

function showTrailPage() {
	if(showingScrollPage) {
		searchScroll = window.scrollY;
		showingScrollPage = false;
	}
	
	$(".trail_info").removeClass("d-none");
	$(".app_info").addClass("d-none");
	
	$("#search_view_container").removeClass("active_view");
	$("#trail_view_container").addClass("active_view");
	
	if(isMobile())
		window.scrollTo(0,0);
}

function showSearchPage() {	
	$("#search_view_container").addClass("active_view");
	$("#trail_view_container").removeClass("active_view");

	showingScrollPage = true;
	if(isMobile())
		window.scrollTo(0,searchScroll);
}

$(".back_to_search_button").click(function(){
	showSearchPage();
});

$("#app_info_button").click(function(){
	showAppInfoPage();
});

$(function() {
	if(isDesktop())
		showAppInfoPage();
	else
		showSearchPage();
});
