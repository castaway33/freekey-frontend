import useSWR from 'swr'
import {getAdminInfo} from "../libs/api-admin";
import jsCookie from "js-cookie";
import {keyToken} from "../consts/consts";

export function useUser() {
    const {data, mutate, error} = useSWR('api_user', getAdminInfo, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })
    const loading = !data && !error || !jsCookie.get(keyToken)
    const loggedOut = error && error.status === 403 || typeof window !== "undefined" && !jsCookie.get(keyToken)
    return {
        loading,
        loggedOut,
        user: data && data.data,
        mutate,
        error
    }
}
