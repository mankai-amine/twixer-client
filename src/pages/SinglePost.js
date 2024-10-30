import React from 'react';
import { useQuery } from "@tanstack/react-query";
import Axios from 'axios';
// import { UserContext } from "../helpers/UserContext"
import { useParams } from 'react-router-dom';

const apiUrl = `${process.env.REACT_APP_API_URL}/posts`;

export const SinglePost = () => {
    const { id } = useParams();
    console.log(id);

    const {data: postData, isPending, isError } = useQuery({
        queryKey: ["single post", id],
        queryFn: async () => {
            return Axios.get(`${apiUrl}/${id}`).then((res) => res.data);
        }
    });

    if (isPending) {
        return <div>Loading post details...</div>;
    }

    if (isError) {
        return <div>There was an error.</div>;
    }

    return (
        <div>
            <h2>Poster: {postData.poster.username}</h2>
            <textarea rows="15" cols="100" readOnly value={postData.content} />
            <p>Likes: {postData?.likeCount} </p>
            <p>Replies: {postData?.replies} </p>
        </div>
    );
};