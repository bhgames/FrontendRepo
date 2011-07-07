	/*******************************************************************\
	*					World Map JS.									*
	*																	*
	*	Written By: Chris Hall											*
	*																	*
	*		The code here gets, displays, and navigates the map.		*
	*		In addition, it controls the display of town information	*
	*			on the map.												*
	\*******************************************************************/
/**************************************************************************************************************\
*************************************************Map Object*****************************************************
\**************************************************************************************************************/
var map = {
			origHTML : "<div id='townMenuPopup'>\
							</div>\
							<div id='mapHelpButton' class='pplHelp'></div>\
							<div id='mapAirshipToggle'></div>\
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
							<div id='mapbox'></div>",
			box : {},
			territoryHTML : $(document.createElement('div')).attr("id","map_territories"),
			tilesWide : 0,
			rightX : 0,
			bottomY : 0
		};
/**************************************************************************************************************\
*************************************************Map Functions**************************************************
\**************************************************************************************************************/
var gettingMap = false;
function get_map() {
	try {
		if(!gettingMap) {
			gettingMap = true;
			display_output(false,"Loading Worldmap...");
			var mapget = new make_AJAX();
			
			mapget.callback = function(response) {
				$.extend(map, $.parseJSON(response));
				if(map.towns.length < 1) {
					display_output(true,"Error Loading Worldmap!",true);
					display_output(false,"Retrying...");
					throw "No Towns";
				}
				var maxX = 0, maxY = 0;
				$.each(map.tiles, function(i, v) {
					//map.leftX = map.rightX.max(v.centerx-4);
					map.rightX = map.rightX.min(v.centerx+4);
					map.bottomY = map.bottomY.max(v.centery-4);
					//map.topY = map.bottomY.min(v.centery+4);
					
					maxX = maxX.min(Math.abs(v.centerx));
					maxY = maxY.min(Math.abs(v.centery));
				});
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
					map.tilesWide = Math.max(map.tilesWide,temp[j].length);
					if(temp[j].length>0) j++;
				}
				map.tiles = temp;
				map.x = 0;
				map.y = 0;
							
				$("#wm").unbind('click').click(function() {
					map.focus = false;
					do_fade(build_map, "amber");
				});
				build_territories();
				gettingMap = false;
				display_output(false,"Worldmap Loaded!");
			};
			
			mapget.get("/AIWars/GodGenerator?reqtype=world_map&league="+player.league);
		}
	} catch(e) {
		display_output(true,"Error loading World Map!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_map();
	}
}

function build_map() { 
	currUI = build_map;
	
	//do update checks
	if(map.update) get_map();
	
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
		var id = $(this).attr("id");
		switch(id) {
			case "mapTileUp":
			case "mapTileDown":
				var mod = (id.match(/D/)?-35:35);
				$("#tileBox").css("top",function(i,v){
											var newV = parseInt(v)+mod;
											return newV.clamp((map.tiles.length-3)*-35,0)+"px";
										});
				break;
			case "mapTileLeft":
			case "mapTileRight":
				var mod = (id.match(/R/)?-40:40);
				$("#tileBox").css("left",function(i,v){
											var newV = parseInt(v)+mod;
											return newV.clamp((map.tilesWide-3)*-40,0)+"px";
										});
				break;
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
	
	$("#mapAirshipToggle").unbind("click").click(function() {
		if($(this).hasClass("active")) {
			$(this).removeClass("active");
			map.box.id.removeClass("airshipMode");
		} else {
			$(this).addClass("active");
			map.box.id.addClass("airshipMode");
		}
	});
	
	$("#mapHelpButton").unbind("click").click(WM_tut);

}
	
function city_hover(city, box) {
	var display = setTimeout( function() {
		var town = map.towns[city.attr("index")];
		
		box.html(function() {
			var HTML = "Player:<ul>" + town.owner + "</ul><br/>Town:<ul>" +(town.capital?"&#171;" + town.townName + "&#187;":town.townName)
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
	var index=city.attr("index");
	var town = map.towns[index];
	//build our popup text	
	box.children().unbind().die();
	box.animate({"height":"0px","width":"0px","opacity":"0"},250,function() {
		box.html(	"<div id='townMenu_content'><div class='darkFrameBody'><span id='ownerText'>"
					+ town.owner + "'s city " + town.townName + "</span><span id='townIndex'>" 
					+ index +"</span><a href='javascript:;' id='sendMission'>Send Mission</a>"
					+ (player.curtown.zeppelin?"<a href='javascript:;' id='moveTo'>Move To</a>":"")
					+ "<a href='javascript:;' id='sendTrade'>Send Trade</a>"
					+ (town.owner == player.username?"<a href='javascript:;' id='viewCity'>View City</a>":"<br/>")
					+ "<a href='javascript:;' id='close'>Close</a></div><div class='darkFrameBL-BR-B'><div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div></div></div>");
		
		box.css({"bottom":(parseInt(city.css("bottom")) + 20) + "px"});
		
		if(parseInt(city.css("right")) < 350) {
			box.css({"right":(parseInt(city.css("right"))+22) + "px","left":""});
			$("#townMenu_content").css({"right":"0px","left":""});
		} else {
			box.css({"left":(750-parseInt(city.css("right"))) + "px","right":""});
			$("#townMenu_content").css({"right":"","left":"0px"});
		}
		
		box.animate({"height":"110px","width":"300px","opacity":"1"},250);
		
		$("#viewCity").unbind('click').click(function() {
			player.curtown = $.grep(player.towns, function(v) {
					return map.towns[$("#townIndex").text()].townName == v.townName;
				})[0];
			show_town($("#window"));
		});
		$("#sendMission,#moveTo").unbind('click').click(function() {
			var town = map.towns[$("#townIndex").text()];
			var that = this;
			BUI.CC.x = town.x;
			BUI.CC.y = town.y;
			$.each(player.curtown.bldg, function(i, x) {
				if(x.type == "Command Center") {
					BUI.set(x.type, x.lotNum);
					do_fade(draw_bldg_UI);
					BUI.CC.startTab = $(that).is("#moveTo")?"control":"send";
					return false;
				}
			});
		});
		$("#sendTrade").unbind('click').click(function() {
			var town = map.towns[$("#townIndex").text()];
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
		var mapTile = map.tiles[tile[0]][tile[1]], townInfo = $("#towninfo"),
			WIDTH = 65, HEIGHT = 36; //width and height of a town
		map.x = mapTile.centerx;
		map.y = mapTile.centery;
		map.HTML = "<div id='towninfo'>"
					+ (townInfo.length>0 ? townInfo.html() :
						"<div class='darkFrameBody'>\
						</div>\
						<div class='darkFrameBL'><div class='darkFrameB'></div></div>")
					+"</div>\
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
			var type = x.y==0 ? x.x : Math.abs(x.x%x.y);
			map.HTML += "<div class='town "+(x.zeppelin?"airship":"type"+((type%2)+1)+(x.owner=="Id"?" idTown":(x.owner==player.username?" playerTown":"")));
			if(x.dig) map.HTML += " missionC";
			$.each(player.raids, function(j, y) {
				if(y.defendingTown == x.townName && !y.raidOver) {
					if(!y.raidType.match(/support|dig/i)) {
						map.HTML += " missionE";
					} else {
						map.HTML += " missionF";
					}
				}
			});
			
			var bottom = Math.round((x.y-(map.y-4.5))*HEIGHT) /*+ (x.zeppelin?141:156)*/;
			var right = (((map.x+4)-x.x)*WIDTH) /*+ (x.zeppelin?223:257)*/;
			map.HTML +="' index='"+i+"' style='bottom:" + bottom + "px; right:" + right + "px;'><div class='inc'></div></div>";
		});
		map.box.id.html(map.HTML).css("background-image","url(AIFrames/WM/"+mapTile.mapName+(mapTile.irradiated?"2":"")+".png)").append(map.territoryHTML.clone()).fadeIn();
		$("#map_territories").css({"bottom":Math.round((map.bottomY-(map.y-4.5))*HEIGHT)+"px","right":(((map.x+4)-map.rightX)*WIDTH)+"px"});
		$(".airship").each(float_airship);
	});
}

function float_airship(i,airship) {
	$(airship).animate({"bottom":"+=5"},"slow", function() {
		$(this).animate({"bottom":"-=5"},"slow",float_airship(this));
	});
}

function build_territories() {
	
	if(Modernizr.webworkers) {
		if(!map.territoryBldr) {
			map.territoryBldr = new Worker('/light/javascripts/territoryWorker.js');
			
			map.territoryBldr.onmessage = 	function(e) {
												var mess = e.data;
												if(!mess.error) {
													map.territoryHTML.html(mess.data);
												} else {
													log(mess.data);
												}
											};
		}
		
		map.territoryBldr.postMessage({"territories":map.territories, "rightX":map.rightX, "bottomY":map.bottomY});
		
	} else {
		var i = 0,
			WIDTH = 65, HEIGHT = 36; //width and height of a town
		map.territoryBldr = setInterval(function() {
			if(i == map.territories.length) {
				clearInterval(map.territoryBldr);
				return false;
			}
			
			var territory = map.territories[i++], bottom = 0, right = 0;
			var HTML = "<div class='territoryBox' index='"+i+"' style='bottom:"+((territory.start[1]-map.bottomY)*HEIGHT)+"px; right:"
						+((map.rightX-territory.start[0])*WIDTH)+"px;'>";
			
			$.each(territory.sides, function(j,v) {
				HTML += "<div class='territory ";
				if(j%2) { //y shift
					bottom += (HEIGHT*v);
					HTML += "vert' style='height: "+(HEIGHT*Math.abs(v))+"px; width: "+WIDTH+"px; bottom: "+(v>0?bottom-(HEIGHT*v):bottom)+ "px; right: "+right+"px;";
				} else { //x shift
					right -= (WIDTH*v);
					HTML += "horz' style='height: "+HEIGHT+"px; width: "+(WIDTH*Math.abs(v))+"px; bottom: "+bottom+"px; right: "+(v<0?right+(WIDTH*v):right)+"px;";
				}
				HTML += "'></div>";
			});
			map.territoryHTML.append(HTML + "</div>");
		}, 100);
	}
}