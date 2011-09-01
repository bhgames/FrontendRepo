/**
 *	Universal method for tutorial message displays.  Provides abstract support for message boxes and arrows.
 */
function display_tutorial_entity(tut,callback) {
	$("#client").append("<div id='tutorial_box' class='tutorial'><span id='tutorial_text'></span><div id='tutorial_next'>Next &gt;&gt;</div></div>");
	$("#tutorial_text").html(tut.text);
	$("#tutorial_box").css(tut.css).fadeIn(100);
	
	$("#tutorial_next").one("click",function(){
		$(".tutorial").fadeOut(100, function(){
			$(".tutorial").remove();
			if(callback) callback();
		});
	});
	
	if(tut.arrows) {
		$.each(tut.arrows,function(i,v){
			$("#client").append("<div id='tutorial_arrow"+i+"' class='tutorial dir"+v.dir+"'></div>");
			$("#tutorial_arrow"+i).css(v.css).fadeIn(100);
		});
	}
}

/*******************************************************************************************************\
*											Beginner's Tutorial											*
\*******************************************************************************************************/
var tutorialRunning = false;
function run_tutorial() { //long tutorial is long -->  check out display_tutorial_entity (below) to understand what's going on here
	var message = "Welcome to the AI Wars game client!<br/><br/>Would you like to view our Beginner's Tutorial?<br/><span style='font-size:10px'>It is highly recommended that new users, especially those new to the MMORTS genre, view the tutorial.<br/>Once started, the tutorial cannot be stopped and refreshing the page will cause it to start over at this popup.</span>";
	if(!player.research.flicker.match(/BQ1|NQ1/)) message = "Are you sure you wish to replay the tutorial?";
	display_message("Beginner's Tutorial",message,
					function() {
						tutorialRunning = true;
						display_tutorial_entity({	"text":"Each phase of the tutorial will show up in a window like this one.  In addition, arrows may be displayed on the screen to help guide your attention.  Clicking 'Next' will take you to the next phase.  We'll be starting with Navigation.<br/><br/>Click 'Next' to continue.",
													"css":{"top":"200px","left":"200px","width":"300px"}
												}
							,function(){ //town view help
								display_tutorial_entity({	"text":"This is the 'View Town' button.  By clicking it, you'll be brought to the Town View, which is the interface you're currently looking at.  From this menu, you can access your existing buildings as well as build new ones, more on that later.<br/>In addition, the small blue arrow opens up the 'Town Switch Dropdown', from which you can change your currently viewed town.<br/><br/>Click 'Next' to continue.",
															"css":{"top":"200px","left":"200px","width":"300px"},
															"arrows":{	
																		"arrow1":{"dir":"up","css":{"top":"80px","left":"250px"}}
																	}
														}
									,function(){ //world map help
										display_tutorial_entity({	"text":"Next, we have the 'World Map' button.  Clicking this button will take you to the world map.<br/>From the world map, you'll be able to see all the nearby towns.  White towns belong to you, black towns belong to other players, and orange towns are under the control of Id.<br/><br/>Note: navigating to other menus will not interupt this tutorial.<br/>Click 'Next' to continue.",
																	"css":{"top":"200px","left":"300px","width":"300px"},
																	"arrows":{	
																				"arrow1":{"dir":"up","css":{"top":"80px","left":"450px"}}
																			}
																}
											,function(){ //Status Reports Help
												display_tutorial_entity({	"text":"Next is the 'Status Reports' button.  From this menu you can view and manage your status reports.  Status reports are generated whenever combat takes place involving your troops, even if they're supporting another town.<br/><br/>Click 'Next' to continue.",
																			"css":{"top":"200px","left":"450px","width":"300px"},
																			"arrows":{	
																						"arrow1":{"dir":"up","css":{"top":"80px","left":"650px"}}
																					}
																		}
													,function(){ //Messages help
														display_tutorial_entity({	"text":"Lastly, we have the 'Messages' button.  From this menu, you can compose, read, and manage your current messages.  At this time, your inbox is  limited to 100 messages.  Once this limit is reached, a new message will cause your <span syle='font-weight:bold'>oldest non-archived</span> message to be deleted.<br/><br/>Next, we'll go over the sidebar.",
																					"css":{"top":"200px","left":"600px","width":"300px"},
																					"arrows":{	
																								"arrow1":{"dir":"up","css":{"top":"80px","left":"850px"}}
																							}
																				}
															,function(){ //Console Help
																display_tutorial_entity({	"text":"This button opens the Output Window.<br/><br/>The Output Window, which may have popped up while the page was loading, displays a log of client activity as well as any errors encountered.<br/><br/>If you encounter any lag or odd behavior, check your Output for errors.  Most errors are handled by the client and require no action on your part.  Some errors are not caught (yet), so you may still experience incorrect behavior even if an error is not logged.",
																							"css":{"top":"100px","left":"160px","width":"500px"},
																							"arrows":{	
																										"arrow1":{"dir":"down","css":{"top":"65px","left":"30px"}}
																									}
																						}
																	,function(){ //IO Help
																		display_tutorial_entity({	"text":"The I/O button will change its appearance depending on the current tactical status of your town.  Friendly missions show as blue arrows, hostile missions show as red arrows.  Arrows outside the box denote outgoing missions, whereas arrows inside the box denote incoming missions.",
																									"css":{"top":"100px","left":"160px","width":"500px"},
																									"arrows":{	
																												"arrow1":{"dir":"down","css":{"top":"80px","left":"80px"}}
																											}
																								}
																			,function(){ //League button help
																				//$("#League").mouseover().addClass("open");
																				display_tutorial_entity({	"text":"Next we have the 'League' menu button.  From this menu you can create a new league or manage the league your in, assuming you have the privileges to do so.<br/><br/>In AI Wars, Leagues are more then just a collection of players.  They control their own towns, collect taxes from their members, maintain their own forces, etc.",
																											"css":{"top":"168px","left":"190px","width":"500px"},
																											"arrows":{	
																														"arrow1":{"dir":"right","css":{"top":"185px","left":"-10px"}}
																													}
																										}
																					,function(){ //Quest button help
																						//$("#League").removeClass("open").mouseout();
																						//$("#Quests").mouseover().addClass("open");
																						display_tutorial_entity({	"text":"This is the 'Quests' button.  Clicking it will take you to your quest log, from which you can view information on completed and in-progress quests.  If you're ever unsure of your quest goals, just head to the Quests menu and check the quest's info.",
																													"css":{"top":"241px","left":"190px","width":"500px"},
																													"arrows":{	
																																"arrow1":{"dir":"right","css":{"top":"260px","left":"-10px"}}
																															}
																												}
																							,function(){ //CS button help
																								//$("#Quests").removeClass("open").mouseout();
																								//$("#CS").mouseover().addClass("open");
																								display_tutorial_entity({	"text":"This button functions as a shortcut to your Headquarters - the building used to send missions.  You don't have one yet, so the button wont work. ;)",
																															"css":{"top":"314px","left":"190px","width":"500px"},
																															"arrows":{	
																																		"arrow1":{"dir":"right","css":{"top":"330px","left":"-10px"}}
																																	}
																														}
																									,function(){ //EVE button help
																										//$("#CS").removeClass("open").mouseout();
																										//$("#EVE").mouseover().addClass("open");
																										display_tutorial_entity({	"text":"Our last button takes you to the Revelations AI Programming interface.  Revelations, or EVE, as it's affectionately called by the Battlehard Team, is written entirely in the Java programming language.<br/>However, to unlock the full potential of EVE, you'll have to unlock its API.  Most of these are unlocked through research in your Institute though a few are unlocked through the Programming Quests.<br/><br/>Next is resources.",
																																	"css":{"top":"387px","left":"190px","width":"500px"},
																																	"arrows":{	
																																				"arrow1":{"dir":"right","css":{"top":"405px","left":"-10px"}}
																																			}
																																}
																											,function(){ //resource help
																												//$("#EVE").removeClass("open").mouseout();
																												display_tutorial_entity({	"text":"These are your resources.  Resources are used to build pretty much everything in AI Wars.<br/><br/>As you can see, each resource has a corresponding icon.  This icon is mirrored throughout to display costs for that resources type.<br/><br/>From the left, the first of our resources is Metal, followed by Timber, Manufactured Materials, and Food.<br/><br/>The next window requires you to be in the Town View.  Please enter Town View before clicking Next.",
																																			"css":{"top":"150px","left":"190px","width":"700px"},
																																			"arrows":{	
																																						"arrow1":{"dir":"down","css":{"top":"65px","left":"250px"}},
																																						"arrow2":{"dir":"down","css":{"top":"65px","left":"420px"}},
																																						"arrow3":{"dir":"down","css":{"top":"65px","left":"576px"}},
																																						"arrow4":{"dir":"down","css":{"top":"65px","left":"730px"}}
																																					}
																																		}
																													,function(){ //mines help
																														if(currUI!==show_town) {do_fade(show_town); display_output(false,"l2read");}
																														display_tutorial_entity({	"text":"As there are four resources, there are also four resource production buildings.  These 'mines' are created with your account and start at level 3.  Each mine's interface displays the icon of the resource it corresponds to.  So, if you happen to forget which is which, a simple check of your mines can refresh your memory.",
																																					"css":{"top":"330px","left":"190px","width":"700px"},
																																					"arrows":{	
																																								"arrow1":{"dir":"right","css":{"top":"270px","left":"330px"}},
																																								"arrow2":{"dir":"right","css":{"top":"170px","left":"430px"}},
																																								"arrow3":{"dir":"left","css":{"top":"180px","left":"680px"}},
																																								"arrow4":{"dir":"left","css":{"top":"270px","left":"800px"}}
																																							}
																																				}
																															,function(){ //build help
																																display_tutorial_entity({	"text":"Now, on to what is likely the most important skill, building.  To build buildings, you need to click on an empty build lot.  Go ahead and click on one now.  Empty lots look like this: <img src='AIFrames/buildings/HoverOverTile.png' alt='Build Lot' style='position:relative;top:12px;margin-top:-12px;' /><br/><br/>Once clicked, a menu will open on the left side of the screen with a list of all the buildings you can build.  ",
																																							"css":{"top":"50px","left":"200px","width":"500px"}
																																						}
																																	,function(){ //extra build info
																																		display_tutorial_entity({	"text":"For more information on a specific building, for example, how much it costs to build, click the 'Build' button next to that building.  This will open up a popup with more information on that building.<br/><br/>Except the Headquarters, all buildings can be built multiple times regardless of the level of existing buildings of that type.",
																																									"css":{"top":"50px","left":"200px","width":"500px"}
																																								}
																																			,function() { //HQ info
																																				display_tutorial_entity({	"text":"In addition to being the only building you can only have one of per town, the Headquarters can only be built on this build lot.",
																																											"css":{"top":"100px","left":"190px","width":"200px"},
																																											"arrows" : {
																																															"arrow1":{"dir":"down","css":{"top":"250px","left":"560px"}}
																																														}
																																										}
																																					,function(){ //currently building list info
																																						display_tutorial_entity({	"text":"In addition, while you have buildings building, the Building Server will appear here.  When hovered over, it will slide open revealing a list of your currently constructing, destructing, and upgrading buildings.  Individual buildings construct concurrently.  Upgrades to the same building build sequentially.",
																																													"css":{"top":"50px","left":"200px","width":"500px"},
																																													"arrows":	{
																																																	"arrow1":{"dir":"down","css":{"bottom":"30px","left":"550px"}}
																																																}
																																												}
																																							,function(){ //unit help
																																								display_tutorial_entity({	"text":"In AI Wars, there are two primary unit types, Civilian and Military.  All military units are built from your Arms Factories and are unlocked in the Institute.  Civilian units are built out of Construction Yards, Institutes, and Trade Centers which make Engineers, Scholars, and Traders, respectively.",
																																															"css":{"top":"50px","left":"200px","width":"500px"}
																																														}
																																									,function(){ //menu intro
																																										display_tutorial_entity({	"text":"Next, I'd like to bring your attention to the 'Menu'.  The Menu contains a great deal of useful things that don't fit elsewhere in the User Interface.<br/><br/>Go ahead and click it now to open the menu.  Then, click Next.",
																																																	"css":{"top":"200px","left":"500px","width":"300px"},
																																																	"arrows":	{
																																																					"arrow1":{"dir":"down","css":{"top":"65px","right":"60px"}}
																																																				}
																																																}
																																											,function(){ //refresh help
																																												display_tutorial_entity({	"text":"The first item on the list is the 'Refresh' link.  This will refresh the client, not the page, and is generally useful if you experience any lag or hangs in the UI.<br/><br/>If a Refresh doesn't fix it, it probably needs to be reported via 'Support' along with any other information you can gather in relation to the problem.",
																																																			"css":{"top":"200px","left":"500px","width":"300px"}
																																																		}
																																													,function(){//BHM help
																																														display_tutorial_entity({	"text":"The 'Battlehard' menu can be used to activate Battlehard Mode as well as spend accumulated BP gained from being in Battlehard Mode.<br/><br/>Battlehard Mode is like hard mode.  It's designed to make gameplay a little more challenging, but also more rewarding.",
																																																					"css":{"top":"200px","left":"500px","width":"300px"}
																																																				}
																																															,function(){ //account help
																																																display_tutorial_entity({	"text":"'Account' allows you to view your account's data (current Rank, Achievements, etc.), as well as rename your towns and integrate your AI Wars account with your Facebook account.",
																																																							"css":{"top":"200px","left":"500px","width":"300px"}
																																																						}
																																																	,function(){ //final menu help
																																																		display_tutorial_entity({	"text":"The 'Chat' link opens up the AI Wars chat, powered by Cbox.<br/><br/>The 'Tutorial' link starts this tutorial.<br/><br/>Clicking the 'Forum' link opens up the AI Wars forum in a new tab.  The latest info on AI Wars can be found here.<br/><br/>'Logout' does what you would expect.",
																																																									"css":{"top":"200px","left":"500px","width":"300px"}
																																																								}
																																																			,function(){ //additional help
																																																				display_tutorial_entity({	"text":"Lastly, you will find, scattered throughout the menus, help buttons like this one. <img src='../images/client/Help-button.png' alt='help'/><br/><br/>These buttons denote specific help on a topic and can be useful if you're not sure what something does or want more information on it.  In addition, walkthroughs of building interfaces can be activated by clicking the help button located near the building's title.  Following this trend, help buttons are placed nearby the item they contain help for.",
																																																											"css":{"top":"200px","left":"200px","width":"500px"}
																																																										}
																																																					,function(){ //conclusion
																																																						display_tutorial_entity({	"text":"<h5>This concludes the Beginner's Tutorial.</h5>This tutorial can be restarted at any time via the Menu.<br/>"+(player.research.flicker=="BQ1"?"Clicking Next will start your first quest":"Click Next to close this window."),
																																																													"css":{"top":"200px","left":"400px","width":"300px"}
																																																												}
																																																							,function(){
																																																								if(player.research.flicker=="BQ1") {
																																																									$.each(player.quests, function(i,v) {
																																																										if(v.name == "BQ1") {
																																																											display_quest(v);
																																																											var noFlick = new make_AJAX();
																																																											noFlick.get("/AIWars/GodGenerator?reqtype=noFlick&league="+player.league);
																																																											return false;
																																																										}
																																																									});
																																																								}
																																																							});
																																																					}); //end conclusion
																																																			});//end additional help
																																																	}); //end final menu help
																																															}); //end Account help
																																													}); //end BHM help
																																											}); //end refresh help
																																									}); //end menu intro
																																							}); //end unit help
																																					}); //end currently building list info
																																			}); //end HQ info
																																	}); //end extra build info
																															}); //end build help
																													}); //end mine help
																											}); //end resource help
																									}); //end EVE button help
																							}); //end CS button help
																					}); //end Quest button help
																			}); //end Leabue button help
																	}); //end IO help
															}); //end Console help
													}); //end Messages help
											}); //end SR help
									}); //end WM help
							}); //end TV help
					});
					
	$("#AIW_alertNo").live("click",function(){ //launch first quest if the tutorial is skipped
		if(player.research.flicker.match(/BQ1|NQ1/)) {
			$.each(player.quests, function(i,v) {
				if(v.name == player.research.flicker) {
					display_quest(v);
					player.research.flicker = 'noFlick';
					var noFlick = new make_AJAX();
					noFlick.get("/AIWars/GodGenerator?reqtype=noFlick&league="+player.league);
					return false;
				}
			});
			$("#AIW_alertNo").die("click");
		}
	});
}
/*******************************************************************************************************\
*											Institute Tutorial											*
\*******************************************************************************************************/
function IN_tut() {
	display_message("Institute Tutorial","Would you like to play the Institute Tutorial?",
		function() 	{
			tutorialRunning = true;
			display_tutorial_entity({	"text":"The Institute is the heart and soul of your civilization. From here you can research everything from the mundane Lot Tech researches that give you more building spaces in your cities to the soaring technological marvels that are the Airships.<br/><br/>Click 'Next' to continue.",
										"css":{"top":"200px","left":"200px","width":"300px"}
									}
				,function() {
					display_tutorial_entity({	"text":"To purchase a research, you can click purchase next to the name of the research. If you do not have enough Knowledge Points, or KP, instead that button will become some text like Need 29 Points. <br/><br/>Click 'Next' to continue.",
												"css":{"top":"200px","left":"200px","width":"300px"},
												"arrows":	{
																"arrow1":{"dir":"down","css":{"top":"260px","right":"115px"}}
															}
											}
						,function() {
							display_tutorial_entity({	"text":"  Your Scholars work together across all of your Institutes to generate these points on a daily basis, so if you run out, you can always make more! The amount of scholars you have is denoted by the Current Staff label. Each Institute has a capacity for Scholars and upgrading that Institute allows higher capacities.<br/><br/>Click 'Next' to continue.",
														"css":{"top":"200px","left":"200px","width":"300px"},
														"arrows":	{
																		"arrow1":{"dir":"down","css":{"top":"525px","right":"60px"}}
																	}
													}
								,function() {
									display_tutorial_entity({	"text":" There are two different types of researches: One-Time Researches and Leveled Researches. One-Time Researches are things like Advanced Rocketry: They can only be researched once and unlock some new building, ability, or unit. <br /><br /> The Leveled Researches can be purchased multiple times, and improve the overall infrastructure of your civilization. An example would be Building Slot Tech - Every time it's purchased, you can build or level up another building concurrently. Also, the prices for Leveled Researches rise each time you buy them.<br/><br/>Click 'Next' to continue.",
																"css":{"top":"200px","left":"200px","width":"300px"}
															}
										,function() {
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
												,function() {
													display_tutorial_entity({	"text":" Click the Civilian Infrastructure tab to view the researches here. The most prosaic of all the research groups, Civilian Infrastructure provides upgrades to how efficient your scholars, traders, and engineers are and allow you to add extra building lots to your cities and slots to your building server. You can also research Town Tech here, each level of which allows you to add another city to your Empire.<br/><br/>Click 'Next' to continue.",
																				"css":{"top":"0px","left":"400px","width":"300px"},
																				"arrows":	{
																								"arrow1":{"dir":"down","css":{"top":"200px","right":"685px"}}
																							}
																			}
														,function() {
															display_tutorial_entity({	"text":" Click the Military Infrastructure tab. Most of the researches in this group improve your military's abilities in a variety of ways, but Manufacturing Tech is an important research to remember, as it opens up another slot in your Arms Factory, to a maximum of six slots. With empty slots in your Arms Factory, you can insert new unit blueprints that you have unlocked and build those unit types! <br/><br/>Click 'Next' to continue.",
																						"css":{"top":"0px","left":"500px","width":"300px"},
																						"arrows":	{
																										"arrow1":{"dir":"down","css":{"top":"200px","right":"510px"}}
																									}
																					}
																,function() {
																	display_tutorial_entity({	"text":" Click the Advanced Technologies tab. These new technologies are both volatile and difficult to unlock and open up new avenues of exploration and destruction for your civilization. Consider these technologies the pinnacle of success. Only the best will get even one of them.<br/><br/>Click 'Next' to continue.",
																								"css":{"top":"0px","left":"100px","width":"300px"},
																								"arrows":	{
																												"arrow1":{"dir":"down","css":{"top":"200px","right":"335px"}}
																											}
																							}
																		,function() {
																			display_tutorial_entity({	"text":" Click the Military Units tab. There are 12 unlockable unit blueprints in A.I. Wars, each representing one type of combat unit. Each one has it's weaknesses and it's strengths. In order to turn each blueprint into actual units in your army, you need an open slot in the Arms Factory, which can be obtained via Manufacturing Tech in the Military Infrastructure tab. Then you can load a blueprint you unlocked into the slot from the Arms Factory menu, and begin queuing up units of that type to be built. <br/><br/>Click 'Next' to continue.",
																										"css":{"top":"0px","left":"100px","width":"300px"},
																										"arrows":	{
																														"arrow4":{"dir":"down","css":{"top":"200px","right":"200px"}}
																													}
																									}
																				,function() {
																					display_tutorial_entity({	"text":" Click the AI Research tab. In A.I. Wars, you have the option of using a powerful backend Artifical Intelligence system named E.V.E., a Revelations class AI. However, while Eve theoretically has the ability to control and run every aspect of your civilization for you, you need to unlock those abilities before you can use them in your AI. Each chunk is represented by an API research below, and each API gives you access to new sets of commands for Eve.<br/><br/>Click 'Next' to continue.",
																												"css":{"top":"0px","left":"100px","width":"300px"},
																												"arrows":	{
																																"arrow5":{"dir":"down","css":{"top":"200px","right":"75px"}}
																															}
																											}
																						,function() {
																								display_tutorial_entity({	"text":" This concludes the Institute tutorial. <br/><br/>Click 'Next' to continue.",
																															"css":{"top":"0px","left":"100px","width":"300px"}
																														});
																						});// Closing exit message.
																				});// Closing AI Research explanation
																		});// Closing Military Units explanation
																});// Closing Advanced Technologies explanation
														});// Closing Military Infrastructure explanation
												});// Closing Civil Infrastructure explanation
										});// Closing Tab explanation
								});// closing different tech type explanation
						});// closing one-time vs level-up explanation
				});// closing scholars explanation
		});// closing Purchase explanation
}

function CC_tut() {
	display_message("Headquarters Tutorial","Are you sure you want to play the Headquarters Tutorial?",
		function() {
			display_tutorial_entity({	"text":"From your Headquarters, or CC, you can monitor your troop movements in and out of this city, and send attacks and other mission types to other cities. Please switch to your Tactical Overview tab if you are not already in it.<br/><br/>Click 'Next' to continue.",
										"css":{"top":"200px","left":"200px","width":"300px"}
									}
				,function() {
					display_tutorial_entity({	"text":" Your CSL or 'Cover Soft Limit' is a number that denotes how many soldiers your city can safely provide cover for in the event of an attack. If you have a total army size above this limit, some of your soldiers may get hit by stray bullets because there isn't any cover for them to hide behind! <br/><br/>Click 'Next' to continue.",
												"css":{"top":"200px","left":"600px","width":"300px"},
												"arrows":	{
																
																"arrow1":{"dir":"right","css":{"top":"350px","right":"600px"}}
															}
											}
									
						,function() {
							display_tutorial_entity({	"text":" When somebody sieges or glasses your city, and your entire army dies, your civilians bust out of their buildings and bring the fight to the bad guys. You can choose which weapon they will use to go down fighting with using this box.<br/><br/>Click 'Next' to continue.",
														"css":{"top":"200px","left":"100px","width":"300px"},
														"arrows":	{
																		"arrow1":{"dir":"left","css":{"top":"350px","right":"170px"}}
																	}
													}
								,function() {
									display_tutorial_entity({	"text":" Your current troop numbers are displayed for each unit type you have down below. You can cause your units to commit suicide from this box by inputting how much of each you want to die horribly and hitting the Kill button. If you have any raids out, these troop numbers will also display in a scrollable fashion below your home troop numbers.<br/><br/>Click 'Next' to continue.",
																"css":{"top":"200px","left":"100px","width":"300px"},
																"arrows":	{
																				"arrow1":{"dir":"down","css":{"top":"450px","right":"400px"}}
																			}
															}
										,function() {
											display_tutorial_entity({	"text":" Next, please click your Send Mission tab. From here you can send missions all over the map. There are a variety of different mission types, from plain old attacks to missions where your sole purpose is to collect debris from around another player's city!<br/><br/>Click 'Next' to continue.",
																		"css":{"top":"200px","left":"500px","width":"300px"}
																	}					
												,function() {
													display_tutorial_entity({	"text":" To begin the process of sending a mission, you need a destination for that mission. To specify a destination, you must either enter the x and y of the destination city or Airship manually, or you can have it done automatically for you by clicking Send Mission on the drop down tab for a city on the World Map menu! <br/><br/>Click 'Next' to continue.",
																				"css":{"top":"200px","left":"400px","width":"300px"},
																				"arrows":	{
																								"arrow1":{"dir":"right","css":{"top":"550px","right":"805px"}}
																							}
																			}
														,function() {
															display_tutorial_entity({	"text":" Using the troop numbers bar here, you can select how much of each unit in your army you wish to send on the mission.<br/><br/>Click 'Next' to continue.",
																						"css":{"top":"500px","left":"100px","width":"300px"},
																						"arrows":	{
																										"arrow1":{"dir":"right","css":{"top":"300px","right":"805px"}}
																									}
																					}
																,function() {
																	display_tutorial_entity({	"text":" Once you've selected your team, you need to select a mission type. You can select one here. The description of the mission is shown in the adjoining box.<br/><br/>Click 'Next' to continue.",
																								"css":{"top":"200px","left":"100px","width":"300px"},
																								"arrows":	{
																												"arrow1":{"dir":"right","css":{"top":"400px","right":"805px"}}
																											}
																							}
																		,function() {
																			display_tutorial_entity({	"text":" Finally, when everything is set up, you can hit Send to execute the mission. You can track the mission's progress from the I/O box by clicking on this icon to enable it. <br/><br/>Click 'Next' to continue.",
																										"css":{"top":"300px","left":"100px","width":"300px"},
																										"arrows":	{
																														"arrow4":{"dir":"left","css":{"top":"110px","right":"805px"}}
																													}
																									}
																				,function() {
																					display_tutorial_entity({	"text":" Once your mission arrives at it's destination, you will receive a Status Report that tells you how the mission went, casualty reports, resources collected, debris created, etc. You can view your Status Report by clicking the Status Reports tab. <br /><br />Once the Report is generated, the timer in the I/O will restart and your mission will return if there are any units left in the party. When the mission returns, the units will be added back to your city's army and the countdown timer will disappear off your I/O box. <br/><br/>Click 'Next' to continue.",
																												"css":{"top":"200px","left":"100px","width":"300px"},
																												"arrows":	{
																																"arrow5":{"dir":"up","css":{"top":"80px","right":"290px"}}
																															}
																											}
																						,function() {
																								display_tutorial_entity({	"text":" This concludes the Headquarters tutorial. <br/><br/>Click 'Next' to continue.",
																															"css":{"top":"200px","left":"100px","width":"300px"},
																														});
																						});// Closing exit message.
																				});// Closing SR
																		});// Closing IO
																});// Closing Mission Type
														});// Closing troop numbers
												});// Closing destination
										});// closing click Send Mission tab
								});// Troop numbers
						});// Closing Civ weap
				});// closing CSL
		});// closing intro
}

function WM_tut(){
	var message = "Are you sure you want to play the World Map Tutorial?";
	display_message("World Map Tutorial",message,
		function() {
			display_tutorial_entity({	"text":"From your World Map, you can view nearby cities and Airships as well as initiate attacks and one-way trades. You can also view interesting information about other cities that will be helpful to you in your decision making.",
										"css":{"top":"200px","left":"200px","width":"300px"}
									},
				function() {
					display_tutorial_entity({	"text":" Let's start with some basic navigation. To view information about any city, hover your mouse over it. Information about it should pop up on your left. When a player's AI is active, the AI active marker on the information screen will tell you so, for strategic purposes. Someone who is using AI excessively may become predictable, and thus vulnerable, to your attacks. <br /><br /> You can also view the Scout Size Limit from this window, which is the optimal number of soldiers you need to send on a scouting mission to this city to get the best possible scout report.<br /><br /> Finally, production modifiers allow you to see how much extra resources you generate per hour in mines if you owned this city. Last Report will show a link to any Status Reports you possess that represent a mission to this city, so that you'll know when you've been there before.",
												"css":{"top":"200px","left":"600px","width":"300px"},
												"arrows":	{
																
																"arrow1":{"dir":"left","css":{"top":"200px","right":"575px"}}
															}
											},	
						function() {
							display_tutorial_entity({	"text":"Next, click one of the cities. You'll notice a tab shows up beneath the city. By pressing Send Mission, you will be brought to the Headquarters menu where you can send a mission to the city you opened the tab on, easy! If you want to ship resources one-way to this city, you can hit Send Trade. Close the tab when you're finished.",
														"css":{"top":"200px","left":"200px","width":"300px"}
													
													},	
								function() {
									display_tutorial_entity({	"text":" This small parcel of land is not the only land in A.I. Wars. There are other little parcels surrounding yours. To navigate between them, open the Tile Switcher menu here.",
																"css":{"top":"200px","left":"200px","width":"300px"},
																"arrows":	{
																				"arrow1":{"dir":"left","css":{"top":"140px","right":"-30px"}}
																			}
															},	
										function() {
											display_tutorial_entity({	"text":" You can only see parcels of land that have cities that your Communications Centers can pick up. As you level up your Communications Center buildings, you'll be able to see more parcels. The Tile Switcher menu can hold a max of 9 tiles in the square at any one time. If you see any other tiles, click on one and watch the map load that parcel. To navigate beyond the nine tiles surrounding your own, you can press the directional buttons on all sides of the Menu. These buttons will not function if you can't see any more than nine tiles.",
																		"css":{"top":"200px","left":"200px","width":"300px"}
																	
																	},
												function() {
														display_tutorial_entity({	"text":" This concludes the World Map Tutorial.",
																					"css":{"top":"200px","left":"200px","width":"300px"},
																				});
												});// Closing Conclusion
										});// closing parcel explanation
								});// closing tile switcher menu
						});// city tab menu
				});// city info
		});// map intro
}