import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';


const loginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const Login = () => {
    const [submissionStatus, setSubmissionStatus] = useState(null); // Manage submission status message

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', data);

            if (response.status === 200) {
                setSubmissionStatus('Successfully logged in');
                localStorage.setItem('token', response.data.token);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setSubmissionStatus('Error occurred');
        }
    };

    return (
        <div style={{ backgroundColor: '#0083b3', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container className='mt-5'>
            <Row className='justify-content-md-center'>
                <Col md={6} lg={4}>
                    <div className='login-box text-center'>
                        <h2 className='mb-4' twixer-logo>TwiXer</h2>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group controlId='formUsername' className='mb-3'>
                                <Form.Control
                                    type='username'
                                    placeholder='Enter username'
                                    {...register('username')}
                                />
                                {errors.username && <p className="text-danger">{errors.username.message}</p>}
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register('password')}
                                />
                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            </Form.Group>

                            <Button variant='primary' type='submit' className='w-100 mb-3 custom-button'>
                                Login
                            </Button>
                            
                            {submissionStatus && <p className="text-success">{submissionStatus}</p>}

                            <div className="mt-3">
                                <p>
                                    Don't have an account? <a href="/register" className="sign-up-link">Sign up</a>
                                </p>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
        </div>
    );
};

export default Login;