import useSWR from "swr";
import {listData, listWalletChangeTypeOptions, updateTopUpApplication} from "../../../libs/api-admin";
import {useEffect, useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";
import jsCookie from "js-cookie";
import {keyToken} from "../../../consts/consts";

const pageConf = {
    name: '充值订单', path: '/walletTopUpApplication',
    fields: [
        {field: 'id', name: 'ID', renderFn: (d) => d.id,},
        {field: 'transId', name: '交易ID', search: 1, required: 1, disabled: 1},
        {field: 'uname', name: '用户名', search: 1, editHide: 1},
        {field: 'changeType', name: '充值类型', search: 1, type: 'select', options: process.env.OPTIONS_STATUS, disabled: 1},
        {field: 'money', name: 'Money', disabled: 1},
        {field: 'ip', name: '充值IP', search: 1, disabled: 1},
        {field: 'description', name: '备注', search: 1},
        {field: 'admin', name: '管理员', search: 1, editHide: 1},
        {field: 'status', name: '状态', options: '1:等待:tag-warning,2:成功:tag-success,3:失败:tag-danger', search: 1, disabled: 1},
        {field: 'createdAt', name: '创建时间'}
    ]
}

export default function WalletTopUpApplication() {
    const [query, setQuery] = useState() // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    // 获取交易类型
    useEffect(() => {
        listWalletChangeTypeOptions(jsCookie.get(keyToken)).then(({data}) => {
            let arr = []
            data.filter(i => i.type == 1).forEach(i => arr.push(`${i.id}:${i.title}:${i.class}`))
            pageConf.fields[3].options = arr.join(",")
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

    const handleSubmit = (id, type) => {
        updateTopUpApplication(id, type).then(res => {
            toast.success('操作成功')
            mutate()
        })
    }
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
                            <div className={'cell flex-center p-3'}><PageButtons tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery} totalPage={data.total_page} total={data.total}/></div>
                            <table className={'table-1'}>
                                <tbody>
                                <tr>{pageConf.fields.filter(i => !i.hide).map((i, index) => <th key={index}>{i.name}</th>)}
                                    <th>操作</th>
                                </tr>
                                {data && data.list.map((i, index) => <tr key={index}><Td pageConf={pageConf} data={i}/>
                                    <td>
                                        {i.status == 1 &&
                                            <>
                                                <button className={'btn-success strong mr-6'} onClick={() => handleSubmit(i.id, 1)}>通过</button>
                                                <button className={'btn-primary strong mr-6'} onClick={() => handleSubmit(i.id, 2)}>拒绝</button>
                                            </>
                                        }
                                        <button className={'btn-warning strong mr-6'} onClick={() => setId(i.id) & setShowType(3)}>修改</button>
                                        <button className={'btn-danger strong'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</button>
                                    </td>
                                </tr>)}
                                </tbody>
                            </table>
                            <div className={'cell-tools p-3 flex-center'}><PageButtons totalPage={data.total_page} total={data.total} setTempQuery={setTempQuery} setQuery={setQuery} query={query}/></div>
                        </>
                    }
                </>
            }
        </div>
    </>
}