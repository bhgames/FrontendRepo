function show_town() {
	try {
		currUI = show_town;	//set current UI function to be called by the tickers
		var window = $("#window");
		var vb = $("#viewerback");
		window.contents().unbind();
		vb.html("");
		//do update check
		$.each(player.curtown.bldg, function(i,v) {
			if(v.update) {
				load_player(false,true,true);
				return false;
			}
			var noUpdate = true;
			$.each(v.Queue, function(j,w) {
				if(w.update) {
					load_player(false,true,true);
					noUpdate = false;
					return false;
				}
			});
			return noUpdate;
		});
		$("#cityname").html(function() { 
									if(player.curtown.townID == player.capitaltid) {
										return "&#171;" + player.curtown.townName + "&#187;";
									}
									return player.curtown.townName;
								});
								
		if(!player.curtown.tile) { //if the tile hasn't been assigned we need to wait until it is
			$("body").bind("tileReady.showTown", function() {
				$("body").unbind(".showTown");
				show_town();
			});
			return false;
		}
								
		if(!player.curtown.bldableBldgs) {
			get_buildable(true);
		}
		var HTML = "	<div id='town_buildBldgMenu'>\
							<div id='town_buildingListTabs'>\
								<div id='town_unlocked'></div>\
								<div id='town_locked'></div>\
							</div>\
							<div id='town_bldError'></div>\
							<div id='town_closeBldgList' class='closeButton'></div>\
							<div id='town_buildableList'></div>\
							<div id='town_notBuildableList'></div>\
						</div>\
						<div id='town_infobarOpen'></div>\
						<div id='townview'"+(player.curtown.zeppelin ? " class='zeppelin'" : "")+">\
							<div id='town_bldgBldgsPopup'>\
								<div id='town_bldgBldgsBar'>Building Server</div>\
								<div id='town_bldgBldgsList'></div>\
							</div>";
		var numLotsOpen = player.research.infrastructureTech+1, townNum;
		if(player.capitaltid == player.curtown.townID)  numLotsOpen += 4;
		townNum = Math.floor((numLotsOpen-6)/2).max(6);
		vb.css({"background-image":"url(SPFrames/Town-tiles/Town-"+townNum+"-"+player.curtown.tile+".jpg)","background-color":""});
		for(var i = 0; i <= 18; i++) {
			if(i==4) {
				/**
				* TODO:
				*	Switch to using SVG to mask this lot with a dark layer to make it blend better with the shadow of the building it's in.
				*	See also:
				*		http://people.opera.com/dstorey/images/newyorkmaskexample.svg
				*		http://www.w3.org/TR/SVG/masking.html#MaskElement
				*		http://www.w3.org/TR/SVG/struct.html#ImageElement
				*/
				HTML += "<div id='pos4' class='emptylot bldg' lot='4'><img src='SPFrames/Buildings/Town-Hall.png' id='pos4_building' title='Town Hall' alt='Town Hall'/></div>";
			} else {
				HTML += "<div id='pos" + i + "' class='emptylot " + ((i > numLotsOpen)?"locked ":"")
						+ "bldg' lot='"+i+"'><img src='SPFrames/trans.gif' id='pos" + i + "_building' alt=''/></div>";
			}
		}
		
		switch(townNum) {
			case 6:
			case 5:
				HTML += "<img id='town_gate-roof' class='blocker' src='SPFrames/blocking/gate-roof.png' />";
			case 4:
				if(townNum == 4) HTML += "<img id='town_t4-wall-segment' class='blocker' src='SPFrames/blocking/town4-wall-segment.png' />";
			case 3:
				HTML += "<img id='town_right-lantern-1' class='blocker' src='SPFrames/blocking/right-top-lantern.png' />\
						 <img id='town_right-lantern-2' class='blocker' src='SPFrames/blocking/right-bottom-lantern.png' />\
						 <img id='town_elevator-top' class='blocker' src='SPFrames/blocking/elevator.png' />";
			case 2:
				HTML += "<img id='town_left-lantern' class='blocker' src='SPFrames/blocking/left-lantern.png' />";
			case 1:
				HTML += "<img id='town_house-wall' class='blocker' src='SPFrames/blocking/house-wall.png' />" 
						+ (townNum<3?"<img id='town_t3-wall-segment' class='blocker' src='SPFrames/blocking/town3-wall-segment.png' />":"");
		}
		
		window.html(HTML+"</div>");
		
		if(BUI.CC.bldgServer.length>0) {
			clearInterval(player.townUpdate);
			player.townUpdate = update_bldg_timers();
			$("#town_bldgBldgsBar").css("display","block");
			
			$("#town_bldgBldgsBar").unbind('click').click(function() {
				var list = $("#town_bldgBldgsList");
				list.animate(	{"height":"toggle"},
								{
									step : 	function(now, fx) {
												$("#town_bldgBldgsBar").css("bottom",$(this).outerHeight()+"px");
											},
									duration : "fast"
								});
			});
			var list = "<ul>";
			$.each(BUI.CC.bldgServer, function(i,x) {
				var ticksTotal = 0;
				$.each(x.ticksToFinishTotal,function(j,y) {
					ticksTotal += y;
					list += "<li><div class='cancelButton noCancel'></div><div class='bldgName'>"
								+ x.type + "</div><div class='bldgListID'>"
								+ x.lotNum + "</div><div class='bldgTicksToFinish'>"
								+ (ticksTotal - x.ticksToFinish) + "</div></li>";
				});
			});
			$("#town_bldgBldgsList").html(list+"</ul>")
									.css({"display":"block","visibility":"hidden"})
									.css("margin-left",(-list.outerWidth()/2)+"px")
									.css({"display":"","visibility":""});
			if(Modernizr.flexbox) {
				var list = $("#town_bldgBldgsList li");
				if(list.length>1) {
					var sortedList = [];
					list.each(function(i,v) {
						var temp = {};
						temp.index = i;
						temp.time = parseInt($(v).children(".bldgTicksToFinish").text());
						sortedList.push(temp);
					});
					sortedList.sort(function(a,b) {
						return a.time - b.time;
					});
					$.each(sortedList, function(i,v) {
						$("#town_bldgBldgsList li:eq("+v.index+")").css({"box-ordinal-group":i,"-moz-box-ordinal-group":i,"-webkit-box-ordinal-group":i});
					});
				}
			}
		}
		
		$.each(player.curtown.bldg, function(i, x) { //set up tooltips and background images for building lots
			var lot = x.lotNum;
			var back = "SPFrames/Buildings/" + x.path + ".png";
			$("#pos" + lot).removeClass("emptylot locked").addClass("buildlot");
			$("#pos" + lot + "_building").attr({"src":back,"alt":x.type,"title":"Level " + x.lvl + " " + x.type});
			var show = false, image = '';
			if(x.lvlUps>0) {
				if(x.lvl==0) {
					image = 'construct';
				} else if(x.deconstruct) {
					image = 'destruct';
				} else {
					image = 'upgrade';
				}
				show = true;
			}
			if(show) {
				$("#pos"+lot).append("<img src='SPFrames/Buildings/"+image+"-lot.png' class='lvlImage'/>");
			}
		});
		
		window.fadeIn("fast");			//fade in the town now that everything is set up
		vb.fadeIn("fast");
		
		$("#town_unlocked").unbind("click").click(function() {
			if(!$(this).hasClass("open")) {
				$("#town_locked").removeClass("open");
				$(this).addClass("open");
				$("#town_notBuildableList").fadeOut(100);
				$("#town_buildableList").fadeIn(100,function() {
					var api = $(this).data('jsp');
					if(!api) {
						$(this).jScrollPane();
					} else {
						api.reinitialise();
					}
				});
			}
		});
		
		$("#town_locked").unbind("click").click(function() {
			if(!$(this).hasClass("open")) {
				$("#town_unlocked").removeClass("open");
				$(this).addClass("open");
				$("#town_buildableList").fadeOut(100);
				$("#town_notBuildableList").fadeIn(100,function() {
					var api = $(this).data('jsp');
					if(!api) {
						$(this).jScrollPane();
					} else {
						api.reinitialise();
					}
				});
			}
		});
		
		$(".bldg").unbind('click').click(function() {
			var index = parseInt($(this).attr("lot"));
			if(!$(this).hasClass('locked')) {
				if(!$(this).hasClass('emptylot')) {	//if this isn't an empty lot, display the correct UI
					$.each(player.curtown.bldg, function(i, x) {
						if(index == x.lotNum) {
							BUI.set(x.type, index);
							do_fade(draw_bldg_UI);
							return false;
						}
					});
				} else if(player.curtown.bldableBldgs) {
					var bldgMenu = $("#town_buildBldgMenu");
					bldgMenu.css("display","none");
					vb.html("<div id='town_buildBldgMenuBack'></div>");
					if(index==4) { //Only the Command Center can be built on this lot
						var HTML = '<ul>';
						$.each(bldgs, function(i, v) {
							if(v.type=="Command Center") {
								HTML += "<li><div style='background: url(SPFrames/Buildings/" + v.path + ".png) no-repeat center center, url(SPFrames/Buildings/UI/BCM/building-window.png) no-repeat left top;' title='" 
											+ v.type + "' class='bldgPic' /><div class='bldgTitle'>" + v.type + "</div><div class='town_bldgRes'><div class='town_bldgResMetal'>" + v.cost[0]
											+ "</div><div class='town_bldgResTimber'>"+ v.cost[1] +"</div><div class='town_bldgResManMade'>"+ v.cost[2] 
											+ "</div></div><div class='bldgDesc'>" + v.desc + "</div><a href='javascript:;' class='buildBldgButton buildButton"+
											((player.curtown.res[0]<v.cost[0]||player.curtown.res[1]<v.cost[1]||player.curtown.res[2]<v.cost[2])?" noBld":"")+"'></a></li>";
								return false;
							}
						});
						$('#town_buildableList').html(HTML+"</ul>");
						
						HTML = '<ul>';
						$.each(bldgs, function(i, v) {
							if(v.type !="Command Center") {
								HTML += "<li><div style='background: url(SPFrames/Buildings/" + v.path + ".png) no-repeat center center, url(SPFrames/Buildings/UI/BCM/building-window.png) no-repeat left top;' title='" 
											+ v.type + "' class='bldgPic' /><div class='bldgTitle'>" + v.type + "</div><div class='town_bldgRes'><div class='town_bldgResMetal'>" 
											+ v.cost[0] + "</div><div class='town_bldgResTimber'>"+ v.cost[1] +"</div></div><div class='town_bldgResManMade'>"+ v.cost[2] 
											+ "</div></div><div class='bldgDesc'>" + v.desc + "</div></li>";
							}
						});
						$('#town_notBuildableList').html(HTML+"</ul>");
					} else {
						//Create Unlocked Building List 
						var HTML = '<ul>';
						$.each(player.curtown.bldableBldgs, function(i, v) {
							HTML += "<li"+(v.type=="Command Center"?" class='noShow'":"")+"><div style='background: url(SPFrames/Buildings/" + v.path 
										+ ".png) no-repeat center center, url(SPFrames/Buildings/UI/BCM/building-window.png) no-repeat left top;' title='" + v.type 
										+ "' class='bldgPic' /><div class='bldgTitle'>" + v.type + "</div><div class='town_bldgRes'><div class='town_bldgResMetal'>" 
										+ v.cost[0] + "</div><div class='town_bldgResTimber'>"+ v.cost[1] +"</div><div class='town_bldgResManMade'>"+ v.cost[2] 
										+ "</div></div><div class='bldgDesc'>" + v.desc + "</div><a href='javascript:;' class='buildBldgButton buildButton"+
										((player.curtown.res[0]<v.cost[0]||player.curtown.res[1]<v.cost[1]||player.curtown.res[2]<v.cost[2])?" noBld":"")+"'></a></li>";
						});
						$('#town_buildableList').html(HTML+"</ul>");
						
						//Create Locked Building List
						HTML = '<ul>';
						$.each(player.curtown.lockedBldgs, function(i, v) {
							HTML += "<li"+(v.type=="Command Center"?" class='noShow'":"")+"><div style='background: url(SPFrames/Buildings/" + v.path 
										+ ".png) no-repeat center center, url(SPFrames/Buildings/UI/BCM/building-window.png) no-repeat left top;' title='" + v.type 
										+ "' class='bldgPic' /><div class='bldgTitle'>" + v.type + "</div><div class='town_bldgRes'><div class='town_bldgResMetal'>" 
										+ v.cost[0] + "</div><div class='town_bldgResTimber'>"+ v.cost[1] +"</div><div class='town_bldgResManMade'>"+ v.cost[2] 
										+ "</div></div><div class='bldgDesc'>" + v.desc + "</div></li>";
						});
						$('#town_notBuildableList').html(HTML+"</ul>");
					}
					
					bldgMenu.css("display","").animate({"left":"0px"}, "normal");
					$("#town_buildBldgMenuBack").animate({"left":"0px"}, "normal");
					$("#townview").animate({"width":"0px"}, "normal");
					
					$(".bldgDesc").each(function(i,v) {
						$(this).jScrollPane();
					});
					
					$("#town_unlocked").click();
						
					$("#town_closeBldgList").unbind('click').click(function() {
						bldgMenu.animate({"left":"802px"},"normal");
						$("#town_buildBldgMenuBack").animate({"left":"802px"},"normal");
						$("#townview").animate({"width":"100%"}, "normal");
					});
					
					$(".buildBldgButton").unbind("click").click(function() {
							if(!$(this).hasClass("noBld")) {
								var i = $(this).index(".buildBldgButton");
								buildBldg = new make_AJAX();
								
								buildBldg.callback = function(response) {
									if(response.match(/^false/) == null) {
										bldgMenu.animate({"left":"-802px"},"normal",function() {
											load_player(false, true, true);
										});
									} else {
										$("#town_bldError").html(response.split(":")[1]);
									}
								};
								
								buildBldg.get("/AIWars/GodGenerator?reqtype=command&command=bf.build(" + player.curtown.bldableBldgs[i].type 
												+ "," + index + "," + player.curtown.townID + ");");
							}
					});
				}
			}
		});	
		
		$(".cancelButton").unbind("click").click(function() {
			var ele = $(this);		//so that I always have access to the button itself
			if(!ele.hasClass("noCancel")) {	//this is to catch people clicking on the invisible cancel buttons
				$.each(BUI.CC.bldgServer, function(i,x) {
					if(ele.next().text() == x.type) {
						cancelQueue = new make_AJAX();
						
						cancelQueue.callback = function(response) {
							if(response.match(/true/)) {
								ele.parent().remove();
								x.lvlUps -= 1;
								x.deconstruct = false;
								load_player(false, true, false);
								if($("#town_bldgBldgsList li").length == 0) $("#town_bldgBldgsPopup").fadeOut();
								if(x.lvlUps == 0) $("#pos"+x.lotNum+" .lvlImage").remove();
							} else {
								//if cancel failed, bad things are going on.
								display_output(true,"Building Cancel Failed!",true); 
							}
						};
						cancelQueue.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
										+ ".cancelQueueItem(" + x.lotNum + "," 
										+ player.curtown.townID + ");");
						return false;
					}
				});
			}
		});
	} catch(e) {
		display_output(true,"Error Loading Town View",true);
		display_output(true,e);
	}
}

function town_list() {
	$("#citydropdown").unbind('click'); //so that we don't run into problems if the user clicks the arrow again
	
	$("#townlist").animate({"top":"68px"},"fast");
	
	setTimeout(function() { //we use setTimeout so that this doesn't get set while the user clicks
		$("body").unbind('click').click(function() { //this allows the user to click anywhere to dismiss the box
			var list = $("#townlist");
			list.animate({"top":"-="+list.outerHeight()},"fast");
			$(this).unbind('click');
			$("#citydropdown").unbind('click').click(function() { //reset the dropdown click event
				town_list();
			});
		});
	}, 0);
	
}

function update_bldg_timers() {
	return setInterval(function() {
		try {
			var iter = 0;
			var ticksTotal = 0;
			$(".bldgListID").each(function(i,v){
				$.each(BUI.CC.bldgServer, function(ind, x) {
					//do update check
					if(x.update) load_player(false, true,true);
					
					if($(v).text() == x.lotNum) { 	//we found the building in bldgServer
						var ticks;
						if(x.lvlUps > 1) {			//if we have multiple level ups, we have to determine which one is last
							if(i != 0) {			//if we're on the first .bldgName it has to be the first in the list, less checks
													//if the last entry and this entry are the same building, or we're on the last index
								if($(v).parent().prev().children(".bldgListID").text() == $(v).text()) {
									if(iter + 1 != x.lvlUps) { 									//check to see if we're on the last of a list of upgrading buildings
										$(v).siblings(".cancelButton").addClass('noCancel');	//if not, add noCancel
									} else {
										$(v).siblings(".cancelButton").removeClass('noCancel');	//otherwise, make sure the button is there.				
									}
									ticksTotal += x.ticksToFinishTotal[iter]; 					//increase total ticks
									iter++;
								} else {													//otherwise
									$(v).siblings(".cancelButton").addClass('noCancel'); 	//have to cancel the last one first
									iter = 1;												//set this to our first iteration
									ticksTotal = x.ticksToFinishTotal[0]; 					//set total ticks as same as current building
								}
							} else {														//if we're on the first element, it must also be the first in the list
								$(v).siblings(".cancelButton").addClass('noCancel'); 		//have to cancel the last one first
								ticksTotal = x.ticksToFinishTotal[iter]; 					//set total ticks as same as current building
								iter++;
							}
							ticks = ticksTotal - (x.ticksToFinish+player.time.timeFromNow(1000));
						} else {															//if we only have one level up, things are a lot simpler
							ticks = x.ticksToFinishTotal[0] - (x.ticksToFinish+player.time.timeFromNow(1000));
							$(v).siblings(".cancelButton").removeClass('noCancel');
						}
						if(ticks<1) { //if the time is less then 1 the building is finished
							$(v).siblings(".bldgTicksToFinish").html("updating");
							load_player(false,true,true);
						} else {
								//format the times
							var days = Math.floor((ticks / 3600)/24);
							var hours = Math.floor((ticks / 3600)%24);
							var mins = Math.floor((ticks % 3600) / 60);
							var secs = Math.floor((ticks % 3600) % 60);
								//and display them in a nice format
							$(v).siblings(".bldgTicksToFinish").html(((days)?days + " d ":"") + hours.toTime() + ":" + mins.toTime() + ":" + secs.toTime());
						}
						return false;	//pops us out of the loop
						
					//if we didn't find any matches (building has finished)
					} else if(ind == BUI.CC.bldgServer.length - 1) $(v).parent().remove();	//remove the line completely
				});
			});
		} catch(e) {}
	},1000);
}