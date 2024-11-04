import React, { useState, useEffect, useContext, useRef  } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
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
    const [reposted, setReposted] = useState(false); 
    const [repostCount, setRepostCount] = useState(0); 
    const [submitError, setSubmitError] = useState(''); // for reply section
    const [isPostOwner, setIsPostOwner] = useState(false); 
    const [isAdmin, setIsAdmin] = useState(false); 
    const firstRender = useRef(true); // Initialize ref to track first render


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
        if (postData && firstRender.current) {
            setLikeCount(postData.likeCount); 
            setRepostCount(postData.repostCount);
            firstRender.current = false;
        }

        if (postData && user ) {
        setIsPostOwner(postData.poster.username === user.username);
        }

        if (user) {
            setIsAdmin(user.role === "admin");
        }

    }, [postData, user]);

    console.log(likeCount);
    console.log(repostCount);


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
    }, [postId]);
    
    const handleLike = async () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
    
        try {
            if (newLikedState) {
                await Axios.post(`${apiUrl}/likes/${postId}`, null, {
                    headers: {
                        accessToken: accessToken,
                    },
                });
                setLikeCount(prevCount => prevCount + 1);
            } else {
                await Axios.delete(`${apiUrl}/likes/${postId}`, {
                    headers: {
                        accessToken: accessToken,
                    },
                });
                setLikeCount(prevCount => Math.max(prevCount - 1, 0));
            }
            
        } catch (error) {
            console.error("Error updating like:", error);
            setLiked(!newLikedState); // Revert the liked state if an error occurs
        }
    };

    useEffect(() => {
        Axios.get(`${apiUrl}/posts/isReposted/${postId}`, {
            headers: {
                accessToken: accessToken, 
            },
        })
        .then((response) => {
            setReposted(response.data.isReposted) ;
        })
        .catch((error) => {
            console.error("Error get isReposted:", error);
        });
    }, [postId]);
    
    
    const handleRepost = async () => {
        const newRepostedState = !reposted;
        setReposted(newRepostedState);
    
        try {
            if (newRepostedState) {
                await Axios.post(`${apiUrl}/posts/reposts/${postId}`, 
                {
                    headers: {
                        accessToken: accessToken,
                    },
                });
                console.log(reposted);
                setRepostCount(prevCount => prevCount + 1);
            } else {
                await Axios.delete(`${apiUrl}/posts/reposts/${postId}`, {
                    headers: {
                        accessToken: accessToken,
                    },
                });
                setRepostCount(prevCount => Math.max(prevCount - 1, 0));
            }
            
        } catch (error) {
            console.error("Error updating repost:", error);
            setReposted(!newRepostedState); 
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
        })
        .catch((error) => {
            console.error("Error fetching posts:", error);
        });
    }

    const handleReplyDelete = (replyId) =>{
        console.log("entering delete reply");
        Axios.patch(`${apiUrl}/replies/${replyId}`, null, {
            headers: {
                accessToken: accessToken,
            },
        })
        .then(async () => {
            console.log("Reply deleted");
            postData.content="This reply was deleted"
            await queryClient.invalidateQueries(["single post", id]);
        })
        .catch((error) => {
            console.error("Error fetching replies:", error);
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
                                <div>
                                    <Link to={`/profile/${postData.poster.username}`} className='text-decoration-none text-reset username-link'>
                                        {postData.poster.username} 
                                    </Link>
                                    {postData.originalPost && (
                                        <>
                                            <span> reposted </span>
                                            <Link to={`/profile/${postData.originalPost.poster.username}`} className='text-decoration-none text-reset username-link'>
                                                {postData.originalPost.poster.username}
                                            </Link>
                                        </>
                                    )}
                                </div>
                                { (isPostOwner || isAdmin) && <DropdownDelete 
                                            onDelete={(postId) => {
                                                handleDelete(postId);
                                            }}
                                            contentId={postData.id}
                                            contentType={"post"} 
                                />}
                            </div>
                            <p className="card-text">{postData.content}</p>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex text-muted">
                                    <div className="me-3">
                                        <i className="bi bi-heart-fill me-1" 
                                            style={{ color: liked ? 'red' : 'gray' }} 
                                            onClick={handleLike}>                                          
                                        </i>
                                        {likeCount} Likes
                                    </div>
                                    <div>
                                        <i className="bi bi-chat-fill me-1"></i>
                                        {postData.replies.length} Replies
                                    </div>
                                    <div>
                                        <i className="bi bi-arrow-repeat me-1 ms-3" 
                                            style={{ color: reposted ? 'DodgerBlue' : 'gray', fontWeight: 'bold' }} 
                                            onClick={handleRepost}
                                        ></i>
                                        {repostCount} Reposts
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
                        {user && 
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
                        </form> }
                        <ul className="list-group">
                            {postData.replies.map((reply, index) => (
                                <li key={index} className="list-group-item">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h4>{reply.replier.username} says:</h4>
                                    { ((reply.replier.username === user.username) || isAdmin) && <DropdownDelete 
                                            onDelete={(replyId) => {
                                                handleReplyDelete(replyId);
                                            }} 
                                            contentId={reply.id}
                                            contentType={"reply"}
                                    />}
                                    </div>
                                    {reply.content}
                                    <span>{reply.likeCount}</span>
                                    
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </>
    );
};
