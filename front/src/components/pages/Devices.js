import React from 'react';
import Light from '../devices/Light'
import Outlet from '../devices/Outlet'
import AcUnit from '../devices/AcUnit'
import AirFreshener from '../devices/AirFreshener'
import AirPurifier from '../devices/AirPurifier'
import Bed from '../devices/Bed'
import Fan from '../devices/Fan'
import Fireplace from '../devices/Fireplace'
import Radiator from '../devices/Radiator'
import Switch from '../devices/Switch'
import Thermostat from '../devices/Thermostat'
import AirCooler from '../devices/AirCooler'
import Bathtub from '../devices/Bathtub'
import Awing from '../devices/Awing'
import Blinds from '../devices/Blinds'
import Closet from '../devices/Closet'
import Curtain from '../devices/Curtain'
import Door from '../devices/Door'
import Drawer from '../devices/Drawer'
import Garage from '../devices/Garage'
import Pergola from '../devices/Pergola'
import Shutter from '../devices/Shutter'
import Valve from '../devices/Valve'
import Window from '../devices/Window'
import Lock from '../devices/Lock'
import Gate from '../devices/Gate'
import Heater from '../devices/Heater'
import Hood from '../devices/Hood'
import SecuritySystem from '../devices/SecuritySystem'
import Blender from '../devices/Blender'
import Global from '../devices/Global'
import Scene from '../devices/Scene'
import getCookieValue from '../../functions'
import { root } from '../../constants'

import './Devices.css';

class Devices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      devices: []
    }
    this.loadData = this.loadData.bind(this);
    this.newDevice = this.newDevice.bind(this);
  }

  componentDidMount() {
    this.loadData();
    setInterval(this.loadData,3000);
  }

  loadData(){
    var http = new XMLHttpRequest();
    http.onload = function (e) {
      if (http.readyState === 4) {
        if (http.status === 200) {
          var data = JSON.parse(http.responseText);
          this.setState({
             data: data,
             devices: data.devices
           });
        } else {
          console.error(http.statusText);
        }
      }
    }.bind(this);
    http.open("GET", root + "api/global/get/");
    http.setRequestHeader('authorization', 'baerer ' + getCookieValue('token'))
    http.send();
  }

  newDevice(){
    window.location.href = '/devices/editor/'
  }

  render() {

    const devices = this.state.devices.map((device) => {
      if(device.type === 'action.devices.types.LIGHT')
        return <Light key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.OUTLET')
        return <Outlet key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.AC_UNIT')
        return <AcUnit key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.AIRFRESHENER')
        return <AirFreshener key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.AIRPURIFIER')
        return <AirPurifier key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.BED')
        return <Bed key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.FAN')
        return <Fan key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.FIREPLACE')
        return <Fireplace key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.RADIATOR')
        return <Radiator key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.SWITCH')
        return <Switch key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.THERMOSTAT')
        return <Thermostat key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.AIRCOOLER')
        return <AirCooler key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.BATHTUB')
        return <Bathtub key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.AWING')
        return <Awing key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.AIRCOOLER')
        return <AirCooler key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.BLINDS')
        return <Blinds key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.CLOSET')
        return <Closet key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.CURTAIN')
        return <Curtain key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.DOOR')
        return <Door key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.DRAWER')
        return <Drawer key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.GARAGE')
        return <Garage key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.GATE')
        return <Gate key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.PERGOLA')
        return <Pergola key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.SHUTTER')
        return <Shutter key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.VALVE')
        return <Valve key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.WINDOW')
        return <Window key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.LOCK')
        return <Lock key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.HEATER')
        return <Heater key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.HOOD')
        return <Hood key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.SECURITYSYSTEM')
        return <SecuritySystem key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.BLENDER')
        return <Blender key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else if(device.type === 'action.devices.types.SCENE')
        return <Scene key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
      else
        return <Global key={device.id} device={device} status={ this.state.data.status[device.id] } reload={ this.loadData }/>
    });

    return (
      <div>
        <div className="page_title_container">
          <h2>Devices and scences</h2>
        </div>

        <div className="page_cards_container">
          { devices }
        </div>

        <div className="page_buttons_containter">
          <button type="button" onClick={ this.newDevice }>New</button>
        </div>
      </div>
    );
  }
}

export default Devices
