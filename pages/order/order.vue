<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">我的订单</text></block>
			</cu-custom>
		</view>
		
		<view class="content" :style="{'top':tabFix}">
			<view class="top-menu-view">
				<block v-for="(item,index) in menuTabs" :key="index">
					<view class="menu-topic-view" v-bind:id="'tabNum'+index"  @click="tabSelect" :data-cid="item.value" :data-id="index">
						<view :class="[index==TabCur ? 'menu-topic-act' : 'menu-topic']">
							<view class="menu-topic-txt">{{item.name}}</view>
							<view class="menu-topic-bottom">
								<view class="menu-topic-bottom-color">
									
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			
			<!-- <scroll-view scroll-x="true" class="bg-white nav top-menu-view" :style="{'top':tabFix}" scroll-with-animation
				:scroll-left="scrollLeft">
				<view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in menuTabs"
					:key="index" @click="tabSelect" :data-cid="item.value" :data-id="index">
					{{item.name}}
				</view>
			</scroll-view> -->

			<!-- 显示区域 -->
			<swiper class="swiper-box-list" duration="300" @change="swiperChange" :current="currentIndex" :style="{'height': swiperHeight +'px'}">
				<block v-for="(item,index) in goodsData" :key="index">
					<swiper-item>
						<scroll-view class="swiper-topic-list" scroll-y="true" :style="{'height': swiperContentHeight + 'px'}" @scrolltolower="loadMore()" lower-threshold="100">
<!--							<view class="tabContent">-->
							<block v-if="item.data.length>0">
								<view :class="'tab-content tabContent tabContent_'+index">
									<!-- 展示列表内容 -->
									<view class="order-item" v-for="(item1,index1) in item.data" :key="index1">
										<view class="order-header-item">
											<text class="order-number">订单号：{{item1.order_sn}}</text>
											<text :class="[item1.order_status==302 ? 'complete-state' : 'order-status']">
												{{item1.order_status_text}}
												
											</text>
											<view style="width: 13px;position: relative;top: 2px;" @click="delOrder(item1.id,index1)">
												<image class="icon-empty" src="../../static/icon-empty.png"></imgae>
											</view>
										</view>
										<view class="order-content-item" @click="toPage(item1.id)">
											<view class="order-content-one">
												<scroll-view scroll-x="true" class="cart-goods-item">
													<block v-for="(item2,index2) in item1.orderGoods" :key="index2">
														<view class="goods-cover">
															<fr-image class="cover" :src="item2.list_pic_url"  mode="aspectFill" />
														</view>
													</block>
												</scroll-view>
												<!-- <view class="cart-goods-item" v-for="(item2,index2) in item1.orderGoods" :key="index2">
													<view class="goods-cover">
														<fr-image class="cover" :src="item2.list_pic_url" mode="" />
													</view>
													<view class="goods-info">
														<view class="title">{{item2.goods_name}}</view>
														<view class="intro-wrap"><text class="intro">{{item2.sku_name}}</text><text class="count">x&nbsp;{{item2.number}}</text></view>
														<view class="price-wrap">
															<view class="price"><text class="sign">￥</text>{{item2.retail_price}}</view>
														</view>
													</view>
												</view> -->
											</view>
										</view>
										<view class="order-footer-item">
											<view class="order-count">共{{item1.goodsCount}}件商品，实付款￥{{item1.actual_price}}</view>
											<view class="order-handle">
												<view class="btn-order-again order-sign-for" v-if='item1.order_status==302' @click="toShop(item1.brand_id)">再来一单</view>
												<view class="order-sign-for order-sign" v-if='item1.order_status== 1' @click="toPay(item1.id)">立即付款</view>
												<!-- <view class="order-sign-for order-sign" v-if='item1.order_status==301' @click="signOrder(item1.id)">签收</view> -->
												<view class="btn-order-again order-sign-for" v-if='item1.order_status==201' @click="cancelOrder(item1.id)">取消</view>
											</view>
										</view>
									</view>	
								</view>
							 </block>
							 <block v-else>
								 <view class="order-null">暂时没有订单...</view>
							 </block>
						</scroll-view>
					</swiper-item>
				</block>
			</swiper>
				
		</view>
		

	</view>
</template>

<script>
	 import FrImage from '@/components/fr-image/fr-image.vue'
	export default {
		components:{FrImage},
		data() {
			return {
				topRange: 0, //导航栏初始化距顶部的距离
				scrollSize: 0, //滚动距离
				isfixed: false, //是否固定顶部
				
				//防止与弹出层同步滚动
				isWrapperFixed: false,
				tabFix: this.CustomBar + 'px',
				isTabFix: {
					top: 'auto'
				},
				
				swiperContentHeight: 0, //切换内容固定高度
				
				swiperHeight: 500, //这里是动态赋值的高度
				firstLoading: true,
				
				
				isloading: false, // 是否正在请求数据
				
				//模态框
				modalName: null,
				// modalName: "DialogModal",
				custormModalName: false,
				
				//tab导航栏
				TabCur: 0,
				scrollLeft: 0,
				catId: 0,
				
				swiper: {},
				shops: {},
				goodsCart: {},
				goodsCategory: {},
				goodsData: {},
				orderData: {},
				currentIndex: 0,
				goodsRecommendList: [],
				
				//Sku
				skuData: null,
				checkedSku: null,
				
				//商品规格模块
				goodsNum:1,
				goodsId:0,
				goodsImg:"",
				goodsName:"",
				goodsSpecification:"",
				tabNum:0,
				price:0.00,
				menuTabs: [{
					name: '全部订单',
					value : 0,
				}, {
					name: '待付款',
					value : 1,
				}, {
					name: '待配送',
					value : 2,
				}, {
					name: '已完成',
					value : 3,
				}],
			}
		},
		onLoad() {
			this.getSwiperContentHeight();
		},
		onShow() {
			let status = uni.getStorageSync('orderStatus');
			let index = uni.getStorageSync('currentIndex');
			
			if(status==""){
				status=0;
				index=0;
				this.TabCur=0;
				this.currentIndex=0;
				this.firstLoading = true;
			}
			this.goodsCategoryContent(index,status)
		},
		//下拉刷新
		onPullDownRefresh() {
			
			// this.goodsCategoryContent(0,0)
					
			// this.getSwiperContentHeight();
			uni.stopPullDownRefresh();
			setTimeout(function () {
				uni.stopPullDownRefresh();
				
			}, 1000);
		},
		updated() {
			this.initSwiperHeight('.tabContent_' + this.TabCur);
		},
		watch: {
			// 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
			total(newVal) {
				this.cartTotal = newVal;
				// // 2. 通过数组的 find() 方法，找到购物车按钮的配置对象
				// const findResult = this.options.find((x) => x.text === '购物车')
		
				// if (findResult) {
				// 	// 3. 动态为购物车按钮的 info 属性赋值
				// 	findResult.info = newVal
				// }
			},
		},
		methods: {
			getSwiperContentHeight() {
				
				let windowHeight = 0;
				let swiperTopHeight = 0;
				
				uni.getSystemInfo({
				    success: function (res) {
						
						windowHeight = res.windowHeight;
						
				    }
				});
				
				const query = uni.createSelectorQuery().in(this);
				query.select('.swiper-box-list').boundingClientRect(data => {
					
					swiperTopHeight = data.top;
					
					this.swiperContentHeight = windowHeight - swiperTopHeight;
					
				}).exec();
	
			},
			//动态获取高度
			initSwiperHeight(element) {
				uni.createSelectorQuery().in(this).select(element).boundingClientRect(result => {
		
					if (result) {
						if(result.height>0){
							this.swiperHeight = result.height;
						}
						
					} else {
						this.initSwiperHeight(element);
					}
				}).exec();
		
			},
			toPage(id){
				uni.navigateTo({
				  url: '../order/detail?orderId='+id//实际路径要写全
				})
			},
			toShop(id){
				uni.navigateTo({
				  url: '../shop/shop?id='+id//实际路径要写全
				})
			},
			//删除订单
			delOrder(id,index){
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确定删除订单吗？',
				    success: function (res) {
				        if (res.confirm) {
				            that.delOrderData(id);
							that.goodsData[that.TabCur].data.splice(index, 1);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			async delOrderData(id){
				let res = await uni.$http.post(uni.$url.delOrders, {orderId:id});
				
				if (res.data.errno !== 0) return uni.$showMsg(errmsg,3500);
				
				if (res.data.errno == 0) {
					uni.showToast({
						title: "删除成功",
						duration: 1500,
						icon: 'success'
					})
				}
			},
			//取消订单
			async cancelOrders(id) {
				
				let query = {
					orderId:id
				};
				let res = await uni.$http.post(uni.$url.orderCancel,query);
				
				if (res.data.errno !== 0) return uni.$showMsg(errmsg,3500);
				
				if (res.data.errno == 0) {
					this.setOrderList(id,401)
					uni.showToast({
					  title: "取消成功",
					  duration: 1500,
					  icon: 'success'
					})
				}
			},
			//取消订单弹框
			cancelOrder(id) {
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确定取消订单吗？',
				    success: function (res) {
				        if (res.confirm) {
				            that.cancelOrders(id);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//签收订单
			signOrder(id) {
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确定签收订单吗？',
				    success: function (res) {
				        if (res.confirm) {
				            that.signOrders(id);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			async signOrders(id) {
				let res = await uni.$http.post(uni.$url.orderConfirm,{orderId:id});
				
				let errmsg = res.data.data;
				
				if (res.data.errno !== 0) return uni.$showMsg(errmsg,3500);
				
				uni.showToast({
				  title: "签收成功",
				  duration: 1500,
				  icon: 'success'
				})
				this.setOrderList(id,302)
			},
			setOrderList(id,type){
				for(var i=0;i<this.goodsData[this.TabCur]["data"].length;i++){
					if(this.goodsData[this.TabCur]["data"][i].id==id){
						this.goodsData[this.TabCur]["data"][i].order_status=type;
						if(type==302){
							this.goodsData[this.TabCur]["data"][i].order_status_text="确认收货"
						}
						if(type==301){
							this.goodsData[this.TabCur]["data"][i].order_status_text="配送中"
						}
						if(type==401){
							this.goodsData[this.TabCur]["data"][i].order_status_text="已取消"
						}
					}
				}
			},
			//立即付款
			async toPay(id) {
				const res = await uni.$http.post(uni.$url.orderRePay,{orderId:id});
		
				let errmsg = res.data.errmsg;
				
				// 预付订单生成失败
				if (res.data.errno !== 0) return uni.$showMsg(errmsg,3500);
				
				// 得到订单支付相关的必要参数
				const payInfo = res.data.data
								
				// 真实支付
				// 发起微信支付
				// 调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				
				// 未完成支付
				if (err) {
					 uni.$showMsg('订单未支付！');
					 uni.redirectTo({
					 	url: "./detail?orderId=" + orderId
					 })
					 
					 return 
				}
				
				if (succ.errMsg == "requestPayment:ok") {
					this.setOrderList(id,301)
				}
				
				uni.showToast({
				  title: "订单支付成功！",
				  duration: 3500,
				  icon: 'success'
				})
				
			},
			//分类内容
			async goodsCategoryContent(index, id) { 
				uni.setStorageSync('orderStatus', id);
				uni.setStorageSync('currentIndex', index);
				
				let query = {}
				switch(id){
					case 0:
						this.tabNum=0;
						query = {
							page: 1,
							limit: 10
						};
						break;
					case 1:
						this.tabNum=1;
						query = {
							orderStatus: 1,
							page: 1,
							limit: 10
						};
						break;
					case 2:
						this.tabNum=201;
						query = {
							orderStatus: 201,
							page: 1,
							limit: 10
						};
						break;
					case 3:
						this.tabNum=302;
						query = {
							orderStatus: 302,
							page: 1,
							limit: 10
						};
						break;
				}
				//首次进入
				if (this.firstLoading) {
					this.firstLoading = false;
					let res = await uni.$http.post(uni.$url.orderList, query);

					if (res.data.errno == 0) {
						this.orderData = res.data.data;
					}
		
					let contentCount = this.menuTabs.length;
		
					//请求数据并赋值给this.goodsData 没有数据的设置为空
					let arrData = {};
					for (let i = 0; i < contentCount; i++) {
						arrData[i] = {};
						if (i == index) {
							arrData[i]['data'] = this.orderData.data;
							arrData[i]['pageNum'] = this.orderData.currentPage
							arrData[i]['pageSize'] = this.orderData.numsPerPage;
							arrData[i]['total'] = this.orderData.count;
						} else {
							arrData[i]['data'] = [];
							arrData[i]['pageNum'] = null;
							arrData[i]['pageSize'] = null;
							arrData[i]['total'] = null;
						}
					}
		
					this.goodsData = arrData;
					
				} else {
					if (!this.goodsData[index]['data'] || this.goodsData[index]['data'].length<1) {

						let res = await uni.$http.post(uni.$url.orderList, query);

						if (res.data.errno == 0) {

							let resData = res.data.data;

							//加载更多数据赋值给goodsData
							this.goodsData[index]['data'] = resData.data;
							this.goodsData[index]['pageNum'] = resData.currentPage
							this.goodsData[index]['pageSize'] = resData.numsPerPage;
							this.goodsData[index]['total'] = resData.count;
						}
					}
				}
				this.$forceUpdate();
				this.initSwiperHeight('.tabContent_' + this.TabCur);
			},
			// 获取商品列表数据的方法
			async getGoodsData(index, id) {
				let pageNum = this.goodsData[index]['pageNum'];
				let pageSize = this.goodsData[index]['pageSize'];
				let total = this.goodsData[index]['total'];
				
				// 判断是否还有下一页数据
				if (pageNum * pageSize >= total) return uni.$showMsg('到底了，没有了！');
				// ** 打开节流阀
				this.isloading = true
				let query = {}
				switch(id){
					case 0:
						this.tabNum=0;
						query = {
							page: ++this.goodsData[index]['pageNum'],
							limit: 10
						};
						break;
					case 1:
						this.tabNum=1;
						query = {
							orderStatus: 1,
							page: ++this.goodsData[index]['pageNum'],
							limit: 10
						};
						break;
					case 2:
						this.tabNum=201;
						query = {
							orderStatus: 201,
							page: ++this.goodsData[index]['pageNum'],
							limit: 10
						};
						break;
					case 3:
						this.tabNum=302;
						query = {
							orderStatus: 302,
							page: ++this.goodsData[index]['pageNum'],
							limit: 10
						};
						break;
				}
				// 发起请求
				const res = await uni.$http.post(uni.$url.orderList, query)
				if (res.data.errno !== 0) return uni.$showMsg();
		
				// ** 关闭节流阀
				this.isloading = false
		
				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.goodsData[index]['data'] = [...this.goodsData[index]['data'], ...res.data.data.data]
				
				this.$forceUpdate();
		
				this.initSwiperHeight('.tabContent_' + this.TabCur);
		
			},
			//scroll-view 触底的事件
			loadMore() {
				// 判断是否正在请求其它数据，如果是，则不发起额外的请求
				if (this.isloading) return
				// 让页码值自增 +1
				// this.queryObj.pagenum += 1
				// 重新获取列表数据
				let catId = this.getCatId();
						
				this.getGoodsData(this.TabCur, catId);
				
			},
		// 	// 触底的事件
		// 	onReachBottom() {
		// 		// 判断是否正在请求其它数据，如果是，则不发起额外的请求
		// 		if (this.isloading) return
		// 		// 让页码值自增 +1
		// 		// this.queryObj.pagenum += 1
		// 		// 重新获取列表数据
		// 		let catId = this.getCatId();
		
		// 		this.getGoodsData(this.TabCur, catId);
		// 	},
			//根据索引（this.TabCur）获取catId
			getCatId() {
				let catId = '';
				for (var i = 0; i < this.menuTabs.length; i++) {
		
					if (this.menuTabs[i].value == this.TabCur) {
		
						// return i;
						catId = this.menuTabs[i].value;
					}
				}
		
				return catId;
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.currentIndex = e.currentTarget.dataset.id;
				
				if(this.currentIndex == 0)this.firstLoading = true;
			},
			swiperChange(e) {
				// let index = e.index;
				let index = e.detail.current;
				// let type = e.item.slot;
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60;
				this.currentIndex = index;
				//请相应的数据
				// this.getCurrentContent(type, index);
				if(index==0)this.firstLoading = true;
				let catId = this.getCatId();
				this.goodsCategoryContent(index, catId);
			},
			tabClick(e) {
				// console.log(e);
				// let index = e.index;
				// let type = e.item.slot;
				// this.currentIndex = index;
				// //请相应的数据
				// this.getCurrentContent(type,index);
			}
		},
		onPageScroll(e) {
			this.scrollSize = e.scrollTop
		},
		computed: {
			// 监听筛选组件置顶和不置顶
			openFixed() {
				// 如果页面滚动的高度大于筛选组件距离顶部的高度，那就置顶，反之不置顶
				if (this.scrollSize > this.topRange - this.CustomBar) {
					console.log('置顶')
					this.isfixed = true
				} else {
					console.log('不置顶')
					this.isfixed = false
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		// position: sticky;
		background: #f4f4f4;
	}
	.icon-empty {
		display: inline-flex;
		width: 20rpx;
		height: 28rpx;
	}
	.nav-fixed {
		position: fixed;
		/* position: relative; */
		width: 100%;
		z-index: 1000;
	}
	
	.cuIcon-back {
		display: none;
	}
	
	.isfixed {
		background: #FF5D48;
	}
	.complete-state {
		color: #999999;
	}
	.content {
		position: fixed;
		width: 100%;
	}
	.order-null{
		height: 200px;
		line-height: 200px;
		text-align:center;
	}
	/* Tab切换 */
	// .top-menu-view {
	// 	// display: flex;
	// 	white-space: nowrap;
	// 	width: 100%;
	// 	background-color: #FFFFFF;
	// 	height: 100rpx;
	// 	position: -webkit-sticky;
	// 	position: sticky;
	// 	z-index: 111;
	
	// 	.cu-item {
	// 		position: relative;
	// 		padding: 0;
	// 		margin: 0 20rpx;
	
	// 		&.cur {
	// 			height: 96rpx;
	// 			font-size: 28rpx;
	// 			color: #000000;
	// 			border-bottom: none;
	
	// 			&::before {
	// 				content: '';
	// 				position: absolute;
	// 				bottom: 10rpx;
	// 				left: 50%;
	// 				margin-left: -20rpx;
	// 				width: 40rpx;
	// 				height: 4rpx;
	// 				background: #FF5D48;
	// 			}
	// 		}
	// 	}
	// }
	
	/* Tab切换 */
	.body-view {
		height: 100%;
		width: 100%;
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		align-items: flex-start;
		justify-content: center;
	}
	
	.body-view .right-arrow {
		position: absolute;
		top: 22upx;
		right: 0upx;
		padding-left: 60upx;
		padding-right: 20upx;
		line-height: 42upx;
		background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 60%);
	}
	
	.body-view .right-arrow .iconfont {
		font-size: 24upx;
		font-family: iconfont;
		color: #909399;
	}
	
	.top-menu-view {
		display: flex;
		white-space: nowrap;
		width: 100%;
		background-color: #FFFFFF;
		height: 86upx;
		border-top: 1px solid #d8dbe6;
		border-bottom: 1px solid #d8dbe6;
		position: -webkit-sticky;
		position: sticky;
	}
	
	.top-menu-view .menu-topic-view {
		display: inline-block;
		white-space: nowrap;
		height: 86upx;
		position: relative;
		flex: 1;
	}
	
	.top-menu-view .menu-topic-view .menu-topic {
		margin-left: 30upx;
		margin-right: 10upx;
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.top-menu-view .menu-topic-view .menu-topic:first-child {
		margin-left: 30upx;
	}
	
	.top-menu-view .menu-topic-view:last-child .menu-topic {
		margin-right: 80upx;
	}
	
	.top-menu-view .menu-topic-view .menu-topic .menu-topic-txt {
		font-size: 30upx;
		color: #000000;
	}
	
	.top-menu-view .menu-topic-view .menu-topic .menu-topic-bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	
	.top-menu-view .menu-topic-view .menu-topic .menu-topic-bottom .menu-topic-bottom-color {
		width: 40upx;
		height: 4upx;
	}
	
	.top-menu-view .menu-topic-view .menu-topic-act {
		margin-left: 30upx;
		margin-right: 10upx;
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.top-menu-view .menu-topic-view:last-child .menu-topic-act {
		margin-right: 80upx;
	}
	
	.top-menu-view .menu-topic-view .menu-topic-act .menu-topic-txt {
		font-size: 30upx;
		color: #FF5D48;
		font-weight: 600;
	}
	
	.top-menu-view .menu-topic-view .menu-topic-act .menu-topic-bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	
	.top-menu-view .menu-topic-view .menu-topic-act .menu-topic-bottom .menu-topic-bottom-color {
		width: 40upx;
		height: 6upx;
		background: #FF5D48;
	}
	
	.swiper-box-list {
		flex: 1;
		width: 100%;
		height: auto;
		// background-color: #FFFFFF;
	}


  /* Tab切换 */

  .top-menu-view {
    display: flex;
    white-space: nowrap;
    width: 100%;
    background-color: #FFFFFF;
    height: 100rpx;
    position: -webkit-sticky;
    position: sticky;
    z-index: 111;
    justify-content: space-between;
    .cu-item {
      flex: 1;
      position: relative;
      padding: 0;
      margin: 0 20rpx;

      &.cur {
        height: 96rpx;
        font-size: 28rpx;
        color: #000000;
        border-bottom: none;

        &::before {
          content: '';
          position: absolute;
          bottom: 10rpx;
          left: 50%;
          margin-left: -20rpx;
          width: 40rpx;
          height: 4rpx;
          background: #FF5D48;
        }
      }
    }
  }


	
	/* 订单列表 */
	.order-item {
		width: 710rpx;
		margin: 20rpx;
		background: #ffffff;
		border-radius: 20px;
		.order-header-item {
			display: flex;
			justify-content: space-between;
			padding: 40rpx 30rpx 30rpx 30rpx;
			.order-number {
				font-size: 24rpx;
				font-weight: 400;
				color: #000000;
			}
			.order-status {
				font-size: 28rpx;
				font-weight: 400;
				color: #FF5D48;
			}
		}
		.order-content-item {
			.order-content-one {
				.cart-goods-item {
					white-space: nowrap;
					display: flex;
					padding: 40rpx 5%;
					// margin: 0 30rpx;
					background: #ffffff;
					border-top: 1px solid #f1f1f1;
					border-bottom: 1px solid #f1f1f1;
					.goods-cover {
						// flex: 1;
						width: 120rpx;
						height: 120rpx;
						margin-right: 20rpx;
						display: inline-block;
						.cover {
							display: inline-block;
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
					}
					.goods-info {
						flex: 5;
						text-align: left;
						.title {
							height: 45rpx;
							line-height: 45rpx;
							font-size: 34rpx;
							font-weight: 400;
							color: #000000;
						}
						.intro-wrap {
							display: flex;
							justify-content: space-between;
							height: 35rpx;
							line-height: 35rpx;
							color: #666666;
							.intro {
								font-size: 24rpx;
								font-weight: 400;
							}
							.count {
								font-size: 34rpx;
								font-weight: 400;
								color: #000000;
							}
						}
						.price-wrap {
							display: flex;
							justify-content: space-between;
							.price {
								font-size: 34rpx;
								height: 40rpx;
								line-height: 40rpx;
								color: $custom-theme-color;
								font-weight: bold;
								.sign {
									font-size: 24rpx;
								}
							}
						}
					}
				}
			}
			.order-content-two {
				.order-goods-item {
					display: flex;
					padding: 40rpx 0;
					margin: 0 30rpx;
					border-top: 1px solid #f1f1f1;
					border-bottom: 1px solid #f1f1f1;
					.goods-cover {
						// flex: 1;
						width: 120rpx;
						height: 120rpx;
						margin-right: 30rpx;
						.cover {
							display: inline-block;
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
					}
				}
			}
		}
		.order-footer-item {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 30rpx 40rpx 30rpx;
			.btn-order-handle {
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #FFFFFF;
				background: $custom-theme-color;
				border-radius: 30rpx;
			}
			.order-sign {
				background: #FF5D48;
				color: #FFFFFF;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				border: 1px solid #FF5D48;
				border-radius: 30rpx;
			}
			.btn-order-again {
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
				background: #ffffff;
				border: 1px solid #000;
				border-radius: 30rpx;
			}
		}
	}
</style>
