import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ReactDom from 'react-dom';

export default class MessageDialog extends Component {
    /*
     * props expected:
     *
     * show: whether the dialog is visible or not
     * title: title of the dialog box
     * message: message within the dialog box
     * onClose: function to handle when the dialog is closed
     */
    constructor(props) {
        super(props);
    }

    render() {
        return (<Modal backdrop="static" show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
            
                <Modal.Body>
                    <p>{this.props.message}</p>
                </Modal.Body>
            
                <Modal.Footer>
                    <Button variant="primary" onClick={this.props.onClose}>Close</Button>
                </Modal.Footer>
            </Modal>);
    }
}
