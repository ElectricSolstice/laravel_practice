import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MessageDialog from './MessageDialog.js';

class MessageSystem {
    constructor() {
    }

    message(msg, title="") {
        this.system.setState({
            show: true,
            message: msg,
            title: title
        });
    }
}

class MessageSystemUI extends Component {
    /* props expected:
     *
     * access: MessageSystemInterface instance to allow non react
     *    components to use the dialog
     */
    constructor(props) {
        super(props);
        props.access.system = this;
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.state = {
            show: false,
            title: "",
            message: ""};
    }

    render() {
        return <MessageDialog show={this.state.show} message={this.state.message} title={this.state.title} onClose={this.close}/>;
    }

    close() {
        this.setState({show: false});
    }

    open() {
        this.setState({show: true});
    }
}

var dialogContainer = document.createElement("div");
export var Messaging = new MessageSystem();
document.getElementsByTagName("body")[0].appendChild(dialogContainer);
ReactDom.render(<MessageSystemUI access={Messaging} />, dialogContainer);
