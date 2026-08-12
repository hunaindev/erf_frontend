// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const OAuthCallback = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const token = params.get('token');
//         const user = params.get('user');

//         if (token) {
//             localStorage.setItem('token', token);
//             localStorage.setItem('user', user);
//             // Set auth context or Redux state if using
//             navigate('/user');
//         } else {
//             // Error handling
//             navigate('/');
//         }
//     }, [location]);

// };

// export default OAuthCallback;


import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { syncStoredPushTokenToBackend } from "@/services/pushNotifications";

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {

        const token = searchParams.get("token");

        // const userParam = ;
        const userParam = JSON.parse(atob(searchParams.get("user")));
        const state = searchParams.get("state");
        const instagramState = searchParams.get("instagramState");

        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(userParam));
        void syncStoredPushTokenToBackend();


        if (userParam?.role === 'influencer') {
            localStorage.setItem("tiktok", state);
            localStorage.setItem("instagram", instagramState);

            navigate("/influencer/dashboard", { replace: true });
            // setTimeout(() => {

            //     toast({
            //         title: "Signed in successfully",
            //         description: "Redirecting to your dashboard...",
            //     });
            // })
        }
        if (userParam?.role === 'brand') {
            // window.location.href = "/dashboard";
            navigate("/dashboard", { replace: true });
        }

        // Redirect user to dashboard/home
        //  navigate("/dashboard", { replace: true });
    }, [searchParams, navigate]);

    //  return <div>Signing you in…</div>;
}
