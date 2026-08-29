import axios from "axios";

export async function signUp(userData) {
  try {
    const { data } = await axios.post(
      "https://dummyjson.com/users/add",
      userData
    );
    
    const newUser = {
      email: userData.email,
      password: userData.password,
      username: userData.email.split('@')[0],
      firstName: userData.firstName,
      lastName: userData.lastName,
      id: data.id || Date.now(),
      registeredAt: new Date().toISOString()
    };
    
    let users = [];
    try {
      const storedUsers = localStorage.getItem('registeredUsers');
      users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (e) {
      users = [];
    }
    
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    console.log("✅ User saved locally:", newUser);
    console.log("✅ All users:", users);
    
    return data;
  } catch (error) {
    console.error("❌ Registration error:", error);
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      "An error occurred during registration";
    throw new Error(errorMessage);
  }
}