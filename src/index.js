import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./App";

const App = () => (
  <Router>
    <div>
      <Route path="/" exact component={() => <Main isIndex />} />
      <Route
        path="/:id/"
        exact
        render={(props) => <Main match={props.match} isIndex={false} />}
      />
      <Route
        path="/:id/:id2"
        exact
        render={(props) => <Main match={props.match} isIndex={false} />}
      />
      <Route
        path="/:id/:id2/:start_key"
        exact
        render={(props) => <Main match={props.match} isIndex={false} />}
      />
    </div>
  </Router>
);
ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
