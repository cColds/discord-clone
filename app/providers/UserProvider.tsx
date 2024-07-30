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

// Provide a default context value matching UserContextType structure
const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {}, // Placeholder function, will be overridden by actual useState hook
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
