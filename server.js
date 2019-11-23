const express = require('express');
const port = 5000;


//import scripts
const backlightController = require('./scripts/js/backlightControl');
const switchController = require('./scripts/js/switchControl');
const motionController = require('./scripts/js/motionControl');
const nodeMcuController = require('./scripts/js/nodeMcuControl');

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {'transports': ['websocket', 'polling']});


//Initialize
switchController.initializeSwitches(); //set all to off
nodeMcuController.initalizeReadings();
backlightController.piBacklightControlInitialize(); // Motion Sensor and Backlight Control


// WebSocket handlers
io.on('connection', (client) => {


    console.log('Websocket: New connection from'+ client.request.connection.remoteAddress);
  
  
    client.on('setSwitchState', function (data, fn) {
		console.log('set: Recieved trigger for: ' + data['jname'] + ' ,State: ' + data['jstate'] + ', Websocket');
		switchController.setSwitch(data['jname'],data['jstate']);
		fn(data['jstate']);
		client.broadcast.emit('setServerUpdate',data);
    });
  
	client.on('getServerSwitchState', function (switchName, fn) {
	
		console.log('get: Recieved trigger for: ' + switchName + ', Websocket');
		fn(switchController.getSwitchState(switchName));
		
	});
	  
  
	client.on('disconnect', () => {
		console.log('user disconnected');
	})






// HTTP GET route handler
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
			}
			break;
		  //---------------------------GET------------------------------
		  case "get":
			switch(jName){
				case "dht11": 
					nodeMcuController.getDHT11Data('max', res);
					break;
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
			}
			break;
	  };
} else if (jToken == "MGUzY2JhYzMtZDBkYy00N2FiLTk2YWEtMjc4NWIwNTU3MzQ2"){ 
	//This request is from the GoogleHome IFTTT
	//It does not support authHeader token so handle it seperately
    console.log(jAction+': Recieved trigger for: ' + jName + ' ,State: ' + jState + ' ,Token: googleAssistant');
	if(jAction == "set" && jName.match(/switch.*/)){
		if(jState.toLowerCase().trim() == "on") jState = false;
		else if (jState.toLowerCase().trim() == "off") jState = true;
		
		switchController.setSwitch(jName,jState);
		
			var sendata = {
		jname: jName,
		jstate: jState
	};
		
		client.broadcast.emit('setServerUpdate',sendata);
	}
}
  
});

});

// console.log that your server is up and running
server.listen(port, () => console.log(`Listening on port ${port}`));

