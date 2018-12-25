import React, { Component } from "react";
import Switch from "react-switch";
 
 
class ToggleSwitch extends Component {

  
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
      .then(res => this.setState({checked: (res.switchState === 'true')}))
      .catch(err => console.log(err));

  }

  callBackendAPI = async (switchName, switchState, switchAction) => {
  
    var getUrl = '/express_backend?switchName='+switchName + '&switchState='+switchState + '&switchAction='+switchAction;
    const response = await fetch(getUrl)
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };
 
 
  handleChange(checked, event,id) {
  	
    this.postToServer(id,checked,'set');
    
  }
 
  render() {
    return (
    <div>
    <div style = {{fontSize: '18px', textAlign: 'center', width: '185px', paddingBottom: '5px'}}>{this.props.name}</div>
    <div style = {{height: '50',display: 'flex', alignItems: 'center'}}>
	    <span style = {{fontSize: '15px', margin: '0'}}>On&nbsp;</span>

			<Switch
			    checked={this.state.checked}
			    onChange={this.handleChange}
			    handleDiameter={42}
			    offColor="#08f"
			    onColor="#0ff"
			    offHandleColor="#0ff"
			    onHandleColor="#08f"
			    height={50}
			    width={115}
			    className="react-switch"
			    id={this.props.id}
			  />
			  
		 <span style = {{fontSize: '15px'}}>&nbsp;Off</span>
	</div>
	</div>
    );
  }
}

export default (ToggleSwitch);