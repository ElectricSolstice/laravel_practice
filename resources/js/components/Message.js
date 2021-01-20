//React imported for creating components in onLoginDataChange
import React from 'react';

import {loginDidMount, loginWillUnmount} from './LoginData.js';
import * as Helpers from '../helpers.js';

export function construct(message) {
    /*
     * Expected methods on message:
     *
     * deleteMessage(): rest api call to delete itself from the database. It should call
     *      this file's deleteMessage to pass deletion onto any components containing it.
     *
     * Available state properties:
     *
     * messageActions: can be used in render to give basic actions like a delete button
     */
    message.state = {
        messageActions: null,
        deleted: false
    }
    message.onLoginDataChange = onLoginDataChange.bind(message);
    message.deleteMessage = message.deleteMessage.bind(message);
    message.componentDidMount = loginDidMount.bind(message);
    message.componentWillUnmount = loginWillUnmount.bind(message);
}

function onLoginDataChange(data) {
    var newMessageActions = null;
    if (this.props.login) {
        if (this.props.login.userName == this.props.userName) {
            newMessageActions = <div className="messageActions">
                <button onClick={this.deleteMessage}>Delete</button>
                </div>;
        }
    }
    this.setState({
        messageActions: newMessageActions
    });
}

export function deleteMessage(url, message) {
    Helpers.restDelete(url, message);
    if (message.props.onDelete) {
        message.props.onDelete(message);
    }
}

export function mountMessages (elementsName, createUi, createScrolling) {
    let lazyContainer = document.getElementById(elementsName);
    if (lazyContainer) {
        let uiContainer = document.getElementById(elementsName+'-ui');
        let observeMessageCreation = null;
        if (uiContainer) {
            observeMessageCreation = createUi(uiContainer);
        }
        createScrolling(lazyContainer, observeMessageCreation);
    }
}
