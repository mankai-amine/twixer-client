import React, { useState, useEffect, useContext  } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { UserContext } from "../helpers/UserContext";
import { DropdownDelete } from "../components/DropDownDelete";


import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = `${process.env.REACT_APP_API_URL}`;

export const SinglePost = () => {
    const { id } = useParams();
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false); // Track whether the post is liked
    const [likeCount, setLikeCount] = useState(0); // Track the like count
    const [submitError, setSubmitError] = useState(''); // for reply section
    const [isPostOwner, setIsPostOwner] = useState(false); 
    const [isAdmin, setIsAdmin] = useState(false); 
    const [refresh, setRefresh] = useState(0); // Initialize a state for refresh


    const queryClient = useQueryClient();
    const accessToken = sessionStorage.getItem("accessToken");
    const { user } = useContext(UserContext); 

    const postId = id;

    const { data: postData, isPending, isError } = useQuery({
        queryKey: ["single post", id],
        queryFn: async () => {
            return Axios.get(`${apiUrl}/posts/${id}`).then((res) => res.data);
        }
    });

    

    useEffect(() => {
        if (postData && likeCount === 0) {
            setLikeCount(postData.likeCount || 0); // Initialize likeCount from postData
        }

        if (postData && user ) {
        setIsPostOwner(postData.poster.username === user.username);
        }

        if (user) {
            setIsAdmin(user.role === "admin");
        }

    }, [postData, likeCount, user]);

    useEffect(() => {
        Axios.get(`${apiUrl}/likes/isLiked/${postId}`, {
            headers: {
                accessToken: accessToken, 
            },
        })
        .then((response) => {
            setLiked(response.data.isPostLiked) ;
        })
        .catch((error) => {
            console.error("Error get isLiked:", error);
        });
    }, []);

    console.log(liked);

    
    const handleLike = () => {
        // Toggle the liked state
        const newLikedState = !liked;
        setLiked(newLikedState);

        if(newLikedState){
            Axios.post(`${apiUrl}/likes/${postId}`, null, {
                headers: {
                    accessToken: accessToken, 
                },
            })
            .then((response) => {
                setLikeCount(prevCount => prevCount + 1);
                console.log(response.data.message); ;
            })
            .catch((error) => {
                console.error("Error liking post:", error);
                setLiked(false); // Revert back
            });
        } else{
            Axios.delete(`${apiUrl}/likes/${postId}`, {
                headers: {
                    accessToken: accessToken, 
                },
            })
            .then((response) => {
                setLikeCount(prevCount => Math.max(prevCount - 1, 0)); // Ensure it doesn't go below zero
                console.log(response.data.message); ;
            })
            .catch((error) => {
                console.error("Error unliking post:", error);
                setLiked(true); // Revert back
            });
        }
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

    const handleDelete = (postId) =>{
        Axios.patch(`${apiUrl}/posts/${postId}`, null, {
            headers: {
                accessToken: accessToken,
            },
        })
        .then(() => {
            console.log("Post deleted");
            postData.content="This post was deleted"
            setRefresh(prev => prev + 1); 
        })
        .catch((error) => {
            console.error("Error fetching posts:", error);
        });
    }

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
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <Link to={`/profile/${postData.poster.username}`} className='text-decoration-none text-reset username-link'>
                                    <h5 className="card-title">{postData.poster.username}</h5>
                                </Link>
                                { (isPostOwner || isAdmin) && <DropdownDelete 
                                            onDelete={(postId) => {
                                                handleDelete(postId);
                                            }} 
                                            postId={postData.id} 
                                />}
                            </div>
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
