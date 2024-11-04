import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Axios from 'axios';
import { UserContext } from "../helpers/UserContext"
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import FlashMessage from '../helpers/FlashMessage';

const apiUrl = `${process.env.REACT_APP_API_URL}/posts`;

const postSchema = Yup.object().shape({
    content: Yup.string().min(10, "Content needs to be at least 10 characters")
    .max(560, "Content must be less than 560 characters")
    .required('Post content is required'),
});

export const CreatePost = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [flash, setFlash] = useState({ show: false, message: '', type: '' });

    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(postSchema),
    });

    const { setUser } = useContext(UserContext);

    const [submissionStatus, setSubmissionStatus] = useState(null);

    const [serverErrors, setServerErrors] = useState("");

    const navigate = useNavigate();

    const showFlash = (message, type) => {
        setFlash({ show: true, message, type });
        // Auto hide after 3 seconds
        setTimeout(() => {
            setFlash({ show: false, message: '', type: '' });
        }, 3000);
    };
    
    const hideFlash = () => {
        setFlash({ show: false, message: '', type: '' });
    };

    const onSubmit = async (data) => {
        setServerErrors("");

        try {
            const response = await Axios.post(apiUrl, data, {headers: {
                "accessToken": sessionStorage.getItem("accessToken"),
            },
            });
            if (response.status === 201) {
                setIsSubmitted(true);
                navigate("/");
            } else {
                setIsSubmitted(false);
                alert("Posting failed. Please try again.");
                // TODO change to something other than alert
            }

        } catch (error) {
            if (error.response) {
                setServerErrors(error.response.data);
            } else {
                console.error('Error posting:', error);
                setSubmissionStatus('Error occurred');
            }
            
        }
    };
    // TODO customize the form
    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            {flash.show && (
                <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
                    <FlashMessage
                        message={flash.message}
                        type={flash.type}
                        onClose={hideFlash}
                    />
                </div>
            )}
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#e3eef8'}}>
                <Container className='mt-5'>
                    <Row className='justify-content-md-center'>
                        <Col md={6} lg={4}>
                            <div className='register-box text-center'>
                                <h2 className='mb-4 twixer-logo'>Create Post</h2>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group controlId='formContent' className='mb-3'>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            placeholder="Tell everyone what's on your mind"
                                            {...register('content')}
                                        />
                                        {errors.content && <p className="text-danger">{errors.content.message}</p>}
                                    </Form.Group>

                                    <Button variant='primary' type='submit' className='w-100 mb-3'>
                                        Create Post
                                    </Button>

                                {isSubmitted && <p className="text-success">Post created</p>}
                            </Form>
                            <Button 
                                variant='secondary' 
                                onClick={() => navigate(-1)}
                                className='mt-2'
                            >
                                Back
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
        </div>
    );
};
