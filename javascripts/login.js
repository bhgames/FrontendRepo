/**************************************************************************************************************\
***********************************************Player Object****************************************************
\**************************************************************************************************************/
var player = {};
var tiles = {};
var userInfo = {};

function get_session() {

	var seshget = new make_AJAX();
	
	seshget.callback = function(response) {
		if(!response.match(/invalid/)) {
			load_client(false); //if the user entered a valid UN and Pass
			check_all_for_updates();
		} else {
			var inFB = (window.self != window.top);
			FB.getLoginStatus(function(response) {
				if(response.session) {
					FB.api("/me",function(response) {
						userInfo = response;
						var login = new make_AJAX();
						login.callback = function(response) {
							if(response.match(/invalid/)) {
								if(inFB) {
									FB_login_window();
								} else {
									window.location.replace("/");
								}
							} else { 
								load_client(false);
								check_all_for_updates();
							}
						};
						login.post("/AIWars/GodGenerator","reqtype=login&fuid="+response.id);
					});
				} else if(inFB) {
					FB_login_window();
				} else {
					window.location.replace("/");
				}
			});
		}
	};

	seshget.get("/AIWars/GodGenerator?reqtype=session");
}

function FB_login_window() {
	var HTML = "<div id='modal_window'>\
					<div id='AIW_alertMod'></div>\
					<div id='signInBox'>\
						<div class='popFrame'>\
							<div class='popFrameTop'><div class='popFrameLeft'><div class='popFrameRight'>\
								<div class='popFrameBody'>\
									<!--<div id='signIn_FBlogin'>\
										<div id='signIn_fbLogin' class='fbButton'>Log In with Facebook</div>\
										New accounts, click <a href='javascript:;' id='reg_switch'>here</a>.<br/>\
										Non-linked account, click <a href='javascript:;' id='signIn_switch'>here</a>.\
									</div>\
									<div id='signIn_legacy'>\
										<div id='signIn_error'></div>\
										<div id='signIn'>\
											<div id='signInHeader'>Sign In</div>\
											<label for='signIn_UN'>Username:</label><input type='text' id='signIn_UN' maxlength='20'/>\
											<label for='signIn_pass'>Password:</label><input type='password' id='signIn_pass' maxlength='20'/>\
											<div id='forgotPass'>Forgotten Password?</div>\
										</div>\
										<div id='signIn_submit' class='lightButton'>\
											<div class='lightFrameBody'>Submit</div>\
											<div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
										</div>\
									</div>-->\
									<div id='reg'>\
										<label for='reg_UN'>Username*:</label><input type='text' id='reg_UN' maxlength='20'/>\
										<div id='reg_fbInfo'>Linked Facebook profile required.</div>\
										<div id='reg_fbConnect' class='fbButton'>Link with Facebook</div>\
										<div id='reg_submit' class='lightButton noUN noFB'>\
											<div class='lightFrameBody'>Continue</div>\
											<div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
										</div>\
										<span>*Maximum Length: 20 characters</span>\
										<span style='display:block;margin-top:5px;'>Registering a new account will also open our forum in a new window.</span>\
									</div>\
									<div id='reg_picktile'>\
										<div id='tile_error'></div>\
										<div id='tileSelectBox_close'></div>\
										<div id='tileSelect_back'>&lt;&lt;&lt; Back</div>\
										<div id='tileSelect_skip'>Skip &gt;&gt;&gt;</div>\
										<p>Optional: Select a start tile.</p>\
										<div id='tileSelect_playerTotal'>Total Players: <span></span></div>\
										<div id='tileSelect_info'>\
											Tile Info:\
											<div id='tileSelect_type'>Type: <span></span></div>\
											<div id='tileSelect_coords'>Center Coordinates: <span></span></div>\
											<div id='tileSelect_activePlayers'>Active Players: <span></span></div>\
											<div id='tileSelect_totalPlayers'>Total Players: <span></span></div>\
										</div>\
										<div id='tileSelector'>\
											<div id='mapTileUp' class='tileDir'></div>\
											<div id='mapTileDown' class='tileDir'></div>\
											<div id='mapTileLeft' class='tileDir'></div>\
											<div id='mapTileRight' class='tileDir'></div>\
											<div id='mapTileDisplay'></div>\
										</div>\
										<div id='tileSelect_submit' class='lightButton noSubmit'>\
											<div class='lightFrameBody'>Continue</div>\
											<div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
										</div>\
									</div>\
									<div id='reg_wait'>\
										One moment please...\
									</div>\
								</div>\
							</div></div></div>\
						</div>\
						<div class='popFrameBL'><div class='popFrameBR'><div class='popFrameB'></div></div></div>\
					</div>\
				</div>";
	$("body").append(HTML);
	if(userInfo.verified) {
		$("#reg_fbConnect").text("Account Linked");
		$("#reg_submit").removeClass("noFB");
	}
	$("#signInBox").fadeIn("fast");
	//Tile Select JS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var getTiles = new make_AJAX();
	getTiles.callback = function(response) {
							tiles = $.parseJSON(response);
							
							$("#tileSelect_playerTotal span").html(function() {
								var players = 0;
								$.each(tiles, function(i,v) {
									players += v.players.length;
								});
								return players;
							});
							
							var maxX = 0;
							var maxY = 0;
							$.each(tiles, function(i, v) {
								if(Math.abs(v.centerx) > maxX) maxX = Math.abs(v.centerx);
								if(Math.abs(v.centery) > maxY) maxY = Math.abs(v.centery);
							});
							tilesWide = 0;
							var j = 0;
							var temp = [];
							for(var y = maxY;y >= (-maxY);y -= 9) {
								temp[j] = [];
								for(var x = (-maxX);x <= maxX;x += 9) {
									$.each(tiles, function(i, v) {
										if(v.centerx == x && v.centery == y) {
											temp[j].push(v);
											return false;
										}
									});
								}
								if(temp[j].length>tilesWide) tilesWide = temp[j].length
								j++;
							}
							tiles = temp;
							var tileHTML = "<div id='tileBox'>";
							var tile = [0.0];
							$.each(tiles, function(i,v){
								$.each(v, function(j,w) {
									if(w.centerx == 0 && w.centery == 0) tile = [i,j];
									tileHTML += "<div class='maptile "+w.mapName+"' style='top:"+(i*35)+"px;left:"+(j*40)+"px;'>"+w.centerx+", "+w.centery+"</div>";
								});
							});
							$("#mapTileDisplay").html(tileHTML+"</div>");
							$("#tileBox").css({	"top":function(){
															if(tile[0]<2) return 0;
															else {
																return (tile[0]-1)*-35;
															}
														},
												"left":function(){
															if(tile[1]<2) return 0;
															else {
																return (tile[1]-1)*-40;
															}
														}});
							
							$(".maptile").unbind("click").click(function(){
								$("#tileSelect_submit").removeClass("noSubmit");
								var index = $(this).index(".maptile");
								$(".maptile.active").removeClass("active");
								$(this).addClass("active");
								selectedTile = {};
								$.each(tiles, function(i,v) {
									if(v.length <= index) index-=v.length
									else {
										selectedTile = tiles[i][index];
										return false;
									}
								});
								$("#tileSelect_type span").html(selectedTile.mapName);
								$("#tileSelect_coords span").html(selectedTile.centerx+", "+selectedTile.centery);
								$("#tileSelect_activePlayers span").html(selectedTile.weeklyActives);
								$("#tileSelect_totalPlayers span").html(selectedTile.players.length);
							});
							
							$(".tileDir").unbind("click").click(function() {
								if($(this).is("#mapTileUp")) {
									$("#tileBox").css("top",function(i,v){
																var newV = parseInt(v)+35;
																if(newV>0) return v;
																return newV+"px";
															});
									return true;
								}
								if($(this).is("#mapTileDown")) {
									$("#tileBox").css("top",function(i,v){
																var newV = parseInt(v)-35;
																if(-newV>(tiles.length-3)*35) return v;
																return newV+"px";
															});
									return true;
								}
								if($(this).is("#mapTileLeft")) {
									$("#tileBox").css("left",function(i,v){
																var newV = parseInt(v)+40;
																if(newV>0) return v;
																return newV+"px";
															});
									return true;
								}
								if($(this).is("#mapTileRight")) {
									$("#tileBox").css("left",function(i,v){
																var newV = parseInt(v)-40;
																if(-newV>(tilesWide-3)*40) return v;
																return newV+"px";
															});
									return true;
								}
							});
						};
	getTiles.get("/AIWars/GodGenerator?reqtype=getTiles");
	//end Tile Select JS ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//Sign In JS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	$("#signIn_switch").unbind("click").click(function() {
		$("#signIn_facebook").fadeOut("fast",function() {
			$("#signIn_legacy").fadeIn("fast");
		});
	});
	$("#signIn_UN, #signIn_Pass").unbind('submit').submit(function(e) {
		e.preventDefault();
		$("#signIn_submit").click();
	});
	$("#signIn_fbLogin").unbind("click").click(function() {
		if(!userInfo.verified) {
			FB.login(function(response) {
				if(response.session) {
					FB.api("/me", function(response) {
						userInfo = response;
						login();
					});
				}
			}, {"perms":"email"});
		} else {
			login();
		}
	});
	$("#signIn_submit").unbind('click').click(function() {
		if(!$(this).parent().hasClass("hasSesh")) {
			var form = {
							UN: $("#signIn_UN").val(),
							Pass: $("#signIn_pass").val()
						};
			
			login(form);
		}
	});
	//end Sign In JS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//Registration JS -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	$("#reg_switch").unbind("click").click(function() {
		$("#signInBox").fadeOut("fast",function() {
			$("#reg").css("display","block");
			$("#signIn_FBlogin").css("display","none");
			$(this).fadeIn("fast");
		});
	});
	
	$("#reg").unbind('submit').submit(function(e) {
		$("#reg_submit").click();
		e.preventDefault();
	});
	var typeCheck = 0;
	$("#reg_UN").unbind("keyup").keyup(function(){
		clearTimeout(typeCheck);
		var that = this;
		typeCheck = setTimeout(function() {
			if($(that).val() != "") {
				var UNvalid = new make_AJAX();
				UNvalid.callback = function(response) {
										$(that).addClass("checked");
										if(response.match(/true/)) {
											$(that).addClass("valid");
											$("#reg_error").html("");
											$("#reg_submit").removeClass("noUN");
										} else {
											$(that).removeClass("valid");
											$("#reg_submit").addClass("noUN");
											$("#reg_error").html("That username is taken");
										}
									}
				UNvalid.get("/AIWars/GodGenerator?reqtype=username&username="+$(that).val());
			} else $("#reg_error").html("Please enter a username");
		},400);
	});
	
	$("#reg_fbConnect").unbind("click").click(function() {
		if(!userInfo.verified) {
			FB.login(function(response) {
				if(response.session) {
					FB.api("/me", function(response) {
						userInfo = response;
						$("#reg_fbConnect").text("Account Linked");
						$("#reg_submit").removeClass("noFB");
					});
				}
			}, {"perms":"email"});
		}
	});
	
	$("#reg_submit").unbind("click").click(function() {
		if(!$(this).hasClass("noUN") && !$(this).hasClass("noFB")) {
			$("#signInBox").fadeOut("fast",function() {
				$("#reg").css("display","none");
				$("#reg_picktile").css("display","block");
				$(this).fadeIn("fast");
			});
		}
	});
	
	$("#tileSelect_back").unbind("click").click(function() {
		$("#signInBox").fadeOut("fast",function() {
			$("#reg").css("display","block");
			$("#reg_picktile").css("display","none");
			$(this).fadeIn("fast");
		});
	});
	
	$("#tileSelect_skip").unbind("click").click(function() {
		var form = {
						UN : $("#reg_UN").val(),
						skipMe : true,
						centerx : 0,
						centery : 0
						}
			register(form);
		$("#signInBox").fadeOut("fast",function() {
			$("#reg_wait").css("display","block");
			$("#reg_picktile").css("display","none");
			$(this).fadeIn("fast");
		});
	});
	
	$("#tileSelect_submit").unbind('click').click(function() {
		if(!$(this).hasClass("noSubmit")){
			var form = {
						UN : $("#reg_UN").val(),
						skipMe : false,
						centerx : selectedTile.centerx,
						centery : selectedTile.centery
						}
			register(form);
		$("#signInBox").fadeOut("fast",function() {
			$("#reg_wait").css("display","block");
			$("#reg_picktile").css("display","none");
			$(this).fadeIn("fast");
		});
		}
	});
}

var gettingPlayer = false, chatboxLoaded = false;
function load_client(type, reloadTown, reloadUI) {
	if(!gettingPlayer) {
		gettingPlayer = true;
		if(loggedIn) {
			if(type != player.league) {
				loggedIn=false; //this is so show_town will be called when switching to league towns
				clear_all_timers();
			}
		}
		display_output(false,"Loading Client");
		display_output(false,"Loading Player Data");
		var playerget = new make_AJAX();
		playerget.callback = function(response) {
			if(!response.match(/invalid/i)) { //if the user entered a valid UN and Pass
				try {
					if(loggedIn) clear_all_timers();
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
					
						// normalize  research values to seconds from ticks
					player.research.scholTicks *= player.gameClockFactor;
					player.research.scholTicksTotal *= player.gameClockFactor;
					player.research.feroTimer *= player.gameClockFactor;
					player.research.mineTimer *= player.gameClockFactor;
					player.research.mmTimer *= player.gameClockFactor;
					player.research.premiumTimer *= player.gameClockFactor;
					player.research.timberTimer *= player.gameClockFactor;
					player.research.revTimer *= player.gameClockFactor;
					player.research.ubTimer *= player.gameClockFactor;
					player.research.fTimer *= player.gameClockFactor;
					
					player.research.knowledge += (player.research.scholTicks/player.research.scholTicksTotal);
					
						//normalize town values to seconds from ticks and sort support
					$.each(player.towns,function(i,x) {
						//these have to be set to avoid errors in the TC
						x.activeTrades = {};
						x.tradeSchedules = {};
						x.townName = x.townName.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
						for(y in x.resInc) {
							x.resInc[y] /= player.gameClockFactor;
						}
						$.each(x.bldg,function(j,y) {
							y.path = y.type.replace(/\s/g, "");
							for(z in y.ticksToFinishTotal) {
								y.ticksToFinishTotal[z] *= player.gameClockFactor;
							}
							if(y.lvlUps != 0) {
								y.ticksToFinish *= player.gameClockFactor;
							}
							y.ticksPerPerson *= player.gameClockFactor;
							if(y.numLeftToBuild > 0) {
								y.ticksLeft *= player.gameClockFactor;
							}
							$.each(y.Queue,function(k, z) {
								z.currTicks *= player.gameClockFactor;
								z.ticksPerUnit *= player.gameClockFactor;
							});
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
							
							if(player.research.premiumTimer==0 && player.research.bp==0) $("body").addClass("notBH");
							else $("body").removeClass("notBH");
							
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
				window.location.replace("/");
			}
		};
		
		playerget.get("/AIWars/GodGenerator?reqtype=" + ((type)?"league":"player"));
	}
}

function load_player(type, reloadTown, reloadUI) {
	if(!gettingPlayer) {
		gettingPlayer = true;
		display_output(false,"Loading Player Data");
		var playerget = new make_AJAX();
		playerget.callback = function(response) {
			if(!response.match(/invalid/i)) { //if the user entered a valid UN and Pass
				try {
					//update checks
					if(player.raids.update && !SR.update) {
						get_raids(true);
					}
					if(SR.update) {
						get_SRs();
						get_raids(true);
					}
					if(map.update) {
						map.update = false;
						get_map();
					}					
					
					clear_player_timers();
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
						// normalize  research values to seconds from ticks
					player.research.scholTicks *= player.gameClockFactor;
					player.research.scholTicksTotal *= player.gameClockFactor;
					player.research.feroTimer *= player.gameClockFactor;
					player.research.mineTimer *= player.gameClockFactor;
					player.research.mmTimer *= player.gameClockFactor;
					player.research.premiumTimer *= player.gameClockFactor;
					player.research.timberTimer *= player.gameClockFactor;
					player.research.revTimer *= player.gameClockFactor;
					player.research.ubTimer *= player.gameClockFactor;
					player.research.fTimer *= player.gameClockFactor;
					
					player.research.knowledge += (player.research.scholTicks/player.research.scholTicksTotal);
					
						//normalize town values to seconds from ticks and sort support
					$.each(player.towns,function(i,x) {
						x.townName = x.townName.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
						for(y in x.resInc) {
							x.resInc[y] /= player.gameClockFactor;
						}
						$.each(x.bldg,function(j,y) {
							y.path = y.type.replace(/\s/g, "");
							for(z in y.ticksToFinishTotal) {
								y.ticksToFinishTotal[z] *= player.gameClockFactor;
							}
							if(y.lvlUps != 0) {
								y.ticksToFinish *= player.gameClockFactor;
							}
							
							y.ticksPerPerson *= player.gameClockFactor;
							if(y.numLeftToBuild > 0) {
								y.ticksLeft *= player.gameClockFactor;
							}
							$.each(y.Queue,function(k, z) {
								z.currTicks *= player.gameClockFactor;
								z.ticksPerUnit *= player.gameClockFactor;
							});
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
					get_support_abroad();
					
						//assign curtown
					if(reloadTown) {
						player.curtown = $.grep(player.towns,function(v,i){
											return v.townID == player.curtown.townID;
										})[0];
					} else {
						player.curtown = player.towns[0];
					}
					
					get_ranks(true);
					get_messages(true);
					get_quests(true);
					build_raid_list();
					BUI.build();
					set_tickers();	
					display_res();
					set_bottom_links();
					
					if(player.research.premiumTimer==0 && player.research.bp==0) $("body").addClass("notBH");
					else $("body").removeClass("notBH");
					
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
				window.location.replace("/");
			}
		};
		
		playerget.get("/AIWars/GodGenerator?reqtype=" + ((type)?"league":"player"));
	}
}

function register(form) {
	sendReg = new make_AJAX();
	sendReg.callback = function(response) {
		if(!response.match(/invalid/i)) {
			login();
			window.open("http://battlehardalpha.xtreemhost.com","_forum");
		} else {
			$("#signInBox").fadeOut("fast",function() {
				$("#reg_wait").css("display","none");
				$("#reg").css("display","block");
				$(this).fadeIn("fast");
			});
			$("#reg_error").html(response.split(":")[1]);
		}
	};
	sendReg.post("/AIWars/GodGenerator","reqtype=createNewPlayer&UN=" + form.UN + "&fuid=" + userInfo.id+"&email="+userInfo.email+"&skipMe="+form.skipMe+"&chosenTileX="+form.centerx+"&chosenTileY="+form.centery);
}

function login(form) {
	var loginget = new make_AJAX();
	loginget.callback = function(response) {
		if(response.match(/invalid/)) {
			$("#reg_wait").text("An error occured while registering your account.  Please click the feedback button on the far right and let us know.");
		} else {
			$("#modal_window").fadeOut("fast",function() {
				$(this).find().unbind();
				$(this).remove();
			});
			load_client(false);
		}
	};
	loginget.post("/AIWars/GodGenerator","reqtype=login&fuid="+userInfo.id);
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