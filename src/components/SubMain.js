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

import Friends from './Friends.js';


class SubMain extends React.Component {

state = {
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
   'friend': false,
   'friendRequests': null,
   'showNotif': false,
   'history': null,
   'setHistory': false,
   'req_icon': 0,
   'stop': false,
	}


componentDidMount(){

	var send = {term: null, location: null, lat: this.props.user_loc[0], long: this.props.user_loc[1], limit: 20};
	
	axios.post('http://localhost:3001/apiCall', send)
	.then( (res) => {
		var r = res.data;
		this.setState({data: r.data, data2: r.data, isgood: r.isgood, viewport: r.viewport,
     loading: r.isloading, lat: this.props.user_loc[0], long: this.props.user_loc[1]});
     var data = {name: this.props.name};
     axios.post("http://localhost:3001/getFriendRequest", data)
     .then( (res) => {
       console.log(res.data);
       this.setState({req_icon: res.data.friendRequests.length});
     })
     .catch( (err) => {
       console.log(err);
     })

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


  //Function to create timestamp after liking a restaurant and sending data to update history of likes
  dpoints(id){
    const date = new Date().toDateString();
  	const send = {name: this.props.name, id: id, timestamp: date};
  	axios.post('http://localhost:3001/updateLike', send)
  	.then( (res) => {
  		this.setState({points: this.state.points + 1, setHistory: false});
  	})
  	.catch( (err) => { 
  		console.log(err);
  	})

 
  }

  showFeed(e){
  	if(!this.state.showFeed){
  	this.setState({showFeed: true});
  }
  else{
  	this.setState({showFeed: false});
  }
  }

  searchFriendChoice(term){
  var send = {term: term, location: 'Boston, MA', lat: null, long: null, limit: 1};
  axios.post('http://localhost:3001/apiCall', send)
  .then( (res) => {
    var r = res.data;
    console.log(r);
      this.setState({data: r.data.businesses, data2: r.data.businesses, isgood: r.isgood, viewport: r.viewport,
		 loading: r.isloading, userFriend: true});
    
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
		 loading: r.isloading});
	})
	.catch( (err) => {
		console.log(err);
	})
  }

  reset(e){

  	var send = {term: null, location: null, lat: this.state.lat, long: this.state.long, limit: 20};
	
	axios.post('http://localhost:3001/apiCall', send)
	.then( (res) => {
		var r = res.data
		console.log(res.data);
		this.setState({data: r.data, data2: r.data, isgood: r.isgood, viewport: r.viewport,
		 loading: r.isloading});
	})
	.catch( (err) => {
		console.log(err);
	})

  }

  updateViewport(e){
  	this.setState({viewport: {center: e.center, zoom:15}});
  }

  addFriend(e){
    if(!this.state.friend){
      this.setState({friend: true});
    }
    else if(!this.state.stop){
      this.setState({friend: false});
    }
  }



  showNotif(e){
   
    var data = {name: this.props.name};
    axios.post("http://localhost:3001/getFriendRequest", data)
    .then( (res) => {
      this.setState({friendRequest: res.data.friendRequests});
      if(!this.state.showNotif){
        this.setState({showNotif: true});
      }
      else{
        this.setState({showNotif: false});
      }
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  acceptFriend(name, index){

    var data = {name: this.props.name, friendName: name};
    axios.post('http://localhost:3001/acceptRequest', data)
    .then( (res) => {
      var req_icon = this.state.req_icon-1;
     this.setState({req_icon: req_icon});
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  setHistory(e){
    
    axios.get("http://localhost:3001/history")
    .then( (res) => {
      
      this.setState({history: res.data.history});
      console.log(res.data.history);

      if(!this.state.setHistory){
       
        this.setState({setHistory: true});
      }
      else{
        this.setState({setHistory: false});
      }

    })
    
  }
  


render(){
	
	return(

	 <div>

	 <Grid style={{'height': '88vh'}} className='container' columns={1}>
	  <h1>Welcome, {this.props.name}</h1>

      <Grid.Column style={{'paddingBottom': '100px', 'height': '88vh'}}>
      <div style={{"font-size": '0'}} align="right">
     <Button color='black' icon onClick={() => this.setState({visible: true})}>
	 	<Icon name='chevron left' />
	 	</Button>
	   </div>
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
            <Menu.Item onClick={this.setHistory.bind(this)} as='a'>
              <Icon name='sitemap' />
             History
             {this.state.setHistory && this.state.history &&
             this.state.history.map( (item) => {
              
                return(
                    <Menu.Item onClick={this.searchFriendChoice.bind(this, item.name)} as='a'>
                      {item.name} <p style={{'color': '#53e3a6'}}>{item.timestamp}</p>
                      </Menu.Item>
                      
                );
          
             })
             }
            </Menu.Item>
            <Menu.Item onClick={this.showNotif.bind(this)} as='a'>
            <div style={{'paddingRight': '30px', 'float': 'right'}}>
              <p>{this.state.req_icon}</p>
              </div>
              <Icon style={{'paddingTop': '10px'}} name='globe' size='big' />
              <br></br>
              Notifications
              {this.state.showNotif && this.state.friendRequest && (
                this.state.friendRequest.map( (item, key) => {
                  var name = item;
                  return(
                  <Menu.Item as='a'>{item} wants to be your friend!
                  <Button onClick={this.acceptFriend.bind(this, name, key)}
                   >Accept</Button>
                  <Button>Decline</Button>
                  </Menu.Item>
                  )
                })
              )
              }
            </Menu.Item>
           
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


         <Grid.Column>
       
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
            <Menu.Item onClick ={this.addFriend.bind(this)} as='a'>
              <Icon name='address book outline' />
            Add Friend
            </Menu.Item>
           {this.state.friend &&
            <Friends name={this.props.name} />
           }
           
            
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
	 handleSearchArea={this.handleSearchArea.bind(this)}
	 name={this.props.name}
	 reset={this.reset.bind(this)}
	 updateViewport={this.updateViewport.bind(this)}

	 />
	 
	)}
              
            
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Grid.Column>
    </Grid>
    </div>
	



	);

}

}

export default SubMain