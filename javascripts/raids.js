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
				getRaids.get('reqtype=command&command=bf.getUserRaids();');
			}
		} else {
			if(typeof(raids) == "string") {
				player.raids = $.parseJSON(raids);
			} else {
				player.raids = raids;
			}
			$.each(player.raids, function(i) {
				player.raids[i].eta *= player.gameClockFactor;
				player.raids[i].eta += player.time.timeFromNow(1000)+player.gameClockFactor;
			});
			//clearInterval(player.raids.raidTicker);
			//player.raids.raidTicker = tick_raids(player.raids);
			build_raid_list();
			display_output(false,"Raids Loaded!");
			gettingRaids = false;
			if(currUI===draw_bldg_UI&&BUI.active.name[0]=="Headquarters"&&($("#HQ_Overview").hasClass("open")||BUI.CC.reload)) currUI();
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

	BUI.CC.numRaidsOut = 0;

	$("#IO").removeClass("incomingE incomingF outgoing");

	player.curtown.incomingRaids = $.grep(player.raids, function(v, i) {
							if(v.defendingTown == player.curtown.townName && !v.raidType.match(/(support)/i) && !v.debris && !v.raidOver) {
								$("#IO").addClass("incomingE");
								return true;
							}
							if((v.attackingTown == player.curtown.townName && v.raidOver) || (v.defendingTown == player.curtown.townName && (v.raidType.match(/support/i) && !v.debris))) {
								if(!v.raidType.match(/support/i) && v.attackingTown != player.curtown.townName) BUI.CC.numRaidsOut++; //incoming support shouldn't be counted
								$("#IO").addClass("incomingF");
								return true;
							}
						});
	player.curtown.incomingRaids.sort(function(a, b) {
										return a.eta - b.eta;
									});
	player.curtown.outgoingRaids = $.grep(player.raids, function(v, i) {
							if(v.attackingTown == player.curtown.townName && !v.raidOver) {
								BUI.CC.numRaidsOut++;
								$("#IO").addClass("outgoing");
								return true;
							}
						});
	player.curtown.outgoingRaids.sort(function(a, b) {
										return a.eta - b.eta;
									});
									
	$("#IO").text(player.curtown.incomingRaids.length+"/"+player.curtown.outgoingRaids.length);
	
	//this is here just to make sure that numRaidsOut is always correct.
	if(player.curtown.supportAbroad) {
		$.each(player.curtown.supportAbroad, function() {
					BUI.CC.numRaidsOut++;
				});
	}
	
	$('#incomming_attacks ul').html(function() {
		var HTML = "";
		$.each(player.curtown.incomingRaids, function(i, v) {
			if(v.raidOver) {
				HTML += "<li><span class='raidTitle'>Return from " + v.defendingTown
						+ "</span> - <span class='raidETA'>" + v.eta + "</span>\
					<span class='raidID'>" + v.id + "</span></li>";
			} else {
				var type = (v.raidType.match(/^off/i))? "offensive support":v.raidType;
				HTML += "<li><span class='raidTitle'>" + type + " from " + v.attackingTown
						+ "</span> - <span class='raidETA'>" + v.eta + "</span>\
					<span class='raidID'>" + v.id + "</span></li>";
			}
		});
		return HTML;
	});
	$('#outgoing_attacks ul').html(function() {
		var HTML = "";
		$.each(player.curtown.outgoingRaids, function(i, v) {
			var type = (v.raidType.match(/^off/i))? "offensive support":v.raidType;
			var to = (type.match(/(support|debris)/i))? " to ":((type.match(/inva/i))? " of ":" on ");
			HTML += "<li><div class='recall'></div><span class='raidTitle'>" + type + to + v.defendingTown
					+ "</span> - <span class='raidETA'>" + v.eta + "</span>\
					<span class='raidID'>" + v.id + "</span></li>";
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
		recall.get("reqtype=command&command=bf.recall(" + rid + ");");
	});

	update_raid_display();
}

function update_raid_display() {

		clearInterval(player.raidDisplayTimer);
		player.curtown.outgoingRaids.displayTimer =
			setInterval(function() {
			try {
				if(player.curtown.outgoingRaids.length > 0) {
					$('#outgoing_attacks .raidETA').each(function(i, v) {
					
						if($(this).siblings(".raidID").text() != player.curtown.outgoingRaids[i].id) {build_raid_list();}
						var time = player.curtown.outgoingRaids[i].eta-player.time.timeFromNow(1000);
						if(time>0) {
							$(this).html(function() {
								var hours = Math.floor(time / 3600);
								var mins = Math.floor((time % 3600) / 60);
								var secs = Math.floor((time % 3600) % 60);
								return hours.toTime() + ":" + mins.toTime() + ":" + secs.toTime();
							});
						} else {
							$(this).html("updating");
							if(player.curtown.outgoingRaids[i].raidType.match(/invasion|support/)) {
								map.update = true;
								SR.update = true;
								load_player(false,true);
							} else {
								get_SRs();
								get_raids(true);
							}
						}
					});
				}
			} catch(e) {
				log(e);
			}
			try {
				if(player.curtown.incomingRaids.length > 0) {
					$('#incomming_attacks .raidETA').each(function(i, v) {
						if($(this).siblings(".raidID").text() != player.curtown.incomingRaids[i].id) {build_raid_list();}
						var time = player.curtown.incomingRaids[i].eta-player.time.timeFromNow(1000);
						if(time>0) {
							$(this).html(function() {
								var hours = Math.floor(time / 3600);
								var mins = Math.floor((time % 3600) / 60);
								var secs = Math.floor((time % 3600) % 60);
								return hours.toTime() + ":" + mins.toTime() + ":" + secs.toTime();
							});
						} else {
							$(this).html("updating");
							load_player(false,true);
						}
					});
				}
			} catch(e) {
				log(e);
			}
		}, 1000);
}