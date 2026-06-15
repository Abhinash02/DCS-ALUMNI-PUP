import axios from "axios";

const API_URLS = {
  development: "http://localhost:5000/api",
  production: "https://dcs-alumni.vercel.app/api",
};

const getBaseURL = () => {
  // 1. Check if the user has manually set a specific URL or environment in localStorage
  if (typeof window !== "undefined") {
    const savedUrl = localStorage.getItem("REACT_APP_API_URL");
    if (savedUrl) return savedUrl;

    const savedEnv = localStorage.getItem("api_env");
    if (savedEnv === "production") return API_URLS.production;
    if (savedEnv === "development" || savedEnv === "local") return API_URLS.development;
  }

  // 2. Otherwise, check the hostname of the current page.
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If we are on ANY live domain (not localhost), strictly use the Vercel production backend
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return API_URLS.production;
    }
  }

  // 3. If we are on localhost, default to development backend
  return API_URLS.development;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Expose a helper on the window object so the user can easily switch it via console if needed
if (typeof window !== "undefined") {
  window.setBackendEnv = (env) => {
    if (env === "production") {
      localStorage.setItem("api_env", "production");
      console.log("Backend switched to PRODUCTION: " + API_URLS.production + ". Please reload the page.");
    } else if (env === "development" || env === "local") {
      localStorage.setItem("api_env", "development");
      console.log("Backend switched to DEVELOPMENT/LOCAL: " + API_URLS.development + ". Please reload the page.");
    } else if (env === "reset") {
      localStorage.removeItem("api_env");
      localStorage.removeItem("REACT_APP_API_URL");
      console.log("Backend switched to DEFAULT (based on hostname). Please reload the page.");
    } else if (env && env.startsWith("http")) {
      localStorage.setItem("REACT_APP_API_URL", env);
      console.log("Backend switched to CUSTOM URL: " + env + ". Please reload the page.");
    } else {
      console.log("Usage: window.setBackendEnv('production' | 'development' | 'reset' | 'CUSTOM_URL')");
    }
  };
}

export default API;