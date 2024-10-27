import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault(); 
        setError('');
        
        if (password!== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        console.log('Registering with: ', username, email, password);   // placeholder because no database setup on my end
    };

    return (
        <Container className='d-flex justify-content-center align-items-center vh-100'>
            <Row className='justify-content-md-center'>
                <Col md={6} lg={4}>
                    <div className='register-box text-center'>
                        <h2 className='mb-4 twixer-logo'> TwiXer</h2>
                         
                         <Form onSubmit={handleRegister}>
                            <Form.Group controlId='formUsername' className='mb-3'>
                                <Form.Control
                                    type='text'
                                    placeholder='Please Enter A Username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='formEmail' className='mb-3'>
                                <Form.Control
                                    type='email'
                                    placeholder='Please Enter A Valid Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='formPassword' className='mb-3'>
                                <Form.Control
                                    type='password'
                                    placeholder='Please Enter A Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='formPassword' className='mb-3'>
                                <Form.Control
                                    type='password'
                                    placeholder='Please Enter A Password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {error && <p className="text-danger">{error}</p>}

                            <Button variant='primary' type='submit' className='w-100 mb-3'>
                                Register
                            </Button>

                            <div className='mt-3'>
                                <p className='text-muted'>Already have an account? <a href='/login' className='login-link'>Login</a></p>
                            </div>
                         </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;