/**************************************************************************************************************\
***********************************************Player Object****************************************************
\**************************************************************************************************************/
var player = new Object();

function get_session() {

	var seshget = new make_AJAX();
	
	// Alright so what we do here is set up a session object and if
	// when it returns it is invalid, it loads login, if it is valid,
	// it loads player. Simple enough. Check it!
	
	seshget.callback = function(response) {
		if(!response.match(/invalid/)) load_client(false); //if the user entered a valid UN and Pass
		else window.location.replace("/");	
	};

	seshget.get("/AIWars/GodGenerator?reqtype=session");
}

var gettingPlayer = false, chatboxLoaded = false;
function load_client(type, reloadTown, reloadUI) {
	if(!gettingPlayer) {
		gettingPlayer = true;
		if(loggedIn) if(type != player.league) clear_all_timers(); //this is to prevent timers from the regular player from contaminating the league player and vice versa
		display_output(false,"Loading Client");
		display_output(false,"Loading Player Data");
		var playerget = new make_AJAX();
		playerget.callback = function(response) {
			if(!response.match(/invalid/i)) { //if the user entered a valid UN and Pass
				try {
					$.extend(player, $.parseJSON(response));
					
					if(!player.towns) throw "No Towns";
					if(player.towns.length < 1) throw "No Towns";
					player.username = player.username.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
					player.command = (player.league)?"bf.getLeague()":"bf";
					
					//get chatbox
					if(!chatboxLoaded) { //chatbox only has to load once
						chatboxLoaded = true;
						display_output(false,"Loading Chatbox...");
						$("#chat_innerbox").load("/PHP/chatBox.php","UN="+player.username, 
											function(response,status,xhr) {
												$("#chat").unbind("click").click(function(){
													$("#menu").click();
													$("#chat_box").fadeIn();
												});
												$("#chat_titlebar").unbind("mousedown").mousedown(function(e) {
													if(e.which == 1) {
														var cLeft = parseInt($("#chat_box").css("left"));
														var cTop = parseInt($("#chat_box").css("top"));
														var mLeft = e.pageX;
														var mTop = e.pageY;
														$("body").unbind("mousemove").mousemove(function(e) {
															$("#chat_box").css("left", (cLeft-mLeft+e.pageX) + "px");
															$("#chat_box").css("top", (cTop-mTop+e.pageY) + "px");
														});
														$("body").unbind("mouseup").mouseup(function() {
															$(this).unbind("mousemove").unbind("mouseup");
														});
													}
												});
												$("#chat_close").unbind("click").click(function() {
													$("#chat_box").fadeOut();
												});
												display_output(false,"Chatbox Loaded!");
												$("#chat_box").fadeIn();
											});
					}
						//sort towns alphabetically for display in list
					player.towns.sort(function(a, b) {
						if(b.townID == player.capitaltid) {return 1}
						if(a.townID == player.capitaltid) {return -1}
						var nameA = a.townName.toLowerCase();
						var nameB = b.townName.toLowerCase();
						if (nameA < nameB) {return -1}
						if (nameA > nameB) {return 1}
						return 0;
					});
					$.each(player.towns,function(i,x) {
						x.townName = x.townName.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
						$.each(x.bldg,function(j,y) {
							y.path = y.type.replace(/\s/g, "");
						});
						
						var sortedSupport = [];
						$.each(x.supportAU, function(j, y) {
							var exists = false;
							$.each(sortedSupport, function(k, z) {
								if(y.originalPlayer == z.player) {
									exists = k;
									return false;
								}
							});
							
							if(exists) {
								sortedSupport[exists].indexes.push(j);
							} else {
								sortedSupport.push({player : y.originalPlayer, pid: y.originalPlayerID, indexes : [j]});
							}
						});
						player.towns[i].sortedSupport = sortedSupport;
					});
						//assign curtown
					if(reloadTown) {
						player.curtown = $.grep(player.towns,function(v,i){
											return v.townID == player.curtown.townID;
										})[0];
					} else {
						player.curtown = player.towns[0];
					}
					
					//these functions have to be done separately, atm
					get_SRs();
					get_all_trades();
					get_map();
					get_support_abroad();
							
					display_output(false,"Loading Other Data...");
					miscAJAX = new make_AJAX();
					miscAJAX.callback = function(response) {
						try {
							//see get call below for call order (it explains the numbering)
							var info = response.split(";");
							get_bldgs(false,info[0]);
							get_weapons(false,info[1]);
							get_raids(false,info[2]);
							get_messages(false,info[3], info[4]);
							player.TPR = (info[5].match(/^false/i))?false:$.parseJSON(info[5]);
							get_quests(false,info[6]);
							get_achievements(info[10]);
							display_output(false,"Player Data Loaded!");
							
							get_ranks(false,info[7],info[8],info[9]);
							
							BUI.build();
							set_tickers();	
							display_res();
							
							if(player.research.premiumTimer==0) $("body").addClass("notBH");
							
							$("#cityname").html(function() { 
								if(player.curtown.townID == player.capitaltid) {
									return "&#171;" + player.curtown.townName + "&#187;";
								} else {
									return player.curtown.townName;
								}
							});
								
							if(!loggedIn) { //so that this only happens the first time a player logs in
								do_fade(show_town, "amber");
								loggedIn = true;
							} else if(reloadUI) {
								currUI();
							}								
							
								//set up the dropdown and city view buttons
							$("#cityname").click(function() {	
								do_fade(show_town, "amber");
							});
							$("#citydropdown").click(function() {
								town_list(player);
							});
							
							$("#logout").unbind('click').click(function() {
								do_fade(logout);
							});
							
							$("#options").unbind('click').click(function() {
								build_ASM();
								$("#menu").click();
							});
							
							$("#premium").unbind("click").click(function() {
								do_fade(draw_premium_UI, "amber");
								$("#menu").click();
							});
							
							$("#refresh").unbind('click').click(function() {
								load_client(player.league, true, true);
								$("#menu").click();
							});
							
							$("#tutorial").unbind('click').click(function() {
								run_tutorial();
								$("#menu").click();
							});
							
								//set up bottom UI
							set_bottom_links();
							display_output(false,"Client Initialized!");
							gettingPlayer = false;
						}
						catch(e) {
							display_output(true,"Error loading other data!",true);
							display_output(true,e,true);
							display_output(false,"Retrying...");
							gettingPlayer = false;
							load_client(type);
						}
					};
									
					miscAJAX.get('/AIWars/GodGenerator?reqtype=command&command=' + player.command 
									+ '.getBuildings();' + player.command + '.getWeapons();' + player.command 
									+ '.getUserRaids();' + player.command + '.getMessages();' + player.command 
									+ '.getUserGroups();' + player.command + ((!type)?'.getUserTPR();':'.getUserTPRs();')
									+ player.command + '.getQuests();bf.getPlayerRanking();bf.getLeagueRanking();bf.getBattlehardRanking();'
									+ player.command + '.getAchievements();');
				}
				catch(e) {
					display_output(true,"Error during Player load!", true);
					display_output(true,e,true);
					display_output(false,"Retrying...");
					gettingPlayer = false;
					load_client(type);
				}
			} else {
				clear_all_timers();
				window.location.replace("/");
			}
		};
		
		playerget.get("/AIWars/GodGenerator?reqtype=" + ((type)?"league":"player"));
	}
}

function load_player(type, reloadTown, reloadUI) {
	if(!gettingPlayer) {
		gettingPlayer = true;
		if(loggedIn) if(type != player.league) clear_all_timers(); //this is to prevent timers from the regular player from contaminating the league player and vice versa
		display_output(false,"Loading Player Data");
		var playerget = new make_AJAX();
		playerget.callback = function(response) {
			if(!response.match(/invalid/i)) { //if the user entered a valid UN and Pass
				try {
					$.extend(player, $.parseJSON(response));
					
					if(!player.towns) throw "No Towns";
					if(player.towns.length < 1) throw "No Towns";
					player.username = player.username.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
					player.command = (player.league)?"bf.getLeague()":"bf";

						//sort towns alphabetically for display in list
					player.towns.sort(function(a, b) {
						if(b.townID == player.capitaltid) {return 1}
						if(a.townID == player.capitaltid) {return -1}
						var nameA = a.townName.toLowerCase();
						var nameB = b.townName.toLowerCase();
						if (nameA < nameB) {return -1}
						if (nameA > nameB) {return 1}
						return 0;
					});
					$.each(player.towns,function(i,x) {
						x.townName = x.townName.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
						$.each(x.bldg,function(j,y) {
							y.path = y.type.replace(/\s/g, "");
						});
						
						var sortedSupport = [];
						$.each(x.supportAU, function(j, y) {
							var exists = false;
							$.each(sortedSupport, function(k, z) {
								if(y.originalPlayer == z.player) {
									exists = k;
									return false;
								}
							});
							
							if(exists) {
								sortedSupport[exists].indexes.push(j);
							} else {
								sortedSupport.push({player : y.originalPlayer, pid: y.originalPlayerID, indexes : [j]});
							}
						});
						player.towns[i].sortedSupport = sortedSupport;
					});
					
					// rebuild some info that gets lost
					get_all_trades();
					
						//assign curtown
					if(reloadTown) {
						player.curtown = $.grep(player.towns,function(v,i){
											return v.townID == player.curtown.townID;
										})[0];
					} else {
						player.curtown = player.towns[0];
					}
					//update checks
					if(SR.update) {
						SR.update = false;
						get_SRs();
					}
					if(map.update) {
						map.update = false;
						get_map();
					}
					if(player.raids.update) {
						player.raids.update = false;
						get_raids(true);
					}
					
					get_messages(true);
					build_raid_list();
					BUI.build();
					set_tickers();	
					display_res();
					set_bottom_links();
					
					if(reloadUI) {
						currUI();
					}
					
					gettingPlayer=false;
					display_output(false,"Player Data Loaded!");
				}
				catch(e) {
					display_output(true,"Error during Player load!", true);
					display_output(true,e,true);
					display_output(false,"Retrying...");
					gettingPlayer = false;
					load_player(type, reloadTown, reloadUI);
				}
			} else {
				clear_all_timers();
				window.location.replace("/");
			}
		};
		
		playerget.get("/AIWars/GodGenerator?reqtype=" + ((type)?"league":"player"));
	}
}

function logout() {
	var logout = new make_AJAX();
					
	logout.callback = function(response) {
		if(response.match(/invalid/)) {
			clear_all_timers();
			window.location.replace("/");
		}
	};
	
	logout.get("/AIWars/GodGenerator?reqtype=logout");
}

function fb_connect(response) {
	if(response.session) {
		FB.api('/me', function(response) {
			var regFB = new make_AJAX();
			regFB.callback = function(response) {
						if(response.match(/invalid/)){
							display_output(true,"An error occured while linking your account.", true);
							display_output(false,"Please try again later.");
						}
						else display_output(false,"Your account is now connected to Facebook!");
					};
			
			regFB.post("/AIWars/GodGenerator","reqtype=linkFB&fuid="+response.id);
		});
	}
}