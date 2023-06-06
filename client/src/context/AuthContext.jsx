import { createContext, useState, useEffect } from "react";

const AuthContext = createContext()

export default AuthContext

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}