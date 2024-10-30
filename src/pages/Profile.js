import { useState } from "react";
import { Button, InputGroup  } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Profile = () => {

    const [profilePic, setProfilePic] = useState("");
    return (
        <div className="container mt-5 col-md-8">
            <nav className="navbar bg-body-tertiary">
                <div className="container">
                    <p>Image here</p>

                    <Link to="/account">
                        <Button variant="primary">Edit account</Button>
                    </Link>
                </div>
            </nav>
        </div>
    );
};
