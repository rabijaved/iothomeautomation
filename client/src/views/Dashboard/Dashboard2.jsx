import React from "react";
import AnalogClock, { Themes } from 'react-analog-clock';
import Clock from 'react-live-clock';
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ToggleSwitch from "components/ToggleSwitch/ToggleSwitchPlus.jsx";
import ReactFitText from 'react-fittext';

class Dashboard extends React.Component {


  constructor() {
    super();
    this.state = { myTemp: 0, myHumid: 0 };
  }

  componentDidMount() {
    this.postToServer('dht11');
    this.logReadings1Minute();
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  // ##############################
  // // // AJAX POST
  // #############################


  postToServer(jname) {

    if (jname === 'dht11') {
      this.callBackendAPI(jname, 'void')
        .then(res => !this.isCancelled && this.setState({ myHumid: (res.data.split(",")[0]), myTemp: (res.data.split(",")[1]) }))
        .catch(err => console.log(err));
    }

  }

  callBackendAPI = async (jname, jstate) => {

    var getUrl = '/express_backend?jname=' + jname + '&jstate=' + jstate + '&jaction=get';
    const response = await fetch(getUrl, {
      method: 'get',
      headers: new Headers({
        'Authorization': btoa('0e3cbac3-d0dc-47ab-96aa-2785b0557346'),
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });

    var body;
    if (response.status === 200) {

      body = await response.json();

    } else {
      if (jname === 'dht11') body = { data: '0,0' };
      else body = {};
    }
    return body;
  };

  logReadings1Minute() {
    setTimeout(() => {

      this.postToServer('dht11');

      this.logReadings1Minute();

    }, 60000)

  }

  render() {
    const classes = this.props;
    return (
      <Card style={{ marginTop: '-60px', backgroundColor: 'black', paddingBottom: '60px', marginLeft: '-10px' }}>
        <GridContainer style={{ paddingLeft: '70px' }}>
          <GridItem xs={12}></GridItem>
          <GridItem xs={8}>
            <CardHeader>
            </CardHeader>
            <CardBody>
              <div style={{ marginLeft: '20px' }}>
                <ReactFitText compressor={0.7}>
                  <h1><span style={{ fontWeight: '400', fontSize: '200px', color: 'white', marginTop: '0px' }}><Clock format={'h:mm'} ticking={true} /></span>
                    <span style={{ fontSize: '50px', color: 'white' }}><Clock format={'a'} ticking={true} /></span></h1>
                </ReactFitText>
              </div>
            </CardBody>
          </GridItem>
          <GridItem xs={4}>
            <CardHeader style={{ marginTop: '100px' }}>
              <GridItem xs={12} sm={12} md={6}>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <ToggleSwitch name="Lamp" id="switch1" />
              </GridItem>
            </CardHeader>
          </GridItem>
          <GridItem xs={4} style={{ marginBottom: '-30px' }}>
            <CardHeader>
              <CardIcon color="warning">
                <Icon>info_outline</Icon>
              </CardIcon>
              <span style={{ fontSize: '25px', margin: '0', color: 'white' }}><b>Temperature</b></span>
              <div style={{ height: '50', display: 'flex', alignItems: 'center' }}>
                <h3 style={{ fontSize: '50px', color: 'white' }} className={classes.cardTitle}>
                  <b>{this.state.myTemp}</b> <small> C</small>
                </h3>
              </div>
            </CardHeader>
          </GridItem>
          <GridItem xs={4} style={{ marginBottom: '-30px' }}>
            <CardHeader>
              <CardIcon color="success">
                <Icon>info_outline</Icon>
              </CardIcon>
              <span style={{ fontSize: '25px', margin: '0', color: 'white' }}><b>Humidity</b></span>
              <div style={{ height: '50', display: 'flex', alignItems: 'center' }}>
                <h3 style={{ fontSize: '50px', color: 'white' }} className={classes.cardTitle}>
                  <b>{this.state.myHumid}</b> <small>%</small>
                </h3>
              </div>
            </CardHeader>
          </GridItem>

        </GridContainer>
      </Card >
    );
  }
}


export default (Dashboard);

