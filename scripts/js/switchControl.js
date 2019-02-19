const Gpio = require('onoff').Gpio;
const nodeMcuController = require('./nodeMcuControl');


//set up switches
const switch1 = new Gpio(14, 'out');
const switch2 = new Gpio(15, 'out');
const switch3 = new Gpio(17, 'out');
const switch4 = new Gpio(18, 'out');



module.exports = {

    initializeSwitches:function(){

        switch1.writeSync(1);
        switch2.writeSync(1);
        switch3.writeSync(1);
        switch4.writeSync(1);

    },
    getState: function(sName,res){


        var sState = 'false';

            switch(sName) {
            case 'dht11':
                sState = Math.round( nodeMcuController.humidReading * 10 )/10 + ',' + Math.round( nodeMcuController.tempReading * 10 )/10;
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
    },



    setSwitch:function (sState, sName, res){

        switch(sName) {
        case 'switch1':
            if(sState == 'true') switch1.writeSync(1);
            else if(sState == 'false') switch1.writeSync(0);
            break;
        case 'switch2':
            if(sState == 'true') switch2.writeSync(1);
            else if(sState == 'false') switch2.writeSync(0);
            break;
        case 'switch3':
            if(sState == 'true') switch3.writeSync(1);
            else if(sState == 'false') switch3.writeSync(0);
            break;
        case 'switch4':
            if(sState == 'true') switch4.writeSync(1);
            else if(sState == 'false') switch4.writeSync(0);
            break;
        }

        res.send({ jstate: sState, jname: sName });
    }
};
