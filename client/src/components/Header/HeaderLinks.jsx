import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";


import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";

class HeaderLinks extends React.Component {
  state = {
    open: false
  };
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    return (
      <div></div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
