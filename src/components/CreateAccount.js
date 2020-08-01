import React from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";

class CreateAccount extends React.Component {
	state = {
		'success': null,
		'name': null,
		'email': null,
		'pass': null,
    'friends': null
	}

	componentDidMount(){
		console.log('done');
	}

	createUser(e){
  e.preventDefault();
  var data = {name: this.state.name, email: this.state.email, pass: this.state.pass,
    friends: this.state.friends};
  axios.post('http://localhost:3001/createUser', data)
  .then( (res) => {
    console.log(res.data);
    this.setState({'success': res.data.success});
  })
  .catch( (err) => {
    console.log(err);
  })
}

setName(e){
  this.setState({name: e.target.value})
}

setEmail(e) {
  this.setState({email: e.target.value})
}

setPass(e) {
  this.setState({pass: e.target.value})
}

setFriends(e){
  this.setState({friends: e.target.value})
}

	render(){
		return(
	<div>
	<h1>Create Account</h1>
	<br></br>
	<form onSubmit={this.createUser.bind(this)}>
    <label>Name</label>
    <input type="text" value={this.props.name} onChange={this.setName.bind(this)} />
    <label>Email address</label>
    <input type="text" value={this.props.email} onChange={this.setEmail.bind(this)} />
      <label>Password</label>
    <input type="password" value={this.props.pass} onChange={this.setPass.bind(this)} />
    <label>Friends</label>
    <input type="text" value={this.state.fruebds} onChange={this.setFriends.bind(this)} />
    <input type="submit" value="Submit" />
    </form>
    {this.state.success && <Redirect to='/main'></Redirect>}
	</div>

			)
	}
}

export default CreateAccount