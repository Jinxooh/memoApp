import React, { Component, PropTypes } from 'react';
import { Authentication } from '../components';
import { connect } from 'react-redux';
// import { registerRequest } from '../actions/authentication';
import * as authActions from '../modules/authentication';

import { bindActionCreators } from 'redux';

const propTypes = {
};
const defaultProps = {
};
class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister(id, pw, email) {
        const { AuthActions } = this.props;
        return AuthActions.registerRequest(id, pw, email).then(
            () => {
                if(this.props.status === "SUCCESS") {
                    Materialize.toast('Success! Please log in.', 2000);
                    this.props.history.push('/login');
                    return true;
                } else {
                    /*
                        ERROR CODES:
                            1: BAD USERNAME
                            2: BAD PASSWORD
                            3: USERNAME EXISTS
                    */
                    let errorMessage = [
                        'Invalid Username',
                        'Password is too short',
                        'Email is wrong or already exist',
                        'Username already exists'
                    ];

                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }

    render() {
        return(
            <div>
              <Authentication mode={false}
                onRegister={this.handleRegister}/>
            </div>
        );
    }
}
Register.propTypes = propTypes;
Register.defaultProps = defaultProps;

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errorCode: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
