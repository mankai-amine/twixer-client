import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Axios from 'axios';
import { UserContext } from "../helpers/UserContext"

const apiUrl = `${process.env.REACT_APP_API_URL}/replies`;

const replySchema = Yup.object().shape({
    content: Yup.string().min(5, "Content needs to be at least 5 characters")
    .max(280, "Content must be less than 280 characters")
    .required('Reply content is required'),
});

export const CreateReply = () => {
    // TODO, INCORPORATE THIS ON TOP OF THE SINGLE POST PAGE
    const { postId } = 1;

    const [isSubmitted, setIsSubmitted] = useState(false);

    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(replySchema),
    });

    const { setUser } = useContext(UserContext);

    const [submissionStatus, setSubmissionStatus] = useState(null);

    const [serverErrors, setServerErrors] = useState("");

    const onSubmit = async (data) => {
        setServerErrors("");

        try {
            const response = await Axios.post(`${apiUrl}/${postId}`, data, {headers: {
                "accessToken": sessionStorage.getItem("accessToken"),
            },
            });
            if (response.status === 201) {
                setIsSubmitted(true);
            } else {
                setIsSubmitted(false);
                alert("Reply failed. Please try again.");
                // TODO change this to a flash message
            }

        } catch (error) {
            if (error.response) {
                setServerErrors(error.response.data);
            } else {
                console.error('Error replying:', error);
                setSubmissionStatus('Error occurred');
            }
            
        }
    };

    return (
        <div style={{ backgroundColor: '#abcdef', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container className='mt-5'>
                <Row className='justify-content-md-center'>
                    <Col md={6} lg={4}>
                        <div className='register-box text-center'>
                            <h2 className='mb-4 twixer-logo'>Reply to the conversation</h2>
                         
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group controlId='formContent' className='mb-3'>
                                    <Form.Control
                                        as="textarea"
                                        rows={6}
                                        placeholder="Type reply here"
                                        {...register('content')}
                                    />
                                    {errors.content && <p className="text-danger">{errors.content.message}</p>}
                                </Form.Group>

                                <Button variant='primary' type='submit' className='w-100 mb-3'>
                                    Create Reply
                                </Button>

                                {isSubmitted && <p className="text-success">Reply created</p>}
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );

};