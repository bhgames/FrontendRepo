var messages = {};

function get_messages(async,mess, UG) {
	try {
		if(async) {
			getMess = new make_AJAX();
			getMess.callback = function(response) {
									response = response.split(";");
									get_messages(false,response[0],response[1]);
								};
			getMess.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".getMessages();" + player.command + ".getUserGroups();");
		} else {
			if(messages.curr) {
				var temp = messages.curr; 
				var temp2 = messages.currGroup;
			}
			var reload = messages.reload;
			messages.messages = $.parseJSON(mess).reverse();
			display_output(false,"Messages Loaded!");
			messages.UG = $.parseJSON(UG);
			display_output(false,"User Groups Loaded!");
			if(temp){
				messages.curr=temp;
				messages.currGroup = temp2;
			}
			if(reload&&currUI===build_message_UI) currUI();
			check_for_unread();
			$("#mailbox").unbind('click').click(function() {
				do_fade(build_message_UI,"amber");
			});
		}
	} catch(e) {}
}

function build_message_UI() {
	display_output(false,"Launchinig Dragonfyre Mail Client...");
	currUI = build_message_UI;
	$("#window").contents().unbind();
	$("#window").html("<div id='Mess_outerBox'><div class='darkFrameBody'><a href='javascript:;' id='mess_newMess'></a><a href='javascript:;' id='mess_notepad' title='notepad'></a><a href='javascript:;' id='mess_inbox'></a><a href='javascript:;' id='mess_groups'></a><div id='mess_window'></div></div><div class='darkFrameBL-BR-B'><div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div></div></div>");
	
	$("#mess_window").jScrollPane({showArrows:true,hideFocus:true});
	messages.api = $("#mess_window").data('jsp');
	messages.api.read = true;
	
	display_output(false,"Connecting to DMS Servers...");
	$("#mess_inbox").unbind('click').click(function() {
		var HTML = "<div id='mess_innerbox'>";
		$.each(messages.messages, function(i, v) {
			var unreadInGroup = false;
			$.each(v, function(j,w){
				if(!w.read){unreadInGroup=true;return false;}
			});
			HTML += "<div class='messGroup'><a href='javascript:;' class='messExpand'></a><span>" + v[0].subject.replace(/<u44>/ig,",").replace(/<u3B>/g,";").replace(/</g,"&lt;").replace(/>/g,"&gt;") +(unreadInGroup?" *NEW*":"") + "</span><input type='checkbox' class='groupSelect' /><a href='javascript:;' class='viewConvo'></a><div class='messages'><ul>";
			$.each(v, function(j, w) {
				HTML += "<li><a href='javascript:;' class='message" + ((w.read)?" read":"") + "'>" + w.subject.replace(/<u44>/ig,",").replace(/<u3B>/g,";").replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</a><span class='names'> " + ((w.usernameFrom == player.username)?"To: " + w.usernameTo:"From: " + w.usernameFrom) + "</span><input type='checkbox' class='messSelect' /></li>";
			});
			HTML += "</ul></div></div>";
		});
		
		HTML += "</div><div id='mess_addNav'><a href='javascript:;' id='mess_markAll'>Mark All</a><a href='javascript:;' id='mess_markRead'> Mark Read </a><a href='javascript:;' id='mess_delete'> Delete </a></div>";
		
		$("#mess_window").fadeOut('fast', function() {
			messages.api.getContentPane().html(HTML);
			$(this).fadeIn('fast');
			messages.api.reinitialise();
		});
	}).click();
	
	$("#mess_window a").unbind('click').click(function() {
		if($(this).is("#mess_inbox")) {
			$("#mess_window").addClass("inbox");
		} else {
			$("#mess_window").removeClass("inbox");
		}
	});
	
	var checked = false;
	$("#mess_markAll").die('click').live('click',function() {
		checked = !checked;
		$(".groupSelect, .messSelect").each(function(i, v) {
			v.checked = checked;
		});
	});
	
	$(".groupSelect").die('click').live('click',function() {
		var that = this;
		$(this).siblings(".messages").find(".messSelect").each(function(i, v) {
			v.checked = that.checked;
		});
	});
	
	$(".messSelect").die('click').live('click', function() {
		var groupSelected = true;
		$(this).parent().parent().find(".messSelect").each(function(i, v) {
			if(!v.checked) {
				groupSelected = false;
			}
		});
		$(this).parent().parent().parent().siblings(".groupSelect").attr("checked",groupSelected);
	});
	
	$(".messExpand").die('click').live('click', function() {
		var group = $(this).parent();
		if(group.hasClass("open")) {
			group.removeClass("open");
		} else {
			group.addClass("open");
		}
	});
	
	$("#mess_markRead").die('click').live('click',function() {
		var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
		display_output(false,"Marking Messages Read...");
		$(".groupSelect").each(function(i, v) {
			if(v.checked) {
				$.each(messages.messages[i], function(j, w) {
					getPath += player.command + ".markReadMessage(" + w.messageID + ");";
					w.read = true;
				});
				$(v).siblings(".messages").find("a").addClass("read");
			} else {
				$(v).siblings(".messages").find(".messSelect").each(function(j, w) {
					if(w.checked) {
						getPath += player.command + ".markReadMessage(" + messages.messages[i][j].messageID + ");";
						messages.messages[i][j].read = true;
						$(w).siblings("a").addClass("read");
					}
				});
			}
		});
		
		var massRead = new make_AJAX();
		massRead.callback = function() {
			display_output(false," Messages Marked Read!");
			get_messages(true);
		};
		massRead.get(getPath);
		checked = true;
		$("#mess_markAll").click();
	});
	
	$("#mess_delete").die('click').live('click',function() {
		var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
		display_output(false,"Deleting Messages...");
		try {
			var deletedGroup = [];
			var elementGroup = [];
			$(".groupSelect").each(function(i, v) {
				if(v.checked) {
					$.each(messages.messages[i], function(j, w) {
						getPath += player.command + ".markDeletedMessage(" + w.messageID + ");";
					});
					deletedGroup.push(i);
					elementGroup.push($(v));
				} else {
					var deleted = [];
					var element = [];
					$(v).siblings(".messages").find(".messSelect").each(function(j, w) {
						if(w.checked) {
							getPath += player.command + ".markDeletedMessage(" + messages.messages[i][j].messageID + ");";
							element.push($(w));
							deleted.push(j);
						}
					});
					$.each(deleted,function(j,w){
						messages[i].splice(w-j,1);
						element[j].parent().remove();
					});
				}
			});
			$.each(deletedGroup,function(i,v){
				messages.messages.splice(v-i,1);
				elementGroup[i].parent().remove();
			});
		} catch(e) {
			console.log(e);
			console.log(getPath);
		}
		
		var massDel = new make_AJAX();
		massDel.callback = function() {
			display_output(false,"Messages Deleted!");
			get_messages(true);	
		};
		massDel.get(getPath);
		checked = true;
		$("#mess_markAll").click();
	});
	//*************************************User Groups********************************************************************************************************
	$("#mess_groups").unbind('click').click(function() {
		var HTML = "<select id='mess_groupSelect' size='10'>";
		$.each(messages.UG, function(i,v) {
			HTML += "<option>" + v.name + "</option>";
		});
		HTML += "</select><input type='text' id='mess_groupName' value='New User Group' maxlength='20' /><textarea id='mess_groupPlayers'>Put a semicolon separated list of player names here.\nEx. Player1;Player2;Player3</textarea><a href='javascript:;' id='mess_newGroup'></a><a href='javascript:;' id='mess_saveGroup'></a><a href='javascript:;' id='mess_loadGroup'></a><a href='javascript:;' id='mess_deleteGroup'></a>";
		$("#mess_window").fadeOut("fast",function(){
			messages.api.getContentPane().html(HTML);
			$(this).fadeIn('fast');
			messages.api.reinitialise();
		});
	});
	$("#mess_groupName").die('focus').live("focus",function() {
		if($(this).val() == "New User Group") $(this).val("");
	}).die('blur').live("blur",function(){
		if($(this).val() == "") {
			$(this).val("New User Group");
		}
	});
	$("#mess_groupPlayers").die('focus').live("focus",function() {
		if($(this).val() == "Put a semicolon separated list of player names here.\nEx. Player1;Player2;Player3") $(this).val("");
	}).die('blur').live("blur",function(){
		if($(this).val() == "") {
			$(this).val("Put a semicolon separated list of player names here.\nEx. Player1;Player2;Player3");
		}
	});
	$("#mess_newGroup").die('click').live("click",function() {
		$("#mess_groupName").val("New User Group");
		$("#mess_groupPlayers").val("");
	});
	$("#mess_saveGroup").die('click').live("click",function() {
		var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
		var saveGroup = new make_AJAX();
		display_output(false,"Saving Group...");
		var newUG = {
						name : $("#mess_groupName").val(),
						usernames : $("#mess_groupPlayers").val().split(";")
					};
		var add = true;
		$.each(messages.UG, function(i,v){
			if(v.name == newUG.name) {
				v.usernames = newUG.usernames;
				add = false;
				return false;
			}
		});
		if(add) {
			messages.UG.push(newUG);
			$('#mess_groupSelect').append("<option>"+newUG.name+"</option>");
		} else {
			getPath += player.command+".deleteUserGroup("+newUG.name+");"
		}
		getPath += player.command+".createUserGroup("+newUG.name+",["+newUG.usernames+"]);";
		saveGroup.callback = function(response) {
			if(response.match(/true/)) {
				display_output(false,"Group Saved!");
			} else {
				display_output(true,"Unable to Save Group!",true);
				display_output(false,"This group may be protected or an error may have occurred.");
			}
		};
		saveGroup.get(getPath);
		
	});
	$("#mess_loadGroup").die('click').live("click",function() {
		var index = $('#mess_groupSelect :selected').index("#mess_groupSelect option");
		$("#mess_groupName").val(messages.UG[index].name);
		$("#mess_groupPlayers").val(messages.UG[index].usernames.join(";"));
	});
	$("#mess_deleteGroup").die('click').live("click",function() {
		if(confirm("Are you sure you want to delete this user group?")) {
			var index = $('#mess_groupSelect :selected').index("#mess_groupSelect option");
			$('#mess_groupSelect :selected').remove();
			display_output(false,"Deleteing Group...");
			var delGroup = new make_AJAX();
			delGroup.callback = function() {
				display_output(false,"Group Deleted!");
				messages.UG.splice(index,1);
			};
			delGroup.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".deleteGroup("+messages.UG[index].name+");");
		}
	});
	//*******************************Convo View**********************************************************************************************************************
	$(".viewConvo, #mess_showConvo").die('click').live('click',function() {
		if($(this).is(".viewConvo")) {
			messages.currGroup = $(this).index(".viewConvo");
			messages.curr = messages.messages[messages.currGroup][0];
		}
		var participants = messages.curr.usernameTo.concat(messages.curr.usernameFrom);
		$.each(participants, function(i,v) {
			if(v == player.username) {participants.splice(i, 1); return false;}
		});
		
		var HTML = "<h2 id='mess_header'>";
		if(participants.length < 10) {
			HTML += "Conversation between you" + ((participants.length > 1)?", ":" ");
			$.each(participants, function(i, v) {
				HTML += (i == participants.length - 1)?"and " + v:v + ", ";
			});
		} else {
			HTML += "Conversation View";
		}
		HTML += "</h2><div id='mess_convo'>";
		var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
		$.each(messages.messages[messages.currGroup], function(i, v) {
			if(!v.read) {getPath += player.command + ".markReadMessage(" + v.messageID + ");";v.read=true;}
			HTML += "<div class='convoMessage" + ((v.usernameFrom == player.username)?" fromSelf'":"'") + "><a href='javascript:;' class='deleteMess' title='Delete Message'></a><div class='messSender'>" 
					+ v.usernameFrom + "</div><div class='messSubject'>" + v.subject.replace(/<u44>/ig,",").replace(/<u3B>/g,";").replace(/<script/g,"") + "</div><div class='messBodyBox'><div class='messBodyGrad'><div class='messBodyTop'><div class='messBodyBottom'><div class='messBody'>" 
					+ v.body.replace(/<u44>/ig,",").replace(/<u3B>/g,";").replace(/<script/g,"");
			if(messages.curr.msgtype == 1 && i==0) {
				HTML += "\n\nClick <a href='javascript:;' class='confirmTrade'>here</a> to accept this trade request.";
			} else if(messages.curr.msgtype ==3 && i==0) {
				HTML += "\n\nClick <a href='javascript:;' class='confirmInvite'>here</a> to accept this invite.";
			} else if(messages.curr.msgtype == 6) {
				HTML+= "\n\nYou may <a href='#' class='confReward'>accept</a> or <a href='#' class='decReward'>decline</a> your reward.\nDeclining your reward will allow you to pursue a better reward.";
			}
			HTML += "</div></div></div></div></div></div>";
		});
		HTML += "</div><div id='mess_replyTo' class='fromSelf'><div class='messSender'><span>To:</span> <input type='text' id='mess_recip' value='" 
				+ participants.join(";") + "' /></div><div class='messSubject'><input type='text' id='mess_subject' maxlength='100' value='" 
				+ messages.curr.subject.replace(/<u44>/ig,",") + "' /></div><div class='messBodyBox'><div class='messBodyGrad'><div class='messBodyTop'><div class='messBodyBottom'><div class='messBody quickReply'><textarea id='mess_bodyText'></textarea></div></div></div></div></div></div><a href='javascript:;' id='mess_sendMess' class='quickReply'></a><a href='javascript:;' id='mess_deleteConvo' title='Delete Conversation'></a></div>";
				
		$("#mess_window").fadeOut('fast',function() {
			messages.api.getContentPane().html(HTML);
			$(this).fadeIn('fast');
			messages.api.reinitialise();
		});
		
		display_output(false,"Marking Messages Read...");
		var markRead = new make_AJAX();
		markRead.callback = function() {
			display_output(false,"Messages Marked Read!");
			check_for_unread();
		};
		markRead.get(getPath);
	});
	//**********************************Message View***************************************************************************************************************
	$(".message").die('click').live('click',function(){
		var that = $(this);
		var messGroup = that.parent().parent().parent().index(".messages");
		var messInd = that.parent().parent().children("li").index(that.parent());
		
		messages.curr = messages.messages[messGroup][messInd];
		messages.currGroup = messGroup;
		
		var participants = messages.curr.usernameTo.concat(messages.curr.usernameFrom);
		$.each(participants, function(i,v) {
			if(v == player.username) {participants.splice(i, 1); return false;}
		});
		var HTML = "<h2 id='mess_header'>" + messages.curr.subject.replace(/<u44>/ig,",").replace(/<u3B>/g,";").replace(/<script/g,"") + "</h2><a href='javascript:;' id='mess_showConvo'></a><div id='mess_box'" 
					+ ((messages.curr.usernameFrom == player.username)?" class='fromSelf'":"") + "><div class='messSender'>" 
					+ participants + "</div><div class='messBodyBox'><div class='messBodyGrad'><div class='messBodyTop'><div class='messBodyBottom'><div class='messBody'>" 
					+ messages.curr.body.replace(/<u44>/ig,",").replace(/<u3B>/g,";").replace(/<script/g,"");
		if(messages.curr.msgtype == 1) {
			HTML += "\n\nClick <a href='javascript:;' id='mess_confirmTrade'>here</a> to accept this trade request.";
		} else if(messages.curr.msgtype == 3) {
			HTML += "\n\nClick <a href='javascript:;' id='mess_confirmInvite'>here</a> to accept this invite.";
		} else if(messages.curr.msgtype == 6) {
			HTML+= "\n\nYou may <a href='#' id='mess_confReward'>accept</a> or <a href='#' id='mess_decReward'>decline</a> your reward.\nDeclining your reward will allow you to pursue a better reward.";
		}
		HTML += "</div></div></div></div></div><div id='mess_addMessNav'><a href='javascript:;' id='mess_reportMess'></a><a href='javascript:;' id='mess_deleteMess'></a>  <a href='javascript:;' id='mess_replyMess'></a></div>";
					
		$("#mess_window").fadeOut('fast', function() {
			messages.api.getContentPane().html(HTML);
			$(this).fadeIn('fast');
			messages.api.reinitialise();
			if(!messages.curr.read) {
				display_output(false,"Marking Message Read...");
				var markRead = new make_AJAX();
				markRead.callback = function() {
					display_output(false,"Message Marked Read!");
					check_for_unread();
				};
				markRead.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".markReadMessage(" + messages.curr.messageID + ");");
				messages.curr.read = true;
			}
		});
	});
	
	$("#mess_deleteMess, .deleteMess").die('click').live('click', function() {
		var delMess = new make_AJAX();
		display_output(false,"Deleting Message...");
		var reloadUI = true;
		if($(this).is(".deleteMess")) {
			messages.curr = messages[messages.currGroup][$(this).index(".deleteMess")];
			reloadUI = false;
			$(this).parent().animate({'opacity':'toggle','height':'toggle'},'normal', function() {
				$(this).remove();
			});
		}
		delMess.callback = function() {
			display_output(false,"Message Deleted!");
			get_messages(true);
		};
		delMess.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".markDeletedMessage(" + messages.curr.messageID + ");");
	});
	$("#mess_deleteConvo").die('click').live('click',function() {
		var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
		display_output(false,"Deleting Messages...");
		$.each(messages.messages[messages.currGroup], function(j, w) {
			getPath += player.command + ".markDeletedMessage(" + w.messageID + ");";
		});
		messages.messages.splice(messages.currGroup, 1);
		messages.currGroup = 0;
		var convoDel = new make_AJAX();
		convoDel.callback = function() {
			display_output(false,"Messages Deleted!");
			messages.reload = true;
			get_messages(true);
		};
		convoDel.get(getPath);
	});
	//**********************************Write Message***************************************************************************************************************
	$("#mess_newMess, #mess_replyMess").die('click').live('click', function() {
		if($(this).is("#mess_newMess")) {
			messages.curr = false;
		}
		
		$("#mess_window").fadeOut('fast', function() {
			messages.api.getContentPane().html("<div id='mess_recipBox'><label for='mess_recip'>To:</label> <input type='text' id='mess_recip' /></div><div id='mess_subjectBox'><label for='mess_subject'>Subject:</label> <input type='text' id='mess_subject' maxlength='100' /></div><div class='messBodyBox' id='Mess_newMessBox'><div class='messBodyGrad'><div class='messBodyTop'><div class='messBodyBottom'><div class='messBody'><textarea id='mess_bodyText'></textarea></div></div></div></div></div><a href='javascript:;' id='mess_sendMess'></a>");
			$(this).fadeIn('fast');
			messages.api.reinitialise();
			
			if(messages.curr) {
				var participants = messages.curr.usernameTo.concat(messages.curr.usernameFrom);
				$.each(participants, function(i,v) {
					if(v == player.username) {participants.splice(i, 1); return false;}
				});
				$("#mess_recip").val(participants);
				$("#mess_subject").val(messages.curr.subject.replace(/<u44>/ig,","));
			}
		});
	});
	
	$("#mess_sendMess").die('click').live('click', function() {
		var that = $(this);
		var message = {
						to : (($("#mess_recip").val())?$("#mess_recip").val().replace(/\s*\u003B\s*(?=(\w|\d))/ig,",").replace(/\u003B/ig,""):(messages.curr.usernameFrom == player.username)?messages.curr.usernameTo:messages.curr.usernameFrom),
						subject : $("#mess_subject").val().replace(/</g,"&lt;").replace(/>/g,"&gt;") || messages.curr.subject,
						body : $("#mess_bodyText").val().replace(/</g,"&lt;").replace(/>/g,"&gt;"),
						oMID : ((messages.curr)?(messages.curr.originalSubjectID || messages.curr.subjectID):0)
						};
		message.UG = message.to.match(/\w+\d*\s*(?=\u005D)/g);
		if(message.UG) {
			$.each(messages.UG, function(i, v) {
				$.each(message.UG, function(j,w) {
					if(v.name == w) {
						message.to = message.to.replace("["+w+"]",v.usernames);
						return false;
					}
				});
			});
		}
		if(message.oMID != 0) {
			var recip = message.to.split(",");
			var participants = messages.curr.usernameTo.concat(messages.curr.usernameFrom);
			if(recip.length == participants.length - 1) {
				var isSame = [];
				$.each(recip, function(i,v) {
					if($.trim(v)==messages.curr.usernameFrom){isSame.push(true);return true;}
					$.each(messages.curr.usernameTo, function(j,w) {
						if($.trim(v)==w){isSame.push(true);return true;}
					});
				});
				if(isSame.length != participants.length - 1) message.oMID = 0;
			} else {
				message.oMID = 0;
			}
		}
		var postMess = new make_AJAX();
		display_output(false,"Sending Message to:<br/>"+message.to);
		postMess.callback = function(response) {
			if(response.match(/true/i)) {
				display_output(false,"Message Sent!");
				if(that.hasClass("quickReply") && message.oMID != 0) {
					$("#mess_convo").append("<div class='convoMessage newMess fromSelf' style='display: none'><div class='messSender'>" + player.username + "</div><div class='messSubject'>" + message.subject.replace(/<u44>/ig,",").replace(/<u3B>/g,";")
					+ "</div><div class='messBodyBox'><div class='messBodyGrad'><div class='messBodyTop'><div class='messBodyBottom'><div class='messBody'>" + message.body.replace(/<u44>/ig,",").replace(/<u3B>/g,";") + "</div></div></div></div></div></div>");
					$(".newMess").animate({'opacity':'toggle','height':'toggle'},'normal').removeClass("newMess");
					$("#mess_bodyText").val("");
					messages.api.reinitialise();
				} else {
					messages.reload = true;
				}
				get_messages(true);
			} else {
				var error = response.split(":");
				if(error.length==2)error=error[1];
				display_output(true,error,true);
			}
		};
		postMess.post("/AIWars/GodGenerator","reqtype=command&command=" + player.command + ".sendMessage([" + encodeURI(message.to) + "]," + encodeURIComponent(message.body.replace(/,/g, "<u44>").replace(/"/g,'\\"').replace(/;/g,"<u3B>")) + "," + encodeURIComponent(message.subject.replace(/,/g, "<u44>").replace(/"/g,'\\"').replace(/;/g,"<u3B>")) + "," + message.oMID + ");");
	});
	
	$("#mess_confirmTrade, .confirmTrade").die("click").live("click",function(){
		var that = this;
		var confTrade = new make_AJAX();
		confTrade.callback = function(response){
			if(response.match(/true/i)) {
				display_output(false,"Message Sent!");
				if($(that).hasClass("confirmTrade")) {
					$("#mess_convo").append("<div class='convoMessage newMess fromSelf' style='display: none'><div class='messSender'>" + player.username + "</div><div class='messSubject'>" + message.subject.replace(/<u44>/ig,",") 
					+ "</div><div class='messBodyBox'><div class='messBodyGrad'><div class='messBodyTop'><div class='messBodyBottom'><div class='messBody'>" +player.username+" has accepted your trade request.</div></div></div></div></div></div>");
					$(".newMess").animate({'opacity':'toggle','height':'toggle'},'normal').removeClass("newMess");
					$("#mess_bodyText").val("");
					messages.api.reinitialise();
				} else {
					messages.reload = true;
				}
				get_messages(true);
				get_all_trades();
			} else {
				var error = response.split(":");
				if(error.length==2)error=error[1];
				display_output(true,error,true);
			}
		};
		confTrade.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".sendTradeMessage(["+messages.curr.usernameFrom+"],"+player.username+" has accepted your trade request.,"+messages.curr.subject+",2,"+messages.curr.tsid+","+messages.curr.subjectID+");");
	});
	$("#mess_confirmInvite, .confirmInvite").die("click").live("click",function(){
		var that = this;
		var confInvite = new make_AJAX();
		confInvite.callback = function(response){
			if(response.match(/true/i)) {
				display_output(false,"Message Sent!");
				if($(that).hasClass("confirmInvite")) {
					$("#mess_convo").append("<div class='convoMessage newMess fromSelf' style='display: none'><div class='messSender'>" + player.username + "</div><div class='messSubject'>" + message.subject.replace(/<u44>/ig,",") 
					+ "</div><div class='messBodyBox'><div class='messBodyGrad'><div class='messBodyTop'><div class='messBodyBottom'><div class='messBody'>" +player.username+" has accepted your invitation.</div></div></div></div></div></div>");
					$(".newMess").animate({'opacity':'toggle','height':'toggle'},'normal').removeClass("newMess");
					$("#mess_bodyText").val("");
					messages.api.reinitialise();
				} else {
					messages.reload = true;
				}
				load_player(player.league,true,false); //automatically grabs messages
			} else {
				var error = response.split(":");
				if(error.length==2)error=error[1];
				display_output(true,error,true);
			}
		};
		confInvite.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".sendLeagueMessage(["+messages.curr.usernameFrom+"],"+player.username+" has accepted your invitation.,"+messages.curr.subject+",4,"+messages.curr.pidFrom+","+messages.curr.subjectID+");");
	});
	$("#mess_confReward, .confReward, #mess_decReward, .decReward").die("click").live("click",function(){
		var that = this;
		var reward = false;
		if($(this).is("#mess_confReward, .confReward")) reward = true;
		var archResp = new make_AJAX();
		archResp.callback = function(response){
			if(response.match(/true/i)) {
				display_output(false,"Message Sent!");
				if($(that).hasClass("confirmInvite")) {
					messages.api.reinitialise();
				} else {
					messages.reload = true;
				}
				load_player(player.league,true,false); //automatically grabs messages
			} else {
				var error = response.split(":");
				if(error.length==2)error=error[1];
				display_output(true,error,true);
			}
		};
		archResp.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".respondToDigMessage("+reward+");");
	});
	
	display_output(false,"DMC Loaded!");
	$("#window").fadeIn("fast");
}