function mine_UI(bldgInfo) {
	$("#BUI_deconButton").addClass("noDe");  //mines can't be deconstructed
			
	var path = "";
	var i = 0;
	var bpType = '';
	switch(bldgInfo.type) {
		case "Metal Mine":
			bpType = "metal";
			path = "SPFrames/Buildings/UI/metal-icon-black.png";
			break;
		case "Timber Field":
			bpType = "timber";
			path = "SPFrames/Buildings/UI/wood-icon-black.png";
			i = 1;
			break;
		case "Crystal Mine":
			bpType = "crystal";
			path = "SPFrames/Buildings/UI/crystal-icon-black.png";
			i = 2;
			break;
		case "Farm":
			bpType = "food";
			path = "SPFrames/Buildings/UI/food-icon-black.png";
			i = 3;
			break;
	}
	$("#Mine_typePic").attr("src",path);
	$("#Mine_production").html(Math.ceil(player.curtown.resInc[i] * 3600) + "<span>   per Hour</span><div id='Mine_prodInc' class='useBP'></div>");
	$("#Mine_resEffect span").text(Math.round(player.curtown.resEffects[i] * 100) + "%");
	if(player.TPR) {
		$("#Mine_taxRate div").html("-"+Math.ceil((player.curtown.resInc[i] * 3600)*player.TPR.taxRate) + "<span>   per Hour</span>").parent().css("display","block");
	}
	if(i==3) {
		$("#Mine_foodCon div").text(player.curtown.foodConsumption);
	} else {
		$("#Mine_foodCon").css("display","none");
	}
	
	$("#BUI_bldgContent").fadeIn();
	
	$(".useBP").unbind("click").click(function() {
		display_message("Use BP - Resource Boost","Resource Boost increases this mine type's output by 25% for one week.  Costs <span style='font-weight:bold;'>50BP</span><br/><br/>Are you sure?<div style='text-align: right;'>Current BP:"+player.research.bp+"</div>",
						function() {
							display_output(false,"Purchasing "+bpType+" Resource Boost...");
							var useBP = new make_AJAX();
							
							useBP.callback = function() {
												var success = useBP.responseText.split(";")[0];
												if(success.match(/true/)) {
													display_output(false,"Success!");
													load_player(false,true,true);
												} else {
													if(success.indexOf(":")>=0) success = success.split(":")[1];
													display_output(true,success,true);
												}
											};
							
							useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP("+bpType+");");
						});
	});
}