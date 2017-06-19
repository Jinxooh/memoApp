import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { App, Home, Login, Register, Wall } from './containers';

import { Provider } from 'react-redux';
import store from './store';

const rootElement = document.getElementById('root');
const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route exact path="/" component={App}/>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route path="/wall/:username" component={Wall}/>
          <Route path="/" component={Home}/>
        </Switch>
      </div>
    </Router>
  </Provider>, rootElement);
