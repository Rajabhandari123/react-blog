import React from 'react';
import '../App.css';
import { Route, Switch } from "react-router-dom";
import About from './about';
import Login from './RegisterLogin';


function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
