import React, { Component } from "react";
// @material-ui/core components
// core components
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import DatePicker from 'react-date-picker';
import ChartistGraph from "react-chartist";
import "assets/css/mods.css";

// ##############################
// // // javascript library for creating charts
// #############################
var Chartist = require("chartist");



class DHT11 extends Component {
  
  constructor() {
    super();
    this.state = {myTemp: 0,myHumid: 0, periodSelected: new Date(), temperatureData: {labels: [],series: []}, humidityData: {labels: [],series: []}};
  }
  
  componentDidMount(){
    this.setState({ periodSelected:new Date() });
    this.postToServer('dht11');
    this.postToServer('dht11graph');
    this.logReadings1Minute();
  }
  
  componentWillUnmount() {
    this.isCancelled = true;
  }
  
  // ##############################
  // // // Temperature Chart
  // #############################
  

  dht11Chart= {
    options: {
      lineSmooth: Chartist.Interpolation.cardinal({
        fillHoles: false,
        tension: 1
      }),
      chartPadding: {
        top: 10,
        right: 0,
        bottom: 0,
        left: 0
      },
      height: '300px',
      showPoint: false,
      axisX: {
	 labelInterpolationFnc: function(value, index, labels) {
			 var windowWidth = window.innerWidth;
		 return (index % Math.round(labels.length/(40*(windowWidth/2100)))) === 0 ? value : null;
      },
      offset : 40
},
    }
  };
  
  // ##############################
  // // // Drop Down
  // #############################
  
 
	onDateChange = event => {
		this.setState({ periodSelected: event});
		setTimeout(() => {
			this.postToServer('dht11graph');
		}, 2000)
    };
  
  // ##############################
  // // // AJAX POST
  // #############################
  
  
  postToServer(jname){
    
    if(jname === 'dht11'){
      this.callBackendAPI(jname,'void')
      .then(res => !this.isCancelled && this.setState({myHumid: (res.jstate.split(",")[0]), myTemp: (res.jstate.split(",")[1])}))
      .catch(err => console.log(err));
    }
    else if (jname === 'dht11graph'){
      
		var today = this.state.periodSelected;
		var dd = today.getDate();
		var mm = today.getMonth() + 1; 
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

      this.callBackendAPI(jname,yyyy + '-' + mm + '-' + dd)
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
    //two types are dht11 and dht11graph
    setTimeout(() => {
      
      this.postToServer('dht11');
      this.postToServer('dht11graph');

      this.logReadings1Minute();
      
    }, 60000)
    
  }
  
  render() {
    const classes = this.props;
    return (
      <div>
          <GridContainer>
              <GridItem xs={12} sm={6} md={3}>
                  <Card>
                      <CardHeader>
                          <CardIcon color="warning">
                              <Icon>info_outline</Icon>
                          </CardIcon>
                          <span style = {{fontSize: '15px', marginBottom: '0'}}>Temperature</span>
                          <div style = {{height: '50',display: 'flex', alignItems: 'center'}}>
                              <h3 className={classes.cardTitle}>
                                  {this.state.myTemp} <small> C</small>
                              </h3>
                          </div>
                      </CardHeader>
                  </Card>
              </GridItem>
              <GridItem xs={12} sm={6} md={3}>
                  <Card>
                      <CardHeader>
                          <CardIcon color="success">
                              <Icon>info_outline</Icon>
                          </CardIcon>
                          <span style = {{fontSize: '15px', margin: '0'}}>Humidity</span>
                          <div style = {{height: '50',display: 'flex', alignItems: 'center'}}>
                              <h3 className={classes.cardTitle}>
                                  {this.state.myHumid} <small>%</small>
                              </h3>
                          </div>
                      </CardHeader>
                  </Card>
              </GridItem>
          </GridContainer>
          <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                  <Card chart>
                      <CardHeader color="warning">
			  <span></span>
                          <ChartistGraph
                          className="graphStyle"
                          data={this.state.temperatureData}
                          type="Line"
                          options={this.dht11Chart.options}
                          listener={this.dht11Chart.animation}
                          />
                      </CardHeader>
                      <CardBody>
                          <div>
                              <div style = {{fontSize: '18px',float: 'left', marginBottom: '40px'}}>
                                  <span>&nbsp;&nbsp;Temperature</span>
                              </div>
                          </div>
                      </CardBody>
		      <CardHeader color="success">
			  <span></span>
                          <ChartistGraph
                          className="graphStyle"
                          data={this.state.humidityData}
                          type="Line"
                          options={this.dht11Chart.options}
                          listener={this.dht11Chart.animation}
                          />
                      </CardHeader>
                      <CardBody>
                          <div>
                              <div style = {{fontSize: '18px', marginBottom: '20px'}}>
                                  <span>&nbsp;&nbsp;Humidity</span>
                              </div>
                              <div style = {{float: 'left', zIndex: '99', marginLeft: '15px'}}>
                                  <span style = {{fontSize: '15px', textTransform: 'capitalize'}}><b>Date:</b></span>
                                        <div>
										<DatePicker
										  onChange={this.onDateChange}
										  maxDate={new Date()}
										  value={this.state.periodSelected}
										/>
									  </div>
                              </div>
                          </div>
                      </CardBody>
                  </Card>
              </GridItem>
          </GridContainer>
      </div>
        );
      }
    }
    
    
    export default (DHT11);
