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
	if(ASM.HTML) {
	
		$("#ASM_playerName").text(player.username);
		var hasCC = false;
		$.each(player.towns, function(i, v) {
			if(v.townID == player.capitaltid) hasCC = true;
		});
		$.each(player.towns, function(i, v) {
			$("#ASM_townList").append("<div class='townInfo'><input type='text' class='townNameInput' maxlength='20' value='" 
										+ v.townName + "'/><span class='addInfo'>(" + v.x + ", " + v.y
										+ ") | <input type='checkbox' class='CC'" + ((player.capitaltid == v.townID)?"checked='checked' ":"")
										+ ((hasCC)?" disabled='disabled'":"") + " /></div>");
		});
		$("#ASM_achievements").html(function() {
			var HTML = '';
			$.each(player.achievements, function(i,v){
				HTML+="<div class='achievement"+(!v.achieved?" noBld":"")+"'><img src='AIFrames/icons/achievements/"+v.agraphic+".png' alt='"+v.aname+"'/></div>";
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
			display_message(achieve.aname,"<img src='AIFrames/icons/achievements/"+achieve.agraphic+".png' alt='"+achieve.aname+"' style='float:left'/>"+achieve.adesc);
		});
		
		$("#ASM_save").unbind('click').click(function() {
			var getPath = "/AIWars/GodGenerator?reqtype=command&command=";
			$(".townNameInput").each(function(i,v) {
				if($(v).val() != player.towns[i].townName) {
					player.towns[i].townName = $(v).val();
					$("#cityname").html(function() { 
											if(player.curtown.townID == player.capitaltid) {
												return "&#171;" + player.curtown.townName + "&#187;";
											}
											return player.curtown.townName;
										});
					getPath += player.command + ".renameTown(" + player.towns[i].townID + "," + $(v).val() + ");";
				}
			});
			if(!hasCC && $(".CC:checked").length > 0) {
				getPath += player.command + ".setCapitalCity(" + player.towns[$(".CC:checked").index(".CC")].townID + ");";
			}
			
			if(getPath != "/AIWars/GodGenerator?reqtype=command&command=") {		
				var save = new make_AJAX();
				
				save.callback = function(response) {
					var lockCC = !hasCC;
					if(response.match(/false/i)) {
						var error = response.split(";");
						$.each(error, function(i, v) {
							if(v.match(/false/i)) {
								if(lockCC && $(".CC:checked").length > 0 && i==error.length-1) lockCC=false;
								error += v.split(":")[1]+"<br/>";
							}
						});
						display_message("Account Settings", error);
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
		
		$("#ASM_close").unbind('click').click(function() {
			$("#accountPreferences").children().unbind();
			$("#accountPreferences").fadeOut();
		});
		
		$("#accountPreferences").fadeIn();
		$("#ASM_achievements").jScrollPane({showArrows:true,hideFocus:true});
		$("#ASM_townScroll").jScrollPane({showArrows:true,hideFocus:true});
	} else {
		var getASM = new make_AJAX();
		getASM.callback = function(response) {
							ASM.HTML = response;
							build_ASM();
						};
		getASM.get("/light/menus/ASM.html");
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
			
			regFB.post("/AIWars/GodGenerator","reqtype=linkFB&fuid="+response.id);
		});
	}
}