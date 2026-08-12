import React from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";

function ProtectedAdmin(props) {

    const { Component } = props;
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');

        // Check authentication and authorization
        if (!token || user?.role !== 'admin') {
            navigate('/signin', { replace: true });
            return;
        }
    }, [navigate]); // Added navigate to dependency array

    // Optional: Show loading state while checking auth
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || user?.role !== 'admin') {
        return null; // or a loading spinner
    }

    return <Component />;
}

export default ProtectedAdmin;
