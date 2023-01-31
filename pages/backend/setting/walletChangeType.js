import useSWR from "swr";
import {listData} from "../../../libs/api-admin";
import {useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";

const pageConf = {
    name: '账变类型', path: '/walletChangeType',
    fields: [
        {field: 'id', name: 'Id', renderFn: (d) => d.id, search: 1},
        {field: 'title', name: '名称', search: 1, required: 1,},
        {field: 'subTitle', name: '子标题'},
        {field: 'type', name: 'Type', options: "1:添加:tag-success,2:减少:tag-danger", required: 1},
        {field: 'class', name: '类名', required: 1},
        {field: 'desc', name: '描述'},
    ]
}

export default function WalletChangeType() {
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
    if (isLoading) return
    return <>
        <PageInfo>
            <div className={'cell p-3 flex-center'}>
                <span className={'btn-info strong ml-12 mr-auto'} onClick={() => setShowType(2)}>添加</span>
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