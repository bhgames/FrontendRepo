/**************************************************************************************************************\
************************************************Status Reports**************************************************
\**************************************************************************************************************/
var SR = {
			HTML : "<div id='SR_reports'>\
						<div id='SR_mainTabs'>\
							<div id='SR_allTab' class='textTab' title='Show All Reports'>All</div>\
							<div id='SR_attackTab' class='textTab' title='Show Attack Type Reports'>Attack</div>\
							<div id='SR_spyTab' class='textTab' title='Show Spy Reports'>Spy</div>\
							<div id='SR_supportTab' class='textTab' title='Show Support Reports'>Support</div>\
							<div id='SR_archiveTab' class='textTab' title='Show Archived Reports'>Archive</div>\
							<div id='SR_searchTab' title='Search Through Reports (Coming Soon)'></div>\
						</div>\
						<div id='SR_window'>\
						</div>\
					</div>",
			attkTabs : "<div id='SR_secondaryTabs'>\
							<div id='SR_sAllTab' class='textTab small' title='Show All Attack Type Reports'>All</div>\
							<div id='SR_sAttackTab' class='textTab small' title='Show Attack Reports'>Attack</div>\
							<div id='SR_sGenocideTab' class='textTab small' title='Show Siege Reports'>Siege</div>\
							<div id='SR_sInvadeTab' class='textTab small' title='Show Invasion Reports'>Invasion</div>\
							<div id='SR_sStrafeTab' class='textTab small' title='Show Strafe Reports'>Strafe</div>\
							<div id='SR_sGlassTab' class='textTab small' title='Show Glassing Reports'>Glassing</div>\
						</div>\
						<div id='SR_sWindow'></div>",
			dispReports : []
		};
/***********************************************************************************************************\
								Functions for the Status Reports Menu
\***********************************************************************************************************/
var gettingSRs = false;
function get_SRs() {
	try {
		if(!gettingSRs) {
			gettingSRs = true;
			SRget = new make_AJAX();
			display_output(false,"Loading Status Reports...");
			SRget.callback = function(response) {
				SR.reports = $.parseJSON(response);
				if(SR.reports) {
					SR.reports.reverse();
					check_for_unread();
				} else {
					SR.reports = [];
				}
			
				$("#sr").click(function() {
					do_fade(build_SR_menu,$(this));
				});
				SR.update = false;
				gettingSRs = false;
				display_output(false,"Status Reports Loaded!");
			};
			
			SRget.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".getUserSR();");
		}
	} catch(e) {
		display_output(true,"Error during SR load!", true);
		display_output(true,e,true);
		display_output(false,"Retrying...");
		get_SRs();
	}
}

function build_SR_menu() {
	currUI = build_SR_menu;	//set current UI function to be called by the tickers
	$("#window").contents().unbind();
	$("#viewerback").css({"background-image":"url(SPFrames/Buildings/UI/menu-back.jpg)","background-color":""}).html("").fadeIn();
	//do update checks
	if(SR.update) {
		get_SRs();
		get_raids(true);
	}
	
	$("#window").html(SR.HTML);
	SR.api = $("#SR_window").css("display","none").jScrollPane({showArrows:true,hideFocus:true}).data('jsp');
	$("#SR_mainTabs div, #SR_secondaryTabs div").die('click').live('click',function() {
		
		if($(this).is("#SR_mainTabs div")) {
			$("#SR_window").contents().unbind();
		} else {
			$("#SR_sWindow").contents().unbind();
		}
		
		var that = $(this);
		if(!that.is("#SR_searchTab")) {
			if(that.is("#SR_attackTab") && !that.hasClass("open")) {
				that.addClass("open").siblings("div").removeClass("open");
				$("#SR_window").fadeOut("fast", function() {
					SR.api.getContentPane().html(SR.attkTabs);
					$("#SR_window").fadeIn("fast", function() {
						SR.sAPI = $("#SR_sWindow").jScrollPane({showArrows:true,hideFocus:true}).data('jsp');
						$("#SR_sAllTab").click();
					});
					SR.api.reinitialise();
				});
			} else {
				if(!that.hasClass("open")) {
					SR.dispReports = [];
					var HTML = "<ul id='SR_reportList'>";
						$.each(SR.reports, function(i, v) {
							/* Okay, this next bit is kinda confusing if you don't know what I'm doing here.
							** Each line is the parameters for each tab of the SR window.
							** Whenever you click on a tab, it'll determine the tab using the .is() jQuery
							**		method.
							** From there, it checks for a few parameters passed in the SR object.
							** Each individual group is in parenthases so that they're isolated from each other
							**		and so that the entire expression will have to come back true for the thing to work.
							**
							** In all cases, except the archive tab, we have to check to make sure the message isn't archived.
							** First, we start with the main tabs.
							** The all tab, of course, shows everything.  So we only check to see if it's the tab clicked on.
							** Next, we check the attack button's all tab, since it's what does the displaying.
							**		These only get attack reports (attack, genocide, invasion, strafe, glass).  So, we really
							**		only have to check to make sure it's not a spy or support report.
							** Next is the spy tab.  This tab only shows spy reports (failed or otherwise).  So, only check is
							** 		on the scout property of the report object.
							** After that is support.  Support checks are just as simple since the support method is boolean.
							** Archive comes after that.  Then Search.  Since we don't have either of those yet, no checks.
							**
							** Now, secondary tabs.
							** All secondary tabs have boolean methods that mark them in the report.
							** The exception to this rule is bombings, which have to be determined from lotNumBombed
							*/
							if(	(that.is("#SR_allTab") && !v.archived) ||	
								(that.is("#SR_sAllTab") && !v.support && v.scout == 0 && !v.archived) ||
								(that.is("#SR_spyTab") && v.scout != 0 && !v.archived) ||
								(that.is("#SR_supportTab") && v.support && !v.archived) ||
								(that.is("#SR_sAttackTab") && !v.genocide && !v.invade && !v.support && v.scout == 0 && v.lvlArray.length == 0 && !v.archived) ||
								(that.is("#SR_sGenocideTab") && v.genocide && !v.archived) ||
								(that.is("#SR_sInvadeTab") && v.invade && !v.archived) ||
								(that.is("#SR_sStrafeTab") && v.lvlArray.length != 0 && !v.genocide && !v.archived) ||
								(that.is("#SR_sGlassTab") && v.lvlArray.length != 0 && v.genocide && !v.archived) ||
								(that.is("#SR_archiveTab") && v.archived)) {
									SR.dispReports.push(v);
									HTML += "<li><a href='javascript:;' class='"
									+ ((v.read)?"":"unread ") + "report'>" + v.Subject + "</a><input type='checkbox' class='reportSelect' />\
									<span class='timeStamp'>[ ";
									//fix date strings so IE doesn't freak out
									var createdAt = v.createdAt.replace(/-/g,"/").split(".")[0];
									var rDate = new Date((new Date(createdAt)).getTime() - (player.time.getTimezoneOffset()*60*1000));
									HTML += rDate.getFullYear() + "-" + (rDate.getMonth()+1).toTime() + "-" 
											+ rDate.getDate().toTime() + " - " + rDate.toLocaleTimeString() + " ]</span></li>";
							}
						});
					 HTML += "</ul><div id='SR_buttons'><a href='javascript:;' id='SR_markAll'>Mark all</a>\
								<a href='javascript:;' id='SR_deleteMulti'>Delete</a>\
								<a href='javascript:;' id='SR_markReadMulti'>Mark Read</a>";
					if(that.is("#SR_archiveTab")) {
						HTML += "<a href='javascript:;' id='SR_unarchiveMulti'>Unarchive</a>";
					} else {
						HTML += "<a href='javascript:;' id='SR_archiveMulti'>Archive</a>";
					}
					HTML += "</div>";
				
					that.addClass("open").siblings("div").removeClass("open");
					if(that.is("#SR_mainTabs div")) {  //check if on a main tab
							$("#SR_window").fadeOut("fast", function() {
														SR.api.getContentPane().html(HTML);
														$("#SR_window").fadeIn("fast");
														SR.api.reinitialise();
													});
					} else { //we must be in a subtab
						$("#SR_sWindow").fadeOut("fast", function() {
													SR.sAPI.getContentPane().html(HTML);
													$("#SR_sWindow").fadeIn("fast");
													SR.sAPI.reinitialise();
												});
					}
				}
			}
		} else {
			//search methods here
			/*
			  I think I'm going to use a filters system.  So, you set a filter that a report either must have, or must not have.
			    EX.
					[Must Have[v]] [Report Type[v]] [Genocide[v]]
			  Each filter is just a series of dropdown boxes or, in the case of player or town searches, a single text box.  Text serches will be case insensitive.
			*/
		}
	});
	
	var checked = false;
	$("#SR_markAll").die('click').live('click',function() {
		checked = !checked;
		$(".reportSelect").each(function(i, v) {
			v.checked = checked;
		});
	});
	$("#SR_deleteMulti").die('click').live('click', function() {
		if($(".reportSelect:checked").length > 0) {
			var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
			var deletedSIDs = [];
			$(".reportSelect:checked").each(function(i, v) {
				var index = $(v).index(".reportSelect");
				var report = SR.dispReports[index];
				getPath += player.command + ".deleteUserSR(" + report.id + ");";
				deletedSIDs.push(report.id);
			});
			deleteReports = new make_AJAX();
			deleteReports.get(getPath);
			
			$.each(deletedSIDs, function(i, x) {
				$.each(SR.reports, function(ind, y) {
					if(x == y.id) {
						SR.reports.splice(ind, 1);
						return false;
					}
				});
			});
			check_for_unread();
			$("#SR_mainTabs div").each(function(i, v) {
				if($(v).hasClass("open")) {
					if($(v).is("#SR_attackTab")) {
						$("#SR_secondaryTabs div").each(function(i, v) {
							if($(v).hasClass("open")) {
								$(v).removeClass("open");
								$(v).click();
								return false;
							}
						});
					} else {
						$(v).removeClass("open");
						$(v).click();
						return false;
					}
				}
			});
		}
	});
	$("#SR_markReadMulti").die('click').live('click', function() {
		if($(".reportSelect:checked").length > 0) {
			var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
			var readSIDs = [];
			$(".reportSelect:checked").each(function(i, v) {
				var index = $(v).index(".reportSelect");
				var report = SR.dispReports[index];
				getPath += player.command + ".markReadUserSR(" + report.id + ");";
				readSIDs.push(report.id);
			});
			readReports = new make_AJAX();
			readReports.get(getPath);
			
			$.each(readSIDs, function(i, x) {
				$.each(SR.reports, function(ind, y) {
					if(x == y.id) {
						SR.reports[ind].read = true;
						return false;
					}
				});
			});
			check_for_unread();
			$("#SR_mainTabs div").each(function(i, v) {
				if($(v).hasClass("open")) {
					if($(v).is("#SR_attackTab")) {
						$("#SR_secondaryTabs div").each(function(i, v) {
							if($(v).hasClass("open")) {
								$(v).removeClass("open");
								$(v).click();
								return false;
							}
						});
					} else {
						$(v).removeClass("open");
						$(v).click();
						return false;
					}
				}
			});
		}
	});
	$("#SR_archiveMulti").die('click').live('click', function() {
		if($(".reportSelect:checked").length > 0) {
			var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
			var archiveSIDs = [];
			$(".reportSelect:checked").each(function(i, v) {
				var index = $(v).index(".reportSelect");
				var report = SR.dispReports[index];
				getPath += player.command + ".archiveUserSR(" + report.id + ");";
				archiveSIDs.push(report.id);
			});
			archiveReports = new make_AJAX();
			archiveReports.get(getPath);
			
			$.each(archiveSIDs, function(i, x) {
				$.each(SR.reports, function(ind, y) {
					if(x == y.id) {
						SR.reports[ind].archived = true;
						return false;
					}
				});
			});
			$("#SR_mainTabs div").each(function(i, v) {
				if($(v).hasClass("open")) {
					if($(v).is("#SR_attackTab")) {
						$("#SR_secondaryTabs div").each(function(i, v) {
							if($(v).hasClass("open")) {
								$(v).removeClass("open");
								$(v).click();
								return false;
							}
						});
					} else {
						$(v).removeClass("open");
						$(v).click();
						return false;
					}
				}
			});
		}
	});
	$("#SR_unarchiveMulti").die('click').live('click', function() {
		if($(".reportSelect:checked").length > 0) {
			var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
			var unarchiveSIDs = [];
			$(".reportSelect:checked").each(function(i, v) {
				var index = $(v).index(".reportSelect");
				var report = SR.dispReports[index];
				getPath += player.command + ".unarchiveUserSR(" + report.id + ");";
				unarchiveSIDs.push(report.id);
			});
			unarchiveReports = new make_AJAX();
			unarchiveReports.get(getPath);
			
			$.each(unarchiveSIDs, function(i, x) {
				$.each(SR.reports, function(ind, y) {
					if(x == y.id) {
						SR.reports[ind].archived = false;
						return false;
					}
				});
			});
			$("#SR_mainTabs div").each(function(i, v) {
				if($(v).hasClass("open")) {
					if($(v).is("#SR_attackTab")) {
						$("#SR_secondaryTabs div").each(function(i, v) {
							if($(v).hasClass("open")) {
								$(v).removeClass("open");
								$(v).click();
								return false;
							}
						});
					} else {
						$(v).removeClass("open");
						$(v).click();
						return false;
					}
				}
			});
		}
	});
	
	$(".report").die('click').live('click', function() {
		$("#SR_mainTabs div").removeClass("open");
		var index = $(this).index(".report");
		var report = SR.dispReports[index];
		var HTML = "<div id='SR_repHeader'>" + report.Subject + "</div><div id='SR_reportBody'>";
		
		if(report.scout == 1) {			//Scout type reports display slightly differently from other types.
			var reportText = report.Report.split(";");
			reportText = reportText.splice(2, reportText.length - 3);
			var numAmts = 0;
			report.offStats = [];
			report.offBegin = $.grep(reportText,function(v, i) {
							if(report.offNames[numAmts] == reportText[i-1] && numAmts < report.offNames.length) {
								if(reportText[i+1].match(/Cnclmt/i) != null) {
									var cont = true;
									report.offStats[numAmts] = $.grep(reportText, function(w, j) {
																		if(w == report.offNames[numAmts+1]) {
																			cont = false;
																		}
																		if(j > i && cont) {
																			return true;
																		}
																		return false;
																	});
								}
								numAmts++;
								return true;
							}
							return false;
						});
			$.each(report.offNames,function(i, v) {
				if(report.offNames[i] == "Trader" || report.offNames[i] == "Scholar") {
					report.offStats.splice(i,0,report.offStats[i-1]);
				}
			});
			var bldgAmts = [];
			$.each(reportText, function(i, v) {
				if(v.match(/bldg amts/i)){
					bldgAmts = reportText.splice(i+1);
					return false;
				}
			});
			if(report.offNames.length > 0) {
				HTML += "<div id='SR_offense'><div id='SR_offMain'>\
							<div class='textFramed'><div class='offAU legend'><span>Unit Name:</span><span>Number:</span>\
							<span style='border-top: 1px solid #AAAAAA;'>Info:</span></div>";
				$.each(report.offNames, function(i, v) {
					if(i > 5 || typeof(report.offBegin[i]) == "undefined") return false;
					HTML += "<div class='offAU' " + ((v == "empty" || v == "???")?"style='color: #AAAAAA !important;'":"style='background-image:none, url(SPFrames/Units/"+v+".png);'") 
							+ "><span class='offName'>" + v + "</span><span class='offNumB'>" 
							+ report.offBegin[i] + "</span>";
					if(typeof(report.offStats[i]) != "undefined") {
						HTML += "<div class='offNumE'><ul>";
						$.each(report.offStats[i], function(j, v) {
							if(v.match(/wpns/i) != null) {
							HTML += "<li>" + v.replace(/,/g,"<br/>").replace(/\s/,"<br />") + "</li>";
							} else {
								HTML += "<li>" + v + "</li>";
							}
						});
						HTML += "</ul></div>";
					}
					HTML += "</div>";				
				});
				HTML += "</div></div>"; //close #SR_offMain
				if(report.offNames.length > 6) {
					HTML += "<div class='offSupp'><div class='textFramed'>";
					$.each(report.offNames, function(i, v) {
						if(i >5) {
							if(i % 6 == 0) {
								if(i!=6) {
									HTML += "</div></div><div class='offSupp'><div class='textFramed'>";
								}
								HTML += "<div class='offAU legend'><span>Unit Name:</span><span>Number:</span>\
										<span style='border-top: 1px solid #AAAAAA;'>Info:</span></div>";
							}
							HTML += "<div class='offAU' " + ((v == "empty" || v == "???")?"style='color: #AAAAAA !important;'":"style='background-image:none, url(SPFrames/Units/"+v+".png);'")
									+ "><span class='offName'>" + v + "</span><span class='offNumB'>" 
									+ report.offBegin[i] + "</span>";
							if(typeof(report.offStats[i]) != "undefined") {
								HTML += "<div class='offNumE'><ul>";
								$.each(report.offStats[i], function(j, v) {
									if(v.match(/wpns/i) != null) {
									HTML += "<li>" + v.replace(/,/g,"<br/>").replace(/\s/,"<br />") + "</li>";
									} else {
										HTML += "<li>" + v + "</li>";
									}
								});
								HTML += "</ul></div>";
							}
							HTML += "</div>";				
						}
					});
					HTML += "</div></div>"; //close .offSupp
				}
				HTML += "</div>";	//close #SR_offense
			}
			HTML += "<div id='SR_resTaken'>" + report.Headers.split(";")[0] + "</div><ul id='SR_bldgAmts'>Buildings at this location:";
			$.each(bldgAmts,function(i,v) {
				if(i % 2 == 0) {
					HTML += "<li>Level " + bldgAmts[i+1] + " " + v + "</li>";
				}
			});
			HTML += "</ul>";
		} else {
			HTML += "<div id='SR_BPgained'>"+report.bp+" BP "+((player.research.premiumTimer>0)?"Gained!":"would have been gained.")+"</div>";
			if(report.offNames.length > 0) {
				HTML += "<div id='SR_offense'>"+ ((report.support)?"--Support--":"--Attackers--") + "<div id='SR_offMain'><div class='textFramed'>\
							<div class='offAU legend'><span>Unit Name:</span><span>Sent:</span>\
							<span style='border-top: 1px solid #444444;'>" + ((report.support)?"Returned":"Lost") + ":</span></div>";
				$.each(report.offNames, function(i, v) {
					if(typeof(report.offBegin[i]) == "undefined") return false;
					if(i % 6 == 0 && i > 0) {
						HTML += "</div></div><div class='offSupp'><div class='textFramed'>\
								<div class='offAU legend'><span>Unit Name:</span><span>Sent:</span>\
								<span style='border-top: 1px solid #444444;'>" + ((report.support)?"Returned":"Lost") + ":</span></div>";
					}
					HTML += "<div class='offAU' " + ((v == "empty" || v == "???")?"style='color: #AAAAAA !important;'":"style='background-image:none, url(SPFrames/Units/"+v+".png);'")
							+ "><span class='offName'>" + v + "</span><span class='offNumB'>" 
							+ report.offBegin[i] + "</span><span class='offNumE'>"
							+ report.offEnd[i] + "</span></div>";		
				});
			}
			HTML += "</div></div></div>";	//close #SR_offense
			
			if(report.defNames.length > 0) {
				HTML += "<div id='SR_defense'>--Defenders--<div id='SR_defMain'><div class='textFramed'>\
							<div class='defAU legend'><span>Unit Name:</span><span>Beginning:</span>\
							<span style='border-top: 1px solid #444444;'>Lost:</span></div>";
				$.each(report.defNames, function(i, v) {
					if(typeof(report.defBegin[i]) == "undefined") return false;
						if(i % 6 == 0 && i > 0) {
							HTML += "</div></div><div class='defSupp'><div class='textFramed'>\
									<div class='defAU legend'><span>Unit Name:</span><span>Beginning:</span>\
									<span style='border-top: 1px solid #444444;'>End:</span></div>";
						}
						HTML += "<div class='defAU' " + ((v == "empty" || v == "???")?"style='color: #AAAAAA !important;'":"style='background-image:none, url(SPFrames/Units/"+v+".png);'")
								+ "><span class='defName'>" + v + "</span><span class='defNumB'>" 
								+ report.defBegin[i] + "</span><span class='defNumE'>"
								+ report.defEnd[i] + "</span></div>";			
				});
				HTML += "</div></div></div>";	//close #SR_defense
				if(((player.research.autoblastable && player.research.bhmblastable) || player.research.resblastable) && player.research.fbLinked && !report.blasted) {
					HTML += "<div id='SR_fbBlast' class='fbButton'>Share on Facebook!</div>";
				}
			}
			
			if(report.offdig || report.defdig) HTML += report.digMessage +"<br/>";
						
			var headers = report.Headers.split(";");
			if(headers.length > 2) {
				for(var i=0;i<headers.length-2;i++) {
					HTML += headers[i]+".<br/>";
				}
			}
			var resTaken = "";
			$.each(report.resTaken,function(i, v) {
				if(v > 0) {
					if(resTaken == "") resTaken = "Resources Taken:<br/>"+v;
					else resTaken += v;
					
					switch(i) {
						case 0:
							resTaken += " <img src='SPFrames/Buildings/UI/metal-icon.png' alt='Metal' />";
							break;
						case 1:
							resTaken += " <img src='SPFrames/Buildings/UI/wood-icon.png' alt='Timber' />";
							break;
						case 2:
							resTaken += " <img src='SPFrames/Buildings/UI/crystal-icon.png' alt='Crystal' />";
							break;
						case 3:
							resTaken += " <img src='SPFrames/Buildings/UI/food-icon.png' alt='Food' />";
							break;
					}
				}
			});
			HTML += "<div id='SR_resTaken'>" + resTaken + "</div>";
			
			var debrisText = "";
			$.each(report.debris, function(i,v) {
				if(v>0) {
					if(debrisText == "") debrisText = "Debris Generated:<br/>"+v;
					else debrisText += v;
					
					switch(i) {
						case 0:
							debrisText += " <img src='SPFrames/Buildings/UI/metal-icon.png' alt='Metal' />";
							break;
						case 1:
							debrisText += " <img src='SPFrames/Buildings/UI/wood-icon.png' alt='Timber' />";
							break;
						case 2:
							debrisText += " <img src='SPFrames/Buildings/UI/crystal-icon.png' alt='Crystal' />";
							break;
						case 3:
							debrisText += " <img src='SPFrames/Buildings/UI/food-icon.png' alt='Food' />";
							break;
					}
				}
			});
			HTML += "<div id='SR_debrisGen'>"+debrisText+"</div>";
		}
		if(report.combatHeader != "No data on this yet.") {
			HTML += "<div id='SR_combatInfoBox'><div id='SR_combatInfoBar'>\
						<a href='javascript:;' id='SR_more-lessInfo'></a><span>Additional Combat Information\
						</span></div><div id='SR_combatInfo'>" + report.combatHeader.replace(/\u002e(?=\D)/g,".<br/>") + "</div></div>";
		}
		
		HTML += "<div id='SR_buttons'><a href='javascript:;' id='SR_delete'>Delete</a>";
		if(report.archived) {
		HTML += "<a href='javascript:;' id='SR_unarchive'>Unarchive</a></div>";
		} else {
		HTML += "<a href='javascript:;' id='SR_archive'>Archive</a></div>";
		}
		
		$("#SR_window").fadeOut("fast", function() {
			SR.api.getContentPane().html(HTML);
			$(this).fadeIn("fast");
			SR.api.reinitialise();
			markRead = new make_AJAX();
			markRead.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
							+ ".markReadUserSR(" + report.id + ");");
			report.read = true;
			check_for_unread();
			
			$("#SR_delete").unbind('click').click(function() {
				deleteSR = new make_AJAX();
				deleteSR.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
								+ ".deleteUserSR(" + report.id + ");");
				
				$.each(SR.reports,function(i, v) {
					if(report.id == v.id) SR.reports.splice(i, 1);
				});
				$("#SR_allTab").click();
			});
			
			$("#SR_archive").unbind('click').click(function() {
				archiveSR = new make_AJAX();
				archiveSR.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
								+ ".archiveUserSR(" + report.id + ");");
				
				$.each(SR.reports,function(i, v) {
					if(report.id == v.id) SR.reports[i].archived = true;
				});
				$("#SR_allTab").click();
			});	
			$("#SR_unarchive").unbind('click').click(function() {
				unarchiveSR = new make_AJAX();
				unarchiveSR.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
								+ ".unarchiveUserSR(" + report.id + ");");
				
				$.each(SR.reports,function(i, v) {
					if(report.id == v.id) SR.reports[i].archived = false;
				});
				$("#SR_allTab").click();
			});
			
			$("#SR_offense img, .offSupp img, #SR_defense img, .defSupp img").unbind("click").click(function(){
				//display_message(unit name, [unit pic, unit desc, unit stats(if applicable)]);
			});
			
			//adjust text sizes to fit
			$(".offName, .defName").each(function() {
				var textSize = (100/$(this).width() > 1)? 100: Math.round((100/$(this).width())*100);
				$(this).css("fontSize", textSize + "%");
				$(this).parent().width(100);
				if($(this).parent().is(":last-child")) $(this).parent().css("border-right","none");
			});
			$("#SR_more-lessInfo").unbind("click").click(function() {
				$("#SR_combatInfo").animate({"opacity":"toggle","height":"toggle"},"fast",function(){
					SR.api.reinitialise();
				});
				$(this).toggleClass("open");
			});
			
			//adjust height of textFrames to remove spacers
			$(".textFramed").each(function(i,v) {
				$(this).css("height",($(this).height()-16)+"px");
			});
		});
		
		$("#SR_fbBlast").die("click").live("click",function(){
			FB.login(function(response) {
				if(response.session) {
					if(response.perms) {
						var desc = '';
						//0 = attacker, 1 = defender
						var numTroopsStart = [0,0];
						var numTroopsLoss = [0,0];
						var percentLoss = [0,0];
						$.each(report.offBegin, function(i,v) {
							numTroopsStart[0] += v;
							numTroopsLoss[0] += report.offEnd[i];
						});
						$.each(report.defBegin, function(i,v) {
							numTroopsStart[1] += v;
							numTroopsLoss[1] += report.defEnd[i];
						});
						percentLoss[0]=Math.round((numTroopsLoss[0]/numTroopsStart[0])*100);
						if(numTroopsStart[1]>0) percentLoss[1]=Math.round((numTroopsLoss[1]/numTroopsStart[1])*100);
						else percentLoss[1]=100;
						if(report.Headers.split(";").length > 2) {//it's a bombing
							if(report.genocide) { //glassing
								desc = "As part of a Glassing campaign, I "+((report.isDefender)?"was attacked":"attacked")+" with "+numTroopsStart[0]+" troops, some of which were Bombers.  "+((report.isDefender)?"I":"The defender")+" stood with "+numTroopsStart[1]+" troops.  "+((report.isDefender)?((percentLoss[0]>percentLoss[1])?"My enemy's bombers were destroyed long before they could do any damage to my city.":"My enemies numbers were too great and their bombers rained death upon my city."):((percentLoss[1]>percentLoss[0])?"Bombs rained down on my enemy's city.  Pulverising all that stood.":"Unfortunately, my enemy's defense were stronger then expected, and none of my bombers managed to do any damage."));
							} else if(report.nuke) {
							} else { //strafe
								desc = "In order to soften "+((report.isDefender)?"me up, I was attacked":"my opponent, I attacked")+" with "+numTroopsStart[0]+" troops, some of which were Bombers.  "+((report.isDefender)?"I":"The defender")+" stood with "+numTroopsStart[1]+" troops.  "+((report.isDefender)?((percentLoss[0]>percentLoss[1])?"My enemy's bombers were destroyed long before they could do any damage to my city.":"My enemies numbers were too great and their bombers rained death upon my city."):((percentLoss[1]>percentLoss[0])?"Bombs rained down on my enemy's city.  Pulverising all that stood.":"Unfortunately, my enemy's defense were stronger then expected, and none of my bombers managed to do any damage."));
							}
						} else if(report.invade) { //it's an invasion
							desc = "As part of an invasion, I "+((report.isDefender)?"was attacked":"attacked")+" with "+numTroopsStart[0]+" troops.  "+((report.isDefender)?"I":"The defender")+" stood with "+numTroopsStart[1]+" troops.  "+((report.isDefender)?((percentLoss[0]>percentLoss[1])?"I forced my attacker away and won by ":"I was routed by "):((percentLoss[1]>percentLoss[0])?"I beat down my enemy's door and won by ":"I was routed by "))+Math.abs(percentLoss[0]-percentLoss[1])+"%.  "+((report.isDefender)?((percentLoss[0]>percentLoss[1])?"":((report.invsucc)?"My forces were not enough to hold the city and it is now in the hands of my enemy.":"However, they lacked the force to take my city.")):((percentLoss[1]>percentLoss[0])?((report.invsucc)?"They lacked the force to repel me and now their city is mine!":"However, I lacked the force to take the city."):""));
						} else if(report.genocide) { //it's a siege
							desc = "As part of a continuing Siege, I "+((report.isDefender)?"was attacked":"attacked")+" with "+numTroopsStart[0]+" troops.  "+((report.isDefender)?"I":"The defender")+" stood with "+numTroopsStart[1]+" troops.  "+((report.isDefender)?((percentLoss[0]>percentLoss[1])?"I won this battle by ":"I was routed by "):((percentLoss[1]>percentLoss[0])?"I won this battle by ":"I was routed by "))+Math.abs(percentLoss[0]-percentLoss[1])+"%"+((report.isDefender)?".":((percentLoss[1]>percentLoss[0])?".  Soon, nothing will stand in my way!":", but I will win the war!"));
						} else { //it's an attack
							var resTaken = report.Headers.split(";");
							$.each(resTaken, function(i,v){
								if(v.match(/taken/)) {
									resTaken = v;
									return false;
								}
							});
							desc = "I "+((report.isDefender)?"was attacked":"attacked")+" with "+numTroopsStart[0]+" troops.  "+((report.isDefender)?"I":"The defender")+" stood with "+numTroopsStart[1]+" troops.  "+((report.isDefender)?((percentLoss[0]>percentLoss[1])?"I won this battle by ":"I was routed by "):((percentLoss[1]>percentLoss[0])?"I won this battle by ":"I was routed by "))+Math.abs(percentLoss[0]-percentLoss[1])+"% and "+resTaken;
						}
						FB.ui({	"method":"feed",
								"message":"Check this out!",
								"link":"http://www.aiwars.org",
								"picture":"http://www.aiwars.org/AIFrames/Juggy.jpg",
								"name":report.Subject,
								"caption":"Blasted from the AI Wars client",
								"description":desc},
								function(r){
									if(r && r.post_id) {
										display_message("Select Reward","Please choose one of the following rewards:<br/>\
																			Note: be careful what you choose.  Once you have clicked your choice you will be unable to change it.<br/><br/>\
																			<input type='checkbox' id='autoblastable' class='fbBlastReward' "+((player.research.autoblastable&&player.research.bhmblastable)?"":"disabled='disabled'")
																			+"/> One day of Autopilot for free!<br/><input type='checkbox' id='bhmblastable' class='fbBlastReward' "
																			+((player.research.autoblastable&&player.research.bhmblastable)?"":"disabled='disabled'")+"/> One day of Battlehard Mode for free!<br/>\
																			<input type='checkbox' id='resblastable' class='fbBlastReward' "+((player.research.resblastable)?"":"disabled='disabled'")
																			+"/> 25% of resources gained in this report as a bonus<br/><br/>You may click the \"Okay\" button below to save these bonuses for another report.\
																			<script type='text/javascript'>\
																			$('.fbBlastReward').unbind('click').click(function(){\
																				$(this).siblings().andSelf().each(function(){\
																					$(this).attr('disabled','disabled');\
																				});\
																				var reward = new make_AJAX();\
																				reward.callback = function() {display_output(true,reward.responseText);};\
																				reward.get('/AIWars/GodGenerator?reqtype=FBBlast&fuid="+response.session.uid+"&rewardChoice='+$(this).index('.fbBlastReward')+'&id="+report.id+"');\
																				$('#AIW_alertButton').click();\
																			});</script>");
									} else {
										display_output(true,"An error occured during this FB Blast:<br/>"+r.error.message,true);
										display_output(false,"Please try again later");
									}
								});
					}
				}
			}, {"perms":"publish_stream"});
		});
	});
	
	$("#window").fadeIn("fast");
	$("#SR_allTab").click();
}