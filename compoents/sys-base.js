import {handleChange} from "../libs/utils";
// 搜索 input 相关组件
export const searchInput = (key, name, field, tempQuery, setTempQuery, setQuery) => {
    return <label className={'input'} key={key}>
        {name}
        <input name={field} value={tempQuery[field] || ''}
               onChange={e => handleChange(setTempQuery, tempQuery, e)}
               onKeyPress={e => {
                   if (e.key == 'Enter') {
                       tempQuery.page = 1
                       handleChange(setTempQuery, tempQuery, e)
                       handleChange(setQuery, tempQuery, e)
                   }
               }}
        />
    </label>
}
export const searchSelect = (key, name, field, options, tempQuery, setTempQuery, setQuery) => {
    if (!options) return <span className={'tag-danger'}>{`选项 ${field}的 options 属性为空或者不正确`}</span>
    return <label key={key} className={'input'}>
        {name}
        <select value={tempQuery[field]} name={field} onChange={e => {
            tempQuery.page = 1
            handleChange(setTempQuery, tempQuery, e)
            handleChange(setQuery, tempQuery, e)
        }}>
            <option value={''}>请选择</option>
            {options.split(',').map((j, index) => {
                let arr = j.split(":")
                return <option key={index} value={arr[0]} className={arr[2]}>{arr[1]}</option>
            })}
        </select>
    </label>
}
export const searchDate = (key, tempQuery, setTempQuery, setQuery) => {
    let arr = []
    arr[0] = <label key={key} className={'input'}>开始日期 <input type={"date"} value={tempQuery['begin'] || ''} name={'begin'} onChange={e => {
        tempQuery.page = 1
        handleChange(setTempQuery, tempQuery, e)
        handleChange(setQuery, tempQuery, e)
    }}/></label>
    arr[1] = <label key={key * 100} className={'input'}>结束日期 <input type={"date"} value={tempQuery['end'] || ''} name={'end'} onChange={e => {
        tempQuery.page = 1
        handleChange(setTempQuery, tempQuery, e)
        handleChange(setQuery, tempQuery, e)
    }}/></label>
    return arr
}
export const trInput = (name, field, data, setData) => {
    return <tr>
        <td>{name}</td>
        <td><input value={data[field] || ''} name={field} onChange={e => handleChange(setData, data, e)}/></td>
    </tr>
}
// options format  eg 1:ok,2:fail
export const trSelect = (name, field, options, data, setData) => {
    return <tr>
        <td>{name}</td>
        <td>
            <select key={field} name={field} value={data[field || '']} onChange={e => handleChange(setData, data, e)}>
                <option value="">请选择</option>
                {options.split(',').map((i, index) => {
                    let arr = i.split(":")
                    return <option key={index} value={arr[0]}>{arr[1]}</option>
                })}
            </select>
        </td>
    </tr>
}
export const trSubmit = (fn, name, cls) => {
    return <tr>
        <td></td>
        <td>
            <button className={cls ? cls : 'btn-warning'} onClick={fn}>{name}</button>
        </td>
    </tr>
}
