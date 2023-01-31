import useSWR from "swr";
import {listData, listWalletChangeTypeOptions} from "../../../libs/api-admin";
import {useEffect, useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";
import {keyToken} from "../../../consts/consts";
import jsCookie from "js-cookie";
import numeral from 'numeral'

const pageConf = {
    name: '账变日志', path: '/walletChangeLog',
    fields: [
        {field: 'id', name: 'ID', renderFn: (d) => d.id, search: 1},
        {field: 'transId', name: '交易ID', search: 1, required: 1, disabled: 1},
        {field: 'uname', name: '用户名', search: 1, disabled: 1, editHide: 1},
        {field: 'amount', name: '交易金额', disabled: 1, renderFn: (d) => d.amount > 0 ? <span className={'color-red strong'}>{numeral(d.amount).format('0,0.00')}</span> : <span className={'color-green strong'}>{numeral(d.amount).format('0,00.00')}</span>},
        {field: 'balance', name: '余额', disabled: 1, renderFn: (d) => numeral(d.balance).format('0,00.00')},
        {field: 'type', name: '类型', search: 1, type: 'select', options: process.env.OPTIONS_STATUS, disabled: 1},
        {field: 'desc', name: '备注', search: 1},
        {field: 'createdAt', name: '创建时间'},
    ]
}

export default function WalletChangeLog() {
    const [query, setQuery] = useState() // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    // 获取并修改账变 options
    useEffect(() => {
        listWalletChangeTypeOptions(jsCookie.get(keyToken)).then(({data}) => {
            let arr = []
            data.forEach(i => arr.push(`${i.id}:${i.title}:${i.class}`))
            pageConf.fields[5].options = arr.join(",")
        })
    }, [])
    return (<>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    {showType === 1 && <MainPage query={query} setQuery={setQuery} setShowType={setShowType} setId={setId}/>}
                    {showType === 2 && <AddPage pageConf={pageConf} setShowType={setShowType}/>}
                    {showType === 3 && <UpdatePage pageConf={pageConf} setShowType={setShowType} id={id}/>}
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}

const MainPage = ({query, setQuery, setShowType, setId}) => {
    const [tempQuery, setTempQuery] = useState({})
    const s = objToParams(query)
    const {data, isLoading, mutate, error} = useSWR(`/${pageConf.path}/list?${s != undefined ? s : ''}`, listData)
    if (error) return toast.error(error)
    if (isLoading) return
    return <>
        <PageInfo>
            <div className={'cell p-3 flex-center'}>
                <span className={'mr-auto'}></span>
                <SearchInput pageConf={pageConf} tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery}></SearchInput>
            </div>
        </PageInfo>
        <div className={'box-02 no-bottom-border'}>
            {isLoading
                ? <FullScreenLoading/>
                : <>
                    {data && data.list.length == 0
                        ? <div className={'cell color-desc-02 fs-13'}>暂无数据</div>
                        : <>
                            <div className={'cell flex-center p-3'}><PageButtons query={query} setTempQuery={setTempQuery} setQuery={setQuery} totalPage={data.total_page} total={data.total}/></div>
                            <table className={'table-1'}>
                                <tbody>
                                <tr>{pageConf.fields.filter(i => !i.hide).map((i, index) => <th key={index}>{i.name}</th>)}
                                    <th>操作</th>
                                </tr>
                                {data && data.list.map((i, index) => <tr key={index}><Td pageConf={pageConf} data={i}/>
                                    <td>
                                        <button className={'btn-warning strong mr-6'} onClick={() => setId(i.id) & setShowType(3)}>修改</button>
                                        <button className={'btn-danger strong'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</button>
                                    </td>
                                </tr>)}
                                </tbody>
                            </table>
                            <div className={'cell-tools p-3 flex-center'}><PageButtons totalPage={data.total_page} total={data.total} setQuery={setQuery} query={query} setTempQuery={setTempQuery}/></div>
                        </>
                    }
                </>
            }
        </div>
    </>
}