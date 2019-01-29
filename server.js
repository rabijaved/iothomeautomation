const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const backlightController = require('./scripts/js/backlightControl');
const switchController = require('./scripts/js/switchControl');
const dht11Controller = require('./scripts/js/dht11Control');
const motionController = require('./scripts/js/motionControl');





switchController.initializeSwitches(); //set all to off
backlightController.piBacklightControlInitialize(); // Motion Sensor and Backlight Control
dht11Controller.pollLogDht11(); // Temperature and Humidity Sensor Readings

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  var jName = req.query['jname'];
  var jState = req.query['jstate'];
  var jAction = req.query['jaction'];
  
  var authheader = req.headers.authorization;
  
  console.log(jAction+': Recieved trigger for: ' + jName + ' ,State: ' + jState + ' ,Token: ' + authheader);
  
  if(authheader == 'MGUzY2JhYzMtZDBkYy00N2FiLTk2YWEtMjc4NWIwNTU3MzQ2'){
	  
	  switch(jAction){
		  //---------------------------SET------------------------------
		  case "set":
			switchController.setSwitch(jState, jName,res);
			break;
		  //---------------------------GET------------------------------
		  case "get":
			switch(jName){
				case "dht11graph": 
					dht11Controller.getDHT11Data(jState,res);
					break;
				case "motiongraph":
					motionController.getMotionData(jState,res);
					break;
				default:
					jState = switchController.getState(jName,res);
					break;
			}
			break;
	  };
}
  
});
