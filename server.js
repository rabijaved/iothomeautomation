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

async function getDHT11Data(jAction,res){

	if(jAction == '' || jAction == null) return [];

	var myQuery = "SELECT TEMP,HUMID,DATECREATED FROM DHT11";

        switch(jAction) {
          case 'Day':
		myQuery = myQuery + " WHERE DATECREATED > DATETIME('now','localtime','-1 day')";
          	break;
          case 'Week':
		myQuery = myQuery + " WHERE DATECREATED > DATETIME('now','localtime','-7 day')";
                break;
          case 'Month':
		myQuery = myQuery + " WHERE DATECREATED > DATETIME('now','localtime','-1 month')";
            break;
          case 'Year':
		myQuery = myQuery + " WHERE DATECREATED > DATETIME('now','localtime','-1 year')";
                break;
          case 'All':
                break;
        }
	var timeArray =[];
	var tempArray =[];
	var humArray =[];

	await db.each(myQuery, function(err, row) {
		timeArray.push(row.DATECREATED);
		tempArray.push(row.TEMP);
		humArray.push(row.HUMID);
	}, function(err, rows){ //callback for completion of .each method
		res.send({ data: JSON.stringify([tempArray,humArray,timeArray]) });
	});

	
}


function getState(sName,res){

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

	res.send({ jstate: sState, jname: sName });
}


function setSwitch(sState, sName,res){

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

	res.send({ jstate: sState, jname: sName });

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

  if(jAction == "set") setSwitch(jState, jName,res);
  else if(jAction == "get") {
	if(jName === "dht11graph") getDHT11Data(jAction,res);
	else jState = getState(jName,res);
  
}

  
});
