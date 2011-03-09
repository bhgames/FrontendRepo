var RAI = {
			HTML : "<div id='RAI_options'><div id='RAI_active'></div><div id='RAI_autosave' title='Automatically saves every 5 minutes.'></div><div id='RAI_autostart' title='Automatically restart script on server restart'></div></div><pre id='RAI_scriptDisplay'></pre><a href='javascript:;' id='RAI_new2'>Rev 2.0 Template</a><a href='javascript:;' id='RAI_new'></a><a href='javascript:;' id='RAI_run'></a><a href='javascript:;' id='RAI_save'></a><a href='javascript:;' id='RAI_stop'></a>",
			//the new templates includes some text before this, but can't be written in until the player is loaded
			template : "\n\nimport BattlehardFunctions.*;\nimport Revelations.RevelationsAI;\n\npublic class Revelations extends RevelationsAI {\n\n\t// place static and instance variables here:\n\n\tpublic Revelations(BattlehardFunctions bf) {\n\n\t\tsuper(bf);\n\t\t// your constructor code goes here:\n\t\t\n\t}\n\n\tpublic void run() {\n\t\t\n\t}\n\n}",
			template2 : "\n\nimport BattlehardFunctions.*;\nimport Revelations.RevelationsAI2;\n\npublic class Revelations extends RevelationsAI2 {\n\n\t// place static and instance variables here:\n\n\tpublic Revelations(BattlehardFunctions bf) {\n\n\t\tsuper(bf);\n\t\t// your constructor code goes here:\n\n\t}\n\n\tpublic void onIncomingRaidDetected(UserRaid r) {\n\t\t\n\t}\n\n\tpublic void onOutgoingRaidReturning(UserRaid r) {\n\t\t\n\t}\n\n\tpublic void daily() {\n\t\t\n\t}\n\n\tpublic void hourly() {\n\t\t\n\t}\n\n\n}"
		}
function build_RAI_interface() {
	currUI = build_RAI_interface;
	
	$("#window").contents().unbind();
	$("#window").html(RAI.HTML);
	
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
		display_output(false,"Welcome to the Revelations AI Programming Interface!<br/><br/>For assistance beyond the quests, please stop by the Data Core on the <a href='http://battlehardalpha.xtreemhost.com' target='_forum'>Battlehard Forums</a>.");
		$("#console_expand").attr("checked","checked").click().attr("checked","checked");
		
		$("#window").fadeIn("fast");
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
	getScript.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".isAlive();"+player.command+".getAutoRun();"+player.command+".editProgram();");
	
	
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
		setAutoStart.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".setAutoRun("+auto+");");
	});
	
	$("#RAI_new").unbind('click').click(function() {
		RAI.editor.getSession().setValue("// New Script Template\npackage Revelations."+player.username.toLowerCase().replace(/\s/g,"_")+";"+RAI.template);
	});
	$("#RAI_new2").unbind('click').click(function() {
		RAI.editor.getSession().setValue("// New Script Template\npackage Revelations."+player.username.toLowerCase().replace(/\s/g,"_")+";"+RAI.template2);
	});
	$("#RAI_save").unbind('click').click(function() {
		display_output(false, "Saving Program...");
		var save = new make_AJAX();
		save.callback = function(response) {
			if(response.match(/^true/i)) {
				display_output(false, "Program Saved Sucessfully");
			} else {
				display_output(true, response.split(":")[1]);
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
		run.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".runProgram();");
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
		stop.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".stopProgram();");
	});
}