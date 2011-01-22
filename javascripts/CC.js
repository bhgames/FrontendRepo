function CC_UI(bldgInfo) {
	$("#CC_tabs a").click(function() {
		if(!$(this).hasClass("open")) {
			$(this).addClass("open").siblings("a.open").removeClass("open");
			
			if($(this).is("#CC_activityTab")) {
				$("#CC_window").html(BUI.CC.aTab);
					//add code for trades
				$("#CC_raidList").html(function() {
					var HTML = "";
					$.each(player.raids, function(i,v) {
						HTML += "<div class='activeRaid "+(i%2==0?" resWhite":" resBlack")+"'><div class='destTown'>"+v.defendingTown
									+"</div><div id='originTown'>"+v.attackingTown;
					});
				});
			}//endif overview tab
		}
	});
	$("#CC_activityTab").click();
}

/*
	PLANS AND IDEAS:
		Two lists, one for trades, one for raids
		Both show origin and destination
		Raids do not show AU
			I'm thinking yours might have an info link that lets you view them in more detail
		Trades show resources
		Trades to not show interval or number to do (if available)
			Like raids, your trades will have more information available
		
		Tabs: (long run.  I'm thinking have all these for beta 3)
			Overview - 
				General information on the current town
				CSL, CS
				Resources, Warehouse caps
				Number of messages/SRs
			Town Overview -
				Lists all towns
				Shows CSL and CS
				Shows current resources and current warehouse caps
				Doesn't show airships
			Airship Manager - 
				Lists all Airship
				Shows CSL and CS
				Shows current resources and warehouse caps
				Shows current location, destination, and ETA
				if not moving, shows movement controls
*/