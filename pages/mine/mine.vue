<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text>个人中心</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix,'padding-bottom': tabbarHeight}">
			<view class="user-info-wrap">
				<view class="user-info">
					<view class="user-avatar" v-if="!token">
						<!-- <image class="avatar" src="https://z3.ax1x.com/2021/07/01/RrRKIg.png"></image> -->
						<fr-image class="avatar" src="https://z3.ax1x.com/2021/07/01/RrRKIg.png" mode="" />
					</view>
					<view class="user-avatar" v-if="token">
						<fr-image class="avatar" :src="userinfo.avatarUrl" mode="" />
						<!-- <image class="avatar" :src="userinfo.avatarUrl"></image> -->
					</view>
					<view class="info" v-if="!token">
						<view class="info-name">
							<button class="cu-btn bg-red margin-tb-sm lg btn-login" open-type="getUserInfo" @click="getUserProfile()">登录</button>
						</view>
					</view>
					<view class="info" v-if="token">
						<view class="info-name">{{userinfo.nickName}}</view>
						<!-- <view class="info-number">13800138000<image class="icon-edit-mini" src="../../static/icon-edit-mini.png"></image></view> -->
					</view>
				</view>
			</view>

			<!-- <view class="coupon-wrap">
				<view class="coupon-card-wrap">
					<view class="coupon-card">
						<view class="coupon-count">
							<view class="label">我的<text class="strong">优惠券</text></view>
							<view class="count"><text class="num">3</text>张</view>
						</view>
						<view class="coupon-share"><image class="cover" src="https://z3.ax1x.com/2021/07/01/RrRKIg.png" mode="widthFix"></image></view>
					</view>
				</view>
				<view class="coupon-list-wrap">
					<view class="coupon-list">
						<view class="coupon-cover"><image class="cover" src="https://z3.ax1x.com/2021/07/01/RrRKIg.png"></image></view>
						<view class="coupon-info">
							<view class="coupon-intro">
								<view class="title">红茶馆</view>
								<view class="intro">不可与满减、折扣商品 、第二份半价、品牌会员折扣商品同时使用。</view>
							</view>
						</view>
						<view class="coupon-op">
							<view class="price">
								<text class="sign">￥</text>3
							</view>
							<view class="btn-use">立即使用</view>
						</view>
					</view>
					<view class="coupon-list">
						<view class="coupon-cover"><image class="cover" src="https://z3.ax1x.com/2021/07/01/RrRKIg.png"></image></view>
						<view class="coupon-info">
							<view class="coupon-intro">
								<view class="title">红茶馆</view>
								<view class="intro">不可与满减、折扣商品 、第二份半价、品牌会员折扣商品同时使用。</view>
							</view>
						</view>
						<view class="coupon-op">
							<view class="price">
								<text class="sign">￥</text>3
							</view>
							<view class="btn-use">立即使用</view>
						</view>
					</view>
				</view>
			</view> -->

			<view class="info-list">
				<navigator class="info-list-item" url="address">
					<view class="text">收货地址</view>
					<image class="arrows" src="../../static/icon-arrows.png"></image>
				</navigator>
				<view class="info-list-item">
					<button class="order-contact-service" open-type="contact">联系客服</button>
					<image class="arrows" src="../../static/icon-arrows.png"></image>
				</view>
				<navigator class="info-list-item" url="about-us">
					<view class="text">关于我们</view>
					<image class="arrows" src="../../static/icon-arrows.png"></image>
				</navigator>
			</view>


			<view class="btn-logout" @click="logout">
				<view class="text">退出账号</view>
			</view>

		</view>
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'

	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token']),
		},
		components:{FrImage},
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				tabbarHeight: 0
			}
		},
		onLoad() {
			let systemInfo = wx.getSystemInfoSync();
			
			let windowHeight = systemInfo.windowHeight; //窗口高度
			let screenHeight = systemInfo.screenHeight; //屏幕高度
			let statusBarHeight = systemInfo.statusBarHeight; //设备状态栏高度
			let pixelRatio = systemInfo.pixelRatio;      //设备像素比

			let tabbarHeight = ( screenHeight - windowHeight - statusBarHeight ) * pixelRatio;

			this.tabbarHeight = tabbarHeight + "px";

		},
		onShow() {
			uni.setStorageSync('orderStatus', "");
			uni.setStorageSync('currentIndex', "");
			let token = this.$store.state.m_user.token;
			if(!token) {
			     this.updateUserInfo({});
			     this.updateToken('');
			}
			
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
			// 获取微信用户的基本信息
			getUserProfile(e) {

				this.getCode();

				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {

						//将用户的基本信息存储到 vuex 中
						this.updateUserInfo(res.userInfo);

						// 获取登录成功后的 Token 字符串
						this.getToken(res)

					}
				});

			},
			async getCode() {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err);
				
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')

				uni.setStorageSync('code', res.code);
			},
			// 调用登录接口，换取永久的 token
			async getToken(info) {
				// // 调用微信登录接口
				// const [err, res] = await uni.login().catch(err => err)

				// console.log(res);
				// // 判断是否 uni.login() 调用失败
				// if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')

				// 准备参数对象
				const query = {
					// code: res.code,
					code: uni.getStorageSync('code'),
					userInfo: info,
				}

				// 换取 token
				const loginResult = await uni.$http.post(uni.$url.wxLoginUrl, query)
				
				if (loginResult.data.errno !== 0) return uni.$showMsg('登录失败！')
				uni.$showMsg('登录成功')
				// console.log(loginResult.data.data.token);
				this.updateToken(loginResult.data.data.token);
			},
			// 退出登录
			async logout() {
			  // 询问用户是否退出登录
			  const [err, succ] = await uni.showModal({
			    title: '提示',
			    content: '确认退出登录吗？'
			  }).catch(err => err)

			  if (succ && succ.confirm) {
			     // 用户确认了退出登录的操作
			     // 需要清空 vuex 中的 userinfo、token 和 address
			     this.updateUserInfo({})
			     this.updateToken('')
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
	button::after{
		border: none;
	}
	.content {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow-y: auto;

	}
	.order-contact-service {
		width: 710rpx;
		height: 85rpx;
		line-height: 85rpx;
		padding: 0;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		background: #ffffff;
		border-radius: 10px;
		border: none;
		text-align: left;
	}
	
	.cuIcon-back {
		display: none;
	}

	//个人中心
	.user-info-wrap {
		// padding: 30rpx 60rpx 164rpx 60rpx;
		padding: 30rpx 60rpx 55rpx 60rpx;
		background: #FF5D48;
		.user-info {
			display: flex;
			justify-content: flex-start
		}
		.user-avatar {
			display: inline-block;
			width: 80rpx;
			height: 80rpx;
			margin-right: 24rpx;
			
			flex-shrink: 0;
			image{
				border-radius: 50%;
			}
			.avatar {
				display: inline-block;
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.info {
			font-weight: bold;
			color: #FFFFFF;
			.info-name {
				font-size: 34rpx;
			}
			.info-number {
				font-size: 24rpx;
				font-weight: 400;
				.icon-edit-mini {
					display: inline-block;
					width: 20rpx;
					height: 20rpx;
					margin-left: 15rpx;
				}
			}
		}
	}

	//优惠券
	.coupon-wrap {
		margin: -120rpx 40rpx 0 40rpx;
		.coupon-card-wrap {
			position: relative;
			width: 670rpx;
			height: 240rpx;
			background: #FFFFFF;
			box-shadow: 0 20rpx 29rpx 2rpx rgba(233, 50, 26, 0.3);
			border-radius: 20rpx;
			z-index: 10;
			.coupon-card {
				display: flex;
				justify-content: space-between;
				.coupon-count {
					width: 285rpx;
					.label {
						margin: 30rpx;
						font-size: 30rpx;
						color: #009E00;
						.storng {
							font-weight: 400;
						}
					}
					.count {
						text-align: center;
						font-size: 24rpx;
						color: $custom-theme-color;
						.num {
							margin-right: 10rpx;
							font-size: 72rpx;
						}
					}
				}
				.coupon-share {
					width: 385rpx;
					.cover {
						width: 100%;
						border-radius: 0 20rpx 20rpx 0 ;
					}
				}
			}
		}
		.coupon-list-wrap {
			position: relative;
			width: 630rpx;
			margin: 0 auto;
			background: #FFFFFF;
			z-index: 9;
			.coupon-list {
				display: flex;
				justify-content: flex-start;
				height: 150rpx;
				padding: 30rpx;
				border-bottom: 1rpx solid #f1f1f1;
				box-sizing: border-box;
				&:last-child {
					border-bottom: none;
				}
				.coupon-cover {
					display: inline-block;
					width: 70rpx;
					height: 70rpx;
					.cover {
						display: inline-block;
						width: 100%;
						height: 100%;
					}
				}
				.coupon-info {
					width: 375rpx;
					margin: 0 20rpx;
					.coupon-intro {
						.title {
							font-size: 28rpx;
							font-weight: 400;
							color: #000000;
						}
						.intro {
							font-size: 20rpx;
							font-weight: 400;
							color: #888888;
							line-height: 30rpx;
						}
					}
				}
				.coupon-op {
					.price {
						font-size: 44rpx;
						font-weight: 400;
						color: $custom-theme-color;
						.sign {
							font-size: 30rpx;
						}
					}
					.btn-use {
						display: inline-block;
						padding: 0 5rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #FFFFFF;
						border: 2rpx solid #C73B29;
						background: $custom-theme-color;
						border-radius: 20rpx;
					}
				}
			}
		}
	}

	//用户信息列表
	.info-list {
		width: 670rpx;
		height: 260rpx;
		margin: 50rpx 40rpx 40rpx 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		.info-list-item {
			position: relative;
			display: flex;
			height: 86rpx;
			line-height: 86rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			border-bottom: 1rpx solid #f1f1f1;
			justify-content: space-between;
			align-items: center;
			&:last-child {
				border-bottom: none;
			}
			.arrows {
				display: inline-block;
				width: 13rpx;
				height: 25rpx;
			}
		}
	}

	.btn-login {
		margin: 0 auto;
	}

	//退出按钮
	.btn-logout {
		font-size: 28rpx;
		font-weight: 400;
		color: #000000;
		width: 670rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin: 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		text-align: center;
	}


</style>
