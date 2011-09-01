function bnkr_UI(bldgInfo) {

	get_curr_effect(bldgInfo);
	
	switch(bldgInfo.bunkerMode) {
		case 0:
			$("#BUI_extras").html("Defense Mode");
			break;
		case 1:
			$("#BUI_extras").html("VIP Mode");
			break;
		case 2:
			$("#BUI_extras").html("Resource Cache Mode");
			break;
	}
	$("#Bnkr_modeSelect option").each(function(i, v) {
		if(i == bldgInfo.bunkerMode) {
			v.selected = true;
		} else {
			v.selected = false;
		}
	});
	$("#BUI_extras");
	
	$("#Bnkr_assign").click(function() {
		changeMode = new make_AJAX();
		changeMode.callback = function(response) {
			if(response.match(/true/)) {
				get_curr_effect(bldgInfo);
			} else {
				var error = response.split(":");
				if(error.length==2) error=error[1];
				display_output(true,error);
				$("#BUI_fail").html(error);
			}
		};
		
		changeMode.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".changeBunkerMode("
						+ bldgInfo.lotNum + "," + player.curtown.townID + ","
						+ $("#Bnkr_modeSelect option:selected").index("#Bnkr_modeSelect option") + ");");
	});
}

function get_curr_effect(bldgInfo) {
	getCurModeFx = new make_AJAX();
	getCurModeFx.callback = function(response) {
		$("#Bnkr_curModeEffect").html(response);
	};
	getCurModeFx.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".getBunkerEffectToString("
						+ bldgInfo.lotNum + "," + player.curtown.townID + ");");
}