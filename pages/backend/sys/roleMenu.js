import useSWR from "swr";
import {addRoleMenus, clearRoleMenus, listData, listRoleNoMenus} from "../../../libs/api-admin";
import {useEffect, useRef, useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {Footer, Headers, Nav, PageButtons, PageInfoWithInfo, Td} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";
import {useRouter} from "next/router";

const pageConf = {
    name: '角色菜单', path: '/roleMenu',
    fields: [
        {field: 'id', name: 'Id', renderFn: (d) => d.id,},
        {field: 'role_name', name: '角色', required: 1,},
        {
            field: 'menu_name', name: '菜单', renderFn: (d) => {
                if (d.type == 2) {
                    return <span className={'color-blue strong'}>{d.menu_name}</span>
                } else {
                    return <span>&nbsp;&nbsp;&nbsp;|- {d.menu_name}</span>
                }
            }
        }
    ]
}

export default function RoleMenu() {
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
                    {showType === 2 && <AddPage setShowType={setShowType}/>}
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}

const MainPage = ({query, setShowType, setId, setQuery}) => {
    const [tempQuery, setTempQuery] = useState({})
    const router = useRouter()
    let s = objToParams(query)
    const {data, isLoading, mutate, error} = useSWR(`/${pageConf.path}/list?rid=${router.query.rid}&${s != undefined ? s : ''}`, listData)
    if (error) {
        toast.error(error)
        return
    }
    const handleClear = () => {
        let rid = router.query.rid;
        if (confirm(`确认清空  ${rid} 的所有菜单访问权限吗？`)) {
            clearRoleMenus(rid).then(({code}) => {
                if (code == 0) {
                    toast.success('清空成功')
                    mutate()
                }
            })
        }
    }
    return <>
        <PageInfoWithInfo backUrl={'/backend/sys/role'} backName={'角色'} pageName={'角色菜单权限'} desc={'修改角色能够访问的菜单'}>
            <div className={'cell p-6'}>
                <button className={'btn-info strong ml-12 mr-12'} onClick={() => setShowType(2)}>添加</button>
                <button className={'btn-danger strong '} onClick={handleClear}>清空</button>
            </div>
        </PageInfoWithInfo>
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
                                <tr>{pageConf.fields.map((i, index) => <th key={index}>{i.name}</th>)}
                                    <th>操作</th>
                                </tr>
                                {data && data.list.map((i, index) =>
                                    <tr key={index}>
                                        <Td pageConf={pageConf} data={i}/>
                                        <td><span className={'btn-danger'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</span></td>
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
const AddPage = ({setShowType}) => {
    const router = useRouter()
    const [req, setReq] = useState({rid: router.query.rid})
    const [menus, setMenus] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    // 请求 角色没有的菜单
    const isMounted = useRef(false)
    useEffect(() => {
        if (isMounted.current) {
            return
        }
        isMounted.current = true
        listRoleNoMenus(router.query.rid).then(res => setMenus(res||[]))
    }, [])

    // 提交
    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedOptions.length == 0) {
            toast.warning('请选择内容')
            return
        }
        addRoleMenus(router.query.rid, selectedOptions).then(res => {
            console.log(res)
            if (res == 0) {
                toast.success('添加成功')
                setShowType(1)
            }
        })
    }
    const handleChange = (event) => {
        const options = Array.from(event.target.selectedOptions).map(o => o.value)
        setSelectedOptions(options)
    }

    return <div className={'box-02 no-bottom-border'}>
        <div className={'cell'}>
            <span>添加角色菜单</span>
        </div>
        <form className={'cell table-add'}>
            <table>
                <tbody>
                <tr>
                    <td>角色</td>
                    <td><input type="text" name={'rid'} value={req.rid} readOnly={true}/></td>
                </tr>
                <tr>
                    <td>菜单</td>
                    <td>
                        <select multiple={true} onChange={handleChange} style={{height: '333px', width: '507px'}}>
                            {menus.map((i, index) => {
                                if (i.type == 2) {
                                    return <option className={'color-blue strong mb-6'} key={index} value={i.id}>{i.name}</option>
                                }
                                return <option key={index} value={i.id}>&nbsp;&nbsp;|-{i.name}</option>
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