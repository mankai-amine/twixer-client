import React from 'react';
import { Navbar, Form, FormControl, Container } from 'react-bootstrap';
import '../components.css';

const Header = () => {
    return (
        <Navbar style={{ backgroundColor: '#106cfc', marginBottom: '0px' }} variant='dark' className='p-3'>
            <Container className='d-flex justify-content-between align-items-center'>
                <Navbar.Brand className='logo mx-auto'>
                    Twixer <span role='img' aria-label='bird'></span>
                </Navbar.Brand>
                <Form className='d-flex ml-auto'>
                    <FormControl 
                        type='text' 
                        placeholder='Search...' 
                        className='mr-2 search-bar'
                    />
                </Form>
            </Container>
        </Navbar>
    );
};

export default Header;