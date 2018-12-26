import React, { Component } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
// react plugin for creating charts
import ChartistGraph from "react-chartist";



// ##############################
// // // javascript library for creating charts
// #############################
var Chartist = require("chartist");

// ##############################
// // // variables used to create animation on charts
// #############################
var delays = 80,
  durations = 500;
var delays2 = 80,
  durations2 = 500;


const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};



// ##############################
// // // Temperature Chart
// #############################

const temperatureChart = {
  data: {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    series: [[12, 17, 7, 17, 23, 18, 38]]
  },
  options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 10
    }),
    low: 0,
    high: 45, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  // for animation
  animation: {
    draw: function(data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
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
  }
};



class DHT11 extends Component {
  

constructor() {
    super();
    this.state = {myTemp: 0,myHumid: 0 };
  }
  
  componentDidMount(){
    this.postToServer('dht11','','get');
  	this.logReadings10Seconds();
  }


componentWillUnmount() {
    this.isCancelled = true;
}

  postToServer(jname, jstate, jaction){
  
    this.callBackendAPI(jname, jstate, jaction)
      .then(res => !this.isCancelled && this.setState({myHumid: (res.jstate.split(",")[0]), myTemp: (res.jstate.split(",")[1])}))
      .catch(err => console.log(err));
      

  }

  callBackendAPI = async (jname, jstate, jaction) => {
  
    var getUrl = '/express_backend?jname='+jname + '&jstate='+jstate + '&jaction='+jaction;
    const response = await fetch(getUrl);

    var body;
    if (response.status === 200) {
	
      body = await response.json();
    
    }else
    {
    
      body = {jstate: '0,0'};
    }
    return body;
  };
 
 
  
 logReadings10Seconds() {

    setTimeout(() => {

		this.postToServer('dht11','','get');
        this.logReadings10Seconds();

    }, 10000)

}


  render() {
  const { classes } = this.props;
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
              <CardHeader>
                <CardIcon color="warning">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <span style = {{fontSize: '15px', margin: '0'}}>Temperature</span>
                <div style = {{height: '50',display: 'flex', alignItems: 'center'}}>
                <h3 className={this.props.cardTitle}>
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
                <h3 className={this.props.cardTitle}>
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
                <ChartistGraph
                  className="ct-chart"
                  data={temperatureChart.data}
                  type="Line"
                  options={temperatureChart.options}
                  listener={temperatureChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Temperature</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                  </span>{" "}
                </p>
              </CardBody>
            </Card>
          </GridItem>
       </GridContainer>
    </div>
  );
}


}
export default withStyles(styles)(DHT11);
