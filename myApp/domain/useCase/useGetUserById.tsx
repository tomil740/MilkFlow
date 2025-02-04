import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { fetchUserById } from "../../data/remoteDao/userDao";
import { User } from "../models/User";
import { usersCacheState } from "../states/usersCacheState";

interface UserState {
  loading: boolean;
  error: string | null;
  data: User | null;
  syncedAt: number | null;
}

const useGetUserById = (userId: string) => {
  const [cache, setCache] = useRecoilState(usersCacheState);
  const [state, setState] = useState<UserState>({
    loading: false,
    error: null,
    data: null,
    syncedAt: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
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

      setState((prev) => ({ ...prev, loading: true }));

      try {
        const userData = await fetchUserById(userId);
        if (userData) {
          const syncedAt = Date.now();
          setCache((prev) => ({
            ...prev,
            [userId]: { data: userData, syncedAt },
          }));
          setState({ loading: false, error: null, data: userData, syncedAt });
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

    fetchUserData();
  }, [userId, cache, setCache]);

  return state;
};

export default useGetUserById;
