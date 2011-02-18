function build_bldg_UIs() { //set up everything the various UIs will need
	BUI.CY.bldgServer = $.grep(player.curtown.bldg, function(v, i) {
						return (v.deconstruct || v.lvlUps != 0);
					});
	
	 BUI.active.timer = update_time_displays(BUI.active);
}
function draw_bldg_UI() {
	currUI = draw_bldg_UI;
	$("#window").contents().unbind();
	display_output(false,"Connecting to Building Network...");
	BUI.queue = {};
	BUI.bldgQueue = {};
	var bldgInfo = $.grep(player.curtown.bldg, get_bldg)[0];
	
	//do update checks for this building
	if(bldgInfo.update) load_player(player.league,true,true); //if an update is queued, update the player object, and reload the current UI
	else {
		$.each(bldgInfo.Queue, function(i,v) {
			if(v.update) load_player(player.league,true,true);
		});
	}
	
	display_output(false,"Connected!");
	display_output(false,"Collecting Building data...");
	$("#window").html(BUI.head);
	$("#BUI_tutorial").unbind();
	
	$("#BUI_bldgContent").html(BUI.active.HTML);
	$("#BUI_bldgName").html(bldgInfo.type);
	$("#BUI_bldgLvl").html(" - Level " + bldgInfo.lvl);
	
	if(bldgInfo.deconstruct) {
		bldgInfo.lvlUps = 1;
		$("#BUI_upgrading").html("<img src='AIFrames/buildings/destruct.png' alt='Deconstructing'/> -" + bldgInfo.lvl).css("color", "red");
	} else if(bldgInfo.lvlUps > 0) {
		if(bldgInfo.lvl == 0) $("#BUI_upgrading").html("<img src='AIFrames/buildings/construct.png' alt='Under Construction'/> +" + bldgInfo.lvlUps).css("color", "yellow");
		else $("#BUI_upgrading").html("<img src='AIFrames/buildings/upgrade.png' alt='Upgrading'/> +" + bldgInfo.lvlUps).css("color", "lime");
	}
	
	$("#BUI_bldgSwitch").html(function() {
		var HTML = '';
		$.each(player.towns, function(a, x) {
			HTML += "<optgroup label='" + x.townName + "'>";
			$.each(x.bldg, function(b, y) {
				if(y.type == bldgInfo.type) {
					HTML += "<option value='" + y.lotNum + ":" + y.type + "'";
					if(y.lotNum == bldgInfo.lotNum && x.townID == player.curtown.townID) {
						HTML += " selected='selected' disabled='disabled'";
					}
					HTML += ">[Level " + y.lvl + "] " + y.type + "</option>";
				}
			});
			if(x.townID == player.curtown.townID) {
				$.each(x.bldg, function(b, y) {
					if(y.type != bldgInfo.type) HTML += "<option value='" + y.lotNum + ":" + y.type + "'>[Level " + y.lvl + "] " + y.type + "</option>";
				});
			}
			HTML += "</optgroup>";
		});
		return HTML;
	}).unbind('change').change(function() {
		var info = $("#BUI_bldgSwitch option:selected").val().split(":");
		var bldg = info[1];
		var lot = info[0];
		var town = $("#BUI_bldgSwitch option:selected").parent("optgroup").attr("label");
		
		if(town != player.curtown.townName) {
			player.curtown = $.grep(player.towns, function(v) { //set curtown to the selected town
				return (town == v.townName);
			})[0];
			$("#cityname").html(function() { 
				if(player.curtown.townID == player.capitaltid) {
					return "&#171;" + player.curtown.townName + "&#187;";
				} else {
					return player.curtown.townName;
				}
			});
		}
		BUI.build();
		get_buildable();
		display_res();
		build_raid_list();
		BUI.set(bldg, lot);
		do_fade(draw_bldg_UI);
	});
	
	var getUpInfo = new make_AJAX();
	getUpInfo.callback = function(response) {
		var info = response.split(";");
		var ticks = BUI.bldgQueue.ticks = info[1] * player.gameClockFactor;
		var days = Math.floor((ticks / 3600)/24);
		var hours = Math.floor((ticks / 3600)%24);
		var mins = Math.floor((ticks % 3600) / 60);
		var secs = Math.floor((ticks % 3600) % 60);
		
		$("#BUI_upTime").html(((days)?days + " d ":"") + ((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs)).removeClass("noRes");

		var cost = BUI.bldgQueue.cost = $.parseJSON(info[0]);
		$(".BUI_up span").text(bldgInfo.lvl+bldgInfo.lvlUps+1);
		//this rounds all the numbers up and reformats them for easier viewing
		$("#BUI_upSteel").html(Math.ceil(cost[0])).format({format:"###,###,###", locale:"us"});
		$("#BUI_upWood").html(Math.ceil(cost[1])).format({format:"###,###,###", locale:"us"});
		$("#BUI_upManMade").html(Math.ceil(cost[2])).format({format:"###,###,###", locale:"us"});
		$("#BUI_upFood").html(Math.ceil(cost[3])).format({format:"###,###,###", locale:"us"});
		
		if(!info[2].match(/^false/)) {		//if canUpgrade is true
			$("#BUI_upSteel").removeClass('noRes');
			$("#BUI_upWood").removeClass('noRes');
			$("#BUI_upManMade").removeClass('noRes');
			$("#BUI_upFood").removeClass('noRes');
			$("#BUI_upButton").removeClass('noUp');
		} else { 									//if canUpgrade returns false
			$("#BUI_upButton").addClass('noUp');	//make the button obviously not operable
		}
		
		display_output(false,"Building Loaded!");
		//fade in the window contents after we're done loading the most important bits of data
		$("#window").fadeIn("fast");
	};
	getUpInfo.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".returnPrice(" 
						+ bldgInfo.lotNum + "," + player.curtown.townID + ");"+player.command+".getTicksForLeveling("
						+ bldgInfo.lotNum + "," + player.curtown.townID + ");"+player.command+".canUpgrade(" 
						+ bldgInfo.lotNum + "," + player.curtown.townID + ");");
	
	$("#BUI_upButton").unbind('click').click(function(){
		if(!$(this).hasClass("noUp")) {
			display_output(false,"Leveling " + bldgInfo.type);
			
			bldgInfo.lvlUps++;
			bldgInfo.ticksToFinish = (bldgInfo.ticksToFinish == -1)?0:bldgInfo.ticksToFinish;
			bldgInfo.ticksToFinishTotal.push(BUI.bldgQueue.ticks);
			bldgInfo.bldgTicker = inc_bldg_ticks(bldgInfo);
			$.each(BUI.bldgQueue.cost, function(i,v){
				player.curtown.res[i] -= v;
			});
			BUI.build();
			
			levelUp = new make_AJAX();
			levelUp.callback = function(response){
				if(response.match(/true/)) {
					getUpInfo.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".returnPrice(" 
									+ bldgInfo.lotNum + "," + player.curtown.townID + ");"+player.command+".getTicksForLeveling("
									+ bldgInfo.lotNum + "," + player.curtown.townID + ");"+player.command+".canUpgrade(" 
									+ bldgInfo.lotNum + "," + player.curtown.townID + ");");
									
					display_output(false,"Success!");
					load_player(player.league, player.curtown.townID, false);  //update the player object
				} else {
					var error=response.split(":")[1]; //we want what's after false:
					display_output(true,error);
					$("#BUI_fail").html(error); 
				}
			};
			levelUp.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".levelUp(" + bldgInfo.lotNum + "," 
						+ player.curtown.townID + ");");
		}
	});		
	
	$("#BUI_deconButton").unbind('click').click(function() {
		if(!$(this).hasClass("noDe")) {
			display_message("Confirm","Are you sure you want to destruct this building?", 
				function() {
					display_output(false,"Deconstructing " + bldgInfo.type);
					var demo = new make_AJAX();
					demo.callback = function(response) {
						if(response.match(/true/)) {
							display_output(false,"Success!");
							bldgInfo.deconstruct = true;
							bldgInfo.ticksToFinish = 0;
							bldgInfo.ticksToFinishTotal = [BUI.bldgQueue.ticks];
							bldgInfo.bldgTicker = inc_bldg_ticks(bldgInfo);
							BUI.build();
						} else {
							var error=response.split(":")[1];
							display_output(true,error);
							$("#BUI_fail").html(error); 
						}
					};
					demo.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".demolish(" + bldgInfo.lotNum + "," + player.curtown.townID + ");");
				});
			}
	});
	
	if(bldgInfo.lvl>0) {
		BUI.active.build(bldgInfo);
	} else {
		$("#BUI_bldgContent").html("");
		$("#BUI_deconButton").unbind("click").css("opacity",".5");
	}
}

function get_bldg(v) {
	return v.lotNum == BUI.active.lotNum;
}

function set_active(name, lotNum) {
	clearInterval(BUI.active.timer);
	BUI.active = new Object();
	$.each(BUI, function(i,v) {
		if(typeof(v.name) != "undefined") {
			$.each(v.name, function(j, w) {
				if(name == w) {
					BUI.active = v;
				}
			});
		}
	});
	BUI.active.lotNum = lotNum;
	BUI.active.timer = update_time_displays(BUI.active);
}

function update_time_displays(menu) {		//this function is fairly complicated since there's a lot going on
	display_output(false, "Display Timers Active!");
	return setInterval(function() {
		try { //this is to prevent the script from breaking if an error gets thrown.
			var bldgInfo = $.grep(player.curtown.bldg, get_bldg)[0];
			switch(bldgInfo.type) {		//first, we have to determine if we even have updating displays
				/*case "Construction Yard":
					var iter = 0;
					var ticksTotal = 0;
					$(".bldgID").each(function(i,v){
						$.each(menu.bldgServer, function(ind, x) {
							if($(v).text() == x.lotNum) { //we found the building in bldgServer
								var ticks;
								if(x.lvlUps > 1) {	//if we have multiple level ups, we have to determine which one is last
									if(i != 0) {	//if we're on the first .bldgName it has to be the first in the list, less checks
														//if the last entry and this entry are the same building, or we're on the last index
										if($(v).parent().prev().children(".bldgID").text() == $(v).text()) {
											if(iter + 1 != x.lvlUps) { 	//check to see if we're on the last of a list of upgrading buildings
												$(v).siblings(".cancelButton").addClass('noCancel');	//if not, add noCancel
											} else {
												$(v).siblings(".cancelButton").removeClass('noCancel');//otherwise, make sure the button is there.				
											}
											ticksTotal += x.ticksToFinishTotal[iter]; 	//increase total ticks
											iter++;
										} else {								//otherwise
											$(v).siblings(".cancelButton").addClass('noCancel'); 	//have to cancel the last one first
											iter = 1;							//set this to our first iteration
											ticksTotal = x.ticksToFinishTotal[0]; 	//set total ticks as same as current building
										}
									} else {						//if we're on the first element, it must also be the first in the list
										$(v).siblings(".cancelButton").addClass('noCancel'); 	//have to cancel the last one first
										ticksTotal = x.ticksToFinishTotal[iter]; 	//set total ticks as same as current building
										iter++;
									}
									ticks = ticksTotal - x.ticksToFinish;
								} else {		//if we only have one level up, things are a lot simpler
									ticks = x.ticksToFinishTotal[0] - x.ticksToFinish;
									$(v).siblings(".cancelButton").removeClass('noCancel');
								}
								//format the times
								var days = Math.floor((ticks / 3600)/24);
								var hours = Math.floor((ticks / 3600)%24);
								var mins = Math.floor((ticks % 3600) / 60);
								var secs = Math.floor((ticks % 3600) % 60);
								//and display them in a nice format
								if(isNaN(hours)) { //if the time is NaN, it usually means the building is done, so we should display "updating"
									$(v).siblings(".bldgTicksToFinish").html("updating");
								} else {
									$(v).siblings(".bldgTicksToFinish").html(((days)?days + " d ":"") + ((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs));
								}
								return false;	//pops us out of the loop
								
							//if we didn't find any matches (building has finished)
							} else if(ind == menu.bldgServer.length - 1) $(v).parent().remove();	//remove the line completely
						});
					});
					break;*/
				case "Arms Factory":
					var time = 0;
					$(".time").each(function(i, el) {
						if(bldgInfo.Queue[i].update) load_player(player.league,true,true);
						
						if(i > 0) { //if we're on anything after the extra .time for the first element 
										//we have to subtract one from i to get the right queue item
							time += (bldgInfo.Queue[i-1].ticksPerUnit * bldgInfo.Queue[i-1].AUNumber);
							var days = Math.floor((time / 3600)/24);
							var hours = Math.floor((time / 3600)%24);
							var mins = Math.floor((time % 3600) / 60);
							var secs = Math.floor((time % 3600) % 60);
						} else {
							var ticks = (bldgInfo.Queue[i].ticksPerUnit - bldgInfo.Queue[i].currTicks);
							var days = Math.floor((ticks / 3600)/24);
							var hours = Math.floor((ticks / 3600)%24);
							var mins = Math.floor((ticks % 3600) / 60);
							var secs = Math.floor((ticks % 3600) % 60);
							time -= bldgInfo.Queue[i].currTicks; //this is so that time displays correctly for the first element
						}
						if(time > 0 || i == 0) {
							$(el).html(((days)?days + " d ":"") + ((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs));
						} else {
							$(el).parent().parent().remove();
						}
					});
					$("#AF_AUbar > a").each(function(i, el){
						if(player.AU[i].name != "empty"&&player.AU[i].name != "locked")$(el).text(player.curtown.au[i]);
					});
					break;
				case "Trade Center":
					if(player.curtown.activeTrades.update || player.curtown.tradeSchedules.update) get_all_trades();
					
					$(".ETA").each(function(i, el) {
						var time = player.curtown.activeTrades[i].ticksToHit;
						
						var days = Math.floor((time / 3600)/24);
						var hours = Math.floor((time / 3600)%24);
						var mins = Math.floor((time % 3600) / 60);
						var secs = Math.floor((time % 3600) % 60);
					
						if(time > 0) {
							$(el).html(((days)?days + " d ":"") + ((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs));
						} else {
							$(el).html(time);;
						}
					});
					var SMoffset = 0;
					$(".timeTillNext").each(function(i, el) {
						
						if(player.curtown.tradeSchedules[i + SMoffset].stockMarketTrade) {
							SMoffset++;
						}
						
						var ticks = player.curtown.tradeSchedules[i + SMoffset].currTicks;
						
						if(isNaN(ticks)) {
							$(el).html(ticks);
						} else {
							var days = Math.floor((ticks / 3600)/24);
							var hours = Math.floor((ticks / 3600)%24);
							var mins = Math.floor((ticks % 3600) / 60);
							var secs = Math.floor((ticks % 3600) % 60);
						
							if(ticks > 0) {
								$(el).html(((days)?days + " d ":"") + ((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs));
							}
						}
					});
					break;
				
				case "Institute":
					//check to see if the number of knowledge points has increased
					if(Math.floor(player.research.knowledge) > parseInt($("#IN_numKnowledge span").text())) $("#IN_numKnowledge span").text(Math.floor(player.research.knowledge));
					break;
				case "Headquarters":
					$('#HQ_outgoingMissions .raidETA').each(function(i, v) {
						
						if(player.curtown.outgoingRaids[i].eta != "updating") {
							$(this).html(function() {
								var time = player.curtown.outgoingRaids[i].eta;
								var hours = (time / 3600 < 10)?"0" + Math.floor(time / 3600): Math.floor(time / 3600);
								var mins = ((time % 3600) / 60 < 10)?"0" + Math.floor((time % 3600) / 60):Math.floor((time % 3600) / 60);
								var secs = ((time % 3600) % 60 < 10)?"0" + Math.floor((time % 3600) % 60):Math.floor((time % 3600) % 60);
								return hours + ":" + mins + ":" + secs;
							});
						} else {
							$(this).html(player.curtown.outgoingRaids[i].eta);
						}
					});
					$('#HQ_incomingMissions .raidETA').each(function(i, v) {
						//if(parseInt($(this).siblings(".raidID").text()) != player.curtown.incomingRaids[i].rid) $(this).parent().remove();
						if(player.curtown.incomingRaids[i].eta != "updating") {
							$(this).html(function() {
								var time = player.curtown.incomingRaids[i].eta;
								var hours = (time / 3600 < 10)?"0" + Math.floor(time / 3600): Math.floor(time / 3600);
								var mins = ((time % 3600) / 60 < 10)?"0" + Math.floor((time % 3600) / 60):Math.floor((time % 3600) / 60);
								var secs = ((time % 3600) % 60 < 10)?"0" + Math.floor((time % 3600) % 60):Math.floor((time % 3600) % 60);
								return hours + ":" + mins + ":" + secs;
							});
						} else {
							$(this).html(player.curtown.incomingRaids[i].eta);
						}
					});
					break;
			}
			$("#BUI_bldgLvl").html(" - Level " + bldgInfo.lvl);
			
			if(bldgInfo.lvlUps == 0) {
				$("#BUI_upgrading").text("");
			} else if(bldgInfo.deconstruct) {
				$("#BUI_upgrading").html("<img src='AIFrames/buildings/destruct.png' alt='Deconstructing'/> -" + bldgInfo.lvl).css("color", "red");
			} else if(bldgInfo.lvlUps > 0) {
				if(bldgInfo.lvl == 0) $("#BUI_upgrading").html("<img src='AIFrames/buildings/construct.png' alt='Under Construction'/> +" + bldgInfo.lvlUps).css("color", "yellow");
				else $("#BUI_upgrading").html("<img src='AIFrames/buildings/upgrade.png' alt='Upgrading'/> +" + bldgInfo.lvlUps).css("color", "lime");
			}
			
			$(".pplBldg").text(bldgInfo.peopleInside);
			$(".totalBldg").text(bldgInfo.cap);
			var pplCur = 0; var pplTotal = 0;
			$.each(player.curtown.bldg,function(i,v){
				if(v.type == bldgInfo.type) {
					pplCur += v.peopleInside;
					pplTotal += v.cap;
				}
			});
			$(".pplTown").text(pplCur);
			$(".totalTown").text(pplTotal);
			
			if($("#BUI_numPplBldg").length) {
				$("#BUI_numPplBldg").html(bldgInfo.numLeftToBuild);			//update the number building
				var pplTicks = bldgInfo.ticksPerPerson - bldgInfo.ticksLeft;//update the time left
				var days = Math.floor((pplTicks / 3600)/24);
				var hours = Math.floor((pplTicks / 3600)%24);
				var mins = Math.floor((pplTicks % 3600) / 60);
				var secs = Math.floor((pplTicks % 3600) % 60);
				$("#BUI_ticksTillNext").html(((days)?days + " d ":"") + ((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs));
			}
		} catch(e) {
			//display_output(true,"Minor Error [update_time_displays()]:<br/>"+e);
		}
	}, 1000);
}