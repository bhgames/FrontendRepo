function show_town() {
	currUI = show_town;	//set current UI function to be called by the tickers
	var window = $("#window")
	window.contents().unbind();
	//do update check
	$.each(player.curtown.bldg, function(i,v) {
		if(v.update) {
			load_player(false,true,true);
			return false;
		} else {
			var noUpdate = true;
			$.each(v.Queue, function(j,w) {
				if(w.update) {
					load_player(false,true,true);
					noUpdate = false;
					return false;
				}
			});
			return noUpdate;
		}
	});
	if(!player.curtown.bldableBldgs) {
		get_buildable(true);
	}
	$("#cityname").html(function() { 
								if(player.curtown.townID == player.capitaltid) {
									return "&#171;" + player.curtown.townName + "&#187;";
								} else {
									return player.curtown.townName;
								}
							});
	var HTML = "	<div id='town_buildBldgMenu'>\
						<div id='town_buildBldgList' class='darkFrameBody'>\
							<div id='town_buildingListTabs'>\
								<div id='town_unlocked' class='lightButton'>\
									<div class='lightFrameBody'>Unlocked</div>\
									<div class='lightFrameBL'><div class='lightFrameB'></div></div>\
								</div>\
								<div id='town_locked' class='lightButton'>\
									<div class='lightFrameBody'>Locked</div>\
									<div class='lightFrameBR'><div class='lightFrameB'></div></div>\
								</div>\
							</div>\
							<div id='town_bldError'></div>\
							<div id='town_closeBldgList'></div>\
							<div id='town_buildableList'></div>\
							<div id='town_notBuildableList'></div>\
						</div>\
						<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
					</div>\
					<div id='townview'"+(player.curtown.zeppelin ? " class='zeppelin'" : "")+">\
						<div id='town_bldgBldgsPopup'>\
							<div id='town_bldgBldgsBar'>Building Server</div>\
							<div id='town_bldgBldgsList' class='darkFrameBody'></div>\
						</div>\
						<img src='AIFrames/buildings/Base";
	var numLotsOpen = player.research.infrastructureTech;
	if(player.curtown.zeppelin) {
		var townNum = "Zeppelin";
	} else {
		if(player.capitaltid == player.curtown.townID)  numLotsOpen += 4;
		var townNum = Math.floor((numLotsOpen+1)/5);
		if(townNum>3)townNum=3;
	}
	HTML += townNum+".png' id='townback' alt=''/><div id='pos0' class='bldg'><img src='AIFrames/buildings/MetalMine.png' id='pos0_building' alt='Metal Mine'/></div><div id='pos1' class='bldg'><img src='AIFrames/buildings/TimberField.png' id='pos1_building' alt='Timber Field'/></div><div id='pos2' class='bldg'><img src='AIFrames/buildings/CrystalMine.png' id='pos2_building' alt='Crystal Mine'/></div><div id='pos3' class='bldg'><img src='AIFrames/buildings/Farm.png' id='pos3_building' alt='Farm'/></div>";
	for(i = 4; i <= 18; i++) {
		
		HTML += "<div id='pos" + i + "' class='emptylot notMine " + ((i > numLotsOpen)?"locked ":"")
				+ "bldg'><img src='../../images/trans.gif' id='pos" + i + "_building' alt=''/></div>";
	}
	window.html(HTML+"</div>").fadeIn("fast");
	
	if(BUI.CC.bldgServer.length>0) {
		clearInterval(player.townUpdate);
		player.townUpdate = update_bldg_timers();
		$("#town_bldgBldgsBar").css("display","block");
		
		$("#town_bldgBldgsPopup").unbind("mouseenter").mouseenter(function() {
			$("#town_bldgBldgsList").stop(true,true).slideDown();
		}).unbind("mouseleave").mouseleave(function() {
			$("#town_bldgBldgsList").stop(true,true).slideUp();
		});
		var list = "<ul>";
		$.each(BUI.CC.bldgServer, function(i,x) {
			var ticksTotal = 0;
			$.each(x.ticksToFinishTotal,function(j,y) {
				ticksTotal += y;
				list += "<li><div class='cancelButton noCancel'><a href='javascript:;'></a></div><div class='bldgName'>"
							+ x.type + "</div><div class='bldgListID'>"
							+ x.lotNum + "</div><div class='bldgTicksToFinish'>"
							+ (ticksTotal - x.ticksToFinish) + "</div></li>";
			});
		});
		$("#town_bldgBldgsList").html(list+"</ul>");
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
		$("#pos" + lot + "_building").attr("title","Level " + x.lvl + " " + x.type);
		if(lot > 3) {
			var back = "AIFrames/buildings/" + x.path + ".png";
			$("#pos" + lot).removeClass("emptylot locked").addClass("buildlot");
			$("#pos" + lot + "_building").attr({"src":back,"alt":x.type});
		} else if(player.league) {
			$("#pos" + lot + "_building").parent().css("display","none");
		}
		var show = false, image = '';
		if(x.deconstruct) {
			show = true; image = 'destruct';
		} else if(x.lvlUps>0) {
			if(x.lvl==0) {
				image = 'construct';
			} else {
				image = 'upgrade';
			}
			show = true;
		}
		if(lot < 4) {
			if(lot == 0) image+="MM";
			else if(lot == 2) image+="MMP";
			else image+="Large";
		}
		if(show) {
			$("#pos"+lot).append("<img src='AIFrames/buildings/"+image+"Tile.png' class='lvlImage'/>");
		}
	});
	
	$("#town_unlocked").unbind("click").click(function() {
		if(!$(this).hasClass("open")) {
			$("#town_locked").removeClass("open");
			$(this).addClass("open");
			$("#town_notBuildableList").fadeOut(100);
			$("#town_buildableList").fadeIn(100,function() {
				var api = $(this).data('jsp');
				if(!api) {
					$(this).jScrollPane({showArrows:true,hideFocus:true});
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
					$(this).jScrollPane({showArrows:true,hideFocus:true});
				} else {
					api.reinitialise();
				}
			});
		}
	});
	
	$(".bldg").unbind('click').click(function() {
		var index = $(this).index(".bldg");
		if(!$(this).hasClass('locked')) {
			if(!$(this).hasClass('emptylot')) {	//if this isn't an empty lot, display the correct UI
				$.each(player.curtown.bldg, function(i, x) {
					if(index == x.lotNum) {
						BUI.set(x.type, index);
						do_fade(draw_bldg_UI,"amber");
						return false;
					}
				});
			} else if(player.curtown.bldableBldgs) {
				var bldgMenu = $("#town_buildBldgMenu")
				bldgMenu.css("display","none");
				if(index==4) { //Only the Command Center can be built on this lot
					var HTML = '<ul>';
					$.each(bldgs, function(i, v) {
						if(v.type=="Command Center") {
							HTML += "<li><div>" + v.type + "</div><img src='AIFrames/buildings/" + v.path + ".png' title='" 
										+ v.type + "' class='bldgPic' /><div id='town_bldgRes'><div id='town_bldgResMetal'>" + v.cost[0]
										+ "</div><div id='town_bldgResTimber'>"+ v.cost[1] +"</div><div id='town_bldgResManMade'>"+ v.cost[2] 
										+ "</div></div><div class='bldgDesc'>" + v.desc + "</div><a href='javascript:;' class='buildBldgButton"+
										((player.curtown.res[0]<v.cost[0]||player.curtown.res[1]<v.cost[1]||player.curtown.res[2]<v.cost[2])?" noBld":"")+"'></a></li>";
							return false;
						}
					});
					$('#town_buildableList').html(HTML+"</ul>");
					
					HTML = '<ul>';
					$.each(bldgs, function(i, v) {
						if(v.type !="Command Center") {
							HTML += "<li><div>" + v.type + "</div><img src='AIFrames/buildings/" + v.path + ".png' title='" + v.type + "' class='bldgPic' /><div id='town_bldgRes'><div id='town_bldgResMetal'>" + v.cost[0]
										+ "</div><div id='town_bldgResTimber'>"+ v.cost[1] +"</div></div><div id='town_bldgResManMade'>"+ v.cost[2] 
										+ "</div></div><div class='bldgDesc'>" + v.desc + "</div></li>";
						}
					});
					$('#town_notBuildableList').html(HTML+"</ul>");
				} else {
					//Create Unlocked Building List 
					var HTML = '<ul>';
					$.each(player.curtown.bldableBldgs, function(i, v) {
						HTML += "<li"+(v.type=="Command Center"?" class='noShow'":"")+"><div>" + v.type + "</div><img src='AIFrames/buildings/" + v.path 
									+ ".png' title='" + v.type + "' class='bldgPic' /><div id='town_bldgRes'><div id='town_bldgResMetal'>" + v.cost[0]
									+ "</div><div id='town_bldgResTimber'>"+ v.cost[1] +"</div><div id='town_bldgResManMade'>"+ v.cost[2] 
									+ "</div></div><div class='bldgDesc'>" + v.desc + "</div><a href='javascript:;' class='buildBldgButton"+
									((player.curtown.res[0]<v.cost[0]||player.curtown.res[1]<v.cost[1]||player.curtown.res[2]<v.cost[2])?" noBld":"")+"'></a></li>";
					});
					$('#town_buildableList').html(HTML+"</ul>");
					
					//Create Locked Building List
					HTML = '<ul>';
					$.each(player.curtown.lockedBldgs, function(i, v) {
						HTML += "<li"+(v.type=="Command Center"?" class='noShow'":"")+"><div>" + v.type + "</div><img src='AIFrames/buildings/" + v.path 
									+ ".png' title='" + v.type + "' class='bldgPic' /><div id='town_bldgRes'><div id='town_bldgResMetal'>" + v.cost[0]
									+ "</div><div id='town_bldgResTimber'>"+ v.cost[1] +"</div><div id='town_bldgResManMade'>"+ v.cost[2] 
									+ "</div></div><div class='bldgDesc'>" + v.desc + "</div></li>";
					});
					$('#town_notBuildableList').html(HTML+"</ul>");
				}
				
				bldgMenu.css("display","").animate({"left":"0px"}, "normal");
				
				$(".bldgDesc").each(function(i,v) {
					$(this).jScrollPane({showArrows:true,hideFocus:true});
				});
				
				$("#town_unlocked").click();
					
				$("#town_closeBldgList").unbind('click').click(function() {
					bldgMenu.animate({"left":"-802px"},"normal");
				});
				
				$(".buildBldgButton").click(function() {
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
}

function town_list() {
	$("#citydropdown").unbind('click'); //so that we don't run into problems if the user clicks the arrow again
	var list = $("#townlist");
	var HTML = "<ul id='list' class='darkFrameBody'>";
	
	var numCols = Math.ceil(player.towns.length/10);
	$.each(player.towns, function(i, x) { //build the actual town list
		if(i % numCols == 0) {
			HTML += "<li class='firstcol'>";
		} else {
			HTML += "<li>";
		}
		HTML += "<a href='javascript:;'>" + (x.townID == player.capitaltid ? "&#171;" + x.townName + "&#187;": x.townName) + "</a><span>" + x.townID + "</span></li>";
	});
	
	HTML += "</ul>\
			<div class='darkFrameBL-BR-B'>\
				<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
			</div>";
	//set the display parameters
	list.html(HTML);
	if(numCols > 1) { //if we have more then one column, we should only have to set the height property to 500
		$("#list").css("height","500px");
	} else { //otherwise, we have to set the height based on the number of towns
		$("#list").css("height", (50*player.towns.length) + "px");
	}
	$("#list").css("width", (numCols * 140) + "px");
	
	list.fadeIn();
	
	$("#list a").unbind('click').click(function() {
		var that = $(this);
		player.curtown = $.grep(player.towns, function(v) { //set curtown to the selected town
				return (that.siblings("span").text() == v.townID);
			})[0]; //we don't want an array since we only have one object.
		$("#townlist").fadeOut();
		$("body").unbind('click');
		that.unbind('click');
		BUI.build();
		clearInterval(BUI.active.timer);
		get_buildable();
		display_res();
		build_raid_list();
		show_town($("#window"));
		
		$("#citydropdown").unbind('click').click(function() { //reset the dropdown click event
			town_list();
		});
	});
	setTimeout(function() { //we use setTimeout so that this doesn't get set while the user clicks
		$("body").unbind('click').click(function() { //this allows the user to click anywhere to dismiss the box
			$("#townlist").fadeOut();
			$("#list a").unbind('click');
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