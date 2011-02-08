function draw_support_UI() {
	$("#window").html("	<div id='support_outerbox'>\
							<div class='darkFrameBody'>\
								<div id='gsfn_search_widget'>\
									<a href='http://getsatisfaction.com/battlehard_games'class='widget_title'>People-Powered Customer Service for Battlehard Games</a>\
									<div class='gsfn_content'>\
										<form accept-charset='utf-8' action='http://getsatisfaction.com/battlehard_games' id='gsfn_search_form' method='get' onsubmit='gsfn_search(this); return false;'>\
											<div>\
												<input name='style' type='hidden' value='idea' />\
												<input name='limit' type='hidden' value='10'/>\
												<input name='utm_medium' type='hidden' value='widget_search' />\
												<input name='utm_source' type='hidden' value='widget_battlehard_games' />\
												<input name='callback' type='hidden' value='gsfnResultsCallback' />\
												<input name='format' type='hidden' value='widget' />\
												<label class='gsfn_label' for='gsfn_search_query'>Ask a question, share an idea, or report a problem.</label>\
												<input id='gsfn_search_query' maxlength='120' name='query' type='text' value='' />\
												<input id='continue' type='submit' value='Continue' />\
											</div>\
										</form>\
										<div id='gsfn_search_results'></div>\
									</div>\
									<div class='powered_by'>\
										<a href='http://getsatisfaction.com/'><img alt='Burst16' src='http://getsatisfaction.com/images/burst16.png' style='vertical-align: middle;' /></a>\
										<a href='http://getsatisfaction.com/'>Get Satisfaction support network</a>\
									</div>\
								</div>\
								<script src='http://getsatisfaction.com/battlehard_games/widgets/javascripts/2d10a25fed/widgets.js' type='text/javascript'></script>\
							</div>\
							<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
								<!--<h1>Simple Support Request Form</h1>\
								<div id='support_textBox'>\
									<div class='textFramed'>\
										<div id='support_error'></div>\
										<label for='support_email'>Contact Email:</label><input type='email' id='support_email' />\
										<select id='support_problemType'>\
											<option disabled='disabled'>Select Issue Type:</option>\
											<option disabled='disabled'>------------------</option>\
											<option>Support Request</option>\
											<option>Bug Report</option>\
											<option>Feedback</option>\
										</select>\
										<textarea id='support_description'>\nPlease Describe the problem.  Be as descriptive as possible.</textarea>\
										<div id='support_submit'></div><div id='support_help' class='help'></div>\
										<span id='support_notes'>Notes:<br/>Bug reports will be posted to the Bug Tracker section of the AI Wars <a href='http://battlehardalpha.xtreemhost.com/' target='_forum'>forum</a>.\
												If you've already done so, you may omit the description so long as you supply a URL pointing to the post.  Only direct links please, no tinyURLs.</span>\
									</div>\
									<div class='textFrameBL'><div class='textFrameBR'><div class='textFrameB'></div></div></div>\
								</div>-->\
						</div>").fadeIn();
	
	$("#support_submit").unbind("click").click(function(){
		display_output(false,"Sending message to support....");
		var user = player.username || "Anonymous";
		var email = ($("#support_email").val() != "")?$("#support_email").val():"support@aiwars.org";
		if($("#support_problemType :selected").index("#support_problemType option") > 1) {
			$("#support_error").html("");
			var sendMessage = new make_AJAX();
			sendMessage.callback = function(response) {
						if(!response.match(/false/)) {
							$("#support_error").addClass("success").html("Message sent");
							display_output(false,"Message Sent!");
						} else {
							$("#support_error").removeClass("success").html("Message sent");
							display_output(true,"Message Send Failed!");
						}
					};
			sendMessage.get("/AIWars/GodGenerator?reqtype=support&message="+$("#support_description").val()
							+"&subject="+$("#support_problemType").val()+" from "+user+"&email="+email);
		}
		else $("#support_error").removeClass("success").html("Please Select an Issue Type");
	});
	
	$(".help").unbind("click").click(function(){
		display_message("Support","Should you encounter problems using this form, you may send an email directly to support using the email address support@aiwars.org.");
	});
}