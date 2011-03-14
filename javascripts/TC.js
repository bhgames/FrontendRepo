function TC_UI(bldgInfo) {
	//do update checks
	try {
		if(player.curtown.activeTrades.update || player.curtown.tradeSchedules.update) get_all_trades();
	} catch(e) {}
	
	var trTotal = 0;
	var trTotalCap = 0;
	$.each(player.curtown.bldg, function(i, v) {
		if(v.type == bldgInfo.type) {
			trTotal += v.peopleInside;
			trTotalCap += v.cap;
		}
	});
	
	$("#BUI_numCivs").html("Current Staff: <span class='pplTown' title='Traders in this Town'>"
							+ trTotal + "</span>/<span class='totalTown' title='Total Traders this town can hold'>" + trTotalCap + "</span> (<span class='pplBldg' title='Available Traders'>"
							+ bldgInfo.peopleInside + "</span>/<span class='totalBldg' title='Total allowed'>" + bldgInfo.cap + "</span>)");
	
	$("#TC_numPplBldg").text(bldgInfo.numLeftToBuild);
	$("#TC_ticksTillNext").text(bldgInfo.ticksLeft);
	
	$(".TCtab").unbind("click").click(function() {
		if(!$(this).hasClass("open")) {
			$(".open").removeClass("open");
			$(this).addClass("open");
			var that = this;
			$("#TC_window").fadeOut(100, function() {
				if($(that).is("#TC_Overview")) {
					$("#TC_window").html(BUI.TC.OHTML);
					
					$("#TC_activeTrades .tradeList").html(function() {
						var HTML = '';
						if(!gettingTrades) {
							if(player.curtown.activeTrades) {
								$.each(player.curtown.activeTrades, function(i, v) {								
									HTML += "<div class='activeTrade "+(i%2==0?" resWhite":" resBlack")+" tradeRow'><div class='traders'>"
											+ v.traders + "</div><div class='destTown'>";
									
									if(v.tradeOver) {
										HTML += "Returning</div><div class='origin'></div>";
									} else {
										HTML += v.destTown + "</div><div class='origin'>"+v.originatingTown+"</div>";
									}
									
									HTML += "<div class='resMoving'>";
									$.each(v.res, function(j, w) {
										if(w != 0) {
											if(v.tid2 == player.curtown.townID) HTML += "0/";
											switch(j) {
												case 0:
													HTML += "<img src='AIFrames/icons/MetalIcon.png' alt='Metal' />"
													break;
												case 1:
													HTML += "<img src='AIFrames/icons/TimberIcon.png' alt='Timber' />"
													break;
												case 2:
													HTML += "<img src='AIFrames/icons/PlasticIcon.png' alt='Manufactured Materials' />"
													break;
												case 3:
													HTML += "<img src='AIFrames/icons/FoodIcon.png' alt='Food' />"
													break;
											}
											
											HTML += w;
											return false;
										} else if(j == v.res.length-1) HTML += "0";
									});
									
									HTML += "</div><div class='ETA'>" + v.ticksToHit + "</div></div>";
								});
							} else {
								HTML ="<div class='resWhite tradeRow' style='padding-top:5px;'>No Trades en Route</div>";
							}
						}
						return HTML;
					});
					
					$("#TC_tradeSchedules .tradeList").html(function() {				
						var HTML = '';
						if(!gettingTrades) {
							if(player.curtown.tradeSchedules) {
								$.each(player.curtown.tradeSchedules, function(i, v) {
									HTML += "<div class='tradeSchedule "+(i%2==0?" resWhite":" resBlack")+" tradeRow'><div class='cancel'></div><div class='destTown'>" + (v.destTown!=""?v.destTown:"Open") 
											+ "</div><div class='origin'>"+v.originatingTown
											+"</div><div class='resMoving'>";
									$.each(v.res, function(j, w) {
										if(w != 0) {
											switch(j) {
												case 0:
													HTML += "<img src='AIFrames/icons/MetalIcon.png' alt='Metal' />"
													break;
												case 1:
													HTML += "<img src='AIFrames/icons/TimberIcon.png' alt='Timber' />"
													break;
												case 2:
													HTML += "<img src='AIFrames/icons/PlasticIcon.png' alt='Manufactured Materials' />"
													break;
												case 3:
													HTML += "<img src='AIFrames/icons/FoodIcon.png' alt='Food' />"
													break;
											}
											
											HTML +=  w;
											return false;
										}
									});
									if(v.twoway) {
										HTML += "/";
										$.each(v.otherres, function(j, w) {
											if(w != 0) {
												switch(j) {
													case 0:
														HTML += "<img src='AIFrames/icons/MetalIcon.png' alt='Metal' />"
														break;
													case 1:
														HTML += "<img src='AIFrames/icons/TimberIcon.png' alt='Timber' />"
														break;
													case 2:
														HTML += "<img src='AIFrames/icons/PlasticIcon.png' alt='Manufactured Materials' />"
														break;
													case 3:
														HTML += "<img src='AIFrames/icons/FoodIcon.png' alt='Food' />"
														break;
												}
												
												HTML += w;
												return false;
											}
										});
									}
									
									HTML += "</div><div class='timeTillNext'>" + v.currTicks + "</div><div class='numToDo'>" 
											+ ((v.timesDone == v.timesToDo)?"Complete":(v.timesToDo > -1)?v.timesToDo - v.timesDone:"&#8734;")
											+ "</div></div>";
								});
							} else {
								HTML ="<div class='resWhite tradeRow' style='padding-top:5px;'>No Trades Scheduled</div>";
							}
						}
						return HTML;
					});
				
					$(".cancel").unbind('click').click(function() {
						var i = $(this).index(".cancel");
						var that = this;
						
						var cancelTrade = new make_AJAX();
						 
						cancelTrade.callback = function(response) {
							if(!response.match(/false/i)) get_all_trades();
							else { 
								var error = response.split(":");
								if(error.length==2) error = error[1];
								display_output(true,"Error Canceling Trade:",true);
								display_output(true,error);
							}
						};
						 
						cancelTrade.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
										+ ".cancelTradeSchedule(" + player.curtown.tradeSchedules[i].tsid + ");");
					});
					$("#TC_window").fadeIn(250);
					$(".tradeList").jScrollPane({showArrows:true,hideFocus:true});
					
				} else if($(that).is("#TC_Trade")) {
					$("#TC_window").html(BUI.TC.THTML);
					
					$.each(player.towns, function(i,v) {
						if(v.townID != player.curtown.townID) {
							$("#TC_yourTowns").append("<option value='"+v.townID+"'>"+v.townName+"</option>");
						}
					});
					
					$("#TC_dtResSendAmnt").unbind('keyup').keyup(function() {
						try{clearTimeout(typeCheck);} catch(e) {}
						typeCheck = setTimeout(function() {
							if(isNaN($("#TC_dtResSendAmnt").val())) $("#TC_dtResSendAmnt").val(0);
							var sendAmnt = $("#TC_dtResSendAmnt").val();
							var numTraders = new make_AJAX();
							
							numTraders.callback = function(response) {
													$("#TC_dtTradersNeeded").text(response+" Traders Needed");
													if(response>trTotal) {
														$("#TC_dtTradersNeeded").css("color","red");
														$("#TC_dtSend").addClass("noTrade");
													} else {
														$("#TC_dtSend").removeClass("noTrade");
													}
												};
							numTraders.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
											+ ".howManyTraders(" + sendAmnt + "," 
											+ player.curtown.townID + ");");
						}, 250);
					}).unbind("change").change(function(){
						$(this).keyup();
					});
					
					$("#TC_dtInterval").unbind('keyup').keyup(function() {
						try{clearTimeout(typeCheck);}catch(e) {}
						var that = this;
						typeCheck = setTimeout(function(){
							if(isNaN($(that).val()) || $(that).val() < player.gameClockFactor) $(that).val(player.gameClockFactor);
							
							BUI.TC.DT.interval = $(that).val();
						},250);
					}).unbind("change").change(function(){
						$(this).keyup();
					}).keyup().attr("min",player.gameClockFactor);
					
					$("#TC_dtNumToDo").unbind('keyup').keyup(function() {
						try{clearTimeout(typeCheck);}catch(e) {}
						var that = this;
						typeCheck = setTimeout(function(){
							if(isNaN($(that).val()) || $(that).val() == 0 || $(that).val() < -1) $(that).val(1);
							
							BUI.TC.DT.numIntervals = $(that).val();
						},250);
					}).unbind("change").change(function(){
						$(this).keyup();
					});
					
					$("#TC_yourTowns").unbind("change").change(function(){
						var town = $(this).children(":selected").attr("value");
						$.each(player.towns,function(i,v) {
							if(v.townID==town) {
								$("#TC_dtX").val(v.x).keyup();
								$("#TC_dtY").val(v.y).keyup();
							}
						});
					});
					
					$("#TC_dtX").val(BUI.TC.DT.x);
					$("#TC_dtY").val(BUI.TC.DT.y);
					
					$("#TC_dtTradeTo input").unbind('keyup').keyup(function(){
						if(isNaN($("#TC_dtX").val())) $("#TC_dtX").val(0);
						if(isNaN($("#TC_dtY").val())) $("#TC_dtY").val(0);
						BUI.TC.DT.x = $("#TC_dtX").val();
						BUI.TC.DT.y = $("#TC_dtY").val();
						
						try{clearTimeout(typeCheck);}catch(e) {}
						typeCheck = setTimeout(function(){get_trade_ETA();},250);
					}).unbind("change").change(function() {
						$(this).keyup();
					}).keyup();
					
					$("#TC_dtSend").unbind('click').click(function() {
						if(!$(this).hasClass("noTrade")) {
							var makeTrade = new make_AJAX();
							var getPath = "/AIWars/GodGenerator?reqtype=command&command=" + player.command 
											+ ".setUpTradeSchedule(" + player.curtown.townID + "," + BUI.TC.DT.x + ","
										+ BUI.TC.DT.y + ",";
							$("#TC_dtResSendType option").each(function(i, v) {
								if(v.selected == true) {
									getPath += $("#TC_dtResSendAmnt").val() + ",";
								} else {
									getPath += "0,";
								}
							});
							getPath += BUI.TC.DT.interval + "," + BUI.TC.DT.numIntervals + ");";
							
							makeTrade.callback = function(response) {
								if(!response.match(/false/i)) get_all_trades();
								else { 
									var error = response.split(":");
									if(error.length > 1) error = error[1];
									display_output(true,error,true);
								}
							};
							
							makeTrade.get(getPath);
						}
					});
					
					$("#TC_ltResSendAmnt").unbind('keyup').keyup(function() {
						if(typeCheck) clearTimeout(typeCheck);
						
						typeCheck = setTimeout(function() {
							if(isNaN($("#TC_ltResSendAmnt").val())||$("#TC_ltResSendAmnt").val()<0) $("#TC_ltResSendAmnt").val(0);
							var sendAmnt = $("#TC_ltResSendAmnt").val();
							var numTraders = new make_AJAX();
							
							numTraders.callback = function(response) {
													$("#TC_ltTradersNeeded").text(response+" Traders Needed");
													if(response>trTotal) {
														$("#TC_ltTradersNeeded").css("color","red");
														$("#TC_ltSend").addClass("noTraders");
													} else {
														$("#TC_ltTradersNeeded").css("color","");
														$("#TC_dtSend").removeClass("noTraders");
													}
												};
							numTraders.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
											+ ".howManyTraders(" + sendAmnt + "," 
											+ player.curtown.townID + ");");
						}, 250);
					}).unbind("change").change(function(){
						$(this).keyup();
					});
					
					$("#TC_ltResRecAmnt").unbind('keyup').keyup(function() {
						if(typeCheck) clearTimeout(typeCheck);
						
						typeCheck = setTimeout(function() {
							if(isNaN($("#TC_ltResRecAmnt").val())||$("#TC_ltResRecAmnt").val()<0) $("#TC_ltResRecAmnt").val(0);
						}, 250);
					}).unbind("change").change(function(){
						$(this).keyup();
					});
					
					$("#TC_ltResSendType, #TC_ltResRecType").unbind("change").change(function(){
						if($("#TC_ltResSendType").val() == $("#TC_ltResRecType").val()) $("#TC_ltSend").addClass("noTrade");
						else $("#TC_ltSend").removeClass("noTrade");
					});
					
					$("#TC_ltInterval").unbind('keyup').keyup(function() {
						try{clearTimeout(typeCheck);}catch(e) {}
						var that = this;
						typeCheck = setTimeout(function(){
							if(isNaN($(that).val()) || $(that).val() < player.gameClockFactor) $(that).val(player.gameClockFactor);
							
							BUI.TC.DT.interval = $(that).val();
						},250);
					}).unbind("change").change(function(){
						$(this).keyup();
					}).keyup().attr("min",player.gameClockFactor);
					
					$("#TC_ltNumToDo").unbind('keyup').keyup(function() {
						try{clearTimeout(typeCheck);}catch(e) {}
						var that = this;
						typeCheck = setTimeout(function(){
							if(isNaN($(that).val()) || $(that).val() == 0 || $(that).val() < -1) $(that).val(1);
							
							BUI.TC.DT.numIntervals = $(that).val();
						},250);
					}).unbind("change").change(function(){
						$(this).keyup();
					});
				
					$("#TC_ltSend").unbind('click').click(function() {
						if(!$(this).is(".noTrade,.noTraders")) {
							var makeTrade = new make_AJAX();
							var getPath = "/AIWars/GodGenerator?reqtype=command&command=" + player.command 
											+ ".setUpTradeSchedule(" + player.curtown.townID + ",";
							$("#TC_ltResSendType option").each(function(i, v) {
								if(v.selected == true) {
									getPath += $("#TC_ltResSendAmnt").val() + ",";
								} else {
									getPath += "0,";
								}
							});
							$("#TC_ltResRecType option").each(function(i, v) {
								if(v.selected == true) {
									getPath += $("#TC_ltResRecAmnt").val() + ",";
								} else {
									getPath += "0,";
								}
							});
							getPath += player.gameClockFactor + ",1);";
							
							makeTrade.callback = function(response) {							
								if(!response.match(/false/i)) get_all_trades();
								else { 
									var error = response.split(":");
									if(error.length > 1) error = error[1];
									display_output(true,error,true);
								}
							};
							
							makeTrade.get(getPath);
						}
					});
					
					$("#TC_window").fadeIn(100);
					
				} else {
					$("#TC_window").html(BUI.TC.MHTML);
					$("#TC_trades").jScrollPane({showArrows:true,hideFocus:true});
					$("#TC_refreshTrades").unbind("click").click(function() {
						var getMarket = new make_AJAX();
						getMarket.callback = function(response) {
												BUI.TC.trades = $.parseJSON(response);
												$("#TC_trades").fadeOut(100,function() {
													$(this).data('jsp').getContentPane().html(function(){
														var HTML = '';
														$.each(BUI.TC.trades,function(i,v) {
															if(player.username!=v.originatingPlayer) {
																HTML += "<div class='marketTrade "+(i%2==0?" tradeWhite":" tradeBlack")+" tradeRow'><div class='origPlayer'>"+v.originatingPlayer
																		+"</div><div class='origTown'>"+v.originatingTown+"</div><div class='resOffer'>";
																$.each(v.res, function(j, w) {
																	if(w != 0) {
																		switch(j) {
																			case 0:
																				HTML += "<img src='AIFrames/icons/MetalIcon.png' alt='Metal' />"
																				break;
																			case 1:
																				HTML += "<img src='AIFrames/icons/TimberIcon.png' alt='Timber' />"
																				break;
																			case 2:
																				HTML += "<img src='AIFrames/icons/PlasticIcon.png' alt='Man. Mat.' />"
																				break;
																			case 3:
																				HTML += "<img src='AIFrames/icons/FoodIcon.png' alt='Food' />"
																				break;
																		}
																		
																		HTML +=  w;
																		return false;
																	}
																});
																if(v.twoway) {
																	HTML += "/";
																	$.each(v.otherres, function(j, w) {
																		if(w != 0) {
																			switch(j) {
																				case 0:
																					HTML += "<img src='AIFrames/icons/MetalIcon.png' alt='Metal' />"
																					break;
																				case 1:
																					HTML += "<img src='AIFrames/icons/TimberIcon.png' alt='Timber' />"
																					break;
																				case 2:
																					HTML += "<img src='AIFrames/icons/PlasticIcon.png' alt='Man. Mat.' />"
																					break;
																				case 3:
																					HTML += "<img src='AIFrames/icons/FoodIcon.png' alt='Food' />"
																					break;
																			}
																			
																			HTML += w;
																			return false;
																		}
																	});
																}
																
																HTML += "</div><div class='distance'>" + v.distance + "</div></div>";
															}
														});
														return HTML;
													});
													$(this).fadeIn(100,function(){
														$("#TC_window").fadeIn(100);
														$(this).data('jsp').reinitialise();
													});
												});
											};
						
						getMarket.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".getOpenTwoWays("+player.curtown.townID+");");
					}).click();
					
					$(".marketTrade").die("click").live("click",function(){
						$(".active").removeClass("active");
						$(this).addClass("active");
						
						var trade = BUI.TC.trades[$(".active").index(".marketTrade")];
						$("#TC_purchaseTrade").addClass("noBld");
						$("#TC_isssuePlayer div").html(trade.originatingPlayer);
						$("#TC_issueTown div").html(trade.originatingTown);
						$.each(trade.res,function(i,v) {
							if(v!=0) {
								var value = v;
								switch(i) {
									case 0:
									value += "<img src='AIFrames/icons/MetalIcon.png' alt='Metal' />"
									break;
								case 1:
									value += "<img src='AIFrames/icons/TimberIcon.png' alt='Timber' />"
									break;
								case 2:
									value += "<img src='AIFrames/icons/PlasticIcon.png' alt='Man. Mat.' />"
									break;
								case 3:
									value += "<img src='AIFrames/icons/FoodIcon.png' alt='Food' />"
									break;
								}
								$("#TC_issueRes div").html(value);
							}
						});
						var cost = 0;
						$.each(trade.otherres,function(i,v) {
							if(v!=0) {
								var value = cost = v;
								switch(i) {
									case 0:
									value += "<img src='AIFrames/icons/MetalIcon.png' alt='Metal' />"
									break;
								case 1:
									value += "<img src='AIFrames/icons/TimberIcon.png' alt='Timber' />"
									break;
								case 2:
									value += "<img src='AIFrames/icons/PlasticIcon.png' alt='Man. Mat.' />"
									break;
								case 3:
									value += "<img src='AIFrames/icons/FoodIcon.png' alt='Food' />"
									break;
								}
								$("#TC_issueCost div").html(value);
							}
						});
						var getTradeInfo = new make_AJAX();
						getTradeInfo.callback = function(response) {
													var temp = response.split(";");
													if(temp[0]<=trTotal) $("#TC_purchaseTrade").removeClass("noBld");
													
													var days = Math.floor((temp[1] / 3600)/24);
													var hours = Math.floor((temp[1] / 3600)%24);
													var mins = Math.floor((temp[1] % 3600) / 60);
													var secs = Math.floor((temp[1] % 3600) % 60);
													$("#TC_issueDist div").html(((days)?days + " d ":"") + hours.toTime() + ":" + mins.toTime() + ":" + secs.toTime());
												};
						getTradeInfo.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".howManyTraders("+cost+","+player.curtown.townID+");"
										+player.command+".getTradeETA("+player.curtown.townID+","+trade.tid1+");");
						
					});
					
					$("#TC_purchaseTrade").unbind("click").click(function(){
						if(!$(this).hasClass("noBld")) {
							display_output(false,"Purchasing Trade...");
							var buyTrade = new make_AJAX();
							buyTrade.callback = function(response) {
													if(response.match(/true/)) {
														display_output(false,"Trade Purchased!");
														get_all_trades();
														$("#TC_refreshTrades").click();
													} else {
														var error = response.split(":");
														if(error.length==2) error = error[1];
														display_output(true,"Error Buying Trade!",true);
														display_output(true,error);
													}
												};
							buyTrade.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".acceptTradeSchedule("+BUI.TC.trades[$(".active").index(".marketTrade")].tsid+","+player.curtown.townID+");");
						}
					});
				}
			});
		}
	});
	
	$("#BUI_pplHelp").unbind("click").click(function() {
		display_message("Traders","Traders are used when making trades.  Without sufficient traders, your trade schedules will fail to send.  Individual traders carry 100 resources each.  Additional traders increase the amount carried by the other traders.");
	});
	
	$("#BUI_numPpl").unbind('keyup').keyup(function() {
		try{clearTimeout(typeCheck);}catch(e) {}
		typeCheck = setTimeout(function() {
			$("#BUI_bFail").html("");		//clear any error messages
			var numPpl = parseInt($("#BUI_numPpl").val());	//to avoid sending completely bad data to the server
			if(!isNaN(numPpl)) {
				try {getPplInfo.abort();} catch(e) {}
				var getPplInfo = new make_AJAX();
				
				getPplInfo.callback = function(response){
				
					var pplInfo = response.split(";");
					var pplCost = BUI.queue.cost = $.parseJSON(pplInfo[0]);
					var ticks = pplInfo[1] * numPpl * player.gameClockFactor;
					// build queue object
					BUI.queue.numLeftToBuild = numPpl;
					BUI.queue.ticksPerPerson = pplInfo[1] * player.gameClockFactor;
					// math to correctly display the numbers
					var days = Math.floor((ticks / 3600)/24);
					var hours = Math.floor((ticks / 3600)%24);
					var mins = Math.floor((ticks % 3600) / 60);
					var secs = Math.floor((ticks % 3600) % 60);
					
					//this rounds all the numbers up and reformats them for easier viewing
					$('#BUI_pplSteel').html(Math.ceil(parseFloat(pplCost[0]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");;
					$('#BUI_pplWood').html(Math.ceil(parseFloat(pplCost[1]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");;
					$('#BUI_pplManMade').html(Math.ceil(parseFloat(pplCost[2]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");;
					$('#BUI_pplFood').html(Math.ceil(parseFloat(pplCost[3]))).format({format:"###,###,###", locale:"us"}).addClass("noRes");;
					$('#BUI_pplTime').html(((days)?days + " d ":"") + hours.toTime() + ":" + mins.toTime() + ":" + secs.toTime()).removeClass("noRes");
					
					var canBuild = pplInfo[2];
					if(canBuild.match(/true/)) {
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
								+ ".returnPrice(Trader," + numPpl + "," + player.curtown.townID
								+ ");" + player.command + ".getTicksPerPerson(" + bldgInfo.lotNum + "," 
								+ player.curtown.townID + ");" + player.command + ".canBuy(Trader,"
								+ numPpl + "," + bldgInfo.lotNum + "," + player.curtown.townID + ");");
			} else { //if the user entered 0 or nothing, display ??? for values
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
			var numPpl = BUI.queue.numLeftToBuild;
			$.each(BUI.queue.cost, function(i,v){
				player.curtown.res[i] -= v;
			});
			bldgInfo.numLeftToBuild += BUI.queue.numLeftToBuild
			bldgInfo.ticksPerPerson = BUI.queue.ticksPerPerson;
			bldgInfo.pplTicker = inc_ppl_ticks(bldgInfo);
			var bldPpl = new make_AJAX();
			bldPpl.callback = function(response) {				
				if(response.match(/^false/) == null) {
					$("#BUI_numPpl").keyup();
					display_output(false,"Build Successful!");
					load_player(player.league, true, true);				
				} else {
					var error = response.split(":")[1];
					display_output(true, error);
					$("#TC_bFail").html(error);
				}
			};
			bldPpl.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
						+ ".buildTrader(" + bldgInfo.lotNum + "," + numPpl + "," 
						+ player.curtown.townID + ");");
		}
	});
	
	if(BUI.TC.sendTrade) {
		BUI.TC.sendTrade = false;
		$("#TC_Trade").click();
	} else {
		$("#TC_Overview").click();
	}
}
function get_trade_ETA() {
	var getETA = new make_AJAX();
	getETA.callback = 	function(response) {
							if(response.match(/\d/)) {
								var days = Math.floor((response / 3600)/24);
								var hours = Math.floor((response / 3600)%24);
								var mins = Math.floor((response % 3600) / 60);
								var secs = Math.floor((response % 3600) % 60);
								$("#TC_dtETA").html("ETA: "+((days)?days + " d ":"") + hours.toTime() + ":" + mins.toTime() + ":" + secs.toTime());
							} else {
								$("#TC_dtETA").html("?!:?!:?!");
							}
						};
	getETA.get("/AIWars/GodGenerator?reqtype=command&command=bf.getTradeETA("+player.curtown.x+","+player.curtown.y+","+BUI.TC.DT.x+","+BUI.TC.DT.y+");");
}