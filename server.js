const fs = require('fs');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const backlightController = require('./scripts/js/backlightControl');
const switchController = require('./scripts/js/switchControl');
//Set up database
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./SensorData.db'); 


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
	  default :
		myQuery = "";
		break;
        }

	if ( myQuery === "") return [];
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








switchController.initializeSwitches(); //set all to off
backlightController.piBacklightControlInitialize(); // Motion Sensor and Backlight Control

logReadings10Seconds(); // Temperature and Humidity Sensor Readings

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
  if(jAction == "set") switchController.setSwitch(jState, jName,res);
  else if(jAction == "get") {
	if(jName === "dht11graph") getDHT11Data(jState,res);
	else jState = switchController.getState(jName,res);
  
}
}
  
});
