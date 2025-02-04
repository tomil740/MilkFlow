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
    const soperNiceLooking = [
      90108, 90109, 90112, 90106, 80108, 90110, 90116, 80104, 91110, 91144,
      91102, 91118, 91134, 80209, 80201, 80611, 80601, 80636, 80622, 80618,
      80710, 80701, 80713, 80721, 80509, 80502, 80516, 80505, 80519, 80520,
      90953, 90952, 80511, 80513, 90802, 90811, 80301, 80310, 80405, 80635,
      80605, 80305, 80302, 81103, 91342, 91309, 91306, 80621, 80670, 91101,
      91124, 91314, 91112, 91141, 91143, 81102, 91132, 80807, 81010, 91004,
      91103, 91115, 90812, 90805, 90810, 91154, 80409, 80402, 80404, 80406,
      91218, 90903, 90906,
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
        productsCollection: soperNiceLooking,
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
