var RAI = {
			HTML : "<div id='RAI_options'><div id='RAI_active'></div><div id='RAI_syntaxHighlight' class='active' title='Uncheck to remove syntax highlighting (will also show caret position).'></div><div id='RAI_autosave' title='Automatically saves every 5 minutes.'></div><div id='RAI_autostart' title='Automatically restart script on server restart'></div></div><div id='RAI_scriptDisplay'></div><textarea id='RAI_script' class='highlight'></textarea><a href='javascript:;' id='RAI_new'></a><a href='javascript:;' id='RAI_run'></a><a href='javascript:;' id='RAI_save'></a><a href='javascript:;' id='RAI_stop'></a>"
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
			RAI.script = "// New Script Template\npackage Revelations."+player.username.toLowerCase().replace(/\s/g,"_")+";\n\nimport BattlehardFunctions.*;\nimport Revelations.RevelationsAI;\n\npublic class Revelations extends RevelationsAI {\n\n\t\t// place static and instance variables here:\n\n\tpublic Revelations(BattlehardFunctions bf) {\n\n\t\tsuper(bf);\n\t\t// your constructor code goes here:\n\n\t}\n\n\n\tpublic void run() {\n\t\t// your program code goes under this line.\n\n\n\t}\n\n}";
		}
		$("#RAI_script").val(RAI.script);
		parse_script();
		show_output_window();
		display_output(false,"Welcome to the Revelations AI Programming Interface!<br/><br/>For assistance beyond the quests, please stop by the Data Core on the <a href='http://battlehardalpha.xtreemhost.com' target='_forum'>Battlehard Forums</a>.");
		$("#console_expand").attr("checked","checked").click().attr("checked","checked");
		
		$("#window").fadeIn("fast");

	};
	getScript.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".isAlive();"+player.command+".getAutoRun();"+player.command+".editProgram();");
	
	$("#RAI_syntaxHighlight").unbind("click").click(function(){
		if($(this).hasClass("active")) {
			$("#RAI_script").removeClass("highlight");
			$("#RAI_scriptDisplay").addClass("nohighlight");
			$(this).removeClass("active");
		} else {
			$("#RAI_script").addClass("highlight");
			$("#RAI_scriptDisplay").removeClass("nohighlight");
			$(this).addClass("active");
		}
	});
	
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
	
	$("#RAI_script").unbind("keyup").keyup(function(){
		parse_script();
		$(this).scroll();
	}).unbind("keydown").keydown(function(e){
		if(e.which == 9) {
			e.preventDefault();
			insertAtCursor(document.getElementById("RAI_script"),"        ");
		}
	}).unbind("scroll").scroll(function(){
		$("#RAI_scriptDisplay").scrollTop($(this).scrollTop()).scrollLeft($(this).scrollLeft());
	});
	
	$("#RAI_new").unbind('click').click(function() {
		$("#RAI_script").val("// New Script Template\npackage Revelations."+player.username.toLowerCase().replace(/\s/g,"_")+";\n\nimport BattlehardFunctions.*;\nimport Revelations.RevelationsAI;\n\npublic class Revelations extends RevelationsAI {\n\n\t\t// place static and instance variables here:\n\n\tpublic Revelations(BattlehardFunctions bf) {\n\n\t\tsuper(bf);\n\t\t// your constructor code goes here:\n\n\t}\n\n\n\tpublic void run() {\n\t\t// your program code goes under this line.\n\n\n\t}\n\n}").keyup();
	});
	$("#RAI_save").unbind('click').click(function() {
		display_output(false, "Saving Program...");
		RAI.script = $("#RAI_script").val();
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
			} else if(response.match(/^false/i)) {
				var error = response.split("false:")[1];
				display_output(true, "Compiler Error:",true);
				display_output(true,error.replace(/\u003C/g,"&lt;").replace(/\u003E/g,"&gt;"));
			} else {
				display_output(true,"An Error has occured.",true);
				display_output(true,repsonse);
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

//http://alexking.org/blog/2003/06/02/inserting-at-the-cursor-using-javascript#comment-3817
function insertAtCursor(myField, myValue) {
  //IE support
  if (document.selection) {
    var temp;
    myField.focus();
    sel = document.selection.createRange();
    temp = sel.text.length;
    sel.text = myValue;
    if (myValue.length == 0) {
      sel.moveStart('character', myValue.length);
      sel.moveEnd('character', myValue.length);
    } else {
      sel.moveStart('character', -myValue.length + temp);
    }
    sel.select();
  }
  //MOZILLA/NETSCAPE support
  else if (myField.selectionStart || myField.selectionStart == '0') {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
    myField.selectionStart = startPos + myValue.length;
    myField.selectionEnd = startPos + myValue.length;
  } else {
    myField.value += myValue;
  }
}

function parse_script() {
	var script = $("#RAI_script").val().replace(/\u003C/g,"&lt;").replace(/\u003E/g,"&gt;").replace(/\t/g,"        ").replace(/("(\\.|[^"])*")|('(\\.|[^'])*')/g,surround_string).replace(/\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|double|do|else|enum|extends|false|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|true|try|void|volatile|while)(?=(\u002E|\s|\u0028|\u0029|\u005B))/g,surround).replace(/([A-Za-z]?\d+\u002e?\d*[A-Za-z]*)/g,surround_num);
	var temp = script.split("//");
	script = "";
	$.each(temp, function(i,v) {
		if(i>0) script += "<span class='comment'>//" + ((v.indexOf("\n") != -1)?v.replace("\n","</span>\n"):v+"</span>");
		else script += v;
	});
	// temp = script.split("/*");
	// $.each(temp, function(i,v) {
		// if(i>0) {
			// var subTemp = v.split("*/");
			// if(subTemp.length>1) {
				// $.each(subTemp, function(j,w) {
					// if(j!=subTemp.length-1) script += "<span class='comment'>/*"+w+"*/</span>";
					// else script += w;
				// });
			// }
		// } else script += v;
	// });
	$("#RAI_scriptDisplay").html(script);
}
//the surround methods here take a match to a RegExp or a string and returns the string/match surrounded by spans
function surround(match) {
	return "<span class='magicWord'>"+match+"</span>";
};
function surround_num(match) {
	if(match.match(/^[A-z]/)) return match;
	return "<span class='number'>"+match+"</span>";
};
function surround_string(match) {
	return "<span class='string'>"+match+"</span>";
};
function surround_regexp(match) {
	return "<span class='regExp'>"+match+"</span>";
};