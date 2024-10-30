import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Card } from 'react-bootstrap';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/posts/feed?page=${page}&limit=10`);
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
    };

    useEffect(() => {
        fetchPosts();
    }, []);
}