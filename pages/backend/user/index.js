import useSWR from "swr";
import {listData, updateUserPass, updateUserUname} from "../../../libs/api-admin";
import {useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";

const pageConf = {
    name: '用户', path: '/user',
    fields: [
        {field: 'id', name: 'ID', renderFn: (d) => d.id, search: 1},
        {field: 'uname', name: '用户名', search: 1, required: 1, disabled: 1},
        {field: 'joinIp', name: '注册IP', disabled: 1, search: 1},
        {field: 'device', name: '注册设备', disabled: 1},
        {field: 'email', name: '邮箱'},
        {field: 'phone', name: '电话'},
        {field: 'desc', name: '备注', search: 1, type: 'textarea'},
        {field: 'status', name: '状态', options: process.env.OPTIONS_STATUS, search: 1},
        {field: "createdAt", name: '注册时间'}
    ]
}

export default function User() {
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
    const handleUpdateUname = async (id) => {
        let uname = prompt('请输入新的用户名')
        if (uname) {
            const {code} = await updateUserUname(id, uname)
            if (code == 0) {
                toast.success('修改成功')
                mutate()
            }
        }
    }
    const handleUpdatePass = async (id) => {
        let pass = prompt('请输入新的密码')
        if (pass) {
            const {code} = await updateUserPass(id, pass)
            if (code == 0) {
                toast.success('修改成功')
            }
        }
    }
    return <>
        <PageInfo>
            <div className={'cell p-3 flex-center'}>
                {/*<span className={'btn-info strong ml-12 mr-auto'} onClick={() => setShowType(2)}>添加</span>*/}
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
                                        <button className={'btn-primary strong mr-6'} onClick={() => handleUpdateUname(i.id)}>用户名</button>
                                        <button className={'btn-success strong mr-6'} onClick={() => handleUpdatePass(i.id)}>密码</button>
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