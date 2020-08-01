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
    <br></br>
    <div style={{'padding-right': '60px'}}>
    <label>Password</label>&nbsp;
    <input type="password" value={this.state.pass} onChange={this.setPass.bind(this)} />
    </div>
    <br></br>
    <input type="submit" value="Login" />
    </form>
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

  {this.state.success == false &&
    <div>
    <h2>User not found! Try again or create account</h2>
    <Link to="/createAccount">Create Account</Link>
    </div>
  
  }
     


 

  </div>
  );
}
}

export default Login;