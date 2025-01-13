import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";
import { User } from "../models/User";
import { usersCacheState } from "../states/usersCacheState";

const useGetUserById = (userId: string) => {
  const [cache, setCache] = useRecoilState(usersCacheState);
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: User | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  const fetchUser = async () => {
    if (cache[userId]) {
      setState({ loading: false, error: null, data: cache[userId] });
      return;
    }

    setState({ loading: true, error: null, data: null });
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setCache((prev) => ({ ...prev, [userId]: userData }));
        setState({ loading: false, error: null, data: userData });
      } else {
        throw new Error("User not found");
      }
    } catch (err: any) {
      setState({ loading: false, error: err.message, data: null });
    }
  };

  // Fetch user data when the hook is initialized
  useEffect(() => {
    fetchUser();
  },[userId]);

  return state;
};

export default useGetUserById;
