"use client";

import { UserType } from "@/src/types/types";
import { createContext, useState } from "react";

export const UserContext = createContext<{ currentUser: UserType; setCurrentUser: (user: UserType) => void } | null>(null);

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

