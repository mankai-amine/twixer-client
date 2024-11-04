import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";


const FollowFeed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [likedPosts, setLikedPosts] = useState({}); 
    const [likeCounts, setLikeCounts] = useState({}); 
    const [repostedPosts, setRepostedPosts] = useState({}); 
    const [repostCounts, setRepostCounts] = useState({}); 
    
    const apiUrl = `${process.env.REACT_APP_API_URL}/posts/followFeed`;
    const apiUrl2 = process.env.REACT_APP_API_URL;
    const accessToken = sessionStorage.getItem("accessToken");


    const fetchPosts = useCallback(async (pageNum) => {
        const accessToken = sessionStorage.getItem("accessToken");

        try {
            const response = await Axios.get(`${apiUrl}?page=${pageNum}&limit=10`,
                {
                    headers: {
                        accessToken: accessToken,
                    },
            });
            console.log("Fetched posts:", response.data);  
            const newPosts = response.data;

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                if (pageNum === 1) {
                    // If it's the first page, replace existing posts
                    setPosts(newPosts);
                } else {
                    // For subsequent pages, append new posts
                    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                }
                setPage(pageNum + 1);
            }
        } catch (error) {
            console.error('Error fetching posts: ', error);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    const loadMore = () => {
        fetchPosts(page);
    };

    useEffect(() => {
        const newLikedPosts = {};
        const newLikeCounts = {};
        const newRepostCounts = {};
        
        posts.forEach(post => {
            // Initialize like counts
            newLikeCounts[post.id] = post.likeCount;

             // Initialize repost counts
             newRepostCounts[post.id] = post.repostCount;
            
            // Check if each post is liked
            Axios.get(`${apiUrl2}/likes/isLiked/${post.id}`, {
                headers: { accessToken }
            })
            .then(response => {
                setLikedPosts(prev => ({
                    ...prev,
                    [post.id]: response.data.isPostLiked
                }));
            })
            .catch(error => console.error("Error checking like status:", error));

            // Check if each post has been reposted
            Axios.get(`${apiUrl2}/posts/isReposted/${post.id}`, {
                headers: { accessToken }
            })
            .then(response => {
                setRepostedPosts(prev => ({
                    ...prev,
                    [post.id]: response.data.isReposted
                }));
            })
            .catch(error => console.error("Error checking repost status:", error));
        });
        
        setLikeCounts(newLikeCounts);
        setRepostCounts(newRepostCounts);
    }, [posts]);

    const handleLike = async (postId) => {
        try {
            const response = await Axios.get(`${apiUrl2}/likes/isLiked/${postId}`, {
                headers: { accessToken }
            });
            
            const isPostLiked = response.data.isPostLiked;
            const newLikedState = !isPostLiked;
    
            if (newLikedState) {
                await Axios.post(`${apiUrl2}/likes/${postId}`, null, {
                    headers: { accessToken }
                });
                setLikeCounts(prev => ({
                    ...prev,
                    [postId]: prev[postId] + 1
                }));
            } else {
                await Axios.delete(`${apiUrl2}/likes/${postId}`, {
                    headers: { accessToken }
                });
                setLikeCounts(prev => ({
                    ...prev,
                    [postId]: Math.max(prev[postId] - 1, 0)
                }));
            }
            
            setLikedPosts(prev => ({
                ...prev,
                [postId]: newLikedState
            }));
            
        } catch (error) {
            console.error("Error handling like:", error);
        }
    };

    const handleRepost = async (postId) => {
        try {
            const response = await Axios.get(`${apiUrl2}/posts/isReposted/${postId}`, {
                headers: { accessToken }
            });
            
            const isReposted = response.data.isReposted;
            const newRepostedState = !isReposted;
    
            if (newRepostedState) {
                await Axios.post(`${apiUrl2}/posts/reposts/${postId}`, null, 
                {
                    headers: { accessToken }
                });
                setRepostCounts(prev => ({
                    ...prev,
                    [postId]: prev[postId] + 1
                }));
            } else {
                await Axios.delete(`${apiUrl2}/posts/reposts/${postId}`, {
                    headers: { accessToken }
                });
                setRepostCounts(prev => ({
                    ...prev,
                    [postId]: Math.max(prev[postId] - 1, 0)
                }));
            }
            
            setRepostedPosts(prev => ({
                ...prev,
                [postId]: newRepostedState
            }));

            window.location.reload();
            
        } catch (error) {
            console.error("Error handling like:", error);
        }
    };


    return (
        <Container className='mt-4'>
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p className='text-center'>No more posts to show</p>}
            >
                {posts.map((post, index) => (
                    <Link to={`/post/${post.id}`} key={post.id || index}  className="text-decoration-none text-reset ">
                        <Card  className='mb-3'>
                            <Card.Body>
                                <Card.Title>
                                    <Link to={`/profile/${post.poster.username}`} className='text-decoration-none text-reset username-link'>
                                        {post.poster.username} 
                                    </Link>
                                    {post.originalPost && (
                                        <>
                                            <span> reposted </span>
                                            <Link to={`/profile/${post.originalPost.poster.username}`} className='text-decoration-none text-reset username-link'>
                                                {post.originalPost.poster.username}
                                            </Link>
                                        </>
                                    )}
                                </Card.Title>
                                <Card.Text>{post.content}</Card.Text>
                                <div className="d-flex text-muted">
                                    <div className="me-3">
                                        <i className="bi bi-heart-fill me-1" 
                                            style={{ color: likedPosts[post.id] ? 'red' : 'gray' }} 
                                            onClick={async (e) => {
                                                e.preventDefault();  
                                                e.stopPropagation();
                                                try {
                                                    await handleLike(post.id);
                                                } catch (error) {
                                                    console.error('Error handling like:', error);
                                                }
                                            }}>                                            
                                        </i>
                                        {likeCounts[post.id]} Likes
                                    </div>
                                    <div>
                                        <i className="bi bi-chat-fill me-1"></i>
                                        {post.replies.length} Replies
                                    </div>
                                    <div>
                                        <i className="bi bi-arrow-repeat me-1 ms-3" 
                                            style={{ color: repostedPosts[post.id] ? 'DodgerBlue' : 'gray', fontWeight: 'bold' }}
                                            onClick={async (e) => {
                                                e.preventDefault();  
                                                e.stopPropagation();
                                                try {
                                                    await handleRepost(post.id);
                                                } catch (error) {
                                                    console.error('Error handling repost:', error);
                                                }
                                            }}
                                        ></i>
                                        {repostCounts[post.id]} Reposts
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer className='text-muted'>
                                {new Date(post.date).toLocaleString()}
                            </Card.Footer>
                        </Card>
                    </Link>
                ))}

            </InfiniteScroll>
        </Container>
    );
};

export default FollowFeed;