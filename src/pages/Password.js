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
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password must be less or equal than 64 characters")
        .required("Password is required"),
    newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password must be less or equal than 64 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords must match")
        .required("Password is required"),
});

export const Password = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [flashMessage, setFlashMessage] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        const accessToken = sessionStorage.getItem("accessToken");

        Axios.put(`http://localhost:3001/api/todos/${id}`, {
            email: data.email,
            password: data.password,
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
            setFlashMessage({ message: "Error updating todo", type: "danger" });
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
            <h3 className="mb-3">Change password</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-light p-4 rounded shadow">

                <div className="mb-3">
                    <label className="form-label">Current password</label>
                    <input
                        type="currentPassword"
                        className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                        {...register("currentPassword")}
                    />
                    {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword.message}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">New password</label>
                    <input
                        type="newPassword"
                        className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                        {...register("newPassword")}
                    />
                    {errors.newPassword && <div className="invalid-feedback">{errors.newPassword.message}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm new password</label>
                    <input
                        type="confirmPassword"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>

                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    );
};

