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
	FB.init({appId: '164101923624047', status: true, cookie: true,
			 xfbml: true});
	FB.Canvas.setSize();
	
	preload();
	set_sidebar_anim();
	get_session();
	$("#menu").unbind("click").click(function() {
		$("#dropdown_menu").animate({"opacity":"toggle"},"fast");
	});
	$("#dropdown_menu a").click(function() {$("#menu").click();});
	
	$(window).unload(function() {
		$("*").unbind().die();
		clear_all_timers()
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
			var cLeft = parseInt($("#console_box").css("left"));
			var cTop = parseInt($("#console_box").css("top"));
			var mLeft = e.pageX;
			var mTop = e.pageY;
			$("body").unbind("mousemove").mousemove(function(e) {
				$("#console_box").css("left", (cLeft-mLeft+e.pageX) + "px");
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