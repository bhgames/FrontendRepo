function AF_UI(bldgInfo) {
	//do update check
	$.each(bldgInfo.Queue, function(i,v) {
		if(v.update) {
			load_player(player.league,true,true);
			return false;
		}
	});
	
	var getEffect = new make_AJAX();
	getEffect.callback = function(response) {
		$("#BUI_extras").text(response);
	};
	getEffect.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
					+ ".getAFEffectToString(" + player.curtown.townID + ");");
	
	var list = ["<ul>Build Queue:"]; //begin constructing the build queue
	var time = 0;		//we have to add up the time as we go so the displays are correct
	var slotsUsed = 0;
	$.each(bldgInfo.Queue, function(i, x) {
		switch(player.AU[x.AUtoBuild].popSize) {
			case 1:
				slotsUsed += x.AUNumber;
				break;
			case 5:
			case 20:
				slotsUsed += 10*x.AUNumber;
				break;
			case 10:
				slotsUsed += 40*x.AUNumber;
				break;
		}
		time += x.ticksPerUnit * x.AUNumber;
		if(i == 0) { //if this is the first queue item we display extra info
			list += " (Next unit in: <span class='time'>" + (x.ticksPerUnit - x.currTicks) + "</span>)<hr/>"
			time -= x.currTicks;
		}
		list += "<li><div class='cancelButton'><a href='javascript:;'></a></div>" 
				+ x.AUNumber + " " + player.AU[x.AUtoBuild].name + "<div class='AFtimes'><span class='time'>" + time + "</span></div></li>";
	});
	
	list += "</ul><div id='AF_queueCap'>Available Slots: <span>" + (bldgInfo.cap-slotsUsed) + "</span></div>";
	$("#AF_queueList").html(list); //display the list
	
	$("#AF_AUbar > a").each(function(i, el){	//set up display of AU bar
		$(el).css("left", (55 * i) + "px");
		if(player.AU[i].name == "empty" || player.AU[i].name == "locked") {
			$(el).css("backgroundImage", "url(../images/client/buildings/AF-" + player.AU[i].name + "AU.png)").text(" ");
		} else {
			var path = "url(AIFrames/units/";
			
			switch(player.AU[i].popSize) {	//type isn't stored, we have to derive it
				case 1: //soldier
					path += "soldier";
					break;
				case 5: //tank
					path += "tank";
					break;
				case 10: //juggernaught
					path += "juggernaut";
					break;
				case 20: //bomber
					path += "bomber";
					break;
			}
			path += "renderTHUMB.png)"; //the icons are half sized versions of the full image
			$(el).css("backgroundImage", path).text(player.curtown.au[i]); //set the image and the number of AU
		}
		
		$(el).attr("title", player.AU[i].name); //this sets the tooltip to the name of the AU
		
		if(player.AU[i].name != "locked") { //you can't select locked slots
			if(player.AU[i].name == "empty") {
				//code for assinging AUs
				$(el).unbind('click').click(function(){
					//swap the classes so that only this element has activeAU, the others have inactiveAU
					$(this).removeClass('inactiveAU').addClass('activeAU').siblings('a').addClass('inactiveAU').removeClass('activeAU');
					$("#AF_AUassignList").css("visibility", "visible").change();
					$("#AF_AUassignButton a").removeClass('noAss').removeClass('clear');
					
					//reset displays
					$("#AF_AUpic").attr("src","../../images/trans.gif");
					
					$("#AF_AUweapStats").html("<div id='AF_AUFP'><img src='AIFrames/icons/firepower.png' title='Unit Firepower' alt='Unit Firepower' /> <span class='stat'>???</span></div>"
											+ "<div id='AF_AUAmmo'><img src='AIFrames/icons/ammo.png' title='Unit Ammunition' alt='Unit Ammunition' /> <span class='stat'>???</span></div>"
											+ "<div id='AF_AUAccu'><img src='AIFrames/icons/accuracy.png' title='Unit Accuracy' alt='Unit Accuracy' /> <span class='stat'>???</span></div>");
					
					//reset unit information
					$("#AF_AUname").html("");
					$("#AF_AUFP span").html(": "+player.AU[i].firepower);
					$("#AF_AUAmmo span").html(": "+player.AU[i].ammo);
					$("#AF_AUAccu span").html(": "+player.AU[i].accuracy);
					$("#AF_AUconceal span").html(": "+player.AU[i].conc);
					$("#AF_AUarmor span").html(": "+player.AU[i].armor);
					$("#AF_AUspeed span").html(": "+player.AU[i].speed);
					$("#AF_AUcargo span").html(": "+player.AU[i].cargo);
					//reset build info
					$("#AF_numPpl").val("").keyup(); 
				});
			} else {
				//code for displaying AUs
				$(el).unbind('click').click(function(){
					//swap the classes so that only this element has activeAU, the others have inactiveAU
					$(this).removeClass('inactiveAU').addClass('activeAU').siblings('a').addClass('inactiveAU').removeClass('activeAU');
					$("#AF_AUassignList").css("visibility", "hidden");
					$("#AF_AUassignButton a").removeClass('noAss').addClass('clear');
					
					var AUpic = "AIFrames/units/";
					var rankPic = "AIFrames/units/";
			
					switch(player.AU[i].popSize) {
						case 1: //soldier
							AUpic += "soldier";
							break;
						case 5: //tank
							AUpic += "tank";
							break;
						case 10: //juggernaut
							AUpic += "juggernaut";
							break;
						case 20: //bomber
							AUpic += "bomber";
							rankPic += "bomb";
							break;
					}
					AUpic += "renderSMALL.png";
					$("#AF_AUpic").attr("src",AUpic);
					rankPic += "insig" + (player.AU[i].graphicNum+1) + ".png";
					$("#AF_rankPic").attr("src",rankPic);
					
					$("#AF_AUweapStats").html("<div id='AF_AUFP'><img src='AIFrames/icons/firepower.png' title='Unit Firepower' alt='Unit Firepower' /> <span class='stat'>???</span></div>"
											+ "<div id='AF_AUAmmo'><img src='AIFrames/icons/ammo.png' title='Unit Ammunition' alt='Unit Ammunition' /> <span class='stat'>???</span></div>"
											+ "<div id='AF_AUAccu'><img src='AIFrames/icons/accuracy.png' title='Unit Accuracy' alt='Unit Accuracy' /> <span class='stat'>???</span></div>");
					
					var classType = '';
					switch(player.AU[i].graphicNum) {
						case 0:
							classType = "Destroyer Class";
							break;
						case 1:
							classType = "Havoc Class";
							break;
						case 2:
							if(player.AU[i].popSize==20) classType = "Devastator Class";
							else classType = "Defender Class";
							break;
						case 3:
							if(player.AU[i].popSize==20) classType = "Mayhem Class";
							else classType = "Devastator Class";
							break;
						case 4:
							if(player.AU[i].popSize==20) classType = "Armageddon Class";
							else classType = "Mayhem Class";
							break;
						case 5:
							classType = "Battlehard Class";
							break;
						case 6:
							classType = "Stonewall Class";
							break;
						case 7:
							classType = "Ironside Class";
							break;
						case 8:
							classType = "Impervious Class";
							break;
						case 9:
							classType = "Conqueror Class";
							break;
					}
					//display unit information
					$("#AF_AUname").html(player.AU[i].name);
					$("#AF_AUrank").html(classType);
					$("#AF_AUFP span").html(player.AU[i].firepower);
					$("#AF_AUAmmo span").html(player.AU[i].ammo);
					$("#AF_AUAccu span").html(player.AU[i].accuracy);
					$("#AF_AUconceal span").html(player.AU[i].conc);
					$("#AF_AUarmor span").html(player.AU[i].armor);
					$("#AF_AUspeed span").html(player.AU[i].speed);
					$("#AF_AUcargo span").html(player.AU[i].cargo);
					
					var weapPics = "";
					
					$.each(player.AU[i].weap, function(i, x) {
						weapPics += "<img src='images/client/weapons/" 
									+ UTCC.weapons[x].name.toLowerCase().replace(/\s/g,"-") + ".png' title='"
									+ UTCC.weapons[x].name + "' />";
					});
					 //update build info
					$("#BUI_numPpl").keyup();
					$("#AF_AUassignList").change();
				});
			}
		}
		if(i == 0) $(el).click(); //select the first AU
	});
	
	$("#AF_AUassignList").html(function() {
		var HTML = "";
		var unusedAU = $.grep(player.AUTemplates, function(v, i) {
			var exists = false;
			$.each(player.AU, function(ind, val) {
				if(val.name == v.name) exists = true;
			});
			return exists;
		}, true);
		$.each(unusedAU, function(i, v) {
			HTML += "<option>" + v.name + "</option>";
		});
		return HTML;
	}).change(function(){
		var slot;
		$("#AF_AUbar > a").each(function(i, el) {
						if($(el).hasClass('activeAU')) {
							slot = i;
						}
					});
		var canChange = new make_AJAX();
		
		canChange.callback = function(response) {
				if(response.match(/true/)) {
					$("#AF_AUassignButton a").removeClass('noAss');
				} else {
					$("#AF_AUassignButton a").addClass('noAss');
					$("#AF_bFail").html(response.split(":")[1]);
				}
			};
		
		var URL = "/AIWars/GodGenerator?reqtype=command&command=" + player.command 
					+ ".canCreateCombatUnit(" + slot + ",";
		if($("#AF_AUassignButton a.clear").length > 0) { //if an AU is selected
			URL += "empty);";
		} else {
			URL += $(this).children(':selected').text() + ");";
		}
		canChange.get(URL);
	});
	
	$("#AF_AUassignButton a").click(function(){
		if(!$(this).hasClass('noAss')) {
			var assign = new make_AJAX();
			var slot;
			$("#AF_AUbar > a").each(function(i, el) {
							if($(el).hasClass('activeAU')) slot = i;
						});
			var URL = "/AIWars/GodGenerator?reqtype=command&command=" + player.command 
						+ ".createCombatUnit(" + slot + ",";
			if($(this).hasClass('clear')) { //if we have an AU selected, we're clearing
				URL += "empty);";
			} else {						//otherwise, we're assigning a new one
				URL += $("#AF_AUassignList option:selected").text() + ");";
			}
			
			assign.callback = function(response) {
				if(response.match(/true/)) {
					$.each(player.AUTemplates,function(i,v){
						if(v.name == $("#AF_AUassignList option:selected").text()) {
							player.AU[slot] = v;
							return false;
							if(bldgInfo.cap==0) bldgInfo.cap = 5;
							load_player(player.league,true,true);
						}
					});
					currUI();
				} else {
					$("#AF_bFail").html(response.split(":")[1]);
					$(this).addClass('noAss');
				}
			};
			assign.get(URL);
		}
	});
	
	$(".useBP").unbind("click").click(function() {
		display_message("Use BP - Ultra Build","Ultra Build decreases your unit build times by 50% for one week.<br/><div style='font-weight:bold;'>Cost: 100BP</div><div style='text-align: right;'>Current BP:"+player.research.bp+"</div>", 
						function() {
							display_output(false,"Purchasing Ultra Build...");
							var useBP = new make_AJAX();
							useBP.callback = function(response) {
												if(response.match(/true/)) {
													display_output(false,"Success!");
													load_player(player.league,true,true);
												} else {
													var error = response.split(":")[1];
													if(error.length==2) error = error[1]; 
													display_output(true,error,true);
												}
											}
							useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP(ub);");
						});
	});
	
	$("#BUI_numPpl").unbind("keyup").keyup(function() {
		try{clearTimeout(typeCheck);}catch(e) {}
		typeCheck = setTimeout(function() {
			$("#BUI_bFail").html("");
			var slot;
			$("#AF_AUbar > a").each(function(i, el) {
							if($(el).hasClass('activeAU')) slot = BUI.queue.AUtoBuild = i;
						});
						
			var numPpl = parseInt($("#BUI_numPpl").val());
			if(!isNaN(numPpl) && player.AU[slot].name != "empty") {
				var size = 0;
				switch(player.AU[slot].popSize) {
					case 1:
						size += numPpl;
						break;
					case 5:
					case 20:
						size += 10*numPpl;
						break;
					case 10:
						size += 40*numPpl;
						break;
				}
				var currentCap = 0;
				$.each(bldgInfo.Queue, function(i,v) {
					switch(player.AU[v.AUtoBuild].popSize) {
						case 1:
							currentCap += v.AUNumber;
							break;
						case 5:
						case 20:
							currentCap +=10* v.AUNumber;
							break;
						case 10:
							currentCap += 40*v.AUNumber;
							break;
					}
				});
				var getPplInfo = new make_AJAX();
				
				getPplInfo.callback = function(response){						
					var pplInfo = response.split(";");
					var pplCost = BUI.queue.cost = $.parseJSON(pplInfo[0]);
					BUI.queue.ticksPerUnit = pplInfo[1] * player.gameClockFactor;
					var ticks = BUI.queue.ticksPerUnit * numPpl;
					// build queue object
					BUI.queue.AUNumber = numPpl;
					
					var hours = Math.floor(ticks / 3600);
					var mins = Math.floor((ticks % 3600) / 60);
					var secs = Math.floor((ticks % 3600) % 60);
					
					//this rounds all the numbers up and reformats them for easier viewing
					$('#BUI_pplSteel').html(Math.ceil(parseFloat(pplCost[0]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");
					$('#BUI_pplWood').html(Math.ceil(parseFloat(pplCost[1]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");
					$('#BUI_pplManMade').html(Math.ceil(parseFloat(pplCost[2]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");
					$('#BUI_pplFood').html(Math.ceil(parseFloat(pplCost[3]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");
					$('#BUI_pplTime').html(((hours<10)?"0"+hours:hours) + ":" + ((mins<10)?"0"+mins:mins) + ":" + ((secs<10)?"0"+secs:secs)).removeClass("noRes");
					
					$("#AF_capNeeded span").text(size);
												
					var canBuild = pplInfo[2];
					if(!canBuild.match(/^false/) && size+currentCap <= bldgInfo.cap) {
						$('#BUI_pplSteel').removeClass("noRes");
						$('#BUI_pplWood').removeClass("noRes");
						$('#BUI_pplManMade').removeClass("noRes");
						$('#BUI_pplFood').removeClass("noRes");
						$("#BUI_bldPplButton").removeClass('noBld');
					} else { //if the user can't build ppl, mark the button as unavailable.
						$("#BUI_bldPplButton").addClass('noBld');
					}
				};
				getPplInfo.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
								+ ".returnPrice(" + player.AU[slot].name + "," + numPpl + "," 
								+ player.curtown.townID + ");" + player.command + ".getTicksPerAttackUnit(" 
								+ player.AU[slot].popSize + "," + player.curtown.townID + ");" + player.command + ".canBuy(" 
								+ player.AU[slot].name + "," + numPpl + "," + bldgInfo.lotNum + "," 
								+ player.curtown.townID + ");");
								
			} else { //if the user entered 0 or nothing, or if he's selected an empty AU slot, display ??? for values
				$("#BUI_bldPplButton").addClass('noBld');
				$('#BUI_pplSteel').html("???").addClass("noRes");
				$('#BUI_pplWood').html("???").addClass("noRes");
				$('#BUI_pplManMade').html("???").addClass("noRes");
				$('#BUI_pplFood').html("???").addClass("noRes");
				$('#BUI_pplTime').html("??:??:??").addClass("noRes");
			}
		},250);
	});
	
	$("#BUI_bldPplButton").unbind('click').click(function() {
		if(!$(this).hasClass("noBld")) {
			display_output(false,"Sending Build Command...");
			var numPpl = BUI.queue.AUNumber;
			var slot = BUI.queue.AUtoBuild;
			//get our queue running
			$.each(BUI.queue.cost, function(i,v){
				player.curtown.res[i] -= v;
			});
			var slotsOpen = parseInt($("#AF_queueCap span").text()), slotsNeeded = 0;
			switch(player.AU[BUI.queue.AUtoBuild].popSize) {
				case 1:
					slotsNeeded = numPpl;
					break;
				case 5:
				case 20:
					slotsNeeded =10*numPpl;
					break;
				case 10:
					slotsNeeded = 40*numPpl;
					break;
			}
			$("#AF_queueCap span").text(slotsOpen-slotsNeeded);
			
			BUI.queue.currTicks = 0;
			var i = bldgInfo.Queue.push(BUI.queue);
			bldgInfo.Queue[i-1].queueTicker = inc_queue_ticks(bldgInfo.Queue[i-1]);
			var HTML = '';
			var time = 0;
			if(i == 1) {
				HTML += "(Next unit in: <span class='time'>" + (bldgInfo.Queue[i-1].ticksPerUnit - bldgInfo.Queue[i-1].currTicks) + "</span>)<hr/>"
				time -=bldgInfo.Queue[i-1].currTicks;
			}
			$.each(bldgInfo.Queue, function(i,x) {
				time += x.ticksPerUnit;
			});
			HTML += "<li><div class='cancelButton'><a href='javascript:;'></a></div>" 
					+ bldgInfo.Queue[i-1].AUNumber + " " + player.AU[bldgInfo.Queue[i-1].AUtoBuild].name + "<div class='AFtimes'>\
					<span class='time'>" + time + "</span></div></li>";
			
			$("#AF_queue ul").append(HTML);
			var bldPpl = new make_AJAX();
			bldPpl.callback = function(response) {
				if(response.match(/true/)) {
					$("#BUI_numPpl").keyup();
					display_output(false,"Build Successful!");
					load_player(player.league, true);			
				} else {
					var error = response.split(":");
					if(error.length==2) error = error[1];
					display_output(true, error);
					$("#BUI_bFail").html(error);
				}
			};
			bldPpl.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
						+ ".buildCombatUnit(" + player.AU[slot].name + "," + numPpl 
						+ "," + bldgInfo.lotNum + "," + player.curtown.townID + ");");
		}
	});
	
	$('.cancelButton a').each(function(i, el) {
			$(el).click(function() {
				cancelQueue = new make_AJAX();
				
				cancelQueue.callback = function(response) {
					if(response.match(/true/)) {
						load_player(player.league, true, true);
					} else {
						var error = response.split(":");
						if(error.length==2) error = error[1];
						display_output(true, error);
						$("#AF_bFail").html(error);
					}
				};
				
				cancelQueue.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
								+ ".cancelQueueItem(" + bldgInfo.Queue[i].qid + "," + bldgInfo.lotNum 
								+ "," + player.curtown.townID + ");");
			});
		});
}