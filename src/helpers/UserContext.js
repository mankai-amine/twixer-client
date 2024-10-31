import React, { createContext, useState, useEffect, useContext } from 'react';
import Axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = sessionStorage.getItem("accessToken");
            if (accessToken) {
                try {
                    const response = await Axios.get(`${process.env.REACT_APP_API_URL}/users`, {
                        headers: { accessToken }
                    });
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
