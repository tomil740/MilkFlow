import { useState, useEffect } from "react";
import { auth, db } from "../../backEnd/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { authState } from "../states/authState";
import { User } from "../models/User";

const useAuth = () => {
  const [user, setUser] = useRecoilState(authState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    let res = false
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      setUser(userDoc.data() as User);
      res = true;
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      return res
    } finally {
      setLoading(false);
      return res
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    distributerId: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser: User = {
        name,
        uid: firebaseUser.uid,
        distributerId: distributerId,
        isDistributer: false,
        productsCollection:[]
      };
      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, register, logout };
};

export default useAuth;
