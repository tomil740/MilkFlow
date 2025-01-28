import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";
import { AuthUser, User } from "../models/User";
import { usersCacheState } from "../states/usersCacheState";

const useGetUserById = (userId: string) => {
  const [cache, setCache] = useRecoilState(usersCacheState);
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: User | null;
    syncedAt: number | null; // Initialize as null to check if a sync happened
  }>({
    loading: false,
    error: null,
    data: null,
    syncedAt: null,
  });

  const fetchUser = async () => {
    if (cache[userId]) {
      const cachedUser = cache[userId];
      setState({
        loading: false,
        error: null,
        data: cachedUser.data,
        syncedAt: cachedUser.syncedAt,
      });
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;

        // Cache the user data with the current timestamp as syncedAt
        const syncedAt = Date.now();
        setCache((prev) => ({
          ...prev,
          [userId]: { data: userData, syncedAt },
        }));

        setState({ loading: false, error: null, data: userData, syncedAt });
      } else {
        throw new Error("User not found");
      }
    } catch (err: any) {
      setState({
        loading: false,
        error: err.message,
        data: null,
        syncedAt: null,
      });
    }
  };

  // Fetch user data when the hook is initialized
  useEffect(() => {
    fetchUser();
  }, [userId]);

  return state;
};

export default useGetUserById;