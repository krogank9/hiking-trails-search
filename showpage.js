function isDesktop() {
	return $(window).width() >= 1025;
}

function showAppInfoPage() {
	$(".trail_info").addClass("d-none");
	$(".trail_info").removeClass("d-block");
	
	$(".app_info").addClass("d-flex");
	$(".app_info").removeClass("d-none");
	
	$("#search_view_container").removeClass("active_view");
	$("#trail_view_container").addClass("active_view");
}

function showTrailPage() {
	$(".trail_info").addClass("d-block");
	$(".trail_info").removeClass("d-none");
	
	$(".app_info").addClass("d-none");
	$(".app_info").removeClass("d-flex");
	
	$("#search_view_container").removeClass("active_view");
	$("#trail_view_container").addClass("active_view");
}

function showSearchPage() {
	$("#search_view_container").addClass("active_view");
	$("#trail_view_container").removeClass("active_view");
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
