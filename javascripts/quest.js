function get_quests(quests) {
	try {
		if(!quests) {
			var getQuests = new make_AJAX();
			getQuests.callback = get_quests;
			getQuests.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".getQuests();");
		} else {
			player.quests = $.parseJSON(quests);
			$("#Quests").unbind("click").click(function(){
				do_fade(show_quests, $(this));
			});
			display_output(false,"Quests Loaded!");
			clearTimeout(player.flickTimer);
			do_flick(false);
		}
	} catch(e) {
		display_output(true,"Error loading Quests!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_quests(true);
	}
}

function do_flick(async) {
	var duration = 600000; //10 minutes
	if(async) {
		var getFlick = new make_AJAX();
		
		getFlick.callback = function(response) {
								if(player.research.flicker != response) {
									player.research.flicker = response;
									do_flick();
								} else duration = 1800000; //30 minutes
							};
		
		getFlick.get("/AIWars/GodGenerator?reqtype=flickStatus&league="+player.league);
	} else {
		if(!player.research.flicker.match(/noFlick|BQ1|NQ1/)) {
			$.each(player.quests, function(i,v) {
				if(v.name == player.research.flicker) {
					display_quest(v);
					var noFlick = new make_AJAX();
					noFlick.get("/AIWars/GodGenerator?reqtype=noFlick&league="+player.league);
					return false;
				}
			});
		} else if(player.research.flicker.match(/BQ1|NQ1/)&&!tutorialRunning) {
			run_tutorial();
			duration = 900000; //15 minutes
		}
	}
	player.flickTimer = setTimeout(function() {do_flick(true);},duration);
}

function show_quests() {
	currUI = show_quests;
	
	var win = $("#window");
	
	$("#viewerback").css("background-image","url(SPFrames/Buildings/UI/menu-back.jpg)").html("").fadeIn("normal");
	win.contents().unbind();
	var questHTML = ["","",""];
	$.each(player.quests, function(i, v) {
		var classes = 'quest'+(v.name.match(/AQ\d/)?" noShow":"");
		if(v.status>0) {
			if(v.status==1) questHTML[1] +="<li class='"+classes+"' title='View Description'>" + (v.name.match(/BQ|RQ/)?v.name:v.info) + "</li>";
			else questHTML[2] +="<li class='"+classes+"' title='Quest Completed'>" + (v.name.match(/BQ|RQ/)?v.name:v.info) + "</li>";
		} else questHTML[0] +="<li class='"+classes+"' title='Join Quest'>" + (v.name.match(/BQ|RQ/)?v.name:v.info) + "</li>";
	});
	
	var HTML = "<div id='quest_outerBox'><div>Click on a quest to view its description or join it, if you haven't already.</div><ul id='quest_listNoStart'><span class='header'>Not Started</span>"
				+ questHTML[0] + "</ul><ul id='quest_listStarted'><span class='header'>In Progress</span>"+questHTML[1]+"</ul><ul id='quest_listFinished'><span class='header'>Finished</span>"
				+ questHTML[2] +"</ul></div>";
	win.html(HTML).fadeIn("fast");
	
	$(".quest").unbind("click").click(function(){
		var that = this;
		var currQuest = 0;
		var questGroup = [];
		if($(this).parent().is("#quest_listNoStart")) {
			currQuest = $(this).index("#quest_listNoStart .quest");
			questGroup = $.grep(player.quests, function(v,i) {
							return v.status == 0;
						});
		} else if($(this).parent().is("#quest_listStarted")) {
			currQuest = $(this).index("#quest_listStarted .quest");
			questGroup = $.grep(player.quests, function(v,i) {
							return v.status == 1;
						});
		} else {
			currQuest = $(this).index("#quest_listFinished .quest");
			questGroup = $.grep(player.quests, function(v,i) {
							return v.status == 2;
						});
		}
		var quest = questGroup[currQuest];
		if(quest.status>0) {
			display_quest(quest);
		} else {
			display_output(false,"Joining Quest...");
			var getQuestInfo = new make_AJAX();
			getQuestInfo.callback = function(response) {
				if(response.match(/true/)) {
					display_output(false,"Quest Joined!");
					$.each(player.quests, function(i,v) {
						if(v.qid == quest.qid) {
							v.status = 1;
							return false;
						}
					});
					$(that).appendTo("#quest_listStarted");
					display_quest(quest);
					var noFlick = new make_AJAX();
					noFlick.get("/AIWars/GodGenerator?reqtype=noFlick&league="+player.league);
					load_player(false, player.curtown.townID, false);
				} else {
					display_message("Info",quest.info);
				}
			};
			getQuestInfo.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".joinQuest("+quest.qid+");");
		}
	});
}

function display_quest(quest) {
	var api = $("#quest_text").data('jsp');
	if(!quest.text) {
		display_output(false,"Getting Quest Info...");
		var getQuestInfo = new make_AJAX();
		getQuestInfo.callback = function(response) {
			quest.text = $.parseJSON(response);
			$("#quest_status").text((quest.status==1)?"In Progress":"Completed");
			api.getContentPane().html(quest.text[0]);
			$("[style*='font-family:BankGothic']").css("font-family","")
												  .find("img").each(function(i,v) {
													switch(i) {
														case 0:
															$(this).attr("src","SPFrames/Buildings/UI/metal-icon.png");
															break;
														case 1:
															$(this).attr("src","SPFrames/Buildings/UI/wood-icon.png");
															break;
														case 2:
															$(this).attr("src","SPFrames/Buildings/UI/crystal-icon.png");
															break;
														case 3:
															$(this).attr("src","SPFrames/Buildings/UI/food-icon.png");
															break;
															
													}
												  });
			$("#quest_box").attr("style","").fadeIn();
			api.reinitialise();
			display_output(false,"Quest Info Loaded!");
		};
		getQuestInfo.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".getQuestLog("+quest.qid+");");
	} else {
		$("#quest_status").text((quest.status==1)?"In Progress":"Completed");
		api.getContentPane().html(quest.text[0]);
		$("[style*='font-family:BankGothic']").css("font-family","")
											  .find("img").each(function(i,v) {
												switch(i) {
													case 0:
														$(this).attr("src","SPFrames/Buildings/UI/metal-icon.png");
														break;
													case 1:
														$(this).attr("src","SPFrames/Buildings/UI/wood-icon.png");
														break;
													case 2:
														$(this).attr("src","SPFrames/Buildings/UI/crystal-icon.png");
														break;
													case 3:
														$(this).attr("src","SPFrames/Buildings/UI/food-icon.png");
														break;
														
												}
											  });
		$("#quest_box").attr("style","").fadeIn();
		api.reinitialise();
		display_output(false,"Quest Info Loaded!");
	}
	
	$("#quest_close").die("click").live("click",function() {
		$("#quest_box").fadeOut("fast");
	});
	$("#quest_titlebar").die("mousedown").live("mousedown",function(e) {
		if(e.which == 1) {
			var cLeft = $("#quest_box").css("left");
			var cTop = parseInt($("#quest_box").css("top"));
			cLeft = cLeft.match(/%/)? $("#quest_box").position().left : parseInt(cLeft);
			var mLeft = e.pageX;
			var mTop = e.pageY;
			$("body").unbind("mousemove").mousemove(function(e) {
				$("#quest_box").css("left", (cLeft-mLeft+e.pageX) + "px");
				$("#quest_box").css("top", (cTop-mTop+e.pageY) + "px");
			});
			$("body").unbind("mouseup").mouseup(function() {
				$(this).unbind("mousemove").unbind("mouseup");
			});
		}
	});
	$("#quest_leave").die("click").live("click",function(){
		var leaveQuest = new make_AJAX();
		leaveQuest.callback = function(){
			$("#quest_close").click();
			quest.status = 0;
			if(currUI === show_quests){ 
				show_quests();
			}
			
		};
		leaveQuest.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".leaveQuest("+quest.qid+");"+player.command+".pingQuest("+quest.qid+");");
	});
}