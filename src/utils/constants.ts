// const defaultDevelopmentBaseUrl = "http://localhost:8000";
const defaultDevelopmentBaseUrl = "https://erfluencer.com/Eros/public/";

// For local device testing, keep the LAN URL hardcoded here.
export const baseUrl: string = defaultDevelopmentBaseUrl.replace(/\/$/, "");

export const imageUrl: string = `${baseUrl}/storage`;
export const apiBaseUrl: string = `${baseUrl}/api`;
export const broadcastingAuthUrl: string = `${baseUrl}/broadcasting/auth`;
