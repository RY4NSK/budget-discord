import { Button, Colors, Toaster } from "@blueprintjs/core";
import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect, Route, Switch, useHistory, useLocation
} from "react-router-dom";
import './App.css';
import { FirebaseContext } from './firebase-context';
import { Main } from "./Main/Main";
import { ThemeContext } from "./theme-context";
import { UserData } from "./user-data-context";

export const toaster = Toaster.create();

const provider = new firebase.auth.GoogleAuthProvider();

function GoogleSignInComponent() {
  const history = useHistory();
  let location = useLocation();

  let [isSigningIn, setIsSigningIn] = React.useState(false);

  const firebase = React.useContext(FirebaseContext);

  const signIn = React.useCallback(() => {
    setIsSigningIn(true)
    firebase.auth().signInWithPopup(provider).then((result: firebase.auth.UserCredential) => {
      let from = (location.state as any).pathname as any || "/";
      history.replace(from)
    }).catch((error: firebase.auth.AuthError) => {
      setIsSigningIn(false)
    })
  }, [firebase, history, location.state]);

  return (
    <>
      <Button onClick={signIn} loading={isSigningIn}>{"Sign In With Google"}</Button>
    </>
  )
}

function Login() {
  return (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <div>
      <GoogleSignInComponent></GoogleSignInComponent>
    </div>
  </div>)
}

function App() {
  let [userData, setUserData] = React.useState<UserData | null>(null);
  let [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);
  let [userDataSnapshotUnsubscriber, setUserDataSnapshotUnsubscriber] = React.useState<(() => void) | null>(null);
  const firebase = React.useContext(FirebaseContext);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async userAuth => {
      console.log(userAuth)
      if (userAuth) {
        if (!await (await firebase.firestore().collection("users").doc(userAuth.uid).get()).exists) {
          firebase.firestore().collection("users").doc(userAuth.uid).set({
            nickname: userAuth.displayName,
            status: "New User",
            timezone: null
          })
        }
        setUserDataSnapshotUnsubscriber(
          prev => firebase.firestore().collection("users").doc(userAuth.uid).onSnapshot(doc => {
            setUserData(doc.data() as UserData);
          })
        );
      } else {
        setUserData(null)
        if (userDataSnapshotUnsubscriber) {
          console.log("this was actually a good thing yay!")
          userDataSnapshotUnsubscriber()
          setUserDataSnapshotUnsubscriber(null)
        }
      }
    });
  }, [firebase]);

  return (<>
    <Router>
      <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
        <div className={isDarkMode ? "bp3-dark" : ""} style={isDarkMode ? { backgroundColor: Colors.DARK_GRAY4 } : {}}>
          <Switch>
            <Route
              path="/login"
              render={({ location }) =>
                !(firebase.auth().currentUser && userData) ? (
                  <Login></Login>
                ) : (
                    <Redirect
                      to={{
                        pathname: "/",
                        state: { from: location }
                      }}
                    />
                  )
              }
            />
            <Route
              path="/"
              render={({ location }) =>
                firebase.auth().currentUser && userData ? (
                  <Main></Main>
                ) : (
                    <Redirect
                      to={{
                        pathname: "/login",
                        state: { from: location }
                      }}
                    />
                  )
              }
            />
          </Switch>
        </div>
      </ThemeContext.Provider>
    </Router>
  </>);
}

export default App;
