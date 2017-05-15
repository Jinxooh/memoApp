import React, { Component, PropTypes } from 'react';
import Home from './Home';

const propTypes = {
};
const defaultProps = {
};
class Wall extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Home username={this.props.match.params.username}></Home>
        );
    }
}
Wall.propTypes = propTypes;
Wall.defaultProps = defaultProps;
export default Wall;
