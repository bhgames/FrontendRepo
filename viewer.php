<?php
	function insertScript($name, $type) {
		$file = $name. "." .$type;
		if($type == "js") {
			echo '<script src="javascripts/'.$file.'"></script>';
		} else if($type == "css") {
			echo '<link href="stylesheets/'.$file.'" rel="stylesheet" />';
		}
	}
?>
<!DOCTYPE HTML>
<html class='no-js' manifest='/manifest.php'>
<head>
	<meta charset="utf-8">
	<meta http-equiv="content-type" content="text/html; charset=utf-8"> 
	<meta name="ROBOTS" content="NOINDEX, NOFOLLOW, NOARCHIVE">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	
	<title>Steampunk Wars Test Server</title>
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
		insertScript("Fort","css");
		insertScript("IN","css");
		insertScript("league","css");
		insertScript("login","css");
		insertScript("mine","css");
		insertScript("MS","css");
		insertScript("messages","css");
		insertScript("prog","css");
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
		insertScript("modernizr-2.0","js");
	?>
</head>
<?php flush(); ?>
<body>
	<div id='quest_box' class='metalFrame'>
		<div id='quest_titlebar'>
			<div id='quest_status'></div>
			<span>Quest Dialog</span>
			<div id='quest_close' class='closeButton'></div>
		</div>
		<div id='quest_text'></div>
		<div id='quest_leave' class='bigButton'>Leave Quest</div>
	</div>
	<div id='console_box'>
		<div id='console_titlebar'>
			<div class='closeButton' id='console_close'></div>
			<span>Output Window</span>
		</div>
		<div id='console_output'>
		<p class='output'>This window can be moved by holding the left mouse button down on the titlebar and dragging.</p>
		<p class='output'>For more information on <span class='error'>errors</span>, please stop by our <a href="http://forum.aiwars.org/" id="forum" target="_forum">forum</a> or <a href="http://getsatisfaction.com/battlehard_games" id="forum" target="_getSat">GetSatisfaction page</a>.</p> 
		</div>
		<div id='console_expandBox'>
			<input type='checkbox' id='console_expand' /><label for='console_expand'> Expand</label>
		</div>
		<div id='console_stopBox'>
			<input type='checkbox' id='console_stop' /><label for='console_stop'> Freeze Output</label>
		</div>
		<div id='output_clear'></div>
	</div>
	<!-- Chatbox -->
	<div id="chatbox_tab" class='sideButton'>CHATBOX</div>
	<div id='chat_box'>
		<div id='chat_titlebar'>
			<div class='closeButton' id='chat_close'></div>
			<span>Chatbox</span>
		</div>
		<div id='chat_innerbox'></div>
	</div>
	<!-- Twitter -->
	<div id="twitter_tab" class='sideButton'>TWITTER</div>
	<div id='twitter_box'>
		<div class='closeButton' id='twitter_close'></div>
		<script src="http://widgets.twimg.com/j/2/widget.js"></script>
		<script>
			new TWTR.Widget({
			  version: 2,
			  type: 'profile',
			  rpp: 4,
			  interval: 6000,
			  width: 230,
			  height: 320,
			  theme: {
				shell: {
				  background: 'transparent',//'#f64200'
				  color: '#A9A098',
				  font: '11pt "Trajan Pro", Trajan, serif',
				  "text-shadow":"0 1px 1px rgba(0,0,0,0.8), 0 -1px 0 rgba(255,255,255,0.3)"
				},
				tweets: {
				  background: 'rgba(0,0,0,0.5)',
				  color: '#fff',
				  links: '#ccc'
				}
			  },
			  features: {
				scrollbar: false,
				loop: false,
				live: true,
				hashtags: false,
				timestamp: true,
				avatars: true,
				behavior: 'all'
			  }
			}).render().setUser('BattlehardGames').start();
		</script>
	</div>
	<!-- Forum -->
	<a id="forum_tab" class='sideButton' href="http://forum.aiwars.org" target='_forum'>FORUM</a>
	<!-- Blog -->
	<a id="blog_tab" class='sideButton' href="http://blog.aiwars.org" target='_blog'>BLOG</a>
	<!-- Client -->
	<div id="content">
		<div id="client">
			<ul id="toplinks">
				<li id="citybox"><a href="javascript:;" id="cityname"></a><a href="javascript:;" id="citydropdown"></a></li>
				<li id="wm"></li>
				<li id="sr"><div class='flicker'></div></li>
				<li id="mailbox"><div class='flicker'></div></li>
			</ul>
			<ul id="townlist"></ul>
			<ul id="resourcebar">
				<li id="steel"><span class='value'>&nbsp;</span><div class='bar'></div></li>
				<li id="wood"><span class='value'>&nbsp;</span><div class='bar'></div></li>
				<li id="synth"><span class='value'>&nbsp;</span><div class='bar'></div></li>
				<li id="food"><span class='value'>&nbsp;</span><div class='bar'></div></li>
			</ul>
			<div id="menu"></div>
			<div id="dropdown_menu">
				<ul>
					<li id="refresh">Refresh</li>
					<li id="support">Support</li>
					<li id="premium">Premium</li>
					<li id="options">Options</li>
					<li id="tutorial">Tutorial</li>
					<li id="forum"> <a href="http://battlehardalpha.xtreemhost.com/" target="_forum">Forum</a></li>
					<li id="logout">Logout</li>
				</ul>
			</div>
			<div id='viewerback'></div>
			<div id="clientview">
				<div id="attacklist" class='metalFrame' style='display: none;'>
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
				<div id='town_infobar'>
					<div id='town_warehouseMenu'>
						<div id='town_metalInfo'>
							<div class='capacityBarBorder'><div class='capacityBar'></div></div>
							<div class='rph'></div>
						</div>
						<div id='town_timberInfo'>
							<div class='capacityBarBorder'><div class='capacityBar'></div></div>
							<div class='rph'></div>
						</div>
						<div id='town_crystalInfo'>
							<div class='capacityBarBorder'><div class='capacityBar'></div></div>
							<div class='rph'></div>
						</div>
						<div id='town_foodInfo'>
							<div class='capacityBarBorder'><div class='capacityBar'></div></div>
							<div class='rph'></div>
						</div>
					</div>
				</div>
				<div id="window"></div>
			</div>
			<div id='rank_back'>
				<div id='rankings'></div>
			</div>
			<ul id="bottomlinks">
				<li id="IO"></li>
				<li id="console"></li>
				<li id='League' title="View League Page"></li>
				<li id='Quests' title="View Quests"></li>
				<li id="CS" title="Go to Headquarters"></li>
				<li id="EVE" title="rEVElations AI"></li>
			</ul>
		</div>
	</div>
	<div id="preload"></div>
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
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
		//insertScript("global_UTCC","js");
		//building files
		insertScript("buildings","js");
		insertScript("AF","js");
		insertScript("AP","js");
		insertScript("bnkr","js");
		insertScript("CC","js");
		insertScript("IN","js");
		insertScript("Fort","js");
		insertScript("MS","js");
		insertScript("RC","js");
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
		insertScript("premium","js");
		insertScript("quest", "js");
		insertScript("rank","js");
		insertScript("support","js");
		insertScript("towns","js");
		insertScript("tutorial","js");
		insertScript("worldmap","js");
		//midend files
		insertScript("login","js");
		insertScript("utilities","js");
		insertScript("raids","js");
		insertScript("prog","js");
		insertScript("ace/ace","js");
		insertScript("ace/mode-java","js");
		insertScript("ace/theme-all","js");

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
	<script src="http://s3.amazonaws.com/getsatisfaction.com/javascripts/feedback-v2.js" type="text/javascript"></script>
	<script type="text/javascript" charset="utf-8">
		var feedback_widget_options = {
										display : "overlay",
										company : "battlehard_games",
										placement : "left",
										color : "#222",
										style : "question"
										};
		var feedback_widget = new GSFN.feedback_widget(feedback_widget_options);
	</script>
</body>
</html>