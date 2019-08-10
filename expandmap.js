function expandMapHeight() {
	let totalHeight = 0;

	$("#overlay").children().each(function(){
		totalHeight = totalHeight + $(this).outerHeight(true);
	});
	
	totalHeight = Math.max(totalHeight, $(window).height());
	
	//$("body").minHeight($("body").outerHeight());
	//$("#map").height(totalHeight);
	//$("#overlay").height(totalHeight);

/*
	$("#map").css('height',totalHeight+"px");
	$("#overlay").css('height',totalHeight+"px");
*/	
	
	//$("#overlay").minHeight($("body").outerHeight());
	//$("#overlay").css('min-height', $("body").outerHeight()+"px");
}
$(function() {
	expandMapHeight();
	$(window).resize(function(){
		expandMapHeight();
	});
});
