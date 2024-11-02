import { useEffect, useState, useContext } from "react";
import { UserContext } from "../helpers/UserContext";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import Header from '../components/header';
import { DropdownDelete } from "../components/DropDownDelete";
import Sidebar from '../components/sidebar';


export const Profile = () => {
    const { username } = useParams();
    const { user } = useContext(UserContext); 
    const [currUsername, setCurrUsername] = useState("");
    const [isFollowing, setIsFollowing] = useState(false);
    const [likedPosts, setLikedPosts] = useState({}); // Track liked state for each post
    const [likeCounts, setLikeCounts] = useState({}); // Track like count for each post


    useEffect(() => {
        if (!user) return;
        setCurrUsername(user.username);
    }, [user]);

    const isSameUsername = (username === currUsername);
    const accessToken = sessionStorage.getItem("accessToken");
    const apiUrl = process.env.REACT_APP_API_URL;

    const [profileOwner, setProfileOwner] = useState({});
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [posts, setPosts] = useState([]);

    
    useEffect( ()=> {
        Axios.get(`${apiUrl}/users/username/${username}`)
        .then( (response) => {
            setProfileOwner(response.data)
        })
        .catch((error)=> {
            console.error("Error fetching user:", error)
        })
    }, [username])

    const {id, bio, profile_pic} = profileOwner;

    const fetchPosts = () =>{
        if(id){
            Axios.get(`${apiUrl}/posts/profilePage/${id}`, {
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
    }

    useEffect(() => {
        fetchPosts();
    }, [id]);

    
    const followeeId = id;
    useEffect(() => {
        if(id){
            Axios.get(`${apiUrl}/follows/followers/${followeeId}`)
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
            Axios.get(`${apiUrl}/follows/following/${followerId}`)
            .then((response) => {
                setFollowing(response.data.length);
            })
            .catch((error) => {
                console.error("Error fetching following:", error);
            });
        }
        
    }, [id]);


    useEffect(() => {
        if(id){
            Axios.get(`${apiUrl}/follows/isFollowing/${followeeId}`, {
                headers: {
                    accessToken: accessToken,
                },
            })
            .then((response) => {
                setIsFollowing(response.data.isFollowing);
            })
            .catch((error) => {
                console.error("Error fetching following:", error);
            });
        }
        
    }, [id]);


    const handleFollow = () =>{
        Axios.post(`${apiUrl}/follows/${followeeId}`, {}, {
            headers: {
                accessToken: accessToken,
            },
        })
        .then(() => {
            setIsFollowing(true);
        })
        .catch((error) => {
            console.error("Error handling follow:", error);
        });
    }

    const handleUnfollow = () =>{
        Axios.delete(`${apiUrl}/follows/${followeeId}`, {
            headers: {
                accessToken: accessToken,
            },
        })
        .then(() => {
            setIsFollowing(false);
        })
        .catch((error) => {
            console.error("Error handling unfollow", error);
        });
    }

    const handleDelete = (postId) =>{
        Axios.patch(`${apiUrl}/posts/${postId}`, null, {
            headers: {
                accessToken: accessToken,
            },
        })
        .then(() => {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        })
        .catch((error) => {
            console.error("Error fetching posts:", error);
        });
    }

    useEffect(() => {
        const newLikedPosts = {};
        const newLikeCounts = {};
        
        posts.forEach(post => {
            // Initialize like counts
            newLikeCounts[post.id] = post.likeCount;
            
            // Check if each post is liked
            Axios.get(`${apiUrl}/likes/isLiked/${post.id}`, {
                headers: { accessToken }
            })
            .then(response => {
                setLikedPosts(prev => ({
                    ...prev,
                    [post.id]: response.data.isPostLiked
                }));
            })
            .catch(error => console.error("Error checking like status:", error));
        });
        
        setLikeCounts(newLikeCounts);
    }, [posts]);

    const handleLike = async (postId) => {
        try {
            const response = await Axios.get(`${apiUrl}/likes/isLiked/${postId}`, {
                headers: { accessToken }
            });
            
            const isPostLiked = response.data.isPostLiked;
            const newLikedState = !isPostLiked;
    
            if (newLikedState) {
                await Axios.post(`${apiUrl}/likes/${postId}`, null, {
                    headers: { accessToken }
                });
                setLikeCounts(prev => ({
                    ...prev,
                    [postId]: prev[postId] + 1
                }));
            } else {
                await Axios.delete(`${apiUrl}/likes/${postId}`, {
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
    

    if (!user) {
        return <div>Loading...</div>; 
    }


    
    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh', margin: '0', padding: '0' }}>
        {<Header />}
        <div className="d-flex" style={{ marginTop: '0', paddingTop: '0' }}>
            <Sidebar style={{ margin: '0', padding: '0', height: '100vh', position: 'sticky', top: '0' }} />  
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="mb-4 shadow-sm" style={{ backgroundColor: 'white' }}>
                            <Card.Body>
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
                                    {isSameUsername && (
                                        <Link to="/account">
                                            <Button variant="primary">Edit Profile</Button>
                                        </Link>
                                    )}
                                    {!isSameUsername && isFollowing && (
                                        <Button variant="primary" onClick={handleUnfollow}>Unfollow</Button>
                                    )}
                                    {!isSameUsername && !isFollowing && (
                                        <Button variant="primary" onClick={handleFollow}>Follow</Button>
                                    )}
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
                            </Card.Body>
                        </Card>
    
                        {/* Posts */}
                        {posts.map((post) => (
                            <Card key={post.id} className="mb-3 shadow-sm" style={{ backgroundColor: '#EFEFEF' }}>
                                <Card.Body>
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <h5 className="card-title mb-0">
                                            {post.poster.username}
                                        </h5>
                                        {isSameUsername && <DropdownDelete 
                                            onDelete={(postId) => {
                                                handleDelete(postId);
                                            }} 
                                            postId={post.id} 
                                        /> }
                                    </div>
                                    <Link to={`/post/${post.id}`} key={post.id} className="text-decoration-none text-reset">
                                        <p className="card-text">{post.content}</p>
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
                                                {likeCounts[post.id] || 0} Likes
                                            </div>
                                            <div>
                                                <i className="bi bi-chat-fill me-1"></i>
                                                {post.replies.length} Replies
                                            </div>
                                        </div>
                                    </Link>
                                </Card.Body>
                            </Card>
                        ))} 
                    </Col>
                </Row>
            </Container>
        </div>
    </div>
    );
};



/*useEffect(() => {
        if(id){
            Axios.get(`${apiUrl}/posts/profilePage/${id}`, {
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
        
    }, [id]);*/

    //console.log(posts);
