import React, { Component } from "react";

import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import "assets/css/mods.css";
// react plugin for creating charts
import ChartistGraph from "react-chartist";

// @material-ui/core components
import DatePicker from 'react-date-picker';
var Chartist = require("chartist");


class PlantSensor_1 extends Component {

  constructor() {
    super();
    this.state = {periodSelected: new Date(), p1Data: {labels: [],series: []}};
  }
  
  componentDidMount(){
  	this.setState({ periodSelected:new Date() });
    this.postToServer('mcuplantgraph_1');
    this.logReadings1Minute();
  }
  
  componentWillUnmount() {
    this.isCancelled = true;
  }

	onDateChange = event => {
		this.setState({ periodSelected: event});
		setTimeout(() => {
			this.postToServer('mcuplantgraph_1');
		}, 2000)
    };

  // ##############################
  // // // Chart Definition
  // #############################
  
  p1Chart= {
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
      fullWidth: true,
      showPoint: false,
	  axisX: {
		 labelInterpolationFnc: function(value, index, labels) {
			 var windowWidth = window.innerWidth;
		 return (index % Math.round(labels.length/(40*(windowWidth/2100)))) === 0 ? value : null;
      },
      offset : 40
	  },axisY: {
		 labelInterpolationFnc: function(value, index, labels) {
		 return value;
      }
}
    }
  };

  // ##############################
  // // // AJAX POST
  // #############################
  

	postToServer(jname){

		if (jname === 'mcuplantgraph_1'){
		  
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
				.then(res => !this.isCancelled && this.setState({p1Data: {
				labels: JSON.parse(res.data)[1]
				,series: [
				JSON.parse(res.data)[0]
				]
			}}))
		  .catch(err => console.log(err));
		}

	};
  
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
       body = {};
    }
    return body;
  };
  
  logReadings1Minute() {

    setTimeout(() => {
      
      this.postToServer('mcuplantgraph_1');

      this.logReadings1Minute();
      
    }, 60000)
    
  };



	render() {

	   return (
      <div>
          <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                  <Card chart>
                      <CardHeader color="warning">
			  <span></span>
                          <ChartistGraph
                          className="graphStyle"
                          data={this.state.p1Data}
                          type="Line"
                          options={this.p1Chart.options}
                          listener={this.p1Chart.animation}
                          />
                      </CardHeader>
                      <CardBody>
                          <div>
                              <div style = {{fontSize: '18px', marginBottom: '20px'}}>
                                  <span>&nbsp;&nbsp;P1 Soil moisture</span>
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
};

export default (PlantSensor_1);
