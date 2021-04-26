import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Player from "./components/Player/Player";
import Join from "./components/Join/Join";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Route path="/" exact component={Join}></Route>
        <Route path="/room" component={Player}></Route>
      </Router>
    </>
  );
}

export default App;
