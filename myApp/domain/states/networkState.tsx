import { atom } from "recoil";

export const networkState = atom({
  key: "networkState", // Unique ID for this atom
  default: true, // Default state is "connected"
});
