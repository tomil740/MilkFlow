import { useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../states/authState";
import { loginUser, registerUser, logoutUser } from "../../data/remoteDao/authDao";
import { User } from "../models/User";
import { SuperNiceLooking } from "../core/DeffaultData";


const useAuth = () => {
  const [user, setUser] = useRecoilState(authState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser(email, password);
      if (userData) {
        setUser({ ...userData, syncedAt: Date.now() });
        return true;
      } else {
        setError("User not found");
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    distributerId: string
  ) => {
    setLoading(true);
    setError(null);
    const newUser: User = {
      name,
      uid: "",
      distributerId,
      isDistributer: false,
      productsCollection: SuperNiceLooking,
    };
    try {
      const registeredUser = await registerUser(email, password, newUser);
      setUser(registeredUser);
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
      await logoutUser();
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
