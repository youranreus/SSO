/**
 * @author 季悠然
 * @date 2022-05-13
 */

import axios from 'axios'
import Qs from 'qs'
import { VUE_APP_API } from '../config';

const API = axios.create({
  baseURL: VUE_APP_API
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

const sendResetPassword = (putObj) => {
  return API.put('/user/password', putObj);
}

export { sendLoginInfo, sendToken }
export { sendEmailCode, sendRegisterInfo }
export { sendResetPassword }
