import React, { Component, PropTypes } from 'react';
import { Authentication } from '../components';
import { connect } from 'react-redux';
// import { loginRequest } from '../actions/authentication';
import * as authActions from '../modules/authentication';

import { bindActionCreators } from 'redux';


const propTypes = {
};
const defaultProps = {
};
class Login extends Component {
    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(id, pw) {
      const { AuthActions } = this.props;
      return AuthActions.loginRequest(id, pw).then(
        () => {
          if(this.props.status === "SUCCESS") {
            let loginData = {
              isLoggedIn: true,
              username: id
            };

            document.cookie = 'key=' + btoa(JSON.stringify(loginData));

            Materialize.toast('Welcome, ' + id + "!", 2000);
            this.props.history.push('/');
            return true;
          }else{
            let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
            Materialize.toast($toastContent, 2000);
            return false;
          }
        }
      )
    }
    render() {
        return(
            <div>
              <Authentication mode={true}
                onLogin={this.handleLogin}/>
            </div>
        );
    }
}
Login.propTypes = propTypes;
Login.defaultProps = defaultProps;

const mapStateToProps = (state) => {
  return {
    status: state.authentication.login.status
  };
}

const mapDispatchToProps = (dispatch) => ({
  AuthActions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
