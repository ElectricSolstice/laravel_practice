import React, {Component} from 'react';
import ReactDom from 'react-dom';

import LoginData from './LoginData.js';

import * as Cookies from '../cookies.js';
import * as Helpers from '../helpers.js';
import {Messaging} from './MessageSystem.js';

export default class LoginForm extends Component {
    /*
     * props expected:
     *
     * url: link for logging in and getting login info by JSON response
     */
    constructor(props) {
        super(props);
        this.handleEmailChange = function (ev) {this.handleChange("email", ev)}.bind(this);
        this.handlePasswordChange = function (ev) {this.handleChange("password", ev)}.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.loginUpdate = this.loginUpdate.bind(this);
        this.login = new LoginData();
        this.state = {
            email: "",
            password: "",
            loggedIn: false,
            form: null
        }
    }

    render () {
        return this.state.form;
    }

    componentDidMount() {
        this.loginUpdate(null);
        this.login.subscribe(this.loginUpdate);
    }

    componentWillUnmount() {
        this.login.unsubscribe(this.loginUpdate);
    }

    handleChange(key, ev) {
        var newState = {};
        newState[key] = ev.target.value;
        this.setState(newState);
        ev.preventDefault();
    }

    loginUpdate (data) {
        var newForm;
        if (data != null && data.userName != null) {
            //TODO Add list of links (like view user's comments) to username link
            newForm = <div className="login">
                <a className="name">{data.userName}</a>
                <a href="#" onClick={this.handleLogout}>logout</a>
                </div>;
        } else {
            newForm = <form className="login" onSubmit={this.handleLogin}>
                <label>Email:</label><input type="email" onChange={this.handleEmailChange} id="email" />
                <label>Password:</label><input type="password" onChange={this.handlePasswordChange} id="password" />
                <button className="btn btn-primary" type="submit">Login</button>
                </form>;
        }
        this.setState({form : newForm});
    }

    handleLogin (ev) {
        ev.preventDefault();
        var request = Helpers.createRequest({
            email: this.state.email,
            password: this.state.password
        }, true);
        if (request == null) {
            console.log("Unable to create request for login.");
            return;
        }
        fetch(this.props.loginUrl, request).then(function (response) {
            response.json().then(function(data) {
                if (!data['status']) {
                    Messaging.message("Response error. Incorrect response received during login.");
                    console.warn("No status on login response. JSON response:",data);
                    return;
                }
                if (data['status'] != 'login') {
                    Messaging.message(data['message']);
                    return;
                }
                var loginData = {
                    userName: data['username'],
                    userId : data['user_id'],
                };
                this.login.setState(loginData);
            }.bind(this),
            function (err) {
                Messaging.message("Response error. Incorrect response received during login.");
                console.warn("Unable to parse JSON during login.", err);
            });
        }.bind(this), function(error) {
            console.log("Unable to fetch login for url: ", this.props.loginUrl,"request: ",request);
        }.bind(this));
    }

    handleLogout (ev) {
        var request = Helpers.createRequest({});
        if (request == null) {
            console.log("Unable to create request for logout.");
            location.reload();
            return;
        }
        fetch(this.props.logoutUrl, request).then(function (response) {
            response.json().then(function(data) {
                this.login.setState(null);
            }.bind(this));
        }.bind(this), function(error) {
            console.warn("Error in fetch of handleLogout");
        }.bind(this));
        ev.preventDefault();
    }
}

{
    var loginContainer = document.getElementById('login-form');
    ReactDom.render(<LoginForm loginUrl="/session/login" logoutUrl="/session/logout" />, loginContainer);
}
