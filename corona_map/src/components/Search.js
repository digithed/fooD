import React from 'react';
import {Map, Marker, Popup, TileLayer, type Viewport} from 'react-leaflet';
import axios from 'axios';
import Control from 'react-leaflet-control';
import {Button, Icon, Menu} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';


var myLat0 = 0;
var myLong0 = 0;
var map = Map;
class Search extends React.Component<{},{ viewport: Viewport },> {
	state = {
    'apiKey': 'BDKJluIkcQa-Lwn_Ye9BfW_m8ajO-agWP-WXdpyAMJ3O6iAhangiPCn8Sjch8MF2mikafe4gxR1xxM0h69cCAYBuFlTn0tOvHc2vpiogz3TAHkaRGDeZVRXf46i9XnYx',
    'active': null,
    'isActive': false,
    'isgood': false,
    'popup': null,
    'popPosition': null,
    'loading': false,
    'data2' : this.props.data2,
    'pickupChecked': false,
    'viewport': {center: [0, 0], zoom: 14},
    'popup': true,
    'myLat': null,
    'myLong': null,
    'data': this.props.data,
    'url': ''


    
  }
  componentDidMount(){
  	this.setState({data: this.props.data, data2: this.props.data});
    console.log(this.props.data);
  }



  onGo(e){
  	console.log(e.target.getCenter());
  }

  updateViewport(e){
  myLat0 = e.center[0];
  myLong0 = e.center[1];

}

prepare(e){
  e.preventDefault();
  var send = {location: null, lat: myLat0, long: myLong0};
  axios.post('http://localhost:3001/apiCall', send)
  .then( (res) => {
     var r = res.data;
     if(this.props.food_type){
      var f;
    f = r.data.filter(biz => {
    var i;
    for(i=0; i < biz.categories.length; i++){
      var item = biz.categories[i].title.toUpperCase()
      if(item.includes(this.props.food_type.toUpperCase())){
      return biz;
    }
    }
  });
    this.setState({data2: f, isgood: r.isgood, viewport: r.viewport, loading: r.isloading});
  }
  else{
    this.setState({data: r.data, isgood: r.isgood, viewport: r.viewport, loading: r.isloading});
  }
    
  })
  .catch( (err) => {
    console.log(err);
  })
}


copyLink(e){
  console.log(e);
  this.setState({url: e});
  console.log(this.state.url);
}

//<Button align="right" onClick={this.copyLink.bind(this, b.url)}><i className="fa fa-copy"></i></Button>
/*

{this.props.friendSearch && 
       <Marker key={this.state.data.id}
      position={[this.state.data.coordinates.latitude, this.state.data.coordinates.longitude]}
       >
       <Popup  maxWidth="200" maxHeight="200" onClick={this.setPopup}
       position={[this.state.data.coordinates.latitude, this.state.data.coordinates.longitude]} >
        <div>
      <h2>{this.state.data.name}</h2>
      <img src={this.state.data.image_url} height="150px" width="200px"/>
      <p>Rating: {this.state.data.rating}</p>
      <Button onClick={this.state.dpoints} name="like">Like</Button>
      <ul>
      {this.state.data.categories.map((i) => (
      <li>{i.title}</li>
  ))}
      </ul>
      <p><a href={this.state.data.url}>Yelp Page</a></p>
      <p>Phone: <a href={"tel:" + this.state.data.phone}>{this.state.data.phone}</a></p> 
      </div>
      </Popup>
        
  
      </Marker>


     }
     */
    


	render() {
		return (
			<div className='container'>

    {this.props.isgood && (
    <Map
    onViewportChanged={this.updateViewport.bind(this)}
    viewport = {this.props.viewport}
    useFlyTo={true}
    >
    <TileLayer
    url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution = '&copy; <a href= "https://osm.org/copyright">OpenStreetMap</a>
    contributors'
    />

    <Control position="topleft">
    <button onClick={this.props.handleSearchArea.bind(this, myLat0, myLong0)}> Search Area</button>
    <button>Reset and search near me</button>
    </Control>

    
        {this.props.food_type && this.state.data2.map((b) => (
          <Marker key={b.id}
      position={[b.coordinates.latitude, b.coordinates.longitude]}
       >
       <Popup onClick={this.setPopup} 
       position={[b.coordinates.latitude, b.coordinates.longitude]} >
        <div>
      <h2>{b.name}</h2>
      <img src={b.image_url} height="150px" width="200px"/>
      <p>Rating: {b.rating}</p>
       <p>Known for:</p>
      <ul>
      {b.categories.map((i) => (
     	<li>{i.title}</li>
  ))}
   		</ul>
      <p><a href={b.url}>Yelp Page</a></p>
      <p>Phone: <a href={"tel:" + b.phone}>{b.phone}</a></p> 

      </div>
      </Popup>
        
  
      </Marker>))
    ||
     this.props.data.map((b) => (
      <Marker key={b.id}
      position={[b.coordinates.latitude, b.coordinates.longitude]}
       >
       <Popup  maxWidth="200" maxHeight="200" onClick={this.setPopup}
       position={[b.coordinates.latitude, b.coordinates.longitude]} >
        <div>
      <h2>{b.name}</h2>
      <img src={b.image_url} height="150px" width="200px"/>
      <p>Rating: {b.rating}</p>


      <Button onClick={this.props.dpoints.bind(this, b.name)} as='div' labelPosition='right'>
      <Button icon>
        <Icon name='heart' />
        Like
      </Button>
      </Button>      
      
      <ul>
      {b.categories.map((i) => (
     	<li>{i.title}</li>
  ))}
   		</ul>
      <Button animated='vertical' onClick={() => window.open(b.url)}>
      <Button.Content hidden>Yelp Page</Button.Content>
      <Button.Content visible>
        <Icon name='food' />
      </Button.Content>
    </Button>
      <CopyToClipboard text={b.url}>
      <Button align="right" animated='vertical'>
      <Button.Content hidden>Copy Link</Button.Content>
      <Button.Content visible>
        <Icon name='copy' />
      </Button.Content>
    </Button>
    </CopyToClipboard>
      <p>Phone: <a href={"tel:" + b.phone}>{b.phone}</a></p> 
      </div>
      </Popup>
        
  
      </Marker>

      ))}

     
    
     

    </Map>
    )}
    </div>
    )
	}
}

export default Search