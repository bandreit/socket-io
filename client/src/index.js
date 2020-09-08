import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// import firebase from "firebase";

// firebase.initializeApp({
//   apiKey: "AIzaSyAcsqh7hW-GjzJSNJrW5AgpGPXnCL0fdxg",
//   authDomain: "sync-yt-player.firebaseapp.com",
//   databaseURL: "https://sync-yt-player.firebaseio.com",
//   projectId: "sync-yt-player",
//   storageBucket: "sync-yt-player.appspot.com",
//   messagingSenderId: "758401482810",
//   appId: "1:758401482810:web:e9f9e8ec3a5ddc5c27f503",
// });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
