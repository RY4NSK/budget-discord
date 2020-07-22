import { Button, Toaster } from "@blueprintjs/core";
import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import './App.css';
import { FirebaseContext } from './firebase-context';
import { Main } from "./Main/Main";
import { UserDataContext, UserData } from "./user-data-context";

export const toaster = Toaster.create();

const provider = new firebase.auth.GoogleAuthProvider();

function GoogleSignInComponent() {

  let [isSigningIn, setIsSigningIn] = React.useState(false);
  let [user, setUser] = React.useState<firebase.User | null>(null)

  const firebase = React.useContext(FirebaseContext);

  const signIn = React.useCallback(() => {
    setIsSigningIn(true)
    firebase.auth().signInWithPopup(provider).then((result: firebase.auth.UserCredential) => {
      setIsSigningIn(false)
    }).catch((error: firebase.auth.AuthError) => {
      setIsSigningIn(false)
    })
  }, [firebase]);

  const signOut = React.useCallback(() => {
    setIsSigningIn(true)
    firebase.auth().signOut().then(() => {
      setUser(null)
      setIsSigningIn(false)
    })
  }, [firebase])

  return (
    <>
      <Button onClick={user ? signOut : signIn} loading={isSigningIn}>{user ? "Sign Out" : "Sign In With Google"}</Button>
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
    {userData ? <UserDataContext.Provider value={userData}>
      <Main></Main>
    </UserDataContext.Provider> : <Login></Login>}
  </>);
}

export default App;
