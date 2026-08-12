
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function ProtectedInfluencer({ Component }) {
//     const navigate = useNavigate();

//     const verifyAuth = () => {
//         const storedToken = localStorage.getItem('token');
//         let user = null;

//         try {
//             const rawUser = localStorage.getItem('user');
//             if (rawUser && rawUser !== 'undefined' && rawUser !== 'null') {
//                 user = JSON.parse(rawUser);
//             }
//         } catch (error) {
//             console.error("Failed to parse user from localStorage:", error);

//         }

//         if (!storedToken || user?.role !== 'influencer') {
//             // console.log('red')
//             navigate('/influencer-signup', { replace: true });

//         }
//     };
//     useEffect(() => {


//         verifyAuth();
//     }, [navigate]);




//     return <Component />;
// }

// export default ProtectedInfluencer;

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const safeParseUser = () => {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;

    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error("Invalid user JSON in localStorage:", err);
        return null;
    }
};

const isInfluencerAuthed = () => {
    const token = localStorage.getItem("token");
    const user = safeParseUser();
    return Boolean(token) && user?.role === "influencer";
};

function ProtectedInfluencer({ Component }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [allowed, setAllowed] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const ok = isInfluencerAuthed();

        if (!ok) {
            setAllowed(false);
            setChecking(false);
            navigate("/influencer-signup", {
                replace: true,
                state: { from: location.pathname },
            });
            return;
        }

        setAllowed(true);
        setChecking(false);
    }, [navigate, location.pathname]);

    if (checking) return null; // optional: loader
    if (!allowed) return null;

    return <Component />;
}

export default ProtectedInfluencer;




