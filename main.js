import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = '/'
// 请求拦截器，自动携带token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, error => Promise.reject(error))

const app = createApp(App)

app.config.globalProperties.$axios = axios
app.use(ElementPlus)
app.use(router)
app.mount('#app')