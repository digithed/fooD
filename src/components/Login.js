import React from 'react';
import Main from './Main.js'
import CreateAccount from './CreateAccount.js'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import axios from 'axios';
import GoogleLogin from 'react-google-login';


class Login extends React.Component  {

state = {
  'name': null,
  'email': null,
  'success': null,
  'pass': null,

}

login(e){
  e.preventDefault();
  var data = {email: this.state.email, pass: this.state.pass};
  axios.post('http://localhost:3001/login', data)
  .then( (res) => {
    console.log(res.data);
    this.setState({success: res.data.success, name: res.data.name});
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

onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  var data = {token: id_token, email: profile.getEmail(), name: profile.getName()};
  console.log(data);
  axios.post("http://localhost:3001/googleLogin", data)
  .then( (res) => {
    this.setState({success: res.data.success, name: res.data.name});
  })
  .catch( (err) => {
    console.log(err);
  })
}

  render(){
  return( 
  	<div className="login">
  	{this.state.success != true &&

       <div>
       <h1 align="left">fooD</h1>
    <h2 align="center">Login</h2>
    <form onSubmit={this.login.bind(this)}>
    <div style={{'padding-right': '85px'}}>
    <label>Email address</label>&nbsp;
    <input type="text" value={this.state.email} onChange={this.setEmail.bind(this)} />
    </div>
    <div style={{'padding-right': '60px'}}>
    <label>Password</label>&nbsp;
    <input type="password" value={this.state.pass} onChange={this.setPass.bind(this)} />
    </div>
    <input type="submit" value="Login" />
    </form>
    <br></br>
    <GoogleLogin
      clientId = "1084699443589-e8avah9a0arieubsju4jk78f08v0t9gq.apps.googleusercontent.com"
      buttonText = "Sign in with Google"
      onSuccess={this.onSignIn.bind(this)}
       />
       <br></br>
    
    </div>
}
    {this.state.success && 
    <Router>
      <Switch>
      <Route path="/main">
      <Main name={this.state.name} />
    </Route>
    </Switch>
    <Redirect to='/main' />
   
    </Router>
    
  }
    <Router>
      <Switch>
      <Route path="/createAccount">
      <CreateAccount name={this.state.name} email={this.state.email} pass={this.state.pass}  />
    </Route>
    </Switch>
   
    </Router>
     


 

  </div>
  );
}
}

export default Login;