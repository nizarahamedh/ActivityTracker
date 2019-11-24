import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import ActRouter from './container/ActRouter';

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className="App">
          <ActRouter />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

