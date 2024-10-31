import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Card } from 'react-bootstrap';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const apiUrl = `${process.env.REACT_APP_API_URL}/posts/generalFeed`;

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}?page=${page}&limit=10`);
            console.log("Fetched posts:", response.data);  // Log to confirm data
            const newPosts = response.data;

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error('Error fetching posts: ', error);
        }
    }, [page, apiUrl]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <Container className='mt-5'>
            <h2 className='text-center mb-4'>Feed</h2>
            <InfiniteScroll
                dataLength={posts.length}
                next={fetchPosts}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p className='text-center'>No more posts to show</p>}
            >
                {posts.map((post, index) => (
                    <Card key={post.id || index} className='mb-3'>
                    <Card.Body>
                        <Card.Title>{post.username}</Card.Title> 
                        <Card.Text>{post.content}</Card.Text> 
                        {post.likeCount && (<div>Likes: {post.likeCount}</div>)}
                        <Card.Footer className='text-muted'>
                            Posted on {new Date(post.date).toLocaleString()}
                        </Card.Footer>
                    </Card.Body>
                </Card>
                
                ))}
            </InfiniteScroll>
        </Container>
    );
};

export default Feed;