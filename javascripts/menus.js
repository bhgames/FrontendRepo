/**************************************************************************************************************\
*********************************************Account Settings Menu**********************************************
\**************************************************************************************************************/
var ASM = 	{
				loaded : false
			};	
/***********************************************************************************************************\
							   Functions for the Account Settings Menu
\***********************************************************************************************************/
function build_ASM() {
	$("#viewerback").css("background-image","url(SPFrames/rusted-metal.jpg)").fadeIn();
	if(ASM.HTML) {
		display_output(false,"Building Options Menu...");
		currUI = build_ASM;
		var win = $("#window");
		win.html(ASM.HTML);
		$("#ASM_playerName").text(player.username);
		var hasCC = false;
		$.each(player.towns, function(i, v) {
			if(v.townID == player.capitaltid) hasCC = true;
		});
		$.each(player.towns, function(i, v) {
			$("#ASM_townList").append("<div class='townInfo'><input type='text' class='townNameInput textInput' maxlength='10' value='" 
										+ v.townName + "'/><span class='addInfo'>(" + v.x + ", " + v.y
										+ ") | <input type='checkbox' class='CC'" + ((player.capitaltid == v.townID)?"checked='checked' ":"")
										+ ((hasCC)?" disabled='disabled'":"") + " /></div>");
		});
		$("#ASM_achievements").html(function() {
			var HTML = '';
			$.each(player.achievements, function(i,v){
				HTML+="<div class='achievement"+(!v.achieved?" noBld":"")+"'><img src='SPFrames/achievements/"+v.agraphic+".png' alt='"+v.aname+"'/></div>";
			});
			return HTML;
		});
		
		var rank = {};
		$.each(ranks.player, function(i,v) {
			if(v.username == player.username) {
				rank = v;
				rank.pRank = i+1;
				return false;
			}
		});
		rank.BHM = false;
		$.each(ranks.BHM, function(i,v) {
			if(v.username == player.username) {
				rank.BHM = true;
				rank.tBP = v.BP;
				rank.bRank = i+1;
				return false;
			}
		});
		
		$("#ASM_playerRank span").text(rank.pRank);
		
		$("#ASM_averageCSL span").text(rank.averageCSL);
		if(rank.BHM) {
			$("#ASM_BHMRank span").text(rank.bRank);
			
			$("#ASM_BPTotal span").text(rank.tBP);
		} else {
			$("#ASM_BHMRank, #ASM_BPTotal").css("display","none");
		}
		
		$("#ASM_karmicRank span").text(player.karmicRank);
		
		$(".achievement img").unbind("click").click(function() {
			var index = $(this).parent().index(".achievement");
			var achieve = player.achievements[index];
			display_message(achieve.aname,"<img src='SPFrames/achievements/"+achieve.agraphic+".png' alt='"+achieve.aname+"' style='float:left'/>"+achieve.adesc);
		});
		
		$("#ASM_save").unbind('click').click(function() {
			var getPath = "reqtype=command&command=";
			$(".townNameInput").each(function(i,v) {
				var val = $(v).val();
				if(val != player.towns[i].townName) {
					player.towns[i].townName = val;
					$("#cityname").html(function() { 
											if(player.curtown.townID == player.capitaltid) {
												return "&#171;" + player.curtown.townName + "&#187;";
											}
											return player.curtown.townName;
										});
					getPath += "bf.renameTown(" + player.towns[i].townID + "," + val + ");";
				}
			});
			if(!hasCC && $(".CC:checked").length > 0) {
				getPath += "bf.setCapitalCity(" + player.towns[$(".CC:checked").index(".CC")].townID + ");";
			}
			
			if(getPath != "reqtype=command&command=") {	
				var save = new make_AJAX();
				
				save.callback = function(response) {
					var lockCC = !hasCC;
					if(response.match(/false/i)) {
						var error = response.split(";"), mess = "";
						$.each(error, function(i, v) {
							if(v.match(/false/i)) {
								if(lockCC && $(".CC:checked").length > 0 && i==error.length-1) lockCC=false;
								mess += v.split(":")[1]+"<br/>";
							}
						});
						display_message("Account Settings", mess);
					}
					if(lockCC) {
						$(".CC").each(function(i,v) {
							$(v).attr("disabled","disabled");
						});
					}
					load_player(false, true);
				};
				
				save.get(getPath);
			}
		});
		
		if(player.research.fbLinked) {
			$("#ASM_fbConnect").text("Facebook Integrated!");
		} else {
			$("#ASM_fbConnect").unbind("click").click(function() {FB.login(fb_connect);});
		}
		
		win.fadeIn();
		$("#ASM_achievements").jScrollPane();
		$("#ASM_townScroll").jScrollPane();
	} else {
		display_output(false,"Getting menu data...",true);
		$.get("menus/ASM.html",
			function(response) {
				display_output(false,"Menu data received!");
				ASM.HTML = response;
				build_ASM();
			});
	}
	
}

function fb_connect(response) {
	if(response.session) {
		FB.api('/me', function(response) {
			var regFB = new make_AJAX();
			regFB.callback = function(response) {
						if(response.match(/invalid/)){
							display_output(true,"An error occured while linking your account.", true);
							display_output(false,"Your Facebook profile may already be connected to an account or your account may already be linked.");
						}
						else {
							display_output(false,"Your account is now connected to Facebook!");
							$("#ASM_fbConnect").text("Facebook Integrated!");
						}
					};
			
			regFB.post("reqtype=linkFB&fuid="+response.id);
		});
	}
}