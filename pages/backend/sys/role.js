import useSWR from "swr";
import {listData} from "../../../libs/api-admin";
import {useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";
import Link from "next/link";

const pageConf = {
    name: '角色', path: '/role',
    fields: [
        {field: 'id', name: 'Id', renderFn: (d) => d.id, search: 1},
        {field: 'name', name: '名称', search: 1, required: 1},
        {field: 'createdAt', name: '创建时间'},
    ]
}

export default function Role() {
    const [query, setQuery] = useState() // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    return (<>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    {showType === 1 && <MainPage query={query} setShowType={setShowType} setId={setId} setQuery={setQuery}/>}
                    {showType === 2 && <AddPage pageConf={pageConf} setShowType={setShowType}/>}
                    {showType === 3 && <UpdatePage pageConf={pageConf} setShowType={setShowType} id={id}/>}
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}

const MainPage = ({query, setShowType, setId, setQuery}) => {
    const [tempQuery, setTempQuery] = useState({})
    let s = objToParams(query)
    const {data, isLoading, mutate, error} = useSWR(`${pageConf.path}/list?${s != undefined ? s : ''}`, listData)
    if (error) return toast.error(error)
    return <>
        <PageInfo>
            <div className={'cell p-3 flex-center'}>
                <span className={'btn-info strong ml-12 mr-auto'} onClick={() => setShowType(2)}>添加</span>
                <SearchInput pageConf={pageConf} tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery}/>
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
                                <tr>{pageConf.fields.map((i, index) => <th key={index}>{i.name}</th>)}
                                    <th>操作</th>
                                </tr>
                                {data && data.list.map((i, index) => <tr key={index}>
                                    <Td pageConf={pageConf} data={i}/>
                                    <td>
                                        <Link className={'btn-success strong mr-3'} href={'/backend/sys/roleMenu?rid=' + i.id}>菜单权限</Link>
                                        <Link className={'btn-primary strong mr-3'} href={'/backend/sys/roleApi?rid=' + i.id}>API权限</Link>
                                        <span className={'btn-warning strong mr-3'} onClick={() => setId(i.id) & setShowType(3)}>修改</span>
                                        <span className={'btn-danger strong mr-3'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</span>
                                    </td>
                                </tr>)}
                                </tbody>
                            </table>
                            <div className={'cell-tools p-3 flex-center'}><PageButtons totalPage={data.total_page} total={data.total} setQuery={setQuery} setTempQuery={setTempQuery} query={query}/></div>
                        </>
                    }
                </>
            }
        </div>
    </>
}