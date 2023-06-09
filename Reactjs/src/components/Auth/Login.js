import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import  {handleLogin}  from '../../services/userService';
import { userLoginSuccess } from '../../store/actions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        console.log(`username: ${this.state.username}`, `password: ${this.state.password}`);
        console.log(`all state: `, this.state);
        try {
            let data = await handleLogin(this.state.username, this.state.password);
            if(data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            } else if(data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
                console.log('Login succeeds');
            }
        } catch(error) {
            if(error.response) {
                if(error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className ="login-content row">
                        <div className = "col-12 text-login">Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username:</label>
                            <input type = "text" 
                            className='form-control' 
                            placeholder ="Enter your username"
                            onChange = {(event) => this.handleOnChangeUsername(event) }
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <div className = "custom-input-password">
                                <input type = {this.state.isShowPassword ? 'text' : 'password'}
                                className='form-control' 
                                placeholder ="Enter your password"
                                onChange = {(event) => this.handleOnChangePassword(event)}
                                />
                                <span onClick = {() => {this.handleShowHidePassword()}}>
                                    <i className= {this.state.isShowPassword ? "fa-solid fa-eye" : "fa-sharp fa-solid fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>
                        <div className = "col-12" style = {{color: 'red'}}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick = {() => {this.handleLogin()}}>
                                Login
                            </button>
                        </div>
                        <div className='col-12 text-right'>
                            <span className = "forgot-password">Forgot your password?</span>
                        </div>

                        <div className="col-12 text-center mt-3">
                            <span className='text-other-login'>Or Login with: </span>
                        </div>
                        <div className ="col-12 social-login">
                            <i className="fa-brands fa-facebook-f facebook"></i>
                            <i className="fa-brands fa-twitter twitter"></i>
                            <i className="fa-brands fa-google-plus-g google"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
