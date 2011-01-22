	/********************************************************************\
	*					World Map JS.						*
	*													*
	*	Written By: Chris Hall									*
	*													*
	*		The code here gets, displays, and navigates the map.			*
	*		In addition, it controls the display of town information 			*
	*			on the map.									*
	\********************************************************************/
/**************************************************************************************************************\
*************************************************Map Object*****************************************************
\**************************************************************************************************************/
var map = {};

/**************************************************************************************************************\
*************************************************Map Functions**************************************************
\**************************************************************************************************************/

function get_map() {
	try {
		display_output(false,"Loading Worldmap...");
		var mapget = new make_AJAX();
		
		mapget.callback = function(response) {
			map = $.parseJSON(response);
			if(map.towns.length < 1) {
				display_output(true,"Error Loading Worldmap!",true);
				display_output(false,"Retrying...");
				throw "No Towns";
			}
			var maxX = 0;
			var maxY = 0;
			$.each(map.tiles, function(i, v) {
				if(Math.abs(v.centerx) > maxX) maxX = Math.abs(v.centerx);
				if(Math.abs(v.centery) > maxY) maxY = Math.abs(v.centery);
			});
			map.tilesWide = 0;
			var j = 0;
			var temp = [];
			for(var y = maxY;y >= (-maxY);y -= 9) {
				temp[j] = [];
				for(var x = (-maxX);x <= maxX;x += 9) {
					$.each(map.tiles, function(i, v) {
						if(v.centerx == x && v.centery == y) {
							temp[j].push(v);
							return false;
						}
					});
				}
				if(temp[j].length>map.tilesWide) map.tilesWide = temp[j].length
				j++;
			}
			map.tiles = temp;
			map.x = 0;
			map.y = 0;
			
			map.origHTML = "<div id='townMenuPopup'>\
							</div>\
							<div id='mapHelpButton' class='pplHelp'></div>\
							<div id='mapTileSwitchBox'>\
								<div id='mapTileSwitchButton'></div>\
								<div id='mapTileSwitcher'>\
									<div class='lightFrameBody'>\
										<div id='mapTileUp' class='tileDir'></div>\
										<div id='mapTileDown' class='tileDir'></div>\
										<div id='mapTileLeft' class='tileDir'></div>\
										<div id='mapTileRight' class='tileDir'></div>\
										<div id='mapTileDisplay'></div>\
									</div>\
									<div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
								</div>\
							</div>\
							<div id='mapbox'></div>";
			map.box = {};
						
			$("#wm").unbind('click').click(function() {
				map.focus = false;
				do_fade(build_map, "amber");
			});
			display_output(false,"Worldmap Loaded!");
		};
		
		mapget.get("/AIWars/GodGenerator?reqtype=world_map&league="+player.league);
	} catch(e) {
		display_output(true,"Error loading World Map!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_map();
	}
}

function build_map() { 
	currUI = build_map;
	$("#window").html(map.origHTML);
	map.box.id = $("#mapbox");
	
	var x = player.curtown.x;
	var y = player.curtown.y;
	if(map.focus) {
		x = map.focusX;
		y = map.focusY;
	}
	var nearX = 9999999999;
	var nearY = 9999999999;
	var tile = [0,0];
	var tileHTML = "<div id='tileBox'>";
	$.each(map.tiles, function(i,v){
		$.each(v, function(j,w) {
			var disX = Math.abs(x - w.centerx);
			var disY = Math.abs(y - w.centery);
			if(disX<=nearX && disY<=nearY) {
				tile = [i,j];
				nearX = disX;
				nearY = disY;
			}
			tileHTML += "<div class='maptile "+w.mapName+"' style='top:"+(i*35)+"px;left:"+(j*40)+"px;'>"+w.centerx+", "+w.centery+"</div>";
		});
	});
	var activeTile = 0;
	$.each(map.tiles, function(i,v){
		if(i<tile[0]) activeTile+=v.length;
		else return false;
	});
	rebuild(tile);
	$("#window").fadeIn("fast");
	$("#mapTileDisplay").html(tileHTML+"</div>");
	
	city_hover($(".playerTown"),$("#towninfo .darkFrameBody"));
	
	$(".town").die('click').live('click',function() {
		city_select($(this), $("#townMenuPopup"));
	}).die('mouseover').live('mouseover',function() {
		city_hover($(this), $("#towninfo .darkFrameBody"));
	});
	
	$("#mapTileSwitchButton").unbind("click").click(function() {
		$("#mapTileSwitcher").animate({"opacity":"toggle"},"fast");
		
		if($(this).hasClass("active")) $(this).removeClass("active");
		else $(this).addClass("active");
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
										if(-newV>(map.tiles.length-3)*35) return v;
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
										if(-newV>(map.tilesWide-3)*40) return v;
										return newV+"px";
									});
			return true;
		}
	});
	
	$(".maptile").unbind("click").click(function(){
		var index = $(this).index(".maptile");
		var tile = [];
		$.each(map.tiles, function(i,v) {
			if(v.length <= index) index-=v.length
			else {
				tile = [i,index];
				return false;
			}
		});
		$(this).addClass("active").siblings(".maptile").removeClass("active");
		rebuild(tile);
	}).each(function(i,v){
		if(i==(activeTile+tile[1])) {
			$(v).addClass("active");
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
			return false;
		}
	});
	
	$("#mapHelpButton").unbind("click").click(function(){
		var message = "Are you sure you want to play the World Map Tutorial?";
		display_message("World Map Tutorial",message,
				function() {
					tutorialRunning = true;
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
	});

	
}
	
function city_hover(city, box) {
	var display = setTimeout( function() {
		var town = map.displayedTowns[city.index(".town")];
		
		box.html(function() {
			var HTML = "Player:<ul>" + town.owner + "</ul><br/>Town:<ul>" + town.townName
							+ "</ul><br/>AI Status: " +(town.aiActive?"Active":"Inactive")
							+ "<br/><br/>Coordinates:<ul>" + town.x + ", " + town.y
							+ "</ul><br/>Scout Size Limit:<ul>" + town.SSL
							+ "</ul><br/>Production Modifiers:<ul style='text-align: right;margin-right:30px;'>";
							
				$.each(town.resEffects, function(i, v) {
					if(i < 4) {
						switch(i) {
							case 0:
								HTML += "Metal: ";
								break;
							case 1:
								HTML += "<br/>Timber: ";
								break;
							case 2:
								HTML += "<br/>Man. Mat.: ";
								break;
							case 3:
								HTML += "<br/>Food: ";
								break;
						}
						
						HTML += Math.round(v*100) + "%";
					}
				});
				$.each(town.debris, function(i,v) {
					if(i<4) {
						if(v>0) {
							if(!HTML.match(/debris/i)) HTML+="</ul><br/>Debris:<br/><ul style='text-align: right;margin-right:10px;'>";
							else HTML+="<br/>";
							switch(i) {
								case 0:
									HTML += "Metal: ";
									break;
								case 1:
									HTML += "Timber: ";
									break;
								case 2:
									HTML += "Man. Mat.: ";
									break;
								case 3:
									HTML += "Food: ";
									break;
							}
							HTML += v;
						}
					}
				});
				
			HTML += "</ul><br/>Last Report:<div style='border: 1px solid #FFF;'>";
			var cityFind = new RegExp(town.townName.replace("(", "\0028").replace(")", "\0029").replace("[","\005B").replace("]","\005D"),"i");
			if(!gettingSRs) {
				$.each(SR.reports, function(i, v) {
					if(cityFind.test(v.Subject)) {
						HTML += "<div style='color: #AAAAAA'>[";
						var createdAt = v.createdAt.replace(/-/g,"/").split(".")[0];
						var sDate = new Date(createdAt);
						var lDate = new Date();
						var rDate = new Date(sDate - (lDate.getTimezoneOffset()*60*1000));
						HTML += rDate.getFullYear() + "-" + ((rDate.getMonth() < 10)?"0"+rDate.getMonth():rDate.getMonth()) + "-" 
								+ ((rDate.getDate() < 10)?"0"+rDate.getDate():rDate.getDate()) + " - " + rDate.toLocaleTimeString() + "]</div>" + v.Subject;
						return false;
					}
				});
			}
			return HTML + "</div>";
		});
	
	}, 250);
	city.unbind('mouseleave').mouseleave(function() {
		clearTimeout(display);
	});
}

function city_select(city, box) {
	var index=city.index(".town");
	var town = map.displayedTowns[index];
	//build our popup text
	var menutext = "<div id='townMenu_content'><div class='darkFrameBody'><span id='ownerText'>"+ town.owner + "'s city " + town.townName + "</span><span id='townIndex'>" + index +"</span><a href='javascript:;' id='sendMission'>Send Mission</a><a href='javascript:;' id='sendTrade'>Send Trade</a>";
	if(town.owner == player.username) {
		menutext += "<a href='javascript:;' id='viewCity'>View City</a>";
	} else {
		menutext += "<br/>";
	}
	menutext += "	<a href='javascript:;' id='close'>Close</a></div><div class='darkFrameBL-BR-B'><div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div></div></div>";
	box.children().unbind().die();
	box.animate({"height":"0px","width":"0px","opacity":"0"},250,function() {
		box.html(menutext);
		
		box.css({"bottom":(parseInt(city.css("bottom")) + 20) + "px"});
		
		if(parseInt(city.css("right")) < 350) {
			box.css({"right":(parseInt(city.css("right"))+22) + "px","left":""});
			$("#townMenu_content").css({"right":"0px","left":""});
		} else {
			box.css({"left":(750-parseInt(city.css("right"))) + "px","right":""});
			$("#townMenu_content").css({"right":"","left":"0px"});
		}
		
		box.animate({"height":"110px","width":"300px","opacity":"1"},250);
		
		$("#viewCity").die('click').live('click', function() {
			player.curtown = $.grep(player.towns, function(v) {
					return map.displayedTowns[$("#townIndex").text()].townName == v.townName;
				})[0];
			show_town($("#window"));
		});
		$("#sendMission").unbind('click').click(function() {
			var town = map.displayedTowns[$("#townIndex").text()];
			BUI.HQ.x = town.x;
			BUI.HQ.y = town.y;
			$.each(player.curtown.bldg, function(i, x) {
				if(x.type == "Headquarters") {
					BUI.set(x.type, x.lotNum);
					do_fade(draw_bldg_UI);
					BUI.HQ.sendMission = true;
					return false;
				}
			});
		});
		$("#sendTrade").unbind('click').click(function() {
			var town = map.displayedTowns[$("#townIndex").text()];
			BUI.TC.DT.x = town.x;
			BUI.TC.DT.y = town.y;
			var lotNum = -1;
			$.each(player.curtown.bldg, function(i, x) {
				if(x.type == "Trade Center") {
					lotNum = x.lotNum;
					BUI.TC.sendTrade = true;
					return false;
				}
			});
			if(lotNum != -1) {
				BUI.set("Trade Center", lotNum);
				do_fade(draw_bldg_UI);
			}
		});
		$("#close").unbind('click').click(function() {
			box = $(this).parents("#townMenuPopup");
				box.animate({"height":"0px","width":"0px","opacity":"0"},250,function() {
					box.html("");
					box.css("bottom","-500px");
				});
			});
	});
}

function rebuild(tile) {
	map.box.id.fadeOut(function() {
		var mapTile = map.tiles[tile[0]][tile[1]];
		map.x = mapTile.centerx;
		map.y = mapTile.centery;
		map.displayedTowns = [];
		map.HTML = "<div id='towninfo'>\
						<div class='darkFrameBody'>\
						</div>\
						<div class='darkFrameBL'><div class='darkFrameB'></div></div>\
					</div>\
					<div id='coordsY' class='darkFrameBody'>";
		for(var i = map.y+4;i>map.y-5;i--) {
			map.HTML += "<div>"+i+"</div>";
		}
		map.HTML +="</div>\
					<div id='coordsX' class='darkFrameBR'><div class='darkFrameB'>";
		for(var i = map.x-4;i<map.x+5;i++) {
			map.HTML += "<div>"+i+"</div>";
		}
		map.HTML +="</div></div>";
		$.each(map.towns, function(i, x) {
			if(Math.abs(x.x-map.x)>4||Math.abs(x.y-map.y)>4) return true;
			map.displayedTowns.push(x);
			var type = Math.abs(x.x+x.y);
			map.HTML += "<div class='town type"+((type%2)+1)+(x.owner=="Id"?" idTown":(x.owner==player.username?" playerTown":""));
			$.each(player.raids, function(j, y) {
				if(y.defendingTown == x.townName && !y.raidOver) {
					if(y.raidType.match(/support/i) == null) {
						map.HTML += " missionE";
					} else {
						map.HTML += " missionF";
					}
				}
			});
			var bottom = ((x.y-map.y)*36) + 156;
			var right = ((map.x-x.x)*65) + 257;
			map.HTML +="' style='bottom:" + bottom + "px; right:" + right + "px;'><div class='inc'></div></div>";
		});
		map.box.id.html(map.HTML).css("background-image","url(AIFrames/WM/"+mapTile.mapName+(mapTile.irradiated?"2":"")+".png)").fadeIn();
	});
}