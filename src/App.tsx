import React from 'react';
import { Provider } from 'react-redux';
import Fields from './components/Fields';
import { Field } from './models';
import createApexForm from './react-apex/ApexForm';
import store from './store';

function App() {
  const Form = createApexForm<Field>();
  return (
    <Provider store={store}>
      <h1>React Apex</h1>
      <Form fieldLabels={{ label: 'Label', helpText: 'Help Text' }} />
      <Fields />
    </Provider>
  );
}

export default App;
