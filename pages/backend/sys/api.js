import useSWR from "swr";
import {addApiGroup, listData} from "../../../libs/api-admin";
import {useState} from "react";
import {formatTags, handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";

const pageConf = {
    name: 'api', path: '/api',
    fields: [
        {field: 'id', name: 'Id', renderFn: (d) => d.id},
        {field: 'url', name: '路径', search: 1, required: 1},
        {field: 'method', name: '方法', options: '1:GET:tag-success,2:POST:tag-primary,3:PUT:tag-warning,4:DELETE:tag-danger', type: 'select', search: 1, required: 1},
        {field: 'group', name: '分组', search: 1, type: 'select', options: formatTags(process.env.API_GROUP)},
        {field: 'desc', name: '备注'},
    ]
}

export default function Api() {
    const [query, setQuery] = useState() // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    return (<>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    {showType === 1 && <MainPage query={query} setShowType={setShowType} setId={setId} pageConf={pageConf} setQuery={setQuery}/>}
                    {showType === 2 && <AddPage pageConf={pageConf} setShowType={setShowType}/>}
                    {showType === 3 && <UpdatePage pageConf={pageConf} setShowType={setShowType} id={id}/>}
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}

const MainPage = ({query, setQuery, setShowType, setId, pageConf}) => {
    const [tempQuery, setTempQuery] = useState({})
    let s = objToParams(query)
    const {data, isLoading, mutate, error} = useSWR(`/${pageConf.path}/list?${s != undefined ? s : ''}`, listData)
    if (error) return toast.error(error)
    const handleAddGroup = () => {
        const group = prompt('请输入组名')
        if (group) {
            let url = prompt('请输入url')
            addApiGroup(group, url).then(res => {
                toast.success(`添加成功 ${res.data.count} 条`)
                mutate()
            })
        }
    }
    return <>
        <PageInfo>
            <div className={'cell p-3 flex-center'}>
                <span className={'btn-info strong ml-12 '} onClick={() => setShowType(2)}>添加一个</span>
                <span className={'btn-success strong ml-12 mr-auto'} onClick={handleAddGroup}>添加一组</span>
                <SearchInput pageConf={pageConf} tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery}></SearchInput>
            </div>
        </PageInfo>
        <div className={'box-02 no-bottom-border'}>
            {isLoading ? <FullScreenLoading/> : <>
                {data && data.list.length == 0
                    ? <div className={'cell color-desc-02 fs-13'}>暂无数据</div>
                    : <>
                        <div className={'cell flex-center p-3'}><PageButtons query={query} setTempQuery={setTempQuery} setQuery={setQuery} totalPage={data.total_page} total={data.total}/></div>
                        <table className={'table-1'}>
                            <tbody>
                            <tr>{pageConf.fields.map((i, index) => <th key={index}>{i.name}</th>)}
                                <th>操作</th>
                            </tr>
                            {data && data.list.map((i, index) => <tr key={index}><Td pageConf={pageConf} data={i}/>
                                <td>
                                    <span className={'btn-warning mr-6 strong'} onClick={() => setId(i.id) & setShowType(3)}>修改</span>
                                    <span className={'btn-danger strong'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</span>
                                </td>
                            </tr>)}
                            </tbody>
                        </table>
                        <div className={'cell-tools p-3 flex-center'}><PageButtons totalPage={data.total_page} total={data.total} setQuery={setQuery} setTempQuery={setTempQuery} query={query}/></div>
                    </>
                }
            </>}
        </div>
    </>
}