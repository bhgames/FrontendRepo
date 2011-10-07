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
							<span id='townIndex'></span>\
							<div id='sendMission'>send mission</div>\
							<div id='moveTo'>move to</div>\
							<div id='sendTrade'>send trade</div>\
							<div id='viewCity'>view city</div>\
							<div id='close'>close</div>\
						</div>\
						<div id='mapHelpButton'></div>\
						<div id='mapAirshipToggle'></div>\
						<div id='mapTileSwitchBox'>\
							<div id='mapTileSwitchButton'></div>\
							<div id='mapTileSwitcher'>\
								<div id='mapTileUp' class='tileDir'></div>\
								<div id='mapTileDown' class='tileDir'></div>\
								<div id='mapTileLeft' class='tileDir'></div>\
								<div id='mapTileRight' class='tileDir'></div>\
								<div id='mapTileDisplay'></div>\
							</div>\
						</div>\
						<div id='mapbox'></div>",
			box : {},
			territoryCanvas : $("<canvas></canvas>",{"id":"map_territories"})[0],
			tilesWide : 0,
			rightX : 0,
			bottomY : 0,
			working : false
		};
/**************************************************************************************************************\
*************************************************Map Functions**************************************************
\**************************************************************************************************************/
function get_map(data) {
	try {
		if(data) {
			$.extend(map, $.parseJSON(data));
			if(map.towns.length < 1) throw "No Towns";
			if(map.territories.length < 1) throw "No Territories";
			if(map.tiles.length < 1) throw "No Tiles";
			
			var numAss = 0;
			$.each(map.towns,function(i,x) {
				//hack tile type into player towns
				if(x.owner == player.username && !x.tileAssigned) {
					$.each(player.towns,function(j,v) {
						if(v.townName == x.townName) {
							var mapTile = $.grep(map.tiles, function(k,w) {
												return Math.abs(k.centerx-v.x) < 5 && Math.abs(k.centery-v.y) < 5;
											})[0];
							v.tile = mapTile.mapName;
							x.tileAssigned = true;
							numAss++;
							return false;
						}
					});
					return numAss < player.towns.length;
				}
			});
			
			$("body").trigger("tileReady");
			
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
				do_fade(build_map,$(this));
			});
			build_territories();
			map.working = false;
			display_output(false,"Worldmap Loaded!");
			
		} else if(!map.working) {
		
			map.working = true;
			display_output(false,"Loading Worldmap...");
			var mapget = new make_AJAX();
			
			mapget.callback = function(response) {
				get_map(response);
			};
			
			mapget.get("reqtype=world_map&league="+player.league);
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
	$("#viewerback").html("<div id='towninfo'></div>\
							<div id='coordsY'>\
								<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>\
							</div>\
							<div id='coordsX'>\
								<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>\
							</div>");
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
			tileHTML += "<div class='maptile "+w.mapName+"-"+Math.floor((Math.abs(w.centery==0 ? w.centerx : w.centerx/w.centery)%3)+1)+(w.irradiated?"-irradiated":"")+"' style='top:"+(i*35)+"px;left:"+(j*40)+"px;'>"+w.centerx+", "+w.centery+"</div>";
		});
	});
	var activeTile = 0;
	$.each(map.tiles, function(i,v){
		if(i<tile[0]) activeTile+=v.length;
		else return false;
	});
	rebuild(tile);
	$("#mapTileDisplay").html(tileHTML+"</div>");
	$("#window").fadeIn("fast");
	
	city_hover($(".playerTown"),$("#towninfo"));
	
	$(".town").die('click').live('click',function() {
		city_select($(this), $("#townMenuPopup"));
	}).die('mouseover').live('mouseover',function() {
		city_hover($(this), $("#towninfo"));
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
			if(v.length <= index) index-=v.length;
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
											
											return (tile[0]-1)*-35;
										},
								"left":function(){
											if(tile[1]<2) return 0;
											
											return (tile[1]-1)*-40;
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
		var town = map.towns[city.attr("index")],
			townName = town.townName;
		
		townName = (townName.match(/outcropping/i) ? townName.split("-")[0] : townName);
		
		box.html(function() {
			var HTML = "<span id='WM_owner'>" + town.owner + "</span><span id='WM_townName'>" +(town.capital?"&#171;" + townName + "&#187;": townName)
							+ "</span><span id='WM_AIActive'>" +(town.aiActive?"Active":"Inactive")
							+ "</span><span id='WM_coords'>" + town.x + ", " + town.y
							+ "</span><span id='WM_SSL'>" + town.SSL
							+ "</span><span id='WM_prodMod'>";
							
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
								HTML += "<br/>Crystal: ";
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
							if(!HTML.match(/debris/i)) HTML+="</span><span id='WM_debris>";
							else HTML+="<br/>";
							switch(i) {
								case 0:
									HTML += "Metal: ";
									break;
								case 1:
									HTML += "Timber: ";
									break;
								case 2:
									HTML += "Crystal: ";
									break;
								case 3:
									HTML += "Food: ";
									break;
							}
							HTML += v;
						}
					}
				});
				
			HTML += "</span>"/*<br/>Last Report:<div style='border: 1px solid #FFF;'>";
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
			}*/
			return HTML + "</div>";
		});
	
	}, 250);
	city.unbind('mouseleave').mouseleave(function() {
		clearTimeout(display);
		$(this).unbind("mouseleave");
	});
}

function city_select(city, box) {
	var index=city.attr("index");
	var town = map.towns[index];
	//build our popup text	
	box.children().unbind().die();
	box.animate({"height":"0px"},250,function() {
		
		$("#townIndex").text(index);
		
		if(!player.curtown.zeppelin) {
			$('#moveTo').addClass("noZep");
		} else {
			$('#moveTo').removeClass("noZep");
		}
		
		if(town.owner != player.username) {
			$('#viewCity').addClass("notMine");
		} else {
			$('#viewCity').removeClass("notMine");
		}
		
		if(town.townName.match(/outcrop/i)) {
			$("#sendTrade").addClass("noTrade");
		} else {
			$("#sendTrade").removeClass("noTrade");
		}
		
		var cityBottom = parseInt(city.css("bottom")), 
			cityRight = parseInt(city.css("right"));
		
		if(cityBottom > 300) {
			box.css({"top":(470-cityBottom + 20) + "px","bottom":""});
		} else {
			box.css({"top":"","bottom":(cityBottom + 20) + "px"});
		}
		if(cityRight < 350) {
			box.css({"right":(cityRight) + "px","left":""});
		} else {
			box.css({"left":(750-cityRight) + "px","right":""});
		}
		
		box.css("display","block").animate({"height":"195px"},250);
		
		$("#viewCity").unbind('click').click(function() {
			if(!$(this).hasClass("notMine")) {
				player.curtown = $.grep(player.towns, function(v) {
						return map.towns[$("#townIndex").text()].townName == v.townName;
					})[0];
				show_town($("#window"));
			}
		});
		$("#sendMission,#moveTo").unbind('click').click(function() {
			if(!$(this).hasClass("noZep")) {
				var town = map.towns[$("#townIndex").text()];
				var that = this;
				BUI.CC.x = town.x;
				BUI.CC.y = town.y;
				$.each(player.curtown.bldg, function(i, x) {
					if(x.type == "Command Center") {
						BUI.set(x.type, x.lotNum);
						BUI.CC.startTab = $(that).is("#moveTo")?"control":"send";
						do_fade(draw_bldg_UI);
						return false;
					}
				});
			}
		});
		$("#sendTrade").unbind('click').click(function() {
			if(!$(this).hasClass("noTrade")) {
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
			}
		});
		$("#close").unbind('click').click(function() {
			box = $(this).parents("#townMenuPopup");
				box.animate({"height":"0px"},250,function() {
					box.css("bottom","-500px");
				}).css("display","none");
			});
	});
}

function rebuild(tile) {
	var vb = $("#viewerback");
	vb.fadeOut();
	map.box.id.fadeOut(function() {
		var mapTile = map.tiles[tile[0]][tile[1]],
			WIDTH = 65, HEIGHT = 55; //width and height of a town
		map.x = mapTile.centerx;
		map.y = mapTile.centery;
		map.HTML = "";
		var coordMod = 4;
		$("#coordsY div").each(function(i,v) {
			$(this).html(map.y+coordMod);
			coordMod--;
		});
		coordMod = -4;
		$("#coordsX div").each(function(i,v) {
			$(this).html(map.x+coordMod);
			coordMod++;
		});
		
		$.each(map.towns, function(i, x) {
			//if the town is outside the current tile, we don't want to render it
			if(Math.abs(x.x-map.x)>4||Math.abs(x.y-map.y)>4) return true;
			
			var type = x.y==0 ? x.x : Math.abs(x.x%x.y);
			map.HTML += "<div class='town ";
			if(x.zeppelin) {
				map.HTML += "airship";
			} else if(x.owner==player.username) {
				map.HTML += "playerTown";
			} else if(x.owner=="Id") {
				switch(true) {
					case x.townName.search(/timber/i)==0:
						map.HTML += "timberO";
						break;
					case x.townName.search(/metal/i)==0:
						map.HTML += "metalO";
						break;
					case x.townName.search(/crystal/i)==0:
						map.HTML += "crystalO";
						break;
					default:
						map.HTML += "idTown";
				}
			}
			if(x.dig) map.HTML += " missionC";
			$.each(player.raids, function(j, y) {
				if(y.defendingTown == x.townName && !y.raidOver) {
					if(!y.raidType.match(/support|dig|excavation/i)) {
						map.HTML += " missionE";
					} else {
						map.HTML += " missionF";
					}
				}
			});
			
			var bottom = Math.round((x.y-(map.y-4.25))*HEIGHT) /*+ (x.zeppelin?141:156)*/;
			var right = (((map.x+4.85)-x.x)*WIDTH) /*+ (x.zeppelin?223:257)*/;
			map.HTML +="' index='"+i+"' style='bottom:" + bottom + "px; right:" + right + "px;'><div class='inc'></div></div>";
			
		});
		
		vb.css({"background-image":"url(SPFrames/WM/"+mapTile.mapName+"-"+Math.floor((Math.abs(mapTile.centery==0 ? mapTile.centerx : mapTile.centerx/mapTile.centery)%3)+1)+(mapTile.irradiated?"-irradiated":"")
				+".jpg)","background-color":""}).append(map.territoryCanvas).fadeIn();
		
		map.box.id.html(map.HTML).fadeIn();
										
		$("#map_territories").css({"bottom":Math.round((map.bottomY-(map.y-4.4))*HEIGHT)+"px","right":(((map.x+5.41)-map.rightX)*WIDTH)+"px"});
		$(".airship").each(float_airship);
		$("body").trigger("menuFire.WM",mapTile);
	});
}

function float_airship(i,airship) {
	$(airship).animate({"bottom":"+=5"},"slow", function() {
		$(this).animate({"bottom":"-=5"},"slow",float_airship(this));
	});
}

function build_territories() {
	var canvas = map.territoryCanvas, ctx = canvas.getContext("2d");
		WIDTH = 65, HEIGHT = 55; //width and height of a town
	
	canvas.width = Math.abs(map.rightX*2)*WIDTH;
	canvas.height = Math.abs(map.bottomY*2)*HEIGHT;
	
	ctx.lineJoin = 'round';
	ctx.lineWidth = 2;
	if(Modernizr.webworkers) {
		if(!map.territoryBldr) {
			map.territoryBldr = new Worker('/client/javascripts/territoryWorker.js?_=25'); //increment number if the worker is updated to get around caching
																							//don't forget to update the fallback script below too!!!
			map.territoryBldr.onmessage = 	function(e) {
												var mess = e.data;
												switch(mess.type) {
													case "status":
														//log(mess.data);
														break;
													case "setStyle":
														ctx.strokeStyle = mess.data[0];
														ctx.fillStyle = mess.data[1];
														break;
													case "beginPath":
														ctx.beginPath();
														ctx.moveTo(mess.data[0],mess.data[1]);
														//log("moving start point to "+mess.data[0]+","+mess.data[1]);
														break;
													case "lineTo":
														ctx.lineTo(mess.data[0],mess.data[1]);
														break;
													case "endPath":
														ctx.stroke();
														ctx.fill();
														break;
												}
											};
			map.territoryBldr.onerror =	function(e) {
											log(e,"web worker error: territoryBuilder");
										}
		}
		
		map.territoryBldr.postMessage({"territories":map.territories, "rightX":map.rightX, "bottomY":map.bottomY});
		
	} else {
		var i = 0;
		
		map.territoryBldr = setInterval(function() {
			if(i == map.territories.length) {
				clearInterval(map.territoryBldr);
				return false;
			}
			
			var terr = map.territories[i++],
				curY = (-map.bottomY-terr.start[1])*HEIGHT, curX = (terr.start[0]+map.rightX)*WIDTH,
				borderColor = "", lastColor = "f", colorParts = terr.owner.match(/([0-9]|[a-f]){1}/ig) || "";
				
			$.each(colorParts, function(j,v) {
				borderColor += lastColor = v;
				
				if(borderColor.length>6) {
					return false;
				}
			});
			while(borderColor.length<3||(borderColor.length>3&&borderColor.length<6)) {
				borderColor += lastColor;
			}
			//convert Hex values to RGB values
			if(borderColor.length == 3) {
				borderColor = borderColor.split("");
				borderColor[0] += borderColor[0];
				borderColor[1] += borderColor[1];
				borderColor[2] += borderColor[2];
			} else {
				borderColor = borderColor.match(/.{2}/ig);
			}
			var RGB = [parseInt(borderColor[0],16),parseInt(borderColor[1],16),parseInt(borderColor[2],16)];
			
			ctx.strokeStyle = "#"+borderColor.join("");
			ctx.fillStyle = "rgba("+RGB[0]+","+RGB[1]+","+RGB[2]+",0.2)";
			
			ctx.beginPath();
			ctx.moveTo(curX,curY);
			$.each(terr.sides, function(j,side) {
				if(j%2) { //y shift
					curY += side*-HEIGHT;
				} else { //x shift
					curX += side*WIDTH;
				}
				ctx.lineTo(curX,curY);
			});
			ctx.stroke();
			ctx.fill();
		}, 100);
	}
}