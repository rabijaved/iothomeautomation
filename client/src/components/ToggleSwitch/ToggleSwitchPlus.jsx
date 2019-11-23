import React, { Component } from "react";
import Switch from "react-switch";
import io from 'socket.io-client';
const socket = io();
 
 
class ToggleSwitchPlus extends Component {


  subscribeToUpdates(cb) {
	socket.on('setServerUpdate', data => cb(null, data));
  } 


  sendSwitchData(switchName, switchState){

	var sendata = {
		jname: switchName,
		jstate: switchState
	};

	socket.emit('setSwitchState', sendata, (data) => {
		this.setState({checked: data});
		});

  }

  getServerSwitchState(switchName){
	  
	socket.emit('getServerSwitchState', switchName, (data) => { 
       this.setState({checked: data});
    });

  }

  
  componentDidMount() {
	this.getServerSwitchState(this.props.id);
  }

  constructor() {
    super();

    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
    this.subscribeToUpdates((err, data) => {
		if(this.props.id === data['jname']) this.setState({ checked: data['jstate']});
	});
  }
 
 
  handleChange(checkedEvent, event,id) {

	this.sendSwitchData(id, checkedEvent);

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
