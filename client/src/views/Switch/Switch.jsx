import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import ToggleSwitch from "components/ToggleSwitch/ToggleSwitch.jsx";


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

function Switch(props) {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
              <CardHeader>
              <GridItem xs={12} sm={12} md={6}>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                <ToggleSwitch name="Switch 1" id="switch1"/>
                </GridItem>
              </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
              <CardHeader>
              <GridItem xs={12} sm={12} md={6}>
                <CardIcon color="success">
                  <Icon>content_copy</Icon>
                </CardIcon>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                <ToggleSwitch name="Switch 2" id="switch2"/>
                </GridItem>
              </CardHeader>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
              <CardHeader>
              <GridItem xs={12} sm={12} md={6}>
                <CardIcon color="danger">
                  <Icon>content_copy</Icon>
                </CardIcon>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                <ToggleSwitch name="Switch 3" id="switch3"/>
                </GridItem>
              </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
              <CardHeader>
              <GridItem xs={12} sm={12} md={6}>
                <CardIcon color="info">
                  <Icon>content_copy</Icon>
                </CardIcon>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                <ToggleSwitch name="Switch 4" id="switch4"/>
                </GridItem>
              </CardHeader>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default withStyles(styles)(Switch);
