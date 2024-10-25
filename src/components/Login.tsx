import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Logging in with: ', email, password);  // placeholder because no database setup on my end
    }

    return (
        <Container className='mt-5'>
            <Row className='justify-content-md-center'>
                <Col md={6} lg={4}>
                    <div className='login-box text-center'>
                        <h2 className='mb-4' twixer-logo>TwiXer</h2>

                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId='formEmail' className='mb-3'>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter Email Address'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId='formPassword' className='mb-3'>
                                <Form.Control
                                    type='password'
                                    placeholder='Enter Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant='primary' type='submit' className='w-100 mb-3'>
                                Login
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;