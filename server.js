const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//import scripts
const backlightController = require('./scripts/js/backlightControl');
const switchController = require('./scripts/js/switchControl');
const motionController = require('./scripts/js/motionControl');
const nodeMcuController = require('./scripts/js/nodeMcuControl');

//Initialize
switchController.initializeSwitches(); //set all to off
nodeMcuController.initalizeReadings();
backlightController.piBacklightControlInitialize(); // Motion Sensor and Backlight Control

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  var jName = req.query['jname'];
  var jState = req.query['jstate'];
  var jAction = req.query['jaction'];
  var jToken = req.query['jtoken'];
  
  var authheader = req.headers.authorization;
  
  
  //basic auth
  if(authheader == 'MGUzY2JhYzMtZDBkYy00N2FiLTk2YWEtMjc4NWIwNTU3MzQ2'){
	  console.log(jAction+': Recieved trigger for: ' + jName + ' ,State: ' + jState + ' ,Token: ' + authheader);
	  switch(jAction){
		  //---------------------------SET------------------------------
		  case "set":
			switch(jName){
				case "mculht":
					nodeMcuController.setMcuLhtData(jState);
					break;
				case "mcuplant":
					nodeMcuController.setMcuPlantData(jState);
					break;
				default:
					switchController.setSwitch(jState, jName,res);
					break;
			}
			break;
		  //---------------------------GET------------------------------
		  case "get":
			switch(jName){
				case "dht11graph": 
					nodeMcuController.getDHT11Data(jState,res);
					break;
				case "motiongraph":
					motionController.getMotionData(jState,res);
					break;
				case "amblightgraph":
					nodeMcuController.getAmbLightData(jState,res);
					break;
				case "mcuplantgraph_1":
					nodeMcuController.getPlantData(jState,res);
					break;
				default:
					jState = switchController.getState(jName,res);
					break;
			}
			break;
	  };
} else if (jToken == "MGUzY2JhYzMtZDBkYy00N2FiLTk2YWEtMjc4NWIwNTU3MzQ2"){ 
	//This request is from the GoogleHome IFTTT
	//It does not support authHeader token so handle it seperately
    console.log(jAction+': Recieved trigger for: ' + jName + ' ,State: ' + jState + ' ,Token: googleAssistant');
	if(jAction == "set" && jName.match(/switch.*/)){
		if(jState.toLowerCase().trim() == "on") jState = "false";
		else if (jState.toLowerCase().trim() == "off") jState = "true";
		
		switchController.setSwitch(jState, jName,res);
	}
}
  
});
