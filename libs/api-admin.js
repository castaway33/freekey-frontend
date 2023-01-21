import axios from "axios";
import {service} from "./request";
// 客户端使用
export const addData = (url, data) => service.post(url, data)
export const addApiGroup = (group, url) => service.post('/api/addGroup', {group, url})
export const addRoleMenus = (rid, mids) => service.post('/roleMenu/addRoleMenus', {rid, mids}).then(res => res.code)
export const addRoleApis = (rid, apis) => service.post(`/roleApi/addRoleApis`, {rid, apis}).then(res => res.code)
export const login = (uname, pass, id, captcha) => service.post('/login', {uname, pass, id, captcha})
export const sendAdminMsg = (data) => service.post('/ws/sendMsg', data)
export const noticeAdmins = (data) => service.post('/ws/noticeAdmins', data)

export const getAdminInfo = () => service.get('/admin/getInfo')
export const getMenu = (url) => service.get(url)
export const getById = (url) => service.get(url).then(res => res.data && res.data.data)
export const listData = (url) => service.get(url).then(res => res.data)
export const listRoleNoMenus = (id) => service.get(`/roleMenu/listRoleNoMenus?rid=${id}`).then(res => res.data)
export const listRoleNoApis = (id) => service.get(`/roleApi/listRoleNoApis?rid=${id}`).then(res => res.data)

export const del = (url) => service.delete(url)
export const clearRoleMenus = (rid) => service.delete(`/roleMenu/clear?rid=${rid}`)
export const clearRoleApis = (rid) => service.delete(`/roleApi/clear?rid=${rid}`).then(res => res.code)
export const clearOperationLog = () => service.delete("/operationLog/delClear")
export const clearAdminLoginLog = () => service.delete('/adminLoginLog/delClear')
export const clearUserLoginLog = () => service.delete('/userLoginLog/delClear')

export const updateSortMenu = (id, sort) => service.put(`/menu/sort`, {id, sort})
export const updateUserUname = (id, uname) => service.put('/user/updateUname', {id, uname})
export const updateUserPass = (id, pass) => service.put('/user/updatePass', {id, pass})
export const update = (url, data) => service.put(url, data)
export const updateAdminSelfPass = (pass) => service.put('/admin/updateSelfPass', {pass})
export const updateAdminUname = (id, uname) => service.put('/admin/updateUname', {id, uname})
export const updateAdminPass = (id, pass) => service.put('/admin/updatePass', {id, pass})
export const updateWalletPass = (id, pass) => service.put('/wallet/updatePass', {id, pass})
export const updateWalletByAdmin = (uid, money, type, desc) => service.put('/wallet/updateByAdmin', {uid, money, type, desc})
export const updateTopUpApplication = (id, type) => service.put('/walletTopUpApplication/updateByAdmin', {id, type})

// 服务端使用
export const getRoleOptions = (token) => axios.get(`${process.env.BASE_API}/role/getOptions`, {headers: {token}}).then(res => res.data) // 服务端渲染时获取数据
export const listWalletChangeTypeOptions = (token) => axios.get(`${process.env.BASE_API}/walletChangeType/listOptions`, {headers: {token}}).then(res => res.data)
export const listDataServer = (url, token) => axios.get(`${process.env.BASE_API}${url}`, {headers: {token}}).then(res => res.data)