function IN_UI(bldgInfo) {
	
	$("#IN_researchList .textFramed").html(BUI.IN.civInfHTML+BUI.IN.milInfHTML+BUI.IN.milUnitsHTML+BUI.IN.advTechHTML+BUI.IN.aiResHTML);
	
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
	$("#BUI_tutorial").click(function(){	
							var message = "Are you sure you want to play the Institute Tutorial?";
			display_message("Institute Tutorial",message,
											function() {
												tutorialRunning = true;
												display_tutorial_entity({	"text":"The Institute is the heart and soul of your civilization. From here you can research everything from the mundane Lot Tech researches that give you more building spaces in your cities to the soaring technological marvels that are the Airships.<br/><br/>Click 'Next' to continue.",
																			"css":{"top":"200px","left":"200px","width":"300px"}
																		}
																	,	function() {
																			display_tutorial_entity({	"text":"To purchase a research, you can click purchase next to the name of the research. If you do not have enough Knowledge Points, or KP, instead that button will become some text like Need 29 Points. <br/><br/>Click 'Next' to continue.",
																										"css":{"top":"200px","left":"200px","width":"300px"},
																										"arrows":	{
																														
																														"arrow1":{"dir":"down","css":{"top":"260px","right":"115px"}}
																													}
																									}
																							
																							,	function() {
																											display_tutorial_entity({	"text":"  Your Scholars work together across all of your Institutes to generate these points on a daily basis, so if you run out, you can always make more! The amount of scholars you have is denoted by the Current Staff label. Each Institute has a capacity for Scholars and upgrading that Institute allows higher capacities.<br/><br/>Click 'Next' to continue.",
																																		"css":{"top":"200px","left":"200px","width":"300px"},
																																		"arrows":	{
																																		"arrow1":{"dir":"down","css":{"top":"525px","right":"60px"}}
																																	}
																											}
																											,	function() {
																													display_tutorial_entity({	"text":" There are two different types of researches: One-Time Researches and Leveled Researches. One-Time Researches are things like Advanced Rocketry: They can only be researched once and unlock some new building, ability, or unit. <br /><br /> The Leveled Researches can be purchased multiple times, and improve the overall infrastructure of your civilization. An example would be Building Slot Tech - Every time it's purchased, you can build or level up another building concurrently. Also, the prices for Leveled Researches rise each time you buy them.<br/><br/>Click 'Next' to continue.",
																																				"css":{"top":"200px","left":"200px","width":"300px"},


																														}
																														,	function() {
																																display_tutorial_entity({	"text":" There are tons of different researches for you to explore in A.I. Wars. The Institute groups these different researches based on their effects in five different areas, denoted by the tabs above. You can explore the researches in each group by clicking the tab associated with it. <br/><br/>Click 'Next' to continue.",
																																							"css":{"top":"400px","left":"400px","width":"300px"},
																																							"arrows":	{
																																							"arrow1":{"dir":"down","css":{"top":"200px","right":"510px"}},
																																							"arrow2":{"dir":"down","css":{"top":"200px","right":"685px"}},
																																							"arrow3":{"dir":"down","css":{"top":"200px","right":"335px"}},
																																							"arrow4":{"dir":"down","css":{"top":"200px","right":"200px"}},
																																							"arrow5":{"dir":"down","css":{"top":"200px","right":"75px"}}
																																						}
																																	}					
																																		,	function() {
																																									display_tutorial_entity({	"text":" Click the Civilian Infrastructure tab to view the researches here. The most prosaic of all the research groups, Civilian Infrastructure provides upgrades to how efficient your scholars, traders, and engineers are and allow you to add extra building lots to your cities and slots to your building server. You can also research Town Tech here, each level of which allows you to add another city to your Empire.<br/><br/>Click 'Next' to continue.",
																																																"css":{"top":"0px","left":"400px","width":"300px"},
																																																"arrows":	{
																																																
																																																"arrow1":{"dir":"down","css":{"top":"200px","right":"685px"}}
																																															}
																																										}
																																											,	function() {
																																													display_tutorial_entity({	"text":" Click the Military Infrastructure tab. Most of the researches in this group improve your military's abilities in a variety of ways, but Manufacturing Tech is an important research to remember, as it opens up another slot in your Arms Factory, to a maximum of six slots. With empty slots in your Arms Factory, you can insert new unit blueprints that you have unlocked and build those unit types! <br/><br/>Click 'Next' to continue.",
																																																				"css":{"top":"0px","left":"500px","width":"300px"},
																																																				"arrows":	{
																																																				"arrow1":{"dir":"down","css":{"top":"200px","right":"510px"}}
																																																			}
																																														}
																																															,	function() {
																																																	display_tutorial_entity({	"text":" Click the Advanced Technologies tab. These new technologies are both volatile and difficult to unlock and open up new avenues of exploration and destruction for your civilization. Consider these technologies the pinnacle of success. Only the best will get even one of them.<br/><br/>Click 'Next' to continue.",
																																																								"css":{"top":"0px","left":"100px","width":"300px"},
																																																								"arrows":	{
																																																							
																																																								"arrow1":{"dir":"down","css":{"top":"200px","right":"335px"}}
																																																							}
																																																		}
																																																			,	function() {
																																																					display_tutorial_entity({	"text":" Click the Military Units tab. There are 12 unlockable unit blueprints in A.I. Wars, each representing one type of combat unit. Each one has it's weaknesses and it's strengths. In order to turn each blueprint into actual units in your army, you need an open slot in the Arms Factory, which can be obtained via Manufacturing Tech in the Military Infrastructure tab. Then you can load a blueprint you unlocked into the slot from the Arms Factory menu, and begin queuing up units of that type to be built. <br/><br/>Click 'Next' to continue.",
																																																												"css":{"top":"0px","left":"100px","width":"300px"},
																																																												"arrows":	{
																																																												
																																																												"arrow4":{"dir":"down","css":{"top":"200px","right":"200px"}}
																																																											}
																																																						}
																																																							,	function() {
																																																									display_tutorial_entity({	"text":" Click the AI Research tab. In A.I. Wars, you have the option of using a powerful backend Artifical Intelligence system named E.V.E., a Revelations class AI. However, while Eve theoretically has the ability to control and run every aspect of your civilization for you, you need to unlock those abilities before you can use them in your AI. Each chunk is represented by an API research below, and each API gives you access to new sets of commands for Eve.<br/><br/>Click 'Next' to continue.",
																																																																"css":{"top":"0px","left":"100px","width":"300px"},
																																																																"arrows":	{
																																																															
																																																																"arrow5":{"dir":"down","css":{"top":"200px","right":"75px"}}
																																																															}
																																																										}
																																																											,	function() {
																																																													display_tutorial_entity({	"text":" This concludes the Institute tutorial. <br/><br/>Click 'Next' to continue.",
																																																																				"css":{"top":"0px","left":"100px","width":"300px"},
																																																																				
																																																														}
																																																													)
																																																												} // Closing exit message.
																																																									)
																																																								} // Closing AI Research explanation
																																																					)
																																																				} // Closing Military Units explanation
																																																	)
																																																} // Closing Advanced Technologies explanation
																																													)
																																												} // Closing Military Infrastructure explanation
																																								)
																																						} // Closing Civil Infrastructure explanation
																																					
																															)
																												} 	 // Closing Tab explanation
																											)
																										} // closing different tech type explanation
																							
																								
																						)
																					}// closing one-time vs level-up explanation
																				)
																		}// closing scholars explanation
																	)
																}// closing Purchase explanation
															);
														}//closing intro function
													);
														
													
												
											
	$("#IN_numKnowledge span").text(Math.floor(player.research.knowledge));
	$("#IN_ppd span").text(Math.floor(86400/player.research.scholTicksTotal));
	
	$(".researchTree").jScrollPane({showArrows:true,hideFocus:true});
	var KP = Math.floor(player.research.knowledge);
	$("#IN_civInf .level").each(function(i, v) {
						var points = 0;
						switch(i) {
							case 0:
								$(v).text("[Level " + player.research.buildingSlotTech + "]");
								points = (player.research.buildingSlotTech+1)*10;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 1:
								$(v).text("[Level " + player.research.stabilityTech + "]");
								points = (player.research.stabilityTech+1)*5;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points && player.research.stabilityTech<10) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else if(player.research.stabilityTech>9) $(v).siblings(".bpResearch, .research, .points").css("display","none");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 2:
								$(v).text("[Level " + (player.research.lotTech-7) + "]");
								points = (player.research.lotTech-7)*20;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points && player.research.lotTech<18) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else if(player.research.lotTech>17) $(v).siblings(".bpResearch, .research, .points").css("display","none");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 3:
								$(v).text("[Level " + player.research.townTech + "]");
								points = (player.research.townTech+1)*50;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 4:
								$(v).text("[Level " + player.research.engTech + "]");
								points = (player.research.engTech+1)*5;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points && player.research.engTech<20) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else if(player.research.engTech>19) $(v).siblings(".bpResearch, .research, .points").css("display","none");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 5:
								$(v).text("[Level " + player.research.tradeTech + "]");
								points = (player.research.tradeTech+1)*5;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points && player.research.tradeTech<20) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else if(player.research.tradeTech>19) $(v).siblings(".bpResearch, .research, .points").css("display","none");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 6:
								$(v).text("[Level " + player.research.scholTech + "]");
								points = (player.research.scholTech+1)*5;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points && player.research.scholTech<20) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else if(player.research.scholTech>19) $(v).siblings(".bpResearch, .research, .points").css("display","none");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
						}
					});
					
	$("#IN_milInf .level").each(function(i, v) {
						var points = 0;
						switch(i) {
							case 0:
								$(v).text("[Level " + player.research.afTech + "]");
								points = (player.research.afTech+1)*5;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points && player.research.afTech<10) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else if(player.research.afTech > 9) $(v).siblings(".bpResearch, .research, .points").css("display","none");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 1:
								$(v).text("[Level " + player.research.bunkerTech + "]");
								points = (player.research.bunkerTech+1)*5;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points && player.research.bunkerTech<10) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else if(player.research.bunkerTech > 9) $(v).siblings(".bpResearch, .research, .points").css("display","none");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 2:
								$(v).text("[Level " + player.research.aLotTech + "]");
								points = player.research.aLotTech*20;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points && player.research.aLotTech<6) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else if(player.research.aLotTech>5)$(v).siblings(".bpResearch, .research, .points").css("display","none");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 3:
								$(v).text("[Level " + player.research.commsCenterTech + "]");
								points = (player.research.commsCenterTech+1)*5;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 4:
								$(v).text("[Level " + player.research.stealthTech + "]");
								points = (player.research.stealthTech+1)*10;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 5:
								$(v).text("[Level " + player.research.scoutTech + "]");
								points = (player.research.scoutTech+1)*10;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 6:
								$(v).text("[Level " + player.research.supportTech + "]");
								points = (player.research.supportTech+1)*5;
								$(v).siblings(".points").text(points+" KP");
								if(KP >= points) $(v).siblings(".research").text("Upgrade").removeClass("noBuy");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							
						}
					});
	$("#IN_milUnits .level").each(function(i, v) {
						switch(i) {
							case 0:
								var points = 100*player.research.tPushes;
								$(v).siblings(".points").text(points+" KP");
								if(KP>=points) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
								else $(v).siblings(".research").text("Need " + (points-KP)+" points");
								break;
							case 1:
							case 2:
							case 3:
								$(v).text("[Locked]").siblings(".points").text("50 KP");
								if(KP>=50) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
								else $(v).siblings(".research").text("Need " + (50-KP)+" points");
								$.each(player.AUTemplates,function(j,w){
									if(w.name == $(v).siblings(".fullName").text()) { 
										$(v).text("[Unlocked]").siblings(":not(.fullName, .info)").css("display","none");
										return false;
									}
								});
								break;
							case 4:
							case 5:
							case 6:
								$(v).text("[Locked]").siblings(".points").text("100 KP");
								if(KP>=100&&player.towns.length>1) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
								else if(player.towns.length<2) $(v).text("[Locked]");
								else $(v).siblings(".research").text("Need " + (100-KP)+" points");
								$.each(player.AUTemplates,function(j,w){
									if(w.name == $(v).siblings(".fullName").text()) { 
										$(v).text("[Unlocked]").siblings(":not(.fullName, .info)").css("display","none");
										return false;
									}
								});
								break;
							case 7:
							case 8:
							case 9:
								$(v).text("[Locked]").siblings(".points").text("200 KP");
								if(KP>=200&&player.towns.length>2) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
								else if(player.towns.length<3) $(v).text("[Locked]");
								else $(v).siblings(".research").text("Need " + (200-KP)+" points");
								$.each(player.AUTemplates,function(j,w){
									if(w.name == $(v).siblings(".fullName").text()) { 
										$(v).text("[Unlocked]").siblings(":not(.fullName, .info)").css("display","none");
										return false;
									}
								});
								break;
							case 10:
							case 11:
							case 12:
								$(v).text("[Locked]").siblings(".points").text("400 KP");
								if(KP>=400&&player.towns.length>3) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
								else if(player.towns.length<4) $(v).text("[Locked]");
								else $(v).siblings(".research").text("Need " + (400-KP)+" points");
								$.each(player.AUTemplates,function(j,w){
									if(w.name == $(v).siblings(".fullName").text()) { 
										$(v).text("[Unlocked]").siblings(":not(.fullName, .info)").css("display","none");
										return false;
									}
								});
								break;
						}
					});
					
	$("#IN_advTech .level").each(function(i, v) {
						switch(i) {
							case 0:
								$(v).text((player.research.zeppTech?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("800 KP");
								if(!player.research.zeppTech) {
									if(KP >= 800) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (800-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 1:
								$(v).text((player.research.missileSiloTech?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("400 KP");
								if(!player.research.missileSiloTech) {
									if(KP >= 400) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (400-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 2:
								$(v).text((player.research.recyclingTech?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("100 KP");
								if(!player.research.recyclingTech) {
									if(KP >= 100) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (100-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 3:
							case 4:
							case 5:
							case 6:
								var unlocked = false;
								if(i==3) unlocked = player.research.metalRefTech;
								else if(i==4) unlocked = player.research.timberRefTech;
								else if(i==5) unlocked = player.research.manMatRefTech;
								else unlocked = player.research.foodRefTech;
								
								$(v).text((unlocked?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("200 KP");
								if(!unlocked) {
									if(KP >= 200) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (200-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
						}
					});
					
	$("#IN_aiRes .level").each(function(i, v) {
						switch(i) {
							case 0:
								$(v).text((player.research.attackAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("50 KP");
								if(!player.research.attackAPI) {
									if(KP >= 50) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (50-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 1:
								$(v).text((player.research.advancedAttackAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("75 KP");
								if(!player.research.advancedAttackAPI) {
									if(KP >= 75) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (75-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 2:
								$(v).text((player.research.digAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("75 KP");
								if(!player.research.digAPI) {
									if(KP >= 400) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (400-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 3:
								$(v).text((player.research.tradingAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("50 KP");
								if(!player.research.tradingAPI) {
									if(KP >= 50) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (50-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 4:
								$(v).text((player.research.advancedTradingAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("75 KP");
								if(!player.research.advancedTradingAPI) {
									if(KP >= 75) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (75-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 5:
								$(v).text((player.research.smAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("200 KP");
								if(!player.research.smAPI) {
									if(KP >= 200) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (200-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 6:
								$(v).text((player.research.buildingAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("75 KP");
								if(!player.research.buildingAPI) {
									if(KP >= 75) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (75-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 7:
								$(v).text((player.research.advancedBuildingAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("125 KP");
								if(!player.research.advancedBuildingAPI) {
									if(KP >= 125) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (125-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 8:
								$(v).text((player.research.researchAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("50 KP");
								if(!player.research.researchAPI) {
									if(KP >= 50) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (50-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 9:
								$(v).text((player.research.messagingAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("100 KP");
								if(!player.research.messagingAPI) {
									if(KP >= 100) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (100-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 10:
								$(v).text((player.research.zeppelinAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("400 KP");
								if(!player.research.zeppelinAPI) {
									if(KP >= 400) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (400-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 11:
								$(v).text((player.research.nukeAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("200 KP");
								if(!player.research.nukeAPI) {
									if(KP >= 200) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (200-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 12:
								$(v).text((player.research.worldMapAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("50 KP");
								if(!player.research.worldMapAPI) {
									if(KP >= 50) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (50-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
							case 13:
								$(v).text((player.research.completeAnalyticAPI?"[Unl":"[L") + "ocked]");
								$(v).siblings(".points").text("50 KP");
								//all advanced APIs must be unlocked before this can be unlocked
								if(!player.research.completeAnalyticAPI&&player.research.advancedAttackAPI&&player.research.advancedTradingAPI&&player.research.advancedBuildingAPI) {
									if(KP >= 50) $(v).siblings(".research").text("Purchase").removeClass("noBuy");
									else $(v).siblings(".research").text("Need " + (50-KP)+" points");
								} else $(v).siblings(":not(.fullName, .info)").css("display","none");
								break;
						}
					});
	if(bldgInfo.numLeftToBuild>0) {
		$("#IN_numPplBldg").text(bldgInfo.numLeftToBuild);
		$("#IN_ticksTillNext").text(bldgInfo.ticksLeft);
	} else {
		$("#IN_numPplBldg").text("None");
		$("#IN_ticksTillNext").text("00:00:00");
	}

	$(".expand").unbind("click").click(function() {
		var not = "#blank"; //just to prevent errors in .not()
		if(!$(this).hasClass("open")) {
			var index = BUI.IN.activeTab = $(this).index(".expand");
			
			$(".expand.open").removeClass("open");
			$(".researchTree.open").removeClass("open").animate({"opacity":"toggle"},"fast"); //close any open research Trees
			
			$(this).addClass("open");
			var api;
			switch(index) { //and open the new one
				case 0:
					api = $("#IN_civInf").addClass("open").data('jsp');
					break;
				case 1:
					api = $("#IN_milInf").addClass("open").data('jsp');
					break;
				case 2:
					api = $("#IN_advTech").addClass("open").data('jsp');
					break;
				case 3:
					api = $("#IN_milUnits").addClass("open").data('jsp');
					break;
				case 4:
					api = $("#IN_aiRes").addClass("open").data('jsp');
					break;
			}
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
												load_player(player.league,true,true);
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
			title = "Use BP - Troop Push"
			message = "Troop Push grants you two days worth of free units in your capital city.  Note that this is based off actual build times, so the amount gained decreases as your army grows.<br/>CSL and size information can be found in your Headquarters.<br/><div style='font-weight:bold;'>Cost: 200BP</div><div style='text-align: right;'>Current BP:"+player.research.bp+"</div>"
		}
		
		display_message(title,message,function() {
			display_output(false,"Autoresearching "+name);
			var useBP = new make_AJAX();
			useBP.callback = function(response) {
								if(response.match(/true/)) {
									display_output(false,"Success!");
									load_player(player.league,true,true);
								} else {
									var error = response.split(":");
									if(error.length == 2) error = error[1];
									display_output(true,error,true);
								}
							}
			useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP("+((code != "troopPush")?"research_":"")+code+");");
		});
	});
	
	$(".info").unbind("click").click(help_re);
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
			bldgInfo.numLeftToBuild += BUI.queue.numLeftToBuild
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
	switch(which) {
		case "buildingSlotTech":
			desc = '<h4>Building Server Tech</h4>Code: buildingSlotTech<p>Each level of Build Slot Tech increases the number of buildings that can be upgraded, constructed, or deconstructed at the same time.</p>';
			break;
		case "buildingStabilityTech":
			desc = "<h4>Building Stability Tech</h4>Code: buildingStabilityTech<p>Each level of Building Stability Tech increases your engineer's ability to construct sound buildings.  This decreases their susceptability to bombing.</p>";
			break;
		case "lotTech":
			desc = "<h4>Building Lot Tech</h4>Code: lotTech<p>Each level of Building Lot Tech increases the number of lots on which you can build buildings.  After level 9, additional levels only affect colonies.</p>";
			break;
		case "unitLotTech":
			desc = "<h4>Manufacturing Tech</h4>Code: unitLotTech<p>Each level of Manufacturing Tech increases the quaility of the manufacturing equipment in your Arms Factories.  This allows your Arms Factories to produce more varied units without additional programming<br/>(Increases AU slots in Arms Factories by one)</p>";
			break;
		case "commsCenterTech":
			desc = "<h4>Communication Tech</h4>Code: commsCenterTech<p>Reasearching Communication Tech allows your engineers to further upgrade the communication equipment in your Comms. Centers, increasing their effective range.<br/>(Increases detection range by 10%)</p>";
			break;
		case "townTech":
			desc = "<h4>Town Tech</h4>Code: townTech<p>Researching Town Tech increases your system's ability to multitask and override the default systems in other towns.  This allows more towns to be controlled at once.</p>";
			break;
		case "engineerTech":
			desc = "<h4>Engineer Efficiency</h4>Code: engineerTech<p>Engineer Efficiency increases, what else, the efficiency of your Engineers!  Each level of this research increases the build time reducing effect of your engineers by 10%.</p>";
			break;
		case "tradeTech":
			desc = "<h4>Trader Efficiency</h4>Code: tradeTech<p>Trader Efficiency broadly increases your capacity for trade by increases the speed and carrying capacity of your Traders by 10%.  In addidition, high Trader Efficiency will net you better rates on the Stock Market!</p>";
			break;
		case "scholarTech":
			desc = "<h4>Scholar Efficiency</h4>Code: scholarTech<p>Scholar Efficiency grants your scholars access to more sophisticated equipment to run their tests.  The net result is a 10% increase, per level, of knowledge point generation per scholar.</p>";
			break;
		case "afTech":
			desc = '<h4>Arms Factory Tech</h4>Code: afTech<p>The quality of the craftsmenship of your units is a key part in increasing their survivability abroad.  Each level of Arms Factory Tech increases the protective effect your Arms Factories give to your units abroad by 5%.</p>';
			break;
		case "bunkerTech":
			desc ="<h4>Bunker Tech</h4>Code: bunkerTech<p>Bunker are designed to hide and protect.  With each level of this tech, your Bunkers will be able to hide and protect more men and goods then they did before.<br/>(Bunker effect increased by 5%)</p>";
			break;
		case "stealthTech":
			desc ="<h4>Stealth Tech</h4>Code: stealthTech<p>Stealth Tech represents your troops overal knowledge of stealth.  Each level increases the ability of your troops to find cover in combat and find hidden troops.</p>";
			break;
		case "scoutTech":
			desc="<h4>Scout Tech</h4>Code: scoutTech<p>Scout Tech represents your troops overal knowledge of infiltration and subterfuge.  Each level increases your scouts ability to infiltrate enemy bases.</p>";
			break;
		case "supportTech":
			desc="<h4>Support Tech</h4>Code: supportTech<p>Researching Support Tech increases the amount of space in your barraks that can be alloted to foreign armies.  Each level increases the number of players that can support you by 1 and increases the percentage of your army population that you can have as support by 10%.</p>";
			break;
		case "troopPush":
			desc="<h4>Troop Push</h4>Code: troopPush<p>When you order a troop push, your entire town shifts into high gear to produce as many units as possible.  As time goes on, your town slowly loses the ability to produce units in this fasion.<br/>(Simulates one of your Arms Factories running at full capacity for the number of hours specified.  This time is split between all currently assigned AU.)</p>";
			break;
		case "zeppTech":
			desc="<h4>Airship Tech</h4>Code: zeppelinTech<p>Researching Airship Tech grants you access to the mighty Zeppelin.  Zeppelin's are built from a Zeppelin Hangar and function as Troop Transports and Mobile Command Centers.  Because of their speed and utility, Zeppelins can only travel so far without needing a refuel.  Fuel is generated at Hangars at a rate dictaded by the Hangars level</p>";
			break;
		case "missileSiloTech":
			desc="<h4>Advanced Rocketry</h4>Code: missileSiloTech<p>With Advanced Rocketry, your empire gains the knowledge to create and use powerful missile technologies and unlocks the Missile Silo building.  As you level up your Missile silo, the missiles inside become more powerful.  Launching a missile destroyes the silo; defending against a missile lowers your Missile Silo's level by the level of the incoming missile, to a minimum of 1.</p>";
			break;
		case "recyclingTech":
			desc="<h4>Recycling Tech</h4>Code: recyclingCenterTech<p>Through the use of advanced Recycling Centers, your troops can now convert battlefield losses back into resources.  The process itself is quite grim, in some cases, but always results in high quality scrap that is converted back into useful resources.</p>";
			break;
		case "metalRefTech":
			desc="<h4>Advanced Metallurgy</h4>Code: metalRefTech<p>Advanced Metallurgy unlocks the Metal Refinery.  In this building, the metal ores that your mines produce are further refined to separate out metals that would normally have been unobtainable.</p>";
			break;
		case "timberRefTech":
			desc="<h4>Timber Processing</h4>Code: timberRefTech<p>This tech unlocks the Timber Processing Plant.  Using more precise instruments and cutting tools, harvested timber is more efficiently processed alowing for more of the log to be used then ever before.</p>";
			break;
		case "manMatRefTech":
			desc="<h4>Materials Research</h4>Code: manMatRefTech<p>Through the research of newer, or more efficient materials, the Materials Research Center allows for more or better Manufactured Materials to be produced with the same amount and grade of raw materials.</p>";
			break;
		case "foodRefTech":
			desc="<h4>Hydroponics</h4>Code: foodRefTech<p>Hydroponics Labs, unlocked by this research, are specialized labs for the research and development of Hydroponics.  The equipment and practices produced by these labs can vastly increase the amount of food growable by your Farms.</p>";
			break;
		case "attackAPI":
			desc="<ul style='float: right;padding-left:10px;'><span style='margin-left:-20px;'>Unlocks:</span><li>createCombatUnit</li><li>canCreateCombatUnit</li><li>changeBunkerMode</li><li>killMyself</li><li>changeCivWeap</li><li>canSendAttack</li><li>attack</li><li>resupply</li><li>recall</li><li>sendHome</li></ul>\
					<h4>Attack Automation</h4>Code: attackAPI<p>By integrating more advanced computer systems into your Headquarters, your AI is now capable of automatically sending your men on missions.</p>";
			break;
		case "advancedAttackAPI":
			desc="<ul style='float: right;padding-left:20px;'><span style='margin-left:-20px;'>Unlocks:</span><li>getAFEffectToString</li><li>getBunkerEffectToString</li><li>getCSL</li><li>getCSLAtLevel</li><li>getPoppedUnits</li><li>getCS</li><li>getCivWeap</li><li>getAttackETA</li><li>getWeapons</li><li>getUserRaid</li><li>getUserRaids</li><li>getUserAttackUnits</li><li>getUserAttackUnitTemplates</li><li>getUserSR</li><li>markUnReadUserSR</li><li>markReadUserSR</li><li>deleteUserSR</li><li>archiveUserSR</li><li>unarchiveUserSR</li></ul>\
					<h4>Attack Integration</h4>Code: advancedAttackAPI<p>By further integrating and improving the subsystems in your HQ and Communications Center, your AI can now see and communicate with your active missions as well as react to hostile presences.</p>";
			break;
		case "digAPI":
			desc="<ul style='float: right;padding-left:20px;'><span style='margin-left:-20px;'>Unlocks:</span><li>respondToDigMessage</li></ul>\
					<h4>Archeology Integration</h4>Code: digAPI<p>Adds additional hooks in your Scholars archeology equipment allowing your AI to send them commands remotely.</p>";
			break;
		case "tradingAPI":
			desc="<ul style='float: right;padding-left:10px;'><span style='margin-left:-20px;'>Unlocks:</span><li>setUpTradeSchedule</li><li>cancelTradeSchedule</li><li>acceptTradeSchedule</li></ul>\
					<h4>Trade Automation</h4>Code: tradingAPI<p>By adding AI subroutines to the equipment in your Trade Centers, your scientists can grant your AI access to the Trading system where it can automate your trades.</p>";
			break;
		case "advancedTradingAPI":
			desc="<ul style='float: right;padding-left:20px;'><span style='margin-left:-20px;'>Unlocks:</span><li>howManyTraders</li><li>getTradeETA</li><li>getUserTrade</li><li>getUserTrades</li><li>getUserTradeSchedule</li><li>getUserTradeSchedules</li><li>getOpenTwoWays</li></ul>\
					<h4>Trade Integration</h4>Code: advancedTradingAPI<p>Full integration of AI processes and an upgrade to Trading software allows your AI to have full access to your trade network.  Through this network, it can coordinate your traders as well as update and modify their schedules.</p>";
			break;
		case "smAPI":
			desc="<ul style='float: right;padding-left:10px;'><span style='margin-left:-20px;'>Unlocks:</span><li>getStockMarketRates</li><li>setUpStockMarketTrade</li></ul>\
					<h4>Market Integration</h4>Code: smAPI<p>Tying your AI into the former Global Trade Market, or Stock Market, allows it access to advanced trading routines and access to automated trade centers.  These trade centers still actively monitor trade routes and offer trades based on the global economy.</p>";
			break;
		case "buildingAPI":
			desc="<ul style='float: right;padding-left:20px;'><span style='margin-left:-20px;'>Unlocks:</span><li>demolish</li><li>buildCombatUnit</li><li>build</li><li>canBuild</li><li>levelUp</li><li>canUpgrade</li><li>buildEng</li><li>buildTrader</li><li>buildSchol</li><li>renameTown</li><li>setCapitalCity</li></ul>\
					<h4>Build Automation</h4>Code: buildingAPI<p>Tying your AI into the equipment and routines used by production and trainging buildings allows your AI to automate the Military production process as well as Civilian training.</p>";
			break;
		case "advancedBuildingAPI":
			desc="<ul style='float: right;padding-left:20px;'><span style='margin-left:-20px;'>Unlocks:</span><li>returnPrice</li><li>returnPriceToGetToLevel</li><li>haveBldg</li><li>cancelQueueItem</li><li>canBuy</li><li>getTicksForLevelingAtLevel</li><li>getTicksForLeveling</li><li>getTicksPerPerson</li><li>getTicksPerAttackUnit</li><li>getBuildings</li><li>getUserBuilding</li><li>getUserBuildings</li><li>getUserBuildingServer</li><li>getUserQueueItems</li></ul>\
					<h4>Build Integration</h4>Code: advancedBuildingAPI<p>Full integration with the Building Network allows your AI to oversee all aspects of your towns allowing for more seemless maintenence.</p>";
			break;
		case "researchAPI":
			desc="<ul style='float: right;padding-left:10px;'><span style='margin-left:-20px;'>Unlocks:</span><li>canCompleteResearches</li><li>completeResearches</li></ul>\
					<h4>Research Integration</h4>Code: researchAPI<p>Integrating the AI into the scientific equipment allows your AI to assist your scientists with their experiments.  While this does not increase their efficiency, it can expidite the applications of their research.</p>";
			break;
		case "messagingAPI":
			desc="<ul style='float: right;padding-left:20px;'><span style='margin-left:-20px;'>Unlocks:</span><li>sendMessage</li><li>sendSystemMessage</li><li>sendLeagueMessage</li><li>canCreateUserGroup</li><li>createUserGroup</li><li>getUserGroups</li><li>canUpdateUserGroup</li><li>updateUserGroup</li><li>deleteUserGroup</li><li>userGroupExists</li><li>getMessages</li><li>markReadMessage</li><li>markUnReadMessage</li><li>markDeletedMessage</li></ul>\
					<h4>Communication Integration</h4>Code: messagingAPI<p>Allowing your AI access to your Communications Relays allows it to send messages to other cities and manage your communication channels and diplomatic cables.</p>";
			break;
		case "zeppelinAPI":
			desc="<ul style='float: right;padding-left:10px;'><span style='margin-left:-20px;'>Unlocks:</span><li>createAirship</li><li>abortAirship</li><li>moveAirship</li><li>offloadResources</li></ul>\
					<h4>Zeppelin Integration</h4>Code: zeppelinAPI<p>By integrating more advanced and secure communication and control equipment onto your zeppelins, your AI can now direct their actions and update their flightplans.</p>";
			break;
		case "nukeAPI":
			desc="<ul style='float: right;padding-left:10px;'><span style='margin-left:-20px;'>Unlocks:</span><li>canLaunchNuke</li><li>launchNuke</li></ul>\
					<h4>Missile Integration</h4>Code: nukeAPI<p>Plugging the AI into your missile silo's allows it to access and remote launch these deadly Weapons of Mass Destruction.</p>";
			break;
		case "worldMapAPI":
			desc="<ul style='float: right;padding-left:10px;'><span style='margin-left:-20px;'>Unlocks:</span><li>getWorldMap</li></ul>\
					<h4>Map Integration</h4>Code: worldMapAPI<p>Integrating your AI with your cartography systems allows it, for the first time, to really see the world around it and act accordingly.</p>";
			break;
		case "completeAnalyticAPI":
			desc="<ul style='float: right;padding-left:10px;'><span style='margin-left:-20px;'>Unlocks:</span><li>getUserTownsWIthSupportAbroad</li><li>getUserTowns</li><li>getUserTownsSlim</li><li>getUserPlayer</li></ul>\
					<h4>Complete Integration</h4>Code: completeAnalyticAPI<p><span style='font-weight:bold'>This research can only be unlocked after all the advanced APIs have.</span><br/><br/>Fully unlocking your systems and integrating your AI into them allows it to completely monitor and manage your empire.  This level of integration allows for a completely seemless integration of your AI across all your towns.</p>";
			break;
		case "ShockTrooper":
			desc="<h4>Shock Trooper Blueprint</h4>Code: ShockTrooper<p>This blueprint is unlocked automatically.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/soldierrenderSMALL.png' style='float: left;' alt='Soldier'/>\
						<img src='AIFrames/units/insig1-white.png' class='helpInsig' alt='Destroyer'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 25</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 40</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 75</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 40</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 50</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 100</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 50</div>\
					</div>Unit Type: Soldier<br/>Destroyer Class*<br/><br/>"
					+UTCC.unitDesc[0]+"<br/><br/>Strong against <img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed'><br/>Weak against <img src='AIFrames/icons/firepower-white.png' title='firepower' alt='firepower'><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Pillager":
			desc="<h4>Pillager Blueprint</h4>Code: Pillager<p>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/soldierrenderSMALL.png' style='float: left;' alt='Soldier'/>\
						<img src='AIFrames/units/insig5-white.png' class='helpInsig' alt='Mayhem'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 36</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 55</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 36</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 33</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 36</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 11</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 221</div>\
					</div>Unit Type: Soldier<br/>Mayhem Class* - 10% Stat Boost, 5% BP Bonus<br/><br/>"
					+UTCC.unitDesc[0]+"<br/><br/>Good against <img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor'><br/>Weak against <img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Vanguard":
			desc="<h4>Vanguard Blueprint</h4>Code: Vanguard<p>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/soldierrenderSMALL.png' style='float: left;' alt='Soldier'/>\
						<img src='AIFrames/units/insig3-white.png' class='helpInsig' alt='Defender'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 42</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 40</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 125</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 100</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 42</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 40</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 1</div>\
					</div>Unit Type: Soldier<br/>Defender Class* - 5% Armor, Conc., Speed, & Cargo Boost<br/><br/>"
					+UTCC.unitDesc[0]+"<br/><br/>Strong against <img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /><br/>Weak against <img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Wolverine":
			desc="<h4>Wolverine Blueprint</h4>Code: Wolverine<p>You must have 2 cities to research a Tank Tech.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/tankrenderSMALL.png' style='float: left;' alt='Tank'/>\
						<img src='AIFrames/units/insig4-white.png' class='helpInsig' alt='Devastator'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 105</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 231</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 52</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 92</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 157</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 92</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 105</div>\
					</div>Unit Type: Tank<br/>Devastator Class* - 5% Stat Boost<br/><br/>"
					+UTCC.unitDesc[1]+"<br/><br/>Strong against <img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /><br/>Weak against <img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Seeker":
			desc="<h4>Seeker Blueprint</h4>Code: Seeker<p>You must have 2 cities to research a Tank Tech.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/tankrenderSMALL.png' style='float: left;' alt='Tank'/>\
						<img src='AIFrames/units/insig6-white.png' class='helpInsig' alt='Battlehard'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 50</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 88</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 150</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 220</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 100</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 88</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 100</div>\
					</div>Unit Type: Tank<br/>Battlehard Class* - 25% BP Bonus<br/><br/>"
					+UTCC.unitDesc[1]+"<br/><br/>Strong against <img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /><br/>Weak against <img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Damascus":
			desc="<h4>Damascus Blueprint</h4>Code: Damascus<p>You must have 2 cities to research a Tank Tech.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/tankrenderSMALL.png' style='float: left;' alt='Tank'/>\
						<img src='AIFrames/units/insig7-white.png' class='helpInsig' alt='Stonewall'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 200</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 66</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 200</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 110</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 199</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 22</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 1</div>\
					</div>Unit Type: Tank<br/>Stonewall Class* - 25% Cover Size Limit deflection<br/><br/>"
					+UTCC.unitDesc[1]+"<br/><br/>Good against <img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Punisher":
			desc="<h4>Punisher Blueprint</h4>Code: Punisher<p>You must have 3 cities to research a Juggernaut Tech.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/juggernautrenderSMALL.png' style='float: left;' alt='Juggernaut'/>\
						<img src='AIFrames/units/insig9-white.png' class='helpInsig' alt='Impervious'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 257</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 532</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 110</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 214</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 256</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 214</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 256</div>\
					</div>Unit Type: Juggernaut<br/>Impervious Class* - 50% Weather Resistance, 10% Stat Boost<br/><br/>"
					+UTCC.unitDesc[2]+"<br/><br/>Good against <img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /><br/>Weak against <img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Dreadnaught":
			desc="<h4>Dreadnaught Blueprint</h4>Code: Dreadnaught<p>You must have 3 cities to research a Juggernaut Tech.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/juggernautrenderSMALL.png' style='float: left;' alt='Juggernaut'/>\
						<img src='AIFrames/units/insig10-white.png' class='helpInsig' alt='Conqueror'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 330</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 319</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 110</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 321</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 220</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 321</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 220</div>\
					</div>Unit Type: Juggernaut<br/>Conqueror Class* - 25% Weather Resistance, 25% Cover Size Limit Deflection, 10% Stat Boost<br/><br/>"
					+UTCC.unitDesc[2]+"<br/><br/>Good against <img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /><br/>Weak against <img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Collossus":
			desc="<h4>Collossus Blueprint</h4>Code: Collossus<p>You must have 3 cities to research a Juggernaut Tech.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/juggernautrenderSMALL.png' style='float: left;' alt='Juggernaut'/>\
						<img src='AIFrames/units/insig8-white.png' class='helpInsig' alt='Ironside'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 105</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 105</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 105</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 403</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 315</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 403</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 315</div>\
					</div>Unit Type: Juggernaut<br/>Ironside Class* - 25% BP Bonus, 25% Cover Size Limit deflection, 5% stat Boost<br/><br/>"
					+UTCC.unitDesc[2]+"<br/><br/>Good against <img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /><br/>Weak against <img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Helios":
			desc="<h4>Helios Blueprint</h4>Code: Helios<p>You must have 4 cities to research a Bomber Tech.<br/>Damage shown is the amount done to units.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Bomber'/>\
						<img src='AIFrames/units/bombinsig2-white.png' class='helpInsig' alt='Havoc'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 29</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 182</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 29</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 182</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 30</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 182</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 12</div>\
					</div>Unit Type: Bomber<br/>Havoc Class* - 25% increase in Unit Damage<br/><br/>"
					+UTCC.unitDesc[3]+"<br/><br/>Weak against <img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /><br/>Does significantly reduced damage to buildings.<br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Horizon":
			desc="<h4>Horizon Blueprint</h4>Code: Horizon<p>You must have 4 cities to research a Bomber Tech.<br/>Damage shown is the amount done to units.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Bomber'/>\
						<img src='AIFrames/units/bombinsig3-white.png' class='helpInsig' alt='Devastator'/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 29</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 66</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 12</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 66</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 30</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 66</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 29</div>\
					</div>Unit Type: Bomber<br/>Devastator Class* - 25% increase in Building Damage<br/><br/>"
					+UTCC.unitDesc[3]+"<br/><br/>Weak against <img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /><br/>Does reduced damage to buildings.<br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
		case "Hades":
			desc="<h4>Hades Blueprint</h4>Code: Hades<p>You must have 4 cities to research a Bomber Tech.<br/>Damage shown is the amount done to units.<br/>\
					<div style='float:left;width: 150px;'>\
						<img src='AIFrames/units/bomberrenderSMALL.png' style='float: left;' alt='Bomber'/>\
						<img src='AIFrames/units/bombinsig5-white.png' class='helpInsig' alt='Armageddon '/>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/armor-white.png' title='Armor' alt='Armor' /> 12</div><div class='helpStat'><img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /> 34</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/stealth-white.png' title='Concealment' alt='Concealment' /> 30</div><div class='helpStat'><img src='AIFrames/icons/accuracy-white.png' title='Accuracy' alt='Accuracy' /> 34</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/speed-white.png' title='Speed' alt='Speed' /> 29</div><div class='helpStat'><img src='AIFrames/icons/ammo-white.png' title='Ammunition' alt='Ammunition' /> 34</div>\
						<div class='helpStat firstcol'><img src='AIFrames/icons/cargo-white.png' title='Cargo' alt='Cargo' /> 29</div>\
					</div>Unit Type: Bomber<br/>Armageddon  Class* - 25% damage bonus<br/><br/>"
					+UTCC.unitDesc[3]+"<br/><br/>Weak against <img src='AIFrames/icons/firepower-white.png' title='Firepower' alt='Firepower' /><br/><br/><span style='font-size:10px;'>* Class bonuses that affect stats are already calculated into the relevant stats.</span></p>";
			break;
	} //end of switch
	display_message("Help",desc);
}