function MS_UI(bldgInfo) {
	if(bldgInfo.bunkerMode != 0 || bldgInfo.refuelTicks != 0) {
		$("#MS_status div").html("En route. ("+bldgInfo.refuelTicks+","+bldgInfo.bunkerMode+")");
	} else { 
		$("#MS_status div").html("Standing By");
	}
	$("#MS_nukeDamage div").html(bldgInfo.lvl+" building levels");
	$("#MS_troopDamage div").html((bldgInfo.lvl*5)+"% unit death");
	
		//the original version of the following equations was: bldgInfo.lvl*0.05*7
	$("#MS_EMPduration div").html(Math.round(bldgInfo.lvl*35)/100+" days");
	$("#MS_falloutDuration div").html(Math.round(bldgInfo.lvl*35)/100+" days");

	$("#BUI_bldgContent").fadeIn();
	
	$("#MS_launch").unbind("click").click(function(){
		if(!$(this).hasClass("noLaunch")) {
			var launch = new make_AJAX();
			launch.callback = function(response) {
				if(response.match(/true/)) {
					load_player(false,true,true);
				} else {
					$("#MS_launch").addClass("noLaunch");
					$("#MS_fail").html(response.split(":")[1]);
				}
			};
			launch.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".launchNuke("+bldgInfo.id+","+$("#MS_x").val()+","+$("#MS_y").val()
						+($("#MS_nukeMode").val()=="GroundBurst"?",false":",true")+");");
		}
	});
	var typeCheck = 0;
	$("#MS_launchNuke input").unbind("keyup").keyup(function(){
		if(isNaN($(this).val())) { 
			$(this).val(0);
		}
		clearTimeout(typeCheck);
		typeCheck = setTimeout(function() {
			can_launch(bldgInfo.id);
			},250);
	}).unbind("mouseup").mouseup(function(){
		$(this).keyup();
	});
	$("#MS_nukeMode").unbind("change").change(function(){
		can_launch(bldgInfo.id);
	});
}

function can_launch(id) {
	var canLaunch = new make_AJAX();
	canLaunch.callback = function(response) {
		if(response.match(/true/i)) {
			$("#MS_launch").removeClass("noLaunch");
			$("#MS_fail").html("");
		} else {
			$("#MS_launch").addClass("noLaunch");
			$("#MS_fail").html(response.split(":")[1]);
		}
	};
	canLaunch.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".canLaunchNuke("+id+","+$("#MS_x").val()+","+$("#MS_y").val()
						+($("#MS_nukeMode").val()=="GroundBurst"?",false":",true")+");");
}