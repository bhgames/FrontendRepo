function AP_UI(bldgInfo) {
	//handling for non-HTML5 compliant browsers
	if(!Modernizr.input.placeholder) {
		$("#AP_airshipName").val("Airship Name").unbind("focus").focus(function() {
			if($(this).val() == "Airship Name") $(this).val("");
		}).unbind("blur").blur(function() {
			if($(this).val() == "") $(this).val("Airship Name");
		});
	}
	
	$("#AP_currFuel span").html(bldgInfo.peopleInside);
	$("#AP_nextIn span").html(bldgInfo.ticksPerPerson - bldgInfo.ticksLeft);
	
	if(player.towns.length == player.research.townTech) {
		$("#AP_needTowns").css("display","block");
		$("#AP_makeAirship").css("display","none");
	}
	
	$.each(player.towns, function(i,v) {
		if(v.zeppelin) {
			if(v.x == player.curtown.x && v.y == player.curtown.y) {
				$("#AP_dockedAirships").append("<div class='airship'>\
												<div class='airshipName'>"+v.townName+"</div>\
												<div class='airshipFuel'>Airship Fuel: <span>"+v.fuelCells+" Cells</span></div>\
												<div class='refuelTime'>Next Fuel Cell loaded in: <span>"+bldgInfo.refuelTicks+"</span></div>\
												<div class='airshipRes'>Resources on Airship: <span>"
												+ v.res[0] + " <img src='AIFrames/icons/MetalIcon.png' alt='Metal' />"
												+ v.res[1] + " <img src='AIFrames/icons/TimberIcon.png' alt='Timber' />"
												+ v.res[2] + " <img src='AIFrames/icons/PlasticIcon.png' alt='Manufactured Materials' />"
												+ v.res[3] + " <img src='AIFrames/icons/FoodIcon.png' alt='Food' />"
												+"</span></div></div>");
			}
		}
	});
	
	$("#AP_buildAirship").unbind("click").click(function() {
		if($("#AP_airshipName").val() != "" && $("#AP_airshipName").val() != "Airship Name") {
			$("#AP_error").val("");
			var buildAirship = new make_AJAX();
			
			buildAirship.callback = function(response) {
				if(response.match(/false/)) {
					$("#AP_error").val(response.split(":")[1]);
				} else {
					load_player(player.league,true,true);
				}
			};
			
			buildAirship.get("reqtype=command&command="+player.command+".createAirship("+$("#AP_airshipName").val()+","+player.curtown.townID+");");
		}
	});
}

/*
	numPpl is the current amount of fuel in the appCodeName
	refuelTicks is the amount of time, in GCF ticks, until the next fuel cell is added to a docked Airship
*/