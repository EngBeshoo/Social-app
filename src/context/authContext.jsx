import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token) {
      setUserToken(token);
    }
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

 
  function updateUserData(data) {
    setUserData(data);
    localStorage.setItem('user', JSON.stringify(data));
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserToken(null);
    setUserData(null);
  }

  const value = {
    userToken,
    setUserToken,
    userData,
    setUserData,
    updateUserData, 
    logout,
    isAuthenticated: !!userToken,
    

    getUserName: () => {
      return userData?.firstName || userData?.name || 'User';
    },
    getUserFullName: () => {
      if (userData?.firstName && userData?.lastName) {
        return `${userData.firstName} ${userData.lastName}`;
      }
      return userData?.name || userData?.firstName || 'User';
    },
    getUserEmail: () => {
      return userData?.email || '';
    },
    getUserAvatar: () => {
      return userData?.avatar || `https://i.pravatar.cc/150?img=${userData?.id % 70 || 1}`;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}