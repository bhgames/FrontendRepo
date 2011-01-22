/**************************************************************************************************************\
******************************************Unit Template Creation Center*****************************************
\**************************************************************************************************************/
var UTCC = {
			canSave : can_save,
			HTML : "<div id='UTCC_darkFrame'><div class='darkFrameBody'>\
						<div id='UTCC_AUinfo'>\
							<div class='textFrameT-L-R'>\
								<div class='textFrameT'><div class='textFrameL'><div class='textFrameR'>\
									<div class='textFramed'>\
										<div id='UTCC_AUname'>\
											<label for='UTCC_AUnameInput'>Name: </label><input type='text' id='UTCC_AUnameInput' maxlength='20' autofocus='autofocus' value='New Template'/>\
										</div>\
										<div id='UTCC_AUType'>\
											<label for='UTCC_AUTypeSelect'>Unit Type: </label><select id='UTCC_AUTypeSelect'>\
															<option>Soldier</option>\
															<option>Tank</option>\
															<option>Juggernaut</option>\
															<option>Bomber</option>\
														</select>\
										</div>\
										<div id='UTCC_AUgraphic'>\
											<label for='UTCC_AUgraphicNum'>Graphic: </label><select id='UTCC_AUgraphicNum'>\
														<option>1</option>\
														<option>2</option>\
														<option>3</option>\
														<option>4</option>\
														<option>5</option>\
														<option>6</option>\
														<option>7</option>\
														<option>8</option>\
														<option>9</option>\
														<option>10</option>\
													</select>\
										</div>\
									</div>\
								</div></div></div>\
							</div>\
							<div class='textFrameB-BL-BR'>\
								<div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
							</div>\
						</div>\
						<div id='UTCC_AUstatBox'>\
							<div class='lightFrameBody'>\
								<div id='UTCC_AUstats'>\
									<div id='UTCC_AUconceal'><img src='AIFrames/icons/stealth.png' title='Concealment' alt='Concealment' /> <input type='text' id='UTCC_AUnumConceal' maxlength='4' value='0' /></div>\
									<div id='UTCC_AUarmor'><img src='AIFrames/icons/armor.png' title='Armor' alt='Armor' /> <input type='text' id='UTCC_AUnumArmor' maxlength='4' value='0' /></div>\
									<div id='UTCC_AUspeed'><img src='AIFrames/icons/speed.png' title='Speed' alt='Speed' /> <input type='text' id='UTCC_AUnumSpeed' maxlength='4' value='0' /></div>\
								</div>\
								<div id='UTCC_AUweapStats'>\
									<div id='UTCC_AUFP'><img src='AIFrames/icons/firepower.png' title='Unit Firepower' alt='Unit Firepower' /> <span class='stat'>0</span></div>\
									<div id='UTCC_AUAmmo'><img src='AIFrames/icons/ammo.png' title='Unit Ammunition' alt='Unit Ammunition' /> <span class='stat'>0</span></div>\
									<div id='UTCC_AUAccu'><img src='AIFrames/icons/accuracy.png' title='Unit Accuracy' alt='Unit Accuracy' /> <span class='stat'>0</span></div>\
								</div>\
								<div id='UTCC_AUcargo'><img src='AIFrames/icons/cargo.png' title='Cargo Capacity' alt='Cargo Capacity' /><br/><input type='text' id='UTCC_AUnumCargo' maxlength='4' value='0' /></div>\
								<div id='UTCC_AUPoints'><span id='UTCC_curPoints'>0</span>/<span id='UTCC_totalPoints'>400</span></div>\
							</div>\
							<div class='lightFrameBL-BR-B'>\
								<div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
							</div>\
						</div>\
						<div id='UTCC_fail'></div>\
						<div id='UTCC_unitInfoBox'>\
							<div class='textFrameT-L-R'>\
								<div class='textFrameT'><div class='textFrameL'><div class='textFrameR'>\
									<div class='textFramed'>\
										<div id='UTCC_unitDescBox'>\
											<img src='images/client/units/soldier0.png' id='UTCC_AUpic' />\
											<div id='UTCC_unitDesc'></div>\
										</div>\
										<div id='UTCC_AUweapImages'></div>\
									</div>\
								</div></div></div>\
							</div>\
							<div class='textFrameB-BL-BR'>\
								<div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
							</div>\
						</div>\
						<div id='UTCC_weapons'>\
							<div class='textFrameT-L-R'>\
								<div class='textFrameT'><div class='textFrameL'><div class='textFrameR'>\
									<div class='textFramed'>\
										<div id='UTCC_weaponInfo'></div>\
										<select id='UTCC_weaponSelect' size='5'></select>\
									</div>\
								</div></div></div>\
							</div>\
							<div class='textFrameB-BL-BR'>\
								<div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
							</div>\
						</div>\
						<div id='UTCC_appWeapon'></div>\
						<div id='UTCC_AUsave-load'>\
							<div id='UTCC_selectAUTBox'>\
								<div class='textFrameT-L-R'>\
									<div class='textFrameT'><div class='textFrameL'><div class='textFrameR textFramed'>\
										<select id='UTCC_AUlist' size='6'></select>\
									</div></div></div>\
								</div>\
								<div class='textFrameB-BL-BR'>\
									<div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
								</div>\
							</div>\
							<a href='javascript:;' id='UTCC_newAU'></a>\
							<a href='javascript:;' id='UTCC_saveAU' class='noSave'></a>\
							<a href='javascript:;' id='UTCC_loadAU'></a>\
							<a href='javascript:;' id='UTCC_deleteAU'></a>\
						</div>\
					</div>\
					<div class='darkFrameBL-BR-B'>\
						<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
					</div></div>",
			weapons : [],
			unitDesc : ["The soldier is your basic infantry unit.  All soldiers are either full or partial conversion \
							cyborgs.  On today's battlefield, AI assisted soldiers are a requirement.  The average \
							human simply cannot process fast enough to be effective.  Combat AIs allow soldiers to \
							focus on the battle at hand by keeping track of other miscellaneous activities such as \
							Friend-or-Foe recognition, ammo tracking, and mission updates.",
						"The tank of today is more or less the same as the tank of yesterday, with a few important \
							exceptions.  Firstly, all tank operators are full or partial conversion cyborgs allowing \
							them to directly interface with the tank.  This has increased the response time and \
							survivability of tank crews exponentially.  An average of two crew members interface with the \
							weapons systems giving accurate, independent targeting for up to four weapons.  The remaining \
							crew members perform other miscellaneous tasks within the tank such as reloading standard \
							ammunition or replacing spent fuel cells and maintaining the tank when not in active service.",
						"The Juggernaut is the epitome of combat technology.  A crew of 8 pilot this behemoth on the \
							battlefield.  Equipped with state-of-the-art combat technologies, such as the Quantum Anomaly \
							Enabler or Singularity Whip, this lumbering hulk can inflict massive damage on unprepared \
							foes.  A remaining crew of 2 military engineers are with the Juggernaut at all times, when not in combat, \
							to repair damage and keep all the systems fully calibrated.",
						"The bomber is the only offensive unit capable of delivering the extremely powerful Tier 4 Weapons \
							of Mass Destruction. Capable of annihilating entire cities and leaving nothing behind, the bombers \
							that carry these weapons are generally quite weak. Due to weight limitations, most bombers are \
							lightly armored and rely on ground forces to clear the way for them."],
			unit : {
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
				}
		};