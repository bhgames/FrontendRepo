function build_league_UI() {
	currUI = build_league_UI;
	
	var HTML = "<div id='League_outerbox'>";
	if(player.TPR == false) { //if the player isn't in a league, display the create league interface
		HTML += "<h3>Create League</h3><div id='CC_createLeagueBox' class='textFramed'>";
		if(player.towns.length < 2) {
			HTML += "<div id='CC_noCreate'><div id='CC_noCreateBlock'></div><span id='CC_noCreateText'>You must have more then one town to start a league.</span></div>";
		}
		HTML += "<input type='text' id='CC_createLeagueName' value='League Name' /><input type='text' id='CC_createLeagueInitials' maxlength='5' value='Tag'/><textarea id='CC_createLeagueDesc'>Description of Your League</textarea><input type='url' id='CC_createLeagueSite' value='http://' /><select id='CC_createLeagueTown'><option disabled='disabled'>Select Town</option><option disabled='disabled'>-----------</option>";
		$.each(player.towns, function(i, v) {
			if(v.townID != player.capitalid) {
				HTML += "<option>" + v.townName + "</option>";
			}
		});
		HTML += "</select><a href='javascript:;' id='CC_createLeagueButton'></a></div></div>";
		$("#window").html(HTML).fadeIn();
	} else {
		HTML += "<div id='CC_leagueRoster' class='textFramed'><div style='border-bottom: 1px solid #AAAAAA;'>League Roster:</div><dl>";
		player.TPR.sort(function(a,b){
			return b.type - a.type;
		});
		$.each(player.TPR,function(i,v){
			if(v.type>-1) {
				HTML +="<dt>"+v.player+"</dt><dd>"+v.rank+"</dd><dd>Tax: "+v.taxRate*100+"%</dd>";
			}
		});
		var UN = player.league ? player.origUN : player.username;
		HTML += "</dl></div></div><div id='CC_info'><a href='javascript:;' id='CC_leagueAdmin'></a><div id='CC_leagueInfo'></div><div id='CC_playerInfo' class='textFramed'>Player Info:<h3>"
				+ UN + "</h3><span id='CC_playerRank'>Rank: ";
		$.each(player.TPR,function(i,v){
			if(v.player == UN) {
				HTML += v.rank+"</span><span id='CC_playerTax'>Tax: "+v.taxRate*100+"%";
				return false;
			}
		});
		HTML += "</span></div></div></div>";
		$("#window").html(HTML);
		var getLeagueInfo = new make_AJAX();
		getLeagueInfo.callback = function(response) {
			var info = $.parseJSON(response.replace(/</g,"&#60;").replace(/>/g,"&#62;"));
			var leagueHTML = "<h2>"+info[0]+"</h2><span id='CC_leagueInfoTag'>Tag: " + info[1]+"</span><div id='CC_leagueDesc' class='textFramed'>"+info[3]+"</div>Site:<br/><a href='"+info[2]+"' target='_league'>"+info[2]+"</a>";
			$("#CC_leagueInfo").html(leagueHTML);
			$("#window").fadeIn();
		};
		getLeagueInfo.get("reqtype=command&command=bf.getLeagueInfo();");
	}
	
	$("#CC_leagueAdmin").die("click").live("click",function(){
		$("#window").fadeOut(function() {
			var HTML = "<div id='League_outerbox'>";
			if(player.league) {
				var isAdmin = false;
				$.each(player.TPR,function(i,v){
					if(v.player == player.origUN) {
						if(v.type==2) {isAdmin = true;}
						return false;
					}
				});
				HTML += "<a href='javascript:;' id='CC_leaveLeague'></a><a href='javascript:;' id='CC_switchPlayer'></a>";
				if(!isAdmin) HTML += "<div id='CC_adminBlocker'></div>";
				HTML += "<div id='CC_memberAdmin' class='textFramed'><h3>Member Managment</h3><select id='CC_TPRList'><option disabled='disabled'>Choose Player:</option><option disabled='disabled'>--------------</option>";
				$.each(player.TPR,function(i,v){
					if(v.type > -1) {
						HTML += "<option>"+v.player+"</option>";
					}
				});
				HTML += "</select><input type='text' id='CC_memberRankName' placeholder='title'><select id='CC_memberRankLvl'><option disabled='disabled'>Rank:</option><option disabled='disabled'>----------</option><option>Member</option><option>Officer</option><option>Admin</option></select><br/><label for='CC_TPRRate'>Tax Rate:</label><input type='";
				if(Modernizr.inputtypes.range) {
					HTML += "range' style='width:100px;border:none;display:inline-block;'";
					$("#CC_TPRRateVal").text("0");
					$("#CC_TRPRate").die("mousedown").live("mousedown",function(){
						$("body").mousemove(function(){
							$("#CC_TPRRateVal").text($("#CC_TRPRate").val()+"%");
						});
						$("body").one("mouseup",function(){
							$(this).unbind("mousemove");
						});
					});
				} else {
					HTML += "number' style='width:60px;'";
				}
				HTML += " id='CC_TRPRate' min='0' max='100' step='1' value='0' /><span id='CC_TPRRateVal'></span><select id='CC_memberTownAdmin' multiple='multiple'><option disabled='disabled'>Administrable Towns:</option><option disabled='disabled'>--------------</option>";
				$.each(player.towns, function(i,v) {
					HTML += "<option value='"+v.townID+"'>"+v.townName+"</option>";
				});
				HTML +="</select></span><br/><a href='javascript:;' id='CC_kickMember'></a><a href='javascript:;' id='CC_saveInfo'></a></div><div id='CC_invitePlayer' class='textFramed'><h3>Invite Player</h3><label for='CC_playerName'>Player:</label><input type='text' id='CC_playerName' /><hr/>Invite Message:<br/><textarea id='CC_inviteMessage'>Please click the link below to join our league.</textarea><a href='javascript:;' id='CC_sendInvite'></a></div><div id='CC_inviteList' class='textFramed'><ul id='CC_invitees'>";
				$.each(player.TPR,function(i,v){
					if(v.type < 0) {
						HTML += "<li>"+v.player+" <input type='checkbox'></li>";
					}
				});
			} else {
				HTML += "<a href='javascript:;' id='CC_leaveLeague'></a>";
				if(player.TPR.type >0) HTML +="<a href='javascript:;' id='CC_switchLeague'></a>";
			}
			$("#window").html(HTML+"</div>").fadeIn();				
		});
	});

	$("#CC_TPRList").die("change").live("change",function(){
		var index = $("#CC_TPRList :selected").index("#CC_TPRList option");
		var member = player.TPR[index-2];
		$("#CC_memberRankLvl option")[member.type+2].selected = true;
		$("#CC_memberRankName").val(member.rank);
		$("#CC_TRPRate").val(member.taxRate*100);
		if(Modernizr.inputtypes.range) $("#CC_TPRRateVal").text(member.taxRate*100+"%");
		$("#CC_memberTownAdmin option").each(function(i,v){
			$.each(member.tids,function(j,w){
				if(w == $(v).attr("value")) $(v).attr("selected","true");
			});
		});
		var otherAdmins = false;
		$.each(player.TPR,function(i,v){
			if(v.player != player.origUN && v.type==2) {
				otherAdmins = true;
				return false;
			}
		});
		var disabled = "";
		if(player.TPR.length < 2 || !otherAdmins) {
			disabled = "disabled";
		}
		var ranks = $("#CC_memberRankLvl option");
		ranks[2].disabled = disabled;
		ranks[3].disabled = disabled;
	});
	$("#CC_kickMember").die("click").live("click",function() {
		display_message("Confirmation","Are you sure you want to kick this player?",function() {
			var index = $("#CC_TPRList :selected").index("#CC_TPRList option")-2;
			display_output(false,"Kicking " + player.TPR[index].player+"...");
			var kickPlayer = new make_AJAX();
			kickPlayer.callback = function(response){
				if(response.match(/true/)) {
					display_output(false,"Player Kicked!");
					load_player(false, true, false);
				} else {
					var error = response.split(":");
					if(error.length==2)error=error[1];
					display_output(true,"Unable to kick!",true);
					display_output(true,error);
				}
			};
			kickPlayer.get("reqtype=command&command=bf.getLeague().deleteTPR("+player.TPR[index].pid+");");
			
			$("#CC_TPRList :selected").remove();
			$("#CC_TPRList option")[0].selected = true;
			$("#CC_memberRankLvl option")[0].selected = true;
			$("#CC_memberRankName").val("");
			$("#CC_TPRRateVal").text("");
			$("#CC_TRPRate").val(0);
		});
	});
	
	$("#CC_saveInfo").die("click").live("click",function(){
		display_output(false,"Saving TPR...");
		var index = $("#CC_TPRList :selected").index("#CC_TPRList option")-2;
		var saveTPR = new make_AJAX();
		saveTPR.callback = function(response){
			if(response.match(/true/)) {
				display_output(false,"TPR Saved!");
				load_player(false, true, false);
			} else { 
				var error = response.split(":");
				if(error.length==2)error=error[1];
				display_output(true,"Unable to save!",true);
				display_output(true,error);
			}
		};
		saveTPR.get("reqtype=command&command=bf.getLeague().createTPR("+($("#CC_TRPRate").val()/100)+","+player.TPR[index].pid+","
					+$("#CC_memberRankName").val()+","+($("#CC_memberRankLvl :selected").index("#CC_memberRankLvl option")-2)+",["+$("#CC_memberTownAdmin").val()+"]);");
	});
	
	$("#CC_sendInvite").die("click").live("click",function(){
		display_output(false,"Sending Invite...");
		var sendMessage = new make_AJAX();
		sendMessage.callback = function(response){
			if(response.match(/true/)) {
				display_output(false, "Message Sent!");
				load_player(false, true, false);
			} else {
				display_output(true,"Error during message send!",true);
				display_output(true,"Error: " + success);
			}
		};
		sendMessage.get("reqtype=command&command=bf.getLeague().sendLeagueMessage(["+$("#CC_playerName").val().split(";")+"],"+$("#CC_inviteMessage").val().replace(/,/g, "<u44>")
						+",Invitation to "+player.username+",3,"+player.pid+",0);");
						
		$("#CC_playerName").val("");
		$("#CC_inviteMessage").val("Please click the link below to join our league.");
	});
	
	$("#CC_leaveLeague").die("click").live("click",function(){
		display_message("Confirmation","Are you sure you want to leave?", function() {
			display_output(false,"Leaving League...");
			var leaveLeague = new make_AJAX();
			leaveLeague.callback = function(response){
				if(response.match(/true/)) {
					display_output(false,"You've left your league.");
					load_player(true);
				} else {
					display_output(true,"Error while leaving your league!",true);
					display_output(false,"Please try again in a moment.");
				}
			};
			leaveLeague.get("reqtype=command&command=bf.leaveLeague();");
		});
	});
	
	$("#CC_createLeagueButton").die("click").live("click", function(){
		var createLeague = new make_AJAX();
		createLeague.callback = function(response){
			if(response.match(/true/)) {
				display_output(false,"League Creation Successful!");
				load_player(true);
			} else {
				display_output(true,"Error creating league!",true);
				display_output(false,"Please try again.");
			}
		};
		createLeague.get("reqtype=command&command=bf.createLeague("+player.towns[$("#CC_createLeagueTown :selected").index("#CC_createLeagueTown option")-2].townID
							+","+$("#CC_createLeagueName").val()+","+$("#CC_createLeagueDesc").val()+","+$("#CC_createLeagueSite").val()+","
							+$("#CC_createLeagueInitials").val()+");");
	});
}