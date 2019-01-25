// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
Vue.config.productionTip = false
import 'common/stylus/index.styl'
/* eslint-disable no-new */
// window.$uri = 'http://192.168.253.2' // 这是我自己的服务器地址 需要代理转发的接口会使用$uri
fastClick.attach(document.body)
Vue.use(VueLazyLoad,{
	loading: require('common/image/default.png')
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
