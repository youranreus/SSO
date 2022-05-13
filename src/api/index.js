/**
 * @author 季悠然
 * @date 2022-05-13
 */

import axios from 'axios'

const API = axios.create({
    baseURL: 'https://i.exia.xyz'
})

API.interceptors.request.use((req) => {
    if (localStorage.getItem("token"))
        req.headers.Authorization = localStorage.getItem("token");
    return req;
});

export const getHi = () => API.get('/')