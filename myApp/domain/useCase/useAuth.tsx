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

 const login = async (email: string, password: string): Promise<boolean> => {
   setLoading(true);
   setError(null);
   let res = false;

   try {
     const { user: firebaseUser } = await signInWithEmailAndPassword(
       auth,
       email,
       password
     );

     const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
     if (userDoc.exists()) {
       const userData = userDoc.data() as User;

       // Include the current timestamp as syncedAt
       const updatedUser = {
         ...userData,
         syncedAt: Date.now(), // Store timestamp for sync tracking
       };

       setUser(updatedUser);
       res = true;
     } else {
       setError("User not found");
     }
   } catch (err: any) {
     setError(err.message);
     setUser(null);
   } finally {
     setLoading(false);
     return res;
   }
 };


  const register = async (
    email: string,
    password: string,
    name: string,
    distributerId: string,
  ) => {
    const privateCustomerProducts = [
      60301, 60391, 90811, 60507, 60607, 71018, 70128, 71006, 80520, 61307,
      61005, 91303, 91201, 91221,
    ];
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
        productsCollection: privateCustomerProducts,
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
