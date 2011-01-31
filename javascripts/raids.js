/***********************************************************************************************************\
								Functions for the I/O Raids Popup
\***********************************************************************************************************/
var gettingRaids = false;
function get_raids(async, raids) {
	try {
		if(async) {
			if(!gettingRaids) {
				gettingRaids = true;
				display_output(false,"Loading raids...");
				var getRaids = new make_AJAX();
				getRaids.callback = function(response){
					get_raids(false,response);
				};
				getRaids.get('/AIWars/GodGenerator?reqtype=command&command=' + player.command+ '.getUserRaids();');
			}
		} else {
			player.raids = $.parseJSON(raids);
			$.each(player.raids, function(i) {
				player.raids[i].eta *= player.gameClockFactor;
			});
			clearInterval(player.raids.raidTicker);
			player.raids.raidTicker = tick_raids(player.raids);
			build_raid_list();
			display_output(false,"Raids Loaded!");
			gettingRaids = false;
		}
	} catch(e) {
		display_output(true,"Error loading Raids!",true);
		display_output(true,e);
		display_output(false,"Retrying...");
		get_raids(true);
	}
}

function build_raid_list() {
	//do update check
	if(SR.update) {
		get_raids(true);
		get_SRs();
	}

	BUI.HQ.numRaidsOut = 0;

	$("#IO").removeClass("incomingE incomingF outgoing");

	player.curtown.incomingRaids = $.grep(player.raids, function(v, i) {
							if(v.defendingTown == player.curtown.townName && !v.raidType.match(/(support|debris)/i) && !v.raidOver) {
								$("#IO").addClass("incomingE");
								return true;
							}
							if((v.attackingTown == player.curtown.townName && v.raidOver && !v.raidType.match(/support/i)) || (v.defendingTown == player.curtown.townName && (v.raidType.match(/support/i) && !v.raidType.match(/debris/i)))) {
								if(!v.raidType.match(/support/i)) BUI.HQ.numRaidsOut++; //incoming support shouldn't be counted
								$("#IO").addClass("incomingF");
								return true;
							}
						});
	player.curtown.incomingRaids.sort(function(a, b) {
										return a.eta - b.eta;
									});
	player.curtown.outgoingRaids = $.grep(player.raids, function(v, i) {
							if(v.attackingTown == player.curtown.townName && !v.raidOver) {
								BUI.HQ.numRaidsOut++;
								$("#IO").addClass("outgoing");
								return true;
							}
						});
	player.curtown.outgoingRaids.sort(function(a, b) {
										return a.eta - b.eta;
									});
									
	//this is here just to make sure that numRaidsOut is always correct.
	if(player.curtown.supportAbroad) {
		$.each(player.curtown.supportAbroad, function() {
					BUI.HQ.numRaidsOut++;
				});
	}
	
	$('#incomming_attacks ul').html(function() {
		var HTML = "";
		$.each(player.curtown.incomingRaids, function(i, v) {
			if(v.raidOver) {
				HTML += "<li><span class='raidTitle'>Return from " + v.defendingTown
						+ "</span> - <span class='raidETA'>" + v.eta + "</span>\
					<span class='raidID'>" + v.rid + "</span></li>";
			} else {
				var type = (v.raidType.match(/^off/i))? "offensive support":v.raidType;
				HTML += "<li><span class='raidTitle'>" + type + " from " + v.attackingTown
						+ "</span> - <span class='raidETA'>" + v.eta + "</span>\
					<span class='raidID'>" + v.rid + "</span></li>";
			}
		});
		return HTML;
	});
	$('#outgoing_attacks ul').html(function() {
		var HTML = "";
		$.each(player.curtown.outgoingRaids, function(i, v) {
			var type = (v.raidType.match(/^off/i))? "offensive support":v.raidType;
			var to = (type.match(/(support|debris)/i))? " to ":((type.match(/inva/i))? " of ":" on ");
			HTML += "<li><a href='javascript:;' class='recall'></a><span class='raidTitle'>" + type + to + v.defendingTown
					+ "</span> - <span class='raidETA'>" + v.eta + "</span>\
					<span class='raidID'>" + v.rid + "</span></li>";
		});
		return HTML;
	});
		
	$(".recall").unbind('click').click(function() {
		var rid = $(this).siblings(".raidID").text();
		recall = new make_AJAX();
		recall.callback = function(response) {
			if(response.match(/true/)) {
				get_raids(true);
			} else {
				var error = response.split(":");
				if(error.length==2)error=error[1];
				display_output(true,error,true);
			}
		};
		recall.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".recall(" + rid + ");");
	});

	update_raid_display();
}

function update_raid_display() {

	if(player.curtown.outgoingRaids) {
		clearInterval(player.curtown.outgoingRaids.displayTimer);
		player.curtown.outgoingRaids.displayTimer =
			setInterval(function() {
			try {
				if(player.curtown.outgoingRaids.length > 0) {
					$('#outgoing_attacks .raidETA').each(function(i, v) {
						if(player.curtown.outgoingRaids[i].update) {
							get_SRs();
							get_raids(true);
						}
						if($(this).siblings(".raidID").text() != player.curtown.outgoingRaids[i].rid) $(this).parent().remove();
						if(player.curtown.outgoingRaids[i].eta != "updating") {
							$(this).html(function() {
								var time = player.curtown.outgoingRaids[i].eta;
								var hours = (time / 3600 < 10)?"0" + Math.floor(time / 3600): Math.floor(time / 3600);
								var mins = ((time % 3600) / 60 < 10)?"0" + Math.floor((time % 3600) / 60):Math.floor((time % 3600) / 60);
								var secs = ((time % 3600) % 60 < 10)?"0" + Math.floor((time % 3600) % 60):Math.floor((time % 3600) % 60);
								return hours + ":" + mins + ":" + secs;
							});
						} else {
							$(this).html(player.curtown.outgoingRaids[i].eta);
						}
					});
				} else {
					clearInterval(player.curtown.outgoingRaids.displayTimer);
				}
			}
			catch(e) {
				log(e);
			}
		}, 1000);
	}
	
	if(player.curtown.incomingRaids) {
		clearInterval(player.curtown.incomingRaids.displayTimer);
		player.curtown.incomingRaids.displayTimer =
			setInterval(function() {
			try {
				if(player.curtown.incomingRaids.length > 0) {
					$('#incomming_attacks .raidETA').each(function(i, v) {
						if(player.curtown.incomingRaids[i].update) {
							get_SRs();
							get_raids(true);
							load_player(player.league,true);
						}
						if($(this).siblings(".raidID").text() != player.curtown.incomingRaids[i].rid) $(this).parent().remove();
						if(player.curtown.incomingRaids[i].eta != "updating") {
							$(this).html(function() {
								var time = player.curtown.incomingRaids[i].eta;
								var hours = (time / 3600 < 10)?"0" + Math.floor(time / 3600): Math.floor(time / 3600);
								var mins = ((time % 3600) / 60 < 10)?"0" + Math.floor((time % 3600) / 60):Math.floor((time % 3600) / 60);
								var secs = ((time % 3600) % 60 < 10)?"0" + Math.floor((time % 3600) % 60):Math.floor((time % 3600) % 60);
								return hours + ":" + mins + ":" + secs;
							});
						} else {
							$(this).html(player.curtown.incomingRaids[i].eta);
						}
					});
				} else {
					clearInterval(player.curtown.incomingRaids.displayTimer);
				}
			}
			catch(e) {
				log(e);
			}
		}, 1000);
	}
}