import {Footer, Headers, Nav, PageInfoWithInfo} from "../../../compoents/sys-page";
import {useState} from "react";
import {trInput, trSelect, trSubmit} from "../../../compoents/sys-base";
import {noticeAdmins, sendAdminMsg} from "../../../libs/api-admin";
import {useRouter} from "next/router";
import ReactMarkdown from "react-markdown";
import Head from "next/head";

export default function Test() {
    const router = useRouter()
    const [navs, setNavs] = useState(['CSS:CSS', 'WebSocket:WebSocket测试', 'Document:前端文档'])
    return <>
        <Head>
            <title>文档与测试</title>
        </Head>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    <PageInfoWithInfo pageName={'文档与测试页面'} icon={'/image/test.png'}>
                        <div className={'cell'}></div>
                    </PageInfoWithInfo>
                    <div className={'box-02 no-bottom-border'}>
                        <div className="cell p-0">
                            {navs.map((i, index) => {
                                const arr = i.split(':')
                                return <a key={index} href={'#'} className={router.query.name == arr[0] ? 'link-6' : 'link-7'} onClick={() => router.push(`${router.pathname}?name=${arr[0]}`)}>{arr[1]}</a>
                            })}
                        </div>
                        {router.query.name == 'WebSocket' && <WebSocket/>}
                        {router.query.name == 'CSS' && <Css/>}
                        {router.query.name == 'Document' && <DocumentBackend/>}
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
}
const WebSocket = () => {
    const [data, setData] = useState({toUname: 'admin', type: 'success', msg: 'Hello Admin'})
    const handleSend = () => sendAdminMsg(data)
    const [group, setGroup] = useState({type: 'info', msg: 'Hello Everyone', position: 'top-center'})
    return <>
        <div className={'cell'}>
            <h2>单发</h2>
            <table className={'table-add'}>
                <tbody>
                {trInput('接收用户', 'toUname', data, setData)}
                {trInput('信息', 'msg', data, setData)}
                {trSelect('类型', 'type', 'info:info,success:success,warning:warning,error:error', data, setData)}
                {trSubmit(handleSend, '发送', 'btn-success')}
                </tbody>
            </table>
        </div>
        <div className={'cell no-bottom-border'}>
            <h2>通知所有管理员</h2>
            <table className={'table-add'}>
                <tbody>
                {trInput('信息', 'msg', group, setGroup)}
                {trSelect('类型', 'type', 'info:info,success:success,warning:warning,error:error', group, setGroup)}
                {trSubmit(() => noticeAdmins(group), '发送', 'btn-primary')}
                </tbody>
            </table>
        </div>
    </>
}
const Css = () => {
    return <>

        <div className={'cell'}>
            <h2>.btn</h2>
            <a href="#" className={'btn-info mr-6'}>.btn-info</a>
            <a href="#" className={'btn-success mr-6'}>.btn-success</a>
            <a href="#" className={'btn-primary mr-6'}>.btn-primary</a>
            <a href="#" className={'btn-warning mr-6'}>.btn-warning</a>
            <a href="#" className={'btn-danger mr-6'}>.btn-danger</a>
            <a href="#" className={'btn-disabled mr-6'}>.btn-disabled</a>
            <p className={'mt-33 mb-10'}>
                <a href="#" className={'btn-duo-info mr-6'}>.btn-duo-info</a>
                <a href="#" className={'btn-duo-info-disabled mr-6'}>.btn-duo-info-disabled</a>
                <a href="#" className={'btn-duo-success mr-6'}>.btn-duo-success</a>
                <a href="#" className={'btn-duo-primary mr-6'}>.btn-duo-primary</a>
                <a href="#" className={'btn-duo-error mr-6'}>.btn-duo-error</a>
            </p>
        </div>
        <div className={'cell'}>
            <h2>.link</h2>
            <a href="#" className={'link-1 mr-6'}>.link-1</a>
            <a href="#" className={'link-2 mr-6'}>.link-2</a>
            <a href="#" className={'link-3 mr-6'}>.link-3</a>
            <a href="#" className={'link-4 mr-6'}>.link-4</a>
            <a href="#" className={'link-5 mr-6'}>.link-5</a>
            <a href="#" className={'link-6 mr-6'}>.link-6</a>
            <a href="#" className={'link-7 mr-6'}>.link-7</a>
            <a href="#" className={'link-8 mr-6'}>.link-8</a>
        </div>
        <div className="cell">
            <h2>.tag</h2>
            <span className={'tag mr-6'}>.tag</span>
            <span className={'tag-2 mr-6'}>.tag-2</span>
            <span className={'tag-3 mr-6'}>.tag-3</span>
            <span className={'tag-4 mr-6'}>.tag-4</span>
            <span className={'tag-5 mr-6'}>.tag-5</span>
            <span className={'tag-info mr-6'}>.tag-info</span>
            <span className={'tag-primary mr-6'}>.tag-primary</span>
            <span className={'tag-success mr-6'}>.tag-success</span>
            <span className={'tag-warning mr-6'}>.tag-warning</span>
            <span className={'tag-brown mr-6'}>.tag-brown</span>
            <span className={'tag-purple mr-6'}>.tag-purple</span>
            <span className={'tag-danger mr-6'}>.tag-danger</span>
            <span className={'tag-blue mr-6'}>.tag-blue</span>
            <span className={'tag-answer mr-6'}>.tag-answer</span>
        </div>
        <div className={'cell'}>
            <h2>.icon</h2>
            <div className={'flex'}>
            <span className={'flex-direction-column flex-center mr-12'}>
                <span className={'color-desc-02'}>.s-icon-24</span>
                <img className={'s-icon-24'} src={process.env.IMG_PREFIX + '/image/p001.png'} alt=""/>
            </span>
                <span className={'flex-direction-column flex-center mr-12'}>
                <span className={'color-desc-02'}>.s-icon-36</span>
                <img className={'s-icon-36'} src={process.env.IMG_PREFIX + '/image/p001.png'} alt=""/>
            </span>
                <span className={'flex-direction-column flex-center mr-12'}>
                <span className={'color-desc-02'}>.s-icon</span>
                <img className={'s-icon'} src={process.env.IMG_PREFIX + '/image/p001.png'} alt=""/>
            </span>

                <span className={'flex-direction-column flex-center mr-12'}>
                <span className={'color-desc-02'}>.s-icon-64</span>
                <img className={'s-icon-64'} src={process.env.IMG_PREFIX + '/image/p001.png'} alt=""/>
            </span>
                <span className={'flex-direction-column flex-center mr-12'}>
                <span className={'color-desc-02'}>.s-icon-76</span>
                <img className={'s-icon-76'} src={process.env.IMG_PREFIX + '/image/p001.png'} alt=""/>
            </span>
            </div>
        </div>
        <div className={'cell'}>
            <h2>.info-box</h2>

            <div className={'info-box mr-6'}>
                <img className="s-icon-64" src="http://localhost:2033/upload/image/p004.png" alt=""/>
                <div className="info-content ml-12">
                    <span className="info-text block mt-6 fs-16">.info-box</span>
                    <span className="info-num block mt-6 strong">num</span>
                </div>
            </div>
            <div className={'info-box-success mr-6'}>
                <img className="s-icon-64" src="http://localhost:2033/upload/image/p004.png" alt=""/>
                <div className="info-content ml-12">
                    <span className="info-text block mt-6 fs-16">.info-box-success</span>
                    <span className="info-num block mt-6 strong">num</span>
                </div>
            </div>
            <div className={'info-box-primary mr-6'}>
                <img className="s-icon-64" src="http://localhost:2033/upload/image/p004.png" alt=""/>
                <div className="info-content ml-12">
                    <span className="info-text block mt-6 fs-16">.info-box-primary</span>
                    <span className="info-num block mt-6 strong">num</span>
                </div>
            </div>
            <div className={'info-box-warning mr-6'}>
                <img className="s-icon-64" src="http://localhost:2033/upload/image/p004.png" alt=""/>
                <div className="info-content ml-12">
                    <span className="info-text block mt-6 fs-16">.info-box-warning</span>
                    <span className="info-num block mt-6 strong">num</span>
                </div>
            </div>

            <div className={'info-box-danger mr-6'}>
                <img className="s-icon-64" src="http://localhost:2033/upload/image/p004.png" alt=""/>
                <div className="info-content ml-12">
                    <span className="info-text block mt-6 fs-16">.info-box-danger</span>
                    <span className="info-num block mt-6 strong">num</span>
                </div>
            </div>
        </div>
        <div className={'cell'}>
            <h2>.theme</h2>
            <div className={'theme-info p-6 mb-6'}>.theme-info</div>
            <div className={'theme-success p-6 mb-6'}>.theme-success</div>
            <div className={'theme-primary p-6 mb-6'}>.theme-primary</div>
            <div className={'theme-warning p-6 mb-6'}>.theme-warning</div>
            <div className={'theme-brown p-6 mb-6'}>.theme-brown</div>
            <div className={'theme-purple p-6 mb-6'}>.theme-purple</div>
            <div className={'theme-danger p-6 mb-6'}>.theme-danger</div>
        </div>
        <div className={'cell'}>
            <h2>.input</h2>
            <label className={'input'}>.input<input type="text"/></label>
            <label className={'input'}>.select<select>
                <option>请选择</option>
                <option>English</option>
                <option>Japanese</option>
                <option>Chinese</option>
            </select></label>
        </div>
        <div className={'cell'}>
            <h2>.table-add</h2>
            <table className={'table-add'}>
                <tbody>
                <tr>
                    <td>用户名</td>
                    <td><input type="text"/></td>
                </tr>
                <tr>
                    <td>密码</td>
                    <td><input type="text"/></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <button className={'btn-warning'}>提交</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div className={'cell'}>
            <h2>.table-1</h2>
            <table className={'table-1'}>
                <tbody>
                <tr>
                    <th>ID</th>
                    <th>用户名</th>
                    <th>昵称</th>
                    <th>角色</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>admin</td>
                    <td>admin</td>
                    <td><span className={'tag-danger'}>管理员</span></td>
                    <td><span className={'tag-success'}>正常</span></td>
                    <td>
                        <button className={'btn-primary mr-6'}>用户名</button>
                        <button className={'btn-success mr-6'}>密码</button>
                        <button className={'btn-warning mr-6'}>修改</button>
                        <button className={'btn-danger mr-6'}>删除</button>
                    </td>
                </tr>

                <tr>
                    <td>1</td>
                    <td>John</td>
                    <td>John</td>
                    <td><span className={'tag-danger'}>管理员</span></td>
                    <td><span className={'tag-success'}>正常</span></td>
                    <td>
                        <button className={'btn-primary mr-6'}>用户名</button>
                        <button className={'btn-success mr-6'}>密码</button>
                        <button className={'btn-warning mr-6'}>修改</button>
                        <button className={'btn-danger mr-6'}>删除</button>
                    </td>
                </tr>

                <tr>
                    <td>1</td>
                    <td>Spotify</td>
                    <td>Spotify</td>
                    <td><span className={'tag-danger'}>管理员</span></td>
                    <td><span className={'tag-success'}>正常</span></td>
                    <td>
                        <button className={'btn-primary mr-6'}>用户名</button>
                        <button className={'btn-success mr-6'}>密码</button>
                        <button className={'btn-warning mr-6'}>修改</button>
                        <button className={'btn-danger mr-6'}>删除</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div className={'cell'}>
            <h2>.full-screen-loading</h2>
            <div className={'full-screen-loading'}>
                <div className={'loading-spinner'}></div>
            </div>
        </div>
        <div className={'cell'}>
            <h2>progress.box</h2>
            <div className={'progress-box'}>
                <div className={'progress-all'}>
                    <div className={'progress-current'} style={{width: '33%'}}></div>
                </div>
            </div>
        </div>
    </>
}
const DocumentBackend = () => {
    return <>
        <div className={'cell cell-content'}>
            <ReactMarkdown children={
                `
> 在使用之前如果对 react,nextjs,swr，不了解请先学习这三个框架。

# 1. 框架与插件的使用

- [react](https://reactjs.org/)  用于构建用户界面的 JavaScript 库
- [nextjs](https://nextjs.org/) 用于 Web的 React框架
- [swr](https://swr.vercel.app/zh-CN)   用于数据请求的 React Hooks 库
- [axios](https://axios-http.com/) 一个基于 promise 网络请求库
- [js-cookie](https://github.com/js-cookie/js-cookie) 用于处理浏览器 cookie 的简单、轻量级 JavaScript API
- [react-toastify](https://fkhadra.github.io/react-toastify/introduction/) React notification made easy
- [mui/icons-material](https://mui.com/material-ui/material-icons/)  icon图标
- [numeral](http://numeraljs.com/)  JavaScript库，用于格式化和操纵数字。
- [react-markdown](https://github.com/remarkjs/react-markdown)  Markdown component for React

# 2. 项目结构
- compoents  组件
    - common.js  公共组件，前台后台都可以使用的放在这里
    - sys-base.js 基础功能库
    - sys-page.js 后台页面组件
    - toy.js   功能性页面组件
- consts 常量
    - consts.js
- data 具有单个功能的数据性组件
    - use-menu.js 后台页面menu组件
    - use-user.js 后台用户信息组件
- libs 工具库
    - api-admin.js 后台 api 请求
    - request.js 请求工具封装  统一处理错误、添加token
    - utils.js 其他工具
- pages 页面
    - backend 后台页面放在此
    - common 公共功能
        - banner.js banner图
    - setting 系统设置相关
        - walletChangeType.js 钱包账变类型页面
    - sys 系统功能
        - admin.js 管理员页面
        - adminLoginLog.js 管理员登录日志
        - api.js api 页面
        - dict.js 字典页面
        - file.js 文件页面
        - login.js 登录页面
        - menu.js 菜单页面
        - operationLog.js 操作日志页面
        - role.js 角色页面
        - roleApi.js 角色api权限页面
        - roleMenu.js 角色菜单页面
        - test.js 测试与文档页面
    - user 用户相关页面
        - index.js 用户页面
        - userLoginLog.js 用户登录日志页面
        - wallet.js 用户钱包页面
        - walletChangeLog.js 钱包账变记录页面
        - walletReport.js 钱包账变报表页面
        - walletStatisticsLog.js 账变统计页面
        - walletTopUpApplication.js 充值订单页面

# 2. 页面组成
页面以 menu.js 为例进行说明.
文件位置 /freekey-frontend/pages/backend/sys/menu.js
## 2.1 pageConf (页面配置信息)
### 属性介绍
- name 页面名称
- path 请求路径  如 /menu  请求时接口会统一在此基础上添加 http://localhost:2033/backend，最终拼接的结果则是 http://localhost:2033/backend/menu 。
- fields 页面字段的集合
    - field  请求返回的字段名称   
    - name  中文名称
    - search  是否搜索 
    - hide 是否隐藏 值为1时 则在表格中不会展示
    - required 是否必须 . 在添加或修改字段时会进行判断. 
    - editHide: 编辑时是否隐藏 1 
    - type: 字段类型 select,img,textarea 如果为 select 时 则需要给 options 选择属性
    - options: 当 type 为 select, 或 field 为 type,status 时 该值必须给 格式为 值1:名称1:类名1,值2:名称2:类名2, ...
    - renderFn: 自定义渲染函数 返回当前渲染列的 数据, 用于自定义的渲染 

eg:
~~~js
const pageConf = {
    name: '菜单', path: '/menu',
    fields: [
        {field: 'id', name: 'ID', renderFn: (d) => d.id},
        {field: 'pid', name: 'PID', required: 1, search: 1},
        {field: 'icon', name: '图片'},
        {field: 'path', name: '地址', required: 1},
        {field: 'type', name: '类型', options: '1:菜单:tag-info,2:分组:tag-warning' ,
        {field: 'desc', name: '说明'},
        {field: 'sort', name: '排序'}
    ]
}
~~~

## 2.2 export default function Menu()  Menu页面组件
Menu页面组件由6个部分构成
- Headers 页面顶部内容 包含内容： 标题、管理员信息、修改密码、退出、设置暗黑模式等
- Nav 页面导航部分 用于各页面之间的导航
- MainPage 主页面 
    - PageInfo  页面信息
        - 搜索框
    - 数据表格
- AddPage 添加页面 用于添加新的记录
- UpdatePage 修改页面 修改记录
- Footer 脚部
~~~
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
~~~
`
            }/>
        </div>
    </>
}
