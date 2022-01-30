<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">关于我们</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix,'padding-bottom': tabbarHeight}">
			<view class="order-address-wrap">
				<navigator class="order-address" url="article?id=1">
					<view class="user-info">用户条款 <image class="icon-edit" src="../../static/icon-arrows.png"></image></view>
				</navigator>
				<navigator class="order-address" url="article?id=2">
					<view class="user-info">隐私政策 <image class="icon-edit" src="../../static/icon-arrows.png"></image></view>
				</navigator>
				<navigator class="order-address">
					<view class="user-info">当前版本 <text>{{version}}</text></view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				tabbarHeight: '110rpx',
				addressList: null,
				version: "1.0.1",
			}
		},
		onLoad() {
			const accountInfo = wx.getAccountInfoSync();
			this.version=accountInfo.miniProgram.version;
			if(this.version==""){
				this.version="1.0.2";
			}
		},
		onShow() {


		},
		methods: {
			
		}
	}
</script>

<style lang="scss">

	page {
		background: #ffffff;
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
		margin-top: 10px;
		position: fixed;
		width: 100%;
		height: 100%;
		overflow-y: auto;

	}
	.order-address-wrap{
		padding: 0 30rpx;
	}
	.user-info{
		height: 55px;
		padding: 36rpx 30rpx;
		border-bottom: 1rpx solid #f1f1f1;
		font-weight:bold;
		.icon-edit{
			height: 25rpx;
			width: 13rpx;
			float: right;
			margin-top: 5rpx;
		}
		text{
			margin-top: 5rpx;
			float: right;
		}
	}
</style>
