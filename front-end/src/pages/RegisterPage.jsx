import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utilities.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async (e) => {
    e.preventDefault();
    try {
      let response = await api.post("v1/users/signup/", {
        email: email,
        password: password,
      });
      
      let token = response.data.token;
      
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;

      navigate("/"); // Navigate to home page after successful registration
    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration error (e.g., display an error message)
    }
  };

  return (
    <div>
      <h2>Register New User</h2>
      <form onSubmit={signUp}>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
