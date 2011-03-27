function preload() {
	var newImages = [];
	for (x in images) {
		newImages[x] = new Image();
		newImages[x].src = images[x];
	}
	$("#preload").html(newImages.toString());
}

var websock = false;
function make_AJAX() {
	var that = this; //this is so I always have a reference to the calling object
	if(Modernizr.websockets && !websock.nosock) {
		if(!websock||websock.readyState==2) {
			try {
				websock = new WebSocket("ws://"+location.hostname+"/AIWars/GodGenerator");
				websock.connected = websock.readyState == 1;
				websock.backlog = websock.backlog || [];
				websock.log = websock.log || [];
				websock.checksock = websock.checksock || [];
				websock.onopen = 	function() {
										websock.connected = true;
										while(websock.checksock.length>0) {
											clearTimeout(websock.checksock.shift());
										}
										while(websock.backlog.length>0) {
											websock.send(websock.backlog[0].data);
											websock.log.push(websock.backlog.shift());
										}
									};
				websock.onerror = 	function(err) {
										log(err);
										display_output(true,err,true);
									};
				websock.onmessage = function(e) {
										var message = $.parseJSON(e.data);
										if(message.id) {
											var valid = true;
											if(message.data.match(/invalidcmd/)) {
												display_output(true,"Invalid Command",true);
												valid = false;
											}
											$.each(websock.log,function(i,v) {
												if(v.id == message.id) {
													if(valid) v.callback(message);
													websock.log[i] = null;
													websock.log.splice(i,1);
													return false;
												}
											});
										} else {
											switch(message.type) {
												case "player":
													parse_player(message.data);
													break;
												
												case "raids":
													get_raids(false,message.data);
													break;
												
												case "trades":
													parse_trades(message.data);
													break;
													
												case "status_reports":
													parse_SRs(message.data);
													break;
													
												case "messages":
													get_messages(false,message.data,false);
													break;
													
												case "user_groups":
													get_messages(false,false,message.data);
													break;
													
												case "quests":
													get_quests(false,message.data);
													break;
												
												case "achievements":
													get_achievements(false,message.data);
													break;
													
												case "ranks_player":
													get_ranks(false,message.data,false,false);
													break;
													
												case "ranks_leagues":
													get_ranks(false,false,message.data,false);
													break;
													
												case "ranks_BHM":
													get_ranks(false,false,false,message.data);
													break;
													
												
											}
										}
									};
				websock.onclose = 	function() {
										this.connected = false;
									};
				websock.nosock = false;
			} catch(e) {
				websock.nosock = true;
				log(e);
			}
		}
		this.get = this.post = 	function(URL,data) {	//this is to maintain backwards compatability in the code
									if(typeof(data)!=="String") {
										if(URL.match(/Generator\?/)) {
											data = URL.split("Generator?")[1];
										} else {
											data = URL;
										}
									}
									that.data = data;
									if(data.match(/&command=/)) {
										data = data.split("&command=");
										data[1] = encodeURIComponent(data[1]);
										data = data.join("&command=");
									}
									
									that.id = Math.round(Math.random()*100000);
									
									if(websock.connected) {
										websock.send(data+"id="+that.id);
										websock.log.push(that);
									} else {
										websock.backlog.push(that);
										websock.checksock.push(	setTimeout(	function() {
																				log(websock.readyState);
																				if(websock.readyState > 1) {
																					websock.nosock = true;
																					var temp = websock.backlog.shift();
																					var AJAX = new make_AJAX();
																					AJAX.callback = temp.callback;
																					AJAX.post("/AIWars/GodGenerator",temp.data);
																				}
																			},5000));
									}
								}
	} 
	if(websock.nosock||!websock) {
		//defined on-the-fly for custom response handling
		this.callback = function() {};
		
		this.success = 	function(response, status, xhr) {
							that.clear();
							try {
								display_output(false,"Response received!");
								$("body").css("cursor","auto");
								display_output(false,"Processing...");
										//strip trailing semicolons on BF function calls
								response = response.split(";");
								if(!response[response.length-1].match(/\S/)) response = response.slice(0,response.length-1);
								response = response.join(";");
										//check for invalid commands 
								if(!response.match(/invalidcmd/)) that.callback(response);
								else display_output(true,"Invalid Command",true);
							} catch(e) {
								display_output(true,e,true);
							}
						};
						
		this.error = 	function(xhr, status, error) {
							that.clear();
							var response = xhr.responseText.split("<body>")[1].split("</body>")[0];
							display_output(true,response,true);
						};
		
			//send method repackagers to make my life easier
		this.get = function(URL, sync) {
									try {
										var val = URL.split("&command="), data = "";
										if(val.length == 2) { 
											val[1] = encodeURIComponent(val[1]);//encode commands before sending them to the server
											URL = val.join("&command=");
										}
										val = URL.split("Generator?");
										if(val.length == 2) data = val[1];		//a full URL GET was supplied
										else data = URL;						//only the data was supplied
										$.ajax({
											type : "GET",
											async: !sync,
											url : "/AIWars/GodGenerator",
											data : data,
											dataType : "text",
											cache : false,
											global : false,
											error : that.error,
											success : that.success
										});
										that.set();
										$("body").css("cursor","wait");
										display_output(false,"Fetching...");
									} catch(e) {
										display_output(true,e,true);
										that.clear();
									}
								};
		this.post = function(URL, data, sync) {
											try {
												var val = data.split("&command=");
												if(val.length == 2) { 
													val[1] = encodeURIComponent(val[1]);	//encode commands before sending them to the server
													data = val.join("&command=");
												}
												$.ajax({
													type : "POST",
													async: !sync,
													url : "/AIWars/GodGenerator",
													data : data,
													dataType : "text",
													cache : false,
													global : false,
													error : that.error,
													success : that.success
												});
												that.set();
												$("body").css("cursor","wait");
												display_output(false,"Fetching...");
											} catch(e) {
												display_output(true,e,true);
												that.clear();
											}
										};
									
		this.set = function() { //latency announcer
								that.requestTimer = setTimeout(function() {
															display_output(true,"High Latency Detected!", true);
															display_output(false,"Your last action may not have been received.  You may have to refresh your client or browser.");
														}, 10000);
													};
		
		this.clear = function() {
				clearTimeout(that.requestTimer);
			};
	}
}

function show_output_window() { //packaged to allow easy calling
	$("#console_box").fadeIn("fast");
	$("#console").addClass("active");
}

function display_output(error, message, show) { //error is a boolean denoting if the output is an error
	if(show) {
		show_output_window();
	}
	$("#console_output").append("<br/><span class='output" + ((error)?" error":"") + "'>" + message + "</span>")
	
	if(!$("#console_stop").is(":checked")) $("#console_output").scrollTop(10000000);
}

function display_message(title, message, callback) { //callback is a function  and, if set, converts the message from an alert to a confirm
	var popup = "<div class='popFrame'>\
					<div class='popFrameTop'><div class='popFrameLeft'><div class='popFrameRight'>\
						<div class='popFrameBody'>\
							<div id='AIW_alertTitlebar'>" + title + "</div>\
							<div id='AIW_alertMess'>" + message + "</div>"
							+((callback)?"<div id='AIW_alertNo' class='alertButton' style=''>No</div><div id='AIW_alertYes' class='alertButton' style=''>Yes</div>":"<div id='AIW_alertButton' class='alertButton' style=''>Okay</div>")
						+"</div>\
					</div></div></div>\
				</div>\
				<div class='popFrameBL-BR-B'>\
					<div class='popFrameBL'><div class='popFrameBR'><div class='popFrameB'></div></div></div>\
				</div>";
	if($("#AIW_alert").length < 1) $("body").append("<div id='AIW_alertBox'><div id='AIW_alertMod'></div><div id='AIW_alert'>"+popup+"</div></div>");
	else $("#AIW_alert").html(popup);
	
	$("#AIW_alert").css({"margin-left":(-1*($("#AIW_alert").width()/2))+"px","margin-top":(-1*($("#AIW_alert").height()/2))+"px"});
	//to alow the message to be moved around the screen 
			//consider modifying to prevent "snapping" of the window to the left
			//perhaps by checking to see if left and top are a percentage and mathing out the correct placement if so
	$("#AIW_alertTitlebar").unbind("mousedown").mousedown(function(e) {
		if(e.which == 1) {
			var cLeft = $("#AIW_alert").css("left");
			var cTop = $("#AIW_alert").css("top");
			cLeft = cLeft.match(/%/)? $("#AIW_alert").position().left : parseInt(cLeft);
			cTop = cTop.match(/%/)? $("#AIW_alert").position().top : parseInt(cTop);
			var mLeft = e.pageX;
			var mTop = e.pageY;
			$("body").unbind("mousemove").mousemove(function(e) {
				$("#AIW_alert").css("left", (cLeft-mLeft+e.pageX) + "px");
				$("#AIW_alert").css("top", (cTop-mTop+e.pageY) + "px");
			});
			$("body").unbind("mouseup").mouseup(function() {
				$(this).unbind("mousemove").unbind("mouseup");
			});
		}
	});
	$("#AIW_alertYes").click(callback);
	$(".alertButton").one("click",function() {
		$("#AIW_alert").fadeOut(100, function() {
			$(this).parent().remove();
		});
	});
	
	
	$("#AIW_alert").fadeIn(100);
}
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
//fade between different menus, this allows more control over exactly when a fade happens
function do_fade(nextUI, newBkgd, SBB) { //nextUI - the function to call after the fade.  newBkgd - the color of the new background (amber,blue,rose). SBB - a jQuery object containing the clicked sidebar button, if any
	var win = $("#window");
	var cv = $("#clientview");
		//controls for fading between sidebar tabs
	if(!SBB) {
		$("#bottomlinks li").each(function() {
			if($(this).hasClass("open")) $(this).removeClass("open").mouseout();
		});
	} else { 
		SBB.siblings().each(function(){
			if($(this).hasClass("open")) $(this).removeClass("open").mouseout();
		}); 
	}
	if(newBkgd && !cv.hasClass(newBkgd)) {
		win.fadeOut("fast",function(){
			win.html("").addClass(newBkgd).fadeIn("fast", function() {
				cv.removeClass().addClass(newBkgd);
				win.removeClass(newBkgd).css("display","none");
				nextUI();
			});
		});
	} else {
		win.fadeOut("fast",function(){
			nextUI();
		});
	}
}

function display_res() {
	$("#steel").text(player.curtown.res[0]).format({format:"###,###,###", locale:"us"});
	$("#wood").text(player.curtown.res[1]).format({format:"###,###,###", locale:"us"});
	$("#synth").text(player.curtown.res[2]).format({format:"###,###,###", locale:"us"});
	$("#food").text(player.curtown.res[3]).format({format:"###,###,###", locale:"us"});
}

var bldgs = {
				all : "empty",
				buildable : "empty"
			};
function get_bldgs(async ,bldgList) {
	try {
		if(async) {
			display_output(false,"Loading Buildings...");
			getBldgs = new make_AJAX();
			getBldgs.callback = function(response) {
									get_bldgs(false,response);
								};
			getBldgs.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".getBuildings();");
		} else {
			bldgs.all = $.parseJSON(bldgList);
			get_buildable();
			display_output(false,"Buildings Loaded!");
		}
	} catch(e) {
		display_output(true,"Error loading Buildings!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_bldgs(true);
	}
}

function get_buildable() {
	try {
		bldgs.buildable = $.grep(bldgs.all, function(v, i) {
								var canBuild = true;
								$.each(player.curtown.bldg, function(i, x) {
									if(v.type == x.type && x.type == "Headquarters") {
										canBuild = false;
									}
								});
								//this checks for mines as well as locked buildings
								if(	(v.type == "Metal Mine" || v.type == "Timber Field" || v.type == "Manufactured Materials Plant" || v.type == "Food Farm") ||
									(!player.research.zeppTech && v.type == "Airship Platform") || (!player.research.missileSiloTech && v.type == "Missile Silo") ||
									(!player.research.recyclingTech && v.type == "Recycling Center") || (!player.research.metalRefTech && v.type == "Metal Refinery") ||
									(!player.research.timberRefTech && v.type == "Timber Processing Plant") || (!player.research.manMatRefTech && v.type == "Materials Research Center") ||
									(!player.research.foodRefTech && v.type == "Hydroponics Lab")) canBuild = false;
								return canBuild;
							});
	} catch(e) {
		get_bldgs(true);
	}
}

function get_weapons(async,weapons) {
	try {
		if(async) {
			display_output(false,"Loading Weapons...");
			getWeps = new make_AJAX();
			getWeps.callback = function(response) {
									get_weapons(false,response);
								};
			getWeps.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".getWeapons();");
		} else {
			UTCC.weapons = $.parseJSON(weapons);
			$.each(UTCC.weapons, function(i, v) {
				switch(true) {
					case i < 6:
						v.tier = 1;
						break;
					case i < 12:
						v.tier = 2;
						break;
					case i < 18:
						v.tier = 3;
						break;
					default: //anything else will be treated as t4
						v.tier = 4;
				}
			});
			display_output(false,"Weapons Loaded!");
		}
	} catch(e) {
		display_output(true,"Error loading Weapons!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_weapons(true);
	}
}

function get_support_abroad() {
	try {
		player.supportAbroad = [];
		getSupport = new make_AJAX();
		display_output(false,"Loading Support...");
		getSupport.callback = function(response) {
			var support = response.split(";");
			
			$.each(player.towns, function(i, v) {
				v.supportAbroad = $.parseJSON(support[i]);
				player.supportAbroad.push(v.supportAbroad);
			});
			display_output(false,"Support Loaded!");
		};
		var path = "/AIWars/GodGenerator?reqtype=command&command=";
		
		$.each(player.towns, function(i, v) {
		path +=  player.command + ".getUserTownsWithSupportAbroad(" + v.townID + ");";
		});
		
		getSupport.get(path);
	} catch(e) {
		display_output(true,"Error loading support!",true);
		display_output(true,e);
		disaply_output(false,"Retrying...");
		get_support_abroad();
	}
}

var gettingTrades = false;
function get_all_trades() {
	try {
		if(!gettingTrades) {
			gettingTrades = true;
			display_output(false,"Loading Trades...");
			 //these are here to retain trades between player loads (they survive the extend call)
			player.activeTrades = [];
			player.tradeSchedules = [];
			var getTrades = new make_AJAX();
			var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
			$.each(player.towns, function(i, v) {
				getPath += player.command + ".getUserTrades(" + v.townID + ");" + player.command + ".getUserTradeSchedules(" + v.townID + ");";
			});
			
			getTrades.callback = function(response) {
				var trades = response.split(";");
				var h = 0;
				$.each(player.towns, function(i, v) {
					v.activeTrades = $.parseJSON(trades[i + h]);
					h++;
					v.tradeSchedules = $.parseJSON(trades[i + h]);
					if(v.activeTrades.length > 0) {
						$.each(v.activeTrades, function(j, w) {
							w.ticksToHit *= player.gameClockFactor;
							w.totalTicks *= player.gameClockFactor;
						});
					}
					if(v.tradeSchedules.length > 0) {
						$.each(v.tradeSchedules, function(j, w) {
							w.currTicks *= player.gameClockFactor;
							w.intervaltime *= player.gameClockFactor;
						});
					}
					
					player.activeTrades.push(v.activeTrades);
					player.tradeSchedules.push(v.tradeSchedules);
					
					clearInterval(v.activeTrades.timer);
					clearInterval(v.tradeSchedules.timer);
					v.activeTrades.timer = tick_trades(v.activeTrades);
					v.tradeSchedules.timer = tick_trades(v.tradeSchedules);
				});
				display_output(false,"Trades Loaded!");
				gettingTrades = false;
				if(currUI===draw_bldg_UI&&BUI.active.name[0]=="Trade Center"&&$("#TC_Overview").hasClass("open")) currUI();
			};
			
			getTrades.get(getPath);
		}
	} catch(e) {
		display_output(true,"Error while getting Trades!", true);
		display_output(true,e,true);
		display_output(false,"Retrying...");
		get_all_trades();
	}
}

function parse_trades(trades) {
	if(!gettingTrades) {
		
	}
}

function get_achievements(async,achieves) {
	if(async) {
		var getAchieves = new make_AJAX();
		getAchieves.callback = function(response) {
									get_achievements(false,response);
								};
		getAchieves.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".getAchievements();");
	} else {
		player.achievements = $.parseJSON(achieves);
	}
}

function check_for_unread() {
	try {
		var unreadReports = false;
		$.each(SR.reports, function(i, v) {
			if(!v.read) {
				unreadReports = true;
				return false;
			}
		});
		if(unreadReports) {
			clearInterval(SR.flashTimer);
			SR.flashTimer = setInterval(function() {
				$("#sr .flicker").animate({"opacity":"toggle"},250);
			}, 251);
		} else {
			clearInterval(SR.flashTimer);
			$("#sr .flicker").stop(true).fadeOut();
		}
	} catch(e) {}
	
	try {
		var unreadMessages = false;
		$.each(messages.messages, function(i,v) {
			$.each(v, function(j, w) {
				if(!w.read) {
					unreadMessages = true;
					return false;
				}
			});
			return !unreadMessages;
		});
		if(unreadMessages) {
			clearInterval(messages.flashTimer);
			messages.flashTimer = setInterval(function() {
				$("#mailbox .flicker").animate({"opacity":"toggle"},250);
			}, 251);
		} else {
			clearInterval(messages.flashTimer);
			$("#mailbox .flicker").stop(true).fadeOut();
		}
	} catch(e) {}
}

function set_tickers() {
	try {
		display_output(false,"Starting tickers...");
		player.research.ticker = tick_research(player.research);
		
		$.each(player.towns, function(i, x) {
				x.resTicker = tick_res(x);				//start res tickers
				
				if(x.zeppelin) {
					x.moveTicker = inc_movement_ticks(x);
				}
				
			$.each(x.bldg, function(j, y) {
				if(y.lvlUps != 0) {
					y.bldgTicker = inc_bldg_ticks(y); 	//start ticking bldg timers
				}
				
				if(y.numLeftToBuild > 0) {
					y.pplTicker = inc_ppl_ticks(y);		//start ppl tickers, if applicable
				}
				$.each(y.Queue,function(k, z) {
					z.queueTicker = inc_queue_ticks(z);	//start queue tickers, if applicable
				});
			});
		});
		
		display_output(false,"Tickers Started!");
	} catch(e) {
		display_output(true,"Error starting tickers!",true);
		display_output(true,e);
		display_output(false,"Clearing...");
		clear_player_timers();
		set_tickers();
	}
}

function clear_player_timers() {
	display_output(false,"Clearing tickers...");
		clearInterval(updateTimer);
		
		clearInterval(BUI.active.timer);
		
		clearInterval(player.research.ticker);
		
		$.each(player.towns, function(i, x) {
			try {
				clearInterval(x.resTicker);
			} catch(e) {}
			$.each(x.bldg, function(j, y) {
				try {
					clearInterval(y.bldgTicker);
					clearInterval(y.pplTicker);
				} catch(e) {}
					$.each(y.Queue, function(k, z) {
						try {
							clearInterval(z.queueTicker);
						} catch(e) {}
					});
			});
		});
	display_output(false,"Tickers Cleared!");
}

function clear_all_timers() {
	display_output(false,"Clearing tickers...");
		clearInterval(updateTimer);
		
		clearInterval(player.townUpdate);
		
		clearInterval(BUI.active.timer);
		
		clearInterval(player.research.ticker);
		
		clearInterval(player.raids.raidTicker);
		
		try {
			clearInterval(player.curtown.incomingRaids.displayTimer);
		}
		catch(e) {}
		try {
			clearInterval(player.curtown.outgoingRaids.displayTimer);
		}
		catch(e) {}
		
		$.each(player.towns, function(i, x) {
			try {
				clearInterval(x.resTicker);
				clearInterval(x.activeTrades.timer);
				clearInterval(x.tradeSchedules.timer);
			}
			catch(e) {}
			$.each(x.bldg, function(j, y) {
				try {
					clearInterval(y.bldgTicker);
					clearInterval(y.pplTicker);
				}
				catch(e) {}
					$.each(y.Queue, function(k, z) {
						try {
							clearInterval(z.queueTicker);
						}
						catch(e) {}
					});
			});
		});
	display_output(false,"Tickers Cleared!");
}

function set_bottom_links() {
	$("#League").unbind("click").click(function(){
		$(this).addClass("open");
		do_fade(build_league_UI,"amber",$(this));
	});
	$("#IO").unbind('click').click(function() {
		if(SR.update) {
			get_raids(true);
			get_SRs();
		}
		$("#attacklist").animate({"opacity":"toggle","height":"toggle"},"fast");
	});
	$("#CS").unbind('click').click(function() {
		$.each(player.curtown.bldg, function(i, x) {
			if(x.type == "Headquarters") {
				$("#CS").addClass("open");
				BUI.set(x.type, x.lotNum);
				do_fade(draw_bldg_UI, "amber", $("#CS"));
				return false;
			}
		});
	});
	$("#EVE").unbind("click").click(function() {
		$(this).addClass("open");
		do_fade(build_RAI_interface,"rose", $(this));
	});
}

function set_sidebar_anim() {
	var animFor = [];
	var animRev = [];
	
	$("#bottomlinks li:not(#IO,#console)").unbind("mouseover").mouseover(function(){
		var i = $(this).index("#bottomlinks li:not(#IO,#console)");
		clearInterval(animRev[i]);
		var that = this;
		var frame = $(this).data("frame");
		animFor[i] = setInterval(function() {
			if(frame > 0) {
				if(frame>10) clearInterval(animFor[i]); //if we're on the 11th frame, we need to stop
				else {
					$(that).addClass("frame"+((frame<9)?"0"+(frame+1):(frame+1))).removeClass("frame"+((frame<10)?"0"+frame:frame));
					frame++;
				}
			} else {
				$(that).addClass("frame01");
				frame = 1;
			}
			$(that).data("frame",frame);
		}, 20);
	}).unbind("mouseout").mouseout(function(){
		if(!$(this).hasClass("open")) {
			var i = $(this).index("#bottomlinks li:not(#IO,#console)");
			var that = this;
			clearInterval(animFor[i]);
			var frame = $(this).data("frame");
			
			animRev[i] = setInterval(function() {
				if(frame<1)	{	//if we're on the 0th frame, we need to stop
					$(that).removeClass();
					clearInterval(animRev[i]); 
				} else {
					$(that).addClass("frame"+((frame<11)?"0"+(frame-1):(frame-1))).removeClass("frame"+((frame<10)?"0"+frame:frame));
					frame--;
				}
				$(that).data("frame",frame);
			}, 20);
		}
	}).each(function(i){
		$(this).data("frame",0);
		animFor[i] = 0;
		animRev[i] = 0;
	});;
}

// usage: log('inside coolFunc',this,arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	if(this.console){
		console.log( Array.prototype.slice.call(arguments) );
	}
};

/** http://strd6.com/2010/08/useful-javascript-game-extensions-clamp/
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
}

//formats a number for display as part of a clock.
Number.prototype.toTime = function() {
	if(this<10) return "0"+this;
	return this;
}

function inc_bldg_ticks(thingToTick) {
	return setInterval(function() {
					//increment the ticks
				thingToTick.ticksToFinish++;
				if(thingToTick.ticksToFinish >= thingToTick.ticksToFinishTotal[0] && thingToTick.lvlUps > 0) { //if the building has finished upgrading
					thingToTick.lvlUps--;
					thingToTick.lvl++;
					thingToTick.ticksToFinish -= thingToTick.ticksToFinishTotal[0];
					thingToTick.ticksToFinishTotal.shift();
					thingToTick.update = true; //set update flag
				} else if(thingToTick.ticksToFinish >= thingToTick.ticksToFinishTotal[0] && thingToTick.deconstruct) {
					thingToTick.deconstruct = false;
					thingToTick.lvl = 0;
					thingToTick.lot = -1;
					thingToTick.update = true; //set update flag
				} else if(thingToTick.lvlUps < 1) {
					BUI.build();
					clearInterval(thingToTick.bldgTicker);
				}
			},1000);
}

function inc_ppl_ticks(thingToTick) {
	return setInterval(function() {
				thingToTick.ticksLeft++; //increment the ticks
				if(thingToTick.ticksLeft >= thingToTick.ticksPerPerson && thingToTick.numLeftToBuild > 0) {  //if a unit has finished
					thingToTick.numLeftToBuild--;
					thingToTick.ticksLeft -= thingToTick.ticksPerPerson;
					thingToTick.peopleInside++;
					thingToTick.update = true;
				}
				else if(thingToTick.numLeftToBuild < 1) clearInterval(thingToTick.pplTicker);
			}, 1000);
}

function inc_queue_ticks(thingToTick) {
	return setInterval(function() {
				thingToTick.currTicks++; //increment the ticks
				if(thingToTick.currTicks >= thingToTick.ticksPerUnit && thingToTick.AUNumber > 0) {  //if a unit has finished
					thingToTick.AUNumber--;
					thingToTick.currTicks -= thingToTick.ticksPerUnit;
					thingToTick.update = true;
				} else if(thingToTick.AUnumber<1) clearInterval(thingToTick.queueTicker);
			}, 1000);
}

function tick_raids(thingToTick) {
	return setInterval(function() {
				if(thingToTick.length > 0) {
					$.each(thingToTick, function(i, v) {
						if(typeof(v.eta) != "undefined") {
							if(v.eta > 0 && v.eta != "updating") {
								thingToTick[i].eta--;
							} else if(v.eta != "updating") {
								thingToTick[i].eta = "updating";
								if(!SR.update) {
									$.each(player.towns,function(j,w) {
										if(w.townName == v.attackingTown || w.townName == v.defendingTown) {
											SR.update = true;
											return false;
										}
									});
								}
								if(!map.update) {
									if(v.raidType.match(/invasion|debris/)) map.update = true;
								}
								thingToTick.update = true;
							}
						}
					});
				} else {
					clearInterval(thingToTick.raidTicker);
				}
			}, 1000);
}

function tick_trades(thingToTick) {
	return setInterval(function() {
				if(thingToTick.length > 0) {
					$.each(thingToTick, function(i, v) {
						if(v.currTicks) {
							if(v.currTicks != "Updating" && v.timesDone < v.timesToDo && v.destTown!="") {
								thingToTick[i].currTicks--;
								if(v.currTicks == 0 && !v.stockMarketTrade) {
									thingToTick[i].currTicks = thingToTick[i].intervalTime;
									thingToTick[i].timesDone++;
									thingToTick.update = true;
								}
							} else if(v.timesDone >= v.timesToDo) {
								thingToTick[i].currTicks = "-";
							}
						} else if(v.ticksToHit != "Updating") {
							thingToTick[i].ticksToHit--;
							if(v.ticksToHit <= 0) {
								if(!v.tradeOver) {
									thingToTick[i].ticksToHit = thingToTick[i].totalTicks;
									thingToTick[i].tradeOver = true;
								}
								thingToTick.update = true;
							}
						}
					});
				}
			}, 1000);
}

function tick_research(thingToTick) {
	return setInterval(function() {	
			player.research.knowledge+=(1/thingToTick.scholTicksTotal);
			
			if(thingToTick.premiumTimer > 0) {
				thingToTick.premiumTimer--;
			}
			if(thingToTick.revTimer > 0) {
				thingToTick.revTimer--;
			}
			if(thingToTick.feroTimer > 0) {
				thingToTick.feroTimer--;
			}
			if(thingToTick.ubTimer > 0) {
				thingToTick.ubTimer--;
			}
			if(thingToTick.mineTimer > 0) {
				thingToTick.mineTimer--;
			}
			if(thingToTick.timberTimer > 0) {
				thingToTick.timberTimer--;
			}
			if(thingToTick.mmTimer > 0) {
				thingToTick.mmTimer--;
			}
			if(thingToTick.fTimer > 0) {
				thingToTick.fTimer--;
			}
		}, 1000);
}

function tick_res(thingToTick) {
	var time = 9999999;
	$.each(thingToTick.resInc, function(i,v) {
		if(v > 0) {
			if(time > 1/v) time = 1/v;
		}
	});
	if(time < 0.2) time = 0.2;
	return setInterval(function() {
				$.each(thingToTick.res, function(i, v) {
					if(v >= thingToTick.resCaps[i]) {
						thingToTick.res[i] = thingToTick.resCaps[i];
					} else {
						thingToTick.res[i] += (thingToTick.resInc[i]*time);
					}
				});
				display_res();
			}, time*1000);
}

function inc_movement_ticks(thingToTick) {
	if(thingToTick.movementTicks>0) {
		thingToTick.movementTicks--;
	} else {
		thingToTick.update = true;
		thingToTick.x = thingToTick.destX;
		thingToTick.y = thingToTick.destY;
	}
}

var updateTimer = 0;
function check_all_for_updates() {
	updateTimer = setInterval(function() {
									//check player for updates
									var updatePlayer = false;
									$.each(player.towns, function(i,v) {
										$.each(v.bldg, function(j,w) {
											if(w.update) {
												load_player(player.league,true,false);
												updatePlayer = true;
												return false;
											} else {
												$.each(w.Queue, function(k, x) {
													if(x.update) {
														load_player(player.league,true,false);
														updatePlayer = true;
														return false;
													}
												});
												return !updatePlayer;
											}
										});
										if(!updatePlayer) { //load player already does all these checks
											var updateTrades = false;
											$.each(v.activeTrades, function(j,w) {
												if(w.update) {
													get_all_trades();
													updateTrades = true;
													return false;
												}
											});
											if(!updateTrades) {
												$.each(v.tradeSchedules, function(j,w) {
													if(w.update) {
														get_all_trades();
														updateTrades = true;
														return false;
													}
												});
											}
										}
									});
									if(SR.update) {
										get_SRs()
										get_raids(true);
									} else if(player.raids.update) {
										get_raids(true);
									}
								},60000);
}