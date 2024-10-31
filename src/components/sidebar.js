import React, { useContext } from 'react';
import { Button, Nav } from 'react-bootstrap';
import '../components.css';
import { UserContext } from "../helpers/UserContext";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


const Sidebar = () => {
    const { setUser } = useContext(UserContext); // Access setUser from context
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken"); // Remove access token
        setUser(null); // Clear user context
        navigate("/login"); // Redirect to login page
    };

    const handleProfile =() => {
        navigate("/profile");
    }

    return (
        <div className="d-flex flex-column sidebar p-3 mt-4" style={{ height: '100vh' }}>
            <Nav className='flex-column mb-3' style={{ overflowY: 'auto' }}>
                <Link to="/profile">
                    <Button variant="outline-secondary" className="mb-3" style={{ width: '100%' }}>Profile</Button>
                </Link>

                <Link to="/">
                    <Button variant="outline-secondary" className="mb-3" style={{ width: '100%' }}>Home</Button>
                </Link>

                <Link to="/following">
                    <Button variant="outline-secondary" className="mb-3" style={{ width: '100%' }}>Following</Button>
                </Link>

                <Link to="/upgrade">
                    <Button variant="outline-secondary" className="mb-3" style={{ width: '100%' }}>Upgrade</Button>
                </Link>
            </Nav>
            <Button variant="outline-danger" className="mt-5" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Sidebar;