import { create } from "zustand";

// export const useUserStore = create((set) => ({
//   userStore: {},
//   setUser: (user) => set(() => set({ userStore: user })),
// }));

export const useUserStore = create((set) => ({
  userStore: { username: "", phone: "", type: "" },
  setUser: (user) => {
    set((state) => ({ userStore: { ...state.userStore, ...user } }));
  },
}));
