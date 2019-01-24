import React, { Component } from "react";
import Switch from "react-switch";
 
 
class ToggleSwitchPlus extends Component {

  
  componentDidMount() {
    this.postToServer(this.props.id,'','get');
  }

  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }
  
  postToServer(switchName, switchState, switchAction){
  
    this.callBackendAPI(switchName, switchState, switchAction)
      .then(res => this.setState({checked: (res.jstate === 'true')}))
      .catch(err => console.log(err));

  }

  callBackendAPI = async (switchName, switchState, switchAction) => {
  
    var getUrl = '/express_backend?jname='+switchName + '&jstate='+switchState + '&jaction='+switchAction;
    const response = await fetch(getUrl,{method: 'get', 
	   headers: new Headers({
		 'Authorization': btoa('0e3cbac3-d0dc-47ab-96aa-2785b0557346'), 
		 'Content-Type': 'application/x-www-form-urlencoded'
	   })});

    var body;
    if (response.status === 200) {

      body = await response.json();
    
    } else{
      body = {jstate: !this.state.checked};
    }
    return body;
  };
 
 
  handleChange(checked, event,id) {

    this.postToServer(id,checked,'set');
    
  }
 
  render() {
    return (
    <div>
    <div style = {{fontSize: '25px', textAlign: 'center', width: '185px', paddingBottom: '5px', color: 'white'}}><b>{this.props.name}</b></div>
    <div style = {{height: '50',display: 'flex', alignItems: 'center', marginTop: '20px'}}>
	    <span style = {{fontSize: '25px', margin: '0', color: 'white'}}><b>On</b>&nbsp;</span>

			<Switch
			    checked={this.state.checked}
			    onChange={this.handleChange}
			    handleDiameter={62}
			    offColor="#08f"
			    onColor="#0ff"
			    offHandleColor="#0ff"
			    onHandleColor="#08f"
			    height={80}
			    width={165}
			    className="react-switch"
			    id={this.props.id}
			  />
			  
		 <span style = {{fontSize: '25px', color: 'white'}}>&nbsp;<b>Off</b></span>
	</div>
	</div>
    );
  }
}

export default (ToggleSwitchPlus);