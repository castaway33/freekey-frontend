import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import {useEffect, useRef, useState} from "react";
import jsCookie from "js-cookie";
import {keyToken} from "../consts/consts";

export default function App({Component, pageProps}) {
    const [ws, setWs] = useState()
    const isMounted = useRef(false)
    const connectWs = () => {
        let token = jsCookie.get(keyToken)
        if (!ws && token) {
            const ws = new WebSocket(`${process.env.WS_API}?token=${token}`,)
            setWs(ws)
            ws.onopen = (e) => {
                console.log('SUCCEED')
            }
            ws.onerror = (e) => {
                console.log('ERROR')
            }
            ws.onmessage = ({data}) => {
                const d = JSON.parse(data)
                toast(d.msg, {type: d.type, position: d.position ? d.position : 'bottom-right', autoClose: 10000, hideProgressBar: false})
            }
        }
    }
    useEffect(() => {
        if (isMounted.current) {
            return
        }
        isMounted.current = true
        connectWs()
    }, [])
    return (<>
        <Component  {...pageProps} ws={ws} connectWs={connectWs}/>
        <ToastContainer
            position={'top-center'}
            autoClose={3000}
            theme={'dark'}
            // hideProgressBar
        />
    </>);
}



