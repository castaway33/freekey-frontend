import {Footer} from "../../../compoents/sys-page";
import Link from "next/link";
import LockIcon from '@mui/icons-material/Lock';
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {keyAdminId, keyAdminInfo, keyToken} from "../../../consts/consts";
import axios from "axios";
import jsCookie from "js-cookie";
import {useRouter} from "next/router";
import {getAdminInfo, login} from "../../../libs/api-admin";

export default function Login({connectWs}) {
    const [uname, setUname] = useState('')
    const [pass, setPass] = useState('')
    const [randomId, setRandomId] = useState()
    const [inputCaptcha, setInputCaptcha] = useState('')
    const [captcha, setCaptcha] = useState()
    const router = useRouter()

    // captcha
    const getCaptcha = async () => {
        let id = Math.random()
        axios.get(`${process.env.BASE_API}/getCaptcha?id=${id}`).then(({data}) => {
            if (data.code !== 0) {
                toast.error(data.message)
            }
            setRandomId(id)
            setCaptcha(data.data.img)
            setInputCaptcha('')
        }).catch(e => {
            console.log(e)
            toast.error(e)
        })
    }
    // Enter the page to get the verification code
    useEffect(() => {
        getCaptcha()
    }, [])

    // check form
    const checkForm = () => {
        let err = {}
        if (!uname) {
            err.name = '用户名'
        }
        if (!pass) {
            err.pass = '密码'
        }
        if (!inputCaptcha) {
            err.inputCaptcha = '验证码'
        }
        if (Object.keys(err).length !== 0) {
            let msg = []
            for (let errKey in err) {
                msg.push(err[errKey])
            }
            toast.error(`请输入 [${msg.join('，')}]`)
            return false
        }
        return true
    }

    // handle login request
    const handleLogin = async (e) => {
        e.preventDefault()
        if (!checkForm()) {
            return
        }
        try {
            const {code, data} = await login(uname, pass, randomId, inputCaptcha)
            if (code !== 0) {
                getCaptcha()
                return
            }
            jsCookie.set(keyToken, data.token)
            getInfo()
        } catch (e) {
            console.log(e)
            toast.error(e.message)
        }
    }

    // get admin info
    const getInfo = async () => {
        try {
            const {data} = await getAdminInfo()
            const {info, menus} = data
            jsCookie.set(keyAdminId, info.id)
            localStorage.setItem(keyAdminInfo, JSON.stringify(info))
            let m = []
            menus.forEach(i => m.push(...i.children.map(i => i)))
            toast.success('登录成功',)
            connectWs()
            setTimeout(() => router.push(process.env.HOME_PAGE), 2000)
        } catch (e) {
            toast.error(e.message)
        }
    }
    return <>
        <div className={'top'}>
            <div className="w flex-center">
                <Link className={'logo mr-auto'} href={''}>FREE KEY</Link>
            </div>
        </div>
        <div className={'wrapper'}>
            <div className={'w'}>
                <div className={'wrapper-left'}>
                    <div className={'box-02 no-bottom-border'}>
                        <div className="cell  flex-center">
                            <Link href={''}>{process.env.SYSTEM_NAME}</Link>&nbsp;›&nbsp;
                            <span>管理员登录</span>
                            <LockIcon className={'ml-3'} fontSize='13'/>
                        </div>
                        <form className={'cell'}>
                            <table className={'table-add'} cellPadding={10} cellSpacing={10} width={'100%'} border={0}>
                                <tbody>
                                <tr>
                                    <td width={120} align={"right"}>用户名</td>
                                    <td><input value={uname} onChange={e => setUname(e.target.value)} type="text" required placeholder={'请输入用户名'}/></td>
                                </tr>
                                <tr>
                                    <td width={120} align={"right"}>密码</td>
                                    <td><input value={pass} onChange={e => setPass(e.target.value)} type="password" required placeholder={'请输入密码'}/></td>
                                </tr>
                                <tr>
                                    <td width={120}></td>
                                    <td><img onClick={() => getCaptcha()} src={captcha && captcha} alt="" style={{width: '187px', borderRadius: '8px', height: '60px'}}/></td>
                                </tr>
                                <tr>
                                    <td width={120} align={'right'}>你是机器人吗？</td>
                                    <td><input value={inputCaptcha} onChange={e => setInputCaptcha(e.target.value)} type="text" placeholder={'请输入验证码，点击可以更换图片'}/></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <button type={'submit'} className={'btn-info'} onClick={handleLogin}>登录</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
}

