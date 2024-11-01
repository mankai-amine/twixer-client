import React, { useContext, useEffect, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import '../components.css';
import { UserContext } from "../helpers/UserContext";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


const Sidebar = () => {

    const { user, setUser } = useContext(UserContext); // Access setUser from context
    const [username, setUsername] = useState("");

    useEffect(() => {
        
        if (!user) return;

        setUsername(user.username);

    }, [user]);

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
        <div className="d-flex flex-column sidebar p-3 " style={{ height: '100vh', background: 'white'}}>
        <Nav className='flex-column mb-3' style={{ overflowY: 'auto'}}>
            <Link to={`/profile/${username}`}>
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
            <Link to="/createpost">
            <Button variant="outline-secondary" className="mb-3" style={{ width: '100%' }}>Make Post</Button>
            </Link>
        </Nav>
        <Button variant="outline-danger" className="mt-5" onClick={handleLogout}>
            Logout
        </Button>
    </div>
    );
};

export default Sidebar;