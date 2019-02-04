//Set up database
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./SensorData.db'); 


/*
ALTER TABLE DHT11 ADD AMBLIGHT INT;
UPDATE DHT11 SET AMBLIGHT = 0;
ALTER TABLE DHT11 RENAME TO AL_DHT11;
*/

function LogtoDatabase(alight, temp, humid){

    try{
    db.run("INSERT INTO AL_DHT11(AMBLIGHT,TEMP, HUMID,DATECREATED) VALUES (" + alight+","+temp+","+humid+",datetime('now','localtime'))");  
    }catch(err){console.log(err);}

}


var self=module.exports = {
	tempReading: 0,
	humidReading: 0,
	ambientLightReading: 0,
	setMcuLhtData: function(data){
		var dataArray = data.split("|");
		self.tempReading = dataArray[1];
		self.humidReading=dataArray[2];
		self.ambientLightReading=dataArray[0];
		LogtoDatabase(dataArray[0], dataArray[1], dataArray[2]);
		
	},
	initalizeReadings: function(){
		var myQuery = "SELECT AMBLIGHT,TEMP, HUMID,DATECREATED FROM AL_DHT11 ORDER BY DATECREATED DESC LIMIT 1 ;";
		try{
		db.each(myQuery, function(err, row) {
            self.ambientLightReading= row.AMBLIGHT;
            self.tempReading = row.TEMP;
            self.humidReading=row.HUMID;
        });
		}catch(err){
			console.log(err);
		}
	},
    getAmbLightData:async function (jAction,res){


        var myQuery = "SELECT AMBLIGHT,strftime('%H:%M', DATECREATED) AS DATECREATED FROM AL_DHT11 WHERE DATECREATED >= '" + jAction +"' AND DATECREATED <= '" + jAction +"' ORDER BY DATECREATED ASC;";

        var timeArray =[];
        var lightArray =[];

        await db.each(myQuery, function(err, row) {
            timeArray.push(row.DATECREATED);
            lightArray.push(row.AMBLIGHT);
        }, function(err, rows){ //callback for completion of .each method
            res.send({ data: JSON.stringify([lightArray,timeArray]) });
        });
    },
    getDHT11Data:async function (jAction,res){

        if(jAction == '' || jAction == null) return [];

        var myQuery = "SELECT TEMP,HUMID,DATECREATED FROM AL_DHT11";

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
}
