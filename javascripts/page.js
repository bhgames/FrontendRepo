Modernizr.addTest('pointerEvents', function () {
    var test    = document.createElement('div'),
        fake = false,
        root = document.body || (function () {
            fake = true;
            return document.documentElement.appendChild(document.createElement('body'));
        }());

    test.style.cssText = 'pointer-events:none;'; 
    root.appendChild(test);
    
    var ret = test.style.cssText.match(/pointer-events/);

    root.removeChild(test);
    
    if (fake) {
        document.documentElement.removeChild(root);
    }

    return ret;
});

$(document).ready(function() {

	FB.init({appId: '164327976933647', status: true, cookie: false, xfbml: true});
	FB.Canvas.setSize();
	
	//set jScrollPane global defaults
	
	$.extend($.fn.jScrollPane.defaults,{verticalDragMinHeight:24,verticalDragMaxHeight:24,horizontalDragMinWidth:23,horizontalDragMaxWidth:23,showArrows:false,hideFocus:true});
	
	$("#quest_text").jScrollPane();
	
	get_session();
	
	$("body").bind("resUpdate.mainTicker", display_res);
	
	$("body").bind("resUpdate.warehouseMenu", function() {
		var info = $("#town_warehouseMenu").clone();
		$.each(player.curtown.res, function(i,x) {
			if(i>3) {return false;}
			var perc = Math.round((x/player.curtown.resCaps[i]) * 100);
			var bar = info.find(".capacityBar").eq(i).css("width",perc+"%");
			info.find(".rph").eq(i).text(Math.ceil(player.curtown.actualInc[i]*3600) + " per hour");
		});
		$("#town_warehouseMenu").replaceWith(info);
	});
	
	$("#menu").unbind("click").click(function() {
		$("#dropdown_menu").animate({"opacity":"toggle"},"fast");
		$(this).toggleClass("open");
	});
	$("#dropdown_menu a").click(function() {$("#menu").click();});
	
	$(window).unload(function() {
		$("*").unbind().die();
		clear_all_timers();
		clearInterval(updateTimer);
	});
	$("#console").unbind("click").click(function() {
		show_output_window();
	});
	$("#console_close").unbind("click").click(function() {
		$("#console_box").fadeOut("fast");
		$("#console").removeClass("active");
	});
	$("#output_clear").unbind("click").click(function() {
		$("#console_output").html("");
	});
	$("#console_expand").unbind("click").click(function() {
		if(this.checked) {
			$("#console_output").animate({"width":"800px"},"fast", function(){
				$(this).scrollTop(10000000);
			});
		} else {
			$("#console_output").animate({"width":"200px"},"fast", function(){
				$(this).scrollTop(10000000);
			});
		}
	});
	$("#console_titlebar").unbind("mousedown").mousedown(function(e) {
		if(e.which == 1) {
			var cLeft = parseInt($("#console_box").css("right"));
			var cTop = parseInt($("#console_box").css("top"));
			var mLeft = e.pageX;
			var mTop = e.pageY;
			$("body").unbind("mousemove").mousemove(function(e) {
				$("#console_box").css("right", (cLeft-(e.pageX-mLeft)) + "px");
				$("#console_box").css("top", (cTop-mTop+e.pageY) + "px");
			});
			$("body").unbind("mouseup").mouseup(function() {
				$(this).unbind("mousemove").unbind("mouseup");
			});
		}
	});
	$("#support").unbind("click").click(function(){
		$("#menu").click();
		do_fade(draw_support_UI);
	});
	$("#twitter_tab").unbind('click').click(function() {
		if(Modernizr.csstransitions) {
			$("#twitter_box").addClass("open");
		} else {
			$("#twitter_box").animate({"margin-left":"-4px"},100);
		}
	});
	$("#twitter_close").unbind("click").click(function() {
		if(Modernizr.csstransitions) {
			$("#twitter_box").removeClass("open");
		} else {
			$("#twitter_box").animate({"margin-left":"-310px"},100);
		}
	});
});