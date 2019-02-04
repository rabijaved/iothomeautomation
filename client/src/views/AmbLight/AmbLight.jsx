







class AmbLight extends Component {

  constructor() {
    super();
    this.state = {myTemp: 0,myHumid: 0, anchorEl: null,open: false, periodSelected: 'Day', temperatureData: {labels: [],series: []}, humidityData: {labels: [],series: []}};
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  componentDidMount(){
    this.postToServer('dht11');
    this.postToServer('dht11graph');
    this.logReadings1Minute();
  }
  
  componentWillUnmount() {
    this.isCancelled = true;
  }



  // ##############################
  // // // AJAX POST
  // #############################
  
  
  postToServer(jname){
    
      this.callBackendAPI(jname,this.state.periodSelected)
      .then(res => !this.isCancelled && this.setState({temperatureData: {
	  labels: JSON.parse(res.data)[2]
	  ,series: [
	    JSON.parse(res.data)[0]
	  ]
	},humidityData: {
	  labels: JSON.parse(res.data)[2]
	  ,series: [
	    JSON.parse(res.data)[1]
	  ]
	}}))
      .catch(err => console.log(err));
    
  }
  
  callBackendAPI = async (jname,jstate) => {
    
    var getUrl = '/express_backend?jname='+jname + '&jstate='+jstate+'&jaction=get';
    const response = await fetch(getUrl,{method: 'get', 
	   headers: new Headers({
		 'Authorization': btoa('0e3cbac3-d0dc-47ab-96aa-2785b0557346'), 
		 'Content-Type': 'application/x-www-form-urlencoded'
	   })});
    
    var body;
    if (response.status === 200) {
      
      body = await response.json();
      
    }else
    {
      if(jname === 'dht11') body = {jstate: '0,0'};
      else if (jname === 'dht11graph') body = {};
    }
    return body;
  };
  
  logReadings1Minute() {

    setTimeout(() => {
      
      this.postToServer('amblightgraph');

      this.logReadings1Minute();
      
    }, 60000)
    
  };

}