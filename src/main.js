import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 自定义指令
import * as directives from '@/directives'

// 注册全局组件
import Component from '@/components'

Vue.use(Component)

// 注册全局过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

// 自定义指令
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key])
})

// 注册打印组件
import Print from 'vue-print-nb'
Vue.use(Print)

// 注册全局混入
import myMixin from '@/mixin/checkPromission'
Vue.mixin(myMixin)

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

import i18n from '@/lang'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
