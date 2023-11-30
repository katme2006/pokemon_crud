import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utilities';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("users/login/", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token); // Store the token
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      navigate("/"); // Redirect to home on successful login
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid credentials or server error.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Log In</button>
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
    </form>
  );
};

export default LoginForm;
