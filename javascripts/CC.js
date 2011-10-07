/*
	Write code that checks for active sieges/glassings when a new one is sent.  If one already exists at the target town, send as a resupply of that campaign
*/
function CC_UI(bldgInfo) {
	if(websock.nosock) {
		//do update checks
		if(SR.update) {
			get_raids(true);
			get_SRs();
		}
		$.each(player.curtown.bldg, function(i,v) {
			if(v.type == "Arms Factory") {
				$.each(v.Queue, function(j,w) {
					if(w.update) load_player(false, true, true);
				});
			}
		});
	}
	
	$("#viewerback").append("<div id='BUI_bldPplBox'>\
								<div id='BUI_bldPplHeader'>Build Engineers<div id='BUI_pplHelp' class='pplHelp'></div><span id='BUI_numCivs'></span></div>\
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
	
	
	
	if(player.curtown.zeppelin) {$("#CC_control").css("display","block");}
	
	$("#BUI_extras").text(BUI.CC.numRaidsOut + " of " + bldgInfo.lvl + " mission slots used.");
	$("#CS").addClass("open");
	
	$("#BUI_bldgContent").fadeIn();
	
	$("#CC_tabBar > div").unbind('click').click(function() {
		if(!$(this).hasClass("open")) {
			$("#CC_tabBar > div.open, #CC_window > div.open").removeClass("open");
			$(this).addClass("open");
			var that = this;
			$("#BUI_bldPplButton").css("display","none");
			$("#BUI_numPpl").css("display","none");
			$("#BUI_dummyPplButton").css("display","block");
			$("#BUI_bldPplBox").animate({"bottom":"-140px"}, "normal");
			$("#CC_window").fadeOut(100,function() {
				/////////////////////////////////////////////////////////////////////Construct Tab//////////////////////////////////////////////////////////////////////
				if($(that).is("#CC_construct")) {
					$("#CC_EngTab").addClass("open");
					$("#BUI_bldPplBox").animate({"bottom":"0px"}, "normal",function() {
						$("#BUI_bldPplButton").css("display","block");
						$("#BUI_numPpl").css("display","block");
						$("#BUI_dummyPplButton").css("display","none");
					});
					$(this).fadeIn(100);					
				} //////////////////////////////////////////////////////////////////Send Mission Tab////////////////////////////////////////////////////////////////////
				else if ($(that).is("#CC_sendMission")) {
					$("#CC_sendTab").addClass("open");
					
					$(this).fadeIn(100, function() {
						$("#CC_AUinput").data('jsp').reinitialise();
						$("#CC_supportAU").data('jsp').reinitialise();
						$("#CC_missionDesc").data('jsp').reinitialise();
					});
					
				}//////////////////////////////////////////////////////////////////Airship Control Tab//////////////////////////////////////////////////////////////////
				else if($(that).is("#CC_control")) {
					$("#CC_airshipControlTab").addClass("open");
				
					$(this).fadeIn(100);
				}/////////////////////////////////////////////////////////////////Military Overview Tab/////////////////////////////////////////////////////////////////
				else if($(that).is("#CC_overview")) {
					$("#CC_milOverTab").addClass("open");
					
					$(this).fadeIn(100, function() {
						$("#CC_scrollBox").data('jsp').reinitialise();
					});
				}
			});
		}
	});
	
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Engineering Tab -------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
	
	$("#CC_townID span").text(player.curtown.townID);
	
	var lots = player.research.infrastructureTech + (player.curtown.townID == player.capitaltid ? 4 : 0);
	$(".buildingInfo").each(function(i,v) {
		if(i<=lots) {
			$(v).find(".buildingName").text("Empty");
		}
	});
	
	$.each(player.curtown.bldg, function(i,v) {
		var elem = $(".buildingInfo").eq(v.lotNum);
		elem.find(".buildingName").text(v.type);
		elem.find(".buildingLvl").text(v.lvl);
	});
	
	$("#CC_numPplBldg").html(bldgInfo.numLeftToBuild);
	if(bldgInfo.numLeftToBuild == 0) {
		$("#CC_ticksTillNext").html("00:00:00 h");
	} else {
		$("#CC_ticksTillNext").html(bldgInfo.ticksPerPerson - bldgInfo.ticksLeft);
	}
	
	$("#CC_civNumber").unbind("click").click(function() {
		if(BUI.CC.selectedIndex != 8) {
			var input = $(this).siblings("#CC_civInput");
			if(input.val() == $(this).text()) {
				input.val(0);
			} else {
				input.val($(this).text());
			}
		}
	});

	$("#CC_instaBuild").unbind("click").click(function(){
		display_message("Use BP - Instabuild","Instantly finish all your currently constructing and destructing buildings for <span style='font-weight:bold;'>100BP</span>?<div style='text-align: right;'>Current BP:"+player.research.bp+"</div>",
						function() {
							display_output(false,"Purchasing Instabuild...");
							var useBP = new make_AJAX();
							
							useBP.callback = function(response) {
												if(response.match(/true/)) {
													display_output(false,"Success!");
													load_player(false,true,true);
												} else {
													var error = response.split(":");
													if(error.length==2) error=error[1];
													display_output(true,error,true);
												}
											};
							
							useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP(buildingFinish);");
						});
	});
	
	$("#BUI_pplHelp").unbind("click").click(function() {
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
			var bldPpl = new make_AJAX();
			bldPpl.callback = function(response) {
				if(response.match(/true/)) {
					$("#BUI_numPpl").keyup();
					display_output(false,"Build Successful!");		
				} else {
					bldgInfo.numLeftToBuild -= BUI.queue.numLeftToBuild;
					var error = response.split(":");
					if(error.length==2) error=error[1];
					display_output(true, error);
					$("#CC_bFail").html(error);
				}
			};
			bldPpl.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
						+ ".buildEng(" + bldgInfo.lotNum + "," + numPpl + "," 
						+ player.curtown.townID + ");");
		}
	});
	
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Build Send Mission Tab ------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	$.each(player.AU, function(i, v) {
		$("#CC_AUwrapper").append("<div class='CC_AU'>\
									<div class='CC_AUname'>"+v.name+"</div>\
									<img class='CC_AUpic' src='SPFrames/Units/"+v.name+".png'/>\
									<a href='javascript:;' class='CC_AUnumber'>"+player.curtown.au[i]+"</a>\
									<input type='text' class='CC_AUinput' value='0'/>\
								</div>");
		$(".CC_AU").eq(i).children(".CC_AUnumber")
		.unbind('click').click(function(){
									var $this = $(this);
									var input = $this.siblings(".CC_AUinput");
									if(input.val() == $this.text()) {
										input.val(0);
									} else {
										input.val($this.text());
									}
									input.keyup();
								});
	});
	$("#CC_AUwrapper").css("width",141*player.AU.length+"px");
	$("#CC_AUinput").jScrollPane();
	$.each(player.curtown.supportAU, function(i, v) {	
		if(v.support == 2) {
			var classes = "supportAU";
			if(i % 3 == 0) classes += " firstcol";
			
			var path = 'SPFrames/Units/'+v.name+'.png';
			
			$("#CC_supportAU").append("	<div class='" + classes + "'>\
											<div class='supportAUname'>" + v.name + "</div>\
											<img src='" + path + "' class='supportAUpic' />\
											<a href='javascript:;' class='supportAUnumber'>" + v.size + "</a>\
											<input type='text' class='AUinput supportAUinput' maxlength='4' value='0'/>\
										</div>");
			$(".supportAU").eq(i).children(".supportAUnumber")
			.unbind('click').click(function(){
										var $this = $(this);
										var input = $this.siblings(".supportAUinput");
										if(input.val() == $this.text()) {
											input.val(0);
										} else {
											input.val($this.text());
										}
										input.keyup();
									});
		}
	});
	
	$("#CC_supportAU").jScrollPane();
	
	$('#CC_targetX').val(BUI.CC.x);
	$('#CC_targetY').val(BUI.CC.y);
	BUI.CC.selectedIndex = 0;
	$("#CC_missionDesc").html(BUI.CC.missionDesc[1]).jScrollPane({showArrows:true,hideFocus:true});
	
	// Send Tab Event Handlers -----------------------------------------------------------------------------------------------------------------------------------------
	
	$(".supportAUnumber").unbind('click').click(function(){
		var input = $(this).siblings(".AUinput");
		if(input.val() == $(this).text()) {
			input.val(0);
		} else {
			input.val($(this).text());
		}
		input.keyup();
	});
	
	$(".missionSelect input").unbind('change').change(function() {
		BUI.CC.selectedIndex = $(this).index(".missionSelect input");
		if(BUI.CC.selectedIndex == 2 || BUI.CC.selectedIndex == 3) $("#CC_bombingTarget").fadeIn();
		else $("#CC_bombingTarget").fadeOut();
		
		if(BUI.CC.selectedIndex == 9 || BUI.CC.selectedIndex == 8) {
			$("#CC_supportAUbox").fadeOut();
			$("#CC_civilianAUbox").fadeIn();
			var numCivs = 0;
			var type = "";
			if(BUI.CC.selectedIndex == 8) {
				type = "Institute";
				$("#CC_civName").text("Scholar");
				$("#CC_civInput").val(10).attr("disabled","disabled");
			} else {
				type = "Command Center";
				$("#CC_civName").text("Engineer");
				$("#CC_civInput").val("").attr("disabled","false"); //this is to prevent older browsers from leaving the field disabled
			}
			$.each(player.curtown.bldg, function(i,v) {
					if(v.type == type) {
						numCivs += v.peopleInside;
					}
			});
			$("#CC_civNumber").text(numCivs);
		} else if(BUI.CC.selectedIndex == 10) {
			$("#CC_supportAUbox").fadeOut().find(".CC_AUinput").val(0);
			$("#CC_civilianAUbox").fadeOut(); $("#CC_civInput").val(0);
		} else {
			$("#CC_supportAUbox").fadeIn();
			$("#CC_civilianAUbox").fadeOut(); $("#CC_civInput").val(0);
		}
		
		if(BUI.CC.selectedIndex == 6) $("#CC_supportType").fadeIn();
		else $("#CC_supportType").fadeOut();
		
		canSendAttack();
	});
	
	$("#CC_supportType").unbind("change").change(function() {
		canSendAttack();
	});
	var typeCheck = 0;
	$(".CC_AUinput, #CC_civInput").unbind('keyup').keyup(function() {
		clearTimeout(typeCheck);
		typeCheck = setTimeout(function(){canSendAttack();get_attack_ETA();},250);
		
		var coverSize = 0;
		$(".CC_AUinput").each(function(i, v) {
			var value = parseInt($(v).val());
			value = (isNaN(value))?0:value;
			var j = i-player.AU.length;
			if(j<0) {
				switch(player.AU[i].rank) {
					case "soldier":
						coverSize += value;
						break;
					case "tank":
					case "bomber":
						coverSize += 10*value;
						break;
					case "golem":
						coverSize += 40*value;
						break;
				}
			} else if(BUI.CC.selectedIndex != 7 && BUI.CC.selectedIndex != 8){
				switch(player.curtown.supportAU[j].rank) {
					case "soldier":
						coverSize += value;
						break;
					case "tank":
					case "bomber":
						coverSize += 10*value;
						break;
					case "golem":
						coverSize += 40*value;
						break;
				}
			} else {
				coverSize += $("#CC_civInput").val();
			}
		});
		$("#CC_armySize span").text(coverSize);
	});
	
	$("#CC_targetSelect input").unbind('keyup').keyup(function() {
		BUI.CC.x = $('#CC_targetX').val();
		BUI.CC.y = $('#CC_targetY').val();
		
		clearTimeout(typeCheck);
		typeCheck = setTimeout(function(){canSendAttack();get_attack_ETA();},250);
	});
	
	$("#CC_launchAttack").unbind('click').click(function() {
		if(!$(this).hasClass('noAttack')) {
			var AUarray = [];
			$(".CC_AUinput").each(function(i, v) {
				var j = i-player.AU.length;
				if(j<0) {
					if($(v).val() > player.curtown.au[i]) $(v).val(player.curtown.au[i]);
				} else {
					if($(v).val() > player.curtown.supportAU[j]) $(v).val(player.curtown.supportAU[j].size);
				}
				AUarray.push((($(v).val() == "")?0:$(v).val()));
			});
			
			sendAttack = new make_AJAX();
				
			sendAttack.callback = function(response) {
				if(response.match(/true/i)) {
					BUI.CC.numRaidsOut++;
					get_raids(true);
					for(i in player.curtown.au) {
						player.curtown.au[i] -= AUarray[i];
					}
					BUI.CC.reload=true;
				} else {
					var error = response.split(":");
					if(error.length==2) error=error[1];
					display_output(true,error);
					$("#CC_isValid").text(error);
				}
			};
			var bombingTargets = [];
			$("#CC_bombingTarget option:selected").each(function() {
				bombingTargets.push($(this).val());
			});
			
			sendAttack.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".attack(" 
							+ player.curtown.townID + "," + BUI.CC.x + "," + BUI.CC.y + ",[" + AUarray.join(",")
							+ "]," + BUI.CC.attackType + ",[" + bombingTargets.join() + "],);");
		}
	});
	
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Build Airship Control Tab----------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	$("#CC_moveX").val(BUI.CC.x);
	$("#CC_moveY").val(BUI.CC.y);
	
	$("#CC_moveTo input").unbind('keyup').keyup(function() {
		BUI.CC.x = $('#CC_moveX').val();
		BUI.CC.y = $('#CC_moveY').val();
		var dist = Math.floor(Math.sqrt(Math.pow((BUI.CC.x-player.curtown.x),2)+Math.pow((BUI.CC.y-player.curtown.y),2)));
		if(dist>player.curtown.fuelCells) {
			$("#CC_moveAirship").addClass("noMove");
			$("#CC_moveError").html("Insufficient Fuel");
		} else {
			$("#CC_moveAirship").removeClass("noMove");
			$("#CC_moveError").html("");
		}
	}).unbind("click").click(function() {
		$(this).keyup();
	}).keyup();
	
	$("#CC_currPos span").text(player.curtown.x+", "+player.curtown.y);
	
	if(player.curtown.x != player.curtown.destX || player.curtown.y != player.curtown.destY) {
		$("#CC_airshipHeading span").text(player.curtown.destX+", "+player.curtown.destY);
		$("#CC_airshipETA span").text(player.curtown.movementTicks);
		$("#CC_moveAirship").addClass("noMove");
	} else {
		$("#CC_airshipHeading span, #CC_airshipETA span").text("N/A");
	}
	
	$("#CC_airshipFuel span").text(player.curtown.fuelCells+" Cells");
					
	$("#CC_moveAirship").unbind("click").click(function() {
		if(!$(this).hasClass("noMove")) {
			var moveAirship = make_AJAX();
			
			moveAirship.callback = function(response) {
				if(response.match(/false/)) {
					var error = response.split(":")[1];
					$("#CC_moveError").html(error);
					display_output(true,error);
				} else {
					$("#CC_airshipHeading span").text($("#CC_moveX").val()+", "+$("#CC_moveY").val());
					$("#CC_airshipETA span").text("updating");
					load_player(false,true,true);
				}
			};
			
			moveAirship.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".moveAirship("+BUI.CC.x+","
							+BUI.CC.y+","+player.curtown.townID+");");
		}
	});
	
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Build Military Overview Tab -------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	$("#CC_armySizeTotal span").text(function() {
		var coverSize = 0;
		$.each(player.curtown.au, function(i,v) {
			switch(player.AU[i].popSize) {
				case 1:
					coverSize += v;
					break;
				case 5:
				case 20:
					coverSize += 10*v;
					break;
				case 10:
					coverSize += 40*v;
					break;
			}
		});
		$.each(player.curtown.supportAU, function(i,v) {
			switch(v.popSize) {
				case 1:
					coverSize += v.size;
					break;
				case 5:
				case 20:
					coverSize += 10*v.size;
					break;
				case 10:
					coverSize += 40*v.size;
					break;
			}
		});
		return coverSize;
	});
	
	$("#CC_CSL span").text(player.curtown.CSL);
	
	$("#CC_incomingMissions").html(function() {
		var HTML = '<h3>Incoming Missions</h3>';
		$.each(player.curtown.incomingRaids, function(i, v) {
			if(v.raidOver) {
				HTML += "<div class='incoming friendly mission darkFrame'>\
							<div class='raidInfo'>\
								<span class='raidTitle'>Return from " + v.defendingTown;
			} else {
				var type = (v.raidType.match(/^off/i))? "offensive support":v.raidType;
				if(v.name!="noname") type+= ' "'+v.name+'"';
				HTML += "<div class='incoming"+(type.match(/support/)?"friendly":"hostile")+" mission darkFrame'>\
							<div class='raidInfo'>\
								<span class='raidTitle'>" + type + " from " + v.attackingTown;
			}
			HTML += "</span> - <span class='raidETA'>" + v.eta + "</span>\
							</div>\
							<div id='incomingTroops' style='height:"+(Math.ceil(v.auNames.length/6)*120)+"px'>";
						
			$.each(v.auNames, function(j,w) {
				HTML+="<div class='troop"+(j%6==0?" firstcol":"")+"'><div class='auName'>"+w+"</div><img class='auPic' src='SPFrames/Units/"+w
						+".png' alt='"+w+"'/><div class='auAmnt'>"+v.auAmts[j]+"</div></div>";
			});
			HTML +=		"</div>\
					</div>";
		});
		return HTML;
	});
	$("#CC_troopsHere").html(function() {
		var HTML = "<h3>Troops Here</h3><div id='CC_troops'>";
		$.each(player.AU,function(i,v) {
			if(i<6) {
				HTML+="<div class='troop'><div class='auName'>"+v.name+"</div><img class='auPic' src='SPFrames/Units/"+v.name+".png' alt='"+v.name
						+"'/><div class='auAmnt'>"+player.curtown.au[i]+"</div><input type='text' id='CC_AU"+i
						+"input' class='AUinput' maxlength='4' value='0'/></div>";
			}
		});
		HTML += "<div id='CC_killMe'></div>";
		if(player.curtown.supportAU.length > 0) {
			HTML += "</div><div id='CC_supporters'><h3>Support Here</h3>";
			$.each(player.curtown.sortedSupport, function(i, v) {
				HTML += "	<div class='fSupportRow'><span class='supportPlayer'>Support from " + v.player + "</span><a href='javascript:;' class='sendHome'>Send Home</a><div class='supportAUbox'>";
				$.each(v.indexes, function(j, w) {
					var supportAU = player.curtown.supportAU[w];
					HTML += "<div class='supportAU troop'><div class='supportAUname'>" + supportAU.name + "</div><a href='javascript:;' class='supportAUnumber'>" + supportAU.size + "</a><input type='text' class='AUinput supportAUinput' maxlength='4' value='0'/></div>";
				});
				HTML += "</div></div>";
			});
		}
		return HTML+"</div>";
	});
	$("#CC_outgoingMissions").html(function() {
		var HTML = "<h3>Outgoing Missions</h3>";
		$.each(player.curtown.outgoingRaids, function(i, v) {
			var type = (v.raidType.match(/^off/i))? "offensive support":v.raidType;
			if(v.name!="noname") type+= ' "'+v.name+'"';
			var to = (type.match(/(support|debris)/i))? " to ":((type.match(/inva/i))? " of ":" on ");
			HTML += "<div class='outgoing mission darkFrame'>\
						<div class='recallRaid' rID='" + v.id + "'>Recall</div>\
						<div class='raidInfo'>\
							<span class='raidTitle'>" + type + to + v.defendingTown + "</span> - <span class='raidETA'>" + v.eta + "</span>\
						</div>\
						<div class='outgoingTroops' style='height:"+(Math.ceil(v.auNames.length/6)*120)+"px'>";
			$.each(v.auNames, function(j,w) {
				HTML+="<div class='troop"+(j%6==0?" firstcol":"")+"'><div class='auName'>"+w+"</div><img class='auPic' src='SPFrames/Units/"+w
						+".png' alt='"+w+"'/><div class='auAmnt'>"+v.auAmts[j]+"</div></div>";
			});
			HTML +=		"</div></div><div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>";
		});
		return HTML;
	});
	
	$("#CC_supportAbroad").html(function(){
		var HTML = '<h3>Support Abroad</h3>';
		if(player.curtown.supportAbroad) {
			if(player.curtown.supportAbroad.length > 0) {
				$.each(player.curtown.supportAbroad, function(i, v) {
					HTML += "	<div class='aSupportRow darkFrame'><span class='supportPlayer'>Support at "
						+ v.townName + "</span><a href='javascript:;' class='callHome'>Recall</a><div class='supportAUbox'>";
					$.each(v.supportAU, function(j, w) {
						HTML += "<div class='supportAU troop'><div class='supportAUname'>" + w.name 
							+ "</div><img class='auPic' src='SPFrames/Units/"+w.name+".png' alt='"
							+ w.name + "'/><a href='javascript:;' class='supportAUnumber'>" + w.size 
							+ "</a><input type='text' class='AUinput supportAUinput' maxlength='4' "
							+ (w.name=="Scholar"?"style='visibility:hidden;'":"value='0'") + "/></div>";
					});
					HTML += "</div></div>";
				});
			}
		}
		return HTML;
	});
	
	$(".recallRaid").unbind('click').click(function() {
		var rid = $(this).attr("rID");
		recall = new make_AJAX();
		recall.callback = function(response) {
			if(response.match(/true/)) {
				get_raids(true);
				currUI();
			} else {
				var error = response.split(":");
				if(error.length==2)error=error[1];
				display_output(true,error,true);
			}
		};
		recall.get("reqtype=command&command=bf.recall(" + rid + ");");
	});
	
	$(".supportAUnumber").die('click').live('click',function() {
		var sibling = $(this).siblings('.AUinput');
		if($(this).text() == sibling.val()) {
			sibling.val(0);
		} else {
			sibling.val($(this).text());
		}
	});
	
	$(".callHome").die('click').live('click', function() {
		var AUtoRecall = [0,0,0,0,0,0];
		var index = $(this).parent('.aSupportRow').index('.aSupportRow');
		var callAll = true;
		
		$(this).siblings('.supportAUbox').children('.troop').children('.AUinput').each(function(i, v) {
			if($(this).css("visibility") != "hidden") {
				var j = player.curtown.supportAbroad[index].supportAU[i].originalSlot;
				var val = parseInt($(v).val());
				if(val != 0 && val != "") {
					callAll = false;
				} else if(val == "") val = 0;
				AUtoRecall[j] = val;
			}
		});
		
		if(callAll) AUtoRecall = [0];
		
		var recall = new make_AJAX();
		recall.callback = function(response) {						
			if(!response.match(/false/i)) {
				get_raids(true);
				get_support_abroad();
				$("body").css("cursor","wait");
				setTimeout(function() {$("body").css("cursor","auto");currUI();},1000);
			}
		};
		recall.get("reqtype=command&command=bf.recall([" + AUtoRecall.join(",") + "]," 
						+ player.curtown.supportAbroad[index].townID + "," 
						+ player.curtown.supportAbroad[index].pid + ","
						+ player.curtown.townID + ");");
	});
	
	$('.sendHome').die('click').live('click', function() {
		var AUtoSend = [0,0,0,0,0,0];
		var index = $(this).parent('.fSupportRow').index('.fSupportRow');
		var sendAll = true;
		
		$(this).siblings('.supportAUbox').children('.troop').children('.AUinput').each(function(i, v) {
			var j = player.curtown.sortedSupport[index].indexes[i];
			var val = parseInt($(v).val());
			if(val != 0 && val != "") {
				sendAll = false;
			} else if(val == "") val = 0;
			AUtoSend[player.curtown.supportAU[j].originalSlot] = val;
		});
		if(sendAll) AUtoSend = [0];
		var sendHome = new make_AJAX();
		sendHome.callback = function(response) {						
			if(!response.match(/false/i)) {
				get_raids(true);
				get_support_abroad();
				$("body").css("cursor","wait");
				setTimeout(function() {$("body").css("cursor","auto");currUI();},1000);
			}
		};
		sendHome.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
						+ ".sendHome([" + AUtoSend.join(",") + "]," + player.curtown.townID 
						+ "," + player.curtown.sortedSupport[index].pid + ");");
	});
	
	$("#CC_killMe").unbind('click').click(function() {
		display_message("Are you sure?","Killing units is permanent and you get no refund if you don't have a Recycling Center.  Are you sure you want to kill them?",function() {
			display_output(false, "Killing units...");
			var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
			var killedAU = [0,0,0,0,0,0];
			$(".AUinput").each(function(i,v) {
				if(i<6) {
					if($(v).val() > 0 && player.AU[i].name != "locked" && player.AU[i].name != "empty") {
						getPath += player.command + ".killMyself(" + player.AU[i].name + "," + $(v).val() + "," + player.curtown.townID + ");";
						killedAU[i] = parseInt($(v).val());
					}
				}
			});
			var killEm = new make_AJAX();
			killEm.callback = function(response) {
				if(response.match(/false/i)) {
					display_output(true, "Suicide Attempt Failed!",true);
				} else if(currUI === draw_bldg_UI&&BUI.active.name[0]==bldgInfo.type) {
					$.each(killedAU, function(i,v){
						player.curtown.au[i] -= v;
					});
					currUI();
				}
				load_player(false, true, false);
			};
			if(getPath.match(/bf/i) != null) {
				killEm.get(getPath);
			}
		});
	});
	
	$("#CC_scrollBox").jScrollPane({showArrows:true,hideFocus:true});
	
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	$(".useBP").unbind("click").click(function() {
		display_message("Use BP - Ferocity","Ferocity grants all your units a 10% combat bonus for one week.  Costs <span style='font-weight:bold;'>500BP</span><br/><br/>Are you sure?<div style='text-align: right;'>Current BP:"+player.research.bp+"</div>",
						function() {
							display_output(false,"Purchasing Ferocity...");
							var useBP = new make_AJAX();
							
							useBP.callback = function(response) {
												if(response.match(/true/)) {
													display_output(false,"Success!");
													load_player(false,true,false);
												} else {
													var error = response.split(":");
													if(error.length==2) error = error[1];
													display_output(true,error,true);
												}
											};
							
							useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP(ferocity);");
						});
	});
	
	$("#BUI_tutorial").click(CC_tut);
	
	switch(BUI.CC.startTab) {
		case "send":
			$("#CC_sendMission").click();
			BUI.CC.startTab = "";
			break;
		case "control":
			$("#CC_control").click();
			BUI.CC.startTab = "";
			break;
		case "overview":
			$("#CC_overview").click();
			BUI.CC.startTab = "";
			break;
		default:
			$("#CC_construct").click();
	}
}

function canSendAttack() {
	var canAttack = new make_AJAX();
		
	canAttack.callback = function(response) {
		if(response.match(/true/i)) {
			$("#CC_launchAttack").removeClass('noAttack');
			$("#CC_isValid").text("");
		} else {
			var error = response.split(":");
			if(error.length==2) error = error[1];
			display_output(true,error);
			$("#CC_isValid").text(error);
			$("#CC_launchAttack").addClass('noAttack');
		}
	};
	
	var desc = BUI.CC.missionDesc[BUI.CC.selectedIndex+1];
	
	switch(BUI.CC.selectedIndex) {
		case 1:
			BUI.CC.attackType = "genocide";
			break;
		case 2:
			BUI.CC.attackType = "strafe";
			break;
		case 3:
			BUI.CC.attackType = "glass";
			break;
		case 4:
			BUI.CC.attackType = "scout";
			break;
		case 5:
			BUI.CC.attackType = "invasion";
			break;
		case 6:
			if($("#CC_supportType").val() == "Defensive") BUI.CC.attackType = "support";
			else { 
				BUI.CC.attackType = "offsupport";
				desc = BUI.CC.missionDesc[0];
			}
			break;
		case 7:
			BUI.CC.attackType = "debris";
			break;
		case 8:
		case 9:
			BUI.CC.attackType = "dig";
			break;
		case 10:
			BUI.CC.attackType = "blockade";
		case 0:
		default:
			BUI.CC.attackType = "attack";
	}
	var api = $("#CC_missionDesc").data('jsp');
	api.getContentPane().html(desc);
	api.reinitialise();
	var AUarray = [];
	$(".CC_AUinput").each(function(i, v) {
		var j = i-player.AU.length;
		if(j<0) {
			if($(v).val() > player.curtown.au[i]){
			 $(v).val(player.curtown.au[i]);
			}
		} else if($(v).val() > player.curtown.supportAU[j]){ 
			$(v).val(player.curtown.supportAU[j].size);
		}
		AUarray.push((($(v).val() == "")?0:$(v).val()));
	});

	var bombingTargets = [];
	$("#CC_bombingTarget option:selected").each(function() {
		bombingTargets.push($(this).val());
	});
	
	canAttack.get("reqtype=command&command=bf.canSendAttack(" + player.curtown.townID + "," + BUI.CC.x 
					+ "," + BUI.CC.y + ",[" + AUarray.join(",") + "]," + BUI.CC.attackType 
					+ "," + bombingTargets + ",);");
}

function get_attack_ETA() {
	var getETA = new make_AJAX();
	getETA.callback = function(response) {
							if(response.match(/\d/)) {
								var time = response*player.gameClockFactor;
								var days = Math.floor((time / 3600)/24);
								var hours = Math.floor((time / 3600)%24);
								var mins = Math.floor((time % 3600) / 60);
								var secs = Math.floor((time % 3600) % 60);
								$("#CC_ETA").html("ETA: "+((days)?days + " d ":"") + hours.toTime() + ":" + mins.toTime() + ":" + secs.toTime());
							} else {
								$("#CC_ETA").html("?!:?!:?!");
							}
						};
	var AUarray = [];
	$(".AUinput").each(function(i, v) {
		AUarray.push((($(v).val() == "")?0:$(v).val()));
	});
	getETA.get("reqtype=command&command=bf.getAttackETA("+player.curtown.townID+","+BUI.CC.x+","+BUI.CC.y+",["+AUarray.join(",")+"]);");
}