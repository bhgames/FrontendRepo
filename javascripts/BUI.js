/**************************************************************************************************************\
******************************************Building Universal Interface******************************************
\**************************************************************************************************************/
var BUI = { //the Building Universal Interface object will hold everything our various UIs need and keep them all in one place!
	build : build_bldg_UIs,
	head : "<div id='BUI_header'>\
				<div id='BUI_bldgInfoButton'></div>\
				<div id='BUI_bldgInfo'>\
					<div id='BUI_tutorial' class='pplHelp'></div>\
					<span id='BUI_bldgName'></span><span id='BUI_bldgLvl'></span>\
					<div id='BUI_upgrading'></div>\
				</div>\
				<div id='BUI_upCost'>\
					<div class='BUI_up'>Level <span></span> Cost:</div>\
					<div id='BUI_upSteel' class='noRes upSteel'></div>\
					<div id='BUI_upWood' class='noRes upWood'></div>\
					<div id='BUI_upCrystal' class='noRes upCrystal'></div>\
					<div id='BUI_upTime' class='noRes upTime'>??:??:??</div>\
					<div id='BUI_upButton' class='noUp'></div><div id='BUI_deconButton'></div>\
				</div>\
				<div id='BUI_extras'></div>\
				<div id='BUI_fail'></div>\
			</div>",
	window : "<div id='BUI_winHeader'></div>\
			<div id='BUI_bldgContent'></div>",
	set : set_active, //this way, we just call BUI.set() to set the active element dynamically, makes everything clearer
	active : {},
	AF : 	{//Arms Factory
				name : ["Arms Factory"],
				build : AF_UI,
				abbr : "AF"
			},
	AP : 	{
				name : ["Airstrip"],
				build : AP_UI,
				abbr : "AP"
			},
	CC : 	{//Command Center
				name : ["Command Center"],
				missionDesc : [	"Support an ally with units that can not only defend his town but can be launched on offenses from his town. Units cannot be moved from his town to another of his towns, and you will receive status reports of all offensive and defensive actions taken by this particular town.  Sending your own troops to support one of your own cities will Station those troops there.",
								"One time hit on an opponent to collect as much of the spoils as your men can carry.",
								"Hit the enemy multiple times from 1/4th the distance until all civilians are dead, then collect spoils. 50% spoils reduction.",
								"One time bombing run on enemies.  Will also collect as much of the spoils as your men can carry.",
								"Hit the enemy multiple times until the bomb targets are all dead, then collect spoils. 50% spoils reduction.",
								"Run a scouting mission on an enemy town. You can only send soldiers on this mission type. Discovery means you  enter into an attack type combat mode with the enemy's defenses.",
								"Attempt to invade an enemy city. Only successful if all bunkers and the HQ is killed and the army must possess more than twice as much strength as the defending city in most situations.",
								"Support an ally with units that can only help defend his town.  Sending your own troops to support one of your own cities will Station those troops there.",
								"Send your troops to collect the debris left over from a previous battle.",
								"Send your Scholars on an Archeological Dig.  Sending troops with your scholars will prevent unescored scholars from taking over the dig site.  Digs take 24 hours; after which, a prize is unlocked.  If you choose not to take the prize, you can resend the dig for a potentially better prize!",
								"Send your Engineers to mine a Resource Outcropping.  Sending troops with your engineers will prevent unescorted engineers from taking over the outcropping."],
				numRaidsOut : 0,
				x : 0,
				y : 0,
				startTab : "",
				build : CC_UI,
				bldgServer : [],
				abbr : "CC"
			},
	Fort : 	{
				name: ["Fortification"],
				build : Fort_UI,
				abbr : "Fort"
			},
	IN :	{	//Institute
				name : ["Institute"],
				build : IN_UI,
				activeTab : 0,
				abbr : "IN",
				research : {
								firearmResearch :	{
														cost : 50,
														lvld : true,
														desc : "Each level increases the damage of all units that deal physical damage by 2.5%."
													},
								ordinanceResearch :	{
														cost : 50,
														lvld : true,
														desc : "Each level increases the damage of all units that deal explosive damage by 2.5%."
													},
								teslaTech :	{
												cost : 50,
												lvld : true,
												desc : "Each level increases the damage of all units that deal electrical damage by 2.5%."
											},
								bloodMetalPlating :	{
														cost : 75,
														lvld : true,
														desc : "Each level increases the armor of all Heavily armored units by 2.5%."
													},
								bodyArmor :	{
												cost : 50,
												lvld : true,
												desc : "Each level increases the armor of all Lightly armored units by 2.5%."
											},
								bloodMetalArmor :	{
														cost : 750,
														lvld : false,
														desc : "Lightly armored units gain 50% explosive resistance, but lose 25% electrical resistance."
													},
								personalShields :	{
														cost : 1000,
														lvld : false,
														desc : "Heavily armored units gain an 50% electrical resistance, but lose 25% explosive resistance."
													},
								hydraulicAssistors :	{
															cost : 500,
															lvld : false,
															desc : "Increases the speed of Juggernauts and Tanks."
														},
								thrustVectoring :	{
														cost : 600,
														lvld : false,
														desc : "Increases the speed of Air Units."
													},
								clockworkAugments :	{
														cost : 300,
														lvld : false,
														desc : "Increases the speed and HP of soldiers and civilians by 25%."
													},
								clockworkComputers :	{
															cost : 25,
															lvld : true,
															desc : "Each level increases the amount of Research Points generated by your Scholars."
														},
								architecture :	{
													cost : 25,
													lvld : true,
													desc : "Each level reduces the time it takes Engineers to construct buildings."
												},
								airshipTech :	{
													cost : 2000,
													lvld : false,
													desc : "Allows for the construction of Airships."
												},
								advancedFortifications :	{
																cost : 1000,
																lvld : false,
																desc : "Upgrades Fortifications with Fortified Towers which allow Tanks to be stationed on Fortifications, increases protection given to 3.33%/level, and increases the station cap by 1/level."
															},
								structuralIntegrity :	{
														cost : 10,
														lvld : true,
														desc : "Each level increases the armor of all buildings by 10%/level."
													},
								infrastructureTech :	{
														cost : 20,
														lvld : true,
														max : 19,
														desc : "Each level increases the number of build lots by 1."
													},
								townTech :	{
														cost : 200,
														lvld : true,
														max : 999,
														desc : "Each level increases the number of town slots by 1."
													},
								constructionResearch :	{
														cost : 10,
														lvld : true,
														desc : "Increases the number of buildings that can be upgraded/built/destructed concurrently."
													},
								scoutTech :	{
														cost : 25,
														lvld : true,
														max : 10,
														desc : "Increases your chances of successfully getting a scout report."
													},
								soldier : 50,
								tank : 150,
								golem : 450,
								lightAircraft : 250,
								heavyAircraft : 250
							}
			},
	Mine : 	{	//Mines
				name : ["Metal Mine", "Crystal Mine", "Timber Field", "Farm"],
				build : mine_UI,
				abbr : "mine"
			},
	MP : 	{
				name : ["Manufacturing Plant"],
				build : function() {},
				abbr : "MP"
			},
	MS : 	{
				name : ["Missile Silo"],
				build : MS_UI,
				abbr : "MS"
			},
	Refinery : 	{
					name : ["Foundry","Sawmill","Crystal Refinery","Hydroponics Bay"],
					build : refinery_UI,
					abbr : "refinery"
				},
	RecC : 	{
				name : ["Recycling Center"],
				build : RY_UI,
				abbr : "RecC"
			},
	ResC :	{
				name : ["Resource Cache"],
				build : RC_UI,
				abbr : "ResC"
			},
	SY :	{
				name : ["Storage Yard"],
				build : SY_UI,
				abbr : "SY"
			},
	TC : 	{//Trade Center
				name : ["Trade Center"],
				DT :{
						interval: 0,
						numIntervals: 1,
						x : 0,
						y : 0,
					},
				LT :{
						interval: 0,
						numIntervals:1
					},
				build : TC_UI,
				abbr : "TC"
			},
	Warehouse : {//Warehouses
					name : ["Metal Warehouse","Crystal Repository","Lumber Yard","Granary"],
					build : warehouse_UI,
					abbr : "warehouse"
				}
	};