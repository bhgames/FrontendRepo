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