
var BUI={build:build_bldg_UIs,head:"<div id='BUI_header'>\
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
      <div class='BUI_up'><div id='BUI_upFood' class='noRes upFood'></div></div>\
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
   <div id='BUI_bldgContent'></div>",set:set_active,active:{},AF:{name:["Arms Factory"],HTML:"<div id='AF_activeAU'>\
      <div class='lightFrameBody'>\
       <span id='AF_AUname'></span>\
       <span id='AF_AUrank'></span>\
       <img src='images/trans.gif' id='AF_AUpic' />\
       <img src='images/trans.gif' id='AF_rankPic' />\
       <div id='AF_AUstats'>\
        <div>\
         <div id='AF_AUAccu'><img src='AIFrames/icons/accuracy.png' title='Unit Accuracy' alt='Unit Accuracy' /> <span class='stat'>???</span></div>\
         <div id='AF_AUFP'><img src='AIFrames/icons/firepower.png' title='Unit Firepower' alt='Unit Firepower' /> <span class='stat'>???</span></div>\
         <div id='AF_AUAmmo'><img src='AIFrames/icons/ammo.png' title='Unit Ammunition' alt='Unit Ammunition' /> <span class='stat'>???</span></div>\
        </div><div>\
         <div id='AF_AUconceal'><img src='AIFrames/icons/stealth.png' title='Concealment' alt='Concealment' /> <span class='stat'>???</span></div>\
         <div id='AF_AUarmor'><img src='AIFrames/icons/armor.png' title='Armor' alt='Armor' /> <span class='stat'>???</span></div>\
         <div id='AF_AUspeed'><img src='AIFrames/icons/speed.png' title='Speed' alt='Speed' /> <span class='stat'>???</span></div>\
        </div><div><div id='AF_AUcargo'><img src='AIFrames/icons/cargo.png' title='Cargo Capacity' alt='Cargo Capacity' /><span class='stat'>???</span></div></div>\
       </div>\
      </div>\
      <div class='lightFrameBL-BR-B'>\
       <div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
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
     <div id='BUI_bFail'></div>\
     <div id='BUI_bldPplBox'>\
      <div id='BUI_bldPplHeader'>Build Units<div id='BUI_pplHelp' class='pplHelp'></div><span id='BUI_numCivs'></span></div>\
      <div id='BUI_bldPpl'>\
       <label for='BUI_numPpl'>Units:</label><input type='text' id='BUI_numPpl' autofocus='autofocus' maxlength='4' />\
       <div id='BUI_straightArrow'></div>\
       <div id='BUI_bentArrow'></div>\
       <div id='BUI_bldPplButton' class='noBld'>\
        <div class='darkFrameBody'>Build</div>\
        <div class='darkFrameB'></div>\
       </div>\
       <div id='AF_capNeeded'>Slots needed: <span></span></div>\
      </div>\
      <div id='BUI_bldPplCost'>\
       <div class='BUI_bldPpl totalCost'>\
        Total Cost\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplSteel' class='noRes upSteel'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplWood' class='noRes upWood'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplTime' class='noRes upTime'>??:??:??</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplManMade' class='noRes upManMade'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplFood' class='noRes upFood'>???</div>\
       </div>\
      </div>\
     </div>\
     <div id='AF_queue'>\
      <div class='textFramed'>\
       <div id='AF_queueList'></div>\
      </div>\
      <div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
     </div>",build:AF_UI},AP:{name:["Airship Platform"],build:function(){}},Bnkr:{name:["Bunker"],HTML:"<div id='Bnkr_curModeEffect'></div>",build:bnkr_UI},CC:{name:["Communications Center"],HTML:" <div id='CC_tabs'>\
      <div id='CC_activityTab'></div>\
     </div>\
     <div id='CC_window'>\
     </div>",aTab:"<div id='CC_trades'>\
     <h3>Nearby Active Trades</h3>\
     <div id='CC_tradesKey'>\
      <span class='destinationKey'>Destination</span>\
      <span class='originKey'>Origin</span>\
      <span class='resourcesKey'>Outgoing/Incoming</span>\
      <span class='etaKey'>ETA</span>\
     </div>\
     <div id='CC_tradeList'></div>\
    </div>\
    <div id='CC_raids'>\
     <h3>Nearby Missions</h3>\
     <div id='CC_raidsKey'>\
      <span class='destinationKey'>Destination</span>\
      <span class='originKey'>Origin</span>\
      <span class='typeKey'>Type</span>\
      <span class='etaKey'>ETA</span>\
     </div>\
     <div id='CC_raidList'></div>\
    </div>",build:CC_UI},CY:{name:["Construction Yard"],HTML:" <div id='BUI_bFail'></div>\
     <div id='BUI_bldPplBox'>\
      <div id='BUI_bldPplHeader'>Build Engineers<div id='BUI_pplHelp' class='pplHelp'></div><span id='BUI_numCivs'></span></div>\
      <div id='BUI_bldPpl'>\
       <label for='BUI_numPpl'>Units:</label><input type='text' id='BUI_numPpl' autofocus='autofocus' maxlength='4' />\
       <div id='BUI_straightArrow'></div>\
       <div id='BUI_bentArrow'></div>\
       <div id='BUI_bldPplButton' class='noBld'>\
        <div class='darkFrameBody'>Build</div>\
        <div class='darkFrameB'></div>\
       </div>\
       <div id='BUI_pplBldgInfo'>\
        <div id='BUI_pplBldg'>Number Building: <span id='BUI_numPplBldg'>0</span></div>\
        <div id='BUI_pplNext'>Next in: <span id='BUI_ticksTillNext'>??:??:??</span></div>\
       </div>\
      </div>\
      <div id='BUI_bldPplCost'>\
       <div class='BUI_bldPpl totalCost'>\
        Total Cost\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplSteel' class='noRes upSteel'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplWood' class='noRes upWood'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplTime' class='noRes upTime'>??:??:??</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplManMade' class='noRes upManMade'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplFood' class='noRes upFood'>???</div>\
       </div>\
      </div>\
     </div>\
     <div id='CY_info'>\
      <div class='lightFrameBody'>\
       <div id='CY_townID'>Town ID: <span></span></div>\
       <div id='CY_buildingInfo'></div>\
      </div>\
      <div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
     </div>",build:CY_UI,bldgServer:[]},HQ:{name:["Headquarters"],HTML:" <div id='HQ_tabBar'>\
       <div id='HQ_overview'>\
        <div class='lightFrameBody'>Overview</div>\
        <div class='lightFrameBL'><div class='lightFrameB'></div></div>\
       </div>\
       <div id='HQ_sendMission'>\
        <div class='lightFrameBody'>Send Mission</div>\
        <div class='lightFrameBR'><div class='lightFrameB'></div></div>\
       </div>\
      </div>\
      <div id='HQ_window'></div>",overHTML:"<div id='HQ_scrollBox'>\
        <h2>Tactical Overview</h2>\
        <div id='HQ_tacOverview'>\
         <div id='HQ_CSinfo'>\
          <div class='textFramed'>\
           <div id='HQ_CSL'>\
            <div>Cover Soft Limit:</div>\
            <span>0</span>\
           </div>\
           <div id='HQ_armySizeTotal'>\
            <div>Total Army Size:</div>\
            <span>0</span>\
           </div>\
          </div>\
          <div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
         </div>\
         <div id='HQ_civWeapon'>\
          <div class='textFramed'>\
           <div>Civilian Weapon</div>\
           <select id='HQ_civWeaponSelect'></select>\
           <a href='javascript:;' id='HQ_save'></a>\
          </div>\
          <div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
         </div>\
        </div>\
        <h2>Missions Overview</h2>\
        <div id='HQ_missionList'>\
         <div id='HQ_incomingMissions'></div>\
         <div id='HQ_troopsHere'></div>\
         <div id='HQ_outgoingMissions'></div>\
         <div id='HQ_supportAbroad'></div>\
        </div>\
       </div>",sendHTML:"<div id='HQ_AUinput'>\
        <div class='darkFrameBody'>\
         <div id='HQ_AU1'>\
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
         <div id='HQ_AU3'>\
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
         <div id='HQ_AU5'>\
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
        <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
       </div>\
       <div id='HQ_supportAUbox'>\
        <div class='darkFrameBody'>\
         <span>Support:</span>\
         <div id='HQ_supportAU'>\
         </div>\
        </div>\
        <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
       </div>\
       <div id='HQ_SAS'>\
        <div id='HQ_armySize' class='textFramed'>\
         <div>Selected Army Size:</div>\
         <span>0</span>\
        </div>\
        <div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
       </div>\
       <div id='HQ_ferocity' class='useBP'></div>\
       <div id='HQ_missionSelectList'>\
        <div class='lightFrameBody'>\
         <div>Mission Select:</div>\
         <div class='missionSelect'>\
          <input type='radio' id='HQ_mission1' name='missionRadio' checked='checked'/><label for='HQ_mission1'>Attack</label>\
         </div>\
         <div class='missionSelect'>\
          <input type='radio' id='HQ_mission2' name='missionRadio' /><label for='HQ_mission2'>Siege</label>\
         </div>\
         <div class='missionSelect'>\
          <input type='radio' id='HQ_mission3' name='missionRadio' /><label for='HQ_mission3'>Strafe</label>\
         </div>\
         <div class='missionSelect'>\
          <input type='radio' id='HQ_mission4' name='missionRadio' /><label for='HQ_mission4'>Glass</label>\
         </div>\
         <div class='missionSelect'>\
          <input type='radio' id='HQ_mission7' name='missionRadio' /><label for='HQ_mission7'>Scout</label>\
         </div>\
         <div class='missionSelect'>\
          <input type='radio' id='HQ_mission8' name='missionRadio' /><label for='HQ_mission8'>Invasion</label>\
         </div>\
         <div class='missionSelect'>\
          <input type='radio' id='HQ_mission5' name='missionRadio' /><label for='HQ_mission5'>Support</label>\
         </div>\
         <div class='missionSelect'>\
          <input type='radio' id='HQ_mission6' name='missionRadio' /><label for='HQ_mission6'>Debris</label>\
         </div>\
         <select id='HQ_supportType'>\
          <option>Defensive</option>\
          <option>Offensive</option>\
         </select>\
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
        <div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
       </div>\
       <div id='HQ_missionDescBox'>\
        <div class='textFramed'>Mission Description:\
         <div id='HQ_missionDesc'></div>\
        </div>\
        <div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
       </div>\
       <div id='HQ_targetSelect'>\
        <div>Target Coordinates:</div>\
        x:<input type='text' id='HQ_targetX' maxlength='3' />\
        y:<input type='text' id='HQ_targetY' maxlength='3' />\
        <div id='HQ_ETA'></div>\
       </div>\
       <div id='HQ_isValid'></div>\
       <div id='HQ_launchAttack' class='noAttack'>\
        <div class='lightFrameBody'>Send</div>\
        <div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
       </div>",missionDesc:["One time hit on an opponent to collect as much of the spoils as your men can carry.","Hit the enemy multiple times from 1/4th the distance until all civilians are dead, then collect spoils. 50% spoils reduction.","One time bombing run on enemies.  Will also collect as much of the spoils as your men can carry.","Hit the enemy multiple times until the bomb targets are all dead, then collect spoils. 50% spoils reduction.","Run a scouting mission on an enemy town. You can only send soldiers on this mission type. Discovery means you  enter into an attack type combat mode with the enemy's defenses.","Attempt to invade an enemy city. Only successful if all bunkers and the HQ is killed and the army must possess more than twice as much strength as the defending city in most situations.","Support an ally with units that can only help defend his town.  Sending your own troops to support one of your own cities will Station those troops there.","Send your troops to collect the debris left over from a previous battle.","Support an ally with units that can not only defend his town but can be launched on offenses from his town. Units cannot be moved from his town to another of his towns, and you will receive status reports of all offensive and defensive actions taken by this particular town.  Sending your own troops to support one of your own cities will Station those troops there."],numRaidsOut:0,x:0,y:0,build:HQ_UI},IN:{name:["Institute"],HTML:" <div id='IN_research'>\
       <div id='IN_numKnowledge'>Knowledge Points: <span></span></div>\
       <div id='IN_ppd'>Points per Day: <span></span></div>\
       <div id='IN_researchSelection'>\
        <div id='IN_reTab'>\
         <div class='expand'>\
          <div class='lightFrameBody'>Civilian<br/>Infrastructure</div>\
          <div class='lightFrameBL'><div class='lightFrameB'></div></div>\
         </div>\
         <div class='expand'>\
          <div class='lightFrameBody'>Military<br/>Infrastructure</div>\
          <div class='lightFrameB'></div>\
         </div>\
         <div class='expand'>\
          <div class='lightFrameBody'>Advanced<br/>Technologies</div>\
          <div class='lightFrameB'></div>\
         </div>\
         <div class='expand'>\
          <div class='lightFrameBody'>Military<br/>Units</div>\
          <div class='lightFrameB'></div>\
         </div>\
         <div class='expand'>\
          <div class='lightFrameBody'>AI<br/>Research</div>\
          <div class='lightFrameBR'><div class='lightFrameB'></div></div>\
         </div>\
        </div>\
        <div id='IN_researchList'>\
         <div class='textFramed'>\
         </div>\
         <div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
        </div>\
       </div>\
      </div>\
      <div id='BUI_bFail'></div>\
      <div id='BUI_bldPplBox'>\
       <div id='BUI_bldPplHeader'>Build Scholars<div id='BUI_pplHelp' class='pplHelp'></div><span id='BUI_numCivs'></span></div>\
       <div id='BUI_bldPpl'>\
        <label for='BUI_numPpl'>Units:</label><input type='text' id='BUI_numPpl' autofocus='autofocus' maxlength='4' />\
        <div id='BUI_straightArrow'></div>\
        <div id='BUI_bentArrow'></div>\
        <div id='BUI_bldPplButton' class='noBld'>\
         <div class='darkFrameBody'>Build</div>\
         <div class='darkFrameB'></div>\
        </div>\
        <div id='BUI_pplBldgInfo'>\
         <div id='BUI_pplBldg'>Number Building: <span id='BUI_numPplBldg'>0</span></div>\
         <div id='BUI_pplNext'>Next in: <span id='BUI_ticksTillNext'>??:??:??</span></div>\
        </div>\
       </div>\
       <div id='BUI_bldPplCost'>\
        <div class='BUI_bldPpl totalCost'>\
         Total Cost\
        </div>\
        <div class='BUI_bldPpl'>\
         <div id='BUI_pplSteel' class='noRes upSteel'>???</div>\
        </div>\
        <div class='BUI_bldPpl'>\
         <div id='BUI_pplWood' class='noRes upWood'>???</div>\
        </div>\
        <div class='BUI_bldPpl'>\
         <div id='BUI_pplTime' class='noRes upTime'>??:??:??</div>\
        </div>\
        <div class='BUI_bldPpl'>\
         <div id='BUI_pplManMade' class='noRes upManMade'>???</div>\
        </div>\
        <div class='BUI_bldPpl'>\
         <div id='BUI_pplFood' class='noRes upFood'>???</div>\
        </div>\
       </div>\
      </div>",civInfHTML:" <div id='IN_civInf' class='researchTree'>\
         <div class='researches'>\
          <div id='IN_bldgSlot' class='resWhite'> <div class='info'></div> <div class='fullName'>Building Server Tech</div>   <span class='name'>buildingSlotTech</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_bldgStab' class='resBlack'> <div class='info'></div> <div class='fullName'>Building Stability Tech</div> <span class='name'>buildingStabilityTech</span> <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_lot' class='resWhite'>  <div class='info'></div> <div class='fullName'>Building Lot Tech</div>  <span class='name'>lotTech</span>    <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_town' class='resBlack'>  <div class='info'></div> <div class='fullName'>Town Tech</div>    <span class='name'>townTech</span>    <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_enEff' class='resWhite'> <div class='info'></div> <div class='fullName'>Engineer Efficiency</div>  <span class='name'>engineerTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_trEff' class='resBlack'> <div class='info'></div> <div class='fullName'>Trader Efficiency</div>  <span class='name'>tradeTech</span>    <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_srEff' class='resWhite'> <div class='info'></div> <div class='fullName'>Scholar Efficiency</div>  <span class='name'>scholarTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
         </div>\
        </div>",milInfHTML:" <div id='IN_milInf' class='researchTree'>\
         <div class='researches'>\
          <div id='IN_af' class='resWhite'>  <div class='info'></div> <div class='fullName'>Arms Factory Tech</div> <span class='name'>afTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_bunker' class='resBlack'> <div class='info'></div> <div class='fullName'>Bunker Tech</div>   <span class='name'>bunkerTech</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_unitSlot' class='resWhite'> <div class='info'></div> <div class='fullName'>Manufacturing Tech</div> <span class='name'>unitLotTech</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_CCTech' class='resBlack'> <div class='info'></div> <div class='fullName'>Communication Tech</div> <span class='name'>commsCenterTech</span> <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_stealth' class='resWhite'> <div class='info'></div> <div class='fullName'>Stealth Tech</div>  <span class='name'>stealthTech</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_stealth' class='resBlack'> <div class='info'></div> <div class='fullName'>Scout Tech</div>   <span class='name'>scoutTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_support' class='resWhite'> <div class='info'></div> <div class='fullName'>Support Tech</div>  <span class='name'>supportTech</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
         </div>\
        </div>",milUnitsHTML:" <div id='IN_milUnits' class='researchTree'>\
         <div class='researches'>\
          <div id='IN_troopPush' class='resWhite'> <div class='info'></div> <div class='fullName'>Troop Push</div>  <span class='name'>troopPush</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_ShockTrooper' class='resBlack'> <div class='info'></div> <div class='fullName'>Shock Trooper</div> <span class='name'>ShockTrooper</span> <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Pillager' class='resWhite'>  <div class='info'></div> <div class='fullName'>Pillager</div>  <span class='name'>Pillager</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Vanguard' class='resBlack'>  <div class='info'></div> <div class='fullName'>Vanguard</div>  <span class='name'>Vanguard</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Wolverine' class='resWhite'> <div class='info'></div> <div class='fullName'>Wolverine</div>  <span class='name'>Wolverine</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Seeker' class='resBlack'>  <div class='info'></div> <div class='fullName'>Seeker</div>   <span class='name'>Seeker</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Damascus' class='resWhite'>  <div class='info'></div> <div class='fullName'>Damascus</div>  <span class='name'>Damascus</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Punisher' class='resBlack'>  <div class='info'></div> <div class='fullName'>Punisher</div>  <span class='name'>Punisher</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Dreadnaught' class='resWhite'> <div class='info'></div> <div class='fullName'>Dreadnaught</div>  <span class='name'>Dreadnaught</span> <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Collossus' class='resBlack'> <div class='info'></div> <div class='fullName'>Collossus</div>  <span class='name'>Collossus</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Helios' class='resWhite'>  <div class='info'></div> <div class='fullName'>Helios</div>   <span class='name'>Helios</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Horizon' class='resBlack'>  <div class='info'></div> <div class='fullName'>Horizon</div>   <span class='name'>Horizon</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_Hades' class='resWhite'>  <div class='info'></div> <div class='fullName'>Hades</div>   <span class='name'>Hades</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
         </div>\
        </div>",advTechHTML:" <div id='IN_advTech' class='researchTree'>\
         <div class='researches'>\
          <div id='IN_zeppelin' class='resWhite'>  <div class='info'></div> <div class='fullName'>Airship Tech</div>  <span class='name'>zeppTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_missileSilo' class='resBlack'> <div class='info'></div> <div class='fullName'>Advanced Rocketry</div> <span class='name'>missileSiloTech</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_recycling' class='resWhite'> <div class='info'></div> <div class='fullName'>Recycling Tech</div>  <span class='name'>recyclingTech</span> <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_metalRef' class='resBlack'>  <div class='info'></div> <div class='fullName'>Advanced Metallurgy</div> <span class='name'>metalRefTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_timberRef' class='resWhite'> <div class='info'></div> <div class='fullName'>Timber Processing</div> <span class='name'>timberRefTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_manMatRef' class='resBlack'> <div class='info'></div> <div class='fullName'>Materials Research</div> <span class='name'>manMatRefTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_foodRef' class='resWhite'>  <div class='info'></div> <div class='fullName'>Hydroponics</div>   <span class='name'>foodRefTech</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
         </div>\
        </div>",aiResHTML:" <div id='IN_aiRes' class='researchTree'>\
         <div class='researches'>\
          <div id='IN_attackAPI' class='resWhite'> <div class='info'></div> <div class='fullName'>Attack Automation</div>   <span class='name'>attackAPI</span>    <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_aaAPI' class='resBlack'>  <div class='info'></div> <div class='fullName'>Attack Integration</div>   <span class='name'>advancedAttackAPI</span>  <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_tradingAPI' class='resWhite'> <div class='info'></div> <div class='fullName'>Trade Automation</div>   <span class='name'>tradingAPI</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_atAPI' class='resBlack'>  <div class='info'></div> <div class='fullName'>Trade Integration</div>   <span class='name'>advancedTradingAPI</span> <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_smAPI' class='resWhite'>  <div class='info'></div> <div class='fullName'>Market Integration</div>   <span class='name'>smAPI</span>     <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_buildingAPI' class='resBlack'> <div class='info'></div> <div class='fullName'>Build Automation</div>   <span class='name'>buildingAPI</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_abAPI' class='resWhite'>  <div class='info'></div> <div class='fullName'>Build Integration</div>   <span class='name'>advancedBuildingAPI</span> <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_researchAPI' class='resBlack'> <div class='info'></div> <div class='fullName'>Research Integration</div>  <span class='name'>researchAPI</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_messagingAPI' class='resWhite'> <div class='info'></div> <div class='fullName'>Communication Integration</div> <span class='name'>messagingAPI</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_zeppelinAPI' class='resBlack'> <div class='info'></div> <div class='fullName'>Zeppelin Integration</div>  <span class='name'>zeppelinAPI</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_nukeAPI' class='resWhite'>  <div class='info'></div> <div class='fullName'>Missile Integration</div>   <span class='name'>nukeAPI</span>    <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_wmAPI' class='resBlack'>  <div class='info'></div> <div class='fullName'>Map Integration</div>    <span class='name'>worldMapAPI</span>   <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
          <div id='IN_caAPI' class='resWhite'>  <div class='info'></div> <div class='fullName'>Complete Integration</div>  <span class='name'>completeAnalyticAPI</span> <span class='level'></span> <span class='points'></span> <div class='research noBuy'></div> <div class='bpResearch'></div></div>\
         </div>\
        </div>",build:IN_UI,activeTab:0},Mine:{name:["Metal Mine","Manufactured Materials Plant","Timber Field","Food Farm"],HTML:"<div id='Mine_productionBox'>\
       <img src='images/trans.gif' id='Mine_typePic' />\
       <span id='Mine_production'></span>\
      </div>\
      <div id='Mine_resEffect'>\
       Production Modifier:\
       <span></span>\
      </div>\
      <div id='Mine_taxRate'>\
       Reduction due to Taxes:\
       <div></div>\
      </div>",build:mine_UI},MS:{name:["Missile Silo"],HTML:"<div id='MS_overview'>\
      <div class='darkFrameBody'>\
       <div id='MS_status'>\
        <h2>Missile Status:</h2><div></div>\
       </div>\
       <h3>Missile Info</h3>\
       <div id='MS_groundBurst'>\
        GroundBurst nuke\
        <div id='MS_nukeDamage'>\
         Bombing Damage:<div></div>\
        </div><br/>\
        <div id='MS_troopDamage'>\
         Troop Damage:<div></div>\
        </div>\
       </div><br/>\
       <div id='MS_skyBurst'>\
        SkyBurst Nuke\
        <div id='MS_EMPduration'>\
         EMP Duration:<div></div>\
        </div>\
       </div><br/>\
       <div id='MS_falloutDuration'>\
        Fallout Duration:<div></div>\
       </div>\
      </div>\
      <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
     </div>\
     <div id='MS_launchNuke'>\
      <div class='darkFrameBody'>\
       <h2>Launch Nuke</h2>\
       <div id='MS_fail'></div>\
       Select Warhead:\
       <select id='MS_nukeMode'>\
        <option>GroundBurst</option>\
        <option>SkyBurst</option>\
       </select><br/>\
       Target:\
       <div id='MS_target'>\
        <label for='MS_x'>X </label><input type='number' id='MS_x' max='999' min='-999' value='0'/><label for='MS_y'>Y </label><input type='number' id='MS_y' max='999' min='-999' value='0'/>\
       </div>\
       <div id='MS_launch' class='noLaunch'>\
        <div class='lightFrameBody'>Launch</div>\
        <div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
       </div>\
      </div>\
      <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
     </div>",build:MS_UI},Refinery:{name:["Metal Refinery","Timber Processing Plant","Materials Research Center","Hydroponics Lab"],HTML:"<div id='Ref_effectBox'>\
      <div class='darkFrameBody'>\
       <img src='../images/trans.gif' alt='' id='Ref_typePic'/>\
       Effect:<div id='Ref_effect'></div>\
      </div>\
      <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
     </div>",build:refinery_UI},RY:{name:["Recycling Center"],HTML:"<div id='RY_effectBox'>\
      Percentage of debris harvested:\
      <div id='RY_percentage'></div>\
     </div>",build:RY_UI},TC:{name:["Trade Center"],HTML:"<div id='TC_tabBar'>\
       <div id='TC_Overview' class='TCtab'>\
        <div class='lightFrameBody'>Overview</div>\
        <div class='lightFrameBL'><div class='lightFrameB'></div></div>\
       </div>\
       <div id='TC_Trade' class='TCtab'>\
        <div class='lightFrameBody'>Trade</div>\
        <div class='lightFrameB'></div>\
       </div>\
       <div id='TC_Market' class='TCtab'>\
        <div class='lightFrameBody'>Market</div>\
        <div class='lightFrameBR'><div class='lightFrameB'></div></div>\
       </div>\
      </div>\
      <div id='TC_window'></div>\
      <div id='BUI_bFail'></div>\
     <div id='BUI_bldPplBox'>\
      <div id='BUI_bldPplHeader'>Build Traders<div id='BUI_pplHelp' class='pplHelp'></div><span id='BUI_numCivs'></span></div>\
      <div id='BUI_bldPpl'>\
       <label for='BUI_numPpl'>Units:</label><input type='text' id='BUI_numPpl' autofocus='autofocus' maxlength='4' />\
       <div id='BUI_straightArrow'></div>\
       <div id='BUI_bentArrow'></div>\
       <div id='BUI_bldPplButton' class='noBld'>\
        <div class='darkFrameBody'>Build</div>\
        <div class='darkFrameB'></div>\
       </div>\
       <div id='BUI_pplBldgInfo'>\
        <div id='BUI_pplBldg'>Number Building: <span id='BUI_numPplBldg'>0</span></div>\
        <div id='BUI_pplNext'>Next in: <span id='BUI_ticksTillNext'>??:??:??</span></div>\
       </div>\
      </div>\
      <div id='BUI_bldPplCost'>\
       <div class='BUI_bldPpl totalCost'>\
        Total Cost\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplSteel' class='noRes upSteel'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplWood' class='noRes upWood'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplTime' class='noRes upTime'>??:??:??</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplManMade' class='noRes upManMade'>???</div>\
       </div>\
       <div class='BUI_bldPpl'>\
        <div id='BUI_pplFood' class='noRes upFood'>???</div>\
       </div>\
      </div>\
     </div>",OHTML:"<div id='TC_innerBox'>\
       <div id='TC_activeTrades' class='textFramed'>\
        <div class='keys'>\
         <span class='numTradersKey'>Traders</span>\
         <span class='destinationKey'>Destination</span>\
         <span class='originKey'>Origin</span>\
         <span class='resourcesKey'>Outgoing/Incoming</span>\
         <span class='etaKey'>ETA</span>\
        </div>\
        <div class='tradeList'></div>\
       </div>\
       <div id='TC_tradeSchedules' class='textFramed'>\
        <div class='keys'>\
         <span class='destinationKey'>Destination</span>\
         <span class='originKey'>Origin</span>\
         <span class='resourcesKey'>Outgoing/Incoming</span>\
         <span class='intervalKey'>Next in</span>\
         <span class='remainingKey'>Remaining</span>\
        </div>\
        <div class='tradeList'></div>\
       </div>\
       <div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
      </div>",THTML:" <div id='TC_sendTrade'>\
        <div class='darkFrameBody'>\
         <h2>Direct Trade</h2>\
         <div id='TC_dtResSend'>\
          <label for='TC_dtResSendAmnt'>Outgoing </label><input type='number' id='TC_dtResSendAmnt' min='1'/>\
          <select id='TC_dtResSendType'>\
           <option>Metal</option>\
           <option>Timber</option>\
           <option>Man. Mat.</option>\
           <option>Food</option>\
          </select>\
         </div>\
         <div id='TC_dtTradersNeeded'></div>\
         <div id='TC_dtTimesToDo'>\
          <label for='TC_dtNumToDo'>Trade Cap </label><input type='number' id='TC_dtNumToDo' min='-1' value='1'/>\
         </div>\
         <div id='TC_dtInt'>\
          <label for='TC_dtInterval'>Interval </label><input type='number' id='TC_dtInterval' min='0' value='0'/>\
         </div>\
         <div id='TC_dtTradeTo'>\
          <select id='TC_yourTowns'>\
           <option disabled='disabled'>Choose a town</option>\
           <option disabled='disabled'>-------------</option>\
          </select>\
          <div>-OR-</div>\
          <label for='TC_dtX'>X: </label><input type='number' id='TC_dtX' value='0'/><label for='TC_dtY'>Y: </label><input type='number' id='TC_dtY' value='0'/>\
         </div>\
         <div id='TC_dtETA'></div>\
         <div id='TC_dtSend' class='noTrade'>\
          <div class='lightFrameBody'>Send Trade</div>\
          <div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
         </div>\
        </div>\
        <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
       </div>\
       <div id='TC_createTrade'>\
        <div class='darkFrameBody'>\
         <h2>List Trade</h2>\
         <div id='TC_ltResSend'>\
          <label for='TC_ltResSendAmnt'>Outgoing </label><input type='number' id='TC_ltResSendAmnt' min='1'/>\
          <select id='TC_ltResSendType'>\
           <option>Metal</option>\
           <option>Timber</option>\
           <option>Man. Mat.</option>\
           <option>Food</option>\
          </select>\
         </div>\
         <div id='TC_ltTradersNeeded'></div>\
         <div id='TC_ltResRec'>\
          <label for='TC_ltResRecAmnt'>Incoming </label><input type='number' id='TC_ltResRecAmnt' min='1'/>\
          <select id='TC_ltResRecType'>\
           <option>Metal</option>\
           <option>Timber</option>\
           <option>Man. Mat.</option>\
           <option>Food</option>\
          </select>\
         </div>\
         <!--<div id='TC_ltTimesToDo'>\
          <label for='TC_ltNumToDo'>Trade Cap </label><input type='number' id='TC_ltNumToDo' min='-1' value='1'/>\
         </div>\
         <div id='TC_ltInt'>\
          <label for='TC_ltInterval'>Interval </label><input type='number' id='TC_ltInterval' min='1' value='1'/>\
         </div>-->\
         <div id='TC_ltSend' class='noTrade'>\
          <div class='lightFrameBody'>Publish</div>\
          <div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
         </div>\
        </div>\
        <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
       </div>",MHTML:" <div id='TC_refreshTrades'></div>\
       <div id='TC_marketBox'>\
        <div id='TC_tradeListBox' class='textFramed'>\
         <div id='TC_tradeList'>\
          <div id='TC_filterBar'>Filter:\
           <div id='TC_filterRes'>\
            <select id='TC_recRes'>\
             <option>Any</option>\
             <option>Metal</option>\
             <option>Timber</option>\
             <option>Man. Mat.</option>\
             <option>Food</option>\
            </select>\
            for \
            <select id='TC_sendRes'>\
             <option>Any</option>\
             <option>Metal</option>\
             <option>Timber</option>\
             <option>Man. Mat.</option>\
             <option>Food</option>\
            </select>\
           </div>\
           <div id='TC_filterAmnt'>\
            <label for='TC_sendAmnt'>Max. Amount:</label>\
            <input type='number' id='TC_sendAmnt' min='0'/>\
           </div>\
          </div>\
          <div id='TC_keys'>\
           <div id='TC_playerKey'>Player</div>\
           <div id='TC_townKey'>Town</div>\
           <div id='TC_resKey'>Outgoing/Incoming</div>\
           <div id='TC_distKey'>Distance</div>\
          </div>\
          <div id='TC_trades'></div>\
         </div>\
         <div id='TC_tradeInfo'>\
          <h1 id='TC_infoHeader'>Trade Info</h1>\
          <div id='TC_isssuePlayer'><h2>Player:</h2><div></div></div>\
          <div id='TC_issueTown'><h2>Town:</h2><div></div></div>\
          <div id='TC_issueRes'><h2>Incoming:</h2><div></div></div>\
          <div id='TC_issueCost'><h2>Outgoing:</h2><div></div></div>\
          <div id='TC_issueDist'><h2>ETA:</h2><div></div></div>\
          <div id='TC_purchaseTrade' class='noBld'>\
           <div class='lightFrameBody'>Purchase</div>\
           <div class='lightFrameBL'><div class='lightFrameBR'><div class='lightFrameB'></div></div></div>\
          </div>\
         </div>\
        </div>\
        <div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
       </div>",DT:{interval:0,numIntervals:1,x:0,y:0,},LT:{interval:0,numIntervals:1},build:TC_UI},Warehouse:{name:["Metal Warehouse","Manufactured Materials Warehouse","Timber Warehouse","Food Warehouse"],HTML:"<div id='Ware_resTotals'>\
        <span id='Ware_resDesc'>Resource Overview:</span>\
        <span id='Ware_curRes'></span>/<span id='Ware_resCap'></span>\
        <div id='Ware_resPerc'></div>\
        <div id='Ware_resPercBarBox'><div id='Ware_resPercBar'></div></div>\
       </div>",build:warehouse_UI}};