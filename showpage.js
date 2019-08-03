window.showSearch = true;

function updateShowPages() {
	$("#search_page_container").css("display",window.showSearch?"block":"none");
	$("#trail_page_container").css("display",window.showSearch?"none":"block");
}

$("#back_to_search_button").click(function(){
	window.showSearch = true;
	updateShowPages();
});

$(function() {
	updateShowPages();
});
