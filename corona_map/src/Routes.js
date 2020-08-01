import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Login from './components/Login.js'
import Main from './components/Main.js'
import CreateAccount from './components/CreateAccount.js'

class Routes extends React.Component{

	render(){
		return(
			
			 <Switch>
                <Route path="/login" component={Login} />
                <Route path="/main" component={Main} />
                <Route path="/createAccount" component={CreateAccount} />
            </Switch>


			)

	}

}

export default Routes