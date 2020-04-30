// 配置axios
import Vue from 'vue'
import axios from 'axios'
import {MessageBox} from 'element-ui';

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})
export default ({ store, redirect }) => {
  // @ 装饰器
  service.interceptors.request.use(
    res => {
      // 请求拦截器，后续的token管理都在这
      // 我们也可以用vuex来获取
      const token = window.localStorage.getItem('token')
      if (token) {
        // 设置一个请求地址白名单
        res.headers.common.Authorization = 'Bearer ' + token
      }
      return res
    },
    error => {
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    async response => {
      const {data} = response
      return data
    }, error => {
      switch (error.response.status) {
        case 401: {
          MessageBox.confirm('登录已过期', '过期',{
            confirmButtonText:"登录",
            showCancelButton:false,
            type:"warning"
          }).then(()=>{
            localStorage.removeItem('token')
            // 跳转到登录页 或者使用vuex提交数据
            redirect({path:'/login'})
          })
          break
        }
      }
    }
  )
}


Vue.prototype.$http = service
export const http = service
