"use client";
import { createContext, useState } from "react";


export const UserDetailContext = createContext(null);


export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState();

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};
