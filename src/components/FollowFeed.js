import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";


const FollowFeed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    const apiUrl = `${process.env.REACT_APP_API_URL}/posts/followFeed`;

    const fetchPosts = useCallback(async (pageNum) => {
        const accessToken = sessionStorage.getItem("accessToken");

        try {
            const response = await axios.get(`${apiUrl}?page=${pageNum}&limit=10`,
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
                    <Link to={`/post/${post.id}`} key={post.id || index}  className="text-decoration-none text-reset">
                        <Card  className='mb-3'>
                            <Card.Body>
                                <Card.Title>{post.poster.username}</Card.Title>
                                <Card.Text>{post.content}</Card.Text>
                                <div className="d-flex text-muted">
                                    <div className="me-3">
                                        <i className="bi bi-heart-fill me-1"></i>
                                        {post.likeCount} Likes
                                    </div>
                                    <div>
                                        <i className="bi bi-chat-fill me-1"></i>
                                        {post.replies.length} Replies
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