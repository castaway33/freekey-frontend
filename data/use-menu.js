import useSWR from 'swr';
import {getMenu} from "../libs/api-admin";

// 当前选择的menu 如果没有就获取默认的
export const useMenu = (path) => {
    const {data, error} = useSWR(`/admin/getMenu?path=${path}`, getMenu, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const loading = !data && !error
    return {menu: data && data.data && data.data.data, error, loading};
}