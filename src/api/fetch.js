//引入axios
import axios from 'axios'
import {
  localStorage,
  sessionStorage
} from '../assets/js/storage'
import vm from '../main.js'
import {
  setTimeout
} from 'timers';

const ERR_OK = 'gl000'
// // const URL_HEAD = "http://192.168.1.156:8080/"  //廖武
// const URL_HEAD = 'http://192.168.1.131:8080/' //谷文海
const URL_HEAD = 'http://192.168.1.130:8080/' //卿旺
// const URL_HEAD = 'http://192.168.1.136:8080/'  //莫晓露
// const URL_HEAD = 'http://192.168.1.11:10080/'  //吴旭
// const URL_HEAD = 'http://119.23.130.85:50/'   //服务器
// const URL_HEAD = ''   // 生产环境
let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;
//请求拦截器
axios.interceptors.request.use(config => {
  //发起请求时，取消掉当前正在进行的相同请求
  // if (promiseArr[config.url]) {
  //   promiseArr[config.url]('操作取消')
  //   promiseArr[config.url] = cancel
  // } else {
  //   promiseArr[config.url] = cancel
  // }
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, error => {
  if(error && !error.response && error.message == 'Network Error') {
    vm.$vux.toast.show({
      type: 'warn',
      text: '“网络连接失败，请重新连接!'
    })
    return;
  }
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        // console.log(error.response)
        if (error.response.data.code === 'gl0001') {
          localStorage.setItem('is_token', '0')
          vm.$vux.toast.show({
            width: '160px',
            time: 3000,
            type: 'warn',
            text: '长时间未操作或账号被删除了，登录已失效，请重新登录'
          })
          vm.$router.push('/login')
          return;
        }
        if (error.response.data.code === 'gl0002') {
          localStorage.setItem('is_token', '0')
          vm.$vux.toast.show({
            width: '160px',
            time: 3000,
            type: 'warn',
            text: '该账号已在另一处登录，若非本人操作，请及时修改密码'
          })
          vm.$router.push('/login')
          return;
        }
        break;
      case 401:
        error.message = '未授权，请重新登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '请求错误,未找到该资源'
        break;
      case 405:
        error.message = '请求方法未允许'
        break;
      case 408:
        error.message = '请求超时'
        break;
      case 500:
        error.message = '服务器端出错'
        break;
      case 501:
        error.message = '网络未实现'
        break;
      case 502:
        error.message = '网络错误'
        break;
      case 503:
        error.message = '服务不可用'
        break;
      case 504:
        error.message = '网络超时'
        break;
      case 505:
        error.message = 'http版本不支持该请求'
        break;
      default:
        error.message = `连接错误${err.response.status}`
    }
  } else {
    error.message = "连接到服务器失败"
  }
  // message.error(error.message)
  error.response.msg = error.message
  return Promise.resolve(error.response)
})

axios.defaults.baseURL = URL_HEAD // 生产环境必须注释掉
axios.defaults.timeout = 10000

export default {
  //get请求
  get(url, param) {
    return new Promise((resolve, reject) => {
      setToken()
      axios({
        method: 'get',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  //post请求
  post(url, param) {
    return new Promise((resolve, reject) => {
      // 获取用户信息
      setToken()
      axios({
        method: 'post',
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  //post请求
  put(url, param) {
    return new Promise((resolve, reject) => {
      setToken()
      axios({
        method: 'put',
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  }
}
// 设置axios的header
function setToken() {
  //let userInfo = sessionStorage.getItem("user_info")
  let userInfo = localStorage.getItem("user_info")
  if (userInfo && userInfo.token) {
    axios.defaults.headers.common['token'] = userInfo.token
    axios.defaults.headers.common['userId'] = userInfo.id || userInfo.userId
  }
}
