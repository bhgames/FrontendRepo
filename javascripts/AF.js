/*
 *	TODO:
 *		Rewrite display code to remain inline with new construction system.
 *			This will require a check against building level to determine building slots and queue length.
 *			Units will display as an icon only (no names)
 *			I think I will display two times per slot: Time till next unit and Time to finish all
 *			Only soldiers need to be displayed as other units are handled by other buildings
 *		General layout schematic:  The AF and MP will both follow this layout.
 *			_____________________________
 *			|		Building Info		|
 *			|___________________________|
 *			|__Unit Selection___| Queue	|
 *			|					|		|
 *			|	Unit data		|		|
 *			|					|		|
 *			|___________________|_______|
 *			|	Unit Construction menu	|
 *			|___________________________|
*/

function AF_UI(bldgInfo) {
	if(websock.nosock) {
		//do update check
		$.each(bldgInfo.Queue, function(i,v) {
			if(v.update) {
				load_player(false,true,true);
				return false;
			}
		});
	}
	
	$("#viewerback").append("<div id='BUI_bldPplBox'>\
								<div id='BUI_bldPplHeader'>Build Units</div>\
								<div id='BUI_bldPpl'>\
									<div id='BUI_pplBldgInfo'>\
										<div id='AF_capNeeded'>Slots needed: <span></span></div>\
									</div>\
								</div>\
								<div id='BUI_dummyPplButton' class='noBld'></div>\
								<div id='BUI_bldPplCost'>\
									<div class='BUI_bldPpl totalCost'>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplSteel' class='noRes upSteel'>???</div>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplWood' class='noRes upWood'>???</div>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplTime' class='noRes upTime'>??:??:??</div>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplManMade' class='noRes upManMade'>???</div>\
									</div>\
									<div class='BUI_bldPpl'>\
										<div id='BUI_pplFood' class='noRes upFood'>???</div>\
									</div>\
								</div>\
							</div>");
	
	$("#BUI_bldPplBox").animate({"bottom":"0px"}, "normal",function() {
		$("#BUI_bldPplButton").css("display","block");
		$("#BUI_numPpl").css("display","block");
		$("#BUI_dummyPplButton").css("display","none");
	});
	
	if(bldgInfo.type == "Manufacturing Plant") {
		$("#BUI_extras").text("Unit build times reduced " + (bldgInfo.lvl*1.5) + "% by this plant");
	}
	
	var list = "<ul>Build Queue:", //begin constructing the build queue
		time = 0,		//we have to add up the time as we go so the displays are correct
		slotsUsed = 0;
	$.each(bldgInfo.Queue, function(i, x) {
		slotsUsed += x.AUNumber;
		time += x.ticksPerUnit * x.AUNumber;
		if(i == 0) { //if this is the first queue item we display extra info
			list += " (Next unit in: <span class='time'>" + (x.ticksPerUnit - x.currTicks) + "</span>)<hr/>";
			time -= x.currTicks;
		}
		list += "<li><div class='cancelButton'></div>" 
				+ x.AUNumber + " " + player.AU[x.AUtoBuild].name + "<div class='AFtimes'><span class='time'>" + time + "</span></div></li>";
	});
	
	list += "</ul><div id='AF_queueCap'>Available Slots: <span>" + ((bldgInfo.lvl*2)-slotsUsed) + "</span></div>";
	$("#AF_queueList").html(list); //display the list
	
	$.each(player.AU, function(i, x){	//set up display of AU bar
		if((bldgInfo.type == "Arms Factory" && x.rank == "soldier")||
		   (bldgInfo.type == "Manufacturing Plant" && (x.rank == "tank" || x.rank == "golem"))||
		   (bldgInfo.type == "Airstrip" && x.rank == "bomber")) {
		   
			var el = $("#AF_AUbar").append("<div class='inactiveAU' slot='"+i+"'><img src='SPFrames/Units/"+x.name+".png' /></div>").children(":last-child");
			$(el).append(player.curtown.au[i]);
			
			$(el).attr("title", x.name); //this sets the tooltip to the name of the AU
		
			//code for displaying AUs
			$(el).unbind('click').click(function(){
				//swap the classes so that only this element has activeAU, the others have inactiveAU
				$(this).removeClass('inactiveAU').addClass('activeAU').siblings('img').addClass('inactiveAU').removeClass('activeAU');
				
				$("#AF_AUpic").attr("src","SPFrames/Units/"+x.name+".png");
				
				//display unit information
				$("#AF_AUname").html(x.name);
				$("#AF_AUAttackPower span").html(x.attackDamage);
				$("#AF_AUAattackType span").html(x.attackType);
				$("#AF_AUarmor span").html(x.armor);
				$("#AF_AUarmorType span").html(x.armorType);
				$("#AF_AUspeed span").html(x.speed);
				$("#AF_AUcargo span").html(x.cargo);
				
				 //update build info
				$("#BUI_numPpl").keyup();
			});
		}
	});
	
	$("#AF_AUbar :first-child").click();
	
	$("#BUI_bldgContent").fadeIn();
	
	$(".useBP").unbind("click").click(function() {
		display_message("Use BP - Ultra Build","Ultra Build decreases your unit build times by 50% for one week.<br/><div style='font-weight:bold;'>Cost: 100BP</div><div style='text-align: right;'>Current BP:"+player.research.bp+"</div>", 
						function() {
							display_output(false,"Purchasing Ultra Build...");
							var useBP = new make_AJAX();
							useBP.callback = function(response) {
												if(response.match(/true/)) {
													display_output(false,"Success!");
													load_player(false,true,true);
												} else {
													var error = response.split(":")[1];
													if(error.length==2) error = error[1]; 
													display_output(true,error,true);
												}
											};
							useBP.get("reqtype=command&command="+player.command+".useBP(ub);");
						});
	});
	
	$("#BUI_numPpl").unbind("keyup").keyup(function() {
		try{clearTimeout(typeCheck);}catch(e) {}
		typeCheck = setTimeout(function() {
			$("#BUI_bFail").html("");
			var slot=0;
			$("#AF_AUbar > div").each(function(i, el) {
							if($(el).hasClass('activeAU')) slot = BUI.queue.AUtoBuild = parseInt($(el).attr("slot"));
						});
						
			var numPpl = parseInt($("#BUI_numPpl").val());
			if(!isNaN(numPpl) && player.AU[slot].name != "empty") {
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
					
					$("#AF_capNeeded span").text(numPpl);
												
					var canBuild = pplInfo[2];
					if(!canBuild.match(/^false/) && numPpl+currentCap <= (bldgInfo.lvl*2)) {
						$('#BUI_pplSteel').removeClass("noRes");
						$('#BUI_pplWood').removeClass("noRes");
						$('#BUI_pplManMade').removeClass("noRes");
						$('#BUI_pplFood').removeClass("noRes");
						$("#BUI_bldPplButton").removeClass('noBld');
					} else { //if the user can't build ppl, mark the button as unavailable.
						$("#BUI_bldPplButton").addClass('noBld');
					}
				};
				getPplInfo.get("reqtype=command&command=bf.returnPrice(" + player.AU[slot].name + "," + numPpl + "," + player.curtown.townID 
								+ ");bf.getTicksPerAttackUnit(" + player.AU[slot].type + "," + player.curtown.townID 
								+ ");bf.canBuy(" + player.AU[slot].name + "," + numPpl + "," + bldgInfo.lotNum + "," 
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
			var slotsOpen = parseInt($("#AF_queueCap span").text());
			$("#AF_queueCap span").text(slotsOpen-numPpl);
			
			BUI.queue.currTicks = 0;
			var i = bldgInfo.Queue.push(BUI.queue);
			var HTML = '';
			var time = 0;
			if(i == 1) {
				HTML += "(Next unit in: <span class='time'>" + (bldgInfo.Queue[i-1].ticksPerUnit - bldgInfo.Queue[i-1].currTicks) + "</span>)<hr/>";
				time -=bldgInfo.Queue[i-1].currTicks;
			}
			$.each(bldgInfo.Queue, function(j,x) {
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
					load_player(false, true);			
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
						load_player(false, true, true);
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