import {Footer, Headers, Nav, PageInfoWithInfo} from "../../../compoents/sys-page";
import Head from "next/head";
import {InfoBox} from "../../../compoents/toy";
import {useState} from "react";
import {searchDate, searchInput} from "../../../compoents/sys-base";
import useSWR from "swr";
import {FullScreenLoading} from "../../../compoents/common";
import {service} from "../../../libs/request";
import {objToParams} from "../../../libs/utils";


const pageConf = {
    infoBoxes: [
        '/image/p001.png:PayPal充值:t1:info-box mr-12',
        '/image/p004.png:银行卡充值:t2:info-box mr-12',
        '/image/p005.gif:微信充值:t3:info-box mr-12',
        '/image/p006.gif:支付宝充值:t4:info-box mr-12',
        '/image/p007.png:人口扣除:t5:info-box-success mr-12',
    ]
}
export default function WalletReport() {
    const [query, setQuery] = useState({uname: '', begin: '', end: ''})
    const [tempQuery, setTempQuery] = useState({})
    const {data, isLoading} = useSWR(`/walletTopUpApplication/getReport?${objToParams(query)}`, service.get)
    return <>
        <Headers/>
        <div className={'wrapper'}>
            <div className={'w'}>
                <div className={'wrapper-left'}>
                    <Head>
                        <title>{process.env.SYSTEM_NAME} › 钱包报表</title>
                    </Head>
                    <Nav/>
                    <div className={'box-02 no-bottom-border'}>
                        <PageInfoWithInfo backUrl={process.env.HOME_PAGE} backName={'FREE KEY'} pageName={'钱包报表'}>
                            <div className={'cell flex'}>
                                <span className={'mr-auto'}></span>
                                {searchInput(1, '用户名', 'uname', tempQuery, setTempQuery, setQuery)}
                                {searchDate(2, tempQuery, setTempQuery, setQuery)}
                            </div>
                        </PageInfoWithInfo>
                    </div>
                    <div className={'box-02 no-bottom-border'}>
                        {isLoading ? <FullScreenLoading/> :
                            <>
                                <div className={'cell '}>
                                    <span className={'color-desc-02 fs-13'}>默认统计半年</span>
                                </div>
                                <div className={'cell'}>
                                    {pageConf.infoBoxes.map(i => {
                                        const arr = i.split(":")
                                        return <InfoBox img={arr[0]} title={arr[1]} num={data.data[arr[2]]} clas={arr[3]}/>
                                    })}
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
}