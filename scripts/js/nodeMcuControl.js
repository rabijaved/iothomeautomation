//Set up database
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./SensorData.db'); 


function LogDHT11toDatabase(alight, temp, humid){

    try{
    db.run("INSERT INTO AL_DHT11(AMBLIGHT,TEMP, HUMID,DATECREATED) VALUES (" + alight+","+temp+","+humid+",datetime('now','localtime'))");  
    }catch(err){console.log("DB ERROR 10: " + err);}
    finally{
        return;
    }
}


function LogPlanttoDatabase(plantData){

    try{
    db.run("INSERT INTO PL_NODE1(SL_HUM,DATECREATED) VALUES (" + plantData+",datetime('now','localtime'))");  
    }catch(err){console.log("DB ERROR 21: " + err);}
    finally{
        return;
    }
}

var self=module.exports = {
	tempReading: 0,
	humidReading: 0,
	ambientLightReading: 0,
    plantNode1Data: 0,
    setMcuPlantData: function(data){
        self.plantNode1Data = data;
        LogPlanttoDatabase(data);
    },
	setMcuLhtData: function(data){
		var dataArray = data.split("|");
		self.tempReading = dataArray[1];
		self.humidReading=dataArray[2];
		self.ambientLightReading=dataArray[0];
		LogDHT11toDatabase(dataArray[0], dataArray[1], dataArray[2]);
		
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


        var myQuery = "SELECT (1024 - AMBLIGHT) AS AMBLIGHT,strftime('%H:%M', DATECREATED) AS DATECREATED FROM AL_DHT11 WHERE DATECREATED >= '" + jAction +"' AND DATECREATED <= DATETIME('" + jAction +"','+1 day') ORDER BY DATECREATED ASC;";

        var timeArray =[];
        var lightArray =[];
        try{
            await db.each(myQuery, function(err, row) {
                timeArray.push(row.DATECREATED);
                lightArray.push(row.AMBLIGHT);
            }, function(err, rows){ //callback for completion of .each method
                res.send({ data: JSON.stringify([lightArray,timeArray]) });
            });
        }catch(err){console.log("DB ERROR 70: " + err);}
    },
    getDHT11Data:async function (jAction,res){

        if(jAction == '' || jAction == null) return [];

        var myQuery = "SELECT TEMP,HUMID,strftime('%H:%M', DATECREATED) AS DATECREATED FROM AL_DHT11 WHERE DATECREATED >= '" + jAction +"' AND DATECREATED <= DATETIME('" + jAction +"','+1 day') ORDER BY DATECREATED ASC;";

        var timeArray =[];
        var tempArray =[];
        var humArray =[];
        try{
            await db.each(myQuery, function(err, row) {
                timeArray.push(row.DATECREATED);
                tempArray.push(row.TEMP);
                humArray.push(row.HUMID);
            }, function(err, rows){ //callback for completion of .each method
                res.send({ data: JSON.stringify([tempArray,humArray,timeArray]) });
            });
        }catch(err){console.log("DB ERROR 88: " + err);}
    },
    getPlantData:async function (jAction,res){

        if(jAction == '' || jAction == null) return [];

        var myQuery = "SELECT (1024 - SL_HUM) AS SL_HUM,strftime('%H:%M', DATECREATED) AS DATECREATED FROM PL_NODE1 WHERE DATECREATED >= '" + jAction +"' AND DATECREATED <= DATETIME('" + jAction +"','+1 day') ORDER BY DATECREATED ASC;";

        var timeArray =[];
        var p1Array =[];
        try{
            await db.each(myQuery, function(err, row) {
                timeArray.push(row.DATECREATED);
                p1Array.push(row.SL_HUM);
            }, function(err, rows){ //callback for completion of .each method
                res.send({ data: JSON.stringify([p1Array,timeArray]) });
            });
        }catch(err){console.log("DB ERROR 104: " + err);}
    }
}
