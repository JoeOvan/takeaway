<template>
	<swiper class="swiper-box-list" duration="300" @change="swiperChange" :current="currentIndex" :style="{'height': swiperHeight +'px'}">
		<!-- <swiper class="swiper-box-list" duration="300" @change="swiperChange" :current="currentIndex" :style="{'height': swiperHeight +'px'}" :style="{'padding-bottom': swiperPaddingBottom +'px'}"> -->
		<!-- <block :slot="item.slot" v-for="(item,index) in goodsData" :key="index" :data-id="index"> -->
		<swiper-item>
			<view class="swiper-topic-list">
				<view :class="'tab-content tabContent_'">
					
					<block v-for="(item,index) in goodsData" :key="index">
						<!-- <block v-if="item.length !== 0"> -->
							<!-- 有规格的 -->
							<block v-if="item.isSpecification">
								<view class="goods-item">
									<view class="cover-wrap">
										<image class="cover" :src="item.imgUrl" mode="aspectFill"></image>
									</view>
									<view class="title-wrap">
										<view class="icon-hot"></view><text
											class="title">{{item.name}}</text>
									</view>
									<view class="tool-wrap">
										<!-- 判断是否---有折扣 -->
										<block v-if="item1.isDiscount">
											<view class="price-wrap"><text class="price"><text
														class="sign">￥</text>{{item.discountPrice}}</text><text
													class="discount">￥{{item.originalPrice}}</text></view>
										</block>
										<!-- 没折扣 -->
										<block v-else>
											<view class="price-wrap"><text class="price"><text
														class="sign">￥</text>{{item.originalPrice}}</text>
											</view>
										</block>
		
										<view class="btn-add-cart" @tap="showModal"
											data-target="DialogModal" :data-goodsid="item.id" :data-goodsimg="item.imgUrl" :data-goodsname="item.name">
											<image class="icon-size" src="../static/icon-size.png">
											</image>
										</view>
									</view>
								</view>
							</block>
		
							<!-- 没规格的 -->
							<block v-else>
		
								<view class="goods-item">
									<view class="cover-wrap">
										<image class="cover" :src="item.imgUrl" mode="aspectFill"></image>
									</view>
									<view class="title-wrap">
										<view class="icon-hot"></view><text
											class="title">{{item.name}}</text>
									</view>
									<view class="tool-wrap">
										<!-- 判断是否---有折扣 -->
										<block v-if="item1.isDiscount">
											<view class="price-wrap"><text class="price"><text
														class="sign">￥</text>{{item.discountPrice}}</text><text
													class="discount">￥{{item.originalPrice}}</text></view>
										</block>
										<!-- 没折扣 -->
										<block v-else>
											<view class="price-wrap"><text class="price"><text
														class="sign">￥</text>{{item.originalPrice}}</text>
											</view>
										</block>
										<view class="btn-add-cart" @click="clickAddToCart"
											:data-goods="item" :data-goodsType="0" data-target="DialogModal">
											<image class="icon-add" src="../static/icon-add.png"></image>
										</view>
									</view>
								</view>
							</block>
						<!-- </block> -->
						<!-- <block v-else><text>暂时没有数据...</text></block> -->
					</block>
			
					
				</view>
			</view>                     
		</swiper-item>
	</swiper>
	
	
	<!--商品规格弹框-->
	<!-- <view class="cu-modal size-modal" :class="modalName=='DialogModal'?'show':''"
		@touchmove.stop.prevent="moveHandle">
		<view class="cu-dialog">
			<view class="cu-bar bg-white">
				<view class="title">{{skuData.name}}</view>
				<view class="action" @tap="hideModal">
					<text class="cuIcon-close text-red"></text>
				</view>
			</view>
			<view class="size-content">
				<block v-for="(item,index) in skuData.specList" :key="index">
					<view class="size-item-wrap">
						<view class="lebal">{{item.title}}</view>
						<view class="size-item">
							<block v-for="(item1,index1) in item.detail" :key="index1">
								<text :class="['item-label', item.checked == index1 ? 'active' : '']" @click="chooseSku(index,index1)">{{item1}}</text>
							</block>
						</view>
					</view>
				</block>
			</view>
			<view class="cu-bar bg-white size-footer">
				<view class="action margin-0 flex-sub text-green price-wrap">
					<text class="price">￥{{price}}</text>
				</view>
				<view class="action margin-0 flex-sub text-green solid-left count-wrap">
					<view class="subtract" @click="reduce()">
						<image class="icon-subtract" src="../../static/icon-subtract.png"></image>
					</view>
					<view class="num">{{goodsNum}}</view>
					<view @click="add()" class="add">
						<image class="icon-add" src="../../static/icon-add.png"></image>
					</view>
				</view>
				<view class="action margin-0 flex-sub solid-left" @tap="hideModal" :data-goodstype="1" @click="clickAddToCart">
					<view class="btn-add-cart">加入购物车</view>
				</view>
			</view>
		</view>
	</view> -->
</template>

<script>
	// 按需导入 mapMutations 这个辅助方法
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		props:["goodsData"],
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['token']),
			// 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
			...mapGetters('m_cart', ['total']),
		},
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

				//contentHeight
				windowsHeight: 0,
				tabHeight: 0,
				tabbarHeight: 0,

				swiperHeight: 200, //这里是动态赋值的高度
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
				goodsCart: {},
				goodsCategory: {},
				// goodsData: {},
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
				price:0.00
			}
		},
		components: {
			// tab
			
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
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapMutations('m_cart', ['addToCart']),
			moveHandle: function() {
				return false
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
			// 获取购物车
			async getCartData() {
				let token = this.$store.state.m_user.token;
				console.log(token);
				if(token) {
					let res = await uni.$http.get(uni.$url.getCartUrl);
			
					console.log("=======存在token",res);
					
					// 请求成功赋值给页面
					if (res.statusCode == 200) {
						this.cartTotal = res.data.goodsCount
						this.priceTotal = res.data.goodsPrice
						this.goodsCart = res.data.list
						for (let i = 0; i < this.goodsCart.length; i++) {
							if(this.goodsCart[i]["goods"].length>1){
								this.goodsCart[i]["goodsHight"] = 187;
							}else{
								this.goodsCart[i]["goodsHight"] = 100;
							}
						}
						console.log(this.goodsCart)
					}
				}
			},
			// 清空购物车
			async delAllCartData() {
				let token = this.$store.state.m_user.token;
				if(token) {
					let res = await uni.$http.delete(uni.$url.delAllCart);
			
					console.log("=======存在token",res);
					
					// 请求成功赋值给页面
					if (res.data.errno == 0) {
						this.getCartData();
						this.custormModalName=false;
					}
				}
			},
			sumCartPrice(num){
				this.price = num*this.skuData.price;
			},
			//商品规格数量增加
			cartAdd(i){
				this.goodsCart[i]["num"]++;
				
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
				this.getCartData();
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
		position: relative;
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
			margin: 10rpx;
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
			.cart-goods-brandName{
				text-align: left;
				background: #FFFFFF;
				.cart-goods-brandName-text{
					position: relative;
					top: 15rpx;
					padding: 0 10rpx 0 43rpx;
					font-size: 34rpx;
				}
				.cart-goods-brandName-icon{
					font-size: 34rpx;
					color: #AAAAAA;
					position: relative;
					top: 15rpx;
				}
			}
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
