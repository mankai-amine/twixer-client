import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import './components.css';

const Sidebar: React.FC = () => {
    return (
        <Nav className='flex-column sidebar p-3'>
            <Button variant="outline-secondary" className="mb-3">Profile</Button>
            <Button variant="outline-secondary" className="mb-3">Home</Button>
            <Button variant="outline-secondary" className="mb-3">Following</Button>
            <Button variant="outline-secondary" className="mb-3">Upgrade</Button>
        </Nav>
    );
};

export default Sidebar;