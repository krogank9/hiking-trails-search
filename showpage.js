window.searchActive = true;

function updateActiveView() {
	if(window.searchActive) {
		$("#search_view_container").addClass("active_view");
		$("#trail_view_container").removeClass("active_view");
	}
	else {
		$("#search_view_container").removeClass("active_view");
		$("#trail_view_container").addClass("active_view");
	}
}

$("#back_to_search_button").click(function(){
	window.searchActive = true;
	updateActiveView();
});

$(function() {
	updateActiveView();
});
