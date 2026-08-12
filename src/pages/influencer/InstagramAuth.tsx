import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const state = params.get('state');
        // const user = params.get('user');

        if (state) {
            localStorage.setItem('instagram', state);
            //  localStorage.setItem('', user);
            // Set auth context or Redux state if using
            navigate('/influencer/dashboard');
        } else {
            // Error handling
            navigate('/influencer');
        }
    }, [location]);

};

export default OAuthCallback;

