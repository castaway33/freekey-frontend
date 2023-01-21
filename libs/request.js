import axios from 'axios'
import {toast} from "react-toastify";
import jsCookie from "js-cookie";
import {keyToken} from "../consts/consts";

export const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 100000
})
service.interceptors.request.use(config => {
    return config
}, error => {
    location.href = '/backend/sys/login'
})
service.interceptors.request.use(function (config) {
    config.url = config.baseURL + config.url
    config.headers.token = jsCookie.get(keyToken)
    return config
}, function (err) {
    return Promise.reject(err)
})

service.interceptors.response.use(res => {
    const {code, message, msg} = res.data
    if (code !== 0) {
        toast.error(message || msg)
        return new Error(message || msg)
    }
    return res.data
}, error => {
    if (error.response.status === 403) {
        if (window.location.pathname != '/backend/sys/login') {
            return location.href = '/backend/sys/login'
        }
        console.log(error)
    }
    return Promise.reject(error)
})
