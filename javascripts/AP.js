function AP_UI(bldgInfo) {
	
}

/*
	numPpl is the current amount of fuel in the appCodeName
	refuelTimer is the amount of time, in GCF ticks, until the next fuel cell is added to a docked Airship
	
	createAirship(String airshipName, int townID)  townID is the ID of the town to build the Airship in (the current town)
	
	
	Display:
		Current fuel, fuel capacity, and time until the next fuel cell is created is shown in the upper left corner
		In the lower right corner will be an area showing the airship docked at that town, if any
			Shows name of Airship
			Current fuel on the airship
			Time until next fuel cell is added (refuelTimer)
			Resources on the Airship
*/