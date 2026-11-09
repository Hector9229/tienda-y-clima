import React, { useState, useEffect, createContext } from "react";
import { setToken, getToken, removeToken } from "../api/token";
import { useUser } from "../hooks/useUser";

// 1. Crear el contexto
export const AuthContext = createContext({
  auth: undefined,
  login: () => null,
  logout: () => null,
});

// 2. Crear el provider
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(undefined);
  const { getMe } = useUser();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setAuth(null);
      return;
    }

    login(token).catch(() => {
      // Si el token guardado ya no es válido, se limpia la sesión.
      removeToken();
      setAuth(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (token) => {
    setToken(token);
    const me = await getMe(token);
    setAuth({ token, me });
  };

  const logout = () => {
    removeToken();
    setAuth(null);
  };

  const valueContext = {
    auth,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={valueContext}>{children}</AuthContext.Provider>
  );
}
