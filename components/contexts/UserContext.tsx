"use client";

import { UserType } from "@/types/types";
import { createContext, useContext, useState } from "react";

export const UserContext = createContext<any>(null);

export function UserProvider({
  children,
  user
}: {
  children: React.ReactNode;
  user:UserType ;
}) {
  const [currentUser, setCurrentUser] = useState(user || null);
  // console.log(user);
  

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
