/**
 * @author 季悠然
 * @date 2022-05-13
 */

import axios from 'axios'
import Qs from 'qs'

const API = axios.create({
    baseURL: 'http://119.91.127.163:3000/api'
})

API.interceptors.request.use((req) => {
    if (localStorage.getItem("token"))
        req.headers.Authorization = localStorage.getItem("token");
    return req;
});

const sendLoginInfo = (postObj) => {
    return API.post('/user/login', postObj);
}

const sendEmailCode = (getObj) => {
    return API.get('/email/captcha?' + Qs.stringify(getObj));
}

const sendRegisterInfo = (postObj) => {
    return API.post('/user/register', postObj);
}

const sendToken = () => {
    return API.get('/user/validate');
}

export const getHi = () => API.get('/')
export { sendLoginInfo, sendToken }
export { sendEmailCode, sendRegisterInfo }
