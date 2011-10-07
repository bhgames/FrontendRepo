var RAI = {
			HTML : "<div id='RAI_options'>\
						<div id='RAI_active'></div>\
						<div id='RAI_autosave' title='Automatically saves every 5 minutes.'>Autosave</div>\
						<div id='RAI_autostart' title='Automatically restart script on server restart'>Autostart</div>\
					</div>\
					<pre id='RAI_scriptDisplay'></pre>\
					<div id='RAI_controls'>\
						<div id='RAI_new'>New Template</div>\
						<div id='RAI_run'>Run Program</div>\
						<div id='RAI_save'>Save Program</div>\
						<div id='RAI_stop'>Stop Program</div>\
					</div>",
			//the new templates includes some text before this, but can't be written in until the player is loaded
			template : "\n\nimport BattlehardFunctions.*;\nimport Revelations.RevelationsAI2;\n\npublic class Revelations extends RevelationsAI2 {\n\n\t// place static and instance variables here:\n\n\tpublic Revelations(BattlehardFunctions bf) {\n\n\t\tsuper(bf);\n\t\t// your constructor code goes here:\n\n\t}\n\n\tpublic void daily()  { \n\t\t//runs every 24 hours from the time of script execution\n\t}\n\n\tpublic void hourly() { \n\t\t//runs every hour from the time of script execution\n\t}\n\n\tpublic void onIncomingRaidDetected(UserRaid r) {\n\t\t//fires whenever an incoming raid is detected.  Does not false positive on your own raids.\n\t\t//r is a reference to the incoming raid\n\t}\n\n\tpublic void onOutgoingRaidLanding(UserRaid r) {\n\t\t//fires directly before one of your raids lands\n\t\t//r is a reference to the raid that is about to land\n\t}\n\n\tpublic void onOutgoingRaidReturning(UserRaid r) {\n\t\t//fires directly after one of your raids lands.\n\t\t//r is a reference to the returning raid\n\t}\n\n\tpublic void onMessageReceived(UserMessage m) {\n\t\t//fires whenever a new message is received.\n\t\t//m is a reference to the message\n\t}\n\n\tpublic void onBuildingFinished(UserBuilding b) {\n\t\t//fires whenever a building finishes upgrading\n\t\t//b is a reference to the building\n\t}\n\n\tpublic void onAttackUnitQueueEmpty(UserBuilding b) {\n\t\t//fires whenever the last attack unit in a queue finishes\n\t\t//b is a reference to the Arms Factory with the now empty queue\n\t}\n\n\tpublic void onEnemyTownInvaded(UserTown t) {\n\t\t//fires whenever you successfully invade a town\n\t\t//t is a reference to the invaded town\n\t}\n\t\t\n\tpublic void onOutgoingTradeLanding(UserTrade t) {\n\t\t//fires directly before a trade reaches its destination\n\t\t//t is a reference to the trade that just landed\n\t}\n\n\tpublic void onOutgoingTradeReturning(UserTrade t) {\n\t\t//fires directly after a trade reaches its destination\n\t\t//t is a reference to this trade\n\t\t   \n\t}\n}"
		};
function build_RAI_interface() {
	currUI = build_RAI_interface;
	var win = $("#window");
	win.contents().unbind();
	win.html(RAI.HTML);
	
	$("#viewerback").html("").css("background-image","url(SPFrames/rusted-metal.jpg)").fadeIn();
	
	var getScript = new make_AJAX();
	getScript.callback = function(response) {
		var info = response.split(";");
		var isAlive = info[0];
		var autoRun = info[1];
		var script = info.slice(2,info.length);
		script = script.join(";");
		if(isAlive.match(/true/)) {
			$("#RAI_active").addClass("active");
		}
		if(autoRun.match(/true/)) {
			RAI.autorun = true;
			$("#RAI_autostart").attr("checked","checked");
		} else {
			RAI.autorun = false;
		}
		if(RAI.autosave) {
			$("#RAI_autosave").attr("checked","checked");
		}
		if(script.match(/\w/)) {
			RAI.script = script;
		} else {
			RAI.script = "// New Script Template\npackage Revelations."+player.username.toLowerCase().replace(/\s/g,"_")+";"+RAI.template;
		}
		$("#RAI_scriptDisplay").text(RAI.script);
		show_output_window();
		display_output(false,"Welcome to the Revelations AI Programming Interface!<br/><br/>For assistance beyond the quests, please stop by the Data Core on the <a href='http://forum.aiwars.org' target='_forum'>Battlehard Forums</a>.");
		$("#console_expand").attr("checked","checked").click().attr("checked","checked");
		
		win.fadeIn("fast");
		//Ace Editor code ---------------------------------------------------------------------------------------------------------
		RAI.editor = ace.edit("RAI_scriptDisplay");
		RAI.editor.setTheme("ace/theme/aiwars");
		
		var JavaMode = require("ace/mode/java").Mode;
		RAI.editor.getSession().setMode(new JavaMode());
		//end Ace Editor code -----------------------------------------------------------------------------------------------------
		
		RAI.editor.getSession().on('change', function() {
			RAI.script = RAI.editor.getSession().getValue();
		});

	};
	getScript.post("reqtype=command&command=bf.isAlive();bf.getAutoRun();bf.editProgram();");
	
	
	$("#RAI_autosave").unbind("click").click(function(){
		if($(this).hasClass("active")) {
			clearInterval(RAI.autosave);
			RAI.autosave = false;
			$(this).removeClass("active");
		} else {
			RAI.autosave = setInterval(function(){$("#RAI_save").click();},300000);
			$(this).addClass("active");
		}
	});
	
	$("#RAI_autostart").unbind("click").click(function(){
		var that = this;
		var auto = !$(this).hasClass("active");
		
		if(auto) $(this).addClass("active");
		else $(this).removeClass("active");
		
		display_output(false,"Setting AutoRun flag to "+auto);
		try{setAutoStart.abort();}catch(e){}
		var setAutoStart = new make_AJAX();
		setAutoStart.callback = function(response) {
			if(response.match(/true/)) {
				display_output(false,"AutoRun flag set!");
				RAI.autorun = true;
			} else {
				display_output(true,"AutoRun flag not set!");
				$(that).removeClass("active");
				RAI.autorun = false;
			}
		};
		setAutoStart.get("reqtype=command&command=bf.setAutoRun("+auto+");");
	});
	
	$("#RAI_new").unbind('click').click(function() {
		RAI.editor.getSession().setValue("// New Script Template\npackage Revelations."+player.username.toLowerCase().replace(/\s/g,"_")+";"+RAI.template);
	});
	$("#RAI_save").unbind('click').click(function() {
		display_output(false, "Saving Program...");
		var save = new make_AJAX();
		save.callback = function(response) {
			if(response.match(/^true/i)) {
				display_output(false, "Program Saved Sucessfully");
			} else {
				var error = response.split(":")[1] || response;
				display_output(true, error);
			}
		};
		save.post("/AIWars/GodGenerator","reqtype=saveProgram&program="+encodeURIComponent(RAI.script.replace(/\u0027/igm,"\\'"))+"&league="+player.league);
	});
	$("#RAI_run").unbind('click').click(function() {
		display_output(false, "Running Program...");
		var run = new make_AJAX();
		run.callback = function(response) {
			if(response.match(/^true/i)) {
				display_output(false, "Program Running!");
				$("#RAI_active").addClass("active");
			} else if(response.match(/^false:/i)) {
				var error = response.split("false:")[1];
				display_output(true, "Compiler Error:",true);
				display_output(true,error.replace(/\u003C/g,"&lt;").replace(/\u003E/g,"&gt;"));
			} else {
				display_output(true,"An Error has occured.",true);
				display_output(true,"response was "+response);
				display_output(false,"Please report this to the developers via the feedback button on the left.");
			}
		};
		run.get("reqtype=command&command=bf.runProgram();");
	});
	$("#RAI_stop").unbind('click').click(function() {
		display_output(false, "Stopping Program...");
		var stop = new make_AJAX();
		stop.callback = function(response) {
			if(response.match(/^true/i)) {
				display_output(false, "Program Stopped.");
				$("#RAI_active").removeClass("active");
			} else {
				display_output(true, response.split(":")[1]);
			}
		};
		stop.get("reqtype=command&command=bf.stopProgram();");
	});
}