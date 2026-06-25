import React, { createContext, useState, useContext, useEffect } from 'react';

// This Context lets every page know "who is logged in" without
// passing the user down manually through every component.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On first load, check if we already have a logged-in user
  // saved in this browser tab (sessionStorage), so a page refresh
  // doesn't log the person out.
  useEffect(() => {
    const saved = sessionStorage.getItem('meetspace_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  function login(userData) {
    setUser(userData);
    sessionStorage.setItem('meetspace_user', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem('meetspace_user');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so pages can just call useAuth() instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext);
}
