import Vue from 'vue'
import App from './App'
//导入 store 的实例对象
import store from './store/store.js'
// import {mapMutations} from 'vuex'
import cuCustom from './colorui/components/cu-custom.vue'
import { request,API_URL } from './util/api.js'
// import API_URL from './util/api.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

Vue.prototype.$request = request
// Vue.prototype.$url = API_URL
uni.$url = API_URL

Vue.component('cu-custom',cuCustom)


uni.$http = $http

// 请求的根路径
// $http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })

  // 判断当前请求的是否为有权限的接口
  if (options.url.indexOf('/') !== -1) {
    options.header = {
      'X-Nideshop-Token': store.state.m_user.token
    }
  }
  // 判断当前请求的是否为有权限的接口  获取购物车
  if (options.url.indexOf('/api/cart/getCart') !== -1) {
    options.header = {
      'X-Nideshop-Token': store.state.m_user.token || ''
    }
  }
 
  
}

// 响应拦截器
$http.afterRequest = function(res) {
  uni.hideLoading()
  
  const code = res.statusCode.toString();
  if(code.startsWith('2')) {

  	let code = res.data.errno;
  	if(code == 401) {
		store.state.m_user.token = '';
		store.state.m_user.userinfo = {};
		
		// 询问用户是否登录
		uni.showModal({
			title: '提示',
			content: '请先登录吗？',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
					// 用户确认了登录的操作
					uni.switchTab({
						url: `/pages/mine/mine`
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
  	}
  }
}

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store,
})
app.$mount()
