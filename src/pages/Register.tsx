import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


const registerSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Confirm Password is required'),

});


const Register: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = (data: any) => {
        console.log('Register data:', data);
        setIsSubmitted(true);
    };

    return (
        <Container className='mt-5'>
            <Row className='justify-content-md-center'>
                <Col md={6} lg={4}>
                    <div className='register-box text-center'>
                        <h2 className='mb-4 twixer-logo'> TwiXer</h2>
                         
                         <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group controlId='formUsername' className='mb-3'>
                                <Form.Control
                                    type='text'
                                    placeholder='Please Enter A Username'
                                    {...register('username')}
                                />
                                {errors.username && <p className="text-danger">{errors.username.message}</p>}
                            </Form.Group>
                            <Form.Group controlId='formEmail' className='mb-3'>
                                <Form.Control
                                    type='email'
                                    placeholder='Please Enter A Valid Email'
                                    {...register('email')}
                                />
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register('password')}
                                />
                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            </Form.Group>
                            <Form.Group controlId="formConfirmPassword" className="mb-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                            </Form.Group>

                            <Button variant='primary' type='submit' className='w-100 mb-3'>
                                Register
                            </Button>

                            {isSubmitted && <p className="text-success">Registration successful!</p>}

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