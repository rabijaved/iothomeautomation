//Set up database
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./SensorData.db'); 


/*
ALTER TABLE DHT11 ADD AMBLIGHT INT;
UPDATE DHT11 SET AMBLIGHT = 0;
*/
function LogtoDatabase(alight, temp, humid){

    try{
    db.run("INSERT INTO DHT11(AMBLIGHT,TEMP, HUMID,DATECREATED) VALUES (" + alight+","+temp+","+humid+",datetime('now','localtime'))");  
    }catch(err){console.log(err);}

}


var self=module.exports = {

    getAmbLightData:async function (res){


        var myQuery = "SELECT AMBLIGHT,DATECREATED FROM DHT11";

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
            default :
                myQuery = "";
                break;
            }

        if ( myQuery === "") return [];
        var timeArray =[];
        var lightArray =[];

        await db.each(myQuery, function(err, row) {
            timeArray.push(row.DATECREATED);
            lightArray.push(row.AMBLIGHT);
        }, function(err, rows){ //callback for completion of .each method
            res.send({ data: JSON.stringify([lightArray,timeArray]) });
        });
    }


}