
var websock = false;
function make_AJAX() {
	var that = this; //this is so I always have a reference to the calling object
	if(Modernizr.websockets && !websock.nosock) {
		if(!websock||websock.readyState>1) {
			try {
				try {
					websock = new WebSocket("ws://"+location.hostname+":8079/AIWars/GodGenerator/");
				} catch(e) {
					websock = new MozWebSocket("ws://"+location.hostname+":8079/AIWars/GodGenerator/");
				}
				websock.connected = websock.readyState == 1;
				websock.backlog = websock.backlog || [];
				websock.log = websock.log || [];
				websock.checksock = websock.checksock || [];
				websock.onopen = 	function() {
										websock.connected = true;
										player.password = undefined;
										while(websock.checksock.length>0) {
											clearTimeout(websock.checksock.shift());
										}
										while(websock.backlog.length>0) {
											websock.send(websock.backlog[0].data);
											websock.log.push(websock.backlog.shift());
										}
									};
				websock.onerror = 	function(err) {
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
													if(valid) v.callback(message.data);
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
												case "map":
													map.working = true;
													get_map(message.data);
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
													get_quests(message.data);
													break;
													
												case "flick":
													player.research.flick = message.data;
													do_flick();
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
				display_output(true,e,true);
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
										websock.send(data+"&id="+that.id);
										websock.log.push(that);
									} else {
										websock.backlog.push(that);
										websock.checksock.push(	setTimeout(	function() {
																				if(websock.readyState != 1) {
																					websock.nosock = true;
																					var temp = websock.backlog.shift();
																					websock.checksock.shift();
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
							try {
								var response = xhr.responseText.split("<body>")[1].split("</body>")[0];
								display_output(true,response,true);
							} catch(e) {
								display_output(true,e,true);
							}
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
	$("#console_output").append("<br/><span class='output" + ((error)?" error":"") + "'>" + message + "</span>");
	
	if(!$("#console_stop").is(":checked")) $("#console_output").scrollTop(10000000);
}

function display_message(title, message, callback) { //callback is a function  and, if set, converts the message from an alert to a confirm
	var popup = "<div id='AIW_alertTitlebar'>" + title + "</div>\
				<div id='AIW_alertMess'>" + message + "</div>"
				+((callback)?"<div id='AIW_alertNo' class='alertButton' style=''>No</div><div id='AIW_alertYes' class='alertButton' style=''>Yes</div>":"<div id='AIW_alertButton' class='alertButton' style=''>Okay</div>")
				+"</div>";
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
/**
 * Fade between different menus.  This allows more control over exactly when a fade happens.
 *
 * @Param nextUI	the function to call after the fade.
 * @Param SBB		a jQuery object containing the clicked top or bottom nav button, if any
 * @returns undefined
 * @type void
 */
function do_fade(nextUI, SBB) {
		//controls for fading between sidebar tabs
	$("#bottomlinks li.open, #toplinks li.open").removeClass("open");
	if(SBB) { 
		SBB.addClass("open");
	}
	$("#window, #viewerback").fadeOut("fast").promise().done(function(){
		nextUI();
	});
}

function display_res() {
	var res = $("#resourcebar").clone(true);
	res.children().each(function(i,el) {
		if(i>3) {return false;}
		$(el).text(format_number(player.curtown.res[i]));
	});
	$("#resourcebar").replaceWith(res);
}
/**
 *	Takes an input number and formats it such that the string varient of the number has no more than 4 characters
 *	
 *	Ex. format_number(58690) will output "58K"
 *
 *	@param number the number to be formatted
 *	@return a string in one of the following formats:  "####" or "###c"  Where "#" is a number and "c" is a character denoting denomination (such as "M" for million).  If the number is greater than 999,999,999,999,999 (999 trillion), this function returns "OOB" or "Out Of Bounds".
 */
function format_number(number) {
	if(number > 9999) {
		var index = 0;
		var denom = ["","K","M","B","T"];
		while(number > 999) {
			number = Math.floor(number/1000);
			index++;
		}
		//as a point, I have no idea how you could conceivably get so many resources as to trigger this.
		if(index>4) return "OOB";	// OOB = Out Of Bounds
		
		return number+denom[index];
	}
	
	return number;
}

var bldgs = {
				all : "empty",
				buildable : "empty"
			};
function get_bldgs(async, bldgList) {
	try {
		if(async) {
			display_output(false,"Loading Buildings...");
			getBldgs = new make_AJAX();
			getBldgs.callback = function(response) {
									get_bldgs(false,response);
								};
			getBldgs.get("reqtype=command&command="+player.command+".getBuildings();");
		} else {
			bldgs = $.parseJSON(bldgList);
			$.each(bldgs, function(i,x) {
				x.path = x.type.replace(/\s/g, "-");
			});
			display_output(false,"Buildings Loaded!");
		}
	} catch(e) {
		display_output(true,"Error loading Buildings!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_bldgs(true);
	}
}

function get_buildable(async, bldable) {
	try {
			if(async || !bldable) {
				var getBuildable = new make_AJAX();
				getBuildable.callback = function(response) {
											get_buildable(false,$.parseJSON(response));
										};
				getBuildable.get("reqtype=command&command=bf.buildableBuildings("+player.curtown.townID+");");
			} else {
				player.curtown.bldableBldgs = $.grep(bldgs, function(x,i) {
													var found = false;
													$.each(bldable, function(j, y) {
														if(x.type == y) {
															found = true;
															return false;
														}
													});
													return found;
												});
				player.curtown.lockedBldgs = $.grep(bldgs, function(x,i) {
													var found = false;
													$.each(bldable, function(j, y) {
														if(x.type == y || x.type == "Metal Mine"||x.type == "Crystal Mine"||x.type == "Timber Field"||x.type == "Farm") {
															found = true;
															return false;
														}
													});
													return !found;
												});
			}
	} catch(e) {
		display_output(true,"Error loading Buildable Buildings!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_buildable(true);
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
		var path = "reqtype=command&command=";
		
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
						$.each(v.activeTrades,function(j,w) {
								w.currTicks *= player.gameClockFactor;
								w.currTicks -= player.time.timeFromNow(1000)+player.gameClockFactor;
								w.intervaltime *= player.gameClockFactor;
							
						});
					}
					if(v.tradeSchedules.length > 0) {
						$.each(v.tradeSchedules,function(j,w) {
								w.currTicks *= player.gameClockFactor;
								w.currTicks -= player.time.timeFromNow(1000)+player.gameClockFactor;
								w.intervaltime *= player.gameClockFactor;
							
						});
					}
					player.activeTrades.push(v.activeTrades);
					player.tradeSchedules.push(v.tradeSchedules);
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
		log(trades, "in parse_trades() in utilities.js:502");
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
			$("#sr .flicker").stop(true,true).fadeOut();
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
			$("#mailbox .flicker").stop(true,true).fadeOut();
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
			try {
				if(x.zeppelin) {
					clearInterval(x.moveTicker);
				}
			} catch(e) {}
		});
	display_output(false,"Tickers Cleared!");
}

function clear_all_timers() {
	display_output(false,"Clearing tickers...");
		clearInterval(updateTimer);
		
		clearInterval(player.townUpdate);
		
		clearInterval(BUI.active.timer);
		
		clearInterval(player.research.ticker);
		
		
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
			}
			catch(e) {}
			try {
				if(x.zeppelin) {
					clearInterval(x.moveTicker);
				}
			} catch(e) {}
		});
	display_output(false,"Tickers Cleared!");
}

function set_bottom_links() {
	// $("#League").unbind("click").click(function(){
		// do_fade(build_league_UI,$(this));
	// });
	$("#IO").unbind('click').click(function() {
		if(SR.update) {
			get_raids(true);
			get_SRs();
		}
		$("#attacklist").animate({"opacity":"toggle","height":"toggle"},"fast");
	});
	$("#CS").unbind('click').click(function() {
		$.each(player.curtown.bldg, function(i, x) {
			if(x.type == "Command Center") {
				BUI.set(x.type, x.lotNum);
				BUI.CC.startTab = "overview";
				do_fade(draw_bldg_UI, $("#CS"));
				return false;
			}
		});
	});
	$("#EVE").unbind("click").click(function() {
		do_fade(build_RAI_interface, $(this));
	});
}
/*
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
	});
}*/

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
	return this.min(min).max(max);
};

/**
 * Identical to .clamp(-Infinity,max);
 * Returns a number whose value is less than or equal to max
 *
 * @param {Number} max The upper boundary of the output range
 * @returns A number equal to or less than max
 * @type Number
 */
Number.prototype.max = function(max) {
	return Math.min(this, max);
};

/**
 * Identical to .clamp(min,Infinity);
 * Returns a number whose value is greater than or equal to min
 *
 * @param {Number} mine The lower boundary of the output range
 * @returns A number equal to or greater than min
 * @type Number
 */
Number.prototype.min = function(min) {
	return Math.max(this, min);
};

/**
 * Formats a number for display as a clock or other time teller
 *
 * (5).toTime() == "05"
 *
 * @returns The formatted number
 * @type String
 */
Number.prototype.toTime = function() {
	if(this<10) {return "0"+this;}
	return ""+this;
};

/**
 * Returns the difference between the current time, and the time represented by the Date Object
 *
 * @param  {Number or String} specifies a time offset (IE "seconds" or 1000)
 * @returns The numeric differnce between the Date and now
 * @type Number
 */

Date.prototype.timeFromNow = function(offset) {
	var diff = (new Date()).getTime() - this.getTime();
	if(offset) {/*
		if(typeof(offset) == "String") {
			switch(offset) {
				case "seconds":
					offset = 1000;
					break;
				case "minutes":
					offset = 60000;
					break;
				case "hours":
					offset = 3600000;
					break;
				case "years":
					offset = 86400000;
					break;
				default:
					offset = 1;
			}
		}*/
		diff = Math.round(diff/offset);
	}
	return diff;
};

/**
 * Allows an easy way to turn classes on and off inline.
 * 
 * @Param String specifies the class to toggle on or off
 * @returns the jQuery object being acted on
 */
(function($,window) {
	$.fn.toggleClass = function(className){
		return this.each(function(){
			if($(this).hasClass(className)) $(this).removeClass(className);
			else $(this).addClass(className);
		});
	};
})(jQuery, this);

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
	var time = Infinity;
	$.each(thingToTick.actualInc, function(i,v) {
		if(v > 0) {
			if(time > 1/v) time = (1/v).min(0.2);
		}
	});
	return setInterval(function() {
				$.each(thingToTick.res, function(i, v) {
					if(i>3) {return false;}
					if(v >= thingToTick.resCaps[i]) {
						thingToTick.res[i] = thingToTick.resCaps[i];
					} else {
						thingToTick.res[i] += thingToTick.actualInc[i]*time;
					}
				});
				if(thingToTick.townName === player.curtown.townName) {
					$("body").trigger("resUpdate");
				}
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
	if(websock.nosock) {
		updateTimer = setInterval(function() {
										//check player for updates
										var updatePlayer = false;
										$.each(player.towns, function(i,v) {
											$.each(v.bldg, function(j,w) {
												if(w.update) {
													load_player(false,true,false);
													updatePlayer = true;
													return false;
												}
												$.each(w.Queue, function(k, x) {
													if(x.update) {
														load_player(false,true,false);
														updatePlayer = true;
														return false;
													}
												});
												return !updatePlayer;
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
											get_SRs();
											get_raids(true);
										} else if(player.raids.update) {
											get_raids(true);
										}
									},60000);
	}
}