/**************************************************************************************************************\
******************************************Building Universal Interface******************************************
\**************************************************************************************************************/
var BUI = { //the Building Universal Interface object will hold everything our various UIs need and keep them all in one place!
	build : build_bldg_UIs,
	head : "<div id='BUI_header'>\
				<div class='darkFrameBody'>\
					<div id='BUI_bldgInfoButton'></div>\
					<div id='BUI_bldgInfo'>\
						<div id='BUI_tutorial' class='pplHelp'></div>\
						<span id='BUI_bldgName'></span><span id='BUI_bldgLvl'></span>\
						<div id='BUI_upgrading'></div>\
					</div>\
					<div id='BUI_upCost'>\
						<div class='BUI_up'>Level <span></span> Cost:</div>\
						<div class='BUI_up'><div id='BUI_upSteel' class='noRes upSteel'></div></div>\
						<div class='BUI_up'><div id='BUI_upWood' class='noRes upWood'></div></div>\
						<div class='BUI_up'><div id='BUI_upManMade' class='noRes upManMade'></div></div>\
						<div class='BUI_up'><div id='BUI_upTime' class='noRes upTime'>??:??:??</div></div>\
						<div id='BUI_upButton' class='noUp'>Upgrade</div><div id='BUI_deconButton'>Destruct</div>\
					</div>\
					<select id='BUI_bldgSwitch'></select>\
				</div>\
				<div class='darkFrameBL-BR-B'>\
					<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
				</div>\
				<div id='BUI_extras'></div>\
				<div id='BUI_fail'></div>\
			</div>\
			<div id='BUI_bldgContent'></div>",
	set : set_active, //this way, we just call BUI.set() to set the active element dynamically, makes everything easier
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
				name: ["Fortifications"],
				build : function() {}
			},
	IN :	{	//Institute
				name : ["Institute"],
				build : IN_UI,
				activeTab : 0,
				abbr : "IN",
				research : {
								firearmResearch :	{
														cost : 50,
														lvld : true
													},
								ordinanceResearch :	{
														cost : 50,
														lvld : true
													},
								teslaTech :	{
												cost : 50,
												lvld : true
											},
								bloodMetalPlating :	{
														cost : 75,
														lvld : true
													},
								bodyArmor :	{
												cost : 50,
												lvld : true
											},
								bloodMetalArmor :	{
														cost : 750,
														lvld : false
													},
								personalShields :	{
														cost : 1000,
														lvld : false
													},
								hydraulicAssistors :	{
															cost : 500,
															lvld : false
														},
								thrustVectoring :	{
														cost : 600,
														lvld : false
													},
								clockworkAugments :	{
														cost : 300,
														lvld : false
													},
								clockworkComputers :	{
															cost : 25,
															lvld : true
														},
								architecture :	{
													cost : 25,
													lvld : true
												},
								airshipTech :	{
													cost : 2000,
													lvld : false
												},
								advancedFortifications :	{
																cost : 1000,
																lvld : false
															},
								structuralIntegrity :	{
														cost : 10,
														lvld : true
													},
								infrastructureTech :	{
														cost : 20,
														lvld : true,
														max : 19
													},
								townTech :	{
														cost : 200,
														lvld : true,
														max : 999
													},
								constructionResearch :	{
														cost : 10,
														lvld : true
													},
								scoutTech :	{
														cost : 25,
														lvld : true,
														max : 10
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
				build : function() {},
				abbr : "ResC"
			},
	SY :	{
				name : ["Storage Yard"],
				build : function() {},
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