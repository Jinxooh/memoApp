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
        return(
            <Header/>
        );
    }
}
App.propTypes = propTypes;
App.defaultProps = defaultProps;
export default App;
