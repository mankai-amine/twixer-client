import React, { useContext, useEffect, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { UserContext } from "../helpers/UserContext";
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Sidebar = () => {
    const { user, setUser } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        setUsername(user.username);
    }, [user]);

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken");
        setUser(null);
        navigate("/login");
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        if (path.startsWith('/profile')) {
            return location.pathname.startsWith('/profile');
        }
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/createpost', label: 'Make Post' },
        { path: `/profile/${username}`, label: 'Profile' },
        { path: '/', label: 'Home' },
        { path: '/following', label: 'Following' },
    ];

    return (
        <div className="d-flex flex-column sidebar p-3" style={{ height: '100vh', background: 'white' }}>
            <Nav className="flex-column mb-3" style={{ overflowY: 'auto' }}>
                {navItems.map((item) => (
                    <Link to={item.path} key={item.path}>
                        <Button
                            variant={isActive(item.path) ? "primary" : "outline-secondary"}
                            className="mb-3"
                            style={{ width: '100%' }}
                        >
                            {item.label}
                        </Button>
                    </Link>
                ))}
                
                {user?.role === 'admin' && (
                    <Link to="/admin/users">
                        <Button
                            variant={isActive('/admin/users') ? "primary" : "outline-secondary"}
                            className="mb-3"
                            style={{ width: '100%' }}
                        >
                            User List
                        </Button>
                    </Link>
                )}
            </Nav>
            <Button variant="outline-danger" className="mt-5" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Sidebar;