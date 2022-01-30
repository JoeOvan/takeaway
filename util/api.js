// let BASE_URL = 'http://192.168.0.140:3333';
// let BASE_URL = 'http://192.168.31.9:3333';
// let BASE_URL = 'https://gywm.jianfeng.run';
// let BASE_URL = 'http://192.168.0.192:8080/platform_framework_war_exploded';
// let BASE_URL = 'https://gywm.winzkj.com';
let BASE_URL = 'http://gyws.winzkj.com';

let API_URL = {
	baseUrl: BASE_URL,
	//轮播图
	swiperUrl: BASE_URL + "/api/index/banner",
	//商家
	shopUrl: BASE_URL + "/api/index/brand",
	//商品分类
	goodsCategoryUrl: BASE_URL + "/api/index/channel",
	//商品列表
	goodsCategoryListUrl: BASE_URL + "/api/index/recommendGoodsOrBrand",
	//获取购物车
	getCartUrl: BASE_URL + "/api/cart/getCart?brandId=",
	//添加商品到购物车
	addBySkuUrl: BASE_URL + "/api/cart/addBySku",
	//清空购物车
	delAllCart: BASE_URL + "/api/cart/deleteAll?brandId=",
	//减少购物车数量
	delCart: BASE_URL + "/api/cart/minus",
	//根据ID获取商家
	getBrandDetail: BASE_URL + "/api/brand/detail/",
	//根据ID获取商家分类商品
	getCategoryGoods: BASE_URL + "/api/goods/categoryGoods?brandId=",
	//根据ID获取商品规格
	getSkuUrl: BASE_URL + "/api/goods/getSku",
	//根据ID获取商品详情
	getGoodsById: BASE_URL + "/api/goods/detail?id=",
	//根据ID获取商品地址三级联动
	getAreaAddress: BASE_URL + "/api/schoolAddress/getSchoolAddressComboBoxData",
	//获取用户地址列表
	getAddressList: BASE_URL + "/api/address/list",
	//获取用户地址详情（修改地址）
	getAddressDetail: BASE_URL + "/api/address/detail",
	//获取搜索历史
	getSearchHistory: BASE_URL + "/api/index/getSolrHistory",
	//获取搜索列表
	getSearch: BASE_URL + "/api/index/solr",
	//获取提交订单详情
	getCheckoutDetail: BASE_URL + "/api/cart/checkout",
	//保存地址
	saveAddress: BASE_URL + "/api/address/save",
	//删除地址
	deleteAddress: BASE_URL + "/api/address/delete",
	//获取地址（编辑地址）
	editAddress: BASE_URL + "/api/address/detail",
	//个人中心-订单列表
	orderList: BASE_URL + "/api/order/list",
	//提交订单
	orderSubmit: BASE_URL + "/api/order/submit",
	//订单支付
	orderPay: BASE_URL + "/api/pay/prepay",
	//订单详情
	orderDetail: BASE_URL + "/api/order/detail",
	//订单模拟支付
	orderPayNotify: BASE_URL + "/api/pay/notify",
	//订单确认收货
	orderConfirm: BASE_URL + "/api/order/confirmOrder",
	//订单取消
	orderCancel: BASE_URL + "/api/order/cancelOrder",
	//订单取消
	setDefaultAddress: BASE_URL + "/api/address/setDefault",
	//重新支付
	orderRePay: BASE_URL + "/api/pay/rePay",
	//文章详情
	articleDetails: BASE_URL + "/api/index/getAppReadDetails",
	//删除订单
	delOrders: BASE_URL + "/api/order/deleteOrder",
	
	
	//登录
	wxLoginUrl: BASE_URL + "/api/auth/login_by_weixin",
	
};


const request = (options)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url: options.url,
			method: options.method || 'GET',
			data: options.data || {},
			success: (res)=>{
				if(res== 0) {
					return uni.showToast({
						title: '获取数据失败'
					})
				}
				// if(res.data.status !== 0) {
				// 	return uni.showToast({
				// 		title: '获取数据失败'
				// 	})
				// }
				resolve(res)
			},
			fail: (err)=>{
				uni.showToast({
					title: '请求接口失败'
				})
				reject(err)
			}
		})
	})
}

export {
	request,
	API_URL
};
