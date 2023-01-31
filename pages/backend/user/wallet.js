import useSWR from "swr";
import {listData, listWalletChangeTypeOptions, updateWalletByAdmin, updateWalletPass} from "../../../libs/api-admin";
import {useEffect, useState} from "react";
import {objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";
import jsCookie from "js-cookie";
import {keyToken} from "../../../consts/consts";
import numeral from "numeral";

const pageConf = {
    name: '用户钱包', path: '/wallet',
    fields: [
        {field: 'id', name: 'ID', renderFn: (d) => d.id},
        {field: 'uname', name: '用户名', search: 1, required: 1, editHide: 1},
        {field: 'balance', name: '余额', search: 1, disabled: 1, renderFn: (d) => <span className={'tag-warning strong'}>{numeral(d.balance).format('0,00.00')}</span>},
        {field: 'desc', name: '说明', search: 1},
        {field: 'status', name: '状态', options: "0:未设置密码:tag-info,1:正常:tag-success,2:锁定:tag-danger", search: 1},
    ]
}

export default function Wallet() {
    const [query, setQuery] = useState() // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    const [userInfo, setUseInfo] = useState({})
    const [changeType, setChangeType] = useState() //1 充值 2扣除
    return (<>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    {showType === 1 && <MainPage query={query} setQuery={setQuery} setShowType={setShowType} setId={setId} setUseInfo={setUseInfo} setChangeType={setChangeType}/>}
                    {showType === 2 && <ChangeWallet setShowType={setShowType} userInfo={userInfo} changeType={changeType}/>}
                    {showType === 3 && <UpdatePage pageConf={pageConf} setShowType={setShowType} id={id}/>}
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}

const MainPage = ({query, setQuery, setShowType, setId, setUseInfo, setChangeType}) => {
    const [tempQuery, setTempQuery] = useState({})
    const s = objToParams(query)
    const {data, isLoading, mutate, error} = useSWR(`/${pageConf.path}/list?${s != undefined ? s : ''}`, listData)
    if (error) return toast.error(error)
    if (isLoading) return

    const handleChangePass = async (id) => {
        let pass = prompt('请输入新的钱包密码')
        if (pass) {
            const {code} = await updateWalletPass(id, pass)
            if (code == 0) {
                toast.success('修改成功')
                mutate()
            }
        }
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
                                        <button className={'btn-warning strong mr-6'} onClick={() => setId(i.id) & setShowType(3)}>修改</button>
                                        <button className={'btn-primary strong mr-6'} onClick={() => handleChangePass(i.id)}>密码</button>
                                        <button className={'btn-success strong mr-6'} onClick={() => {
                                            setShowType(2)
                                            setUseInfo(i)
                                            setChangeType(1)
                                        }}>充值
                                        </button>
                                        <button className={'btn-danger strong mr-6'} onClick={() => {
                                            setShowType(2)
                                            setUseInfo(i)
                                            setChangeType(2)
                                        }}>扣除
                                        </button>
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

const ChangeWallet = ({setShowType, userInfo, changeType}) => {
    let operationDesc = changeType == 1 ? '充值' : '扣除'
    const [changeTypes, setChangeTypes] = useState([])
    const [selectedChangeType, setSelectedChangeType] = useState(0) // 充值类型
    const [money, setMoney] = useState(1) // 充值金额
    const [desc, setDesc] = useState('') //说明
    // 获取账变类型
    useEffect(() => {
        let token = jsCookie.get(keyToken);
        listWalletChangeTypeOptions(token).then(res => {
            setChangeTypes(res.data)
        })
    }, [])

    // 提交
    const handleSubmit = () => {
        if (money == 0) return toast.warning('请输入金额')
        if (selectedChangeType === 0) return toast.warning(`请选择${operationDesc}类型`)
        updateWalletByAdmin(userInfo.uid, changeType == 1 ? money : -money, selectedChangeType, desc).then(res => {
            if (res.code == 0) {
                toast.success(`${operationDesc}成功`)
                setShowType(1)
            }
        })
    }
    return <div className={'box-02 no-bottom-border'}>
        <div className={'cell'}>
            <a href={'#'} onClick={() => setShowType(1)}>钱包</a>&nbsp;&nbsp;›&nbsp;用户<span className={'color-red strong fs-16'}>【{userInfo.uname}】</span>&nbsp;›&nbsp;&nbsp;
            {changeType == 1 ? <span className={'color-green strong'}>{operationDesc}操作</span> : <span className={'color-red strong'}>{operationDesc}操作</span>}
        </div>
        <table className={'table-add cell'}>
            <tbody>
            <tr>
                <td>用户名</td>
                <td><input type="text" value={userInfo.uname} disabled/></td>
            </tr>
            <tr>
                <td>剩余金额</td>
                <td><input type="text" value={userInfo.balance} disabled/></td>
            </tr>
            <tr>
                <td>{operationDesc}类型</td>
                <td>
                    <select value={selectedChangeType} onChange={e => setSelectedChangeType(e.target.value)}>
                        <option value={''}>请选择</option>
                        {changeTypes.filter(i => i.type == changeType).map(i => <option className={i.class} value={i.id}>{i.title}</option>)}
                    </select>
                </td>
            </tr>
            <tr>
                <td>{operationDesc}金额</td>
                <td><input type="number" min={1} max={1000000} value={money} onChange={e => setMoney(e.target.value)}/></td>
            </tr>
            <tr>
                <td>备注</td>
                <td><input type="text" value={desc} onChange={e => setDesc(e.target.value)}/></td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <button className={'btn-info mr-6 strong'} onClick={() => setShowType(1)}>返回</button>
                    <button className={'btn-warning strong'} onClick={handleSubmit}>提交</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
}