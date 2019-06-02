// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import filters from './filters'
import store from './store'
import util from 'assets/js/util.js'
import Exif from 'exif-js'
import {
  ToastPlugin,
  // AlertPlugin,
  DatetimePlugin,
  LoadingPlugin,
  ConfirmPlugin
} from 'vux'

import '../static/css/reset.css'
import './assets/style/common.styl'
import '../static/fonts/iconfont.css'
Vue.prototype.Exif = Exif
Vue.config.productionTip = false

// vux部分组件全局引用vux组件
Vue.use(ToastPlugin)
// Vue.use(AlertPlugin)
Vue.use(DatetimePlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)

// 引入自定义插件
Vue.use(util)

// 引入全局过滤器
filters(Vue)

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

export default vm;
