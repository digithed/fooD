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
				<Menu.Item as='a' onClick={this.props.searchFriendChoice.bind(this, place.name)}>
				{place.name}
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