<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">提交订单</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix}">
			<scroll-view scroll-y="true" class="order-detail-content" :style="{'height': contentHeihgt+'px'}">

				<view class="order-address-wrap">
					<view class="add-address-wrap" v-if="address.id === null">
						<view class="btn-add-address" @click="addAddress">
							<image class="icon-add" src="../../static/icon-add-address.png"></image>
							<text class="text">新增收货地址</text>
						</view>
					</view>
					<navigator class="order-address" url="../mine/address" v-else>
						<view class="address">
							<!-- {{address.addressDetail}} -->
							{{address.fullRegion}}
						</view>
						<view class="user-info">
							<text class="name">{{address.userName}}</text>
							<text class="number">{{address.telNumber}}</text>
						</view>
						<view class="arrows-wrap">
							<image class="icon-arrows" src="../../static/icon-arrows.png"></image>
						</view>
					</navigator>
					<view class="order-time-wrap">
						<div class="order-time-left">
							配送时间
						</div>
						<div class="order-time-right">
							<text class="text">今天{{deliveryTime.deliveryBeginTime}}-{{deliveryTime.deliveryEndTime}}</text>送达
							<view class="arrows-wrap">
								<image class="icon-arrows" src="../../static/icon-arrows.png"></image>
							</view>
						</div>
					</view>
				</view>

				<view class="order-detail-wrap">
					<view class="order-shop-wrap">
						<view class="order-shop-name">{{shopInfo.brandName}}</view>
						<image class="icon-arrows" src="../../static/icon-arrows.png"></image>
					</view>
					<view class="order-goods-list">
						<block v-for="(item,index) in goodsList" :key="index" :data-id="index">							
							<view class="cart-goods-item">
								<view class="goods-cover">
									<!-- <image class="cover" :src="item.list_pic_url"></image> -->
									<fr-image class="cover" :src="item.list_pic_url" mode="aspectFill" />
								</view>
								<view class="goods-info">
									<view class="title">{{item.goods_name}}</view>
									<view class="intro-wrap"><text class="intro">{{item.sku_name}}</text><text
											class="count">x&nbsp;{{item.number}}</text></view>
									<view class="price-wrap">
										<view class="price"><text class="sign">￥</text>{{item.retail_price}}</view>
									</view>
								</view>
							</view>
						</block>
					</view>
					<view class="order-goods-count">
						<view class="goods-count-item" style="display: none;">
							<text class="count-item-left">配送费</text>
							<text class="count-item-right">¥0</text>
						</view>
						<view class="goods-count-item" style="display: none;">
							<text class="count-item-left">优惠券</text>
							<view class="count-item-right">1张可用<image class="icon-arrows"
									src="../../static/icon-arrows.png"></image>
							</view>
						</view>
						<view class="goods-count-item">
							<text class="count-item-left">订单备注</text>
							<view class="count-item-right"><input class="remark-input" placeholder-style="color:#888888"
									placeholder="备注内容选填" :value="postscript" @input="onInputPostscript"/></view>
						</view>
					</view>
				</view>

				<view class="cart-wrap">
					<view class="price-wrap" @tap="showModal" data-target="bottomModal">
						<view class="price">¥{{goodsPrice}}</view>
					</view>
					<view class="tips"></view>
					<view class="op-wrap" @click="payOrder" v-if="isLoad==false">去支付（{{goodsCount}}）</view>
					<view class="op-wrap" style="background:#AAAAAA;color: #FFFFFF ;" v-if="isLoad==true">去支付（{{goodsCount}}）</view>
				</view>


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

				// 收货地址
				address: {},
				// 配送时间
				deliveryTime: {
					deliveryBeginTime: 0,
					deliveryEndTime: 0,
				},

				//购物车
				goodsCount: 0,
				goodsPrice: 0,
				
				//商家id
				brandId: 0, 
				shopInfo: null,
				goodsList: null,
				
				//订单备注
				postscript: '',
				isLoad: false,
				
			}
		},
		components:{FrImage},
		onLoad(options) {
			var _this = this
			uni.getSystemInfo({
				success: function(res) {
					_this.contentHeihgt = res.windowHeight - _this.CustomBar;
				}
			});

			this.brandId = options.brandId;
			this.getCheckoutDetail(this.brandId);
		},
		onShow() {
			// this.getCheckoutDetail(this.brandId);
			this.getAddressList();
		},
		methods: {
			addAddress() {
				uni.navigateTo({
					url: '../mine/add-address'
				})
			},
			async getAddressList() {
				// 发起请求
				const res = await uni.$http.get(uni.$url.getAddressList);
			
				if (res.data.errno !== 0) return uni.$showMsg();
			
				// this.addressList = res.data.data.list;
				for(var i=0;i<res.data.data.list.length;i++){
					if(res.data.data.list[i].is_default==1){
						this.address = res.data.data.list[i];
					}
				}
			},
			async getCheckoutDetail(brandId) {

				let query = {
					brandId: brandId
				}
				// 发起请求
				const res = await uni.$http.post(uni.$url.getCheckoutDetail, query);

				if (res.data.errno !== 0) return uni.$showMsg(); 

				let data = res.data.data;
				
				if(data.checkedAddress.id==null){
					this.address = data.checkedAddress;
				}
				
				// debugger
				//拼接详细地址
				// if(this.address['provinceName'] !== null) {
				// 	// debugger
				// 	this.address['addressDetail'] = this.address.provinceName.substring(2);
				// 	if(this.address['cityName'] !== null) {
				// 		this.address['addressDetail'] = this.address.provinceName.substring(2) + this.address.cityName.substring(2);
				// 		if(this.address['countyName'] !== null) {
				// 			this.address['addressDetail'] = this.address.provinceName.substring(2) + this.address.cityName.substring(2) + this.address.countyName.substring(2);
				// 		}
				// 	}
				// }
				
				//配送时间
				this.deliveryTime = {
					deliveryBeginTime: data.deliveryBeginTime,
					deliveryEndTime: data.deliveryEndTime,
				},
				
				
				
				//购物车bar
				this.goodsCount = data.goodsCount;
				this.goodsPrice = data.goodsPrice;
				
				//商家信息
				this.shopInfo = data.list[0];
				//商品列表
				this.goodsList = data.list[0].goods;
			},
			onInputPostscript(e) {
				this.postscript = e.detail.value;
			},
			async payOrder() {
				uni.showLoading({
					title: '等待下单成功'
				})
				this.isLoad=true;
				if(this.address.id == null || this.address.id == '') return uni.$showMsg('请填写地址！');
				
				let orderInfo = {
					brandId: this.brandId,
					postscript: this.postscript,
					takenType: "2",
					beginTime: this.deliveryTime.deliveryBeginTime,
					endTime: this.deliveryTime.deliveryEndTime,
					addressId: this.address.id
				}
			
				//发起请求创建订单
				const res = await uni.$http.post(uni.$url.orderSubmit, orderInfo);
				
				let errmsg = res.data.errmsg;
				if (res.data.errno !== 0) return uni.$showMsg(errmsg,3500);
				
				//得到服务器响应的“订单编号”
				const orderId = res.data.data.orderInfo.id;
				const orderSn = res.data.data.orderInfo.order_sn;

				// 订单预支付
				// 发起请求获取订单的支付信息
				const res2 = await uni.$http.post(uni.$url.orderPay, { orderId: orderId });
				
				// 预付订单生成失败
				if (res2.data.errno !== 0) return uni.$showMsg('预付订单生成失败！', 3500);

				// 得到订单支付相关的必要参数
				const payInfo = res2.data.data
			
				if(res2.data.errno == 0){
					uni.hideLoading();
					this.isLoad=false;
				}
			
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
				// //模拟支付成功回调
				// const res3 = await uni.$http.post(uni.$url.orderPayNotify, { orderSn: orderSn })
				
				// if (res.statusCode !== 200) return uni.$showMsg('订单未支付！');
				
				// 完成了支付，进一步查询支付的结果
				// const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				// // 检测到订单未支付
				// if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 检测到订单支付完成

				uni.showToast({
				 title: '支付完成！',
				 icon: 'success'
				})
			
				uni.reLaunch({
					url: "./done?orderId=" + orderId
				})
				
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

	//购物车
	.cart-wrap {
		display: flex;
		position: fixed;
		bottom: 0;
		width: 710rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: #FFFFFF;
		border-radius: 50rpx;
		margin: 20rpx;
		text-align: center;
		box-shadow: 0px 3px 19px 1px rgba(0, 0, 0, 0.3);
		z-index: 1111;

		.price-wrap {
			width: 180rpx;

			.price {
				font-size: 44rpx;
				font-weight: bold;
				color: #FF5D48;
			}
		}

		.tips {
			width: 300rpx;
			font-size: 30rpx;
			color: #888888;
		}

		.op-wrap {
			width: 250rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			background: $custom-theme-color;
			border-radius: 0px 50px 50px 0px;
		}
	}

	/*购物车*/
	.order-address-wrap {
		width: 710rpx;
		margin: 20rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20px;

		.add-address-wrap {
			padding: 0rpx 0 30rpx 0;
			text-align: center;

			.btn-add-address {
				display: inline-block;
				width: 340rpx;
				height: 68rpx;
				line-height: 68rpx;
				margin: 15rpx 0;
				color: $custom-theme-color;
				background: #FFFFFF;
				font-size: 30rpx;
				font-weight: 400;
				border: 1rpx solid #FF5D48;
				border-radius: 34rpx;

				.icon-add {
					display: inline-block;
					width: 18rpx;
					height: 18rpx;
					margin-right: 15rpx;
					vertical-align: middle;
				}
			}
		}

		.order-address {
			position: relative;
			padding: 0 0 20rpx 0;
			background: #ffffff;

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

			.arrows-wrap {
				position: absolute;
				right: 10rpx;
				top: 55rpx;
				display: inline-block;
				width: 13rpx;
				height: 25rpx;

				.icon-arrows {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}
		}

		.order-time-wrap {
			display: flex;
			justify-content: space-between;
			color: #000000;
			font-size: 28rpx;
			padding-top: 30rpx;
			border-top: 1rpx solid #f1f1f1;

			.order-time-left {
				font-weight: 400;
			}

			.order-time-right {
				font-weight: 400;

				.text {
					color: #009E00;
				}

				.arrows-wrap {
					display: inline-block;
					width: 13rpx;
					height: 25rpx;
					margin-left: 27rpx;

					.icon-arrows {
						display: inline-block;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}

	/*订单信息*/
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

		.order-goods-count {
			padding: 15rpx 0 0 0;

			// border-bottom: 1rpx solid #f1f1f1;
			.goods-count-item {
				position: relative;
				display: flex;
				justify-content: space-between;
				padding: 15rpx 0;
				font-size: 30rpx;

				.count-item-left {}

				.count-item-right {}

				.icon-arrows {
					display: inline-block;
					width: 13rpx;
					height: 25rpx;
					margin-left: 25rpx;
				}

				.count {
					color: $custom-theme-color;
					font-size: 34rpx;
					font-weight: 400;
				}

				.remark-input {
					text-align: right;
				}
			}
		}
	}
</style>
