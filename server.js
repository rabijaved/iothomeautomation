const fs = require('fs');

const express = require('express');
const Gpio = require('onoff').Gpio;
const app = express();
const port = process.env.PORT || 5000;

//Set up database
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./SensorData.db'); 

//set up switches
const switch1 = new Gpio(14, 'out');
const switch2 = new Gpio(15, 'out');
const switch3 = new Gpio(17, 'out');
const switch4 = new Gpio(18, 'out');

var myTempHum = '';
var setDbDelay = 0;

function getDHT11Reading(){

	myTempHum = fs.readFileSync('dht11_output', 'utf8');

}


function logReadings10Seconds() {

    setTimeout(() => {

	getDHT11Reading();

	if(setDbDelay >= 90) {

		var tem = myTempHum.split(",");

		db.run("INSERT INTO DHT11(TEMP, HUMID,DATECREATED) VALUES (" + tem[1]+ "," + tem[0]+ ",datetime('now','localtime'))");  

		setDbDelay = 0;
	}

	setDbDelay++;
	logReadings10Seconds();

    }, 10000)

}


function getState(sName){

	var sState = 'false';

        switch(sName) {
          case 'dht11':
            sState = myTempHum;
          	break;
          case 'switch1':
            if(switch1.readSync() == 1) sState = 'true';
            break;
          case 'switch2':
            if(switch2.readSync() == 1) sState = 'true';
            break;
          case 'switch3':
            if(switch3.readSync() == 1) sState = 'true';
            break;
          case 'switch4':
	    if(switch4.readSync() == 1) sState = 'true';
            break;
        }

	return sState;
}


function setSwitch(sState, sName){

	switch(sName) {
	  case 'switch1':
	    if(sState == 'true') switch1.writeSync(1);
	    else switch1.writeSync(0);
	    break;
	  case 'switch2':
	    if(sState == 'true') switch2.writeSync(1);
	    else switch2.writeSync(0);
	    break;
	  case 'switch3':
	    if(sState == 'true') switch3.writeSync(1);
	    else switch3.writeSync(0);
	    break;
	  case 'switch4':
	    if(sState == 'true') switch4.writeSync(1);
	    else switch4.writeSync(0);
	    break;
	}

}


logReadings10Seconds();
// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  var jName = req.query['jname'];
  var jState = req.query['jstate'];
  var jAction = req.query['jaction'];

  console.log(jAction+': Recieved trigger for: ' + jName + ' ,State: ' + jState);

  if(jAction == "set") setSwitch(jState, jName);
  else if(jAction == "get") jState = getState(jName);

  res.send({ jstate: jState, jname: jName });
});
