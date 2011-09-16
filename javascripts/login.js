/**************************************************************************************************************\
***********************************************Player Object****************************************************
\**************************************************************************************************************/
var player = {
				getting 		: false,
				chatLoaded 		: false,
				loggedIn 		: false,
				chatboxLoaded	: false,
				activeTrades	: [],
				tradeSchedules	: [],
				supportAbroad	: []
			};
var userInfo = {};

function get_session() {
	var seshget = new make_AJAX();
	
	seshget.callback = function(response) {
		log(response, "login,js:19");
		if(!response.match(/invalid/)) {
			load_player(); //if the user entered a valid UN and Pass
			check_all_for_updates();
		} else {
			var inFB = FB._inCanvas;
			FB.getLoginStatus(function(response) {
				log(response, "login,js:25");
				if(response.session) {
					FB.api("/me",function(response) {
						log(response, "login,js:28");
						userInfo = response;
						var login = new make_AJAX();
						login.callback = function(response) {
							log(response, "login,js:32");
							if(response.match(/invalid/)) {
								if(inFB) {
									FB_login_window();
								} else {
									window.location.assign("/");
								}
							} else { 
								load_player();
								check_all_for_updates();
							}
						};
						login.post("","reqtype=login&fuid="+response.id);
					});
				} else if(inFB) {
					FB_login_window();
				} else {
					window.location.assign("/");
				}
			});
		}
	};

	seshget.get("reqtype=session");
}

function FB_login_window() {
	var HTML = "<div id='modal_window'>\
					<div id='AIW_alertMod'></div>\
					<div id='signInBox'>\
						<div id='reg'>\
							<label for='reg_UN'>Username*:</label><input type='text' id='reg_UN' maxlength='20'/>\
							<div id='reg_fbConnect' class='fbButton'>Link with Facebook</div>\
							<div id='reg_submit' class='lightButton noUN noFB'>\
								<div class='lightFrameBody'>Continue</div>\
								<div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
							</div>\
							<span>*Maximum Length: 20 characters</span>\
							<span style='display:block;margin-top:5px;'>Registering a new account will also open our forum in a new window.</span>\
						</div>\
						<div id='reg_wait'>\
							One moment please...\
						</div>\
					</div>\
				</div>";
	$("body").append(HTML);
	if(userInfo.verified) {
		if($("#reg_UN").val() == "") $("#reg_UN").val(userInfo.name);
		$("#reg_fbConnect").text("Account Linked");
		$("#reg_submit").removeClass("noFB");
	}
	$("#signInBox").fadeIn("fast");
	
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
	var badChars = /;|,|\/|\?|:|@|&|=|\+|\$|#|\s/g;
	$("#reg_UN").unbind("keyup").keyup(function(){
		if($(this).val().match(badChars)) {
			$(this).val($(this).val().replace(badChars,""));
			$("#reg_error").html("God doesn't like special characters.");
		}
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
									};
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
						if($("#reg_UN").val() == "") $("#reg_UN").val(userInfo.name);
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
			var form = {
						UN : $("#reg_UN").val(),
						skipMe : true,
						centerx : 0,
						centery : 0
						};
			register(form);
			$("#reg").css("display","block");
			$("#reg_wait").css("display","none");
			$(this).fadeIn("fast");
		});
	});
	
	$("#tileSelect_skip").unbind("click").click(function() {
		var form = {
						UN : $("#reg_UN").val(),
						skipMe : true,
						centerx : 0,
						centery : 0
						};
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
						};
			register(form);
		$("#signInBox").fadeOut("fast",function() {
			$("#reg_wait").css("display","block");
			$("#reg_picktile").css("display","none");
			$(this).fadeIn("fast");
		});
		}
	});
}

function load_player(forceReload, reloadTown, reloadUI) {
	if(!player.getting) {
		player.getting = true;
		forceReload = forceReload || !player.loggedIn;
		display_output(false,"Loading Player Data");
		var playerget = new make_AJAX();
		playerget.callback = function(response) {
			display_output(false,"Checking for valid session...");
			if(!response.match(/invalid/i)) { //if the user entered a valid UN and Pass
				display_output(false,"Session validated!");
				try {
					if(!forceReload && websock.nosock) {
						//update checks
						try {
							if(player.raids.update && !SR.update) {
								get_raids(true);
							}	
						} catch(e) {}
						try {
							if(SR.update) {
								get_SRs();
								get_raids(true);
							}	
						} catch(e) {}
						try {
							if(map.update) {
								map.update = false;
								get_map();
							}					
						} catch(e) {}
					}
					
					if(player.loggedIn) {
						if(forceReload) {
							clear_all_timers();
						} else {
							clear_player_timers();
						}
					}
					parse_player(response, forceReload);
					
					//get chatbox
					if(!player.chatboxLoaded) { //chatbox only has to load once
						player.chatboxLoaded = true;
						display_output(false,"Loading Chatbox...");
						$("#chat_innerbox").load("/PHP/chatBox.php","UN="+player.username, 
											function(response,status,xhr) {
												$("#chatbox_tab").unbind("click").click(function(){
													if(Modernizr.csstransitions) {
														$("#chat_box").addClass("open");
													} else {
														$("#chat_box").animate({"margin-left":"-4px"},100);
													}
												}).click();
												$("#chat_close").unbind("click").click(function() {
													if(Modernizr.csstransitions) {
														$("#chat_box").removeClass("open");
													} else {
														$("#chat_box").animate({"margin-left":"-320px"},100);
													}
												});
												display_output(false,"Chatbox Loaded!");
											});
					}
					
						//assign curtown
					if(reloadTown) {
						player.curtown = $.grep(player.towns,function(v,i){
											return v.townID == player.curtown.townID;
										})[0];
					} else {
						player.curtown = player.towns[0];
					}
					
					display_output(false,"Loading Other Data...");
					if(forceReload) {
						//these functions have to be done separately, atm
						get_SRs();
						get_all_trades();
						get_map();
						get_support_abroad();
								
						miscAJAX = new make_AJAX();
						miscAJAX.callback = function(response) {
							try {
								//see get call below for call order (it explains the numbering)
								var info = response.split(";");
								var i = 0;
								get_bldgs(false,info[i++]);
								get_raids(false,info[i++]);
								get_messages(false,info[i++], info[i++]);
								player.TPR = (info[i].match(/^false/i))?false:$.parseJSON(info[i]); i++;
								get_quests(false,info[i++]);
								get_achievements(false,info[i++]);
								display_output(false,"Player Data Loaded!");
								
								get_ranks(false,info[i++],info[i++],info[i++]);
								
								//set actualInc[] for each town.  actualInc[] holds the actual increase, per second, while resInc[] holds mine output.
								$.each(player.towns, function(i,x) {
									x.actualInc = [];
									$.each(x.resInc, function(j,y) {
										if(j>3) {return false;}
										var tax = 0;
										if(player.TPR) {
											$.each(player.TPR, function(k,z) {
												if(z.player == player.username) {
													tax = z.taxRate;
													return false;
												}
											});
										}
										x.actualInc[j] = y-(y*tax)-(j==3?x.foodConsumption/3600:0);
									});
								});
								
								BUI.build();
								set_tickers();
								$("body").trigger("resUpdate");
								
								if(player.research.premiumTimer==0 && player.research.bp==0) $("body").addClass("notBH");
								else $("body").removeClass("notBH");
								
								$("#cityname").html(function() { 
									if(player.curtown.townID == player.capitaltid) {
										return "&#171;" + player.curtown.townName + "&#187;";
									}
									return player.curtown.townName;
								});
									
								if(!player.loggedIn) { //so that this only happens the first time a player logs in
									do_fade(show_town);
									player.loggedIn = true;
									$("#citybox").addClass("open");
								} else if(reloadUI) {
									currUI();
								}								
								
									//set up the dropdown and city view buttons
								$("#cityname").click(function() {
									do_fade(show_town, $("#citybox"));
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
									do_fade(draw_premium_UI);
									$("#menu").click();
								});
								
								$("#refresh").unbind('click').click(function() {
									$("body").unbind("tileReady");
									load_player(true, true, true);
									$("#menu").click();
								});
								
								$("#tutorial").unbind('click').click(function() {
									run_tutorial();
									$("#menu").click();
								});
								
									//set up bottom UI
								set_bottom_links();
								display_output(false,"Client Initialized!");
								player.getting = false;
							}
							catch(e) {
								display_output(true,"Error loading other data!",true);
								display_output(true,e,true);
								display_output(false,"Retrying...");
								player.getting = false;
								load_player(forceReload, reloadTown, reloadUI);
							}
						};
										
						miscAJAX.get('reqtype=command&command=bf.getBuildings();bf.getUserRaids();bf.getMessages();'
									+ 'bf.getUserGroups();bf.getUserTPRs();bf.getQuests();bf.getAchievements();bf.getPlayerRanking();'
									+ 'bf.getLeagueRanking();bf.getBattlehardRanking();');
					} else {
					
						get_all_trades();
						get_support_abroad();
					
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
						player.getting=false;
						display_output(false,"Player Data Loaded!");
					}
				} catch(e) {
					display_output(true,"Error during Player load!", true);
					display_output(true,e,true);
					log(e,this,arguments);
					display_output(false,"Retrying...");
					player.getting = false;
					load_player(forceReload, reloadTown, reloadUI);
				}
			} else {
				get_session(); //this will double check the session and also pull up the login form for facebook users
			}
		};
		
		playerget.get("reqtype=player");
	}
}

function parse_player(data, reloadForced) {
	display_output(false,"Parsing player data....");
	$.extend(player, $.parseJSON(data));
				
	if(!player.towns || player.towns.length < 1) throw "No Towns";
	player.username = player.username.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
	player.command = "bf";
	player.time = new Date();

		//sort towns alphabetically for display in list
	player.towns.sort(function(a, b) {
		if(b.townID == player.capitaltid) {return 1;}
		if(a.townID == player.capitaltid) {return -1;}
		var nameA = a.townName.toLowerCase();
		var nameB = b.townName.toLowerCase();
		if (nameA < nameB) {return -1;}
		if (nameA > nameB) {return 1;}
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
	
	$.each(player.AU,function(i,x) {
		switch(x.type) {
			case 1:
				x.rank = "soldier";
				break;
			case 2:
				x.rank = "tank";
				break;
			case 3:
				x.rank = "golem";
				break;
			case 4:
			case 5:
				x.rank = "bomber";
				break;
		}
		
		switch(x.armorType) {
			case 1:
				x.armorType = "light";
				break;
			case 2:
				x.armorType = "heavy";
				break;
		}
		
		switch(x.attackType) {
			case 1:
				x.attackType = "physical";
				break;
			case 2:
				x.attackType = "explosive";
				break;
			case 3:
				x.attackType = "electrical";
				break;
		}
	});
	
		//normalize town values to seconds from ticks and sort support
	$.each(player.towns,function(i,x) {
		if(map.tiles) {
			var mapTile;
			$.each(map.tiles, function(j,y) {
				$.each(y, function(k,z) {
					if(Math.abs(z.centerx-x.x) < 5 && Math.abs(z.centery-x.y) < 5) {
						mapTile = z;
						return false;
					}
				});
				return !mapTile;
			});
			x.tile = mapTile.mapName;
		}
		
		x.activeTrades = player.activeTrades[i] || {};
		x.tradeSchedules = player.tradeSchedules[i] || {};
		x.supportAbroad = player.supportAbroad[i] || {};
		x.townName = x.townName.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
		x.movementTicks *= player.gameClockFactor;
		x.movementTicks += player.time.timeFromNow(1000)+player.gameClockFactor;
		for(y in x.resInc) {
			if(x.resInc.hasOwnProperty(y)) x.resInc[y] /= player.gameClockFactor;
		}
		
		if(player.loggedIn && !reloadForced) {
			//set actualInc[] for each town.  actualInc[] holds the actual increase, per second, while resInc[] holds mine output.
			$.each(player.towns, function(i,x) {
				x.actualInc = [];
				$.each(x.resInc, function(j,y) {
					var tax = 0;
					if(player.TPR) {
						$.each(player.TPR, function(k,z) {
							if(z.player == player.username) {
								tax = z.taxRate;
								return false;
							}
						});
					}
					x.actualInc[j] = Math.round((y*(1-tax))-(i==4 ? x.foodConsumption/3600 : 0));
				});
			});
		}
		
		$.each(x.bldg,function(j,y) {
			y.path = $.trim(y.type).replace(/\s/g, "-");
			if(y.type == "Airship Platform") y.numLeftToBuild = 99999; //this is to make sure that APs get ticked properly
			for(z in y.ticksToFinishTotal) {
				if(y.ticksToFinishTotal.hasOwnProperty(z)) y.ticksToFinishTotal[z] *= player.gameClockFactor;
			}
			if(y.lvlUps != 0) {
				y.ticksToFinish *= player.gameClockFactor;
				y.ticksToFinish -= player.time.timeFromNow(1000)+player.gameClockFactor;
			}
			y.ticksPerPerson *= player.gameClockFactor;
			if(y.numLeftToBuild > 0) {
				y.ticksLeft *= player.gameClockFactor;
				y.ticksLeft -= player.time.timeFromNow(1000)+player.gameClockFactor;
			}
			$.each(y.Queue,function(k, z) {
				z.currTicks *= player.gameClockFactor;
				z.currTicks -= player.time.timeFromNow(1000)+player.gameClockFactor;
				z.ticksPerUnit *= player.gameClockFactor;
			});
		});
		
		var sortedSupport = [];
		$.each(x.supportAU, function(j, y) {
			switch(y.type) {
				case 1:
					y.rank = "soldier";
					break;
				case 2:
					y.rank = "tank";
					break;
				case 3:
					y.rank = "golem";
					break;
				case 4:
				case 5:
					y.rank = "bomber";
					break;
			}
			
			switch(y.armorType) {
				case 1:
					y.armorType = "light";
					break;
				case 2:
					y.armorType = "heavy";
					break;
			}
			
			switch(y.attackType) {
				case 1:
					y.attackType = "physical";
					break;
				case 2:
					y.attackType = "eyplosive";
					break;
				case 3:
					y.attackType = "electrical";
					break;
			}
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
	
	
	//no need for a town list if we only have one town, right?
	if(player.towns.length > 1) {
		$("#citydropdown").css("display","block");
		var list = $("#townlist");
		var HTML = "";
		$.each(player.towns, function(i, x) { //build the actual town list
			HTML += "<li><div index='" + i + "'>" + (x.townID == player.capitaltid ? "&#171;" + x.townName + "&#187;": x.townName) + "</div></li>";
		});
		
		list.html(HTML);
		
		list.css("top",(68-list.outerHeight())+"px");
		
		$("#townlist div").unbind('click').click(function() {
			var list = $("#townlist");
			player.curtown = player.towns[$(this).attr("index")];
			list.animate({"top":"-="+list.outerHeight()},200*player.towns.length);
			$("body").unbind('click');
			BUI.build();
			clearInterval(BUI.active.timer);
			get_buildable();
			$("body").trigger("resUpdate");
			build_raid_list();
			show_town();
			
			$("#citydropdown").unbind('click').click(function() { //reset the dropdown click event
				town_list();
			});
		});
	}
	
	display_output(false,"Player Data Parsed!")
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
			load_player();
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