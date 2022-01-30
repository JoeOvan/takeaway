<template>
	<view class="wrapper" :class="isWrapperFixed? 'fixed':''">
		<view class="nav-fixed" :class="isfixed?'isfixed':''">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">广油美食家</text></block>
				<block slot="content">
					<navigator class="search-wrap"><text class="cuIcon-search"></text><text
							class="btn-search">搜索美食</text></navigator>
				</block>
			</cu-custom>
		</view>

		<swiper class="screen-swiper" :indicator-dots="false" :circular="true" :autoplay="true" interval="5000"
			duration="500">
			<swiper-item v-for="(item,index) in swiper" :key="index">
				<image class="swiper" :src="'https://ossweb-img.qq.com/images/lol/web201310/skin/big3900'+index+ '.jpg'"
					mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<view class="shops-wrap">
			<view class="title">餐厅推荐</view>
			<view class="shops-content">
				<scroll-view scroll-x="true" class="shops-scroll-content">
					<block v-for="(item, index) in shops" :key="index">
						<view class="item" @tap="goDetail(item.id)">
							<view class="img">
								<image :src="item.pic" mode=""></image>
							</view>
							<text class="item-title">{{item.title}}</text>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>

		<!-- 显示区域 -->
		<swiper class="swiper-box-list" duration="300" @change="swiperChange" :current="currentIndex"
			:style="{'height': swiperheight +'px'}">
			<block :slot="item.slot" v-for="(item,index) in 10" :key="index" :data-id="index">
				<swiper-item>
					<!-- <scroll-view class="swiper-topic-list" scroll-y="true" @scrolltolower="loadMore(index1)" :style="{'height': swiperheight +'px'}"> -->
					<view class="swiper-topic-list">
						<view class="tabContent">

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-add" src="../../static/icon-add.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-size" src="../../static/icon-size.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-add" src="../../static/icon-add.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-size" src="../../static/icon-size.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-add" src="../../static/icon-add.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-size" src="../../static/icon-size.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-add" src="../../static/icon-add.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-size" src="../../static/icon-size.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-add" src="../../static/icon-add.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-size" src="../../static/icon-size.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-add" src="../../static/icon-add.png"></image>
									</view>
								</view>
							</view>

							<view class="goods-item">
								<view class="cover-wrap">
									<image class="cover"
										src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg"
										mode="aspectFill"></image>
								</view>
								<view class="title-wrap">
									<view class="icon-hot"></view><text class="title">炭烤烧鸭饭</text>
								</view>
								<view class="tool-wrap">
									<view class="price-wrap"><text class="price"><text
												class="sign">￥</text>18</text><text class="discount">￥25</text></view>
									<view class="btn-add-cart" @tap="showModal" data-target="DialogModal">
										<image class="icon-size" src="../../static/icon-size.png"></image>
									</view>
								</view>
							</view>

						</view>
					</view>                     
					<!-- </scroll-view> -->
					                
				</swiper-item>
				            
			</block>
		</swiper>



		<view class="cu-modal size-modal" :class="modalName=='DialogModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="title">1點點果茶</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="size-content">
					<view class="size-item-wrap">
						<view class="lebal">份量</view>
						<view class="size-item">
							<text class="item-label active">小杯</text>
							<text class="item-label">大杯</text>
						</view>
					</view>
					<view class="size-item-wrap">
						<view class="lebal">甜度</view>
						<view class="size-item">
							<text class="item-label">少糖</text>
							<text class="item-label">多糖</text>
							<text class="item-label">全糖</text>
						</view>
					</view>
					<view class="size-item-wrap">
						<view class="lebal">温度</view>
						<view class="size-item">
							<text class="item-label">冰</text>
							<text class="item-label">去冰</text>
							<text class="item-label">常温</text>
						</view>
					</view>
				</view>
				<view class="cu-bar bg-white size-footer">
					<view class="action margin-0 flex-sub text-green price-wrap">
						<text class="price">￥14</text>
					</view>
					<view class="action margin-0 flex-sub text-green solid-left count-wrap">
						<view class="subtract" @click="reduce(item)">
							<image class="icon-subtract" src="../../static/icon-subtract.png"></image>
						</view>
						<view class="num">2</view>
						<view @click="add(item)" class="add">
							<image class="icon-add" src="../../static/icon-add.png"></image>
						</view>
					</view>
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">
						<view class="btn-add-cart">加入购物车</view>
					</view>
				</view>
			</view>
		</view>

		<view class="action">
			<button class="cu-btn bg-green shadow" @tap="showModal" data-target="bottomModal">Bottom</button>
		</view>
		<view class="cu-modal bottom-modal cart-modal" :class="modalName=='bottomModal'?'show':''" catchtouchmove="true"
			@touchmove.stop="">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green tips-left">已选美食</view>
					<view class="action text-blue tips-right" @tap="hideModal">
						<image class="icon-empty" src="../../static/icon-empty.png">
							</imgae>清空
					</view>
				</view>
				<view class="cart-content">
					<scroll-view class="cart-goods-wrap" scroll-y="true">
						<view class="cart-goods-item">
							<view class="goods-cover">
								<image class="cover"
									src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39001.jpg"></image>
							</view>
							<view class="goods-info">
								<view class="title">炭烤烧鸭饭</view>
								<view class="intro">创新广式烧腊</view>
								<view class="price-wrap">
									<view class="price"><text class="sign">￥</text>18</view>
									<view class="count-wrap">
										<view class="subtract" @click="reduce(item)">
											<image class="icon-subtract" src="../../static/icon-subtract.png"></image>
										</view>
										<view class="num">2</view>
										<view @click="add(item)" class="add">
											<image class="icon-add" src="../../static/icon-add.png"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="cart-goods-item">
							<view class="goods-cover">
								<image class="cover"
									src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39001.jpg"></image>
							</view>
							<view class="goods-info">
								<view class="title">炭烤烧鸭饭</view>
								<view class="intro">创新广式烧腊</view>
								<view class="price-wrap">
									<view class="price"><text class="sign">￥</text>18</view>
									<view class="count-wrap">
										<view class="subtract" @click="reduce(item)">
											<image class="icon-subtract" src="../../static/icon-subtract.png"></image>
										</view>
										<view class="num">2</view>
										<view @click="add(item)" class="add">
											<image class="icon-add" src="../../static/icon-add.png"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="cart-goods-item">
							<view class="goods-cover">
								<image class="cover"
									src="https://ossweb-img.qq.com/images/lol/web201310/skin/big39001.jpg"></image>
							</view>
							<view class="goods-info">
								<view class="title">炭烤烧鸭饭</view>
								<view class="intro">创新广式烧腊</view>
								<view class="price-wrap">
									<view class="price"><text class="sign">￥</text>18</view>
									<view class="count-wrap">
										<view class="subtract" @click="reduce(item)">
											<image class="icon-subtract" src="../../static/icon-subtract.png"></image>
										</view>
										<view class="num">2</view>
										<view @click="add(item)" class="add">
											<image class="icon-add" src="../../static/icon-add.png"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<view class="cart-wrap">
			<view class="price-wrap" @tap="showModal" data-target="bottomModal">
				<view class="price">¥39</view>
			</view>
			<view class="tips" @tap="showModal" data-target="bottomModal">为您节省了¥16</view>
			<view class="op-wrap">去结算（3）</view>
		</view>

	</view>
</template>

<script>
	// import tab from '../../components/Mark-Tab/Tab.vue'
	export default {
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

				swiperheight: 0, //这里是动态赋值的高度

				//模态框
				modalName: null,
				// modalName: "DialogModal",
				// modalName: "bottomModal",

				//tab导航栏
				TabCur: 0,
				scrollLeft: 0,

				swiper: [],
				shops: [],
				goodsCategory: [],
				goodsData: [],
				currentIndex: 0,
				goodsRecommendList: [],

			}
		},
		components: {
			// tab

		},

		onLoad() {

			this.getSwipers();
			// this.getShops();


			// this.getGoodsData();


			// // 监听筛选组件距离顶部的距离
			const query = uni.createSelectorQuery().in(this);
			query.select('.top-menu-view').boundingClientRect(data => {
				// console.log("得到布局位置信息" + JSON.stringify(data));
				// console.log("节点离页面顶部的距离为" + data.top);

				// console.log(data);
				this.topRange = data.top;
				this.tabHeight = data.height;

			}).exec();


			// this.stopBodyScroll(false);


		},
		onReady() {
			//swiper高度自适应
			// this.getElementHeight('.swiper-box-list')
		},
		mounted() {
			// console.log(this.$refs.tabbar.$el.getBoundingClientRect());

			//swiper自适应高度
			let info = uni.createSelectorQuery().in(this).selectAll('.tabContent').boundingClientRect()
			info.exec(res => {
				console.log(res);
				this.swiperheight = res[0][this.TabCur].height
				console.log(this.swiperheight)
			})

		},
		methods: {
			stopBodyScroll(isFixed) {
				// console.log(document);
				let query=uni.createSelectorQuery();
				let bodyEl = query.select('page');
				let top = 0
				if (isFixed) {
					top = window.scrollY

					bodyEl.style.position = 'fixed'
					bodyEl.style.top = -top + 'px'
				} else {
					bodyEl.style.position = ''
					bodyEl.style.top = ''

					window.scrollTo(0, top) // 回到原先的top
				}
			},
			async getSwipers() {
				// console.log(this.$url.swiperUrl); return
				// let res = await this.$request({
				// 	url: this.$url.swiperUrl
				// })
				// // console.log(res.data);
				// this.swiper = res.data
				
				let res = await uni.$http.get(uni.$url.swiperUrl);
				
				this.swiper = res.data
				
				console.log(this.swiper);
				
			},
			async getShops() {
				let res = await this.$request({
					url: this.$url.shopUrl
				})
				// console.log(res.data);
				this.shops = res.data
			},
			async getGoodsData() {
				let goodsCategory = await this.$request({
					url: this.$url.goodsCategoryUrl
				});
				let goodsRecommend = await this.$request({
					url: this.$url.goodsRecommendUrl
				});

				// let arr1 = goodsCategory.data;
				let arr1 = goodsCategory.data;

				// console.log(arr1);
				// let arr2 = goodsRecommend.data;
				let arr2 = goodsRecommend.data;
				// console.log(arr2);//对象


				//栏目数组拼接
				let arr = {
					label: goodsRecommend.data.label,
					slot: goodsRecommend.data.slot,
					pic: goodsRecommend.data.pic,
					title: goodsRecommend.data.title,
					list: goodsRecommend.data.list
				}

				arr1.unshift(arr);

				this.goodsCategory = arr1;

				// console.log(arr, arr1);
				// console.log(this.goodsCategory);

				let contentCount = this.goodsCategory.length;


				//请求数据并赋值给this.goodsData
				let arrData = [];
				for (let i = 0; i < contentCount; i++) {
					if (i == 0) {
						arrData[i] = arr2
					} else {
						arrData[i] = {}
					}
				}

				this.goodsData = arrData;

			},
			async getCurrentContent(type, index) {
				console.log(type, index);
				let goodsCategoryList = await this.$request({
					url: this.$url.goodsCategoryListUrl,
					data: {
						slot: type,
						_page: 1,
						_limit: 10
					}
				});

				// console.log(this.goodsCategory);

				let arrList = goodsCategoryList.data[0].list;


				console.log(arrList);

				//格式this.$set( target, key, value )
				// this.$set(this.goodsData[index], 'list', arrList );
				this.$set(this.goodsCategory[index], 'list', arrList);

				console.log(this.goodsCategory[index].list);

				// this.$forceUpdate()

			},
			//展示模态框
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target;
				//防止与弹出层同步滚动
				// this.isWrapperFixed = true;
				this.stopBodyScroll(true);
			},
			hideModal(e) {
				this.modalName = null
				//防止与弹出层同步滚动
				// this.isWrapperFixed = false;
				this.stopBodyScroll(false);
			},


			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.currentIndex = e.currentTarget.dataset.id;
			},
			swiperChange(e) {
				console.log(e);
				// let index = e.index;
				let index = e.detail.current;
				// let type = e.item.slot;
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60;
				this.currentIndex = index;
				//请相应的数据
				// this.getCurrentContent(type, index);
			},
			tabClick(e) {
				// console.log(e);
				// let index = e.index;
				// let type = e.item.slot;
				// this.currentIndex = index;
				// //请相应的数据
				// this.getCurrentContent(type,index);
			},
			moveHandle() {
				return false;
			}
		},
		onPageScroll(e) {
			this.scrollSize = e.scrollTop
		},
		computed: {
			// 监听筛选组件置顶和不置顶
			openFixed() {
				// 如果页面滚动的高度大于筛选组件距离顶部的高度，那就置顶，反之不置顶
				// console.log(this.scrollSize, this.topRange, this.CustomBar);
				if (this.scrollSize > this.topRange - this.CustomBar) {
					console.log('置顶')
					this.isfixed = true
				} else {
					console.log('不置顶')
					this.isfixed = false
				}
			}
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
		padding: 0 10rpx;
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
					width: 50rpx;
					height: 50rpx;
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
			padding: 0;
			margin: 0 20rpx;

			&.cur {
				height: 96rpx;
				font-size: 28rpx;
				color: #000000;
				border-bottom: 4rpx solid #FF5D48;
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
		// background-color: #FFFFFF;
	}

	.swiper-topic-list {
		height: 100%;
		width: 100%;
		padding: 20rpx;

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
				margin: 10rpx 0;
				color: #000000;
				font-size: 30rpx;
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
					bottom: 20rpx;

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
		padding-bottom: 130rpx;

		.cart-goods-wrap {
			height: 440rpx;
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
