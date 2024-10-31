import React, { useState } from 'react';
import Axios from 'axios';

export const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    
    const handleUpload = async () => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!selectedFile) {
        alert("Please select a file to upload.");
        return;
    }

    try {
        setUploading(true);
        setError(null);
        setMessage(null);

        // Get the presigned URL from the backend
        const response = await Axios.post('process.env.REACT_APP_API_URL/uploads/presignedUrl', {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        }, {
        headers: {
            accessToken: accessToken,
        }
        });

        const { url, fileKey } = response.data;

        // Upload the file to S3
        await Axios.put(url, selectedFile, {
        headers: {
            'Content-Type': selectedFile.type,
        },
        });

        // Send fileKey to backend to update user profile
        await Axios.post('process.env.REACT_APP_API_URL/uploads/uploadImage', {
        fileKey: fileKey,
        }, {
        headers: {
            accessToken: accessToken,
        }
        });

        setMessage("Profile picture uploaded successfully!");
    } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload file. Please try again.");
    } finally {
        setUploading(false);
    }
    };

    return (
    <div>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload picture"}
        </button>
    </div>
    );
};
