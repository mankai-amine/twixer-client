import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
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
      .min(6, "Username must be at least 6 characters")
      .max(64, "Username must be less or equal than 64 characters")
      .required("Username is required"),
    bio: Yup.string()
      .min(6, "Bio must be at least 6 characters")
      .max(64, "Bio must be less or equal than 64 characters")
      .required("Bio is required"),
});

export const Account = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [flashMessage, setFlashMessage] = useState(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");

        Axios.get(`http://localhost:3001/api/users/${id}`, {
            headers: {
                accesstoken: accessToken, 
            },
        })
        .then((response) => {
            const { email, username, bio } = response.data;
            setValue("email", email);
            setValue("username", username);
            setValue("bio", bio);
        })
        .catch((error) => {
            console.error("Error fetching user:", error);
        });
    }, [id]);

    const onSubmit = (data) => {
        const accessToken = sessionStorage.getItem("accessToken");

        Axios.put(`http://localhost:3001/api/todos/${id}`, {
            email: data.email,
            username: data.username,
            bio: data.bio,
            ownerId: user.id,
        }, {
            headers: {
                accessToken: accessToken,
            },
        })
        .then(() => {
            setFlashMessage({ message: "Todo updated successfully", type: "success" });
            setTimeout(() => {
                setFlashMessage(null);
                navigate("/"); 
            }, 2000);
        })
        .catch((error) => {
            setFlashMessage({ message: "Error updating user", type: "danger" });
            console.error("Error updating the todo:", error);
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

