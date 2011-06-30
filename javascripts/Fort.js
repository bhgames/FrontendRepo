function Fort_UI(bldgInfo) {
	var usedSlots = 0;
	$.each(bldgInfo.fortArray, function(i,v) {
		if(v>0) {
			$("#Fort_protAUList").append("<div class='Fort_AU'>\
											<div class='Fort_AUname'></div>\
											<img class='Fort_AUpic' />\
											<div class='Fort_AUfort'></div>\
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
														<input type='text' class='Fort_AUinput' value='0'/>\
													</div>");
			var AUnode = $(".Fort_AU").eq(i);
			AUnode.children(".Fort_AUname").text(v.name);
			AUnode.children(".Fort_AUpic").attr("src",'AIFrames/units/'+v.rank+'renderTHUMB.png');
			AUnode.children(".Fort_AUnumber").text(player.curtown.au[i])
			.unbind('click').click(function(){
										var $this = $(this);
										var input = $this.siblings(".Fort_AUinput")
										if(input.val() == $this.text()) {
											input.val(0);
										} else {
											input.val($this.text());
										}
										input.keyup();
									});
		}
	});
	
	var typeCheck = 0;
	$(".Fort_AUinput").unbind('keyup').keyup(function() {
		clearTimeout(typeCheck);
		typeCheck = setTimeout(function() {
						var AUArray = bldgInfo.fortArray.slice(0);
					});
	});
}