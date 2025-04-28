import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = useCallback(async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.valid ? data.user : null);
    } catch (err) {
      console.error("Error verifying user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
