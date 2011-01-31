
function show_town(){currUI=show_town;$("#window").contents().unbind();$.each(player.curtown.bldg,function(i,v){if(v.update){load_player(player.league,true,true);return false;}else{var noUpdate=true;$.each(v.Queue,function(j,w){if(w.update){load_player(player.league,true,true);noUpdate=false;return false;}});return noUpdate;}});get_buildable();$("#cityname").html(function(){if(player.curtown.townID==player.capitaltid){return"&#171;"+player.curtown.townName+"&#187;";}else{return player.curtown.townName;}});var HTML=" <div id='town_buildBldgMenu'>\
      <div id='town_buildBldgList' class='darkFrameBody'></div>\
      <div class='darkFrameBR'><div class='darkFrameB'></div></div>\
     </div>\
     <div id='town_buildBldgPopup'></div>\
     <div id='townview'>\
      <div id='town_warehousePopup'>\
       <div id='town_warehouseBar'>Resource Overview</div>\
       <div id='town_warehouseMenu'>\
        <div id='town_metalInfo'>\
         <div class='capacityBar'></div>\
         <div class='rph'></div>\
        </div>\
        <div id='town_timberInfo'>\
         <div class='capacityBar'></div>\
         <div class='rph'></div>\
        </div>\
        <div id='town_manmatInfo'>\
         <div class='capacityBar'></div>\
         <div class='rph'></div>\
        </div>\
        <div id='town_foodInfo'>\
         <div class='capacityBar'></div>\
         <div class='rph'></div>\
        </div>\
       </div>\
      </div>\
      <div id='town_bldgBldgsPopup'>\
       <div id='town_bldgBldgsBar'>Building Server</div>\
       <div id='town_bldgBldgsList' class='darkFrameBody'></div>\
      </div>";if(player.curtown.zeppelin){HTML+="<img src='AIFrames/buildings/AirshipView.png' id='townback' alt=''/><img src='AIFrames/buildings/enginspin.gif' id='enginespin1' alt=''/><img src='AIFrames/buildings/enginspin.gif' id='enginespin2' alt=''/>";$.each(player.curtown.bldg,function(i,v){HTML+="<div id='pos"+i+"' class='airship bldg'><img src='AIFrames/buildings/Air"+v.path+".png' id='pos"+i+"_building' alt='"+v.type+"' title='Level "+v.lvl+" "+v.type+"'/></div>"});}else{HTML+="<img src='AIFrames/buildings/Base";var numLotsOpen=player.research.lotTech;if(player.capitaltid==player.curtown.townID)numLotsOpen+=4;HTML+=Math.floor((numLotsOpen+1)/5)+".png' id='townback' alt=''/><div id='pos0' class='bldg'><img src='AIFrames/buildings/MetalMine.png' id='pos0_building' alt='Metal Mine'/></div><div id='pos1' class='bldg'><img src='AIFrames/buildings/TimberField.png' id='pos1_building' alt='Timber Field'/></div><div id='pos2' class='bldg'><img src='AIFrames/buildings/ManufacturedMaterialsPlant.png' id='pos2_building' alt='Manufactured Materials Plant'/></div><div id='pos3' class='bldg'><img src='AIFrames/buildings/FoodFarm.png' id='pos3_building' alt='Food Farm'/></div>";for(i=4;i<=18;i++){HTML+="<div id='pos"+i+"' class='emptylot notMine "+((i>numLotsOpen)?"locked ":"")
+"bldg'><img src='../../images/trans.gif' id='pos"+i+"_building' alt=''/></div>";}}
$("#window").html(HTML+"</div>").fadeIn("fast");if(BUI.CY.bldgServer.length>0){clearInterval(player.townUpdate);player.townUpdate=update_bldg_timers();$("#town_bldgBldgsBar").css("display","block");$("#town_bldgBldgsPopup").unbind("mouseenter").mouseenter(function(){$("#town_bldgBldgsList").slideDown();}).unbind("mouseleave").mouseleave(function(){$("#town_bldgBldgsList").slideUp();});var list="<ul>";$.each(BUI.CY.bldgServer,function(i,x){var ticksTotal=0;$.each(x.ticksToFinishTotal,function(j,y){ticksTotal+=y;list+="<li><div class='cancelButton noCancel'><a href='javascript:;'></a></div><div class='bldgName'>"
+x.type+"</div><div class='bldgListID'>"
+x.lotNum+"</div><div class='bldgTicksToFinish'>"
+(ticksTotal-x.ticksToFinish)+"</div></li>";});});$("#town_bldgBldgsList").html(list+"</ul>");if(Modernizr.flexbox){var list=$("#town_bldgBldgsList li");if(list.length>1){var sortedList=[];list.each(function(i,v){var temp={};temp.index=i;temp.time=parseInt($(v).children(".bldgTicksToFinish").text());sortedList.push(temp);});sortedList.sort(function(a,b){return a.time-b.time;});$.each(sortedList,function(i,v){$("#town_bldgBldgsList li:eq("+v.index+")").css({"box-ordinal-group":i,"-moz-box-ordinal-group":i,"-webkit-box-ordinal-group":i});});}}}
$.each(player.curtown.bldg,function(i,x){var lot=x.lotNum;$("#pos"+lot+"_building").attr("title","Level "+x.lvl+" "+x.type);if(lot>3){var back="AIFrames/buildings/"+x.path+".png";$("#pos"+lot).removeClass("emptylot").addClass("buildlot");$("#pos"+lot+"_building").attr({"src":back,"alt":x.type});}else if(player.league){$("#pos"+lot+"_building").parent().css("display","none");}
var show=false,image='';if(x.deconstruct){show=true;image='destruct';}else if(x.lvlUps>0){if(x.lvl==0){image='construct';}else{image='upgrade';}
show=true;}
if(lot<4){if(lot==0)image+="MM";else if(lot==2)image+="MMP";else image+="Large";}
if(show){$("#pos"+lot).append("<img src='AIFrames/buildings/"+image+"Tile.png' class='lvlImage'/>");}});$(".bldg").unbind('click').click(function(){var index=$(this).index(".bldg");if(!$(this).hasClass('locked')){if(!$(this).hasClass('emptylot')){$.each(player.curtown.bldg,function(i,x){if(index==x.lotNum){BUI.set(x.type,index);do_fade(draw_bldg_UI,"amber");return false;}});}else if(bldgs.buildable!="empty"){var HTML='<ul>';$.each(bldgs.buildable,function(i,v){var classes=''
if((index!=4&&v.type=="Headquarters")||(index==4&&v.type!="Headquarters"))classes+="noShow ";if(i==0)classes+="topBor";HTML+="<li class='"+classes+"'><span>"+v.type+"</span><img src='AIFrames/buildings/"+v.type.replace(/\s/g,"")
+".png' title='"+v.type+"' class='bldgPic' /><a href='javascript:;' class='buildBldgButton'></a></li>";});var api=$('#town_buildBldgList').data('jsp');if(!api){$('#town_buildBldgList').html(HTML+"</ul>").jScrollPane({showArrows:true,hideFocus:true,autoReinitialise:true});setTimeout(function(){$('#town_buildBldgList').data('jsp').reinitialise({showArrows:true,hideFocus:true});},2000);}else{api.getContentPane().html(HTML+"</ul>");api.reinitialise({showArrows:true,hideFocus:true});}
$("#town_buildBldgMenu").animate({"left":"0px"},"normal");$("a.buildBldgButton").one('click',function(){$("#townview").unbind('click');var i=$(this).index("a.buildBldgButton");$("#town_buildBldgPopup").html(function(){return"<div class='popFrame'><div class='popFrameTop'><div class='popFrameLeft'><div class='popFrameRight'><div class='popFrameBody'><a href='javascript:;' id='town_cancelPopup'></a><div id='town_bldgRes'><div id='town_bldgResMetal'></div><div id='town_bldgResTimber'></div><div id='town_bldgResManMade'></div><div id='town_bldgResFood'></div></div><img src='AIFrames/buildings/"
+bldgs.buildable[i].type.replace(/\s/g,"")
+".png' title='"+bldgs.buildable[i].type+"' id='town_bldgPic' /><div id='town_bldgDesc'>"+bldgs.buildable[i].desc+"</div><span id='town_error'></span><a href='javascript:;' id='town_buildBldg' class='bldButton'></a></div></div></div></div></div><div class='popFrameBL-BR-B'><div class='popFrameBL'><div class='popFrameBR'><div class='popFrameB'></div></div></div></div>";});$('#town_bldgResMetal').html(bldgs.buildable[i].cost[0]);$('#town_bldgResTimber').html(bldgs.buildable[i].cost[1]);$('#town_bldgResManMade').html(bldgs.buildable[i].cost[2]);$('#town_bldgResFood').html(bldgs.buildable[i].cost[3]);var canBuild=new make_AJAX();canBuild.callback=function(response){if(response.match(/^false/i)!=null){$("#town_buildBldg").addClass('noBld');$("#town_error").text(response.split(":")[1]);}};canBuild.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".canBuild("
+bldgs.buildable[i].type+","+index+","+player.curtown.townID
+");");$("#town_cancelPopup").unbind('click').click(function(){$("#town_buildBldgPopup").fadeOut("fast",function(){$(this).html("");});$(this).unbind('click');$("#town_buildBldg").unbind('click');});$("#town_buildBldg").click(function(){if(!$(this).hasClass("noBld")){buildBldg=new make_AJAX();buildBldg.callback=function(response){if(response.match(/^false/)==null){$("#town_buildBldgPopup").fadeOut("fast",function(){load_player(player.league,true,true);});}else{$("#town_error").html(response.split(":")[1]);}};buildBldg.get("/AIWars/GodGenerator?reqtype=command&command="+player.command+".build("
+bldgs.buildable[i].type+","+index+","+player.curtown.townID
+");");}});$("#town_buildBldgMenu").animate({"left":"-200px"},"normal");$("#town_buildBldgPopup").fadeIn("fast");$("#town_bldgDesc").jScrollPane({showArrows:true,hideFocus:true});});setTimeout(function(){$("#townview").one('click',function(){if($("#town_buildBldgMenu").css("left").match(/^0/)!=null){$("#town_buildBldgMenu").animate({"left":"-220px"},"normal");}});},0);}}});$(".cancelButton").unbind("click").click(function(){var ele=$(this);if(!ele.hasClass("noCancel")){$.each(BUI.CY.bldgServer,function(i,x){if(ele.next().text()==x.type){cancelQueue=new make_AJAX();cancelQueue.callback=function(response){if(response.match(/true/)){ele.parent().remove();x.lvlUps-=1;x.deconstruct=false;load_player(player.league,true,false);if($("#town_bldgBldgsList li").length==0)$("#town_bldgBldgsPopup").fadeOut();if(x.lvlUps==0)$("#pos"+x.lotNum+" .lvlImage").remove();}else{display_output(true,"Building Cancel Failed!",true);}};cancelQueue.get("/AIWars/GodGenerator?reqtype=command&command="+player.command
+".cancelQueueItem("+x.lotNum+","
+player.curtown.townID+");");return false;}});}});}
function nav_town(direction,box){box.top=parseInt(box.css("top"));if(direction=="up"){box.top+=138;}else{box.top-=138;}
if(box.top>=0)box.top=0;if(box.top<=-276)box.top=-276;box.animate({"top":box.top+"px"},"fast");}
function town_list(){$("#citydropdown").unbind('click');var list=$("#townlist");var HTML="<ul id='list' class='darkFrameBody'>";var numCols=Math.ceil(player.towns.length/10);$.each(player.towns,function(i,x){if(i%numCols==0){HTML+="<li class='firstcol'>";}else{HTML+="<li>";}
HTML+="<a href='javascript:;'>"+(x.townID==player.capitaltid?"&#171;"+x.townName+"&#187;":x.townName)+"</a><span>"+x.townID+"</span></li>";});HTML+="</ul>\
   <div class='darkFrameBL-BR-B'>\
    <div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
   </div>";list.html(HTML);if(numCols>1){$("#list").css("height","500px");}else{$("#list").css("height",(50*player.towns.length)+"px");}
$("#list").css("width",(numCols*140)+"px");list.fadeIn();$("#list a").unbind('click').click(function(){var that=$(this);player.curtown=$.grep(player.towns,function(v){return(that.siblings("span").text()==v.townID);})[0];$("#townlist").fadeOut();$("body").unbind('click');that.unbind('click');BUI.build();clearInterval(BUI.active.timer);get_buildable();display_res();build_raid_list();show_town($("#window"));$("#citydropdown").unbind('click').click(function(){town_list();});});setTimeout(function(){$("body").unbind('click').click(function(){$("#townlist").fadeOut();$("#list a").unbind('click');$(this).unbind('click');$("#citydropdown").unbind('click').click(function(){town_list();});});},0);}
function update_bldg_timers(){return setInterval(function(){try{var iter=0;var ticksTotal=0;$(".bldgListID").each(function(i,v){$.each(BUI.CY.bldgServer,function(ind,x){if(x.update)load_player(player.league,true,true);if($(v).text()==x.lotNum){var ticks;if(x.lvlUps>1){if(i!=0){if($(v).parent().prev().children(".bldgListID").text()==$(v).text()){if(iter+1!=x.lvlUps){$(v).siblings(".cancelButton").addClass('noCancel');}else{$(v).siblings(".cancelButton").removeClass('noCancel');}
ticksTotal+=x.ticksToFinishTotal[iter];iter++;}else{$(v).siblings(".cancelButton").addClass('noCancel');iter=1;ticksTotal=x.ticksToFinishTotal[0];}}else{$(v).siblings(".cancelButton").addClass('noCancel');ticksTotal=x.ticksToFinishTotal[iter];iter++;}
ticks=ticksTotal-x.ticksToFinish;}else{ticks=x.ticksToFinishTotal[0]-x.ticksToFinish;$(v).siblings(".cancelButton").removeClass('noCancel');}
var days=Math.floor((ticks/3600)/24);var hours=Math.floor((ticks/3600)%24);var mins=Math.floor((ticks%3600)/60);var secs=Math.floor((ticks%3600)%60);if(isNaN(hours)){$(v).siblings(".bldgTicksToFinish").html("updating");}else{$(v).siblings(".bldgTicksToFinish").html(((days)?days+" d ":"")+((hours<10)?"0"+hours:hours)+":"+((mins<10)?"0"+mins:mins)+":"+((secs<10)?"0"+secs:secs));}
return false;}else if(ind==BUI.CY.bldgServer.length-1)$(v).parent().remove();});});}catch(e){}},1000);}