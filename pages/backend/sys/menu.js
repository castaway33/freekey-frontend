import useSWR from "swr";
import {useState} from "react";
import {toast} from "react-toastify";
import {listData, updateSortMenu} from "../../../libs/api-admin";
import {handleDel, objToParams,} from "../../../libs/utils";
import {FullScreenLoading} from "../../../compoents/common";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage,} from "../../../compoents/sys-page";

const pageConf = {
    name: '菜单', path: '/menu',
    fields: [
        {field: 'id', name: 'ID', renderFn: (d) => d.id},
        {field: 'pid', name: 'PID', required: 1, search: 1},
        {field: 'name', name: '名称', required: 1, search: 1, renderFn: (data) => data.type == 2 ? <span className={'color-blue strong'}>{data.name}</span> : <span> &nbsp;&nbsp;&nbsp;|-{data.name}</span>},
        {field: 'icon', name: '图片'},
        {field: 'path', name: '地址', required: 1},
        {field: 'type', name: '类型', options: '1:菜单:tag-info,2:分组:tag-warning', required: 1, renderFn: (data) => data.type == 2 ? <span className={'tag-warning'}>分组</span> : <span className={'tag-info'}>页面</span>},
        {field: 'desc', name: '说明'},
        {field: 'sort', name: '排序'},
    ]
}

export default function Menu() {
    const [query, setQuery] = useState() // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    return (<>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    {showType === 1 && <MainPage setShowType={setShowType} setId={setId} query={query} setQuery={setQuery}/>}
                    {showType === 2 && <AddPage pageConf={pageConf} setShowType={setShowType} defaultData={{pid: 1, type: 2}}/>}
                    {showType === 3 && <UpdatePage pageConf={pageConf} setShowType={setShowType} id={id}/>}
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}

const MainPage = ({setShowType, setId, query, setQuery}) => {
    const [tempQuery, setTempQuery] = useState({})
    let s = objToParams(query);
    const {data, isLoading, mutate, error} = useSWR(`/${pageConf.path}/list?${s != undefined ? s : ''}`, listData)
    if (error) {
        return
    }
    const handleSort = async (id) => {
        let sort = prompt('请输入一个数字')
        if (sort) {
            await updateSortMenu(id, sort)
            toast.success('修改成功')
            mutate()
        }
    }
    return <>
        <PageInfo>
            <div className={'cell p-3 flex-center'}>
                <span className={'btn-info strong ml-12 mr-auto'} onClick={() => setShowType(2)}>添加</span>
                <SearchInput pageConf={pageConf} tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery}></SearchInput>
            </div>
        </PageInfo>
        <div className={'box-02 no-bottom-border'}>
            {isLoading ? <FullScreenLoading/> :
                <>
                    {data && data.length == 0 ? <div className={'cell color-desc-02 fs-13'}>暂无数据</div>
                        : <>
                            <div className={'cell flex-center p-3'}><PageButtons tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery} totalPage={data.total_page} total={data.total}/></div>
                            <table className={'table-1'}>
                                <thead>
                                <tr>
                                    {pageConf.fields.map((i, index) => <th key={index}>{i.name}</th>)}
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody className={'loading'}>
                                {data && data && data.list.map((i, index) => <tr key={index}><Td pageConf={pageConf} data={i}/>
                                    <td>
                                        <span className={'btn-warning strong mr-6'} onClick={() => setId(i.id) & setShowType(3)}>修改</span>
                                        <span className={'btn-danger strong mr-6'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</span>
                                        {i.type === 2 && <span className={'btn-success strong'} onClick={() => handleSort(i.id)}>分组排序</span>}
                                    </td>
                                </tr>)}
                                </tbody>
                            </table>
                            <div className={'cell-tools p-3 flex-center'}><PageButtons tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery} totalPage={data.total_page} total={data.total}/></div>
                        </>
                    }
                </>
            }
        </div>
    </>
}