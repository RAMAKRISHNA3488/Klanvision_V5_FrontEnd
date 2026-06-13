import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  loading: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Attempt to load from current session
    const sessionStr = localStorage.getItem('klanvision_admin_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.user) {
          setUser(session.user);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
