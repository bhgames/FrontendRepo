function RC_UI(bldgInfo) {
	if(!bldgInfo.prot) {
		var getprot = new make_AJAX();
		getprot.callback = function(response) {
								bldgInfo.prot = 0;
								bldgInfo.prot = parseInt(response.match(/\d+/g)[0]);
								
								$("#ResC_protectedAmnts .ResCTotalProtection").each(function(i,el) {
									$(el).text(bldgInfo.prot);
								});
								
								$("body").trigger("resUpdate");
								$("#BUI_bldgContent").fadeIn();
							};
		getprot.get("reqtype=command&command=bf.getCacheEffectToString("+player.curtown.townID+");");
	} else {
		$("#ResC_protectedAmnts .ResCTotalProtection").each(function(i,el) {
			$(el).text(bldgInfo.prot);
		});
		
		$("body").trigger("resUpdate");
		$("#BUI_bldgContent").fadeIn();
	}
	
	$("body").bind("resUpdate.RC",function() {
		if(currUI !== draw_bldg_UI||BUI.active.name[0] != "Resource Cache") {
			$("body").unbind("resUpdate.RC");
			return false;
		}
		if(bldgInfo.prot) {
			var ResC = $("#ResC_protectedAmnts").clone();
			
			var resProtected = ResC.find(".ResCResProtected").each(function(i,el) {
									if(player.curtown.res[i] > bldgInfo.prot) {
										$(el).text(bldgInfo.prot);
									} else {
										$(el).text(player.curtown.res[i]);
									}
								});
			ResC.find(".ResCFillBar").each(function(i,el) {
				$(el).css("width",Math.round(resProtected.eq(i).text()/bldgInfo.prot*100)+"%");
			});
			
			$("#ResC_protectedAmnts").replaceWith(ResC);
		}
	});
}