import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// Create the persistence handler
const { persistAtom } = recoilPersist({
  key: "usersCacheState", // Key to store in local storage
  storage: localStorage, // Default is localStorage; you can also use sessionStorage
});

export const usersCacheState = atom<Record<string, any>>({
  key: "usersCacheState",
  default: {},
  effects_UNSTABLE: [persistAtom], // Attach the persistence effect
});
