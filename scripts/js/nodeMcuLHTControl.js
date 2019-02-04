var http = require('http');

const hostAddress = 'http://192.168.1.110';
const readingInterval = 10000;



var self=module.exports = {
	dht11_temp :'',
	dht11_humid: '',
	amb_light :'',
	setMcuLhtData: function(data){
		var dataArray = data.split("|");
		self.amb_light = dataArray[0];
		self.dht11_temp = dataArray[1];
		self.amb_light = dataArray[2];
		
		
	}
	
}
