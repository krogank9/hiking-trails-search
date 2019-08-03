window.showSearch = true;

function updateShowPages() {
	$("#search_page_container").css("display",window.showSearch?"block":"none");
	$("#trail_page_container").css("display",window.showSearch?"none":"block");
}

$(function() {
	updateShowPages();
});
