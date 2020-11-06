import React from 'react';
import { Provider } from 'react-redux';
import Fields from './components/Fields';
import store from './store';

function App() {
  
  return (
    <Provider store={store}>
      <h1>React Apex</h1>
      <Fields />
    </Provider>
  );
}

export default App;
