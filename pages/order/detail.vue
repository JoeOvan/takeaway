<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">订单详情</text></block>
			</cu-custom>
		</view>
		
		<view class="content" :style="{'top':tabFix}">
			<scroll-view scroll-y="true" class="order-detail-content" :style="{'height': contentHeihgt+'px'}">
				
				<!-- 配送中 -->
				<block v-if="orderInfo.order_status == 201 || orderInfo.order_status == 301">
					<view class="order-status-wrap">
						<view class="order-status"><text class="status">订单正在配送中...</text></view>
						<view class="order-address">
							<view class="address">
								{{orderInfo.detailedAddress}}
							</view>
							<view class="user-info">
								<text class="name">{{orderInfo.consignee}}</text>
								<text class="number">{{orderInfo.mobile}}</text>
							</view>
						</view>
						<view class="order-handle">
							<view class="time-wrap">
								送达时间：预计
								<text class="time">{{orderInfo.begin_time}}-{{orderInfo.end_time}}</text>
								送达
							</view>
							<view class="op-wrap">
								<!-- <view class="btn-order-handle" v-if="orderInfo.order_status == 301" @click="signOrder(orderInfo.id)">签收</view> -->
								<view class="btn-order-delete" v-if="orderInfo.order_status == 201" @click="cancelOrder(orderInfo.id)">取消订单</view>
							</view>
						</view>
					</view>
				</block>
				
				
				<!-- 待付款 -->
				<block v-if="orderInfo.order_status == 1">
					<view class="order-status-wrap order-status-delay">
						<view class="order-status"><text class="status">订单待付款...</text></view>
						<view class="order-address">
							<view class="address">
								{{orderInfo.detailedAddress}}
							</view>
							<view class="user-info">
								<text class="name">{{orderInfo.consignee}}</text>
								<text class="number">{{orderInfo.mobile}}</text>
							</view>
						</view>
						<view class="order-handle">
							<view class="op-wrap">
								<view class="btn-order-delete" @click="cancelOrder(orderInfo.id)">取消订单</view>
								<view class="btn-order-pay" @click="toPay(orderInfo.id)">立即付款</view>
							</view>
						</view>
					</view>
				</block>
				
				
				<!-- 已完成 -->
				<block v-if="orderInfo.order_status == 302 || orderInfo.order_status == 303">					
					<view class="order-status-wrap order-status-done">
						<view class="order-status"><text class="status">订单已完成</text></view>
						<view class="order-address">
							<view class="address">
								{{orderInfo.detailedAddress}}
							</view>
							<view class="user-info">
								<text class="name">{{orderInfo.consignee}}</text>
								<text class="number">{{orderInfo.mobile}}</text>
							</view>
						</view>
						<view class="order-handle">
							<view class="time-wrap">
								送达时间：{{orderInfo.deliverTimeEnd}}
							</view>
							<view class="op-wrap">
								<navigator class="btn-order-again" :url="'../shop/shop?id='+orderInfo.brand_id">再来一单</navigator>
							</view>
						</view>
					</view>
				</block>
				
				
				<!-- 取消订单 -->
				<block v-if="orderInfo.order_status == 101 || orderInfo.order_status == 401">					
					<view class="order-status-wrap order-status-done">
						<view class="order-status"><text class="status">订单已取消</text></view>
						<view class="order-address">
							<view class="address">
								{{orderInfo.detailedAddress}}
							</view>
							<view class="user-info">
								<text class="name">{{orderInfo.consignee}}</text>
								<text class="number">{{orderInfo.mobile}}</text>
							</view>
						</view>
						<view class="order-handle">
							<view class="time-wrap">
								<!-- 送达时间：{{orderInfo.deliverTimeEnd}} -->
							</view>
							<view class="op-wrap">
								<navigator class="btn-order-again" :url="'../shop/shop?id='+orderInfo.brand_id">再来一单</navigator>
							</view>
						</view>
					</view>
				</block>
				

				
				<view class="order-detail-wrap">
					<view class="order-shop-wrap">
						<navigator class="order-shop-name" :url="'../shop/shop?id='+orderInfo.brand_id">{{orderInfo.brand_name}}</navigator>
						<image class="icon-arrows" src="../../static/icon-arrows.png"></image>
					</view>
					<view class="order-goods-list" v-if="goodsList">
						<!-- 商品列表 -->
						<block v-for="(item,index) in goodsList" :key="index" :data-id="index">
							<navigator class="cart-goods-item" :url="'../shop/shop?id='+orderInfo.brand_id">
								<view class="goods-cover">
									<!-- <image class="cover" :src="item.list_pic_url"></image> -->
									<fr-image class="cover" :src="item.list_pic_url" mode="aspectFill" />
								</view>
								<view class="goods-info">
									<view class="title">{{item.goods_name}}</view>
									<view class="intro-wrap"><text class="intro"></text><text class="count"><text class="sign">￥</text>{{item.retail_price}}</text></view>
									<view class="num-wrap">
										<view class="num">x&nbsp;{{item.number}}</view>
									</view>
								</view>
							</navigator>
						</block>
					</view>
					<view class="order-goods-count">
						<view class="goods-count-item" style="display: none;">
							<text class="count-item-left">配送费</text>
							<text class="count-item-right">¥0</text>
						</view>
						<view class="goods-count-item" style="display: none;">
							<text class="count-item-left">优惠折扣</text>
							<text class="count-item-right">¥0</text>
						</view>
						<view class="goods-count-item">
							<text class="count-item-left">共{{orderInfo.goodsCount}}件商品</text>
							<text class="count-item-right">实付款：<text class="count">¥{{orderInfo.actual_price}}</text></text>
						</view>
					</view>
					<view class="order-goods-info">
						<view class="goods-info-item">
							<text class="goods-info-label">订单号码：</text>
							<text class="goods-info-text">{{orderInfo.order_sn}}</text>
						</view>
						<view class="goods-info-item">
							<text class="goods-info-label">订单时间：</text>
							<text class="goods-info-text">{{orderInfo.add_time}}</text>
						</view>
						<view class="goods-info-item">
							<text class="goods-info-label">订单备注：</text>
							<text class="goods-info-text">{{orderInfo.postscript}}</text>
						</view>
					</view>
				</view>
				
				<button class="order-contact-service" open-type="contact">联系客服</button>

			</scroll-view>

		</view>
		
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				// contentHeihgt: calc(100vh - (this.CustomBar + "px")),
				contentHeihgt: 0,
				goodsId: 0,
				
				
				goodsList: {},//商品列表
				orderInfo: {},//订单信息
			}
		},
		components:{FrImage},
		onLoad(option) {
			var _this = this
			uni.getSystemInfo({
			    success: function (res) {
					_this.contentHeihgt = res.windowHeight - _this.CustomBar;
			    }
			});
			
			this.goodsId=option.orderId;
			// this.getOrderDetail(option.orderSn);
			this.getOrderDetail(option.orderId);
		},
		methods: {
			async getOrderDetail(orderSn) {
				
				//发起请求订单详情
				const res = await uni.$http.post(uni.$url.orderDetail, {orderId:orderSn});
				// debugger
				let errmsg = res.data.errmsg;
				if (res.data.errno !== 0) return uni.$showMsg(errmsg,3500);
				
				this.orderInfo = res.data.data.orderInfo;
				this.goodsList = res.data.data.orderInfo.goods;
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
			//签收订单
			async signOrders(id) {
				
				let res = await uni.$http.post(uni.$url.orderConfirm,{orderId:id});
				
				let errmsg = res.data.errmsg;
				if (res.data.errno !== 0) return uni.$showMsg(errmsg);
				
				uni.showToast({
				  title: errmsg,
				  duration: 1500,
				  icon: 'success'
				})
				
				setTimeout(() => {
					this.getOrderDetail(id);
				},1500);
			},
			//取消订单
			async cancelOrders(id) {
				
				let res = await uni.$http.post(uni.$url.orderCancel,{orderId:id});

				let errmsg = res.data.errmsg;
				if (res.data.errno !== 0) return uni.$showMsg(errmsg);
				
				uni.showToast({
				  title: errmsg,
				  duration: 1500,
				  icon: 'success'
				})
				
				setTimeout(() => {					
					this.getOrderDetail(id);
				},1500);
				
			},
			//立即付款
			async toPay(id) {
				
				const res = await uni.$http.post(uni.$url.orderRePay,{orderId:id});
				
				let errmsg = res.errmsg;
				
				// 预付订单生成失败
				if (res.data.errno !== 0) return uni.$showMsg(errmsg,3500);
				
				// debugger
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
				
				if (res.data.errno == 0) {
					this.getGoodsData(this.TabCur, this.catId);
				}
				
				uni.showToast({
				  title: "订单支付成功！",
				  duration: 1500,
				  icon: 'success'
				})
				
				// setTimeout(() => {
				// 	uni.switchTab({
				// 		url: "./order"
				// 	})
				// },1500);
				setTimeout(() => {
					this.getOrderDetail(this.goodsId);
				},1500);
				
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		// position: sticky;
		background: #f4f4f4;
	}
	.nav-fixed {
		position: fixed;
		/* position: relative; */
		// top: 0;
		width: 100%;
		z-index: 1000;
	}
	
	.isfixed {
		background: #FF5D48;
	}
	
	.content {
		position: fixed;
		width: 100%;
		
	}
	
	/* 订单状态*/
	.order-detail-content {
		// height: 100vh;
	}
	.order-status-wrap {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;
		.order-status {
			text-align: center;
			margin-bottom: 30rpx;
			.status {
				font-weight: 34rpx;
				font-weight: bold;
				color: $custom-theme-color;
			}
		}
		.order-address {
			padding: 20rpx 0;
			background: #ffffff;
			border-top: 1px solid #f1f1f1;
			border-bottom: 1px solid #f1f1f1;
			.address {
				line-height: 80rpx;
				font-size: 34rpx;
				font-weight: 400;
				color: #000000;
			}
			.name {
				margin-right: 30rpx;
				line-height: 35rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
			}
			.number {
				line-height: 35rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
			}
		}
		.order-handle {
			display: flex;
			justify-content: space-between;
			padding-top: 30rpx;
			.time-wrap {
				font-size: 28rpx;
				color: #000;
			}
			.time {
				color: #009E00;
			}
			.btn-order-handle {
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 35rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #FFFFFF;
				background: $custom-theme-color;
				border-radius: 30rpx;
				text-align: center;
			}
			.btn-order-delete {
				// display: inline-block;
				// margin-right: 30rpx;
				margin-top: 20rpx;
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
	
	.order-status-done {
		.order-status {			
			.status {
				font-size: 34rpx;
				color: #000;
			}
		}
	}
	
	.order-status-delay {
		.order-handle {
			display: flex;
			justify-content: flex-end;
			.op-wrap {
				.btn-order-pay {
					display: inline-block;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 35rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #FFFFFF;
					background: $custom-theme-color;
					border-radius: 30rpx;
				}
				.btn-order-delete {
					display: inline-block;
					margin-right: 30rpx;
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
	}

	.order-detail-wrap {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;
		
		.order-shop-wrap {
			
			.order-shop-name {
				display: inline-block;
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
				margin-right: 10rpx;
			}
		
			.icon-arrows {
				display: inline-block;
				width: 13rpx;
				height: 25rpx;
			}
		}
		
		.order-goods-list {
			padding-bottom: 25rpx;
			border-bottom: 1px solid #f1f1f1;
			.cart-goods-item {
				display: flex;
				padding: 15rpx 0;
				background: #ffffff;
				.goods-cover {
					// flex: 1;
					width: 120rpx;
					height: 120rpx;
					margin-right: 20rpx;
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
							.sign {
								font-size: 24rpx;
							}
						}
					}
					.num-wrap {
						display: flex;
						justify-content: space-between;
						.num {
							font-size: 34rpx;
							height: 40rpx;
							line-height: 40rpx;
							color: #888888;
						}
					}
				}
			}
		}
		.order-goods-count {
			padding: 15rpx 0;
			border-bottom: 1rpx solid #f1f1f1;
			.goods-count-item {
				display: flex;
				justify-content: space-between;
				padding: 15rpx 0;
				font-size: 30rpx;
				.count-item-left {
					
				}
				.count-item-right {
					
				}
				.count {
					color: $custom-theme-color;
					font-size: 34rpx;
					font-weight: 400;
				}
			}
		}
		.order-goods-info {
			padding: 15rpx;
			.goods-info-item {
				padding: 15rpx 0;
				.goods-info-label {
					color: #888888;
				}
			}
		}
		
		
	}

	.order-contact-service {
		width: 710rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin: 20rpx;
		padding: 0 30rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		background: #ffffff;
		border-radius: 10px;
		border: none;
		text-align: center;
	}
</style>
