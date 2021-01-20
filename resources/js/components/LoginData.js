import * as Cookies from '../cookies.js';

export default class LoginData {
    /* Singleton class to keep track of login information used by the
     * client application to personalize a web page.
     * */
    constructor() {
        if (this.constructor.instance) {
            return this.constructor.instance;
        }
        this.constructor.instance = this;
        this.subscribers = new Set();
        this.userName = "";
        this.userId = null;
        this.loggedIn = false;
        this.setState = this.setState.bind(this);
        this.subsribe = this.subscribe.bind(this);
        this.unsubsribe = this.unsubscribe.bind(this);
        var userNameCookie = Cookies.getCookie("userName");
        if (userNameCookie  != null) {
            var data = {};
            data.userName = userNameCookie;
            data.userId = Cookies.getCookie("userId");
            this.setState(data);
        }
    }

    setState(data) {
        if (data && data.userName && data.userId) {
            this.userName = data.userName;
            Cookies.setCookie("userName", data.userName);
            this.userId = data.userId;
            Cookies.setCookie("userId", data.userId);
            this.loggedIn = true;
        } else {
            if (this.loggedIn == false) {
                //no need to update subscribers if already logged out
                return;
            }
            this.loggedIn = false;
            this.userName = null;
            Cookies.setCookie("userName", "");
            this.userId = null;
            Cookies.setCookie("userId", "");
        }
        this.subscribers.forEach(function (key, callback, set) {
            callback(this);
        }.bind(this));
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        if (this.loggedIn) {
            callback(this);
        }
    }

    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }
}

export function loginDidMount() {
    if (this.props.login) {
        this.props.login.subscribe(this.onLoginDataChange);
    }
}

export function loginWillUnmount() {
    if (this.props.login) {
        this.props.login.unsubscribe(this.onLoginDataChange);
    }
}
