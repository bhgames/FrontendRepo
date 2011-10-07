function warehouse_UI(bldgInfo) {
	var i = 0;
	switch(bldgInfo.type) {
		case "Lumber Yard":
			i = 1;
			break;
		case "Crystal Repository":
			i = 2;
			break;
		case "Granary":
			i = 3;
			break;
	}
	$('#Ware_resCap').text(player.curtown.resCaps[i]);
			
	$("body").bind("resUpdate.Ware", function() {
			if(currUI !== draw_bldg_UI||BUI.active.name[0] != "Metal Warehouse") {
				$("body").unbind("resUpdate.Ware");
				return false;
			}
			
			var data = $("#Ware_resTotals").clone();
			
			data.children('#Ware_curRes').text(Math.round(player.curtown.res[i]));
			
			var perc = data.children('#Ware_resPerc').text(Math.floor((player.curtown.res[i]/player.curtown.resCaps[i]) * 10000)/10000).format({format:"###.00%", locale:"us"});
			data.find('#Ware_resPercBar').css("width",perc.text());
			
			$("#Ware_resTotals").replaceWith(data);
		}).trigger("resUpdate");
	
	$("#BUI_bldgContent").fadeIn();
}

////////////////////////////////////////////////////// Storage Yard UI //////////////////////////////////////////////////////
function SY_UI(bldgInfo) {
	$(".resCap").each(function(i, el) {
		$(el).text(player.curtown.resCaps[i]);
	});
	
	var time = Infinity;
	$.each(player.curtown.resInc, function(i,v) {
		if(v > 0) {
			if(time > 1/v) time = (1/v).clamp(0.2);
		}
	});
	
	if(!bldgInfo.prot) {
		var getprot = new make_AJAX();
		getprot.callback = function(response) {
								bldgInfo.prot = 0;
								bldgInfo.prot = parseInt(response.match(/\d+/g)[0]);
								
								$("#SY_resTotals .cacheCap").each(function(i,el) {
									$(el).text(bldgInfo.prot);
								});
								
								$("body").trigger("resUpdate");
								$("#BUI_bldgContent").fadeIn();
							};
		getprot.get("reqtype=command&command=bf.getCacheEffectToString("+player.curtown.townID+");");
	} else {
		$("#SY_resTotals .cacheCap").each(function(i,el) {
			$(el).text(bldgInfo.prot);
		});
		
		$("body").trigger("resUpdate");
		$("#BUI_bldgContent").fadeIn();
	}
	
	$("body").bind("resUpdate.SY", function() {
			if(currUI !== draw_bldg_UI||BUI.active.name[0] != "Storage Yard") {
				$("body").unbind("resUpdate.SY");
				return false;
			}
			var data = $("#SY_resTotals").clone();
			
			$.each(player.curtown.res, function(i,x) {
				if(i == 4) return false;
				
				data.find(".cacheRes").eq(i).text(function() {
													if(x>bldgInfo.prot) {
														return bldgInfo.prot;
													}
													return Math.round(x);
												});
				
				data.find('.curRes').eq(i).text(Math.round(x));
				
				var perc = data.find('.resPerc').eq(i).text(Math.floor((x/player.curtown.resCaps[i]) * 10000)/10000).format({format:"###.00%", locale:"us"});
				data.find('.resPercBar').eq(i).css({"width":perc.text()});
			});
			
			$("#SY_resTotals").replaceWith(data);
		}).trigger("resUpdate");
	
}