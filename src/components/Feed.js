import React from 'react';
import {Grid, Button, Icon, Menu} from 'semantic-ui-react';
import axios from 'axios';



class Feed extends React.Component {
	state = {
		friends: null,
		keys: null,
		ok: false,
	}

	 componentDidMount(){
	 	axios.get('http://localhost:3001/getFriends')
	 	.then( (res) => {
			 console.log(res.data);
			 Object.keys(res.data).map( (item) => {
				
				 res.data[item].sort((a, b) => (a.raw_date > b.raw_date) ? -1: (a < b) ? 1 : 0 );
				 if (res.data[item].length > 3){
				 var newDat = [res.data[item][0], res.data[item][1], res.data[item][2]];}
				 else{
					 var newDat = res.data[item];
				 }
				 res.data[item] = newDat;
				 return res.data;
			 });
		
	 		this.setState({friends: res.data, keys: Object.keys(res.data), ok: true});
	 	})
	 	.catch( (err) => {
	 		console.log(err);
	 	})
	 }

	render(){
		
	return (

		<div>
		<br></br>
		
		{this.state.ok && this.state.keys.map( (item) => {
			return(
			<Grid columns={1}>
      		<Grid.Column>
      	
			<div style={{'borderBottom': '2px solid grey'}}>
  			<p>{item} updated their restaurant list</p>
  			<div>
			{this.state.friends[item].map( (place) => {
				return(
				<Menu.Item as='a' onClick={this.props.searchFriendChoice.bind(this, place.id)}>
				{place.name}
				<p style={{'color': '#5C83FF'}}>{place.timestamp}</p>
				</Menu.Item>
				)
			})}
			</div>
			</div>
	
			</Grid.Column>
			</Grid>
			)
			

		})}
		</div>

		);
}
}


export default Feed