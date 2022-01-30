<template>
	
	<view class="wrapper" :class="isWrapperFixed? 'fixed':''">
		<!-- 购物车弹出层 -->
		<model :shareState="custormModalName" @state="state">
			<block slot="content">
				<view class=" bottom-modal cart-modal" >
					<view>
						<view class="cu-bar bg-white">
							<view class="action text-green tips-left">已选美食</view>
							<view class="action text-blue tips-right" @tap="hideModal" @click="delAllCartData">
								<image class="icon-empty" src="../static/icon-empty.png"> 
									</imgae>清空
							</view>
						</view>
						
						<scroll-view class="cart-content" scroll-y="true">
							<scroll-view class="cart-goods-wrap"  v-for="(item,index) in data.list" :key="index" :data-id="index" >
								<view v-for="(item1,index1) in item.goods" :key="index1">
									<view class="cart-goods-item">
										<view class="goods-cover">
											<!-- <image class="cover" :src="item1.list_pic_url"></image> -->
											<fr-image class="cover" :src="item1.list_pic_url" mode="aspectFill" />
										</view>
										<view class="goods-info">
											<view class="title">{{item1.goods_name}}</view>
											<view class="intro">{{item1.sku_name}}</view>
											<view class="price-wrap">
												<view class="price"><text class="sign">￥</text>{{item1.retail_price}}</view>
												<view class="count-wrap">
													<view class="subtract" @click="cartReduce(item1.number,item1.goods_id,item1.sku_name)">
														<image class="icon-subtract" src="../static/icon-subtract.png"></image>
													</view>
													<view class="num">{{item1.number}}</view>
													<view @click="cartAdd(item1.number,item1.goods_id,item1.sku_name)" class="add">
														<image class="icon-add" src="../static/icon-add.png"></image>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</scroll-view>
					</view>
				</view>
			</block>
		</model>
		
		
		<!-- 首页底部价格统计模块 -->
		<view class="cart-wrap">
			<view class="price-wrap" @tap="showCustormModal" :data-target="custormModalName">
				<view :class="['price', data.goodsPrice == 0 ? 'grey' : '']">
					<text v-if="data.goodsPrice!=undefined">¥{{data.goodsPrice}}</text>
					<text v-else>¥0</text>
				</view>
			</view>
			<view class="tips" @tap="showCustormModal" :data-target="custormModalName"><text style="display: none;">为您节省了¥16</text></view>
			<view v-if="data.goodsCount > 0" :class="['op-wrap', data.goodsCount == 0 ? 'grey' : '']" @click="toPage">去结算（{{data.goodsCount}}）</view>
			<view v-else :class="['op-wrap', data.goodsCount == 0 || data.goodsCount == null ? 'grey' : '']">去结算</view>
		</view>
	</view>
</template>

<script>
	import FrImage from '@/components/fr-image/fr-image.vue'
	import model from '@/components/model.vue'
	// 按需导入 mapMutations 这个辅助方法
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		components:{FrImage,model},
		props:["cartData","gid"],
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['token']),
			// 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
			...mapGetters('m_cart', ['total']),
		},
		data() {
			return {
				data: this.cartData,
				topRange: 0, //导航栏初始化距顶部的距离
				scrollSize: 0, //滚动距离
				isfixed: false, //是否固定顶部

				//防止与弹出层同步滚动
				isWrapperFixed: false,
				tabFix: this.CustomBar + 'px',
				isTabFix: {
					top: 'auto'
				},

				//contentHeight
				windowsHeight: 0,
				tabHeight: 0,
				tabbarHeight: 0,

				swiperHeight: 0, //这里是动态赋值的高度
				firstLoading: true,


				isloading: false, // 是否正在请求数据

				//模态框
				modalName: null,
				// modalName: "DialogModal",
				custormModalName: false,

				//tab导航栏
				TabCur: 0,
				scrollLeft: 0,

				swiper: {},
				shops: {},
				goodsCart: [],
				goodsCategory: {},
				goodsData: {},
				currentIndex: 0,
				goodsRecommendList: [],
				
				//购物车
				cartTotal: 0, //购物车总数量
				priceTotal: 0, //购物车总价格 
				goodsType: 0,
				
				//Sku
				skuData: null,
				checkedSku: null,
				
				//商品规格模块
				goodsNum:1,
				goodsId:0,
				goodsImg:"",
				goodsName:"",
				goodsSpecification:"",
				price:0.00,
				
				shopId:0,
				rGoods:[],
				resGoods: {
					number:0,
					sku_name:""
				}
			}
		},
		components: {
			// tab

		},
		watch: {
			cartData(data) {
				this.data = data //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
			},
			gid(e) {
				this.goodsId = e //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
			},
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
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapMutations('m_cart', ['addToCart']),
			moveHandle: function() {
				return false
			},
			state(e){
				this.custormModalName=e;
			},
			//根据索引（this.TabCur）获取catId
			getCatId() {
				let catId = '';
				for (var i = 0; i < this.goodsCategory.length; i++) {

					if (this.goodsCategory[i].value == this.TabCur) {

						// return i;
						catId = this.goodsCategory[i].value;
					}
				}

				return catId;
			},
			toPage(id){
				uni.navigateTo({
				  url: '../order/order-submit?brandId='+this.data.shopId//实际路径要写全
				})
			},
			// 获取购物车
			async getCartData() {
				let token = this.$store.state.m_user.token;
				if(token) {
					let res = await uni.$http.get(uni.$url.getCartUrl+this.data.shopId);
					
					// 请求成功赋值给页面
					if (res.statusCode == 200) {
						this.data.goodsCount = res.data.goodsCount
						this.data.goodsPrice = res.data.goodsPrice
						this.data.list = res.data.list
						if(this.data.list.length>0){
							this.$emit('goodsNums', this.data.list[0].goods);
						}
						
					}
				}
			},
			// 清空购物车
			async delAllCartData() {
				let token = this.$store.state.m_user.token;
				if(token) {
					let res = await uni.$http.delete(uni.$url.delAllCart+this.data.shopId);
					
					// 请求成功赋值给页面
					if (res.data.errno == 0) {
						// this.getCartData();
						this.custormModalName=false;
						this.data.goodsCount=0;
						this.data.goodsPrice=0;
						this.data.list = [];
						this.$emit('goodsNums', []);
					}
				}
			},
			sumCartPrice(num){
				this.price = num*this.skuData.price;
			},
			//商品规格数量增加
			async cartAdd(number,id,skuName){
				//添加商品到购物车（服务器）
				let query = {
					goodsId: id,
					number:1,
					skuName:skuName!="-"?skuName.split(","):[]
				}

				let res = await uni.$http.post(uni.$url.addBySkuUrl,query);
				
				// 请求成功赋值给页面
				if (res.data.errno == 0) {
					this.getCartData();
					number++;
					let n = number;
					let data = {
						id:id,
						type:0,
					}
					this.$emit('goodsListNums', data);
				}
			},
			//商品规格数量减少
			async cartReduce(number,id,skuName){
				let token = this.$store.state.m_user.token;
				let query = {
					goodsId: id,
					number:1,
					skuName:skuName!="-"?skuName.split(","):[]
				}
				if(token) {
					let res = await uni.$http.post(uni.$url.delCart,query);
					
					// 请求成功赋值给页面
					if (res.data.errno == 0) {
						this.getCartData();
						number--;
						let n = number;
						let data = {
							id:id,
							type:1,
						}
						this.$emit('goodsListNums', data);
					}
				}
			},
			hideModal(e) {
				this.modalName = null
				//防止与弹出层同步滚动
				// this.isWrapperFixed = false;
			},
			//展示模态框
			showCustormModal(e) {
				// this.modalName = e.currentTarget.dataset.target;
				this.custormModalName = !this.custormModalName;
				//防止与弹出层同步滚动
				// this.isWrapperFixed = true;
				if(this.custormModalName==true) this.getCartData();
				
			},
			moveHandle() {
				return false;
			}
		},
		onPageScroll(e) {
			this.scrollSize = e.scrollTop
		}

		//当上述isFixed为true的时候需要置顶的view会增加一个样式，使用 position = fixed 脱离文档流
		//设置top = 0 即可完成置顶
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		min-height: 100%;
		// display: flex;
		// position: sticky;
		background: #f4f4f4;
	}

	.wrapper {
		position: static;
		flex: 1;
		display: flex;
		flex-direction: column;

		&.fixed {
			position: fixed;
			width: 100%;
			z-index: 100;
		}
	}

	.nav-fixed {
		position: fixed;
		// top: 0;
		width: 100%;
		z-index: 1000;
	}

	.isfixed {
		background: #FF5D48;
	}

	.cuIcon-back {
		display: none;
	}

	.logo-tips {
		display: inline-block;
		padding: 3rpx;
		color: #ffffff;
		background: #FF5D48;
	}

	.search-wrap {
		display: inline-block;
		height: 58rpx;
		line-height: 58rpx;
		margin-left: 50rpx;
		padding: 0 25rpx;
		background: #fff;
		border: 1rpx solid #FF5D48;
		border-radius: 30rpx;
		box-sizing: border-box;
	}

	.cuIcon-search {
		display: inline-block;
		margin-right: 10rpx;
		color: #FF5D48;
		font-size: 35rpx;
	}

	.btn-search {
		color: #FF5D48;
	}

	.screen-swiper {
		width: 750rpx;
		height: 550rpx;
	}

	//餐厅推荐
	.shops-wrap {
		position: relative;
		width: 690rpx;
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 3rpx 19rpx 1rpx rgba(233, 50, 26, 0.3);
		margin: -60rpx auto 50rpx auto;

		.title {
			line-height: 60rpx;
			font-size: 24rpx;
			color: #666666;
			padding: 0 30rpx;
		}
	}


	// .content {
	// 	position: sticky;
	// 	top: 0;
	// 	height: 100vh;
	// }

	.shops-scroll-content {
		white-space: nowrap; // 滚动必须加的属性
		width: 100%;
		height: 110rpx;
		padding: 15rpx 30rpx 30rpx 30rpx;
		box-sizing: border-box;

		.item {
			line-height: 50rpx;
			margin-right: 20rpx;
			display: inline-block;
			vertical-align: middle;

			.img {
				display: inline-block;
				margin-right: 11rpx;
				height: 50rpx;
				vertical-align: middle;

				image {
					display: inline-block;
					width: 50rpx;
					height: 50rpx;
					border: 1rpx solid #FF5D48;
					border-radius: 50%;
				}
			}

			.item-title {
				display: inline-block; // 让字体换行
				font-size: 28rpx;
				line-height: 50rpx;
				height: 50rpx;
			}
		}
	}

	.recommend-wrap {
		position: sticky;
		top: 80px;
		// height: calc(100vh - 29px);
		z-index: 99;

		.fixed {
			position: fixed;
			top: 0;
		}
	}

	.scroll-view {
		padding-top: 29px;
	}





	/* Tab切换 */

	.top-menu-view {
		// display: flex;
		white-space: nowrap;
		width: 100%;
		background-color: #FFFFFF;
		height: 100rpx;
		position: -webkit-sticky;
		position: sticky;
		z-index: 111;

		.cu-item {
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



	.swiper-box-list {
		// position: absolute;
		// top: 0;
		// bottomm: 0;
		flex: 1;
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		// background-color: #FFFFFF;
	}

	.swiper-topic-list {
		// height: 100%;
		width: 100%;
		// padding: 20rpx;

		.tab-content {
			// min-height: 500rpx;
			padding: 20rpx;
		}

		.goods-item {
			display: inline-block;
			width: 320rpx;
			height: 420rpx;
			padding: 20rpx;
			margin: 18rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			box-sizing: border-box;

			.cover-wrap {
				width: 280rpx;
				height: 280rpx;

				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}

			.title-wrap {
				margin: 10rpx 0 15rpx 0;
				color: #000000;
				font-size: 30rpx;

				.title {
					display: inline-block;
					width: 100%;
					height: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.tool-wrap {
				display: flex;
				justify-content: space-between;

				.price-wrap {
					height: 50rpx;
					font-size: 34rpx;
					color: #FF5D48;
					font-weight: bold;

					.price {
						margin-right: 24rpx;
					}

					.sign {
						font-size: 30rpx;
					}

					.discount {
						font-size: 24rpx;
						font-weight: 400;
						text-decoration: line-through;
						color: #888888;
					}
				}

				.btn-add-cart {
					position: relative;
					display: inline-block;
					right: 0;
					bottom: 18rpx;

					.icon-add {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;
					}

					.icon-size {
						display: inline-block;
						width: 100rpx;
						height: 50rpx;
					}
				}
			}
		}

		.shop-item {
			display: flex;
			// justify-content: space-between;
			align-items: center;
			background: #FFFFFF;
			// margin: 30rpx;
			margin-bottom: 20rpx;
			padding: 20rpx;
			border-radius: 20rpx;

			.cover-wrap {
				display: inline-block;
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;

				.cover {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}

			.shop-info {
				display: flex;
				width: 390rpx;
				height: 100rpx;
				flex-direction: column;
				justify-content: space-between;
				flex-shrink: 0;

				.shop-name {
					// align-items: flex-start;
				}

				.shop-label {

					// align-items: flex-end;
					.item-label {
						display: inline-block;
						font-size: 24rpx;
						color: #888888;
						margin: 10rpx;
					}
				}
			}

			.shop-discount {
				.discount {
					display: inline-block;
					width: 145rpx;
					height: 40rpx;
					color: #FF5D48;
					font-size: 24rpx;
					border: 1rpx solid #FF5D48;
					border-radius: 10rpx;
				}
			}
		}
	}

	//选规格模态框
	.size-modal {
		.cu-dialog {
			border-radius: 20rpx;
			background: #ffffff;

			.size-content {
				padding: 0 45rpx;
			}

			.size-item-wrap {
				text-align: left;

				// margin-bottom: 40rpx;
				.lebal {
					font-size: 24rpx;
					color: #888888;
					margin-bottom: 20rpx;
				}

				.size-item {

					.item-label {
						display: inline-block;
						width: 160rpx;
						height: 50rpx;
						line-height: 50rpx;
						// padding: 0 50rpx;
						margin: 0 30rpx 40rpx 0;
						font-size: 28rpx;
						border: 1rpx solid #E0E0E0;
						border-radius: 10rpx;
						text-align: center;

						&.active {
							color: $custom-theme-color;
							border: 1rpx solid $custom-theme-color;
						}
					}
				}
			}

			.size-footer {
				height: 120rpx;
				background: #F0F0F0;

				// border-radius: 0 0 20rpx 20rpx;
				.price-wrap {
					text-align: left;

					.price {
						color: $custom-theme-color;
						font-size: 44rpx;
					}
				}

				.count-wrap {
					.subtract {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;

						.icon-subtract {
							display: inline-block;
							width: 100%;
							height: 100%;
						}
					}

					.add {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;

						.icon-add {
							display: inline-block;
							width: 100%;
							height: 100%;
						}
					}

					.num {
						display: inline-block;
						margin: 0 28rpx;
					}
				}

				.btn-add-cart {
					width: 180rpx;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					background: #FF5D48;
					border: 2px solid #C73B29;
					border-radius: 30px;
				}
			}
		}

		.title {
			padding: 45rpx;
			font-size: 34rpx;
			font-weight: 400;
			color: #000000;
		}

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
				&.grey {
					color: #666666;
				}
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
			&.grey {
				background: #AAAAAA;
			}
		}
	}

	//购物车模态框
	.cart-modal {
		&.bottom-modal {
			.cu-dialog {
				border-radius: 20rpx 20rpx 0 0;

				.tips-right {
					&:last-child {
						margin-right: 30rpx;
						color: #000000;
					}
				}
			}
		}

		.tips-left {
			color: #000000;
		}

		.tips-right {
			&:last-child {
				margin-right: 30rpx;
				color: #000000;
			}

			.icon-empty {
				display: inline-flex;
				width: 20rpx;
				height: 28rpx;
				margin-right: 15rpx;
			}
		}
	}

	.cart-content {
		margin-bottom: 130rpx;
		max-height: 800rpx;
		.cart-goods-wrap {
			// height: 440rpx;
			border-top: 1rpx solid #f1f1f1;
			.cart-goods-item {
				display: flex;
				padding: 40rpx 40rpx 0 40rpx;
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
						image{
							right: 0px;
						}
					}
				}

				.goods-info {
					flex: 5;
					text-align: left;
					padding-bottom: 40rpx;
					border-bottom: 1rpx solid #f1f1f1;

					.title {
						height: 45rpx;
						line-height: 45rpx;
						font-size: 34rpx;
						font-weight: 400;
						color: #000000;
					}

					.intro {
						height: 35rpx;
						line-height: 35rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #666666;
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

						.count-wrap {
							position: relative;
							bottom: 20rpx;
							height: 50rpx;
							line-height: 50rpx;

							.subtract {
								display: inline-block;
								width: 50rpx;
								height: 50rpx;

								.icon-subtract {
									display: inline-block;
									width: 100%;
									height: 100%;
								}
							}

							.add {
								display: inline-block;
								width: 50rpx;
								height: 50rpx;

								.icon-add {
									display: inline-block;
									width: 100%;
									height: 100%;
								}
							}

							.num {
								display: inline-block;
								margin: 0 28rpx;
								vertical-align: top;
							}
						}
					}
				}
			}
		}
	}
</style>
