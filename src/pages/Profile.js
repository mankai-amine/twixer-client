import { useEffect, useState } from "react";
import { Button  } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";
import Header from '../components/header';


export const Profile = () => {

    const accessToken = sessionStorage.getItem("accessToken");

    const [user, setUser] = useState({});
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [posts, setPosts] = useState([]);


    const username = "amineM";

    useEffect( ()=> {
        Axios.get(`http://localhost:3001/api/users/username/${username}`)
        .then( (response) => {
            setUser(response.data)
        })
        .catch((error)=> {
            console.error("Error fetching user:", error)
        })
    }, [])

    const {id, bio, profile_pic} = user;

    useEffect(() => {
        if(id){
            Axios.get(`http://localhost:3001/api/posts/profilePage/${id}`, {
                headers: {
                    accessToken: accessToken,
                },
            })
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });
        }
        
    }, [id]);

    console.log(posts);

    const followeeId = id;
    useEffect(() => {
        if(id){
            Axios.get(`http://localhost:3001/api/follows/followers/${followeeId}`)
            .then((response) => {
                setFollowers(response.data.length);
            })
            .catch((error) => {
                console.error("Error fetching followers:", error);
            });
        }
        
    }, [id]);

    const followerId = id;
    useEffect(() => {
        if(id){
            Axios.get(`http://localhost:3001/api/follows/following/${followerId}`)
            .then((response) => {
                setFollowing(response.data.length);
            })
            .catch((error) => {
                console.error("Error fetching following:", error);
            });
        }
        
    }, [id]);


    return (
        <div>
        {<Header />}
        <div className="container mt-5">

            <div className="row justify-content-center">
                <div className="col-md-8">

                    <div className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={profile_pic} 
                                        className="rounded-circle me-3"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        alt="Profile"
                                    />
                                    <div>
                                        <h3 className="mb-2" style={{ color: 'black'}}>{username}</h3>
                                        <p className="text-muted mb-0">{bio}</p>
                                    </div>
                                </div>
                                <Link to="/account">
                                    <Button variant="primary">Edit Profile</Button>
                                </Link>
                            </div>
                            
                            {/* Stats */}
                            <div className="d-flex justify-content-start mt-3">
                                <div className="me-4">
                                    <span style={{ color: 'black'}}>{followers}</span>
                                    <span className="text-muted ms-1">Followers</span>
                                </div>
                                <div>
                                    <span style={{ color: 'black'}}>{following}</span>
                                    <span className="text-muted ms-1">Following</span>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Posts */}
                    {posts.map((post) => (
                        <div key={post.id} className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-2">
                                    <h5 className="card-title mb-0">
                                        {post.poster.username}
                                    </h5>
                                </div>
                                <p className="card-text">{post.content}</p>
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
};