import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const accessToken = sessionStorage.getItem("accessToken");

    // If the user is authenticated, render the component; otherwise, redirect to login
    return accessToken ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;