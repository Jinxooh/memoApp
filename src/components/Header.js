import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

const propTypes = {
  isLoggedIn: React.PropTypes.bool,
  onLogout: React.PropTypes.func
};
const defaultProps = {
  isLoggedIn: true,
  onLogout: () => { console.error(" onLogout not defined");}
};
class Header extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const fontSize = { fontSize : "25px" };

        const loginBtn = (
          <li>
            <Link to="login">
              <i className="material-icons">perm_identity</i>
            </Link>
          </li>
        );

        const logoutBtn = (
          <li>
            <a onClick={this.props.onLogout}>
              <i className="material-icons">lock_open</i>
            </a>
          </li>
        );

        return(
            <div>
              <nav>
                <div className="nav-wrapper teal lighten-1">
                  <div>
                    <ul>
                      <li><Link to="/" style={fontSize}><i className="material-icons left oragne6000">face</i>Jinx Memo</Link></li>
                    </ul>
                  </div>

                  <div className="right">
                    <ul>
                      <li><Link to="home"><i className="material-icons">search</i></Link></li>
                      { this.props.isLoggedIn ? logoutBtn : loginBtn }
                      <li><Link to="register"><i className="material-icons">more_vert</i></Link></li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
        );
    }
}
Header.propTypes = propTypes;
Header.defaultProps = defaultProps;
export default Header;
