/*
	Write code that checks for active sieges/glassings when a new one is sent.  If one already exists at the target town, send as a resupply of that campaign
*/
function HQ_UI(bldgInfo) {
	//do update checks
	if(SR.update) {
		get_raids(true);
		get_SRs();
	}
	$.each(player.curtown.bldg, function(i,v) {
		if(v.type == "Arms Factory") {
			$.each(v.Queue, function(j,w) {
				if(w.update) load_player(player.league, true, true);
			});
		}
	});
	
	$("#BUI_extras").text(BUI.HQ.numRaidsOut + " of " + bldgInfo.lvl + " mission slots used.");
	$("#CS").addClass("open").mouseover();
	$("#HQ_sendMission").unbind("click").click(function() {
		if(!$(this).hasClass("open")) {
			$("#HQ_tabBar > div").removeClass("open");
			$(this).addClass("open");
			$("#HQ_window").fadeOut(100,function() {
				$(this).html(BUI.HQ.sendHTML);
				
				$.each(player.AU, function(i, v) {
					$("#HQ_AU"+ (i+1) +"name").text(v.name);
					$("#HQ_AU"+ (i+1) +"pic").attr("src",function(){
							var path = 'AIFrames/units/';
							switch(v.popSize) {
									case 1: //soldier
										path += "soldierrenderTHUMB.png";
										break;
									case 5: //tank
										path += "tankrenderTHUMB.png";
										break;
									case 10: //juggernaught
										path += "juggernautrenderTHUMB.png";
										break;
									case 20: //bomber
										path += "bomberrenderTHUMB.png";
										break;
									default: //anything else should be either empty or locked
									path = "../images/client/buildings/AF-" + v.name + "AU.png";
								}
							return path;
							
						});
					$("#HQ_AU"+ (i+1) +"number").text(player.curtown.au[i]).click(function(){
																				var input = $(this).siblings(".AUinput")
																				if(input.val() == $(this).text()) {
																					input.val(0);
																				} else {
																					input.val($(this).text());
																				}
																				input.keyup();
																			});
				});
				$.each(player.curtown.supportAU, function(i, v) {	
					if(v.support == 2) {
						var classes = "supportAU";
						if(i % 3 == 0) classes += " firstcol";
						
						var path = 'AIFrames/units/';
						switch(v.popSize) {
								case 1: //soldier
									path += "soldierrenderTHUMB.png";
									break;
								case 5: //tank
									path += "tankrenderTHUMB.png";
									break;
								case 10: //juggernaught
									path += "juggernautrenderTHUMB.png";
									break;
								case 20: //bomber
									path += "bomberrenderTHUMB.png";
									break;
								default: //anything else should be either empty or locked
								path = "../images/client/buildings/AF-" + v.name + "AU.png";
							}
						
						$("#HQ_supportAU").append("	<div class='" + classes + "'>\
														<div class='supportAUname'>" + v.name + "</div>\
														<img src='" + path + "' class='supportAUpic' />\
														<a href='javascript:;' class='supportAUnumber'>" + v.size + "</a>\
														<input type='text' class='AUinput supportAUinput' maxlength='4' value='0'/>\
													</div>");
					}
				});
				
				$("#HQ_supportAU").jScrollPane({showArrows:true,hideFocus:true});
				
				$('#HQ_targetX').val(BUI.HQ.x);
				$('#HQ_targetY').val(BUI.HQ.y);
				
				$("#HQ_missionDesc").html(BUI.HQ.missionDesc[0]).jScrollPane({showArrows:true,hideFocus:true});
				
				$(this).fadeIn(100);
				
				$(".supportAUnumber").unbind('click').click(function(){
					var input = $(this).siblings(".AUinput")
					if(input.val() == $(this).text()) {
						input.val(0);
					} else {
						input.val($(this).text());
					}
					input.keyup();
				});
				
				
				$(".missionSelect input").unbind('change').change(function() {
					BUI.HQ.selectedIndex = $(this).index(".missionSelect input");
					if(BUI.HQ.selectedIndex == 2 || BUI.HQ.selectedIndex == 3) $("#HQ_bombingTarget").fadeIn("fast");
					else $("#HQ_bombingTarget").fadeOut("fast");
					
					if(BUI.HQ.selectedIndex == 6) $("#HQ_supportType").fadeIn("fast");
					else $("#HQ_supportType").fadeOut("fast");
					
					canSendAttack();
				});
				
				$("#HQ_supportType").unbind("change").change(function() {
					canSendAttack();
				});
				
				$(".AUinput").unbind('keyup').keyup(function() {
					try{clearTimeout(typeCheck);}catch(e) {}
					typeCheck = setTimeout(function(){canSendAttack();get_attack_ETA();},250);
					
					var coverSize = 0;
					$(".AUinput").each(function(i, v) {
						var value = parseInt($(v).val());
						value = (isNaN(value))?0:value;
						if(i<6) {
							switch(player.AU[i].popSize) {
								case 1:
									coverSize += value;
									break;
								case 5:
									coverSize += 10*value;
									break;
								case 10:
									coverSize += 40*value;
									break;
								case 20:
									coverSize += 10*value;
									break;
							}
						} else {
							switch(player.curtown.supportAU[i-6].popSize) {
								case 1:
									coverSize += value;
									break;
								case 5:
									coverSize += 10*value;
									break;
								case 10:
									coverSize += 40*value;
									break;
								case 20:
									coverSize += 10*value;
									break;
							}
						}
					});
					$("#HQ_armySize span").text(coverSize);
				});
				
				$("#HQ_targetSelect input").unbind('keyup').keyup(function() {
					BUI.HQ.x = $('#HQ_targetX').val();
					BUI.HQ.y = $('#HQ_targetY').val();
					
					try{clearTimeout(typeCheck);}catch(e) {}
					typeCheck = setTimeout(function(){canSendAttack();get_attack_ETA();},250);
				}).keyup();
				
				$("#HQ_launchAttack").unbind('click').click(function() {
					if(!$(this).hasClass('noAttack')) {
						var AUarray = [];
						$(".AUinput").each(function(i, v) {
							AUarray.push((($(v).val() == "")?0:$(v).val()));
						});
						
						sendAttack = new make_AJAX();
							
						sendAttack.callback = function(response) {
							if(response.match(/true/i)) {
								BUI.HQ.numRaidsOut++;
								get_raids(true);
								for(i in player.curtown.au) {
									player.curtown.au[i] -= AUarray[i];
								}
								currUI();
							} else {
								var error = response.split(":");
								if(error.length==2) error=error[1]
								display_output(true,error);
								$("#HQ_isValid").text(error);
							}
						};
						
						sendAttack.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".attack(" 
										+ player.curtown.townID + "," + BUI.HQ.x + "," + BUI.HQ.y + ",[" + AUarray.join(",")
										+ "]," + BUI.HQ.attackType + "," + $("#HQ_bombingTarget option:selected").index("#HQ_bombingTarget option")
										+ ");");
					}
				});
			});
			$(".useBP").unbind("click").click(function() {
				display_message("Use BP - Ferocity","Ferocity grants all your units a 10% combat bonus for one week.  Costs <span style='font-weight:bold;'>500BP</span><br/><br/>Are you sure?<div style='text-align: right;'>Current BP:"+player.research.bp+"</div>",
								function() {
									display_output(false,"Purchasing Ferocity...");
									var useBP = new make_AJAX();
									
									useBP.callback = function(response) {
														if(response.match(/true/)) {
															display_output(false,"Success!");
															load_player(player.league,true,false);
														} else {
															var error = response.split(":");
															if(error.length==2) error = error[1];
															display_output(true,error,true);
														}
													}
									
									useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP(ferocity);");
								});
			});
		}
	});
	
	$("#HQ_overview").unbind("click").click(function() {
		if(!$(this).hasClass("open")) {
			$("#HQ_tabBar > div").removeClass("open");
			$(this).addClass("open");
			$("#HQ_window").fadeOut(100, function() {
				$(this).html(BUI.HQ.overHTML);
				var getCSinfo = new make_AJAX();
				getCSinfo.callback = function(response) {
					$("#HQ_armySizeTotal span").text(response);
					$("#HQ_window").fadeIn(100);
					$("#HQ_scrollBox").jScrollPane({showArrows:true,hideFocus:true});
				};
				getCSinfo.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".getCS(" + player.curtown.townID + ");");
				
				$("#HQ_CSL span").text(player.curtown.CSL);
				
				$("#HQ_civWeaponSelect").html(function() {
					var list = "";
					$.each(UTCC.weapons, function(i, v) {
						if(v.tier == 1) {
							list += "<option " + ((i == player.civWeapChoice)?"selected='selected'":"") 
									+ ((player.research.weap[i])?"":"disabled='disabled'") + ">" + v.name + "</option>";
						}
					});
					return list;
				});
				$("#HQ_incomingMissions").html(function() {
					var HTML = '<h3>Incoming Missions</h3>';
					$.each(player.curtown.incomingRaids, function(i, v) {
						if(v.raidOver) {
							HTML += "<div class='incoming friendly mission darkFrameBody'>\
										<div class='raidInfo'>\
											<span class='raidTitle'>Return from " + v.defendingTown;
						} else {
							var type = (v.raidType.match(/^off/i))? "offensive support":v.raidType;
							if(v.name!="noname") type+= ' "'+v.name+'"';
							HTML += "<div class='incoming"+(type.match(/support/)?"friendly":"hostile")+" mission darkFrameBody' style='height:"+(Math.ceil(v.auNames.length/6)*70)+">\
										<div class='raidInfo'>\
											<span class='raidTitle'>" + type + " from " + v.attackingTown;
						}
						HTML += "</span> - <span class='raidETA'>" + v.eta + "</span>\
										</div>\
										<div id='incomingTroops' style='height:"+(Math.ceil(v.auNames.length/6)*70)+"px'>";
									
						$.each(v.auNames, function(j,w) {
							HTML+="<div class='troop"+(j%6==0?" firstcol":"")+"'><div class='auName'>"+w+"</div><img class='auPic' src='";
							var path = 'AIFrames/units/';
							switch(w) {
								case "Shock Trooper": //soldier
								case "Pillager":
								case "Vanguard":
									path += "soldierrenderTHUMB.png";
									break;
								case "Wolverine": //tank
								case "Seeker":
								case "Damascus":
									path += "tankrenderTHUMB.png";
									break;
								case "Punisher": //juggernaught
								case "Dreadnaught":
								case "Collossus":
									path += "juggernautrenderTHUMB.png";
									break;
								case "Helios": //bomber
								case "Horizon":
								case "Hades":
									path += "bomberrenderTHUMB.png";
									break;
								default: //anything else should be either empty or locked
								path = "../images/client/buildings/AF-lockedAU.png";
							}
							HTML+=path+"' alt='"+w+"'/><div class='auAmnt'>"+v.auAmts[j]+"</div></div>";
						});
						HTML +=		"</div>\
								</div>\
								<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>";
					});
					return HTML;
				});
				$("#HQ_troopsHere").html(function() {
					var HTML = "<h3>Troops Here</h3><div id='HQ_troops' class='darkFrameBody'>";
					$.each(player.AU,function(i,v) {
						if(i<6) {
							HTML+="<div class='troop'><div class='auName'>"+v.name+"</div><img class='auPic' src='";
							var path = 'AIFrames/units/';
							switch(v.popSize) {
								case 1: //soldier
									path += "soldierrenderTHUMB.png";
									break;
								case 5: //tank
									path += "tankrenderTHUMB.png";
									break;
								case 10: //juggernaught
									path += "juggernautrenderTHUMB.png";
									break;
								case 20: //bomber
									path += "bomberrenderTHUMB.png";
									break;
								default: //anything else should be either empty or locked
								path = "../images/client/buildings/AF-" + v.name + "AU.png";
							}
							HTML+=path+"' alt='"+v.name+"'/><div class='auAmnt'>"+player.curtown.au[i]+"</div><input type='text' id='HQ_AU"+i+"input' class='AUinput' maxlength='4' value='0'/></div>";
						}
					});
					HTML += "<div id='HQ_killMe'></div>"
					if(player.curtown.supportAU.length > 0) {
						HTML += "</div><div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div><div id='HQ_supporters'><h3>Support Here</h3>";
						$.each(player.curtown.sortedSupport, function(i, v) {
							HTML += "	<div class='fSupportRow' class='darkFrameBody'><span class='supportPlayer'>Support from " + v.player + "</span><a href='javascript:;' class='sendHome'>Send Home</a><div class='supportAUbox'>";
							$.each(v.indexes, function(j, w) {
								var supportAU = player.curtown.supportAU[w];
								HTML += "	<div class='supportAU troop'><div class='supportAUname'>" + supportAU.name + "</div><a href='javascript:;' class='supportAUnumber'>" + supportAU.size + "</a><input type='text' class='AUinput supportAUinput' maxlength='4' value='0'/></div>"
							});
							HTML += "</div></div>";
						});
					}
					return HTML+"</div><div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>";
				});
				$("#HQ_outgoingMissions").html(function() {
					var HTML = "<h3>Outgoing Missions</h3>";
					$.each(player.curtown.outgoingRaids, function(i, v) {
						var type = (v.raidType.match(/^off/i))? "offensive support":v.raidType;
						if(v.name!="noname") type+= ' "'+v.name+'"';
						var to = (type.match(/(support|debris)/i))? " to ":((type.match(/inva/i))? " of ":" on ");
						HTML += "<div class='outgoing mission darkFrameBody'>\
									<div class='recallRaid'>Recall</div>\
									<div class='raidInfo'>\
										<span class='raidTitle'>" + type + to + v.defendingTown + "</span> - <span class='raidETA'>" + v.eta + "</span>\
										<span class='raidID'>" + v.rid + "</span>\
									</div>\
									<div class='outgoingTroops' style='height:"+((v.auNames.length/6)*70)+"px'>";
						$.each(v.auNames, function(j,w) {
							HTML+="<div class='troop"+(j%6==0?" firstcol":"")+"'><div class='auName'>"+w+"</div><img class='auPic' src='";
							var path = 'AIFrames/units/';
							switch(w) {
								case "Shock Trooper": //soldier
								case "Pillager":
								case "Vanguard":
									path += "soldierrenderTHUMB.png";
									break;
								case "Wolverine": //tank
								case "Seeker":
								case "Damascus":
									path += "tankrenderTHUMB.png";
									break;
								case "Punisher": //juggernaught
								case "Dreadnaught":
								case "Collossus":
									path += "juggernautrenderTHUMB.png";
									break;
								case "Helios": //bomber
								case "Horizon":
								case "Hades":
									path += "bomberrenderTHUMB.png";
									break;
								default: //anything else should be either empty or locked
								path = "../images/client/buildings/AF-lockedAU.png";
							}
							HTML+=path+"' alt='"+w+"'/><div class='auAmnt'>"+v.auAmts[j]+"</div></div>";
						});
						HTML +=		"</div></div><div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>";
					});
					return HTML;
				});
				
				$("#HQ_supportAbroad").html(function(){
					var HTML = '<h3>Support Abroad</h3>';
					if(player.curtown.supportAbroad) {
						if(player.curtown.supportAbroad.length > 0) {
							$.each(player.curtown.supportAbroad, function(i, v) {
								HTML += "	<div class='aSupportRow darkFrameBody'><span class='supportPlayer'>Support at " + v.townName + "</span><a href='javascript:;' class='callHome'>Recall</a><div class='supportAUbox'>";
								$.each(v.supportAU, function(j, w) {
									HTML += "<div class='supportAU troop'><div class='supportAUname'>" + w.name + "</div><img class='auPic' src='";
									var path = 'AIFrames/units/';
									switch(w.name) {
										case "Shock Trooper": //soldier
										case "Pillager":
										case "Vanguard":
											path += "soldierrenderTHUMB.png";
											break;
										case "Wolverine": //tank
										case "Seeker":
										case "Damascus":
											path += "tankrenderTHUMB.png";
											break;
										case "Punisher": //juggernaught
										case "Dreadnaught":
										case "Collossus":
											path += "juggernautrenderTHUMB.png";
											break;
										case "Helios": //bomber
										case "Horizon":
										case "Hades":
											path += "bomberrenderTHUMB.png";
											break;
										default: //this should never go, but just in case
										path = "../images/client/buildings/AF-lockedAU.png";
									}
									HTML+=path+"' alt='"+w.name+"'/><a href='javascript:;' class='supportAUnumber'>" + w.size + "</a><input type='text' class='AUinput supportAUinput' maxlength='4' value='0'/></div>";
								});
								HTML += "</div></div><div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>";
							});
						}
					}
					return HTML;
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
					
					$(this).siblings('.supportAUbox').children('.troop').children('.AUinput').each(function(i, v) {
						var j = player.curtown.supportAbroad[index].supportAU[i].originalSlot;
						AUtoRecall[j] = parseInt($(v).val());
					});
					var recall = new make_AJAX();
					recall.callback = function(response) {						
						if(!response.match(/false/i)) {
							get_raids(true);
							get_support_abroad();
							$("body").css("cursor","wait");
							setTimeout(function() {$("body").css("cursor","auto");currUI();},1000);
						}
					};
					recall.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
									+ ".recall([" + AUtoRecall.join(",") + "]," 
									+ player.curtown.supportAbroad[index].townID + "," 
									+ player.curtown.supportAbroad[index].pid + ","
									+ player.curtown.townID + ");");
				});
				
				$('.sendHome').die('click').live('click', function() {
					var AUtoSend = [0,0,0,0,0,0];
					var index = $(this).parent('.fSupportRow').index('.fSupportRow');
					
					$(this).siblings('.supportAUbox').children('.troop').children('.AUinput').each(function(i, v) {
						
						var j = player.curtown.sortedSupport[index].indexes[i];
						AUtoSend[player.curtown.supportAU[j].originalSlot] = parseInt($(v).val());
					});
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
				
				$("#HQ_save").unbind('click').click(function() {
					var selectedWeap = $("#HQ_civWeaponSelect option:selected").index("#HQ_civWeaponSelect option");
					if(selectedWeap != player.civWeapChoice) {
						var changeWeap = new make_AJAX();
						
						changeWeap.callback = function(response) {
								if(response.match(/true/i)) {
									player.civWeapChoice = selectedWeap;
									display_output(false,"Civilian Weapon Changed!");
								} else {
									var error = response.split(":");
									if(error.length==2) error=error[1];
									display_output(true,error);
									$("#HQ_isValid").text(error);
								}
							};
						
						changeWeap.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
										+ ".changeCivWeap(" + selectedWeap + ");");
					}
				});
				
				$("#HQ_killMe").unbind('click').click(function() {
					display_message("Are you sure?","Killing units is permanent and you get no refund.  Are you sure you want to kill them?",function() {
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
							load_player(player.league, true, false);
						};
						if(getPath.match(/bf/i) != null) {
							killEm.get(getPath);
						}
					});
				});
			});
		}
	});
	if(BUI.HQ.sendMission) {
		BUI.HQ.sendMission = false;
		$("#HQ_sendMission").click();
	} else {
		$("#HQ_overview").click();
	}
}

function canSendAttack() {
	var canAttack = new make_AJAX();
		
	canAttack.callback = function(response) {
		if(response.match(/true/i)) {
			$("#HQ_launchAttack").removeClass('noAttack');
			$("#HQ_isValid").text("");
		} else {
			var error = response.split(":");
			if(error.length==2) error = error[1];
			display_output(true,error);
			$("#HQ_isValid").text(error);
			$("#HQ_launchAttack").addClass('noAttack');
		}
	};
	
	var desc = BUI.HQ.missionDesc[BUI.HQ.selectedIndex];
	
	switch(BUI.HQ.selectedIndex) {
		case 1:
			BUI.HQ.attackType = "genocide";
			break;
		case 2:
			BUI.HQ.attackType = "strafe";
			break;
		case 3:
			BUI.HQ.attackType = "glass";
			break;
		case 4:
			BUI.HQ.attackType = "scout";
			break;
		case 5:
			BUI.HQ.attackType = "invasion";
			break;
		case 6:
			if($("#HQ_supportType").val() == "Defensive") BUI.HQ.attackType = "support";
			else { 
				BUI.HQ.attackType = "offsupport";
				desc = BUI.HQ.missionDesc[8];
			}
			break;
		case 7:
			BUI.HQ.attackType = "debris";
			break;
		case 0:
		default:
			BUI.HQ.attackType = "attack";
	}
	$("#HQ_missionDesc").data('jsp').getContentPane().html(desc);
	$("#HQ_missionDesc").data('jsp').reinitialise();
	var AUarray = [];
	$(".AUinput").each(function(i, v) {
		AUarray.push((($(v).val() == "")?0:$(v).val()));
	});

	canAttack.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
					+ ".canSendAttack(" + player.curtown.townID + "," + BUI.HQ.x 
					+ "," + BUI.HQ.y + ",[" + AUarray.join(",") + "]," + BUI.HQ.attackType 
					+ "," + $("#HQ_bombingTarget option:selected").index("#HQ_bombingTarget option")
					+ ");");
					
	$("#BUI_tutorial").click(function(){	
							var message = "Are you sure you want to play the Headquarters Tutorial?";
			display_message("Headquarters Tutorial",message,
											function() {
												tutorialRunning = true;
												display_tutorial_entity({	"text":"From your Headquarters, or HQ, you can monitor your troop movements in and out of this city, and send attacks and other mission types to other cities. Please switch to your Tactical Overview tab if you are not already in it.<br/><br/>Click 'Next' to continue.",
																			"css":{"top":"200px","left":"200px","width":"300px"}
																		}
																	,	function() {
																			display_tutorial_entity({	"text":" Your CSL or 'Cover Soft Limit' is a number that denotes how many soldiers your city can safely provide cover for in the event of an attack. If you have a total army size above this limit, some of your soldiers may get hit by stray bullets because there isn't any cover for them to hide behind! <br/><br/>Click 'Next' to continue.",
																										"css":{"top":"200px","left":"600px","width":"300px"},
																										"arrows":	{
																														
																														"arrow1":{"dir":"right","css":{"top":"350px","right":"600px"}}
																													}
																									}
																							
																							,	function() {
																											display_tutorial_entity({	"text":" When somebody sieges or glasses your city, and your entire army dies, your civilians bust out of their buildings and bring the fight to the bad guys. You can choose which weapon they will use to go down fighting with using this box.<br/><br/>Click 'Next' to continue.",
																																		"css":{"top":"200px","left":"100px","width":"300px"},
																																		"arrows":	{
																																		"arrow1":{"dir":"left","css":{"top":"350px","right":"170px"}}
																																	}
																											}
																											,	function() {
																													display_tutorial_entity({	"text":" Your current troop numbers are displayed for each unit type you have down below. You can cause your units to commit suicide from this box by inputting how much of each you want to die horribly and hitting the Kill button. If you have any raids out, these troop numbers will also display in a scrollable fashion below your home troop numbers.<br/><br/>Click 'Next' to continue.",
																																				"css":{"top":"200px","left":"100px","width":"300px"},
																																				"arrows":	{
																																				"arrow1":{"dir":"down","css":{"top":"450px","right":"400px"}}
																																			
																																			}

																														}
																														,	function() {
																																display_tutorial_entity({	"text":" Next, please click your Send Mission tab. From here you can send missions all over the map. There are a variety of different mission types, from plain old attacks to missions where your sole purpose is to collect debris from around another player's city!<br/><br/>Click 'Next' to continue.",
																																							"css":{"top":"200px","left":"500px","width":"300px"}
																																						
																																	}					
																																		,	function() {
																																									display_tutorial_entity({	"text":" To begin the process of sending a mission, you need a destination for that mission. To specify a destination, you must either enter the x and y of the destination city or Airship manually, or you can have it done automatically for you by clicking Send Mission on the drop down tab for a city on the World Map menu! <br/><br/>Click 'Next' to continue.",
																																																"css":{"top":"200px","left":"400px","width":"300px"},
																																																"arrows":	{
																																																
																																																	"arrow1":{"dir":"right","css":{"top":"550px","right":"805px"}}
																																																
																																															}
																																										}
																																											,	function() {
																																													display_tutorial_entity({	"text":" Using the troop numbers bar here, you can select how much of each unit in your army you wish to send on the mission.<br/><br/>Click 'Next' to continue.",
																																																				"css":{"top":"500px","left":"100px","width":"300px"},
																																																				"arrows":	{
																																																				"arrow1":{"dir":"right","css":{"top":"300px","right":"805px"}}
																																																			}
																																														}
																																															,	function() {
																																																	display_tutorial_entity({	"text":" Once you've selected your team, you need to select a mission type. You can select one here. The description of the mission is shown in the adjoining box.<br/><br/>Click 'Next' to continue.",
																																																								"css":{"top":"200px","left":"100px","width":"300px"},
																																																								"arrows":	{
																																																							
																																																									"arrow1":{"dir":"right","css":{"top":"400px","right":"805px"}}
																																																								
																																																							}
																																																		}
																																																			,	function() {
																																																					display_tutorial_entity({	"text":" Finally, when everything is set up, you can hit Send to execute the mission. You can track the mission's progress from the I/O box by clicking on this icon to enable it. <br/><br/>Click 'Next' to continue.",
																																																												"css":{"top":"300px","left":"100px","width":"300px"},
																																																												"arrows":	{
																																																												
																																																												"arrow4":{"dir":"left","css":{"top":"110px","right":"805px"}}
																																																											}
																																																						}
																																																							,	function() {
																																																									display_tutorial_entity({	"text":" Once your mission arrives at it's destination, you will receive a Status Report that tells you how the mission went, casualty reports, resources collected, debris created, etc. You can view your Status Report by clicking the Status Reports tab. <br /><br />Once the Report is generated, the timer in the I/O will restart and your mission will return if there are any units left in the party. When the mission returns, the units will be added back to your city's army and the countdown timer will disappear off your I/O box. <br/><br/>Click 'Next' to continue.",
																																																																"css":{"top":"200px","left":"100px","width":"300px"},
																																																																"arrows":	{
																																																															
																																																																"arrow5":{"dir":"up","css":{"top":"80px","right":"290px"}}
																																																															}
																																																										}
																																																											,	function() {
																																																													display_tutorial_entity({	"text":" This concludes the Headquarters tutorial. <br/><br/>Click 'Next' to continue.",
																																																																				"css":{"top":"200px","left":"100px","width":"300px"},
																																																																				
																																																														}
																																																													)
																																																												} // Closing exit message.
																																																									)
																																																								} // Closing SR
																																																					)
																																																				} // Closing IO
																																																	)
																																																} // Closing Mission Type
																																													)
																																												} // Closing troop numbers
																																								)
																																						} // Closing destination
																																					
																															)
																												} 	 // closing click Send Mission tab
																											)
																										} // Troop numbers
																							
																								
																						)
																					}// Closing Civ weap
																				)
																		}// closing CSL
																	)
																}// closing intro
															);
														});
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
								$("#HQ_ETA").html("ETA: "+((days)?days + " d ":"") + ((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs));
							} else {
								$("#HQ_ETA").html("?!:?!:?!");
							}
						};
	var AUarray = [];
	$(".AUinput").each(function(i, v) {
		AUarray.push((($(v).val() == "")?0:$(v).val()));
	});
	getETA.get("/AIWars/GodGenerator?reqtype=command&command=bf.getAttackETA("+player.curtown.townID+","+BUI.HQ.x+","+BUI.HQ.y+",["+AUarray.join(",")+"]);");
}