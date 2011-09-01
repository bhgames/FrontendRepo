function Fort_UI(bldgInfo) {
	var usedSlots = 0;
	$.each(bldgInfo.fortArray, function(i,v) {
		if(v>0) {
			var AU = player.AU[i];
			$("#Fort_protAUList").append("<div class='Fort_AU'>\
											<div class='Fort_AUname'>"+AU.name+"</div>\
											<img class='Fort_AUpic' src='AIFrames/units/"+AU.rank+"renderTHUMB.png'/>\
											<div class='Fort_AUfort'>"+v+"</div>\
										</div>");
			
		}
	});
	
	var slots = bldgInfo.lvl*(player.research.advancedFortifications?3:2);
	$("#Fort_availableSlots").text("Available Slots: "+(slots-usedSlots)+"/"+slots);
	
	
	$.each(player.AU, function(i,v) {
		if(v.rank == "soldier" || (player.research.advancedFortifications && v.rank == "tank")) {
			$("#Fort_AUlist .darkFrameBody").append("<div class='Fort_AU'>\
														<div class='Fort_AUname'></div>\
														<img class='Fort_AUpic' />\
														<a href='javascript:;' class='Fort_AUnumber'></a>\
														<input type='text' class='Fort_AUinput' index='"+i+"' value='"+bldgInfo.fortArray[i]+"'/>\
													</div>");
			var AUnode = $(".Fort_AU").eq(i);
			AUnode.children(".Fort_AUname").text(v.name);
			AUnode.children(".Fort_AUpic").attr("src",'AIFrames/units/'+v.rank+'renderTHUMB.png');
			AUnode.children(".Fort_AUnumber").text(player.curtown.au[i])
			.unbind('click').click(function(){
										var $this = $(this);
										var input = $this.siblings(".Fort_AUinput");
										if(input.val() == $this.text()) {
											input.val(bldgInfo.fortArray[i]);
										} else {
											input.val($this.text());
										}
										input.keyup();
									});
		}
	});
	
	var typeCheck = 0;
	$(".Fort_AUinput").unbind('keyup').keyup(function() {
		var that = $(this);
		clearTimeout(typeCheck);
		typeCheck = setTimeout(function() {
						that.val(that.val().max(that.siblings(".Fort_AUnumber").text()*1));
					});
	});
	
	$("#Fort_protectAU").unblind("click").click(function() {
		var auArray = [];
		$.each(player.AU, function(i,v) {
			auArray[i] = 0;
		});
		$(".Fort_AUinput").each(function(i,v) {
			var index = $(v).attr("index")*1;
			auArray[index] = $(v).val();
		});
		
		var setFort = new make_AJAX();
		
		setFort.callback = function(response) {
			if(response.match(/false/)) {
				$("#BUI_fail").text(response.split(";")[1]);
			} else {
				load_player(false,true,true);
			}
		};
		
		setFort.get("reqtype=command&command=bf.setFortification(["+auArray.join(",")+","+bldgInfo.id+"]);");
	});
	
	$("#BUI_bldgContent").fadeIn();
	
	$("#Fort_protAUList").jScrollPane({showArrows:true,hideFocus:true});
	$("#Fort_AUlist .darkFrameBody").jScrollPane({showArrows:true,hideFocus:true});
}