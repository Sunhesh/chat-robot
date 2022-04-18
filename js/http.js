const BASE_URL = 'https://study.duyiedu.com/api'

const fethcFn = async({ url, method = 'GET', params = {} }) => {
    /* get请求的参数的拼接 */
    let result = null
    const extendsObj = {}
    sessionStorage.token && (extendsObj.Authorization = 'Bearer ' + sessionStorage.token)
    if (method === 'GET' && Object.keys(params).length) {
        url += '?' + Object.keys(params).map(key => ''.concat(key, '=', params[key])).join('&')
    }

    try {
        const response = await fetch(BASE_URL + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...extendsObj
            },
            body: method === 'GET' ? null : JSON.stringify(params)
        })

        /* 获取后端的token值 */

        const token = response.headers.get('Authorization')
            /* 存储token值 */
        token && (sessionStorage.token = token)
        result = await response.json()
        if (result.code === 0) {

            /* 如果后端返回值里面有chatTotal，我们就把这个chatTotal也返回给前台 */

            if (result.hasOwnProperty('chatTotal')) {
                result.data = { chatTotal: result.chatTotal, data: result.data }
            }
            return result.data
        } else {
            /* 权限错误处理 */
            if (result.status === 401) {
                window.alert('权限token不正确')
                sessionStorage.removeItem('token')
                window.location.replace('/login.html')
                return
            }
            window.alert(result.msg)
        }
    } catch (error) {
        console.log(error)
    }
}