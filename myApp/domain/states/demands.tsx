import { atom, DefaultValue } from "recoil";

const loadFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key); 
  return data ? JSON.parse(data) : [];
};

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const activeDemandsState = atom({
  key: "activeDemandsState",
  default: loadFromLocalStorage("activeDemands"),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (!(newValue instanceof DefaultValue)) {
          saveToLocalStorage("activeDemands", newValue);
        }
      });
    },
  ],
});

export const pendingDemandsState = atom({
  key: "pendingDemandsState",
  default: loadFromLocalStorage("pendingDemands"),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (!(newValue instanceof DefaultValue)) {
          saveToLocalStorage("pendingDemands", newValue);
        }
      });
    },
  ],
});

export const completedDemandsState = atom({
  key: "completedDemandsState",
  default: loadFromLocalStorage("completedDemands"),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (!(newValue instanceof DefaultValue)) {
          saveToLocalStorage("completedDemands", newValue);
        }
      });
    },
  ],
});
