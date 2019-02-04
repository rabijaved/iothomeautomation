var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('./SensorData.db'); 




var self=module.exports = {

    getMotionData:async function (jAction,res){

        if(jAction == '' || jAction == null || jAction.length > 10) return [];

        var myQuery = "SELECT MT_VAL,DATECREATED FROM MOTION_SENSOR WHERE DATECREATED >= '" + jAction +"' ORDER BY DATECREATED ASC;";

        var timeArray =[];
        var motionArray =[];

        await db.each(myQuery, function(err, row) {
            timeArray.push(row.DATECREATED);
            motionArray.push(row.MT_VAL);
        }, function(err, rows){ //callback for completion of .each method
            res.send({ data: JSON.stringify([motionArray,timeArray]) });
        });
    }
};
