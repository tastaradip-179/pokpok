import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './firebaseConfig';
import store from './store'
import { Provider } from 'react-redux'
import 'tw-elements';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

