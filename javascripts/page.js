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
	try {
		window.applicationCache.addEventListener('updateready', function(e) {
			if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
				window.applicationCache.swapCache();
			  display_message('Update','A new version of this site is available. Load it?',function() {
				window.location.reload();
			  });
			}
		});
	} catch(e) {} //browser doesn't support appcache

	FB.init({appId: '164101923624047', status: true, cookie: false,
			 xfbml: true});
	FB.Canvas.setSize();
	
	set_sidebar_anim();
	get_session();
	
	$("body").bind("resUpdate", display_res);
	
	$("body").bind("resUpdate", function() {
		var info = $("#town_warehouseMenu").clone();
		$.each(player.curtown.res, function(i,x) {
			if(i>3) {return false;}
			var perc = Math.round((x/player.curtown.resCaps[i]) * 100);
			var bar = info.find(".capacityBar").eq(i).css("width",perc+"%");
			switch(true) {
				case perc > 90:
					bar.css("background-color","red");
					break;
				case perc > 60:
					bar.css("background-color","yellow");
					break;
				default:
					bar.css("background-color","lime-green");
			}
			info.find(".rph").eq(i).text(Math.ceil(player.curtown.actualInc[i]*3600) + " per hour");
		});
		$("#town_warehouseMenu").replaceWith(info);
	});
	
	$("#town_infobarOpen").unbind("click").click(function() {
		$("#town_infobar").slideDown(100);
	});
	
	$("#town_infobar").unbind("mouseleave").mouseleave(function() {
		$(this).slideUp(100);
	});
	
	$("#menu").unbind("click").click(function() {
		$("#dropdown_menu").animate({"opacity":"toggle"},"fast");
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
});