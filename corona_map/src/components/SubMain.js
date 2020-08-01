import React from 'react';
import Search from './Search.js'
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import {
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Button,
} from 'semantic-ui-react'

import Feed from './Feed.js'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';


class SubMain extends React.Component {

state = {
    'apiKey': 'BDKJluIkcQa-Lwn_Ye9BfW_m8ajO-agWP-WXdpyAMJ3O6iAhangiPCn8Sjch8MF2mikafe4gxR1xxM0h69cCAYBuFlTn0tOvHc2vpiogz3TAHkaRGDeZVRXf46i9XnYx',
    'active': null,
    'isActive': false,
    'loading': false,
    'data2' : null,
    'pickupChecked': false,
    'popup': true,
    'isgood': false,
	 'food_type': null,
	 'location': null,
	 'food_filter': false,
	 'user_loc': [0,0],
	 'viewport': {center: [0,0], zoom: 15},
	 'data': null,
	 'lat': null,
	 'visable': true,
	 'points': 0,
	 'showFeed': false,
	 'term': null,
	 'friendSearch': null,
	 'userFriend': false,
	 'name': null,
	}


componentDidMount(){

	var send = {term: null, location: null, lat: this.props.user_loc[0], long: this.props.user_loc[1], limit: 20};
	
	axios.post('http://localhost:3001/apiCall', send)
	.then( (res) => {
		var r = res.data
		this.setState({data: r.data, data2: r.data, isgood: r.isgood, viewport: r.viewport,
		 loading: r.isloading, lat: this.props.user_loc[0], long: this.props.user_loc[1]});
	})
	.catch( (err) => {
		console.log(err);
	})
}


	

handleChange = value => {
  this.setState({location: value});
}

handleChange2(e){
  this.setState({term: e.target.value});
}

handleFoodSearch(e){
	this.setState({food_filter: false});
   var my_data;
  my_data = this.state.data.filter(biz => {
  	var i;
  	for(i=0; i < biz.categories.length; i++){
  		var item = biz.categories[i].title.toUpperCase()
  		if(item.includes(e.target.value.toUpperCase())){
      return biz;
    }
  	}
    
  
  });

this.setState({food_type: e.target.value, food_filter:true, data2: my_data});

}



 handleSubmit(e){
 	e.preventDefault();
    this.setState({loading: true});
  	var send = {term: this.state.term, location: this.state.location, lat: null, long: null, limit: 20};
  	console.log(send);
	
	axios.post('http://localhost:3001/apiCall', send)
	.then( (res) => {
		var r = res.data;
		console.log(r);
		this.setState({data: r.data, data2: r.data, isgood: r.isgood, viewport: r.viewport,
		 loading: r.isloading});
	})
	.catch( (err) => {
		console.log(err);
	})
  }

  setVisible(e, data){
  	
  	this.setState({visible: e});
  }

  dpoints(id){
  	const send = {name: this.props.name, id: id};
  	console.log(this.props.name);
  	axios.post('http://localhost:3001/updateLike', send)
  	.then( (res) => {
  		console.log(res.data);
  	})
  	.catch( (err) => {
  		console.log(err);
  	})

  	this.setState({points: this.state.points + 1});
  }

  showFeed(e){
  	if(!this.state.showFeed){
  	this.setState({showFeed: true});
  }
  else{
  	this.setState({showFeed: false});
  }
  }

  searchFriendChoice(e, term2){
  var send = {term: e, location: 'Boston, MA', lat: null, long: null, limit: 1};
  axios.post('http://localhost:3001/apiCall', send)
  .then( (res) => {
    var r = res.data;
      this.setState({data: r.data.businesses, data2: r.data.businesses, isgood: r.isgood, viewport: r.viewport,
		 loading: r.isloading, lat: r.lat, long: r.long, userFriend: true});
    
    })

  .catch( (err) => {
    console.log(err);
  })
}
  
 
 handleSearchArea(lat, long){
  	var send = {term: null, location: null, lat: lat, long: long, limit: 10};
  	
	axios.post('http://localhost:3001/apiCall', send)
	.then( (res) => {
		var r = res.data;
		console.log(r);
		this.setState({data: r.data, data2: r.data, isgood: r.isgood, viewport: r.viewport,
		 loading: r.isloading, lat: lat, long: long});
	})
	.catch( (err) => {
		console.log(err);
	})
  }
  


render(){
	
	return(

	<div>
	<br></br>
	<br></br>
	 <div>
	 <div style={{'padding-right': '65px'}} align="right">

	 	<Button color='black' onClick={() => this.setState({visible: true})}>
	 	<Icon size='chevron left' name='bullhorn' />
	 	</Button>
	 	
	 </div>

	 <Grid className='container' columns={1}>
	 
      <Grid.Column>
        <Sidebar.Pushable as={Segment}>
        
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            vertical
            visible={true}
            width='thin'
          >
            <Menu.Item as='a'>
              <Icon name='home' />
             {`D-Points: ${this.state.points}`}
            </Menu.Item>
            <Link to='/history'><Menu.Item as='a'>
              <Icon name='history' />
              History
            </Menu.Item>
            </Link>
         <Menu.Item as='a'>
    	<form onSubmit={this.handleSubmit.bind(this)}>
    	<label>Restaurant Name</label>
    	<input className="sidebar" type="text" value={this.state.term} onChange={this.handleChange2.bind(this)}/>
    	<label>Other Location</label>
    	<PlacesAutocomplete
        value={this.state.location}
        onChange={this.handleChange}
        onSelect={this.handleChange}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places',
                className: 'location-search-input sidebar',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active suggestion_dropdown'
                  : 'suggestion-item suggestion_dropdown';
                
                const style = suggestion.active
                  ? { backgroundColor: '#8f8f8f', cursor: 'pointer' }
                  : { backgroundColor: '#000000', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >

                    <br></br>
                    <span>{suggestion.description}</span>
                    <br></br>
                    <br></br>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    	<input type="submit" value="Submit"/>
    	</form>
    	<br></br>
    	<label>Food Type</label>
    	<input className="sidebar" type="text" value={this.state.food_type} onChange={this.handleFoodSearch.bind(this)}/>
         </Menu.Item>
         </Sidebar>


         <Grid.Column >
       
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            direction='right'
            inverted
            onHide={() => this.setVisible(false)}
            vertical
            visible={this.state.visible}
            width='thin'
          >
          <Menu.Item onClick ={this.showFeed.bind(this)} as='a'>
              <Icon name='bullhorn' />
            Feed
           {this.state.showFeed && 
            <Feed searchFriendChoice={this.searchFriendChoice.bind(this)} />
           }
            </Menu.Item>
            </Sidebar>
            </Grid.Column>

         

          <Sidebar.Pusher >
            
            {this.state.isgood && (
	<Search food_type={this.state.food_type}
	data={this.state.data}
	key={this.state.data}
	data2={this.state.data2}
	isgood={this.state.isgood}
	viewport={this.state.viewport}
	recurse={this.props.reset} user_lat={this.props.user_loc[0]}
	user_long={this.props.user_loc[1]} prepare={this.prepare}
	 dpoints={this.dpoints}
	 userFriend={this.state.userFriend}
	 handleSubmit={this.handleSubmit}
	 handleSearchArea={this.handleSearchArea}
	 name={this.props.name}

	 />
	 
	)}
              
            
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Grid.Column>
    </Grid>
    </div>
	


	 </div>
	);

}

}

export default SubMain