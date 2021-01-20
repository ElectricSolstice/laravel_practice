import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent, render} from '@testing-library/react';
//import fetchMock from 'jest-fetch-mock';

jest.mock('../helpers.js');
const helpers = require('../helpers.js');
import * as MessageUI from '../components/MessageUI.js';
//import LoginData from '../components/LoginData.js';

class MockUI extends React.Component {
    constructor (props) {
        super(props);
        MessageUI.construct(this);
        this.refreshCalled = false;
        this.toggle = this.toggle.bind(this);
        this.createMsg = this.createMsg.bind(this);
    }

    toggle() {
        this.toggleMessageForm();
    }

    createMsg () {
        MessageUI.createMessage(this, 'owner', 'messages', function () {
            //function that returns an empty request body
            return {};
        });
    }

    render () {
        let formState;
        if (this.state.formOpen) {
            formState = <button id="mockUi" onClick={this.createMsg}>Open</button>
        } else if (!this.state.formOpen) {
            formState = <button id="mockUi">Closed</button>
        } else {
            formState = <button id="mockUi">Undefined</button>
        }
        return <div>
                {formState}
                <button id="mockToggle" onClick={this.toggle}>Toggle</button>
            </div>;
    }

    refreshMessageForm () {
        this.refreshCalled = true;
    }
};

test('Toggle message form', () => {
    render(<MockUI />);
    let testVal = document.getElementById('mockUi');
    //Default state of form is expected to be closed
    expect(testVal.textContent).toEqual('Closed')

    //Test that toggling the form state works
    let button = document.getElementById('mockToggle');
    fireEvent.click(button);
    expect(testVal.textContent).toEqual('Open')
    fireEvent.click(button);
    expect(testVal.textContent).toEqual('Closed')
    fireEvent.click(button);
    expect(testVal.textContent).toEqual('Open')
});

test('Create button sends request', () => {
    //mock restCreate to avoid needing authorization
    // of a login
    helpers.restCreate.mockImplementation(() => {
    });

    render(<MockUI />);

    //Open form and quickly check it's open
    let toggle = document.getElementById('mockToggle');
    fireEvent.click(toggle);
    let create = document.getElementById('mockUi');
    expect(create.textContent).toEqual('Open')

    //create mock location for createMessage to get information from
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
        value: {
            pathname: "/owner/42"
        }
    });


    //Test out that the right request is sent
    fireEvent.click(create);
    expect(helpers.restCreate).toHaveBeenCalledTimes(1);
    let expectedURL = "/session/owner/42/messages/create";
    //Ensure that the request was sent to the expected url
    expect(helpers.restCreate.mock.calls[0][0]).toBe(expectedURL);
});
