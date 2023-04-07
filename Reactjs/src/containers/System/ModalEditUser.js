import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {emitter} from '../../utils/emitter';
import _ from 'lodash';
class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: ''
            })
        });
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if(user && !_.isEmpty(user)) {
            this.setState({
                email: user.email,
                password: 'hardcode',
                firstName: user.firstName,
                lastName: user.lastName,
                address:user.address
            })
        }
        console.log('didmount edit modal ', this.props.currentUser);
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnchangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }

    checkValidInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for(let i = 0; i < arrInput.length; i++) {
            if(!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleAddNewUser = () => {
        let isValid = this.checkValidInput();
        if(isValid) {
            this.props.createNewUser(this.state, 'abc');
            this.toggle();
        }
    }

    render() {
        console.log('check props from parent: ', this.props);
        return (
            
            <Modal 
                isOpen={this.props.isOpen} 
                toggle={this.toggle} 
                className = {'modal-user-container'}
                size = "lg"
            >
            <ModalHeader 
            toggle={this.toggle}
            >Edit a new user
            </ModalHeader>
            <ModalBody>
                <div className = "modal-user-body">
                    <div className = "input-container">
                        <label>Email</label>
                        <input 
                        type ="text" 
                        onChange ={(event) => {this.handleOnchangeInput(event, "email");}}
                        value ={this.state.email}
                        />                            
                    </div>
                    <div className = "input-container">
                        <label>Password</label>
                        <input 
                        type ="password" 
                        onChange ={(event) => {this.handleOnchangeInput(event, "password");}}
                        value = {this.state.password}
                        />                            
                    </div>
                    <div className = "input-container">
                        <label>First Name</label>
                        <input 
                        type ="text" 
                        onChange ={(event) => {this.handleOnchangeInput(event, "firstName");}}
                        value={this.state.firstName}
                        />                            
                    </div>
                    <div className = "input-container">
                        <label>Last Name</label>
                        <input 
                        type ="text" 
                        onChange ={(event) => {this.handleOnchangeInput(event, "lastName");}}
                        value={this.state.lastName}
                        />                            
                    </div>
                    <div className = "input-container max-width-input">
                        <label>Address</label>
                        <input 
                        type ="text" 
                        onChange ={(event) => {this.handleOnchangeInput(event, "address");}}
                        value={this.state.address}
                        />                            
                    </div>
                </div>

            </ModalBody>
            <ModalFooter>
            <Button 
            color="primary" 
            className = "px-3" 
            onClick={this.handleAddNewUser}>
                Save change
            </Button>{' '}
            <Button color="secondary" className = "px-3" onClick={this.toggle}>
                Close
            </Button>
            </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);

