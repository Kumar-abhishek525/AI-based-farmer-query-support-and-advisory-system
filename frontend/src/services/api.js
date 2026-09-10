// // src/services/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // change to your deployed backend URL in production
// });

// // Attach token automatically on every request (in case a page refresh
// // happens before AuthContext finishes restoring it)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // If the backend ever responds 401 (expired/invalid token), clear the
// // session and bounce to login instead of leaving the app in a broken state
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
// export default api;

import axios, { Axios } from "axios";

const api = axios.create({
      baseURL:"http://localhost:5000/api"
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }

    return config;
});

export default api;