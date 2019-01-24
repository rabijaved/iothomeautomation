const fs = require('fs');

//Set up database
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./SensorData.db'); 

var myTempHum = '';
var setDbDelay = 0;
const dh11FilePath = './bin/dht11_output';


var self=module.exports = {

	tempHumidCache: '',
    pollLogDht11: function() {

	  setTimeout(() => {

			myTempHum = fs.readFileSync(dh11FilePath, 'utf8');
			self.tempHumidCache = myTempHum;
				if(setDbDelay >= 90) {

					var tem = myTempHum.split(",");
					db.run("INSERT INTO DHT11(TEMP, HUMID,DATECREATED) VALUES (" + tem[1]+ "," + tem[0]+ ",datetime('now','localtime'))");  
					setDbDelay = 0;
				}

			setDbDelay++;
			self.pollLogDht11();

	  }, 10000)

	},
    getDHT11Data:async function (jAction,res){

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
};

