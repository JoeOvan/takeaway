<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">我的收货地址</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix,'padding-bottom': tabbarHeight}">
			<view class="order-address-wrap">
				<block v-for="(item,index) in addressList" :key="index">
					<navigator class="order-address">
						<view class="address" @click="setDefault(item.id)">
							{{item.fullRegion+item.detailInfo}} <text v-if="item.is_default==1" class="default-text">默认</text>
						</view>
						<view class="user-info" @click="setDefault(item.id)">
							<text class="name">{{item.userName}}</text>
							<text class="number">{{item.telNumber}}</text>
						</view>
						<view class="edit-wrap" @click="editAddress" :data-addressid="item.id">
							<image class="icon-edit" src="../../static/icon-edit.png"></image>
						</view>
					</navigator>
				</block>
			</view>
			<button class="btn-add-address" @click="addAddress">新增收货地址</button>
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
			}
		},
		onLoad() {

			// this.getAddressList();

		},
		onShow() {

			this.getAddressList();

		},
		methods: {
			//设置默认地址
			async setDefault(id){
				
				const res = await uni.$http.post(uni.$url.setDefaultAddress,{id});
				
				if(res.data.errno !== 0) return uni.$showMsg();
				
				//添加成功提示
				uni.showToast({
				    title: '已成功默认收货地址',
				    duration: 1000
				});
				setTimeout(() => {
					uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
				}, 1000)
			},
			async getAddressList() {
				// 发起请求
				const res = await uni.$http.get(uni.$url.getAddressList);

				if (res.data.errno !== 0) return uni.$showMsg();
				
				this.addressList = res.data.data.list;

			},
			editAddress(e) {
				// debugger
				uni.navigateTo({
					url: './edit-address?id='+e.currentTarget.dataset.addressid
				})

			},
			addAddress() {
				uni.navigateTo({
					url: './add-address'
				})
			}
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
		position: fixed;
		width: 100%;
		height: 100%;
		overflow-y: auto;

	}
	
	.default-text{
		margin-left: 10px;
		background: #FF5D48;
		padding: 5px 10px;
		font-size: 14px;
		color: #FFFFFF;
		border-radius: 5px;
	}
	
	/*购物车*/
	.order-address-wrap {
		width: 710rpx;
		margin: 20rpx;
		.order-address {
			position: relative;
			padding: 0 20rpx 20rpx 20rpx;
			border-bottom: 1rpx solid #f1f1f1;
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
			.edit-wrap {
				position: absolute;
				right: 10rpx;
				top: 28rpx;
				display: inline-block;
				// width: 31rpx;
				// height: 30rpx;
				width: 91rpx;
				height: 90rpx;
				.icon-edit {
					display: inline-block;
					// width: 100%;
					// height: 100%;
					width: 31rpx;
					height: 30rpx;
					margin: 30rpx;
				}
			}
		}
	}

	//新增收货地址
	.btn-add-address {
		position: fixed;
		bottom: 30rpx;
		width: 710rpx;
		height: 68rpx;
		line-height: 68rpx;
		margin: 0 20rpx;
		font-size: 30rpx;
		text-align: center;
		background: #FFFFFF;
		border: 1rpx solid #BFBFBF;
		border-radius: 10rpx;
		z-index: 1111;
	}
</style>
