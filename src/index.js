import React from 'react'
import ReactDOM from 'react-dom/client'
import ParentWindows from "./ParentWindows.jsx";
import './index.css';
import store from "./store";
import { Provider} from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <ParentWindows />
      </Provider>
  </React.StrictMode>
);

