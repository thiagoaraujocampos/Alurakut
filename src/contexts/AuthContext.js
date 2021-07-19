import { createContext, useState } from 'react';
import Router from 'next/router';
import firebase from '../lib/firebase';
import nookies from "nookies";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  async function signin() {
    try {
      setLoading(true);
      const result = await firebase
        .auth()
        .signInWithPopup(
          new firebase.auth.GithubAuthProvider()
        );

      if(result.additionalUserInfo) {
        const {id, login, avatar_url} = result.additionalUserInfo.profile;
        if (!login || !avatar_url) {
          throw new Error("Missing information from Github Account");
        }
        
        const user = {
          id, 
          username: login, 
          name,
          avatar_url,
        };

        setUser(user);
        nookies.set(null, "CURRENT_USER", JSON.stringify(user), {
          path: "/",
          maxAge: 86400 * 7,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const signout = () => {
    try {
      Router.push('/login')

      return firebase
        .auth()
        .signOut()
        .then(() => setUser(false));
    } finally {
      setLoading(false);
    }
  }
  
  return ( 
    <AuthContext.Provider value={{
      user,
      loading,
      signin,
      signout
    }}> {children} </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer;