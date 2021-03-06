import React from 'react';
import getCookieValue from '../../functions'
import { root } from '../../constants'

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1
    }

    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.downloadLog = this.downloadLog.bind(this);
  }

  componentDidMount() {
    var http = new XMLHttpRequest();
    http.onload = function (e) {
      if (http.readyState === 4) {
        if (http.status === 200) {
          var data = JSON.parse(http.responseText);
          this.setState({ data: data });
        } else {
          console.error(http.statusText);
        }
      }
    }.bind(this);
    http.open("GET", root + "api/log/get/");
    http.setRequestHeader('authorization', 'baerer ' + getCookieValue('token'))
    http.send();
  }

  previousPage() {
    if (this.state.page > 1)
      this.setState({ page: this.state.page - 1 });
  }

  nextPage() {
    if (this.state.page < this.state.data.length/10-1)
      this.setState({ page: this.state.page + 1 });
  }

  downloadLog() {
    window.location = root + "files/log/homeware/" + getCookieValue('token')
  }

  render() {

    const line = {
      width: '80%',
      marginLeft: '8%',
      marginTop: '10px',
      borderBottom: '1px solid #eee',
      paddingLeft: '20px',
      paddingBottom: '10px',
      paddingRight: '20px',
      textAlign: 'left'
    }

    const yellow = {
      color: 'orange'
    }

    const red = {
      color: 'red'
    }

    const homeware_lan_log_data = this.state.data.reverse().slice(0, this.state.page * 10);
    const homeware_lan_log = homeware_lan_log_data.map((register, i) =>
      <div style={ line } key={ i }>
        { register.severity === 'Log' ? <b>{ register.severity }</b> : '' }
        { register.severity === 'Warning' ? <b style={ yellow }>{ register.severity }</b> : '' }
        { register.severity === 'Alert' ? <b style={ red }>{ register.severity }</b> : '' }
         - { register.time }<br/>
        { register.message }
      </div>
    );

    return (
      <div>
        <div className="page_block_container">
          <h2>Homeware-LAN log</h2>
          <hr/>
          <div>
            { homeware_lan_log }
          </div>
          <div className="page_block_buttons_container">
            <button type="button" onClick={ this.nextPage }>Load more</button>
            <button type="button" onClick={ this.downloadLog }>Download</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Logs
