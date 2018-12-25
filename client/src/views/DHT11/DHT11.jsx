import React, { Component } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";


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
    </div>
  );
}


}
export default withStyles(styles)(DHT11);
