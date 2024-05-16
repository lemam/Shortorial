import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Member from "../constants/types";
import { getMemberInfo } from "../apis/login";
import { getAccessToken } from "../modules/auth/accessToken";
import parseJwt from "../modules/auth/parseJwt";

interface LoginState {
  loginMemberIdx: number;
  loginMember: Member | null;
  setLoginMemberIdx: (by: number) => void;
  setLoginMember: (bt: Member | null) => void;
  getIsLogin: () => boolean;
  updateLoginMember: () => Promise<void>;
  logout: () => void;
}

const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      loginMemberIdx: 0,
      loginMember: null,
      setLoginMemberIdx: (by: number) => set(() => ({ loginMemberIdx: by })),
      setLoginMember: (by) => set(() => ({ loginMember: by })),
      getIsLogin: () => {
        const token = getAccessToken();
        if (token) {
          const exp = parseJwt(token).exp;
          const curr = (new Date().getTime() - new Date().getMilliseconds()) / 1000;
          return exp >= curr;
        }
        return false;
      },

      //로그인 회원 정보 업데이트
      updateLoginMember: async () => {
        try {
          const data = await getMemberInfo();
          get().setLoginMemberIdx(data?.idx);
          get().setLoginMember(data?.info);
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === "500") {
              throw error;
            }
          }
        }
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        get().setLoginMemberIdx(0);
        get().setLoginMember(null);
      },
    }),
    {
      name: "login-state",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useLoginStore;
