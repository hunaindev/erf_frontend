import api from './Axios';
import { imageUrl } from '@/utils/constants';

export const imageURL = imageUrl;


export const forgotPassword = async (payload) => {
    const response = await api.post('/forgot-password', payload);
    return response.data;
};

export const resetPassword = async (payload) => {
    const response = await api.post('/reset-password', payload);
    return response.data;
};

export const getAcceptApplyCampaign = async () => {
    const response = await api.get('/get-accept-apply-campaign');
    return response.data.data;
};

export const updateNextBilling = async () => {
    const response = await api.get('/update-next-billing');
    return response.data;
};
export const updateExpiredTrials = async () => {
    const response = await api.get('/update-expired-trials');
    return response.data;
};

/* Start Admin Api */


/* category */
export const getCategory = async () => {
    const response = await api.get('/get-category');
    return response.data;
};

export const createCategory = async (payload) => {
    const response = await api.post('/create-post_category', payload);
    return response.data;
};

export const updateCategory = async (payload) => {
    const response = await api.post('/update-category', payload);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/delete-category/${id}`);
    return response.data;
};
/* category */

/* post */
export const getPost = async () => {
    const response = await api.get('/get-post');
    return response.data;
};

export const createPost = async (payload) => {
    const response = await api.post('/create-post', payload);
    return response.data;
};

export const updatePost = async (payload) => {
    const response = await api.post('/update-post', payload);
    return response.data;
};

export const deletePost = async (id) => {
    const response = await api.delete(`/delete-post/${id}`);
    return response.data;
};
export const postStatus = async (id) => {
    const response = await api.get(`/post-status/${id}`);
    return response.data;
};
/* post */

export const getUser = async () => {
    const response = await api.get('/get-user');
    return response.data.users;
};

export const createUser = async (payload) => {
    const response = await api.post('/create-user', payload);
    return response.data;
};

export const logout = async () => {
    const response = await api.post('/logout');
    return response.data;
};


export const updateUser = async (payload) => {
    const response = await api.put('/update-user', payload);
    return response.data;
};

export const userStatus = async (payload) => {
    const response = await api.put('/user-status', payload);
    return response.data;
};


export const getCoupon = async () => {
    const response = await api.get('/get-coupon');
    return response.data;
};

export const createCoupon = async (payload) => {
    const response = await api.post('/create-coupon', payload);
    return response.data;
};

export const deleteCoupon = async (id) => {
    const response = await api.delete(`/delete-coupon/${id}`);
    return response.data;
};



export const getAllSubscriptions = async () => {
    const response = await api.get('/get-all-subscriptions');
    return response.data;
};

export const getPlugin = async () => {
    const response = await api.get('/get-plugin');
    return response.data;
};

export const getPluginOrganisation = async () => {
    const response = await api.get('/get-plugin-organisation');
    return response.data;
};

export const getPluginUser = async () => {
    const response = await api.get('/get-plugin-user');
    return response.data;
};


/* ------------------------------------------------------ */
export const getSlide = async () => {
    const response = await api.get('/get-slides');
    return response.data.slides;
};

export const createSlide = async (payload) => {
    const response = await api.post('/create-slide', payload);
    return response.data;
};

export const updateSlide = async (payload) => {
    const response = await api.post('/update-slide', payload);
    return response.data;
};

export const slideStatus = async (id) => {
    const response = await api.get(`/slide-status/${id}`);
    return response.data;
};

export const deleteSlide = async (id) => {
    const response = await api.delete(`/delete-slide/${id}`);
    return response.data;
};

export const getLandingSlides = async (id) => {
    const response = await api.get(`/get-landing-slides`);
    return response.data.slides;
};




export const deleteInfluencer = async (id: number | string) => {
    const response = await api.delete(`/delete-influencer/${id}`);
    return response.data;
};

/* end admin Api */



/* Organisation Route */

/* The commented out code block is defining an asynchronous function named `organisationLogout` that
makes a POST request to the '/organisation-logout' endpoint using the `api` object imported from
'./Axios'. The function is expected to return the data received in the response from the API call. */

export const getOrganisationUser = async () => {
    const response = await api.get('/get-organisation-user');
    return response.data.users;
};

export const createOrganisationUser = async (payload) => {
    const response = await api.post('/create-organisation-user', payload);
    return response.data;
};

export const updateOrganisationUser = async (payload) => {
    const response = await api.put('/update-organisation-user', payload);
    return response.data;
};

export const statusOrganisationUser = async (payload) => {
    const response = await api.put('/user-organisation-status', payload);
    return response.data;
};

export const userOrganisationDelete = async (payload) => {
    const response = await api.put('/user-organisation-delete', payload);
    return response.data;
};

export const getOrganisationCoupon = async () => {
    const response = await api.get('/get-organisation-coupon');
    return response.data.coupons;
};



export const sendInvites = async (payload) => {
    const response = await api.post('/send-invites', payload);
    return response.data;
};

export const orgsMembers = async () => {
    const response = await api.get('/orgs-members');
    return response.data;
};

export const inviteDelete = async (id) => {
    const response = await api.delete(`/orgs-invites/${id}`);
    return response.data;
};

/* Organisation Route */




/* Start User Api */


export const professionalSubscriptionMonthly = async (payload) => {
    const response = await api.post('/professional-subscription-monthly', payload);
    return response.data;
};

export const getSubscriptionDetails = async () => {
    const response = await api.get('/get-subscription-details');
    return response.data;
};

export const updateProfile = async (payload) => {
    const response = await api.put('/update-profile', payload);
    return response.data;
};

export const cancelSubscription = async () => {
    const response = await api.post('/cancel-subscription');
    return response.data;
};

export const getPosts = async () => {
    const response = await api.get('/get-posts');
    return response.data;
};

export const getPostById = async (slug) => {
    const response = await api.get(`/get-post-by-slug/${slug}`);
    return response.data;
};
export const getMostViewPosts = async () => {
    const response = await api.get('/get-most-view-posts');
    return response.data;
};


/* News Letter */
export const createNewsLetter = async (payload) => {
    const response = await api.post('/create-news-letter', payload);
    return response.data;
};
/* News Letter */


export const createVideoDemo = async (payload) => {
    const response = await api.post('/video-demo', payload);
    return response.data;
};

/* End User Api */
