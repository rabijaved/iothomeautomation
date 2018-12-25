const fs = require('fs');

const express = require('express');
const Gpio = require('onoff').Gpio;
const app = express();
const port = process.env.PORT || 5000;

//set up switches
const switch1 = new Gpio(14, 'out');
const switch2 = new Gpio(15, 'out');
const switch3 = new Gpio(17, 'out');
const switch4 = new Gpio(18, 'out');

var myTemperature = 0;
var myHumidity = 0;

function getDHT11Reading(){

	var contents = fs.readFileSync('dht11_output', 'utf8');

	var res = contents.split(",");

	myTemperature = res[1];
	myHumidity = res[0];

}


function logReadings10Seconds() {

    setTimeout(() => {

	getDHT11Reading();
        logReadings10Seconds();

    }, 10000)

}


function getState(sName){

	var sState = 'false';

        switch(sName) {
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
  var switchName = req.query['switchName'];
  var switchState = req.query['switchState'];
  var switchAction = req.query['switchAction'];

  console.log(switchAction+': Recieved trigger for: ' + switchName + ' ,State: ' + switchState);

  if(switchAction == "set") setSwitch(switchState, switchName);
  else if(switchAction == "get") switchState = getState(switchName);

  res.send({ switchState: switchState, switchName: switchName });
});
