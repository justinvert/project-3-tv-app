import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';

import Login from "./Components/Login"
import Profile from "./pages/Profile";
import TV from "./pages/TV";

class App extends Component {
  state = {
    loggedIn: false,
    showLoginModal: false,
    userEmail: "",
  };

  componentDidMount() {
    fetch(process.env.REACT_APP_NODE_URL + "status", {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          this.setState({loggedIn: true, userEmail: result.email});
        }
      });
  }

  setLoggedIn(email) {
    this.setState({loggedIn: true, userEmail: email});
  }

  setLoggedOut() {
    this.setState({loggedIn: false, userEmail: ""});
  }

  pressLogout() {
    fetch(process.env.REACT_APP_NODE_URL + "logout", {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(result => {
        this.setState({loggedIn: false, userEmail: ""});
      });
  }

  renderMyProfile() {
    if (this.state.loggedIn) {
      return (
        <li className="nav-item">
          <NavLink to="/profile" exact className="nav-link" activeClassName="nav-link-active">My Profile</NavLink>
        </li>
      );
    }
  }

  renderUserEmail() {
    if (this.state.loggedIn) {
      return (
        <li className="nav-item">
          <span className="nav-email">{this.state.userEmail}</span>
        </li>
      );
    }
  }

  renderMenuLogin() {
    if (this.state.loggedIn) {
      return (
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={() => this.pressLogout()}>Logout</a>
        </li>
      );
    }

    return (
      <li className="nav-item">
        <a className="nav-link" href="#" onClick={() => this.setState({showLoginModal: true})}>Login</a>
      </li>
    );
  }

  hideLoginModal() {
    this.setState({showLoginModal: false})
  }

  render() {
    return (
        <Router>
          <Switch>
          <div>
            <nav className="navbar nav">
              <div className="container">
                <div className="nav">
                <img src="images/logo-icon-2.png" width="78" height="50"/>
                  <ul className="nav justify-content-end">
                    {this.renderUserEmail()}
                  </ul>
                </div>
                <ul className="nav justify-content-end">
                  <li className="nav-item">
                    <NavLink to="/" exact className="nav-link" activeClassName="nav-link-active">Search</NavLink>
                  </li>
                  {this.renderMyProfile()}
                  {this.renderMenuLogin()}
                </ul>
              </div>
            </nav>
             <PropsRoute exact path="/" component={TV} loggedIn={this.state.loggedIn} />
             <PropsRoute exact path="/profile" component={Profile} loggedIn={this.state.loggedIn} />
             <Login
              showLoginModal={this.state.showLoginModal}
              hideLoginModal={this.hideLoginModal.bind(this)}
              setLoggedIn={this.setLoggedIn.bind(this)}
              setLoggedOut={this.setLoggedOut.bind(this)}
            />
          </div>
          </Switch>
        </Router>
    );
  }
}

// https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
};

export default App;
