function warehouse_UI(bldgInfo) {
	var i = 0;
	switch(bldgInfo.type) {
		case "Timber Warehouse":
			i = 1;
			break;
		case "Manufactured Materials Warehouse":
			i = 2;
			break;
		case "Food Warehouse":
			i = 3;
			break;
	}
	$('#Ware_curRes').text(Math.floor(player.curtown.res[i]));
	$('#Ware_resCap').text(player.curtown.resCaps[i]);
	
	$('#Ware_resPerc').text(Math.round((player.curtown.res[i]/player.curtown.resCaps[i]) * 100)/100).format({format:"###.00%", locale:"us"});
	$('#Ware_resPercBar').css({"width":$('#Ware_resPerc').text(),"backgroundColor":"light green"});
	
	BUI.active.resUpdate = function(ind) {
			clearTimeout(BUI.active.timer);
			BUI.active.timer = setTimeout(function(){				
				$('#Ware_curRes').text(Math.round(player.curtown.res[ind]));
				
				$('#Ware_resPerc').text(Math.round((player.curtown.res[ind]/player.curtown.resCaps[ind]) * 100)/100).format({format:"###.00%", locale:"us"});
				$('#Ware_resPercBar').css({"width":$('#Ware_resPerc').text()});
				
				BUI.active.resUpdate(ind);
				},200);
		};
	
	BUI.active.resUpdate(i);
}