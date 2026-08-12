import Pusher from 'pusher-js';
import Echo from "laravel-echo";
import { broadcastingAuthUrl } from '@/utils/constants';

window.Pusher = Pusher;

const token = JSON.parse(localStorage.getItem('token'));
// const token = localStorage.getItem('token') || '';

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'cc8535c1b59a9f960bc6',
    cluster: 'ap3',
    authEndpoint: broadcastingAuthUrl,
    withCredentials: true,
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },
});


echo.connector.pusher.connection.bind("error", (err) => {
    console.error("Pusher Error:", err);
});

echo.connector.pusher.connection.bind("connected", () => {
    console.log("Connected to Reverb!");
});

export default echo;
