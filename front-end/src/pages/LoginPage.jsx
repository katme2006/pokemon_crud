import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../utilities';

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin } = useOutletContext(); // Retrieve handleLogin method from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/v1/users/login/", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token); // Store the token
      api.defaults.headers.common["Authorization"] = `Token ${token}`;

      if (response.data) {
        handleLogin(response.data); // Update user state using handleLogin from App
      }
      navigate("/"); // Redirect to home on successful login
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid credentials or server error.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLoginFormSubmit}>
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
    </div>
  );
};

export default LoginPage;
