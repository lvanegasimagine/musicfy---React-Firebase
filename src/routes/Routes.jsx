import React from "react";
import { Switch, Route } from "react-router-dom";

// * Pages
import Home from "../pages/Home";
import Settings from "../pages/Settings";

const Routes = ({user, setReloadApp}) => {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/artists" exact>
        <h1>Artistas</h1>
      </Route>
      <Route path="/settings" exact>
        <Settings user={user} setReloadApp={setReloadApp}/>
      </Route>
    </Switch>
  );
};

export default Routes;
