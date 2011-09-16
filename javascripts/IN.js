function IN_UI(bldgInfo) {
	
	$("#viewerback").append("<div id='BUI_bldPplBox'>\
								<div id='BUI_bldPplHeader'>Build Scholars<div id='BUI_pplHelp' class='pplHelp'></div><span id='BUI_numCivs'></span></div>\
								<div id='BUI_bldPpl'>\
									<div id='BUI_pplBldgInfo'>\
										<div id='BUI_pplBldg'>Number Building: <span id='BUI_numPplBldg'>0</span></div>\
										<div id='BUI_pplNext'>Next in: <span id='BUI_ticksTillNext'>??:??:??</span></div>\
									</div>\
								</div>\
								<div id='BUI_dummyPplButton' class='noBld'></div>\
								<div id='BUI_bldPplCost'>\
									<div class='BUI_bldPpl totalCost'>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplSteel' class='noRes upSteel'>???</div>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplWood' class='noRes upWood'>???</div>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplTime' class='noRes upTime'>??:??:??</div>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplManMade' class='noRes upManMade'>???</div>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplFood' class='noRes upFood'>???</div>\
									</div>\
								</div>\
							</div>");
							
	$("#BUI_bldPplBox").animate({"bottom":"0px"}, "normal",function() {
		$("#BUI_bldPplButton").css("display","block");
		$("#BUI_numPpl").css("display","block");
		$("#BUI_dummyPplButton").css("display","none");
	});
	
	var scTotal = 0;
	var scTotalCap = 0;
	$.each(player.curtown.bldg, function(i, v) {
		if(v.type == bldgInfo.type) {
			scTotal += v.peopleInside;
			scTotalCap += v.cap;
		}
	});
			
	$("#BUI_numCivs").html("Current Staff: <span class='pplTown' title='Scholars in this Town'>"
							+ scTotal + "</span>/<span class='totalTown' title='Total Scholars this town can hold'>" + scTotalCap + "</span> (<span class='pplBldg' title='Available Traders'>"
							+ bldgInfo.peopleInside + "</span>/<span class='totalBldg' title='Total allowed'>" + bldgInfo.cap + "</span>)");
							
	$("#BUI_tutorial").unbind("click").click(IN_tut);
	
	$("#BUI_extras").append("<div id='IN_numKnowledge'>Knowledge Points: <span>"+Math.floor(player.research.knowledge)+"</span></div>\
							<div id='IN_ppd'>Points Per Day: <span>"+Math.floor(86400/player.research.scholTicksTotal)+"</span></div>");
	
	$("#BUI_bldgContent").fadeIn();
	
	$(".researchTree").jScrollPane({showArrows:true,hideFocus:true});
	update_research();
	
	if(bldgInfo.numLeftToBuild>0) {
		$("#IN_numPplBldg").text(bldgInfo.numLeftToBuild);
		$("#IN_ticksTillNext").text(bldgInfo.ticksLeft);
	} else {
		$("#IN_numPplBldg").text("None");
		$("#IN_ticksTillNext").text("00:00:00");
	}

	$(".expand").unbind("click").click(function() {
		if(!$(this).hasClass("open")) {
			var index = BUI.IN.activeTab = $(this).index(".expand");
			
			$(".expand.open").removeClass("open");
			$(".researchTree.open").removeClass("open").animate({"opacity":"toggle"},"fast"); //close any open research Trees
			
			$(this).addClass("open");
			var api = $(".researchTree").eq(index).addClass("open").data('jsp');
			$(".researchTree.open").animate({"opacity":"toggle"},"fast");
			api.reinitialise();
		}
	});
	
	$(".researches .research").click(function() {
		if(!$(this).hasClass("noBuy")) {
			var that = this;
			var name = $(that).siblings(".fullName").text();
			display_message("Confirm","Are you sure you wish to purchase "+name+"?",
				function() {
					var research = $(that).siblings(".name").text();
					display_output(false,"Purchasing "+name);
					var complete = new make_AJAX();
					complete.callback = function(response) {
											if(response.match(/true/)) {
												display_output(false,"Success!");
												load_player(false,true,true);
											} else {
												var error = response.split(":");
												if(error.length == 2) error = error[1];
												display_output(true,error,true);
											}
										};
					complete.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".completeResearches(["+research+"]);");
				});
		}
	});
	
	$(".bpResearch").unbind("click").click(function() {
		var name = $(this).siblings(".research").text();
		var code = $(this).siblings(".name").text();
		var title = '';
		var message = '';
		if(code != "troopPush") {
			title = "Use BP - Instant Research";
			message = "Instantly researching the following tech will cost <span style='font-weight:bold;'>1000 BP</span>.<br/><div style='margin-left: 10px;'>"
						+name+"</div><br/>Are your sure?<div style='text-align: right;'>Current BP:"+player.research.bp+"</div>";
		} else {
			title = "Use BP - Troop Push";
			message = "Troop Push grants you two days worth of free units in your capital city.  Note that this is based off actual build times, so the amount gained decreases as your army grows.<br/>CSL and size information can be found in your Headquarters.<br/><div style='font-weight:bold;'>Cost: 200BP</div><div style='text-align: right;'>Current BP:"+player.research.bp+"</div>";
		}
		
		display_message(title,message,function() {
			display_output(false,"Autoresearching "+name);
			var useBP = new make_AJAX();
			useBP.callback = function(response) {
								if(response.match(/true/)) {
									display_output(false,"Success!");
									load_player(false,true,true);
								} else {
									var error = response.split(":");
									if(error.length == 2) error = error[1];
									display_output(true,error,true);
								}
							};
			useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP("+((code != "troopPush")?"research_":"")+code+");");
		});
	});
	
	$(".reshelp").unbind("click").click(help_re);
	
	$("#BUI_pplHelp").unbind("click").click(function() {
		display_message("Scholars","Scholars each contribute to your empire's scientific advancement.  The more scholars you have, the more knowledge points you'll gain in a day.");
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
					$('#BUI_pplSteel').html(Math.ceil(parseFloat(pplCost[0]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");
					$('#BUI_pplWood').html(Math.ceil(parseFloat(pplCost[1]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");
					$('#BUI_pplManMade').html(Math.ceil(parseFloat(pplCost[2]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");
					$('#BUI_pplFood').html(Math.ceil(parseFloat(pplCost[3]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");
					$('#BUI_pplTime').html(((days)?days + " d ":"") + hours.toTime() + ":" + mins.toTime() + ":" + secs.toTime()).removeClass("noRes");
					
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
								+ ".returnPrice(Scholar," + numPpl + "," + player.curtown.townID
								+ ");" + player.command + ".getTicksPerPerson(" + bldgInfo.lotNum + "," 
								+ player.curtown.townID + ");" + player.command + ".canBuy(Scholar,"
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
		if(!$(this).hasClass("noBld")){
			display_output(false,"Sending Build Command...");
			var numPpl = BUI.queue.numLeftToBuild;
			$.each(BUI.queue.cost, function(i,v){
				player.curtown.res[i] -= v;
			});
			bldgInfo.numLeftToBuild += BUI.queue.numLeftToBuild;
			bldgInfo.ticksPerPerson = BUI.queue.ticksPerPerson;
			bldgInfo.pplTicker = inc_ppl_ticks(bldgInfo);
			var bldPpl = new make_AJAX();
			bldPpl.callback = function(response) {
				if(response.match(/true/)) {
					$("#BUI_numPpl").keyup();
					display_output(false,"Build Successful!");		
				} else {
					var error = response.split(":");
					if(error.length==2)error=error[1];
					display_output(true, error);
					$("#BUI_bFail").html(error);
				}
			};
			bldPpl.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
						+ ".buildSchol(" + bldgInfo.lotNum + "," + numPpl + "," 
						+ player.curtown.townID + ");");
		}
	});
	
	$(".expand:eq("+BUI.IN.activeTab+")").click();
}

function help_re(e) { //which is the type of research to display the description of
	var el = e.target;
	var which = $(el).siblings(".name").text();
	var desc = '';
	if(BUI.IN.research[which]) {
		desc = "<h4>"+$(el).siblings(".fullName").text()+"</h4>Code: "+which+"<p>"+BUI.IN.research[which].desc+"</p>";
	} else {
		switch(which) {
			case "Pillager":
				desc="<h4>Pillager Blueprint</h4>Code: Pillager<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/soldierrenderSMALL.png' style='float: left;' alt='Soldier'/>\
							<div class='helpStat firstcol'>HP: 50</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 25 Physical</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 15 Light</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 60</div><div class='helpStat'>Cargo 100</div>\
							\
						</div>Unit Specialty: Resource Reallocation<br/><br/>\
						Pillagers, with their light armor, are weak to opponents that deal explosive damage and strong against opponents that deal electrical damage.  Using standard issue sidearms, the Pillager does normal damage to all armor types.  Pillagers make up for their lack of combat specialty with the highest speed, armor, and carrying capacity of any soldier type.</p>";
				break;
			case "Panzerfaust":
				desc="<h4>Panzerfaust Blueprint</h4>Code: Panzerfaust<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/soldierrenderSMALL.png' style='float: left;' alt='Soldier'/>\
							<div class='helpStat firstcol'>HP: 75</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 20 Electrical</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 10 Light</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 50</div><div class='helpStat'>Cargo 20</div>\
							\
						</div>Unit Specialty: Construct Combat<br/><br/>\
						Panzerfaust, with their light armor, are weak to opponents that deal explosive damage and strong against opponents that deal electrical damage.  Equipped with state of the art man-portable EMP and directed energy weapons, Panzerfaust deal extra damage to heavily armored constructs, but significantly less damage to lightly armored infantry.</p>";
				break;
			case "Vanguard":
				desc="<h4>Vanguard Blueprint</h4>Code: Vanguard<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/soldierrenderSMALL.png' style='float: left;' alt='Soldier'/>\
							<div class='helpStat firstcol'>HP: 50</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 20 Explosive</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 10 Light</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 20</div><div class='helpStat'>Cargo 50</div>\
							\
						</div>Unit Specialty: Infantry Combat<br/><br/>\
						Vanguards, with their light armor, are weak to opponents that deal explosive damage and strong against opponents that deal electrical damage.  Equipped with the latest in anti-infantry ordinace, Vanguards deal extra damage to lightly armored infantry, but the heavy armor of constructs absorbes most of the lethal explosions.</p>";
				break;
			case "Seeker":
				desc="<h4>Seeker Blueprint</h4>Code: Seeker<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/tankrenderSMALL.png' style='float: left;' alt='Tank'/>\
							<div class='helpStat firstcol'>HP: 150</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 390 Physical</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 100 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 200</div><div class='helpStat'>Cargo 400</div>\
							\
						</div>Unit Specialty: Resource Reallocation/Advance Attack Construct<br/><br/>\
						Seekers, like all constructs, are plated with heavy duty alloy armor.  This armor makes them incredibly resiliant to explosives, but the high electrical conductivity means they're at a disadvantage against electrical attacks.  Equipped with a 30mm cannon, the Seeker deals average damage to all armor types.  In exchange for smaller armaments, the Seeker is equipped with state of the art propulsion systems and can quickly navigate the battlefield.</p>";
				break;
			case "Damascus":
				desc="<h4>Damascus Blueprint</h4>Code: Damascus<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/tankrenderSMALL.png' style='float: left;' alt='Tank'/>\
							<div class='helpStat firstcol'>HP: 150</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 390 Electrical</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 100 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 150</div><div class='helpStat'>Cargo 250</div>\
							\
						</div>Unit Specialty: Construct Combat<br/><br/>\
						Damascus, like all constructs, are plated with heavy duty alloy armor.  This armor makes them incredibly resiliant to explosives, but the high electrical conductivity means they're at a disadvantage against electrical attacks.  Equipped with advanced directed energy weapons, the Damascus is a fearsome anti-construct weapon, dealing extra damage to Heavily armored constructs.  However, the low electrical conductivity of light infantry armor means they perform poorly against infantry.</p>";
				break;
			case "Wolverine":
				desc="<h4>Wolverine Blueprint</h4>Code: Wolverine<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/tankrenderSMALL.png' style='float: left;' alt='Combat Walker'/>\
							<div class='helpStat firstcol'>HP: 200</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 390 Explosive</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 100 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 100</div><div class='helpStat'>Cargo 100</div>\
							\
						</div>Unit Specialty: Infantry Combat<br/><br/>\
						Wolverines, like all constructs, are plated with heavy duty alloy armor.  This armor makes them incredibly resiliant to explosives, but the high electrical conductivity means they're at a disadvantage against electrical attacks.  Equipped with high grade incindiary ordinance, this combat walker strikes fear into any infantryman.  However, the relatively low thermal conductivity of heavier construct armor makes them a poor counter to other constructs.</p>";
				break;
			case "Punisher":
				desc="<h4>Punisher Blueprint</h4>Code: Punisher<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/juggerrenderSMALL.png' style='float: left;' alt='Golem'/>\
							<div class='helpStat firstcol'>HP: 700</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 1430 Physical</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 300 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 500</div><div class='helpStat'>Cargo 1000</div>\
							\
						</div>Unit Specialty: Resource Reallocation/Advance Attack Golem<br/><br/>\
						Punishers, like other Golems, are massive, heavily armored battlefield behemoths.  Their thick armor is highly resistant to explosive damage, but the high electrical conductivity of their alloy armors makes them especially vulnerable to electrical attacks.  Equipped with frightening melee weapons and rapid-fire machine guns, Punishers are truely punishing on their opponents, but have no particular combat strengths.</p>";
				break;
			case "Dreadnought":
				desc="<h4>Dreadnought Blueprint</h4>Code: Dreadnought<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/juggerrenderSMALL.png' style='float: left;' alt='Golem'/>\
							<div class='helpStat firstcol'>HP: 700</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 1430 Electrical</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 300 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 300</div><div class='helpStat'>Cargo 600</div>\
							\
						</div>Unit Specialty: Resource Reallocation/Advance Attack Golem<br/><br/>\
						Dreadnoughts, like other Golems, are massive, heavily armored battlefield behemoths.  Their thick armor is highly resistant to explosive damage, but the high electrical conductivity of their alloy armors makes them especially vulnerable to electrical attacks.  Equipped with deadly directed energy and plasma weapons, Dreadnoughts chew through other construct's heavy armor with ease and the massive power output means they're still deadly to lightly armored infantry.</p>";
				break;
			case "Colossus":
				desc="<h4>Colossus Blueprint</h4>Code: Colossus<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/juggerrenderSMALL.png' style='float: left;' alt='Golem'/>\
							<div class='helpStat firstcol'>HP: 900</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 1430 Explosive</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 200 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 250</div><div class='helpStat'>Cargo 400</div>\
							\
						</div>Unit Specialty: Resource Reallocation/Advance Attack Golem<br/><br/>\
						Colossi, like other Golems, are massive, heavily armored battlefield behemoths.  Their thick armor is highly resistant to explosive damage, but the high electrical conductivity of their alloy armors makes them especially vulnerable to electrical attacks.  Equipped with a frightening array of explosive, incindiary, and concussive ordinance, Colossi devistate the ranks of lightly armored infantry and their sheer firepower makes them effective against lesser constructs.</p>";
				break;
			case "Gunship":
				desc="<h4>LA-513 'Gunship' Blueprint</h4>Code: Gunship<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Light Aircraft'/>\
							<div class='helpStat firstcol'>HP: 50</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 75 Physical</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 10 Light</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 500</div><div class='helpStat'>Cargo 0</div>\
							\
						</div>Light Aircraft, like the LA-513, are equipped with light armors making them highly resistant to electrical attacks, but vulnerable to explosive ordinace.  The 'Gunship' is armed with two, wing mounted, small calibur machine guns and two 15mm cannons mouned on the fuselage giving it a fairly average damage output.</p>";
				break;
			case "Thunderbolt":
				desc="<h4>LA-616 'Thunderbolt' Blueprint</h4>Code: Thunderbolt<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Light Aircraft'/>\
							<div class='helpStat firstcol'>HP: 50</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 75 Electrical</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 10 Light</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 500</div><div class='helpStat'>Cargo 0</div>\
							\
						</div>Light Aircraft, like the LA-616, are equipped with light armors making them highly resistant to electrical attacks, but vulnerable to explosive ordinace.  The 'Thunderbolt' is armed with two, wing mounted, Electrical Discharge Cannons.  This 'lighting in a can' is highly effective against Heavy Aircraft, but has a lesser effect on other Light Aircraft.</p>";
				break;
			case "Blastmaster":
				desc="<h4>LA-293 'Blastmaster' Blueprint</h4>Code: Blastmaster<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Light Aircraft'/>\
							<div class='helpStat firstcol'>HP: 50</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 75 Explosive</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 10 Light</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 500</div><div class='helpStat'>Cargo 0</div>\
							\
						</div>Light Aircraft, like the LA-293, are equipped with light armors making them highly resistant to electrical attacks, but vulnerable to explosive ordinace.  The 'Blastmaster' is armed with numerous air-to-air and air-to-ground missiles.  The light armor of other Light Aircraft is devistated by the LA-293's missiles, but the heavy plating of Heavy Aircraft is much more resiliant.</p>";
				break;
			case "Monolith":
				desc="<h4>HA-44 'Monolith' Blueprint</h4>Code: Monolith<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Light Aircraft'/>\
							<div class='helpStat firstcol'>HP: 75</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 50 Explosive</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 25 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 300</div><div class='helpStat'>Cargo 0</div>\
							\
						</div>Like other Heavy Aircraft, the HA-44 is armored with thick alloy plates.  The additional weight makes them much slower and resiliant then their light counterparts, but the alloy plating is much more vulnerable to electrical attacks.  The 'Monolith' is equipped with a large number of small calibur cannons and does moderate damage.</p>";
				break;
			case "Halcyon":
				desc="<h4>HA-18 'Halcyon' Blueprint</h4>Code: Halcyon<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Light Aircraft'/>\
							<div class='helpStat firstcol'>HP: 75</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 50 Explosive</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 25 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 300</div><div class='helpStat'>Cargo 0</div>\
							\
						</div>Like other Heavy Aircraft, the HA-18 is armored with thick alloy plates.  The additional weight makes them much slower and resiliant then their light counterparts, but the alloy plating is much more vulnerable to electrical attacks.  The 'Halcyon' is equipped with a state-of-the-art Static Discharge Array and a number of smaller EMP cannons.  It's highly effective against the heavy armor of other Heavy Aircraft, but has a significantly reduced effect on Light Aircraft.</p>";
				break;
			case "Hades":
				desc="<h4>HA-69 'Hades' Blueprint</h4>Code: Hades<p>\
						<div style='float:left;width: 150px;'>\
							<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Light Aircraft'/>\
							<div class='helpStat firstcol'>HP: 75</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 50 Explosive</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/armor-white.png' title='Armor' alt='Armor' /> 25 Heavy</div>\
							<div class='helpStat firstcol'><img src='SPFrames/Units/icons/speed-white.png' title='Speed' alt='Speed' /> 300</div><div class='helpStat'>Cargo 0</div>\
							\
						</div>Like other Heavy Aircraft, the HA-39 is armored with thick alloy plates.  The additional weight makes them much slower and resiliant then their light counterparts, but the alloy plating is much more vulnerable to electrical attacks.  The 'Hades' is equipped with numerous flak cannons and is even able to carry a number of bombs capable of doing significant infrastructure damage.</p>";
				break;
		} //end of switch
	}
	display_message("Help",desc);
}

function update_research() {
	var KP = Math.floor(player.research.knowledge);
	$(".researches .name").each(function(i,v) {
		var name = $(v).text(), research = BUI.IN.research[name];
		if(research) {
			var lvl = player.research[name], cost=false;
			if(research.lvld) {
				var max = research.max || 20;
				if(lvl < max) {
					if(name == "infrastructureTech") {
						lvl -= 8;
					} else if(name == "townTech") {
						cost = Math.floor(research.cost * Math.pow(2,lvl-1));
					}
					cost = cost || Math.floor(research.cost * Math.pow(2,lvl/2));
					$(v).siblings(".level").text("[Level " + lvl + "]");
					if(KP >= cost) {
						$(v).siblings(".research").text("Upgrade").removeClass("noBuy");
					} else {
						$(v).siblings(".research").text("Need " + (cost-KP)+" KP");
					}
				} else {
					$(v).siblings(":not(.fullName, .info, .level)").css("display","none");
				}
			} else {
				cost = research.cost;
				$(v).siblings(".level").text((lvl?"[Unl":"[L") + "ocked]");
				if(!lvl) {
					if(KP >= 800) {
						$(v).siblings(".research").text("Purchase").removeClass("noBuy");
					} else {
						$(v).siblings(".research").text("Need " + (cost-KP)+" KP");
					}
				} else {
					$(v).siblings(":not(.fullName, .info, .level)").css("display","none");
				}
			}
			$(v).siblings(".points").text(cost+" KP");
		} else {
			var cost = 0, lvl = 0, unlocked = false, unlockable = true;
			switch(name) {
				case "Pillager":
				case "Panzerfaust":
				case "Vanguard":
					cost = 50;
					lvl = $.grep(player.AU,function(w) {
									if(w.name==name) {
										unlocked = true;
									}
									return w.type == 1;
								}).length;
					break;
					
				case "Wolverine":
				case "Seeker":
				case "Damascus":
					cost = 150;
					lvl = $.grep(player.AU,function(w) {
									if(w.name==name) {
										unlocked = true;
									}
									return w.type == 2;
								}).length;
					if(player.towns.length<2) {unlockable = false;}
					break;
					
				case "Punisher":
				case "Dreadnaught":
				case "Colossus":
					cost = 450;
					lvl = $.grep(player.AU,function(w) {
									if(w.name==name) {
										unlocked = true;
									}
									return w.type == 3;
								}).length;
					if(player.towns.length<3) {unlockable = false;}
					break;
					
				case "Gunship":
				case "Thunderbolt":
				case "Blastmaster":
					cost = 250;
					lvl = $.grep(player.AU,function(w) {
									var n = w.name;
									if(n.match(name)) {
										unlocked = true;
									}
									return w.type == 4 && n.match(/Gunship|Thunderbolt|Blastmaster/);
								}).length;
					if(player.towns.length<4) {unlockable = false;}
					break;
					
				case "Monolith":
				case "Halcyon":
				case "Hades":
					cost = 250;
					lvl = $.grep(player.AU,function(w) {
									var n = w.name;
									if(n.match(name)) {
										unlocked = true;
									}
									return w.type == 4 && n.match(/Monolith|Halcyon|Hades/);
								}).length;
					if(player.towns.length<4) {unlockable = false;}
					break;
			}
			if(unlocked) {
				$(v).siblings(".level").text("[Unlocked]").siblings(":not(.fullName, .reshelp)").css("display","none");
			} else {
				cost *= Math.pow(2,lvl);
				if(!unlockable) {
					$(v).text("[Locked]");
				} else {
					if(KP>=cost) {
						$(v).siblings(".research").text("Purchase").removeClass("noBuy");
					} else {
						$(v).siblings(".research").text("Need "+ (cost-KP) +" KP");
					}
					$(v).siblings(".points").text(cost + " KP");
				}
			}
		}
	});
}