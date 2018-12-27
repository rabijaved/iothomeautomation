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
// react plugin for creating charts
import ChartistGraph from "react-chartist";

// @material-ui/core components
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';

// ##############################
// // // javascript library for creating charts
// #############################
var Chartist = require("chartist");

// ##############################
// // // variables used to create animation on charts
// #############################
var delays = 20,
durations = 500;


class DHT11 extends Component {
  
  constructor() {
    super();
    this.state = {myTemp: 0,myHumid: 0, anchorEl: null,open: false, tempSelected: 'Day', temperatureData: {labels: [],series: []}, humidityData: {labels: [],series: []}};
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
  // // // Temperature Chart
  // #############################
  

  dht11Chart= {
    options: {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 10
      }),
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      height: '300px',
      showPoint: false,
      axisX: {
	 labelInterpolationFnc: function(value, index) {
	 return index % 5 === 0 ? value : null;
      },
      offset : 40
},
    },
    // for animation
    animation: {
      draw: function(data) {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: "ease"
            }
          });
        
      }
    }
  };
  
  // ##############################
  // // // Drop Down
  // #############################
  
  
  
  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };
  
  handleClose = event => {
    if (this.state.anchorEl.contains(event.target)) {
      return;
    }
    
    this.setState({ open: false,tempSelected: event.target.id });
    
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
      
      this.callBackendAPI(jname,this.state.tempSelected)
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
    const response = await fetch(getUrl);
    
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
      console.log(this.state.temperatureData);

      this.logReadings1Minute();
      
    }, 60000)
    
  }
  
  render() {
    const classes = this.props;
    const { anchorEl, open } = this.state;
    const id = open ? 'simple-popper' : null;
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
                              <div style = {{float: 'right'}}>
                                  <span style = {{fontSize: '15px', textTransform: 'capitalize'}}><b>Period:</b></span>
                                  <Button style={{verticalAlign: '0.5px', background:'transparent', border:'none',boxShadow: 'none'}} aria-describedby={id} variant="contained" onClick={this.handleClick}>
                                      <span style = {{fontSize: '15px', textTransform: 'capitalize', fontWeight: '300'}}>{this.state.tempSelected}</span>
                                  </Button>
                                  <Popper id={id} open={open} anchorEl={anchorEl} placement='left-start' transition>
                                      {({ TransitionProps }) => (
                                      <Fade {...TransitionProps} timeout={350}>
                                          <Paper>
                                              <MenuList role="menu">
                                                  <MenuItem id="Day" onClick={this.handleClose} className={classes.dropdownItem}>Day</MenuItem>
                                                  <MenuItem id="Week" onClick={this.handleClose} className={classes.dropdownItem}>Week</MenuItem>
                                                  <MenuItem id="Month" onClick={this.handleClose} className={classes.dropdownItem}>Month</MenuItem>
                                                  <MenuItem id="Year" onClick={this.handleClose} className={classes.dropdownItem}>Year</MenuItem>
                                                  <MenuItem id="All" onClick={this.handleClose} className={classes.dropdownItem}>All</MenuItem>
                                              </MenuList>
                                          </Paper>
                                      </Fade>
                                      )}
                                  </Popper>
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
    