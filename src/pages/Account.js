import React, { useContext, useEffect, useState } from 'react';
import { setValue, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../helpers/UserContext";
import FlashMessage from "../helpers/FlashMessage";
import { Link } from 'react-router-dom';
import { Upload } from '../helpers/Upload';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Header from '../components/header';
import Sidebar from '../components/sidebar';


const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    username: Yup.string()
      .min(2, "Username must be at least 2 characters")
      .max(50, "Username must be less or equal than 50 characters")
      .required("Username is required"),
    bio: Yup.string()
      .min(10, "Bio must be at least 6 characters")
      .max(160, "Bio must be less or equal than 64 characters")
      .required("Bio is required"),
});

export const Account = () => {
    
    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    
    const [flashMessage, setFlashMessage] = useState(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        
        if (!user) return;

        setValue("email", user.email);
        setValue("username", user.username);
        setValue("bio", user.bio);

    }, [user, setValue]);

    const onSubmit = (data) => {
        const accessToken = sessionStorage.getItem("accessToken");
        const id = user.id

        Axios.put(`${process.env.REACT_APP_API_URL}/users/update/${id}`, {
            email: data.email,
            username: data.username,
            bio: data.bio,
        }, {
            headers: {
                accessToken: accessToken,
            },
        })
        .then(() => {
            setFlashMessage({ message: "User updated successfully", type: "success" });
            setTimeout(() => {
                setFlashMessage(null);
                navigate("/"); 
            }, 2000);
        })
        .catch((error) => {
            setFlashMessage({ message: "Error updating user", type: "danger" });
            console.error("Error updating the user:", error);
        });
    };

    
    return (
        <div style={{ backgroundColor: '#e3eef8', minHeight: '100vh' }}>
            <Header />
            <div className="d-flex">
                <Sidebar />
                <Container fluid>
                    <Row className="justify-content-center mt-5">
                        <Col md={8} lg={6}>
                            {flashMessage && (
                                <FlashMessage
                                    message={flashMessage.message}
                                    type={flashMessage.type}
                                    onClose={() => setFlashMessage(null)}
                                />
                            )}
                            <h3 className="mb-3">Update settings</h3>
                            <Form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        isInvalid={!!errors.email}
                                        {...register("email")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors?.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        isInvalid={!!errors.username}
                                        {...register("username")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors?.username?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Bio</Form.Label>
                                    <Form.Control
                                        type="text"
                                        isInvalid={!!errors.bio}
                                        {...register("bio")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors?.bio?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Upload />
                                <div className="mt-4">
                                    <Button type="submit" variant="primary" className="me-2">
                                        Update
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/password"
                                        variant="secondary"
                                    >
                                        Change Password
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

