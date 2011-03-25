<?php
	function insertScript($name, $type) {
		$file = $name.".".$type;
		if($type == "js") {
			echo '<script type="text/javascript" src="javascripts/'.$file.'"></script>';
		} else if($type == "css") {
			echo '<link href="stylesheets/'.$file.'" rel="stylesheet" type="text/css" />';
		}
	}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html class='no-js'>
<head>
	<meta charset="utf-8">
	<meta http-equiv="content-type" content="text/html; charset=utf-8"> 
	<meta name="ROBOTS" content="NOINDEX, NOFOLLOW, NOARCHIVE">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	
	<title>AI Wars Client</title>
	<?php
		insertScript("client","css");
		insertScript("topNav","css");
		insertScript("resource","css");
		insertScript("bottomNav","css");
		insertScript("AF","css");
		insertScript("AP","css");
		insertScript("ASM","css");
		insertScript("BUI","css");
		insertScript("bunker","css");
		insertScript("CC","css");
		insertScript("CY","css");
		insertScript("HQ","css");
		insertScript("IN","css");
		insertScript("league","css");
		insertScript("login","css");
		insertScript("mine","css");
		insertScript("MS","css");
		insertScript("messages","css");
		echo "<![if !IE]>";
		insertScript("prog","css");
		echo "<![endif]>";
		echo "<!--[if true]>";
		insertScript("prog-IE","css");
		echo "<![endif]-->";
		insertScript("premium","css");
		insertScript("quest", "css");
		insertScript("raidList","css");
		insertScript("rank","css");
		insertScript("refinery","css");
		insertScript("RY","css");
		insertScript("SR","css");
		insertScript("support","css");
		insertScript("TC","css");
		insertScript("town","css");
		insertScript("warehouse","css");
		insertScript("worldmap","css");
		insertScript("modernizr-1.6.min","js");
	?>
</head>
<?php flush(); ?>
<body>
	<div id='quest_box'></div>
	<div id='console_box'>
		<div class='popFrame'>
			<div class='popFrameTop'><div class='popFrameLeft'><div class='popFrameRight'>
				<div class='popFrameBody'>
					<div id='console_titlebar'>
						<a href='javascript:;' id='console_close'></a>
						<span>Output Window</span>
					</div>
					<div id='console_output'>
					<p class='output'>This window can be moved by holding the left mouse button down on the titlebar and dragging.</p>
					<p class='output'>For more information on <span class='error'>errors</span>, please stop by our <a href="http://battlehardalpha.xtreemhost.com/" id="forum" target="_forum">forum</a>.</p> 
					</div>
					<div id='console_expandBox'>
						<input type='checkbox' id='console_expand' /><label for='console_expand'> Expand</label>
					</div>
					<div id='console_stopBox'>
						<input type='checkbox' id='console_stop' /><label for='console_stop'> Freeze Output</label>
					</div>
					<a href='javascript:;' id='output_clear'></a>
				</div>
			</div></div></div>
		</div>
		<div class='popFrameBL-BR-B'>
			<div class='popFrameBL'><div class='popFrameBR'><div class='popFrameB'></div></div></div>
		</div>
	</div>
	<a id="chatbox_tab" href="#">CHATBOX</a>
	<div id='chat_box'>
		<div id='chat_titlebar'>
			<a href='javascript:;' id='chat_close'></a>
			<span>Chatbox</span>
		</div>
		<div id='chat_innerbox'></div>
	</div>
	<div id="header"><img src='AIFrames/Header.png' alt='BattleHard: AI Wars' /></div>
	<div id="content">
		<div id="client">
			<a id="#"></a> <!-- this is to prevent the view from going to the top when a sidetab is clicked -->
			<ul id="toplinks">
				<li id="citybox"><a href="javascript:;" id="cityname"></a><a href="javascript:;" id="citydropdown"></a></li>
				<li id="wm">World Map</li>
				<li id="sr">Status Reports<div class='flicker'>Status Reports</div></li>
				<li id="mailbox">Mailbox<div class='flicker'>Mailbox</div></li>
			</ul>
			<ul id="resourcebar">
				<li id="steel"><span class='value'>&nbsp;</span><div class='bar'></div></li>
				<li id="wood"><span class='value'>&nbsp;</span><div class='bar'></div></li>
				<li id="synth"><span class='value'>&nbsp;</span><div class='bar'></div></li>
				<li id="food"><span class='value'>&nbsp;</span><div class='bar'></div></li>
				<div id="menu">Menu</div>
			</ul>
			<div id="clientview" class="amber">
				<div id="townlist"></div>
				<div id='accountPreferences'></div>
				<div id="attacklist" style='display: none;'>
					<div class='popFrame'>
						<div class='popFrameTop'><div class='popFrameLeft'><div class='popFrameRight'>
							<div class='popFrameBody'>
								<div id='incomming_attacks'>
									Incoming:
									<ul>
									</ul>
								</div>
								<div id='outgoing_attacks'>
									Outgoing:
									<ul>
									</ul>
								</div>
							</div>
						</div></div></div>
					</div>
					<div class='popFrameBL-BR-B'>
						<div class='popFrameBL'><div class='popFrameBR'><div class='popFrameB'></div></div></div>
					</div>
				</div>
				<div id="dropdown_menu">
					<div class='darkFrameBody'>
						<ul>
							<li> <a href="javascript:;" id="refresh">Refresh</a></li>
							<li> <a href="javascript:;" id="support">Support</a> |</li>
							<li> <a href="javascript:;" id="premium">Battlehard</a> |</li>
							<li> <a href="javascript:;" id="options">Account</a> |</li>
							<li> <a href="javascript:;" id="tutorial">Tutorial</a> |</li>
							<li> <a href="http://battlehardalpha.xtreemhost.com/" id="forum" target="_forum">Forum</a> |</li>
							<li><a href="javascript:;" id="logout">Logout</a> |</li>
						</ul>
					</div>
					<div class='darkFrameBL-BR-B'>
						<div class='darkFrameBL'><div class='darkFrameB'></div></div>
					</div>
				</div>
				<div id="window"></div>
			</div>
			<ul id="bottomlinks">
				<div id='rankings'></div>
				<li id="console"></li>
				<li id="IO"></li>
				<li id='League' title="View League Page"></li>
				<li id='Quests' title="View Quests"></li>
				<li id="CS" title="Go to Headquarters"></li>
				<li id="EVE" title="rEVElations AI"></li>
			</ul>
		</div>
	</div>
	<div id="preload"></div>
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
	<?php
		flush();
		//page function JS
		insertScript("jquery.numberformatter-1.1.2.min","js");
		insertScript("jScrollPane-2.0.0.6.min","js");
		insertScript("jScrollPane.mousewheel","js");
		insertScript("mwheelIntent","js");
		insertScript("jquery.sb.min","js");
		insertScript("page","js");
		//game globals
		insertScript("globals","js");
		insertScript("global_ASM","js");
		insertScript("global_SR","js");
		insertScript("global_UTCC","js");
		//building files
		insertScript("buildings","js");
		insertScript("AF","js");
		insertScript("AP","js");
		insertScript("bnkr","js");
		insertScript("CC","js");
		insertScript("CY","js");
		insertScript("HQ","js");
		insertScript("IN","js");
		insertScript("MS","js");
		insertScript("RY","js");
		insertScript("refinery","js");
		insertScript("SR","js");
		insertScript("TC","js");
		insertScript("mine","js");
		insertScript("warehouse","js");
		insertScript("BUI","js");
		//menu files
		insertScript("league","js");
		insertScript("menus","js");
		insertScript("messages","js");
		echo "<![if !IE]>";
		insertScript("prog","js");
		echo "<![endif]>";
		echo "<!--[if true]>";
		insertScript("prog-IE","js");
		echo "<![endif]-->";
		insertScript("premium","js");
		insertScript("quest", "js");
		insertScript("rank","js");
		insertScript("support","js");
		insertScript("towns","js");
		insertScript("worldmap","js");
		//midend files
		insertScript("login","js");
		insertScript("utilities","js");
		insertScript("raids","js");
		//script editor
		echo "<![if !IE]>";
		insertScript("ace/ace","js");
		insertScript("ace/theme-aiwars","js");
		insertScript("ace/mode-java","js");
		echo "<![endif]>";

		flush();
	?>
	<script type="text/javascript" src="http://connect.facebook.net/en_US/all.js"></script>
	<div id="fb-root"></div>
	<!-- Start of StatCounter Code -->
		<script type="text/javascript">
			var sc_project=6395156; 
			var sc_invisible=1; 
			var sc_security="6d06f53b"; 
		</script>

		<script type="text/javascript" src="http://www.statcounter.com/counter/counter_xhtml.js"></script>
		<noscript>
			<div class="statcounter">
				<a title="web analytics" class="statcounter" href="http://statcounter.com/">
					<img class="statcounter" src="http://c.statcounter.com/6395156/0/6d06f53b/1/" alt="web analytics" />
				</a>
			</div>
		</noscript>
	<!-- End of StatCounter Code -->
	<!-- GetSatisfaction code -->
	<script type="text/javascript" charset="utf-8">
	  var is_ssl = ("https:" == document.location.protocol);
	  var asset_host = is_ssl ? "https://s3.amazonaws.com/getsatisfaction.com/" : "http://s3.amazonaws.com/getsatisfaction.com/";
	  document.write(unescape("%3Cscript src='" + asset_host + "javascripts/feedback-v2.js' type='text/javascript'%3E%3C/script%3E"));
	</script>

	<script type="text/javascript" charset="utf-8">
	  var feedback_widget_options = {};

	  feedback_widget_options.display = "overlay";  
	  feedback_widget_options.company = "battlehard_games";
	  feedback_widget_options.placement = "left";
	  feedback_widget_options.color = "#222";
	  feedback_widget_options.style = "question";
	  var feedback_widget = new GSFN.feedback_widget(feedback_widget_options);
	</script>
</body>
</html>