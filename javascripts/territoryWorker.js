onmessage = function(e) {
				postMessage({"type":"status","data":"Starting..."});
				var mess = e.data, territories = mess.territories, rightX = mess.rightX, bottomY = mess.bottomY;
				var WIDTH = 65, HEIGHT = 55;
								
				for(var i =0;i<territories.length;i++) {
					postMessage({"type":"status","data":"parsing territory "+i});
					var terr = territories[i],
						curY = (-bottomY-terr.start[1])*HEIGHT, curX = (terr.start[0]+rightX)*WIDTH,
						borderColor = "", lastColor = "f", colorParts = terr.owner.match(/([0-9]|[a-f]){1}/ig) || "";
					for(var j = 0;j<colorParts.length;j++) {
						borderColor += lastColor = colorParts[j];
						if(borderColor.length==6) {
							break;
						}						
					}
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
					
					postMessage({"type":"setStyle","data":["#"+borderColor.join(""),"rgba("+RGB[0]+","+RGB[1]+","+RGB[2]+",0.2)"]});
					
					postMessage({"type":"beginPath","data":[curX,curY]});
					
					for(var k = 0;k<terr.sides.length;k++) {
						var side = terr.sides[k];
						if(k%2) { //y shift
							curY += side*-HEIGHT;
						} else { //x shift
							curX += side*WIDTH;
						}
						postMessage({"type":"lineTo","data":[curX,curY]});
					}
					
					postMessage({"type":"endPath"});
				}
				postMessage({"type":"status","data":"Finished parsing."});
			};