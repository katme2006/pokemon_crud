import React from 'react';
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";

export const Navbar = ({ user, onLogout }) => {
    // Function to handle the logout click
    const handleLogout = async () => {
        try {
            // Make the POST request to the logout endpoint
            await onLogout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Row style={{ display: "flex", justifyContent: "space-around" }}>
            {user ? (
                <>
                    <Link to="/">Home</Link>
                    <Link to="pokemon">Pokemon</Link>
                    <Link to="moves">Moves</Link>
                    <button onClick={handleLogout}>Log out</button> {/* Logout button */}
                </>
            ) : (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Log In</Link>
                </>
            )}
        </Row>
    );
};
