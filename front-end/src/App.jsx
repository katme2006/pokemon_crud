import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { api } from './utilities';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastVisited = useRef();
  const [user, setUser] = useState(null);

  // Function to handle user logout

  const handleLogin = async (userData) => {
    setUser(userData); // Set the logged-in user
    navigate("/");    // Navigate to the home page
  };


  const logOut = async () => {
    try {
      const response = await api.post("/v1/users/logout/");
      if (response.status === 204) {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Function to check user authentication status
  const whoAmI = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      try {
        let response = await api.get("api/v1/users/whoami/");
        if (response.data.email) {
          setUser(response.data); // Set user data
          if (lastVisited.current) {
            navigate(lastVisited.current);
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  // Check user status when the app mounts
  useEffect(() => {
    whoAmI();
  }, []);

  // Update last visited page for authenticated user
  useEffect(() => {
    if (!user) {
      lastVisited.current = location.pathname;
    }
  }, [location, user]);

  return (
    <Container>
      <Row style={{ textAlign: "center" }}>
        <h1>POKEDEX</h1>
      </Row>
      <Navbar onLogout={logOut} user={user} />
      <Outlet context={{handleLogin}}/>
    </Container>
  );
};

export default App;
