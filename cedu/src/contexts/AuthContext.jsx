import { createContext, useContext, useState, useEffect } from "react";
import { getItem, setItem } from "../utils/storage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getItem("auth_user");
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const login = (email, role) => {
    const isTeacher = role === "teacher" && email === "teacher@example.com";
    const isStudent = role === "student" && email.trim() !== "";

    if (isTeacher || isStudent) {
      const userData = {
        id: isTeacher ? "teacher_1" : email,
        email: isTeacher ? email : email,
        role: role,
        name: isTeacher ? "Teacher" : `Student ${email}`,
      };
      setUser(userData);
      setItem("auth_user", userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
