import * as Cookies from './cookies.js';
import {Messaging} from './components/MessageSystem.js';

import Modal from 'react-bootstrap/Modal';
import ReactDom from 'react-dom';

export function createRequest(requestBody=null, notifyUserOfError=false) {
    var xsrfToken = Cookies.getCookie('XSRF-TOKEN');
    if (xsrfToken == null) {
        if (notifyUserOfError) {
            Messaging.message("Cookies are required for functionality on this website. Please turn on cookies and refresh the page.", "Cookies Required");
        }
        console.log("XSRF-TOKEN cookie not found");
        return null;
    }
    var request = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            //decodeURIComponent to fix a payload invalid error in regards to the token. It seems a
            //  '%3D' at the end needs to be converted to '=' in order for it to not cause an error.
            //  Solution taken from
            //  https://stackoverflow.com/questions/44652194/laravel-decryptexception-the-payload-is-invalid
            'X-XSRF-TOKEN': decodeURIComponent(xsrfToken)
        }
    };
    if (requestBody != null) {
        request['body'] = JSON.stringify(requestBody);
    }
    return request;
}

function restCall(url, requestBody, successStatus, component, successCallback) {
    var request = createRequest(requestBody);
    if (request == null) {
        return;
    }
    if (component.props.login && component.props.login.userId) {
        fetch(url, request).then(response => response.json()
        ).then(function (data) {
            if (data['status'] == successStatus) {
                if (successCallback) {
                    successCallback();
                }
            } else {
                console.log("Unsuccesful fetch in restCall for url:", url, "request:" ,request);
            }
        }.bind(component));
    } else {
        console.log("User required to be logged in for restCall.");
    }
}

export function restDelete(url, component) {
    restCall(url, null, "deleted", component, function() {
        component.setState({
            deleted: true
        });
    });
}

export function restCreate(url, requestBody, component, creationCallback=null) {
    restCall(url, requestBody, "created", component, creationCallback);
}

export class PubSub {
    constructor() {
        this.subscribers = new Set();

        this.publish = this.publish.bind(this);
        this.subsribe = this.subscribe.bind(this);
        this.unsubsribe = this.unsubscribe.bind(this);
    }

    publish(data) {
        this.subscribers.forEach(function (key, callback, set) {
            callback(data);
        }.bind(this));
    }

    subscribe(callback) {
        this.subscribers.add(callback);
    }

    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

}
