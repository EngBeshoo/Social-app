import axios from "axios";

export async function signin(userData) {
  try {
    console.log("🔍 Attempting login with:", userData);
    
    
    let users = [];
    try {
      const storedUsers = localStorage.getItem('registeredUsers');
      users = storedUsers ? JSON.parse(storedUsers) : [];
      
    } catch (e) {
      console.error("❌ Error reading localStorage:", e);
      users = [];
    }
    
    
    const localUser = users.find(
      user => user.email === userData.email && user.password === userData.password
    );
    
    if (localUser) {     
      return {
        token: `mock-token-${Date.now()}`,
        user: {
          id: localUser.id,
          email: localUser.email,
          username: localUser.username,
          firstName: localUser.firstName || '',
          lastName: localUser.lastName || '',
        }
      };
    }
    
    console.log("⚠️ Local user not found, trying DummyJSON...");
    
    
    const loginData = {
      username: userData.email.split('@')[0],
      password: userData.password,
    };
    
    const { data } = await axios.post(
      `https://dummyjson.com/auth/login`,
      loginData
    );
    
    console.log("✅ DummyJSON login success:", data);
    return data;
    
  } catch (error) {
    console.error("❌ Login error:", error);
    
    let errorMessage = "Invalid email or password. Please try again.";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    throw new Error(errorMessage);
  }
}