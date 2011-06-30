function warehouse_UI(bldgInfo) {
	$("#Ware_resTotals").fadeOut(100, function() {
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
				
		$("body").bind("resUpdate", function() {
				if(currUI !== draw_bldg_UI||BUI.active.name[0] != "Metal Warehouse") {
					$("body").unbind("resUpdate",this);
					return false;
				}
				
				var data = $("#Ware_resTotals").clone();
				
				data.children('#Ware_curRes').text(Math.round(player.curtown.res[i]));
				
				var perc = data.children('#Ware_resPerc').text(Math.round((player.curtown.res[i]/player.curtown.resCaps[i]) * 100)/100).format({format:"###.00%", locale:"us"});
				data.find('#Ware_resPercBar').css("width",perc.text());
				
				$("#Ware_resTotals").replaceWith(data);
			}).trigger("resUpdate");
			
		$("#Ware_resTotals").fadeIn(100);
	});
}

////////////////////////////////////////////////////// Storage Yard UI //////////////////////////////////////////////////////
function SY_UI() {
	$("#SY_resTotals").fadeOut(100, function() {
		$(".resCap").each(function(i, el) {
			$(el).text(player.curtown.resCaps[i]);
		});
		
		var time = Infinity;
		$.each(player.curtown.resInc, function(i,v) {
			if(v > 0) {
				if(time > 1/v) time = (1/v).clamp(0.2);
			}
		});
		
		$("body").bind("resUpdate", function() {
				if(currUI !== draw_bldg_UI||BUI.active.name[0] != "Storage Yard") {
					$("body").unbind("resUpdate",this);
					return false;
				}
				var data = $("#SY_resTotals").clone();
				
				$.each(player.curtown.res, function(i,x) {
					if(i == 4) return false;
					data.find('.curRes').eq(i).text(Math.round(x));
					
					var perc = data.find('.resPerc').eq(i).text(Math.round((x/player.curtown.resCaps[i]) * 100)/100).format({format:"###.00%", locale:"us"});
					data.find('.resPercBar').eq(i).css({"width":perc.text()});
				});
				
				$("#SY_resTotals").replaceWith(data);
			}).trigger("resUpdate");
		
		$("#SY_resTotals").fadeIn(100);
	});
}