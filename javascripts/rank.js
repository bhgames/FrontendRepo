var ranks = {
				HTML : "<div id='Rank_outerbox'>\
							<div id='Rank_tabBar'>\
								<div id='Rank_playerTab'></div>\
								<div id='Rank_leagueTab'></div>\
								<div id='Rank_BHMTab'></div>\
							</div>\
							<div id='Rank_ranks'>\
								<ol></ol>\
							</div>\
							<form id='Rank_searchBox' class='metalFrame'>\
								<input type='text' id='Rank_searchInput' />\
								<input type='submit' id='Rank_searchSubmit' class='bigButton' value='Search' />\
							</form>\
						</div>"
			};
function get_ranks(async,player, league, BHM) {
	try {
		if(async) {
			getRanks = new make_AJAX();
			getRanks.callback = function(response) {
									response = response.split(";");
									get_ranks(false,response[0],response[1],response[2]);
								};
			getRanks.get("reqtype=command&command=bf.getPlayerRanking();bf.getLeagueRanking();bf.getBattlehardRanking();");
		} else {
			//assign the current values to the ranks
			ranks.player = 	((player) ? ((typeof(player)=="string") ? $.parseJSON(player) : player) : ranks.player || {});
			ranks.league = 	((league) ? ((typeof(league)=="string") ? $.parseJSON(league) : league) : ranks.league || {});
			ranks.BHM = 	((BHM) ? ((typeof(BHM)=="string") ? $.parseJSON(BHM) : BHM) : ranks.BHM || {});
			
			ranks.player.sort(function(a, b) {
								return b.averageCSL - a.averageCSL;
							});
			ranks.league.sort(function(a, b) {
								return b.averageCSL - a.averageCSL;
							});
			ranks.BHM.sort(function(a, b) {
								return b.BP - a.BP;
							});
			
			$.each(ranks.player, function(i,v){
				v.username = v.username.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
			});
			$.each(ranks.league, function(i,v){
				v.leagueName = v.leagueName.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
				v.leagueLetters = v.leagueLetters.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
				v.leagueWebsite = v.leagueWebsite.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
			});
			$.each(ranks.BHM, function(i,v){
				v.username = v.username.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
			});
			$("#rankings").unbind("click").click(function(){
				do_fade(draw_rank_UI);
			});
			display_output(false,"Ranking Data Loaded!");
		}
	} catch(e) {
		display_output(true,"Error loading Ranks!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_ranks(true);
	}
}

function draw_rank_UI() {
	currUI = draw_rank_UI;
	
	$("#window").html(ranks.HTML).fadeIn();
	$("#viewerback").css("background-image","url(SPFrames/Buildings/UI/menu-back.jpg)").html("").fadeIn("normal");
	ranks.api = $("#Rank_ranks ol").jScrollPane({showArrows:true,hideFocus:true}).data('jsp');

	$("#Rank_playerTab").unbind("click").click(function(){
		var playerIndex = 0;
		ranks.api.getContentPane().html(function(){
			var HTML = "<div id='Rank_key'><span class='pRankKey'>Rank</span><span class='pNameKey'>Username</span><span class='pCSLKey'>Total CSL</span></div>";
			$.each(ranks.player,function(i,v){
				if(v.username == player.username) playerIndex = 0;
				HTML += "<div class='pRank"+((v.username == player.username)?" player":"")+((i==0)?" topBor":"")+"'>"+(i+1)+".<span class='pName "+v.username+"'><span class='"+((v.battlehardMode)?"BHM":"noBHM")+"'></span>"+v.username+"</span><span class='pCSL'>"+v.averageCSL+"</span></div>";
			});
			return HTML;
		});
		ranks.api.reinitialise();
		ranks.api.scrollToElement(".player",true, false);
	}).click();
	
	$("#Rank_leagueTab").unbind("click").click(function(){
		ranks.api.getContentPane().html(function(){
			var HTML = "<div id='Rank_key'><span class='lRankKey'>Rank</span><span class='lNameKey'>League Name</span><span class='lTagKey'>Tag</span><span class='lCSLKey'>total CSL</span></div>";
			$.each(ranks.league,function(i,v){
				HTML += "<div class='lRank"+((player.league)?((v.leagueLetters == player.username)?" player":""):((v.leagueLetters == player.TPR.league)?" player":""))+((i==0)?" topBor":"")+"'>"+(i+1)+".<span class='lName "+v.leagueName+"'><span class='"+((v.battlehardMode)?"BHM":"noBHM")+"'></span>"+v.leagueName+"</span><span class='lTag'>"+v.leagueLetters+"</span><span class='lCSL'>"+v.averageCSL+"</span></div>";
			});
			return HTML;
		});
		ranks.api.reinitialise();
		ranks.api.scrollToElement(".player",true, false);
	});
	
	$("#Rank_BHMTab").unbind("click").click(function(){
		var playerIndex = 0;
		ranks.api.getContentPane().html(function(){
			var HTML = "<div id='Rank_key'><span class='bRankKey'>Rank</span><span class='bNameKey'>Username</span><span class='bBPKey'>Total BP Earned</span></div>";
			$.each(ranks.BHM,function(i,v){
				if(v.username == player.username) playerIndex = 0;
				HTML += "<div class='bRank"+((v.username == player.username)?" player":"")+((i==0)?" topBor":"")+"'>"+(i+1)+".<span class='bName "+v.username+"'>"+((v.battlehardMode)?"<span class='BHM'></span>":"")+v.username+"</span><span class='bBP'>"+v.BP+"</span></div>";
			});
			return HTML;
		});
		var playerLoc = (playerIndex*22);
		if(playerLoc>225) playerLoc-=225;
		else playerLoc = 0;
		ranks.api.reinitialise();
		ranks.api.scrollToElement(".player",true, false);
	});
	
	$("#Rank_searchBox").unbind("submit").submit(function(e) {
		e.preventDefault();
		ranks.api.scrollToElement("."+$("#Rank_searchInput").val(),true, true);
	});
}