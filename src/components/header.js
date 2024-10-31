import React from 'react';
import { Navbar, Form, FormControl } from 'react-bootstrap';
import '../components.css';

const Header = () => {
    return (
        <Navbar bg='primary' variant='dark' className='justify-content-between p-3'>
            <Navbar.Brand className='logo'>
                Twixer <span role='img' aria-label='bird'></span>
            </Navbar.Brand>
            <Form className='d-flex'>
                <FormControl 
                    type='text' 
                    placeholder='Search...' 
                    className='mr-2 search-bar'
                />
            </Form>
        </Navbar>
    );
};

export default Header;