onmessage = function(e) {
				try {
					var mess = e.data;
					var WIDTH = 65, HEIGHT = 36, HTML = "";
					for(var i =0;i<mess.territories.length;i++) {
					
						var territory = mess.territories[i], bottom = 0, right = 0;
						var HTML = "<div class='territoryBox' index='"+i+"' style='bottom:"+((territory.start[1]-mess.bottomY)*HEIGHT)+"px; right:"
									+((mess.rightX-territory.start[0])*WIDTH)+"px;'>";
						
						for(var j = 0;j<territory.sides.length;j++) {
							var v = territory.sides[j];
							HTML += "<div class='territory ";
							if(j%2) { //y shift
								bottom += (HEIGHT*v);
								HTML += "vert' style='height: "+(HEIGHT*Math.abs(v))+"px; width: "+WIDTH+"px; bottom: "+(v>0?bottom-(HEIGHT*v):bottom)+ "px; right: "+right+"px;";
							} else { //x shift
								right -= (WIDTH*v);
								HTML += "horz' style='height: "+HEIGHT+"px; width: "+(WIDTH*Math.abs(v))+"px; bottom: "+bottom+"px; right: "+(v<0?right+(WIDTH*v):right)+"px;";
							}
							HTML += "'></div>";
						}
						HTML += "</div>";
					}
					postMessage({"error":false,"data":HTML});
				} catch(err) {
					postMessage({"error":true,"data":err});
				}
			};