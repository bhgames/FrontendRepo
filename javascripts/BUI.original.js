/**************************************************************************************************************\
******************************************Building Universal Interface******************************************
\**************************************************************************************************************/
var BUI = { //the Building Universal Interface object will hold everything our various UIs need and keep them all in one place!
	build : build_bldg_UIs,
	head : "<div id='BUI_outerBox'>\
				<div class='darkFrameBody'>\
					<div id='BUI_header'>\
						<div id='BUI_bldgInfo'>\
							<span id='BUI_bldgName'></span><span id='BUI_bldgLvl'></span>\
							<div id='BUI_upgrading'></div>\
						</div>\
						<div id='BUI_extras'></div>\
						<div id='BUI_fail'></div>\
						<div id='BUI_upCost'>\
							<div id='BUI_upSteel' class='noRes'></div>\
							<div id='BUI_upWood' class='noRes'></div>\
							<div id='BUI_upManMade' class='noRes'></div>\
							<div id='BUI_upFood' class='noRes'></div>\
							<div id='BUI_upButton' class='noUp'></div>\
							<div id='BUI_upTime' class='noRes'>??:??:??</div>\
						</div>\
						<select id='BUI_bldgSwitch'></select>\
					</div>\
					<div id='BUI_bldgContent'></div>\
					<div id='BUI_deconButton'></div>\
				</div>\
				<div class='darkFrameBL-BR-B'>\
					<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
				</div>\
			</div>", //this goes at the bottom of the page, that's why it's after
	set : set_active, //this way, we just call BUI.set() to set the active element dynamically, makes everything easier
	active : {},
	AF: {//Arms Factory
			name : ["Arms Factory"],
			HTML : "<div id='AF_activeAU'>\
						<span id='AF_AUname'></span>\
						<img src='images/trans.gif' id='AF_AUpic' />\
						<div id='AF_AUweapons'>\
							<div id='AF_AUweapImages'>\
							</div>\
							<div id='AF_AUweapStats'>\
								<div id='AF_AUFP'><img src='images/client/buildings/Firepower-icon.png' title='Unit Firepower' alt='Unit Firepower' /> <span class='stat'>???</span></div>\
								<div id='AF_AUAmmo'><img src='images/client/buildings/ammo-icon.png' title='Unit Ammunition' alt='Unit Ammunition' /> <span class='stat'>???</span></div>\
								<div id='AF_AUAccu'><img src='images/client/buildings/Accur-icon.png' title='Unit Accuracy' alt='Unit Accuracy' /> <span class='stat'>???</span></div>\
							</div>\
						</div>\
						<div id='AF_AUstats'>\
							<div id='AF_AUconceal'><img src='images/client/buildings/Conceal-icon.png' title='Concealment' alt='Concealment' /> <span class='stat'>???</span></div>\
							<div id='AF_AUarmor'><img src='images/client/buildings/armor-icon.png' title='Armor' alt='Armor' /> <span class='stat'>???</span></div>\
							<div id='AF_AUspeed'><img src='images/client/buildings/speed-icon.png' title='Speed' alt='Speed' /> <span class='stat'>???</span></div>\
							<div id='AF_AUcargo'><img src='images/client/buildings/cargo-icon.png' title='Cargo Capacity' alt='Cargo Capacity' <span class='stat'>???</span></div>\
						</div>\
					</div>\
					<div id='AF_AUbar'>\
						<a href='javascript:;' id='AF_AUslot0' class='inactiveAU'>???</a>\
						<a href='javascript:;' id='AF_AUslot1' class='inactiveAU'>???</a>\
						<a href='javascript:;' id='AF_AUslot2' class='inactiveAU'>???</a>\
						<a href='javascript:;' id='AF_AUslot3' class='inactiveAU'>???</a>\
						<a href='javascript:;' id='AF_AUslot4' class='inactiveAU'>???</a>\
						<a href='javascript:;' id='AF_AUslot5' class='inactiveAU'>???</a>\
						<div id='AF_assignAU'>\
							<div id='AF_AUassignButton'><a href='javascript:;'></a></div>\
							<select id='AF_AUassignList'>\
							</select>\
						</div>\
					</div>\
					<div id='AF_bldPpl'>\
						<span id='AF_pplName'>Build Units:</span>\
						<input type='text' id='AF_numPpl' maxlength='4' />\
						<div id='AF_bldPplButton'><a href='javascript:;' class='noBld'></a></div>\
						<div id='AF_bFail'></div><br />\
						<div id='AF_pplSteel' class='noRes'>???</div>\
						<div id='AF_pplWood' class='noRes'>???</div>\
						<div id='AF_pplManMade' class='noRes'>???</div>\
						<div id='AF_pplFood' class='noRes'>???</div>\
						<div id='AF_pplTime' class='noRes'>??:??:??</div>\
					</div>\
					<div id='AF_queue'>\
					</div>",
			build : AF_UI
		},
	Bnkr : {//Bunker
			name : ["Bunker"],
			HTML : "<div id='Bnkr_curModeEffect'></div>\
					<select id='Bnkr_modeSelect'>\
						<option>Defense Mode</option>\
						<option>VIP Mode</option>\
						<option>Resource Cache Mode</option>\
					</select>\
					<a href='javascript:;' id='Bnkr_assign'></a>\
					<div id='Bnkr_modeEffect'></div>",
			build : bnkr_UI
			},
	CC : {//Communications Center
		name : ["Communications Center"],
		HTML : "	<div id='CC_tabs'>\
						<a href='javascript:;' id='CC_overviewTab'></a>\
						<a href='javascript:;' id='CC_leagueTab'></a>\
						<a href='javascript:;' id='CC_supportTab'></a>\
						<div id='CC_tabBar'></div>\
					</div>\
					<div id='CC_window'>\
					</div>",
		build : CC_UI
		},
	CY : {//Construction Yard
		name : ["Construction Yard"],
						//pplTime is out of order to make display easier
		HTML : "	<div id='CY_bldPpl'>\
						<div id='CY_pplHelp'><a href='javascript:;'></a></div>\
						<span id='CY_pplName'>Build Engineers:</span>\
						<input type='text' id='CY_numPpl' autofocus='autofocus' maxlength='4' />\
						<div id='CY_bldPplButton'><a href='javascript:;' class='noBld'></a></div>\
						<div id='CY_bFail'></div><br />\
						<div id='CY_pplSteel' class='noRes'>???</div>\
						<div id='CY_pplTime' class='noRes'>??:??:??</div>\
						<div id='CY_pplWood' class='noRes'>???</div>\
						<div id='CY_pplManMade' class='noRes'>???</div>\
						<div id='CY_pplFood' class='noRes'>???</div>\
						<div id='CY_pplBldg'>Number left to build: <span id='CY_numPplBldg'></span></div>\
						<div id='CY_pplNext'>Time till next: <span id='CY_ticksTillNext'></span></div>\
					</div>\
					<div id='CY_queues'>\
						<div id='CY_buildQueue'></div>\
						<div id='CY_deconQueue'></div>\
					</div>",
		build : CY_UI,
		bldgServer : []
		},
	HQ : 	{	//Headquarters
				name : ["Headquarters"],
				/*overHTML : "<h3>Missions Overview</h3>\
							<div id='HQ_missionList'>\
							</div>",
				send*/HTML :"<div id='HQ_AUinput'>\
							<div id='HQ_AU1' class='firstcol'>\
								<div id='HQ_AU1name'></div>\
								<img src='images/trans.gif' id='HQ_AU1pic' />\
								<a href='javascript:;' id='HQ_AU1number'></a>\
								<input type='text' id='HQ_AU1input' class='AUinput' autofocus='autofocus' maxlength='4' value='0'/>\
							</div>\
							<div id='HQ_AU2'>\
								<div id='HQ_AU2name'></div>\
								<img src='images/trans.gif' id='HQ_AU2pic' />\
								<a href='javascript:;' id='HQ_AU2number'></a>\
								<input type='text' id='HQ_AU2input' class='AUinput' maxlength='4' value='0'/>\
							</div>\
							<div id='HQ_AU3' class='firstcol'>\
								<div id='HQ_AU3name'></div>\
								<img src='images/trans.gif' id='HQ_AU3pic' />\
								<a href='javascript:;' id='HQ_AU3number'></a>\
								<input type='text' id='HQ_AU3input' class='AUinput' maxlength='4' value='0'/>\
							</div>\
							<div id='HQ_AU4'>\
								<div id='HQ_AU4name'></div>\
								<img src='images/trans.gif' id='HQ_AU4pic' />\
								<a href='javascript:;' id='HQ_AU4number'></a>\
								<input type='text' id='HQ_AU4input' class='AUinput' maxlength='4' value='0'/>\
							</div>\
							<div id='HQ_AU5' class='firstcol'>\
								<div id='HQ_AU5name'></div>\
								<img src='images/trans.gif' id='HQ_AU5pic' />\
								<a href='javascript:;' id='HQ_AU5number'></a>\
								<input type='text' id='HQ_AU5input' class='AUinput' maxlength='4' value='0'/>\
							</div>\
							<div id='HQ_AU6'>\
								<div id='HQ_AU6name'></div>\
								<img src='images/trans.gif' id='HQ_AU6pic' />\
								<a href='javascript:;' id='HQ_AU6number'></a>\
								<input type='text' id='HQ_AU6input' class='AUinput' maxlength='4' value='0'/>\
							</div>\
						</div>\
						<div id='HQ_supportAUbox'>\
							<span>Support:</span>\
							<div id='HQ_supportAU'>\
							</div>\
						</div>\
						<div id='HQ_CSinfo'>\
							<div id='HQ_CSL'>\
								<div>Cover Soft Limit:</div>\
								<span>0</span>\
							</div>\
							<div id='HQ_armySizeTotal'>\
								<div>Total Army Size:</div>\
								<span>0</span>\
							</div>\
							<div id='HQ_armySize'>\
								<div>Selected Army Size:</div>\
								<span>0</span>\
							</div>\
						</div>\
						<div id='HQ_civWeapon'>\
							<div>Civilian Weapon</div>\
							<select id='HQ_civWeaponSelect'></select>\
							<a href='javascript:;' id='HQ_save'></a>\
						</div>\
						<div id='HQ_killMeBox'>\
							<div style='text-align:center;'>Suicide:</div>\
							<div>Kill all the currently selected AU.</div>\
							<a href='javascript:;' id='HQ_killMe'></a>\
						</div>\
						<div id='HQ_missionSelectList'>\
							<div>Mission Select:</div>\
							<div class='missionSelect firstcol'>\
								<input type='radio' id='HQ_mission1' name='missionRadio' checked='checked'/><label for='HQ_mission1'>Attack</label>\
							</div>\
							<div class='missionSelect'>\
								<input type='radio' id='HQ_mission5' name='missionRadio' /><label for='HQ_mission5'>Defensive Support</label>\
							</div>\
							<div class='missionSelect firstcol'>\
								<input type='radio' id='HQ_mission2' name='missionRadio' /><label for='HQ_mission2'>Genocide</label>\
							</div>\
							<div class='missionSelect'>\
								<input type='radio' id='HQ_mission6' name='missionRadio' /><label for='HQ_mission6'>Offensive Support</label>\
							</div>\
							<div class='missionSelect firstcol'>\
								<input type='radio' id='HQ_mission3' name='missionRadio' /><label for='HQ_mission3'>Strafe</label>\
							</div>\
							<div class='missionSelect'>\
								<input type='radio' id='HQ_mission7' name='missionRadio' /><label for='HQ_mission7'>Scout</label>\
							</div>\
							<div class='missionSelect firstcol'>\
								<input type='radio' id='HQ_mission4' name='missionRadio' /><label for='HQ_mission4'>Glass</label>\
							</div>\
							<div class='missionSelect'>\
								<input type='radio' id='HQ_mission8' name='missionRadio' /><label for='HQ_mission8'>Invasion</label>\
							</div>\
							<select id='HQ_bombingTarget'>\
								<option>All Buildings</option>\
								<option>Warehouses</option>\
								<option>Arms Factories</option>\
								<option>Headquarters</option>\
								<option>Trade Centers</option>\
								<option>Institutes</option>\
								<option>Comm. Centers</option>\
								<option>Construction Yards</option>\
								<option>Bunkers</option>\
							</select>\
						</div>\
						<div id='HQ_missionDesc'></div>\
						<div id='HQ_targetSelect'>\
							<div>Target Coordinates:</div>\
							x:<input type='text' id='HQ_targetX' maxlength='3' />\
							y:<input type='text' id='HQ_targetY' maxlength='3' />\
						</div>\
						<div id='HQ_isValid'></div>\
						<a href='javascript:;' id='HQ_launchAttack' class='noAttack'></a>",
				missionDesc : [	"One time hit on an opponent to collect as much of the spoils as your men can carry.",
								"Support an ally with units that can only help defend his town.  Sending your own troops to support one of your own cities will Station those troops there.",
								"Hit the enemy multiple times from 1/4th the distance until all civilians are dead, then collect spoils. 50% spoils reduction.",
								"Support an ally with units that can not only defend his town but can be launched on offenses from his town. Units cannot be moved from his town to another of his towns, and you will receive status reports of all offensive and defensive actions taken by this particular town.  Sending your own troops to support one of your own cities will Station those troops there.",
								"One time bombing run on enemies to collect as much of the spoils as your men can carry.",
								"Run a scouting mission on an enemy town. You can only send soldiers on this mission type. Discovery means you  enter into an attack type combat mode with the enemy's defenses.",
								"Hit the enemy multiple times until the bomb targets are all dead, then collect spoils. 50% spoils reduction.",
								"Attempt to invade an enemy city. Only successful if all bunkers and the HQ is killed and the army must possess more than twice as much strength as the defending city in most situations."],
				numRaidsOut : 0,
				x : 0,
				y : 0,
				build : HQ_UI
			},
	IN :	{//Institute
				name : ["Institute"],
				HTML: "	<div id='IN_research'>\
							<div id='IN_numBreakthroughs'>Current Breakthrough: <span></span></div>\
							<div id='IN_addBreakthrough'>Available Breakthroughs: <span></span></div>\
							<div id='IN_breakthrough'>Time till next breakthrough: <span id='IN_timeToBreakthrough'>??:??:??</span></div> |  \
							<div id='IN_researchesAvail' class='noBrk'>Your Scientists have made a Breakthrough!</div>\
							<div id='IN_researchSelection'>\
								<div id='IN_researchList'>\
									<div id='IN_enTech' class='researchTree'>\
										<div class='treeDisc'><a href='javascript:;' class='expand'></a> <span>Engineering</span></div>\
										<div class='researches'>\
											<div id='IN_bldgSlot'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Build Slot Tech</a><span class='name'>buildingSlotTech</span><span class='level'></span></div>\
											<div id='IN_bldgStab'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Building Stability Tech</a><span class='name'>buildingStabilityTech</span><span class='level'></span></div>\
											<div id='IN_lot'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Building Lot Tech</a><span class='name'>lotTech</span><span class='level'></span></div>\
											<div id='IN_unitSlot'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Manufacturing Tech</a><span class='name'>unitLotTech</span><span class='level'></span></div>\
											<div id='IN_CCTech'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Communication Tech</a><span class='name'>commsCenterTech</span><span class='level'></span></div>\
											<div id='IN_town'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Town Tech</a><span class='name'>townTech</span><span class='level'></span></div>\
										</div>\
									</div>\
									<div id='IN_civTech' class='researchTree'>\
										<div class='treeDisc'><a href='javascript:;' class='expand'></a> <span>Civilian Tech</span></div>\
										<div class='researches'>\
											<div id='IN_enEff'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Engineer Efficiency</a><span class='name'>engineerTech</span><span class='level'></span></div>\
											<div id='IN_trEff'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Trader Efficiency</a><span class='name'>tradeTech</span><span class='level'></span></div>\
											<div id='IN_srEff'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Scholar Efficiency</a><span class='name'>scholarTech</span><span class='level'></span></div>\
										</div>\
									</div>\
									<div id='IN_milTech' class='researchTree'>\
										<div class='treeDisc'><a href='javascript:;' class='expand'></a> <span>Military Tech</span></div>\
										<div class='researches'>\
											<div id='IN_af'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Arms Factory Tech</a><span class='name'>afTech</span><span class='level'></span></div>\
											<div id='IN_bunker'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Bunker Tech</a><span class='name'>bunkerTech</span><span class='level'></span></div>\
											<div id='IN_stealth'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Stealth Tech</a><span class='name'>stealthTech</span><span class='level'></span></div>\
											<div id='IN_stealth'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Scout Tech</a><span class='name'>scoutTech</span><span class='level'></span></div>\
											<div id='IN_support'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Support Tech</a><span class='name'>supportTech</span><span class='level'></span></div>\
										</div>\
									</div>\
									<div id='IN_unitTech' class='researchTree'>\
										<div class='treeDisc'><a href='javascript:;' class='expand'></a> <span>Unit Tech</span></div>\
										<div class='researches'>\
											<div id='IN_soldier'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Tech</a><span class='name'>soldierTech</span><span class='level'></span></div>\
											<div id='IN_tank'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Tech</a><span class='name'>tankTech</span><span class='level'></span></div>\
											<div id='IN_jugger'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Tech</a><span class='name'>juggerTech</span><span class='level'></span></div>\
											<div id='IN_bomber'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Bomber Tech</a><span class='name'>bomberTech</span><span class='level'></span></div>\
											<div id='IN_troopPush'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Troop Push</a><span class='name'>troopPush</span><span class='level'></span></div>\
										</div>\
									</div>\
									<div id='IN_weapTech' class='researchTree'>\
										<div class='treeDisc'><a href='javascript:;' class='expand'></a> <span>Weapon Tech</span></div>\
										<div class='researches'>\
											<div id='IN_PAEMPB'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Pump Action EMP Burster</a><span class='name'>weap0</span><span class='level'></span></div>\
											<div id='IN_pulverizer'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Pulverizer</a><span class='name'>weap1</span><span class='level'></span></div>\
											<div id='IN_railGun'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Rail Gun</a><span class='name'>weap2</span><span class='level'></span></div>\
											<div id='IN_plasmaRifle'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Plasma Rifle</a><span class='name'>weap3</span><span class='level'></span></div>\
											<div id='IN_arcThrower'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Arc-Thrower</a><span class='name'>weap4</span><span class='level'></span></div>\
											<div id='IN_laserRifle'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Laser Rifle</a><span class='name'>weap5</span><span class='level'></span></div>\
											<div id='IN_WTFCRL'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>WTF Class Rocket Launcher</a><span class='name'>weap6</span><span class='level'></span></div>\
											<div id='IN_AEMPB'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Automatic EMP Burster</a><span class='name'>weap7</span><span class='level'></span></div>\
											<div id='IN_EMPGL'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>EMP Grenade Launcher</a><span class='name'>weap8</span><span class='level'></span></div>\
											<div id='IN_plasmaMini'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Plasma Minigun</a><span class='name'>weap9</span><span class='level'></span></div>\
											<div id='IN_gaussCannon'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Gauss Cannon</a><span class='name'>weap10</span><span class='level'></span></div>\
											<div id='IN_FALD'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Fully Automated Laser Drone</a><span class='name'>weap11</span><span class='level'></span></div>\
											<div id='IN_BRTHLE'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>B.R.T.H.L.E.</a><span class='name'>weap12</span><span class='level'></span></div>\
											<div id='IN_singuWhip'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Singularity Whip</a><span class='name'>weap13</span><span class='level'></span></div>\
											<div id='IN_SAC'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Superstring Accelerator Cannon</a><span class='name'>weap14</span><span class='level'></span></div>\
											<div id='IN_QAE'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Quantum Anomaly Enabler</a><span class='name'>weap15</span><span class='level'></span></div>\
											<div id='IN_GMAS'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Gauss Minigun with Antigravity Support</a><span class='name'>weap16</span><span class='level'></span></div>\
											<div id='IN_EMPwasp'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>EMP Wasp</a><span class='name'>weap17</span><span class='level'></span></div>\
											<div id='IN_HIVE'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>H.I.V.E.</a><span class='name'>weap18</span><span class='level'></span></div>\
											<div id='IN_horMach'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Horizon Machine</a><span class='name'>weap19</span><span class='level'></span></div>\
											<div id='IN_FNB'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research weap'>Focused Nova Bomb</a><span class='name'>weap20</span><span class='level'></span></div>\
										</div>\
									</div>\
									<div id='IN_extraTech' class='researchTree'>\
										<div class='treeDisc'><a href='javascript:;' class='expand'></a> <span>Extras</span></div>\
										<div class='researches'>\
											<div id='IN_soldierPic0'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 1</a><span class='name'>soldierPic0</span><span class='level'></span></div>\
											<div id='IN_soldierPic1'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 2</a><span class='name'>soldierPic1</span><span class='level'></span></div>\
											<div id='IN_soldierPic2'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 3</a><span class='name'>soldierPic2</span><span class='level'></span></div>\
											<div id='IN_soldierPic3'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 4</a><span class='name'>soldierPic3</span><span class='level'></span></div>\
											<div id='IN_soldierPic4'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 5</a><span class='name'>soldierPic4</span><span class='level'></span></div>\
											<div id='IN_soldierPic5'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 6</a><span class='name'>soldierPic5</span><span class='level'></span></div>\
											<div id='IN_soldierPic6'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 7</a><span class='name'>soldierPic6</span><span class='level'></span></div>\
											<div id='IN_soldierPic7'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 8</a><span class='name'>soldierPic7</span><span class='level'></span></div>\
											<div id='IN_soldierPic8'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 9</a><span class='name'>soldierPic8</span><span class='level'></span></div>\
											<div id='IN_soldierPic8'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Soldier Chassis 10</a><span class='name'>soldierPic9</span><span class='level'></span></div>\
											<div id='IN_tankPic0'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 1</a><span class='name'>tankPic0</span><span class='level'></span></div>\
											<div id='IN_tankPic1'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 2</a><span class='name'>tankPic1</span><span class='level'></span></div>\
											<div id='IN_tankPic2'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 3</a><span class='name'>tankPic2</span><span class='level'></span></div>\
											<div id='IN_tankPic3'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 4</a><span class='name'>tankPic3</span><span class='level'></span></div>\
											<div id='IN_tankPic4'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 5</a><span class='name'>tankPic4</span><span class='level'></span></div>\
											<div id='IN_tankPic5'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 6</a><span class='name'>tankPic5</span><span class='level'></span></div>\
											<div id='IN_tankPic6'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 7</a><span class='name'>tankPic6</span><span class='level'></span></div>\
											<div id='IN_tankPic7'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 8</a><span class='name'>tankPic7</span><span class='level'></span></div>\
											<div id='IN_tankPic8'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 9</a><span class='name'>tankPic8</span><span class='level'></span></div>\
											<div id='IN_tankPic9'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Tank Chassis 10</a><span class='name'>tankPic9</span><span class='level'></span></div>\
											<div id='IN_juggerPic0'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 1</a><span class='name'>juggerPic0</span><span class='level'></span></div>\
											<div id='IN_juggerPic1'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 2</a><span class='name'>juggerPic1</span><span class='level'></span></div>\
											<div id='IN_juggerPic2'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 3</a><span class='name'>juggerPic2</span><span class='level'></span></div>\
											<div id='IN_juggerPic3'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 4</a><span class='name'>juggerPic3</span><span class='level'></span></div>\
											<div id='IN_juggerPic4'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 5</a><span class='name'>juggerPic4</span><span class='level'></span></div>\
											<div id='IN_juggerPic5'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 6</a><span class='name'>juggerPic5</span><span class='level'></span></div>\
											<div id='IN_juggerPic6'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 7</a><span class='name'>juggerPic6</span><span class='level'></span></div>\
											<div id='IN_juggerPic7'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 8</a><span class='name'>juggerPic7</span><span class='level'></span></div>\
											<div id='IN_juggerPic8'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 9</a><span class='name'>juggerPic8</span><span class='level'></span></div>\
											<div id='IN_juggerPic9'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Juggernaut Chassis 10</a><span class='name'>juggerPic9</span><span class='level'></span></div>\
											<div id='IN_bomberPic0'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Bomber Chassis 1</a><span class='name'>bomberPic0</span><span class='level'></span></div>\
											<div id='IN_bomberPic1'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Bomber Chassis 2</a><span class='name'>bomberPic1</span><span class='level'></span></div>\
											<div id='IN_bomberPic2'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Bomber Chassis 3</a><span class='name'>bomberPic2</span><span class='level'></span></div>\
											<div id='IN_bomberPic3'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Bomber Chassis 4</a><span class='name'>bomberPic3</span><span class='level'></span></div>\
											<div id='IN_bomberPic4'><a href='javascript:;' class='help'></a><a href='javascript:;' class='research'>Bomber Chassis 5</a><span class='name'>bomberPic4</span><span class='level'></span></div>\
										</div>\
									</div>\
								</div>\
								<div id='IN_selectedResearch'>\
									<div id='IN_selectedTitle'>Selected Researches</div>\
									<div id='IN_selectedList'></div>\
									<a href='javascript:;' id='IN_makeBreakthrough' class='noUp'></a>\
								</div>\
							</div>\
						</div>\
						<div id='IN_helpBox'><a href='javascript:;' id='IN_closeHelpBox'></a><div id='IN_helpText'></div></div>\
						<div id='IN_bFail'></div>\
						<div id='IN_bldPplBox'>\
							<div id='IN_pplTime' class='noRes'>??:??:??</div>\
							<div id='IN_bldPpl'>\
								<span id='IN_pplName'>Build Units:</span>\
								<input type='text' id='IN_numPpl' autofocus='autofocus' maxlength='4' />\
								<a href='javascript:;' id='IN_bldPplButton' class='noBld'></a>\
								<div id='IN_pplBldg'>Num. left: <span id='IN_numPplBldg'>0</span></div>\
								<div id='IN_pplNext'>Next in: <span id='IN_ticksTillNext'>??:??:??</span></div>\
							</div>\
							<div id='IN_pplSteel' class='noRes'>???</div>\
							<div id='IN_pplWood' class='noRes'>???</div>\
							<div id='IN_pplManMade' class='noRes'>???</div>\
							<div id='IN_pplFood' class='noRes'>???</div>\
						</div>",
				build : IN_UI,
				helpRe :function() { //which is the type of research to display the description of
							var which = $(this).siblings(".name").text();
							var desc = '';
							switch(which) {
								case "buildingSlotTech":
									desc = '<h4>Build Slot Tech</h4>Code: buildingSlotTech<p>Each level of Build Slot Tech increases the number of buildings that can be upgraded, constructed, or deconstructed at the same time.</p>';
									break;
								case "buildingStabilityTech":
									desc = "<h4>Building Stability Tech</h4>Code: buildingStabilityTech<p>Each level of Building Stability Tech increases your engineer's ability to construct sound buildings.  This decreases their susceptability to bombing.</p>";
									break;
								case "lotTech":
									desc = "<h4>Building Lot Tech</h4>Code: lotTech<p>Each level of Building Lot Tech increases the number of lots on which you can build buildings.  After level 14, additional levels only affect colonies.</p>"; //add list of when each tech can be researched
									break;
								case "unitLotTech":
									desc = "<h4>Manufacturing Tech</h4>Code: unitLotTech<p>Each level of Manufacturing Tech increases the quaility of the manufacturing equipment in your Arms Factories.  This allows your Arms Factories to produce more varied units without additional programming<br/>(Increases AU slots in Arms Factories by one)</p>";
									break;
								case "commsCenterTech":
									desc = "<h4>Communication Tech</h4>Code: commsCenterTech<p>Reasearching Communication Tech allows your engineers to further upgrade the communication equipment in your Comms. Centers, increasing their effective range.<br/>(Precise Effect)</p>";//add precise effect of tech
									break;
								case "townTech":
									desc = "<h4>Town Tech</h4>Code: townTech<p>Researching Town Tech increases your AIs' ability to multitask and override the default systems in other towns.  This allows more towns to be controlled at once.</p>"; //add list of when each tech can be researched
									break;
								case "engineerTech":
									desc = "<h4>Engineer Efficiency</h4>Code: engineerTech<p>Engineer Efficieny increases, what else, the efficieny of your Engineers!  Each level of this research increases the build time reducing effect of your engineers by 10%.</p>";
									break;
								case "tradeTech":
									desc = "<h4>Trader Efficiency</h4>Code: tradeTech<p>Trader Efficiency broadly increases your capacity for trade by increases the speed and carrying capacity of your Traders by 10%.  In addidition, high Trader Efficiency will net you better rates on the Stock Market!</p>";
									break;
								case "scholarTech":
									desc = "<h4>Scholar Efficiency</h4>Code: scholarTech<p>Scholar Efficiency grants your scholars access to more sophisticated equipment to run their tests.  The net result is a 10% increase, per level, of the effect of your scholars on reducing breakthrough times.</p>";
									break;
								case "afTech":
									desc = '<h4>Arms Factory Tech</h4>Code: afTech<p>The quality of the craftsmenship of your units is a key part in increasing their survivability abroad.  Each level of Arms Factory Tech increases the protective effect your Arms Factories give to your units abroad by 5%.</p>';
									break;
								case "bunkerTech":
									desc ="<h4>Bunker Tech</h4>Code: bunkerTech<p>Bunker are designed to hide and protect.  With each level of this tech, your Bunkers will be able to hide and protect more men and goods then they did before.<br/>(Bunker effect increased by 5%)</p>";//add precise effect
									break;
								case "stealthTech":
									desc ="<h4>Stealth Tech</h4>Code: stealthTech<p>Stealth Tech represents your troops overal knowledge of stealth.  Each level increases the ability of your troops to find cover in combat and find hidden troops.</p>";
									break;
								case "scoutTech":
									desc="<h4>Scout Tech</h4>Code: scoutTech<p>Scout Tech represents your troops overal knowledge of infiltration and subterfuge.  Each level increases your scouts ability to infiltrate enemy bases.</p>";
									break;
								case "supportTech":
									desc="<h4>Support Tech</h4>Code: supportTech<p>Researching Support Tech increases the amount of space in your barraks that can be alloted to foreign armies.  Each level increases the number of players that can support you by 1 and increases the percentage of your army population that you can have as support by 10%.</p>";
									break;
								case "soldierTech":
									desc="<h4>Soldier Tech</h4>Code: soldierTech<p>This tech is unlocked automatically.<br/>"+UTCC.unitDesc[0]+"</p>";
									break;
								case "tankTech":
									desc="<h4>Tank Tech</h4>Code: tankTech<p>"+UTCC.unitDesc[1]+"<br/>(Don't forget to research a chassis!)</p>";
									break;
								case "juggerTech":
									desc="<h4>Juggernaut Tech</h4>Code: juggerTech<p>"+UTCC.unitDesc[2]+"<br/>(Don't forget to research a chassis!)</p>"
									break;
								case "bomberTech":
									desc="<h4>Bomber Tech</h4>Code: bomberTech<p>"+UTCC.unitDesc[3]+"<br/>(Don't forget to research a chassis!)</p>";
									break;
								case "troopPush":
									desc="<h4>Troop Push</h4>Code troopPush<p>When you order a troop push, your entire town shifts into high gear to produce as many units as possible.  As time goes on, your town slowly loses the ability to produce units in this fasion.<br/>(Simulates one of your Arms Factories running at full capacity for the number of hours specified.  This time is split between all currently assigned AU.)</p>";
									break;
								default:
									if(which.match(/weap/)) {
										var index = which.match(/\d/);
										$.each(UTCC.weapons,function(i,v) {
											if(i != index) return true;
											desc = "<h4>"+v.name+"</h4>Code: "+which+"<p> <img src='images/client/weapons/" + v.name.toLowerCase().replace(/\s/g, "-") + ".png' id='UTCC_weaponImage' /><div id='UTCC_AUweapInfoStats'><div id='UTCC_AUweapFP'><img src='images/client/buildings/Firepower-icon.png' title='Weapon Firepower' alt='Weapon Firepower' /> <span class='stat'>" 
													+ v.fp + "</span></div><div id='UTCC_AUweapAmmo'><img src='images/client/buildings/ammo-icon.png' title='Weapon Ammunition' alt='Weapon Ammunition' /> <span class='stat'>" 
													+ v.amm + "</span></div><div id='UTCC_AUweapAccu'><img src='images/client/buildings/Accur-icon.png' title='Weapon Accuracy' alt='Weapon Accuracy' /> <span class='stat'>" 
													+ v.acc + "</span></div><div id='UTCC_AUweapPoints'>Tier: <span class='stat'>" 
													+ v.tier + "</span></div></div>"
													+ v.desc + "</p>";
											return false;
										});
									} else if (which.match(/Pic/)) {
										var unit = which.split("Pic")[0].split("");
										var pic = which.split("Pic")[1];
										unit = unit[0].toUpperCase() + unit.slice(1).join("");
										desc="<h4>"+((unit=="Jugger")?"Juggernaut":unit)+" Chassis "+pic+"</h4>Code: "+which+"<p><img src='images/client/units/"+unit.toLowerCase()+pic+".png' id='UTCC_weaponImage' />Unlocking this Chassis tech allows you to use the chassis shown here when assigning units to slots in your Arms Factory.</p>"
									}
							} //end of switch
							$("#IN_helpText").html(desc);
							$("#IN_helpBox").fadeIn("fast");
						}
			},
	Mine : {//Mines
				name : ["Metal Mine", "Manufactured Materials Plant", "Timber Field", "Food Farm"],
				HTML : "<div id='Mine_productionBox'>\
							<img src='images/trans.gif' id='Mine_typePic' />\
							<span id='Mine_production'></span>\
						</div>\
						<div id='Mine_resEffect'>\
							Production Modifier:\
							<span></span>\
						</div>",
				build : mine_UI						
			},
	TC : 	{//Trade Center
				name : ["Trade Center"],
				 HTML : "<div class='textFrameT-L-R' id='TCMTtopRow'><div class='textFrameT'><div class='textFrameL'><div class='textFrameR'><div class='textFramed' id='TCMTFrame'></div></div></div></div></div><div class='textFrameB-BL-BR' id = 'TCMTbottomRow'><div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div></div></div><div class='textFrameT-L-R' id = 'TCTradestopRow'><div class='textFrameT'><div class='textFrameL'><div class='textFrameR'><div class = 'textFramed' id = 'TCTradesFrame'></div></div></div></div></div><div id='TC_trades'><span>Trades</span><div id='TC_activeTrades'></div><div id='TC_tradeSchedules'></div></div><div class='textFrameB-BL-BR' id = 'TCTradesbottomRow'><div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div></div></div><div id='TC_makeTradeBox'><input type='radio' id='TC_oneWay' name='trade' class='tradeType' checked='checked'/><label for='TC_oneWay'>One Way</label><input type='radio' id='TC_twoWay' name='trade' class='tradeType' disabled='disabled'/><label for='TC_twoWay'>Two Way</label><input type='radio' id='TC_stock' name='trade' class='tradeType' /><label for='TC_stock'>Stock Market</label><form id='TC_setUpTrade'></form><a href='javascript:;' id='TC_sendTrade'></a></div><div id='TC_helpBox'></div><div id='TC_bFail'></div><div id='TC_bldPplBox'><div id='TC_pplTime' class='noRes'>??:??:??</div><div id='TC_bldPpl'><span id='TC_pplName'>Build Units:</span><input type='text' id='TC_numPpl' maxlength='4' /><a href='javascript:;' id='TC_bldPplButton' class='noBld'></a><div id='TC_pplBldg'>Num. left: <span id='TC_numPplBldg'>0</span></div><div id='TC_pplNext'>Next in: <span id='TC_ticksTillNext'>??:??:??</span></div></div><div id='TC_pplSteel' class='noRes'>???</div><div id='TC_pplWood' class='noRes'>???</div><div id='TC_pplManMade' class='noRes'>???</div><div id='TC_pplFood' class='noRes'>???</div></div>",
				//one way trade HTML
				OWHTML : "	<fieldset><legend>Sending:</legend>\
								<select id='TC_resSendType'>\
									<option disabled='disabled'>Select type:</option>\
									<option disabled='disabled'>------------</option>\
									<option>Metal</option>\
									<option>Timber</option>\
									<option>Man. Materials</option>\
									<option>Food</option>\
								</select>\
								<input type='text' id='TC_resSendAmnt' maxlength='9' autofocus='autofocus' placeholder='Amount'/>\
								<div id='TC_numTraders'>Num. Traders: <span>???</span></div>\
							</fieldset>\
							<div id='TC_setCoords'>\
								<label for='TC_intervalTime'>Interval:</label><input type='text' id='TC_intervalTime' maxlength='9' />\
								<label for='TC_intervals'>Number:</label><input type='text' id='TC_intervals' maxlength='9' /><br />\
								<label for='TC_x'>x:</label><input type='text' id='TC_x' maxlength='3' value='0'/>\
								<label for='TC_y'>y:</label><input type='text' id='TC_y' maxlength='3' value='0'/>\
							</div>",
				//two way trade HTML
				TWHTML : "	<fieldset><legend>Sending:</legend>\
								<select id='TC_resSendType'>\
									<option disabled='disabled'>Select type:</option>\
									<option disabled='disabled'>------------</option>\
									<option>Metal</option>\
									<option>Timber</option>\
									<option>Man. Materials</option>\
									<option>Food</option>\
								</select>\
								<input type='text' id='TC_resSendAmnt' maxlength='9' autofocus='autofocus' placeholder='Amount'/>\
								<div id='TC_numTraders'>Num. Traders: <span>???</span></div>\
							</fieldset>\
							<fieldset><legend>Recieving:</legend>\
								<select id='TC_resRecType'>\
									<option disabled='disabled'>Select type:</option>\
									<option disabled='disabled'>------------</option>\
									<option>Metal</option>\
									<option>Timber</option>\
									<option>Man. Materials</option>\
									<option>Food</option>\
								</select>\
								<input type='text' id='TC_resRecAmnt' maxlength='9' placeholder='Amount'/>\
							</fieldset>\
							<div id='TC_setCoords'>\
								<label for='TC_intervalTime'>Interval:</label><input type='text' id='TC_intervalTime' maxlength='9' />\
								<label for='TC_intervals'>Number:</label><input type='text' id='TC_intervals' maxlength='9' /><br />\
								<label for='TC_x'>x:</label><input type='text' id='TC_x' maxlength='3' value='0'/>\
								<label for='TC_y'>y:</label><input type='text' id='TC_y' maxlength='3' value='0'/>\
							</div>",
				//stock market trade HTML
				SMHTML : "	<fieldset><legend>Sending:</legend>\
								<select id='TC_resSendType'>\
									<option disabled='disabled'>Select type:</option>\
									<option disabled='disabled'>------------</option>\
									<option>Metal</option>\
									<option>Timber</option>\
									<option>Man. Materials</option>\
									<option>Food</option>\
								</select>\
								<input type='text' id='TC_resSendAmnt' maxlength='9' autofocus='autofocus' placeholder='Amount'/>\
								<div id='TC_numTraders'>Num. Traders: <span>???</span></div>\
							</fieldset>\
							<fieldset><legend>Receiving:</legend>\
								<select id='TC_resRecType'>\
									<option disabled='disabled'>Select type:</option>\
									<option disabled='disabled'>------------</option>\
									<option>Metal</option>\
									<option>Timber</option>\
									<option>Man. Materials</option>\
									<option>Food</option>\
								</select>\
								<div id='TC_tradeRatio'>Ratio: <span>???</span></div>\
								<div id='TC_returnAmnt'>Return: <span>???</span></div>\
							</fieldset>",
				interval: 0,
				numIntervals: -1,
				x : 0,
				y : 0,
				build : TC_UI
			},
	Warehouse : {//Warehouses
					name : ["Metal Warehouse","Manufactured Materials Warehouse","Timber Warehouse","Food Warehouse"],
					HTML :	"<div id='Ware_resTotals'>\
								<span id='Ware_resDesc'>Resource Overview:</span>\
								<span id='Ware_curRes'></span>/<span id='Ware_resCap'></span>\
								<div id='Ware_resPerc'></div>\
								<div id='Ware_resPercBarBox'><div id='Ware_resPercBar'></div></div>\
							</div>",
					build : warehouse_UI
				}
	};