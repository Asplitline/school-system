import axios from 'axios'
const BASEURL = 'http://127.0.0.1:8088/'
// 创建axios实例
const $http = axios.create({
    baseURL: BASEURL,
    timeout: 5000,
    withCredentials: true // 允许携带cookie
})

// get
export function _get (url) {
    return function (params) {
        return $http.get(url, {
            params
        }).then(res => {
            return res.data
        }).catch((err) => { console.log(err) })
    }
}
// post
export function _post (url) {
    return function (params) {
        return $http.post(url,
            params
        ).then(res => {
            return res.data
        }).catch((err) => { console.log(err) })
    }
}
// put 
export function _put (url) {
    return function (params) {
        return $http.put(url, params)
            .then(res => {
                return res.data
            }).catch(err => {
                console.log(err)
            })
    }
}
// delete
export function _delete (url) {
    return function (params) {
        return $http.delete(url + '/' + params)
            .then(res => {
                return res.data
            }).catch(err => {
                console.log(err);
            })
    }
}