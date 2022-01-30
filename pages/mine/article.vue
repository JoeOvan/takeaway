<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">{{pageText}}</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix,'padding-bottom': tabbarHeight}">
			<view class="order-address-wrap">
				{{content}}
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
				aid: 0,
				content:"",
				pageText:""
			}
		},
		onLoad(options) {
			this.getArticle(options.id)
			this.aid=options.id;
			// this.getAddressList();

		},
		onShow() {
			if(this.aid==1){
				this.pageText="用户条款";
			}else{
				this.pageText="隐私政策";
			}

		},
		methods: {
			async getArticle(id) {
				// 准备参数对象
				const query = {
					type: id
				}
		
				const res = await uni.$http.get(uni.$url.articleDetails, query)
			
				if (res.data.errno !== 0) return uni.$showMsg('获取失败！')
				this.content=res.data.data;
			},
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
		margin-top: 20px;
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
		padding: 34rpx 30rpx;
		border-bottom: 1rpx solid #f1f1f1;
		font-weight:bold;
		.icon-edit{
			height: 25rpx;
			width: 13rpx;
			float: right;
			margin-top: 2rpx;
		}
		text{
			margin-top: 5rpx;
			float: right;
		}
	}
</style>
