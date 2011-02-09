function CY_UI(bldgInfo) {
	var enTotal = 0;
	var enTotalCap = 0;
	$.each(player.curtown.bldg, function(i, v) {
		if(v.type == bldgInfo.type) {
			enTotal += v.peopleInside;
			enTotalCap += v.cap;
		}
	});
	$("#BUI_numCivs").html("Current Staff: <span class='pplTown' title='Engineers in this Town'>"
							+ enTotal + "</span>/<span class='totalTown' title='Total Engineers this town can hold'>" + enTotalCap + "</span> (<span class='pplBldg' title='Available Engineers'>" + bldgInfo.peopleInside 
							+ "</span>/<span class='totalBldg' title='Total allowed'>" + bldgInfo.cap + "</span>)");
	
	// var getEnEffect = make_AJAX();
	// getEnEffect.onreadystatechange = function() {
		// if(getEnEffect.readyState == 4 && getEnEffect.status == 200) {
			// enEffects = $.parseJSON(getEnEffect.responseText);
		// }
	// };
	// getEnEffect.get("/AIWars/GodGenerator?reqtype=command&command=bf.getEngineerReductionsAsStringArray(" 
					// + bldgInfo.lotNum + "," + player.curtown.townID + ");");
	
	$("#CY_townID span").text(player.curtown.townID);
	var HTML = "<span id='CY_buildingInfoHeader'>Lot Numbers:</span><ul>";
	$.each(player.curtown.bldg, function(i,v) {
		HTML+="<li class='buildingInfo'>"+v.type + " : <span>" + v.lotNum+"</span></li>";
	});
	$("#CY_buildingInfo").append(HTML+"</ul>");
	
	$("#CY_numPplBldg").html(bldgInfo.numLeftToBuild);
	if(bldgInfo.numLeftToBuild == 0) {
		$("#CY_ticksTillNext").html("00:00:00 h");
	} else {
		$("#CY_ticksTillNext").html(bldgInfo.ticksPerPerson - bldgInfo.ticksLeft);
	}
	
	$("#CY_instaBuild").unbind("click").click(function(){
		display_message("Use BP - Instabuild","Instantly finish all your currently constructing and destructing buildings for <span style='font-weight:bold;'>100BP</span>?<div style='text-align: right;'>Current BP:"+player.research.bp+"</div>",
						function() {
							display_output(false,"Purchasing Instabuild...");
							var useBP = new make_AJAX();
							
							useBP.callback = function(response) {
												if(response.match(/true/)) {
													display_output(false,"Success!");
													load_player(player.league,true,true);
												} else {
													var error = response.split(":");
													if(error.length==2) error=error[1];
													display_output(true,error,true);
												}
											}
							
							useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP(buildingFinish);");
						});
	});
	
	$("#CBUI_pplHelp").unbind("click").click(function() {
		display_message("Engineers","Engineers globally decrease build times allowing you to build more, faster.  The level of decrease differs between unit types and building levels.  Higher level buildings and higher tier units get less of an effect from your engineers.");
	});
	
	$("#BUI_numPpl").unbind("keyup").keyup(function() {
		try{clearTimeout(typeCheck);}catch(e) {}
		typeCheck = setTimeout(function() {
			$("#BUI_bFail").html("");		//clear any error messages
			var numPpl = parseInt($("#BUI_numPpl").val());	//to avoid sending completely bad data to the server
			if(!isNaN(numPpl)) {
				try {getPplInfo.abort();} catch(e) {}
				var getPplInfo = new make_AJAX();
				
				getPplInfo.callback = function(response){
				
					var pplInfo = response.split(";");
					var pplCost = BUI.queue.cost = $.parseJSON(pplInfo[0]);
					var ticks = pplInfo[1] * numPpl * player.gameClockFactor;
					// build queue object
					BUI.queue.numLeftToBuild = numPpl;
					BUI.queue.ticksPerPerson = pplInfo[1] * player.gameClockFactor;
					// math to correctly display the numbers
					var days = Math.floor((ticks / 3600)/24);
					var hours = Math.floor((ticks / 3600)%24);
					var mins = Math.floor((ticks % 3600) / 60);
					var secs = Math.floor((ticks % 3600) % 60);
					
					//this rounds all the numbers up and reformats them for easier viewing
					$('#BUI_pplSteel').html(Math.ceil(parseFloat(pplCost[0]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");;
					$('#BUI_pplWood').html(Math.ceil(parseFloat(pplCost[1]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");;
					$('#BUI_pplManMade').html(Math.ceil(parseFloat(pplCost[2]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");;
					$('#BUI_pplFood').html(Math.ceil(parseFloat(pplCost[3]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");;
					$('#BUI_pplTime').html(((days)?days + " d ":"") + ((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs)).removeClass("noRes");
					
					var canBuild = pplInfo[2];
					if(canBuild.match(/true/)) {
						$('#BUI_pplSteel').removeClass("noRes");
						$('#BUI_pplWood').removeClass("noRes");
						$('#BUI_pplManMade').removeClass("noRes");
						$('#BUI_pplFood').removeClass("noRes");
						$("#BUI_bldPplButton").removeClass('noBld');
					} else { //if the user can't build ppl, mark the button as unavailable.
						$("#BUI_bldPplButton").addClass('noBld');
					}
				};
				getPplInfo.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
								+ ".returnPrice(Engineer," + numPpl + "," + player.curtown.townID
								+ ");" + player.command + ".getTicksPerPerson(" + bldgInfo.lotNum + "," 
								+ player.curtown.townID + ");" + player.command + ".canBuy(Engineer,"
								+ numPpl + "," + bldgInfo.lotNum + "," + player.curtown.townID + ");");
			} else { //if the user entered 0 or nothing, display ??? for values
				$("#BUI_bldPplButton").addClass('noBld');
				$('#BUI_pplSteel').html("???").addClass("noRes");
				$('#BUI_pplWood').html("???").addClass("noRes");
				$('#BUI_pplManMade').html("???").addClass("noRes");
				$('#BUI_pplFood').html("???").addClass("noRes");
				$('#BUI_pplTime').html("??:??:??").addClass("noRes");
			}
		},250);
	});
	$("#BUI_bldPplButton").unbind('click').click(function() {
		if(!$(this).hasClass("noBld")) {
			display_output(false,"Sending Build Command...");
			var numPpl = BUI.queue.numLeftToBuild;
			$.each(BUI.queue.cost, function(i,v){
				player.curtown.res[i] -= v;
			});
			bldgInfo.numLeftToBuild += numPpl;
			bldgInfo.ticksPerPerson = BUI.queue.ticksPerPerson;
			if(!bldgInfo.pplTicker) bldgInfo.pplTicker = inc_ppl_ticks(bldgInfo);
			var bldPpl = new make_AJAX();
			bldPpl.callback = function(response) {
				if(response.match(/true/)) {
					$("#BUI_numPpl").keyup();
					display_output(false,"Build Successful!");		
				} else {
					var error = response.split(":");
					if(error.length==2) error=error[1];
					display_output(true, error);
					$("#CY_bFail").html(error);
				}
			};
			bldPpl.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
						+ ".buildEng(" + bldgInfo.lotNum + "," + numPpl + "," 
						+ player.curtown.townID + ");");
		}
	});
}