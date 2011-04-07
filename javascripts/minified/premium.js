
function draw_premium_UI(){currUI=draw_premium_UI;var HTML="<div id='Premium_outerbox'>\
     <div class='darkFrameBody'>\
      <h1>Battlehard Menu</h1>\
      <div id='Premium_statusBox'><span class='help'></span>Account Mode: <span id='Premium_status'>"+((player.research.premiumTimer>0)?"Battlehard Mode":"Normal Mode")+"</span><span id='Premium_modeLeft'>Time Left: <span class='bpTime'></span></span></div>\
      <!--<div id='Premium_autopilotBox'><span class='help'></span>Autopilot: <span id='Premium_autopilot'>"+((player.research.revTimer>0)?"On":"Off")+"</span><span id='Premium_autoLeft'>Time Left: <span class='bpTime'></span></span></div>-->\
      <div id='Premium_currBP'>Current BP: "+player.research.bp+"</div>\
      <div id='Premium_buyPremium'"+((player.research.premiumTimer>0)?"":" class='noPrem'")+"></div>\
      <ul id='Premium_spendList'>\
       <li id='Premium_mInc'><span class='help'></span>+25% Metal Production<span class='price'>50BP</span><span class='useBP'></span><span class='remainingTime'>Time Remaining: <span class='bpTime'></span></span><span class='name'>metal</span></li>\
       <li id='Premium_mmInc'><span class='help'></span>+25% Manufactured Materials Production<span class='price'>50BP</span><span class='useBP'></span><span class='remainingTime'>Time Remaining: <span class='bpTime'></span></span><span class='name'>manmat</span></li>\
       <li id='Premium_tInc'><span class='help'></span>+25% Timber Production<span class='price'>50BP</span><span class='useBP'></span><span class='remainingTime'>Time Remaining: <span class='bpTime'></span></span><span class='name'>timber</span></li>\
       <li id='Premium_fInc'><span class='help'></span>+25% Food Production<span class='price'>50BP</span><span class='useBP'></span><span class='remainingTime'>Time Remaining: <span class='bpTime'></span></span><span class='name'>food</span></li>\
       <li id='Premium_ub'><span class='help'></span>Ultra Build<span class='price'>100BP</span><span class='useBP'></span><span class='remainingTime'>Time Remaining: <span class='bpTime'></span></span><span class='name'>ub</span></li>\
       <li id='Premium_ib'><span class='help'></span>Instant Build<span class='price'>100BP</span><span class='useBP'></span><span class='name'>buildingFinish</span></li>\
       <li id='Premium_fero'><span class='help'></span>Ferocity<span class='price'>500BP</span><span class='useBP'></span><span class='remainingTime'>Time Remaining: <span class='bpTime'></span></span><span class='name'>ferocity</span></li>\
       <li id='Premium_tp'><span class='help'></span>Troop Push<span class='price'>200BP</span><span class='useBP'></span><span class='name'>troopPush</span></li>\
       <li id='Premium_ismt'><span class='help'></span>Instant Stock Market Trade<span class='price'>10BP</span></li>\
       <li id='Premium_ir'><span class='help'></span>Instant Research<span class='price'>1000BP</span></li>\
      </ul>\
     </div>\
     <div class='darkFrameBL-BR-B'>\
      <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
     </div>\
    </div>";$("#window").html(HTML).fadeIn();$("#Premium_buyPremium").unbind("click").click(function(){var message="Are you sure you want to activate Battlehard Mode?<br/><br/>This setting will last for one week and <span style='font-weight:bold'>CANNOT</span> be canceled.  This mode can, and will, ruin your game experience if you're not prepared for it; Please be sure you fully understand the implications of entering this mode before you activate it.  Click the question mark (?) next to \"Account Mode\" for more information.";if(!$(this).hasClass("noPrem"))message="Are you sure you want more Battlehard Mode?<br/><br/>This will add an additional week onto your Battlehard Mode timer.";display_message("Confirm",message,function(){display_output(false,"Activating Battlehard Mode...");var goBHM=new make_AJAX();goBHM.callback=function(response){if(response.match(/true/)){display_output(false,"Battlehard Mode Active!");player.research.premiumTimer+=604800;currUI();$("body").removeClass("notBH");}else{var error=response.split(":");if(error.length==2)error=error[1];display_output(true,"Error Activating Battlehard Mode",true);display_output(true,error);}};goBHM.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".goBHM();");});});$(".help").unbind("click").click(show_help);$(".useBP").unbind("click").click(function(){var that=this;display_message("Use BP","Are you sure?",function(){var which=$(that).siblings(".name").text();display_output(false,"Purchase code: "+which);var useBP=new make_AJAX();useBP.callback=function(response){if(response.match(/true/)){display_output(false,"Success!");load_player(player.league,true,true);}else{if(response.indexOf(":")>=0)response=response.split(":")[1];display_output(true,response,true);}}
useBP.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".useBP("+which+");");});});set_premium_timers();}
function show_help(){var ele=$(event.target);var which=ele.parent().attr("id");var title='';var desc='';switch(which){case"Premium_mInc":case"Premium_mmInc":case"Premium_tInc":case"Premium_fInc":title='Resource Boost';desc='Resource Boost increases the output of the associated mine by 25%.<br/><br/>Cost: 50BP';break;case"Premium_ub":title='Ultra Build';desc='Ultra Build decreases your unit build times by 50% for one week.<br/><br/>Cost: 100BP';break;case"Premium_ib":title='Instant Build';desc='Instantly finishes all your currently constructing units.<br/><br/>Cost: 100BP';break;case"Premium_fero":title='Ferocity';desc='Ferocity grants your units a 10% boost in attack strength for one week.<br/><br/>Cost: 500BP';break;case"Premium_tp":title='Troop Push';desc='Troop Push grants you two days worth of free troops in your Capital City.  Note that this is based off actual build times, so the amount gained will decrease as your army grows.<br/>CSL and size information can be found in your Headquarters.<br/><br/>Cost: 200BP';break;case"Premium_ismt":title='Instant Stock Market Trade';desc='Only purchasable from the Trade Center.<br/>Instantly grants the Stock Market trade outlined in the Send Trade form.<br/><br/>Cost: 10BP';break;case"Premium_ir":title='Instant Research';desc='Only purchasable from the Institute.<br/>Instantly grants the selected research.<br/><br/>Cost: 1000BP';break;case"Premium_statusBox":title='Account Modes';desc='There are two account modes in AI Wars:<br/><dl><dt>Normal Mode:</dt><dd>Normal mode is the mode all new accounts start in.  It provides no bonuses and carries no innate disadvantages.  This mode is recommended for new players.</dd><dt>Battlehard Mode:</dt><dd>Battlehard Mode is designed to be challenging to play well, and rewarding if done correctly.  Once active, you will generate BP, Battlehard Points, after combat, but <span style="font-weight:bold">your resource production will be reduced by 25%</span>.  The amount of BP generated depends on the circumstances of the battle.  Closer or larger battles generate more BP then smaller or more one sided battles.  This Mode lasts for one full week.</dd></dl>';break;case"Premium_autopilotBox":title='Autopilot';desc='For 1.00 USD, you can activate Autopilot.  Autopilot grants you access to our powerful programming interface.  EVE, your rEVElations Class AI, allows you to write a program in JAVA that runs on our servers.  Using this program, you can automate tasks even when offline!';break;}
display_message(title,desc);}
function set_premium_timers(){setInterval(function(){$(".bpTime").each(function(i,v){var time=-player.time.timeFromNow(1000);;switch(i){case 0:time+=player.research.premiumTimer;break;case 1:time+=player.research.mineTimer;break;case 2:time+=player.research.mmTimer;break;case 3:time+=player.research.timberTimer;break;case 4:time+=player.research.fTimer;break;case 5:time+=player.research.ubTimer;break;case 6:time+=player.research.feroTimer;break;}
if(time>0){var days=Math.floor((time/3600)/24);var hours=Math.floor((time/3600)%24);var mins=Math.floor((time%3600)/60);var secs=Math.floor((time%3600)%60);$(v).html(((days)?days+" d ":"")+((hours<10)?"0"+hours:hours)+":"+((mins<10)?"0"+mins:mins)+":"+((secs<10)?"0"+secs:secs))}else $(v).parent().css("display","none");});},1000);}