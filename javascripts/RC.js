function RC_UI(buildingInfo) {
	if(!buildingInfo.prot) {
		var getprot = new make_AJAX();
		getprot.callback = function(response) {
								buildingInfo.prot = 0;
								$.each(response.split(" "), function(i,x) {
									buildingInfo.prot = parseInt(x);
									if(!isNaN(buildingInfo.prot)) return false;
								});
								$("body").trigger("resUpdate");
								$("#BUI_bldgContent").fadeIn();
							};
		getprot.get("reqtype=command&command=bf.getCacheEffectToString("+player.curtown.townID+");");
	} else {
		$("body").trigger("resUpdate");
		$("#BUI_bldgContent").fadeIn();
	}
	$("body").bind("resUpdate",function() {
		if(currUI !== draw_bldg_UI||BUI.active.name[0] != "Resource Cache") {
			$("body").unbind("resUpdate",this);
			return false;
		}
		if(buildingInfo.prot) {
			var ResC = $("#ResC_protectedAmnts").clone();
			
			ResC.find(".ResCTotalProtection").each(function(i,el) {
				$(el).text(buildingInfo.prot);
			});
			
			var resProtected = ResC.find(".ResCResProtected").each(function(i,el) {
									if(player.curtown.res[i] > buildingInfo.prot) {
										$(el).text(buildingInfo.prot);
									} else {
										$(el).text(player.curtown.res[i]);
									}
								});
			ResC.find(".ResCFillBar").each(function(i,el) {
				$(el).css("width",Math.round(resProtected.eq(i).text()/buildingInfo.prot*100)+"%");
			});
			
			$("#ResC_protectedAmnts").replaceWith(ResC);
		}
	});
}