import React, { Component, PropTypes } from 'react';
import { Header } from '../components';
const propTypes = {
};
const defaultProps = {
};
class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let re = /(login|register)/;
        console.log(this.props.location.pathname);
        let isAuth = re.test(this.props.location.pathname);
        console.log(isAuth);
        return(
          <div>
            { isAuth ? undefined : <Header/> }
            { this.props.children }
          </div>
        );
    }
}
App.propTypes = propTypes;
App.defaultProps = defaultProps;
export default App;
