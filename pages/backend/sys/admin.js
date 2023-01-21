import useSWR from "swr";
import {getRoleOptions, listData, updateAdminPass, updateAdminUname} from "../../../libs/api-admin";
import {useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";
import {keyToken} from "../../../consts/consts";

const pageConf = {
    name: '管理员', path: '/admin',
    fields: [
        {field: 'id', name: '管理员ID', renderFn: (d) => d.id, search: 1},
        {field: 'uname', name: '用户名', search: 1, disabled: 1, required: 1,},
        {field: 'pwd', name: '密码', hide: 1, type: 'password', required: 1, editHide: 1},
        {field: 'nickname', name: '昵称'},
        {field: 'rid', name: '角色', search: 1, required: 1, editHide: 1, type: 'select'},
        {field: 'status', name: '状态', options: process.env.OPTIONS_STATUS, required: 1},
    ]
}

export default function Admin({options}) {
    pageConf.fields[4].options = options //添加 rid 的选项
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
    const s = objToParams(query)
    const {data, isLoading, mutate, error} = useSWR(`/${pageConf.path}/list?${s != undefined ? s : ''}`, listData)
    if (error) return toast.error(error)
    // 修改用户名
    const handleUpdateUname = async (id) => {
        let uname = prompt('请输入新的用户名')
        if (uname) {
            let {code} = await updateAdminUname(id, uname)
            if (code == 0) {
                toast.success('修改成功')
                mutate()
            }
        }
    }

    // 修改密码
    const handleUpdatePass = async (id) => {
        let pass = prompt('请输入新的密码')
        if (pass) {
            const {code} = await updateAdminPass(id, pass)
            if (code == 0) {
                toast.info('修改成功')
                mutate()
            }
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
                                        <button className={'btn-primary strong mr-6'} onClick={() => handleUpdateUname(i.id)}>用户名</button>
                                        <button className={'btn-success strong mr-6'} onClick={() => handleUpdatePass(i.id)}>密码</button>
                                        <button className={'btn-warning strong mr-6'} onClick={() => setId(i.id) & setShowType(3)}>修改</button>
                                        <button className={'btn-danger strong'} onClick={() => handleDel(pageConf.path, i.id, mutate)}>删除</button>
                                    </td>
                                </tr>)}
                                </tbody>
                            </table>
                            <div className={'cell-tools p-3 flex-center'}><PageButtons totalPage={data.total_page} total={data.total} setQuery={setQuery} setTempQuery={setTempQuery} tempQuery={tempQuery}/></div>
                        </>
                    }
                </>
            }
        </div>
    </>
}

export async function getServerSideProps({req}) {
    const token = req.cookies[keyToken]
    if (!token) {
        return {redirect: {destination: '/backend/sys/login'}}
    }
    let {code, message, data} = await getRoleOptions(token)
    if (code !== 0) {
        return {props: {msg: message}}
    }
    return {
        props: {
            options: data.options
        }
    }
}