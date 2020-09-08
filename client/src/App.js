import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Join from "./components/Join/Join";
import "./App.css";
// import firebase from "firebase";

function App() {
  // const firebaseApp = firebase.apps[0];
  return (
    <>
      {/* <Header>aaaa</Header> */}
      {/* <code>
        <pre>{JSON.stringify(firebaseApp.options, null, 2)}</pre>
      </code> */}
      <Router>
        <Route path="/" exact component={Join}></Route>
        <Route path="/chat" component={Chat}></Route>
      </Router>
    </>
  );
}

export default App;
