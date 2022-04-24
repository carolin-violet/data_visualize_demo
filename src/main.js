import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



import '@/assets/css/global.less'
import axios from 'axios'
import '@/assets/font/iconfont.css'


import moment from 'moment'
Vue.prototype.$moment = moment

import SocketService from '@/utils/socket_service'
SocketService.Instance.connect()

Vue.prototype.$socket = SocketService.Instance   

axios.defaults.baseURL = 'http://127.0.0.1:7777/api/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.prototype.$echarts = window.echarts

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')