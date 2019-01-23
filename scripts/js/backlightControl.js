const rpiBacklight = require('rpi-backlight');
const Gpio = require('onoff').Gpio;

const motionSensorGpio = new Gpio(25, 'in');
const backlightOnDUration = 120; // 120 x 500 = 1 minute
const backlightMaxBrightness = 40;
const backlightMinBrightness = 8;
const backlightEaseDuration = 45;

var backlightState = 0;
var backlightLock = 0;

module.exports = {
//Entry point to backlight control
    piBacklightControlInitialize : function(){
        
        rpiBacklight.isPoweredOn().then((powerStatus) => {
        if(powerStatus) { 
            backlightState = 1;
            rpiBacklight.setBrightness(backlightMaxBrightness);
        }
        });
        piBacklightControl();
    }
};

function easeInDisplayOn(){
	if (backlightLock == 0 ){
		backlightLock = 1;
		rpiBacklight.powerOn();
		easeInDisplayOnWrapper(backlightMinBrightness);
	}
}

function easeInDisplayOnWrapper(timerCounter){
	
	setTimeout(() => {
		rpiBacklight.setBrightness(timerCounter);
		if(timerCounter >= backlightMaxBrightness) {
			backlightLock = 0;
			backlightState = 1;
			return;
		}
		timerCounter++;
		
		easeInDisplayOnWrapper(timerCounter);
		
	}, backlightEaseDuration);
}


function easeOutDisplayOff(){
	
	if (backlightLock == 0 ){
		backlightLock = 1;
		easeOutDisplayOffWrapper(backlightMaxBrightness - 1);
	}
}


function easeOutDisplayOffWrapper(timerCounter){
	
	setTimeout(() => {
	
		rpiBacklight.setBrightness(timerCounter);
		if(timerCounter <= backlightMinBrightness) {
			rpiBacklight.powerOff();
			backlightLock = 0;
			return
		};
		timerCounter--;
		easeOutDisplayOffWrapper(timerCounter);
		
	}, backlightEaseDuration);
}


function piBacklightControl(){

	setTimeout(() => {

		var motionSensor = motionSensorGpio.readSync();
		if(motionSensor === 1) {
			rpiBacklight.isPoweredOn().then((powerStatus) => {
			if(!powerStatus) {
					console.log("Turning on screen backlight");
					easeInDisplayOn();}
			}); 
		}else{
			if(backlightState != 0) backlightState++;
			if(backlightState >=backlightOnDUration) {
				rpiBacklight.isPoweredOn().then((powerStatus) => {
					if(powerStatus) {
					console.log("Turning off screen backlight");
					easeOutDisplayOff();
					}
				});
			}	
		}
		
		piBacklightControl();
	
 	}, 500);
}

