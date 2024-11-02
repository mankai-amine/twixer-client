import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    const [submitError, setSubmitError] = useState(''); // for reply section

    const queryClient = useQueryClient();
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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        try {
            await Axios.post(`${apiUrl}/replies/${id}`, {
                postId: id,
                content: comment
            }, {
                headers: {
                    accessToken: accessToken,
                },
            });
            console.log("Reply added");
            setComment(''); // Clear the input after successful submission
            // Invalidate and refetch the post query to show the new comment
            await queryClient.invalidateQueries(["single post", id]);
            
        } catch (error) {
            console.error("Error replying to post:", error);
            setSubmitError(error.response?.data?.message || 'Error submitting reply');
        }
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
                <div className="container mt-3" style={{ maxWidth: '900px' }}>
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <Link to={`/profile/${postData.poster.username}`} className='text-decoration-none text-reset username-link'>
                                <h5 className="card-title">{postData.poster.username}</h5>
                            </Link>
                            <p className="card-text">{postData.content}</p>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex text-muted">
                                    <div className="me-3">
                                        <i className="bi bi-heart-fill me-1" style={{ color: liked ? 'red' : 'gray' }} onClick={handleLike}></i>
                                        {likeCount} Likes
                                    </div>
                                    <div>
                                        <i className="bi bi-chat-fill me-1"></i>
                                        {postData.replies.length} Replies
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-muted">
                            {new Date(postData.date).toLocaleString()}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h6>Comments</h6>
                        <form onSubmit={handleCommentSubmit} className="mb-3">
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Add a comment..." 
                                    value={comment} 
                                    onChange={(e) => setComment(e.target.value)} 
                                    required 
                                />
                                <button className="btn btn-outline-secondary" type="submit">Submit</button>
                            </div>
                        </form>
                        <ul className="list-group">
                            {postData.replies.map((reply, index) => (
                                <li key={index} className="list-group-item">
                                    {reply.content}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </>
    );
};
