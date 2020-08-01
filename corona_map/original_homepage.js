      <div className="App">
      {!this.state.ready &&
        <div>
      <Dropdown onChange={this.redirect.bind(this)} options={['Login']}/>
      <h1 align="left">fooD</h1>
      <FadeIn delay={100}>
      <img className="fade" align="center" src="https://lh4.googleusercontent.com/-5aPBXHo64zXp18N9rfFH7UxJQbgYXCJZEReI0XXmYgDzbh_Rp1uH91l-05ZcGppb_4fAnVlecJJO1MiNqI8dls0ah6omP03-NB1M7DMIvMzr5fWezvj8hv3lRH0Dq0-zrbupOkG" />
      </FadeIn>
      </div>
    }

      <Routes />

      {this.state.ready &&
      <Router>
      <Switch>
      <Route path="/login">
      <Login />
    </Route>
    </Switch>
    <Redirect to='/login' />
   
    </Router>
   
      }


      </div>