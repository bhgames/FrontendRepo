var ranks = {
				HTML : "<div id='Rank_outerbox'>\
							<div class='darkFrameBody'>\
								<div id='Rank_tabBar'>\
									<div id='Rank_playerTab'></div>\
									<div id='Rank_leagueTab'></div>\
									<div id='Rank_BHMTab'></div>\
								</div>\
								<div id='Rank_ranks'>\
									<ol></ol>\
									<div id='Rank_searchBox'>\
									</div>\
								</div>\
							</div>\
							<div class='darkFrameBL-BR-B'>\
								<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
							</div>\
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
			getRanks.get("/AIWars/GodGenerator?reqtype=command&command=bf.getPlayerRanking();bf.getLeagueRanking();bf.getBattlehardRanking();");
		} else {
			ranks.player = $.parseJSON(player).sort(function(a, b) {
												return b.averageCSL - a.averageCSL;
											});
			$.each(ranks.player, function(i,v){
				v.username = v.username.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
			});
			ranks.league = $.parseJSON(league).sort(function(a, b) {
												return b.averageCSL - a.averageCSL;
											});
			$.each(ranks.league, function(i,v){
				v.leagueName = v.leagueName.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
				v.leagueLetters = v.leagueLetters.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
				v.leagueWebsite = v.leagueWebsite.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
			});
			ranks.BHM = $.parseJSON(BHM).sort(function(a, b) {
												return b.BP - a.BP;
											});
			$.each(ranks.BHM, function(i,v){
				v.username = v.username.replace(/\u003c/g,"&#60;").replace(/\u003e/g,"&#62;");
			});
			$("#rankings").unbind("click").click(function(){
				do_fade(draw_rank_UI, "amber");
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
	$("#Rank_ranks ol").jScrollPane({showArrows:true,hideFocus:true});
	
	$("#Rank_playerTab").unbind("click").click(function(){
		var api = $("#Rank_ranks ol").data('jsp');
		api.getContentPane().html(function(){
			var HTML = "<div id='Rank_key'><span class='pRankKey'>Rank</span><span class='pNameKey'>Username</span><span class='pCSLKey'>Total CSL</span></div>";
			$.each(ranks.player,function(i,v){
				HTML += "<div class='pRank"+((v.username == player.username)?" player":"")+((i==0)?" topBor":"")+"'>"+(i+1)+".<span class='pName'><span class='"+((v.battlehardMode)?"BHM":"noBHM")+"'></span>"+v.username+"</span><span class='pCSL'>"+v.averageCSL+"</span></div>";
			});
			return HTML;
		});
		api.reinitialise();
	}).click();
	
	$("#Rank_leagueTab").unbind("click").click(function(){
		var api = $("#Rank_ranks ol").data('jsp');
		api.getContentPane().html(function(){
			var HTML = "<div id='Rank_key'><span class='lRankKey'>Rank</span><span class='lNameKey'>League Name</span><span class='lTagKey'>Tag</span><span class='lCSLKey'>total CSL</span></div>";
			$.each(ranks.league,function(i,v){
				HTML += "<div class='lRank"+((player.league)?((v.leagueLetters == player.username)?" player":""):((v.leagueLetters == player.TPR.league)?" player":""))+((i==0)?" topBor":"")+"'>"+(i+1)+".<span class='lName'><span class='"+((v.battlehardMode)?"BHM":"noBHM")+"'></span>"+v.leagueName+"</span><span class='lTag'>"+v.leagueLetters+"</span><span class='lCSL'>"+v.averageCSL+"</span></div>";
			});
			return HTML;
		});
		api.reinitialise();
	});
	
	$("#Rank_BHMTab").unbind("click").click(function(){
		var api = $("#Rank_ranks ol").data('jsp');
		api.getContentPane().html(function(){
			var HTML = "<div id='Rank_key'><span class='bRankKey'>Rank</span><span class='bNameKey'>Username</span><span class='bBPKey'>Total BP Earned</span></div>";
			$.each(ranks.BHM,function(i,v){
				HTML += "<div class='bRank"+((v.username == player.username)?" player":"")+((i==0)?" topBor":"")+"'>"+(i+1)+".<span class='bName'>"+((v.battlehardMode)?"<span class='BHM'></span>":"")+v.username+"</span><span class='bBP'>"+v.BP+"</span></div>";
			});
			return HTML;
		});
		api.reinitialise();
	});
}