var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./SensorData.db');



var self = module.exports = {

    getMotionData: function () {

        var myQuery = "SELECT MT_VAL,strftime('%H:%M', DATECREATED) AS DATECREATED FROM MOTION_SENSOR WHERE DATECREATED >= '" + jAction + "' AND DATECREATED <= DATETIME('" + jAction + "','+1 day') ORDER BY DATECREATED ASC;";

        var timeArray = [];
        var motionArray = [];
        try {
            await db.each(myQuery, function (err, row) {
                timeArray.push(row.DATECREATED);
                motionArray.push(row.MT_VAL);
            }, function (err, rows) { //callback for completion of .each method
                res.send({ data: JSON.stringify([motionArray, timeArray]) });
            });
        } catch (err) { console.log("DB ERROR :getMotionData: " + err); }
    }

}
