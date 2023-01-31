import useSWR from "swr";
import {addRoleApis, clearRoleApis, listData, listRoleNoApis} from "../../../libs/api-admin";
import {useEffect, useRef, useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {Footer, Headers, Nav, PageButtons, PageInfoWithInfo, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";
import {useRouter} from "next/router";

const pageConf = {
    name: '角色菜单', path: '/roleApi',
    fields: [
        {field: 'id', name: 'Id', renderFn: (d) => d.id,},
        {field: 'role_name', name: '角色', search: 1, required: 1},
        {field: 'group', name: '分组'},
        {field: 'path', name: '路径'},
        {field: 'desc', name: '说明'},
        {field: 'method', name: '方法', options: '1:GET:tag-success,2:POST:tag-primary,3:PUT:tag-warning,4:DELETE:tag-danger', type: 'select'},
    ]
}
export default function RoleApi() {
    const router = useRouter()
    const [query, setQuery] = useState({rid: router.query.rid}) // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    return (<>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    {showType === 1 && <MainPage query={query} setShowType={setShowType} setId={setId} setQuery={setQuery}/>}
                    {showType === 2 && <RoleApiAdd setShowType={setShowType}/>}
                    {showType === 3 && <UpdatePage pageConf={pageConf} setShowType={setShowType} id={id}/>}
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}


const MainPage = ({query, setQuery, setShowType}) => {
    const router = useRouter()
    const s = objToParams(query)
    const {data, isLoading, mutate, error} = useSWR(`/${pageConf.path}/list?${s != undefined ? s : ''}`, listData)
    const [tempQuery, setTempQuery] = useState({})
    if (error) return toast.error(error)
    const handleClear = () => {
        if (confirm(`确认清空 角色${router.query.rid} 的所有禁用API ?`)) {
            clearRoleApis(router.query.rid).then(res => {
                if (res == 0) {
                    toast.success('操作成功')
                    mutate()
                }
            })
        }
    }
    return <>
        <PageInfoWithInfo backUrl={'/backend/sys/role'} backName={'角色'} pageName={'角色API权限'} desc={'如果想要限制角色访问某条API请求，请添加到下面列表中'}>
            <div className={'cell p-6'}>
                <button className={'btn-info strong ml-12 mr-12'} onClick={() => setShowType(2)}>添加</button>
                <button className={'btn-danger strong '} onClick={handleClear}>清空</button>
            </div>
        </PageInfoWithInfo>
        <div className={'box-02 no-bottom-border'}>
            {isLoading ? <FullScreenLoading/>
                : <>
                    {data && data.list.length == 0
                        ? <div className={'cell'}><span className={'color-desc-02 fs-13'}>暂无数据</span></div>
                        : <>
                            <div className={'cell flex-center p-3'}><PageButtons query={query} setTempQuery={setTempQuery} setQuery={setQuery} totalPage={data.total_page} total={data.total}/></div>
                            <table className={'table-1'}>
                                <tbody>
                                <tr>{pageConf.fields.map((i, index) => <th key={index}>{i.name}</th>)}
                                    <th>操作</th>
                                </tr>
                                {data && data.list.map((i, index) => <tr key={index}><Td pageConf={pageConf} data={i}/>
                                    <td><span className={'btn-danger'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</span></td>
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
const RoleApiAdd = ({setShowType}) => {
    const router = useRouter()
    const [rid, setRid] = useState(router.query.rid || '')
    const [apis, setApis] = useState([])
    // 请求角色没有的API
    const [selectedOptions, setSelectedOptions] = useState([])
    const isMounted = useRef(false)
    useEffect(() => {
        if (isMounted.current) {
            return
        }
        isMounted.current = true
        listRoleNoApis(rid).then(res => {
            setApis(res||[])
        })
    }, [])

    const handleChange = (event) => {
        const options = Array.from(event.target.selectedOptions).map(o => o.value)
        setSelectedOptions(options)
    }
    // 提交
    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedOptions.length == 0) {
            toast.error('请为角色选择需要禁用的API', {position: 'top-center'})
            return
        }
        addRoleApis(rid, selectedOptions).then(res => {
            if (res == 0) {
                toast.success('添加成功')
                setShowType(1)
            }
        })
    }
    return <div className={'box-02 no-bottom-border'}>
        <div className={'cell'}>
            <span className={'color-red strong'}>添加角色禁用API</span>
        </div>
        <form className={'cell table-add'}>
            <table>
                <tbody>
                <tr>
                    <td>角色</td>
                    <td><input type="text" name={'rid'} value={rid} readOnly={true}/></td>
                </tr>
                <tr>
                    <td>API</td>
                    <td>
                        <select value={selectedOptions} onChange={handleChange} multiple={true} style={{width: '507px', height: '333px'}}>
                            {apis.map((i, index) => {
                                let obj = {
                                    1: 'GET:tag-success',
                                    2: 'POST:tag-primary',
                                    3: 'PUT:tag-warning',
                                    4: 'DELETE:tag-danger'
                                }
                                let arr = obj[i.method].split(':')
                                return <option key={index} value={i.id} className={arr[1]} style={{display: 'block'}}>{`【${i.group}】${arr[0]} ${i.desc} ${i.url}`}</option>
                            })}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <button className={'btn-info mr-12'} onClick={() => setShowType(1)}>返回</button>
                        <button className={'btn-warning strong'} onClick={handleSubmit}>提交</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    </div>
}
