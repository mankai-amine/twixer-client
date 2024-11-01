import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
import Header from '../components/header';
import Sidebar from '../components/sidebar';

import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = `${process.env.REACT_APP_API_URL}`;

export const SinglePost = () => {
    const { id } = useParams();
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false); // Track whether the post is liked
    const [likeCount, setLikeCount] = useState(0); // Track the like count

    const accessToken = sessionStorage.getItem("accessToken");

    const { data: postData, isPending, isError } = useQuery({
        queryKey: ["single post", id],
        queryFn: async () => {
            return Axios.get(`${apiUrl}/posts/${id}`).then((res) => res.data);
        }
    });

    const handleLike = () => {
        // Toggle the liked state
        const newLikedState = !liked;
        setLiked(newLikedState);
        
        // Update like count based on the new liked state
        const newLikeCount = newLikedState ? likeCount + 1 : Math.max(likeCount - 1, 0);
        setLikeCount(newLikeCount);
        
        // Send a request to the server to update the like status
        Axios.post(`${apiUrl}/likes/${id}`, {
            postId: id,
        }, {
            headers: {
                accessToken: accessToken, // Ensure this is defined
            },
        })
        .then(() => {
            console.log("Like status updated successfully");
        })
        .catch((error) => {
            console.error("Error liking post:", error);
            // Optionally, revert the like state if there's an error
            setLiked(!newLikedState); // Revert back
            setLikeCount(newLikedState ? newLikeCount - 1 : newLikeCount + 1); // Adjust count back
        });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // Implement your comment submission logic here
        console.log('Comment submitted:', comment);
        setComment(''); // Clear the input after submission
    };

    if (isPending) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading post details...</span>
                </Spinner>
            </Container>
        )
    }

    if (isError) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">There was an error loading the post.</Alert>
            </Container>
        );
    }

    return (
        <>
            <Header />
            <div className="d-flex" style={{ backgroundColor: 'white', minHeight: '100vh' }}> 
                <Sidebar />
                <Container className="mt-5 post-container" style={{ maxWidth: '1000px', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}> 
                    {postData && (
                        <>
                            <Row className="mb-3">
                                <Col xs={2} className="text-center">
                                    {postData.poster?.profilePicture ? (
                                        <img src={postData.poster.profilePicture} alt="Profile" className="rounded-circle" style={{ width: '50px', height: '50px' }} />
                                    ) : (
                                        <div className="profile-placeholder bg-secondary rounded-circle" style={{ width: '50px', height: '50px' }}></div>
                                    )}
                                </Col>
                                <Col>
                                    <h5 className="mb-0">{postData.poster?.username || 'Unknown'}</h5>
                                    <small className="text-muted">@{postData.poster?.username.toLowerCase() || 'unknown'}</small>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col>
                                    <p style={{ color: 'black' }}>{postData.content ? postData.content : 'No content available'}</p>
                                </Col>
                            </Row>
                            <Row className="mb-3 text-muted">
                                <Col>
                                    <small>{new Date(postData.date).toLocaleString()}</small>
                                </Col>
                            </Row>
                            <Row className="mb-4 text-muted">
                                <Col>
                                    <span>{postData.replies?.length || '0'} Comments</span> • <span>{postData.orig_post_id ? '1' : '0'} Quote Tweets</span> • <span>{postData.likes?.length || '0'} Likes</span>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col className="d-flex justify-content-center align-items-center gap-5">
                                    <Button variant="outline-secondary" className="d-flex align-items-center">
                                        Retweet
                                    </Button>
                                    <Button variant="outline-secondary" className="d-flex align-items-center">
                                        Like
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <Form>
                                        <Form.Group controlId="commentInput">
                                            <Form.Control type="text" placeholder="Write a comment..." />
                                        </Form.Group>
                                        <Button variant="primary" className="mt-2">Comment</Button>
                                    </Form>
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            </div>
        </>
    );
};
