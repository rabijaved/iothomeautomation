const rpiBacklight = require('rpi-backlight');
const Gpio = require('onoff').Gpio;
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./SensorData.db');

const motionSensorGpio = new Gpio(25, 'in');
const backlightOnDUration = 120; // 120 x 500 = 1 minute
const backlightMaxBrightness = 40;
const backlightMinBrightness = 8;
const backlightEaseDuration = 45;

var backlightState = 0;
var backlightLock = 0;
const dbWriteDelay = 60; //60 x 500 = 30000 ms = 30 s
var wrtieDelayCounter = 0;
var writeDelayValue = 0;

var self = module.exports = {
	//Entry point to backlight control
	piBacklightControlInitialize: function () {

		rpiBacklight.isPoweredOn().then((powerStatus) => {
			if (powerStatus) {
				backlightState = 1;
				rpiBacklight.setBrightness(backlightMaxBrightness);
			}
		});
		piBacklightControl();
	}
};

function easeInDisplayOn() {
	if (backlightLock == 0) {
		backlightLock = 1;
		rpiBacklight.powerOn();
		easeInDisplayOnWrapper(backlightMinBrightness);
	}
}

function easeInDisplayOnWrapper(timerCounter) {

	setTimeout(() => {
		rpiBacklight.setBrightness(timerCounter);
		if (timerCounter >= backlightMaxBrightness) {
			backlightLock = 0;
			backlightState = 1;
			return;
		}
		timerCounter++;

		easeInDisplayOnWrapper(timerCounter);

	}, backlightEaseDuration);
}


function easeOutDisplayOff() {

	if (backlightLock == 0) {
		backlightLock = 1;
		easeOutDisplayOffWrapper(backlightMaxBrightness - 1);
	}
}


function easeOutDisplayOffWrapper(timerCounter) {

	setTimeout(() => {

		rpiBacklight.setBrightness(timerCounter);
		if (timerCounter <= backlightMinBrightness) {
			rpiBacklight.powerOff();
			backlightLock = 0;
			return
		};
		timerCounter--;
		easeOutDisplayOffWrapper(timerCounter);

	}, backlightEaseDuration);
}


function piBacklightControl() {

	setTimeout(() => {

		var motionSensor = motionSensorGpio.readSync();
		if (motionSensor === 1) {
			rpiBacklight.isPoweredOn().then((powerStatus) => {
				if (!powerStatus) {
					console.log("Turning on screen backlight");
					easeInDisplayOn();
				}
			});
		} else {
			if (backlightState != 0) backlightState++;
			if (backlightState >= backlightOnDUration) {
				rpiBacklight.isPoweredOn().then((powerStatus) => {
					if (powerStatus) {
						console.log("Turning off screen backlight");
						easeOutDisplayOff();
					}
				});
			}
		}

		//log the reading with delay
		if (wrtieDelayCounter < dbWriteDelay) {
			wrtieDelayCounter++;
			if (motionSensor === 1) writeDelayValue = 1;
		}
		else if (wrtieDelayCounter >= dbWriteDelay) {
			try {
				db.run("INSERT INTO MOTION_SENSOR(MT_VAL,DATECREATED) VALUES (" + writeDelayValue + ",datetime('now','localtime'))");
			} catch (err) {
				console.log("DB ERROR :piBacklightControl: " + err);
			}
			finally {
				wrtieDelayCounter = 0;
				writeDelayValue = 0;
			}
		}
		piBacklightControl();

	}, 500);
}

