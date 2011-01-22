/**************************************************************************************************************\
************************************************Status Reports**************************************************
\**************************************************************************************************************/
var SR = {
			HTML : "<div id='SR_reports'>\
						<div class='darkFrameBody'>\
							<div id='SR_mainTabs'>\
								<a href='javascript:;' id='SR_allTab' title='Show All Reports'></a>\
								<a href='javascript:;' id='SR_attackTab' title='Show Attack Type Reports'></a>\
								<a href='javascript:;' id='SR_spyTab' title='Show Spy Reports'></a>\
								<a href='javascript:;' id='SR_supportTab' title='Show Support Reports'></a>\
								<a href='javascript:;' id='SR_archiveTab' title='Show Archived Reports'></a>\
								<a href='javascript:;' id='SR_searchTab' title='Search Through Reports (Coming Soon)'></a>\
							</div>\
							<div id='SR_window'>\
							</div>\
						</div>\
						<div class='darkFrameBL-BR-B'>\
							<div class='darkFrameBL'><div class='darkFrameBR'><div class='darkFrameB'></div></div></div>\
						</div>\
					</div>",
			attkTabs : "<div id='SR_secondaryTabs'>\
							<a href='javascript:;' id='SR_sAllTab' title='Show All Attack Type Reports'></a>\
							<a href='javascript:;' id='SR_sAttackTab' title='Show Attack Reports'></a>\
							<a href='javascript:;' id='SR_sGenocideTab' title='Show Genocide Reports'></a>\
							<a href='javascript:;' id='SR_sInvadeTab' title='Show Invasion Reports'></a>\
							<a href='javascript:;' id='SR_sStrafeTab' title='Show Strafe Reports'></a>\
							<a href='javascript:;' id='SR_sGlassTab' title='Show Glassing Reports'></a>\
						</div>\
						<div id='SR_sWindow'></div>",
			dispReports : []
		};