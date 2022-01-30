<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">修改手机号码</text></block>
			</cu-custom>
		</view>
		
		<view class="content" :style="{'top':tabFix}">
			<view class="address-form-wrap">
				<form @submit="address-form" class="address-form">
					<view class="address-form-item">
						<text class="label">当前绑定手机号：</text>
						<view class="form-item-wrap">
							<view class="address-input">13800138000</view>
						</view>
					</view>
					<view class="address-form-item">
						<text class="label">新绑定手机号：</text>
						<view class="form-item-wrap"><input type="text" placeholder-style="color:#888888" class="address-input" placeholder="输入新的手机号"></view>
					</view>
					<view class="address-form-item">
						<text class="label">验证码：</text>
						<view class="form-item-wrap">
							<input type="text" placeholder-style="color:#888888" class="address-input" placeholder="输入验证码">
							<navigator url="" class="btn-auth-code">输入验证码</navigator>
						</view>
					</view>
					<view class="form-handle-wrap">
						<button class="btn-address-submit">确定修改</button>
					</view>
				</form> 
			</view>
		</view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				tabFix: this.CustomBar + 'px',
				// contentHeihgt: calc(100vh - (this.CustomBar + "px")),
				contentHeihgt: 0,
			}
		},
		onLoad() {
			var _this = this
			uni.getSystemInfo({
			    success: function (res) {
					_this.contentHeihgt = res.windowHeight - _this.CustomBar;
			    }
			});
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page {
		// position: sticky;
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
		position: fixed;
		width: 100%;
		
	}
	
	/*新增收货地址*/
	.address-form-wrap {
		.address-form-item {
			display: flex;
			line-height: 30rpx;
			font-size: 28rpx;
			padding: 40rpx 20rpx;
			margin: 0 20rpx;
			border-bottom: 1rpx solid #F1F1F1;
			align-items: center;
			&:nth-last-child(1) {
				border: none;
			}
			.label {
				display: inline-block;
				width: 215rpx;
				// flex: 1;
			}
			.form-item-wrap {
				position: relative;
				flex: 4;
				.address-input {
					display: inline-block;
					vertical-align: middle;
				}
				.btn-auth-code {
					display: inline-block;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 15rpx;
					color: #ffffff;
					font-size: 28rpx;
					background: #999999;
					border-radius: 30px;
				}
			}
		}
		.form-handle-wrap {
			margin: 0 20rpx;
			.btn-address-submit {
				width: 100%;
				height: 68rpx;
				line-height: 68rpx;
				font-size: 30rpx;
				color: #ffffff;
				background: $custom-theme-color;
				border-radius: 10rpx;
			}
		}
	}
</style>
