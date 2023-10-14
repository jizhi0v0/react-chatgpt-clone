import React from 'react'
import ReactDOM from 'react-dom/client'
import ParentWindows from "./ParentWindows.jsx";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ParentWindows />
  </React.StrictMode>
);

