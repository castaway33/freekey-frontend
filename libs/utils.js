import {useEffect, useState} from "react";
import {del} from "./api-admin";
import {toast} from "react-toastify";

export const useLocalStorage = (key, initialValue) => {
    const isServer = typeof window === 'undefined';
    // State to store our value
    // Pass initial state function to useState so logic is only executed on client
    const [storedValue, setStoredValue] = useState(() => {
        if (isServer) {
            return initialValue;
        }
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
    });

    // useEffect to update local storage when component unmounts
    useEffect(() => {
        if (isServer) {
            return;
        }
        // Save state
        window.localStorage.setItem(key, JSON.stringify(storedValue));
    }, [storedValue]);

    return [storedValue, setStoredValue];
}
export const objToParams = (obj) => {
    if (!obj) {
        return
    }
    return Object.entries(obj).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}
export const handleChange = (setQuery, query, e) => {
    let v = e.target.value
    let name = e.target.name
    setQuery({...query, [name]: v});
}
export const handleKeyPress = (setQuery, tempQuery, e) => {
    if (e.key === 'Enter') {
        setQuery(tempQuery)
    }
}
export const handleDel = async (url, id, mutate) => {
    if (confirm('确认删除?')) {
        const {code} = await del(`${url}?id=${id}`)
        if (code === 0) {
            toast.success('删除成功', {position: 'top-center'})
            mutate()
        }
    }
}
export const formatTags = (input) => {
    const tags = ['tag-info', 'tag-success', 'tag-primary', 'tag-warning', 'tag-brown', 'tag-purple', 'tag-danger']
    const values = input.split(',')
    let output = []
    for (let i = 0; i < values.length; i++) {
        output.push(`${values[i]}:${values[i]}:${tags[i % tags.length]}`);
    }
    return output.join(',')
}
