import React from 'react';
import {Map, Marker, Popup, TileLayer, type Viewport} from 'react-leaflet';
import axios from 'axios';
import Control from 'react-leaflet-control';
import {Button, Icon, Menu} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Timestamp from 'react-timestamp';





class Search extends React.Component<{},{ viewport: Viewport },> {

  constructor(props){
    super(props);
     this.updateViewport.bind(this);
    this.set.bind(this);
    this.Lat = 0;
    this.Long = 0;
    this.ready = false;
   
    
  }


   
  
	state = {
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
    'url': '',
    postViewport: false,
    ready: false,

  }
  componentDidMount(){
    console.log(this.props.viewport);
  	this.setState({data: this.props.data, data2: this.props.data2});
  }


  updateViewport(e){
    this.Lat = e.center[0];
    this.Long = e.center[1];
    this.ready = false;
    

}


copyLink(e){
  console.log(e);
  this.setState({url: e});
  console.log(this.state.url);
}

set(e){
    var mLat = this.Lat;
    var mLong = this.Long;
    this.ready = true;

    this.setState({myLat: mLat , myLong: mLong}, (res) => {
      if(res){
        return;
      }
    });
 
  
}

// {this.props.food_type && this.props.data2.map((b) => (
//   <Marker key={b.id}
//   position={[b.coordinates.latitude, b.coordinates.longitude]}
//    >
//    <Popup onClick={this.setPopup} 
//    position={[b.coordinates.latitude, b.coordinates.longitude]} >
//     <div>
//   <h2>{b.name}</h2>
//   <img src={b.image_url} height="150px" width="200px"/>
//   <p>Rating: {b.rating}</p>
//    <p>Known for:</p>
//   <ul>
//   {b.categories.map((i) => (
//    <li>{i.title}</li>
// ))}
//    </ul>
//   <p><a href={b.url}>Yelp Page</a></p>
//   <p>Phone: <a href={"tel:" + b.phone}>{b.phone}</a></p> 

//   </div>
//   </Popup>
    

//   </Marker>))

//   }


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

    <Control style={{'padding-bottom': '30px'}} position="topleft">
    <div >
    <Button size='small' style={{'display': 'inline-block'}} color='black' onClick={this.set.bind(this)}> Search Area</Button>
    {this.ready && (
      this.props.handleSearchArea(this.state.myLat, this.state.myLong)
      
      )}
    <br></br>
    <Button size='small' style={{'display': 'inline-block'}} color='black' onClick={this.props.reset.bind(this)}>Reset and search near me</Button>
    </div>
    </Control>


  
     {this.props.data.map((b) => (
      <Marker key={b.id}
      position={[b.coordinates.latitude, b.coordinates.longitude]}
       >
       <Popup  maxWidth="200" maxHeight="200" onClick={this.setPopup}
       position={[b.coordinates.latitude, b.coordinates.longitude]} >
        <div>
      <h2>{b.name}</h2>
      <img src={b.image_url} height="150px" width="200px"/>
      <p>Rating: {b.rating}</p>


      <Button onClick={this.props.dpoints.bind(this, b.name, b.id)} as='div' labelPosition='right'>
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