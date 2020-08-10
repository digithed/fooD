import React from 'react';
import axios from 'axios';

class Friends extends React.Component{

    state = {
        email: null,
        friend: true,
    }

    setEmail(e){
        this.setState({email: e.target.value});
    }

    addFriends(e){
        var data = {email: this.state.email, friend: this.props.name};
        axios.post("http://localhost:3001/addFriend", data)
        .then( (res) => {

        })
        .catch( (err) => {
            console.log(err);
        })
    }


    render(){
        return(
            <div>
                <form onSubmit={this.addFriends.bind(this)}>
                    <input className='sidebar' value={this.state.email} onChange={this.setEmail.bind(this)} placeholder="email" />
                    <input type="submit" value="Submit" />
                </form>
            </div>


        )
    }





}

export default Friends;