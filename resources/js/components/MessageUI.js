import {loginDidMount, loginWillUnmount} from './LoginData.js';
import * as Helpers from '../helpers.js'

export function construct(messageUi) {
    /* 
     * Expected  methods on messageUi:
     *
     * refreshMessageForm: Sets form fields to the default values.
     *
     * Available state properties:
     *
     * formOpen: boolean that determines if the form is open or not
     * loggedIn: boolean that determines if you're logged in or not
     */
    messageUi.toggleMessageForm = toggleMessageForm.bind(messageUi);
    messageUi.onLoginDataChange = onLoginDataChange.bind(messageUi);
    messageUi.componentDidMount = loginDidMount.bind(messageUi);
    messageUi.componentWillUnmount = loginWillUnmount.bind(messageUi);
    messageUi.state = {
        formOpen: false,
        loggedIn: false
    };
}

function onLoginDataChange (data) {
    this.setState({
        loggedIn: data.loggedIn
    });
}

function toggleMessageForm() {
    this.refreshMessageForm();
    if (this.state.formOpen) {
        this.setState({
            formOpen: false
        });
    } else {
        this.setState({
            formOpen: true
        });
    }
}

export function createMessage(caller, ownerTypeStr, messageTypeStr, createRequest, creationCallback=null) {
    var ownerStr = '\/'+ownerTypeStr+'\/';
    var idMatch= new RegExp(ownerStr+"\\d+");
    var messageId = idMatch.exec(location.pathname);
    if (messageId != null) {
        messageId = messageId[0].substring(ownerStr.length);
        var url = '/session'+ownerStr+messageId+'/'+messageTypeStr+'/create'
        var requestBody = createRequest();
        Helpers.restCreate(url, requestBody, caller, 
            function () {
                caller.toggleMessageForm();
                if (creationCallback != null) {
                    creationCallback();
                }
            });
    }
}

export function messageFormClasses() {
    return "messageForm";
}
