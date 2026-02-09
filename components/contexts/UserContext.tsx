"use client";

import { createContext, useContext, useState } from "react";

export const UserContext = createContext<any>(null);

export function UserProvider({
  children,
  user
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [currentUser, setCurrentUser] = useState(user || null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
