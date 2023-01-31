import useSWR from "swr";
import {listData} from "../../../libs/api-admin";
import {useState} from "react";
import {handleDel, objToParams,} from "../../../libs/utils";
import {toast} from "react-toastify";
import {Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading, ImgUpload} from "../../../compoents/common";

const pageConf = {
    name: '文件', path: '/file',
    fields: [
        {field: 'id', name: 'Id', renderFn: (d) => d.id, search: 1},
        {field: 'url', name: '图片', search: 1, required: 1, type: 'img'},
        {field: 'url', name: '图片地址', editHide: 1, addHide: 1},
        {field: 'group', name: '分组', options: '1:头像:tag-warning,2:文件:tag-primary,3:其他:tag-info', type: 'select', search: 1, required: 1},
        {field: 'status', name: '状态', options: process.env.OPTIONS_STATUS, required: 1},
        {field: 'createdAt', name: '创建时间'},
    ]
}

export default function File() {
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    const [query, setQuery] = useState() // 查询参数
    return (<>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    {showType === 1 && <MainPage setShowType={setShowType} setId={setId} setQuery={setQuery} query={query}/>}
                    {showType === 2 && <AddFile pageConf={pageConf} setShowType={setShowType}/>}
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
                    {data && data.list.length == 0 ? <div className={'cell color-desc-02 fs-13'}>暂无数据</div>
                        :
                        <>
                            <div className={'cell flex-center p-3'}><PageButtons tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery} totalPage={data.total_page} total={data.total}/></div>
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
                            <div className={'cell-tools p-3 flex-center'}><PageButtons totalPage={data.total_page} total={data.total} setTempQuery={setTempQuery} setQuery={setQuery} query={query}/></div>
                        </>
                    }
                </>
            }
        </div>
    </>
}
const AddFile = ({pageConf, setShowType}) => {
    return <div className={'box-02 no-bottom-border'}>
        <div className={'cell'}><a href={'#'} onClick={() => setShowType(1)}>{pageConf.name}</a>&nbsp;›&nbsp; 添加新{pageConf.name}</div>
        <table className={'table-add cell'}>
            <ImgUpload options={pageConf.fields[3].options} setShowType={setShowType} onSuccess={({code, data, message}) => {
                if (code == 0) {
                    toast.success('上传成功')
                    setShowType(1)
                } else {
                    toast.error(message)
                }
            }}/>
            <tr>
                <td></td>
                <td>
                    <button className={'btn-info mr-12'} onClick={() => setShowType(1)}>返回</button>
                </td>
            </tr>
        </table>
    </div>
}

