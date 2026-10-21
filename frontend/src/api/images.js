import api from "./axios";

// Site images live in the API's wwwroot/images folder, served as static files (not under /api)
export const siteImageUrl = (fileName) => new URL(`/images/${fileName}`, api.defaults.baseURL).href;
