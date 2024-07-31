"use client";

import { UserType } from "@/types/user";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type UserContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
};

const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const useUser = () => {
  return useContext(UserContext);
};

export function UserProvider({
  userProp,
  children,
}: {
  userProp: UserType | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserType | null>(userProp);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
