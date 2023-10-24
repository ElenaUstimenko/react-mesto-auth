import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from '../src/components/App';
import reportWebVitals from './reportWebVitals';
// импортируем BrowserRouter, чтобы пользоваться Routes
import { HashRouter } from 'react-router-dom'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter> 
    <App />
    </HashRouter> 
  </React.StrictMode>
);

reportWebVitals();
