import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import App from './App';
import * as serviceWorker from './serviceWorker';
import fbApp, { FirebaseContext } from './firebase-context';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={fbApp}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
