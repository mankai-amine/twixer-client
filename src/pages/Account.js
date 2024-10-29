import React, { useContext, useEffect, useState } from 'react';
import { setValue, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../helpers/UserContext";
import FlashMessage from "../helpers/FlashMessage";

// Define the form schema with Yup
const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    username: Yup.string()
      .min(2, "Username must be at least 2 characters")
      .max(50, "Username must be less or equal than 50 characters")
      .required("Username is required"),
    bio: Yup.string()
      .min(10, "Bio must be at least 6 characters")
      .max(160, "Bio must be less or equal than 64 characters")
      .required("Bio is required"),
});

export const Account = () => {
    
    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    
    const [flashMessage, setFlashMessage] = useState(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        
        if (!user) return;

        setValue("email", user.email);
        setValue("username", user.username);
        setValue("bio", user.bio);

    }, [user, setValue]);

    const onSubmit = (data) => {
        const accessToken = sessionStorage.getItem("accessToken");
        const id = user.id

        Axios.put(`http://localhost:3001/api/users/update/${id}`, {
            email: data.email,
            username: data.username,
            bio: data.bio,
        }, {
            headers: {
                accessToken: accessToken,
            },
        })
        .then(() => {
            setFlashMessage({ message: "User updated successfully", type: "success" });
            setTimeout(() => {
                setFlashMessage(null);
                navigate("/"); 
            }, 2000);
        })
        .catch((error) => {
            setFlashMessage({ message: "Error updating user", type: "danger" });
            console.error("Error updating the user:", error);
        });
    };

    

    return (
        <div className="container mt-5 col-md-8">
            {flashMessage && (
                <FlashMessage
                    message={flashMessage.message}
                    type={flashMessage.type}
                    onClose={() => setFlashMessage(null)}
                />
            )}
            <h3 className="mb-3">Update settings</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-light p-4 rounded shadow">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        {...register("email")}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        {...register("username")}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <input
                        type="text"
                        className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                        {...register("bio")}
                    />
                    {errors.bio && <div className="invalid-feedback">{errors.bio.message}</div>}
                </div>

                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    );
};

