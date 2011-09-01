/***********************************************************************************************************\
							Functions for the Unit Template Creation Center
\***********************************************************************************************************/
function build_UTCC() {
	currUI = build_UTCC;	//set current UI function to be called by the tickers
	$("#window").contents().unbind();
	$("#window").html(UTCC.HTML);
	//populate select boxes
		//populate Weapon Select Box and apply event handlers
	$("#UTCC_weaponSelect").html(function() {
		var list="";
		$.each(UTCC.weapons, function(i, v) {
			list += "<option>" + v.name + "</option>";
		});
		return list;
	}).unbind('change').change(function(){
		$("#UTCC_appWeapon").removeClass('clear');
		$("#UTCC_weaponInfo").html("");
		$(this).children().each(function(i, v) {
			if(v.selected) {
				var points = 0;
				switch(UTCC.weapons[i].tier) {
					case 4:
					case 1:
						points = 100;
						break;
					case 2:
						points = 200;
						break;
					case 3:
						points = 400;
						break;
				}
				$("#UTCC_weaponInfo").html(function() {
					var HTML = "<div id='UTCC_AUweapInfoStats'>\
								 <div id='UTCC_AUweapFP'><img src='AIFrames/icons/firepower.png' title='Weapon Firepower' alt='Weapon Firepower' /> <span class='stat'>" + UTCC.weapons[i].fp + "</span></div>\
								 <div id='UTCC_AUweapAmmo'><img src='AIFrames/icons/ammo.png' title='Weapon Ammunition' alt='Weapon Ammunition' /> <span class='stat'>" + UTCC.weapons[i].amm + "</span></div>\
								 <div id='UTCC_AUweapAccu'><img src='AIFrames/icons/accuracy.png' title='Weapon Accuracy' alt='Weapon Accuracy' /> <span class='stat'>" + UTCC.weapons[i].acc + "</span></div>\
						 <div id='UTCC_AUweapPoints'>Points: <span class='stat'>" + points + "</span></div>\
							 </div>\
							 <img src='images/client/weapons/" + UTCC.weapons[i].name.toLowerCase().replace(/\s/g, "-") + ".png' id='UTCC_weaponImage' />";
					HTML += UTCC.weapons[i].desc;
					return HTML;
				}).scrollTop(0);
			}
		});
	}).unbind('click').click(function() {
		$(this).change();
	});
	$("#UTCC_AUlist").html(function() {
		var list="";
		$.each(player.AUTemplates, function(i, v) {
			list += "<option>" + v.name + "</option>";
		});
		return list;
	});
	$("#UTCC_AUnameInput").unbind('focus').focus(function() {
		if($(this).val() == "New Template") $(this).val("");
	}).unbind('blur').blur(function(){
		if($(this).val() == "") {
			$(this).val("New Template");
		} else {
			UTCC.unit.name = $(this).val();
			update_values();
		}
	});
	$("#UTCC_AUTypeSelect").unbind('change').change(function() {
		$(this).children().each(function(i, v) {
			if(v.selected && $(v).val() == "Bomber") {
				$("#UTCC_AUgraphicNum").html(function() {
					var HTML = "";
					for(var x = 1; x < 6; x++) {
						HTML += "<option>" + x + "</option>";
					}
					return HTML;
				});
				UTCC.unit.tier = i + 1;
			} else if(v.selected) {
				$("#UTCC_AUgraphicNum").html(function() {
					var HTML = "";
					for(var x = 1; x < 11; x++) {
						HTML += "<option>" + x + "</option>";
					}
					return HTML;
				});
				UTCC.unit.tier = i + 1;
			}
		});
		$("#UTCC_unitDesc").scrollTop(0);
		update_values();
	});

	$("#UTCC_unitDesc").html(UTCC.unitDesc[UTCC.unit.tier - 1]);
	
	$("#UTCC_AUgraphicNum").unbind('change').change(function() {
		$(this).children().each(function(i, v) {
			if(v.selected) {
				UTCC.unit.graphicNum = i;
			}
		});
		update_values();
	});
	$("#UTCC_appWeapon").unbind('click').click(function() {
		if($(this).hasClass('clear')) {
			$("#UTCC_AUweapImages img").each(function(i, v) {
				if($(v).hasClass('active')) {
					UTCC.unit.weapons.splice(i,1);
				}
			});
		} else {
			$("#UTCC_weaponSelect").children().each(function(i, v) {
				if(v.selected) {
					UTCC.unit.weapons.unshift(UTCC.weapons[i]);
					UTCC.unit.weapons[0].index = i;
				}
			});
		}
		update_values();
	});
	$("#UTCC_AUweapImages img").die('click').live('click',function() {
		$("#UTCC_appWeapon").addClass('clear');
		$(this).addClass('active').siblings().removeClass('active');
		var i = UTCC.unit.weapons[$(this).index()].index;
		var points = 0;
		switch(UTCC.weapons[i].tier) {
			case 4:
			case 1:
				points = 100;
				break;
			case 2:
				points = 200;
				break;
			case 3:
				points = 400;
				break;
		}
		$("#UTCC_weaponInfo").html(function() {
			var HTML = "<div id='UTCC_AUweapInfoStats'>\
						 <div id='UTCC_AUweapFP'><img src='AIFrames/icons/firepower.png' title='Weapon Firepower' alt='Weapon Firepower' /> <span class='stat'>" + UTCC.weapons[i].fp + "</span></div>\
						 <div id='UTCC_AUweapAmmo'><img src='AIFrames/icons/ammo.png' title='Weapon Ammunition' alt='Weapon Ammunition' /> <span class='stat'>" + UTCC.weapons[i].amm + "</span></div>\
						 <div id='UTCC_AUweapAccu'><img src='AIFrames/icons/accuracy.png' title='Weapon Accuracy' alt='Weapon Accuracy' /> <span class='stat'>" + UTCC.weapons[i].acc + "</span></div>\
						 <div id='UTCC_AUweapPoints'>Points: <span class='stat'>" + points + "</span></div>\
					 </div>\
					 <img src='images/client/weapons/" + UTCC.weapons[i].name.toLowerCase().replace(/\s/g, "-") + ".png' id='UTCC_weaponImage' />";
			HTML += UTCC.weapons[i].desc;
			return HTML;
		}).scrollTop(0);
	});
	
	$('#UTCC_AUnumConceal').unbind('keyup').keyup(function(e) {
		if(!((e.keyCode == 8 && UTCC.unit.conceal == 0) || e.keyCode == 37 || e.keyCode == 39)) {
			UTCC.unit.conceal = (isNaN(parseInt($(this).val())))?0:parseInt($(this).val());
			update_values();
		}
	});
	$('#UTCC_AUnumArmor').unbind('keyup').keyup(function(e) {
		if(!((e.keyCode == 8 && UTCC.unit.armor == 0) || e.keyCode == 37 || e.keyCode == 39)) {
			UTCC.unit.armor = (isNaN(parseInt($(this).val())))?0:parseInt($(this).val());
			update_values();
		}
	});
	$('#UTCC_AUnumSpeed').unbind('keyup').keyup(function(e) {
		if(!((e.keyCode == 8 && UTCC.unit.speed == 0) || e.keyCode == 37 || e.keyCode == 39)) {
			UTCC.unit.speed = (isNaN(parseInt($(this).val())))?0:parseInt($(this).val());
			update_values();
		}
	});
	$('#UTCC_AUnumCargo').unbind('keyup').keyup(function(e) {
		if(!((e.keyCode == 8 && UTCC.unit.cargo == 0) || e.keyCode == 37 || e.keyCode == 39)) {
			UTCC.unit.cargo = (isNaN(parseInt($(this).val())))?0:parseInt($(this).val());
			update_values();
		}
	});
	
	$('#UTCC_newAU').unbind('click').click(function() {
		UTCC.unit = {			//reset unit variable
					name : "New Template",
					tier: 1,
					conceal: 0,
					armor: 0,
					speed: 0,
					cargo: 0,
					weapons: [],
					graphicNum: 0,
					points: 0,
					maxPoints: 400
				};
		update_values();
	});
	$('#UTCC_saveAU').unbind('click').click(function() {
		if(!$(this).hasClass('noSave')) {
			saveTemplate = new make_AJAX();
			
			saveTemplate.callback = function() {
				var success = saveTemplate.responseText.split(";")[0];
				if(success.match(/^false/) == null) {
					load_player(player.league, player.curtown.townID, build_UTCC);  	//update the player object
				} else {
					$("#UTCC_fail").html(success.split(":")[1]);
				}
			};
			
			var weaponArray = [];
			$.each(UTCC.unit.weapons, function(i, v) {
				weaponArray.push(v.index);
			});
			saveTemplate.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".createUnitTemplate(" 
				+ UTCC.unit.name + "," + UTCC.unit.tier + "," + UTCC.unit.conceal + "," + UTCC.unit.armor 
				+ "," + UTCC.unit.cargo + "," + UTCC.unit.speed + ",[" + weaponArray + "]," 
				+ UTCC.unit.graphicNum + ");");
		}
	});
	$('#UTCC_loadAU').unbind('click').click(function() {
		$("#UTCC_AUlist").children().each(function(i, v) {
			if(v.selected) {
				UTCC.unit = {	//reset the unit so we don't run into errors
					name : "New Template",
					tier: 1,
					conceal: 0,
					armor: 0,
					speed: 0,
					cargo: 0,
					weapons: [],
					graphicNum: 0,
					points: 0,
					maxPoints: 400
				};
				
				UTCC.unit.conceal = player.AUTemplates[i].conc;
				UTCC.unit.armor = player.AUTemplates[i].armor;
				UTCC.unit.speed = player.AUTemplates[i].speed;
				UTCC.unit.cargo = player.AUTemplates[i].cargo;
				UTCC.unit.name = player.AUTemplates[i].name;
				UTCC.unit.graphicNum = player.AUTemplates[i].graphicNum;
				switch(player.AUTemplates[i].popSize) {
					case 1: //soldier
						UTCC.unit.tier = 1;
						break;
					case 5: //tank
						UTCC.unit.tier = 2;
						break;
					case 10: //juggernaught
						UTCC.unit.tier = 3;
						break;
					case 20: //bomber
						UTCC.unit.tier = 4;
						break;
				}
				$.each(player.AUTemplates[i].weap,function(x, v) {
					UTCC.unit.weapons.unshift(UTCC.weapons[v]);
					switch(true) {
						case v < 6:
							UTCC.unit.weapons[0].tier = 1;
							break;
						case v < 12:
							UTCC.unit.weapons[0].tier = 2;
							break;
						case v < 18:
							UTCC.unit.weapons[0].tier = 3;
							break;
						default: //anything else will be treated as t4
							UTCC.unit.weapons[0].tier = 4;
					}
					UTCC.unit.weapons[0].index = v;
				});
				
				update_values();
			}
		});
	});
	$('#UTCC_deleteAU').unbind('click').click(function() {
		$("#UTCC_AUlist").children().each(function(i, v) {
			if(v.selected) {
				if(confirm("Are you sure you want to delete template " + player.AUTemplates[i].name)) {
					deleteTemplate = new make_AJAX();
					
					deleteTemplate.callback = function() {
						var success = deleteTemplate.responseText.split(";")[0];
						if(success.match(/^false/) == null) {
								//update the player object.
							load_player(player.league, player.curtown.townID, build_UTCC);
						} else {
							$("#UTCC_fail").html(success.split(":")[1]);
						}
					};
					
					deleteTemplate.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command 
										+ ".deleteAUTemplate(" + player.AUTemplates[i].name + ");");
				}
			}
		});
	});
	update_values();
	$("#window").fadeIn("fast"); //modified
}

function update_values() {
		//determine the players current number of points
	UTCC.unit.points = UTCC.unit.conceal + UTCC.unit.armor + UTCC.unit.speed + UTCC.unit.cargo;
	$.each(UTCC.unit.weapons, function(i, v) {
		switch(v.tier) {
			case 4:
			case 1:
				UTCC.unit.points += 100;
				break;
			case 2:
				UTCC.unit.points += 200;
				break;
			case 3:
				UTCC.unit.points += 400;
				break;
		}
	});
		//determine max points
	switch(UTCC.unit.tier) {
		case 1:
			UTCC.unit.maxPoints = 400;
			break;
		case 2:
			UTCC.unit.maxPoints = 800;
			break;
		case 3:
			UTCC.unit.maxPoints = 1600;
			break;
		case 4:
			UTCC.unit.maxPoints = 200;
			break;
	}
		//display point values
	$("#UTCC_totalPoints").html(UTCC.unit.maxPoints);
	$("#UTCC_curPoints").html(UTCC.unit.points);
	if(UTCC.unit.points > UTCC.unit.maxPoints) { 		//if more points are assigned then can be saved
		$("#UTCC_curPoints").addClass('tooMany');
	} else {
		$("#UTCC_curPoints").removeClass('tooMany');	//make curPoints red
	}
	
	$("#UTCC_AUpic").attr("src", path);
	
		//update weapon images
	$("#UTCC_AUweapImages").html("");
	
	var weapAttr = {fp: 0, amm:0, acc: 0};
	$.each(UTCC.unit.weapons,function(i, v) {
		$("#UTCC_AUweapImages").html(function(i, oldHTML) {
			return oldHTML + "<img src='images/client/weapons/" + v.name.toLowerCase().replace(/\s/g,"-") + ".png' title='" + v.name + "' />";
		});
		weapAttr.fp += v.fp;
		weapAttr.amm += v.amm;
		weapAttr.acc += v.acc;
	});
		//update unit name
	$("#UTCC_AUnameInput").val(UTCC.unit.name);
	
		//update weapon attributes
	$('#UTCC_AUFP span').html(weapAttr.fp);
	$('#UTCC_AUAmmo span').html(weapAttr.amm);
	$('#UTCC_AUAccu span').html(weapAttr.acc);
	
		//update the input boxes
	$('#UTCC_AUnumConceal').val(UTCC.unit.conceal);
	$('#UTCC_AUnumArmor').val(UTCC.unit.armor);
	$('#UTCC_AUnumSpeed').val(UTCC.unit.speed);
	$('#UTCC_AUnumCargo').val(UTCC.unit.cargo);
	
		//update the graphic selector
	$("#UTCC_AUgraphicNum").children().each(function(i, v) {
		if(i == UTCC.unit.graphicNum) {
			v.selected = true;
		} else {
			v.selected = false;
		}
	});
	
		//update the type selector
	$("#UTCC_AUTypeSelect").children().each(function(i, v) {
		if(i + 1 == UTCC.unit.tier) {
			v.selected = true;
		} else {
			v.selected = false;
		}
	});	
	
		//update the AU image
	var unit = $("#UTCC_AUTypeSelect");
	var path = "AIFrames/units/" + unit.val().toLowerCase() +"renderSMALL.png";
	
		//update the tank image
	var rank = $("#UTCC_AUgraphicNum");
	var rankPath = "AIFrames/units/" + ((rank.children().length < 10)?"bomb":"") + "insig" + rank.val() +".png";
	
	$("#UTCC_AUpic").attr("src",path);
	$("#UTCC_RankPic").attr("src",rankPath);
	
	//update the unit description
	var classType="";
	var classEff="";
	switch(parseInt(rank.val())) {
		case 1:
			classType = "Destroyer Class";
			classEff = "No Bonus.";
			break;
		case 2:
			classType = "Havoc Class";
			if(unit.val()=="Bomber") classEff = "25% increase in Unit Damage";
			else classEff = "5% FP, AMM, ACC bonus";
			break;
		case 3:
			if(unit.val()=="Bomber") {
				classType = "Devastator Class";
				classEff = "25% increase in Building Damage";
			} else { 
				classType = "Defender Class";
				classEff = "5% CONC, ARMOR, CARGO, SPEED bonus";
			}
			break;
		case 4:
			if(unit.val()=="Bomber") {
				classType = "Mayhem Class";
				classEff = "15% damage bonus";
			} else { 
				classType = "Devastator Class";
				classEff = "5% stat bonus";
			}
			break;
		case 5:
			if(unit.val()=="Bomber") {
				classType = "Armageddon Class";
				classEff = "25% damage bonus";
			} else { 
				classType = "Mayhem Class";
				classEff = "10% stat bonus, <span title='Based on percentage of army with a BP bosting Class'>5% BP Boost</span>";
			}
			break;
		case 6:
			classType = "Battlehard Class";
			classEff = "25% BP bonus";
			break;
		case 7:
			classType = "Stonewall Class";
			classEff = "25% Cover Size Limit deflection";
			break;
		case 8:
			classType = "Ironside Class";
			classEff = "25% BP boost, 25% Cover Size Limit deflection, 5% stat bonus";
			break;
		case 9:
			classType = "Impervious Class";
			classEff = "50% weather resistance, 10% stat bonus";
			break;
		case 10:
			classType = "Conqueror Class";
			classEff = "25% weather resistance, 25% Cover Size Limit deflection, 10% stat bonus";
			break;
	}
	$("#UTCC_unitDesc").html(classType+"<br/>"+classEff+"<br/><br/>"+UTCC.unitDesc[UTCC.unit.tier - 1]);
	UTCC.canSave();
}

function can_save() {
	$("#UTCC_fail").html("");
	savable = new make_AJAX();
	savable.callback = function() {
		var success = savable.responseText.split(";")[0];
		if(success.match(/^false/) == null) {
			$("#UTCC_saveAU").removeClass('noSave');
		} else {
			$("#UTCC_saveAU").addClass('noSave');
			$("#UTCC_fail").html(success.split(":")[1]);
		}
	};
	var weaponArray = [];
	$.each(UTCC.unit.weapons, function(i, v) {
		weaponArray.push(v.index);
	});
	savable.get("/AIWars/GodGenerator?reqtype=command&command=" + player.command + ".canCreateUnitTemplate(" 
				+ UTCC.unit.name + "," + UTCC.unit.tier + "," + UTCC.unit.conceal + "," + UTCC.unit.armor 
				+ "," + UTCC.unit.cargo + "," + UTCC.unit.speed + ",[" + weaponArray + "]," 
				+ UTCC.unit.graphicNum + ");");
}