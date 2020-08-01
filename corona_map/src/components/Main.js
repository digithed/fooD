import React from 'react';
import SubMain from './SubMain.js'
import PulseLoader from "react-spinners/PulseLoader";
import Slider from 'react-animated-slider';
import { css } from "@emotion/core";
import 'react-animated-slider/build/horizontal.css';
import Dropdown from 'react-bootstrap/Dropdown';
import 'react-dropdown/style.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import {Icon, Button, Menu} from 'semantic-ui-react'
import axios from 'axios';


const override = css`
  display: block;
  margin-top: 200px;
  border-color: green;
`;
   class Main extends React.Component{

  state = {
     'user_lat': null,
    'user_long': null,
    'comp': null,
    'isloaded': null,
    'redir': null,
    'history': null,
    'menu': null,
    'name': null,
    't': false,
    'friends': null
  }

componentDidMount(){
  navigator.geolocation.getCurrentPosition( (position) => {
      this.setState({user_lat: position.coords.latitude,
        user_long: position.coords.longitude, isloaded: true});
      console.log(this.state.user_long);
  });

  axios.get('http://localhost:3001/getCurrentUser')
  .then( (res) => {
    this.setState({name: res.data.name, friends: res.data.friends});
  })
}




  handleComp(e){
    e.preventDefault();
    this.setState({comp: true});

  }

  reset(){
    navigator.geolocation.getCurrentPosition( (position) => {
      this.setState({user_lat: position.coords.latitude,
        user_long: position.coords.longitude});
  });
  }



    render(){
  return( 
    <div>
    <Dropdown align='left'>
    <Button>fooD 
    <br></br>
    <Dropdown.Toggle as='text' variant="success" id="dropdown-basic">
    </Dropdown.Toggle>
    </Button>
    <Dropdown.Menu>
    <Dropdown.Item href='/main'>Map</Dropdown.Item>
    <Dropdown.Item href='/friends'>Friends</Dropdown.Item>
    <br></br>
    <Dropdown.Item href='/login'>Logout</Dropdown.Item>
    </Dropdown.Menu>
    </Dropdown>

    {!this.state.isloaded && !this.state.history &&
    <PulseLoader
          css={override}
          size={25}
          color={"#E6ECFF"}
          loading={this.props.isloaded}
        />
      }


    {this.state.isloaded && (
      <div>
      <div style={{'float': 'left', 'padding-left': '70px', 'padding-top': '20px', 'padding-bottom': '10px' }} align='left'>
      <img style={{'display': 'inline-block'}} className='circular--landscape' src='./pizza.jpeg' />
      <h2 style={{'padding-left': '20px','display': 'inline-block'}} className="sidebar_name">Hello, {this.props.name}</h2>
      <h2 style={{'padding-left': '20px','display': 'inline-block'}}>Rank: Newbie</h2>
      </div>
      <SubMain name={this.state.name} user_loc={[this.state.user_lat, this.state.user_long]} userFind={true}
      reset={this.reset} />
      </div>

    )}

  

    </div>
    )
}

  }

  export default Main