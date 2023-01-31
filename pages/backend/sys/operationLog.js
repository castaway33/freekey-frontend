import useSWR from "swr";
import {clearOperationLog, listData} from "../../../libs/api-admin";
import {useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";

const pageConf = {
    name: '操作日志', path: '/operationLog',
    fields: [
        {field: 'id', name: 'ID', renderFn: (d) => d.id,},
        {field: 'uname', name: '管理员', search: 1, required: 1},
        {field: 'method', name: '方法', options: 'GET:GET:tag-success,POST:POST:tag-primary,PUT:PUT:tag-warning,DELETE:DELETE:tag-danger', type: 'select', search: 1},
        {field: 'uri', name: '地址'},
        {field: 'content', name: '内容', search: 1},
        {field: 'response', name: '响应'},
        {field: 'ip', name: 'IP', search: 1},
        {field: 'useTime', name: '耗时(ms)'},
        {field: 'createdAt', name: '创建时间'},
    ]
}

export default function OperationLog() {
    const [query, setQuery] = useState() // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
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
    const handleClear = async () => {
        if (confirm('确认清空')) {
            let {code} = await clearOperationLog()
            if (code == 0) {
                toast.success('操作成功')
                mutate()
            }
        }
    }
    return <>
        <PageInfo>
            <div className={'cell p-3 flex-center'}>
                <button className={'btn-danger strong mr-auto ml-12'} onClick={handleClear}>清空</button>
                <SearchInput pageConf={pageConf} tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery}></SearchInput>
            </div>
        </PageInfo>
        <div className={'box-02 no-bottom-border'}>
            {isLoading ? <FullScreenLoading/> :
                <>
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
                                    <td><span className={'btn-danger'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</span></td>
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