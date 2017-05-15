import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

const propTypes = {
  mode: React.PropTypes.bool,
  onLogin: React.PropTypes.func,
  onRegister: React.PropTypes.func
};
const defaultProps = {
  mode: true,
  onLogin: (id, pw) => { console.error("login function not defined"); },
  onRegister: (id, pw, email) => { console.error("register function not defined"); }
};

class Authentication extends Component {
    constructor(props) {
        super(props);

        this.state = {
          username: "",
          password: "",
          email: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(e) {
      let nextState = {};
      nextState[e.target.name] = e.target.value;
      this.setState(nextState);
    }

    handleLogin() {
      let id = this.state.username;
      let pw = this.state.password;

      this.props.onLogin(id, pw).then(
        (success) => {
          if(!success) {
            this.setState({
              password: ''
            });
          }
        }
      )
    }

    handleRegister() {
        let id = this.state.username;
        let pw = this.state.password;
        let email = this.state.email;

        this.props.onRegister(id, pw, email).then(
            (result) => {
                if(!result) {
                    this.setState({
                        username: '',
                        password: '',
                        email: ''
                    });
                }
            }
        );
    }

    handleKeyPress(e) {
       if(e.charCode==13) {
           if(this.props.mode) {
               this.handleLogin();
           } else {
               this.handleRegister();
           }
       }
   }

    render() {
        const inputForm = (
          <div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  name="username"
                  type="text"
                  className="validate"
                  onChange={this.handleChange}
                  value={this.state.username}
                  />
                <label>User name</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  name="password"
                  type="password"
                  className="validate"
                  onChange={this.handleChange}
                  value={this.state.password}
                  onKeyPress={this.handleKeyPress}
                  />
                <label>Password</label>
              </div>
            </div>
          </div>
        );

        const registerView = (<div>
          <div className="card-content">
            <div className="row">
                <form className="col s12">
                  <div className="row">
                    <div className="input-field col s12 inline">
                      <input
                        name="email"
                        type="email"
                        className="validate"
                        onChange={this.handleChange}
                        value={this.state.email}
                        />
                      <label data-error="wrong" data-success="right">Email</label>

                    </div>
                  </div>
                  {inputForm}
                  <div className="row">
                    <a className="waves-effect waves-light btn"
                      onClick={this.handleRegister}>CREATE</a>
                  </div>
                </form>
              </div>
            </div>
        </div>);

        const loginView = (<div>
          <div className="card-content">
            <div className="row">
                <form className="col s12">
                  {inputForm}
                  <div className="row">
                    <a className="waves-effect waves-light btn"
                      onClick={this.handleLogin}>SUBMIT</a>
                  </div>
                </form>
              </div>
            </div>
            <div className="footer">
              <div className="card-content">
                <div className="right">
                  New here? <Link to="/register">Create an account</Link>
                </div>
              </div>
            </div>
        </div>);

        return(
          <div className="container auth">
            <a className="logo">Jinx Memo</a>
            <div className="card">
              <div className="header grey darken-1 white-text center">
                <div className="card-content">{this.props.mode? "LOGIN" : "REGISTER"}</div>
              </div>
              {this.props.mode? loginView : registerView }
              </div>
            </div>
        );
    }
}
Authentication.propTypes = propTypes;
Authentication.defaultProps = defaultProps;
export default Authentication;
