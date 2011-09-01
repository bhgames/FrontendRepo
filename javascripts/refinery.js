function refinery_UI(bldgInfo) {
	var path = "";
	switch(bldgInfo.type) {
		case "Metal Refinery":
			path = "AIFrames/icons/MetalIcon.png";
			break;
		case "Timber Processing Plant":
			path = "AIFrames/icons/TimberIcon.png";
			break;
		case "Materials Research Center":
			path = "AIFrames/icons/PlasticIcon.png";
			break;
		case "Hydroponics Lab":
			path = "AIFrames/icons/FoodIcon.png";
			break;
	}
	$("#Ref_typePic").attr("src",path);
	$("#Ref_effect").html((bldgInfo.lvl*5)+"% increase");
	
	$("#BUI_bldgContent").fadeIn();
}