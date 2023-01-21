import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";
import jsCookie from "js-cookie";
import {keyToken} from "../consts/consts";

export const ThemeToggle = () => {
    // 设置暗黑模式
    const [dark, setDark] = useState(false)
    useEffect(() => {
        setDark(localStorage.getItem('dark') === 'true')
    }, [])
    const handleSet = () => {
        setDark(!dark)
        localStorage.setItem('dark', !dark)
        document.getElementById('theme').href = !dark ? '/css/dark.css' : '/css/white.css'
    }
    return <img
        className={'cursor-pointer'}
        src={dark ? '/image/toggle-dark.png' : '/image/toggle-light.png'}
        onClick={handleSet}
        alt={'logo'} width={'43px'}
    />
}
export const FullScreenLoading = () => (
    <>
        <div className="full-screen-loading">
            <div className="loading-spinner"/>
            <div className={'tag-primary ml-12'}>加载中...</div>
        </div>
    </>
)
export const ImgUpload = ({options, onSuccess}) => {
    const [files, setFiles] = useState([])
    const [group, setGroup] = useState(2)
    const handleFileChange = (e) => {
        console.log(e.target.files)
        setFiles(e.target.files)
    }
    const handleUpload = async () => {
        if (files.length == 0) {
            toast.warning('文件不能为空')
            return
        }
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i])
        }
        try {
            const {data} = await axios.post(`${process.env.BASE_API}/file/upload?group=${group}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': jsCookie.get(keyToken)
                }
            })
            onSuccess(data)
        } catch (err) {
            setError(err)
        }
    }
    return <>
        <tr>
            <td>分组</td>
            <td><select value={group} onChange={e => setGroup(e.target.value)} required={true} defaultValue={1}>
                <option>请选择</option>
                {options.split(',').map((i, index) => {
                    let arr = i.split(':')
                    return <option key={index} value={arr[0]} className={arr[2]}>{arr[1]}</option>
                })}
            </select></td>

        </tr>
        <tr>
            <td>图片</td>
            <td>
                <input type="file" multiple onChange={handleFileChange}/>
            </td>
            <td>
                <button className={'btn-warning'} onClick={handleUpload}>上传</button>
            </td>
        </tr>
    </>
}
