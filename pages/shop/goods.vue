<template>
	<view class="wrapper">
		<view class="nav-fixed" :class="isfixed?'isfixed':''">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="text">商品详情</text></block>
			</cu-custom>
		</view>
		
        <swiper class="screen-swiper" :indicator-dots="false" :circular="true" :autoplay="true" interval="5000"
			duration="500">
			<swiper-item v-for="(item,index) in 1" :key="index">
				<!-- <image class="swiper" :src="goodsData.imgUrl" mode="aspectFill"></image> -->
				<fr-image class="swiper" :src="goodsData.imgUrl" mode="aspectFill" />
			</swiper-item>
			<!-- imgUrl、name、materialDesc、isDiscount、discountPrice、originalPrice -->
		</swiper>

		<view class="goods-info-wrap">
			<view class="goods-title">{{goodsData.name}}</view>
			<view class="goods-intro">{{goodsData.materialDesc}}</view>
			<!-- <view class="goods-coupon"><view class="coupon">优惠券&nbsp;|&nbsp;￥3</view></view> -->
			<view class="goods-price">
				<block v-if="goodsData.isDiscount">
					<view class="price-wrap">
						<text class="price">
							<text class="sign">￥</text>
							{{goodsData.discountPrice}}
						</text>
						<text class="discount">￥{{goodsData.originalPrice}}</text>
					</view>
				</block>
				<!-- 没折扣 -->
				<block v-else>
					<view class="price-wrap">
						<text class="price">
							<text class="sign">￥</text>{{goodsData.originalPrice}}
						</text>
					</view>
				</block>
				<view class="goods-op" v-if="goodsData.skuList.length==0">
					<view class="btn-add-cart" v-if="goodsNum==0" @click="clickAddToCart">加入购物车</view>
					<view class="action margin-0 flex-sub text-green solid-left count-wrap" v-else>
						<view class="subtract" @click="reduce(item)">
							<image class="icon-subtract" src="../../static/icon-subtract.png"></image>
						</view>
						<view class="num">{{goodsNum}}</view>
						<view @click="add(item)" class="add">
							<image class="icon-add" src="../../static/icon-add.png"></image>
						</view>
					</view>
				</view>
				<view class="goods-op" v-else>
					<view  @tap="showModal"
						data-target="DialogModal" :data-goodsid="goodsId" :data-goodsimg="goodsData.imgUrl" :data-goodsname="goodsData.name">
						<text v-if="goodsNum>0" class="sku-num">{{goodsNum}}</text>
						<image class="icon-size" src="../../static/icon-size.png"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 购物车 -->
		<cart :cartData="cartData" @goodsNums="goodsNums"></cart>
		
		<!--商品规格弹框-->
		<view class="cu-modal size-modal" :class="modalName=='DialogModal'?'show':''"
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
					<!-- <view class="action margin-0 flex-sub text-green solid-left count-wrap" v-if="skuGoodsNum>0">
						<view class="subtract" @click="reduce()">
							<image class="icon-subtract" src="../../static/icon-subtract.png"></image>
						</view>
						<view class="num">{{skuGoodsNum}}</view>
						<view @click="add()" class="add">
							<image class="icon-add" src="../../static/icon-add.png"></image>
						</view>
					</view> -->
					<view class="action margin-0 flex-sub solid-left" :data-goodstype="1" @click="clickAddToCart">
						<view class="btn-add-cart">加入购物车</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import cart from '../../components/cart.vue'
	import goods from '../../components/goodsList.vue'
	import FrImage from '@/components/fr-image/fr-image.vue'
	// 按需导入 mapMutations 这个辅助方法
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['token']),
			// 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
			...mapGetters('m_cart', ['total']),
		},
		components: {
			"cart":cart,
			"goods":goods,
			"FrImage":FrImage,
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
				goodsCategory: [],
				goodsData: {
					id:0,
					cartNum:0,
					imgUrl:"",
					name:"",
					materialDesc:"",
					isDiscount:0,
					discountPrice:"0.00",
					originalPrice:"0.00",
					skuList:[]
				},
				currentIndex: 0,
				goodsRecommendList: [],
				
				//购物车
				cartData:{
					goodsCount:0,
					goodsPrice:0,
				},
				
				//Sku
				skuData: null,
				checkedSku: null,
				
				//商品规格模块
				goodsNum:0,
				skuGoodsNum:0,
				goodsId:0,
				goodsImg:"",
				goodsName:"",
				goodsSpecification:"",
				price:0.00,
				index:0,
				index1:0,
				numPrice:0.00,
				resGoods:[]
			}
		},
		components: {
			// tab
		},
		onShow() {
			this.getCartData()
			this.getGoodsData();
		},
		onLoad(options) {
			this.goodsId=options.id;
			this.shopId=options.shopId;
			this.getGoodsData();
			// // 监听筛选组件距离顶部的距离
			// const query = uni.createSelectorQuery().in(this);
			// query.select('.top-menu-view').boundingClientRect(data => {
	
			// 	this.topRange = data.top;
			// 	this.tabHeight = data.height;
	
			// }).exec();
	
		},
		updated() {
			// this.initSwiperHeight('.tabContent_' + this.TabCur);
		},
		watch: {
			
		},
		methods: {
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapMutations('m_cart', ['addToCart']),
			moveHandle: function() {
				return false
			},
			toPage(id){
				uni.navigateTo({
				  url: '../shop/goods?id='+id//实际路径要写全
				})
			},
			goodsNums(e){
				let num = 0;
				if(e.length==0){
					this.goodsNum=0;
					this.skuGoodsNum=0;
				}else{
					for(let i=0; e.length>i; i++){
						if(e[i].goods_id==this.goodsId){
							num += e[i].number;
						}
					}
				}
				this.goodsNum=num;
				this.resGoods=e;
			},
			// 获取商品详情数据的方法
			async getGoodsData() {
				let token = this.$store.state.m_user.token;
				if(token) {
					let res = await uni.$http.get(uni.$url.getGoodsById+this.goodsId);
					
					// 请求成功赋值给页面
					if (res.statusCode == 200) {
						this.goodsData.id=res.data.data.info.id;
						this.goodsNum=res.data.data.cartNum;
						this.goodsData.imgUrl=res.data.data.info.imgUrl;
						this.goodsData.name=res.data.data.info.name;
						this.goodsData.materialDesc=res.data.data.info.materialDesc;
						this.goodsData.isDiscount=res.data.data.info.isDiscount;
						this.goodsData.discountPrice=res.data.data.info.discountPrice;
						this.goodsData.originalPrice=res.data.data.info.originalPrice;
						this.goodsData.skuList=res.data.data.info.skuList;
					}
				}
			},
			// 获取购物车
			async getCartData() {
				let token = this.$store.state.m_user.token;
				if(token) {
					let res = await uni.$http.get(uni.$url.getCartUrl+this.shopId);
					
					// 请求成功赋值给页面
					if (res.statusCode == 200) {
						this.cartData=res.data;
						this.cartData["shopId"] = this.shopId;
					}
				}
			},
			// 添加商品到购物车
			async clickAddToCart() {
				
				let skuName = [];
				//添加商品到购物车（服务器）
				let query = {
					goodsId: this.goodsId,
					number:1,
					skuName:this.goodsSpecification!=""?this.goodsSpecification.split("_"):[]
				}
				
				let res = await uni.$http.post(uni.$url.addBySkuUrl,query);
				
				// 请求成功赋值给页面
				if (res.data.errno == 0) {
					this.getCartData();
					this.goodsNum++;
					this.chooseSku(this.index,this.index1);
				}
			
			},
			//根据ID获取商品规格
			async getSku(id) {
				
				// 发起请求
				const res = await uni.$http.get(uni.$url.getSkuUrl, {id:id})
				
				if (res.data.errno !== 0) return uni.$showMsg();
				
				this.skuData = res.data.data.getSku;
				this.price = this.skuData.price;
				
				// checked
				let Count = this.skuData['specList'].length;
				
				//sku初始化checked为0
				for (let i = 0; i < Count; i++) {
					this.skuData['specList'][i]['checked'] = 0;
				}
				
				this.chooseSku(0,0);
			},
			//选择规格
			chooseSku(index,index1) {
				this.index=index;
				this.index1=index1;
				this.skuData['specList'][index]['checked'] = index1;
				this.$forceUpdate();
			
				//第一项规格+第二项规格..如此类推
				let count = this.skuData['specList'].length;
				
				//双重循环拼接规格
				let arr = [];
				for (let i = 0; i < count; i++) {
					let subCount = this.skuData['specList'][i]['detail'].length;
					
					for(let j = 0; j < subCount; j++) {
						
						if(this.skuData['specList'][i]['checked'] == j) {
							arr.push(this.skuData['specList'][i]['detail'][j])
						}
					}
				}
				
				//将数组拼接为字符串
				this.goodsSpecification = arr.join("_");
				if(this.cartData["list"].length>0){
					this.skuGoodsNum=0;
					
					for(let i=0; i < this.cartData["list"][0]["goods"].length; i++){
						let sku_name = this.cartData["list"][0]["goods"][i]['sku_name'].split(",");
						let setSkuName = sku_name.join("_");
						if(setSkuName==this.goodsSpecification){
							this.skuGoodsNum=this.cartData["list"][0]["goods"][i]["number"];
							
						}
					}
				}
				
				//统计选中规格后的商品价格
				for(let i=0; i < this.skuData['skuList'].length; i++){
					let checkdPrice = 0
					if(this.skuData['skuList'][i]["title"]==this.goodsSpecification){
						checkdPrice=this.skuData.price+this.skuData['skuList'][i]["skuInfo"]["price"];
						this.numPrice=checkdPrice;
						this.price=checkdPrice;
						this.sumGoodsPrice(this.skuGoodsNum);
					}
				}
				
			},
			sumGoodsPrice(num){
				if(num==0)num=1;
				// this.price = num*this.numPrice;
				
			},
			//商品规格数量增加
			async add(){
				this.goodsNum++;
				this.skuGoodsNum++;
				//添加商品到购物车（服务器）
				let query = {
					goodsId: this.goodsId,
					number:1,
					skuName:this.goodsSpecification!=""?this.goodsSpecification.split("_"):[]
				}
				let res = await uni.$http.post(uni.$url.addBySkuUrl,query);
				
				// 请求成功赋值给页面
				if (res.data.errno == 0) {
					this.sumGoodsPrice(this.skuGoodsNum);
					this.getCartData();
				}
				
			},
			//商品规格数量减少
			async reduce(){
				this.goodsNum--;
				this.skuGoodsNum--;
				let token = this.$store.state.m_user.token;
				let query = {
					goodsId: this.goodsId,
					number:1,
					skuName:this.goodsSpecification!=""?this.goodsSpecification.split("_"):[]
				}
				if(token) {
					let res = await uni.$http.post(uni.$url.delCart,query);
					
					// 请求成功赋值给页面
					if (res.data.errno == 0) {
						this.sumGoodsPrice(this.skuGoodsNum);
						this.getCartData();
					}
				}
			},
			//展示模态框
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target;
			
				this.goodsId = e.currentTarget.dataset.goodsid;
				this.goodsImg = e.currentTarget.dataset.goodsimg;
				this.goodsName = e.currentTarget.dataset.goodsname;
			
				//根据ID获取商品规格
				this.getSku(this.goodsId);
			},
			hideModal(e) {
				this.modalName = null
				//防止与弹出层同步滚动
				// this.isWrapperFixed = false;
			},
			tabClick(e) {
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
		// position: sticky;
		background: #f4f4f4;
	}

	.wrapper {
		// position: sticky;
		// top: 0;
		// z-index: 1000;
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
	
	//轮播图
	.screen-swiper {
		width: 750rpx;
		height: 750rpx;
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

	//商品信息
	.goods-info-wrap {
		width: 710rpx;
		border-radius: 20rpx;
		margin: 20rpx;
		padding: 40rpx;
		background: #ffffff;
		box-sizing: border-box;
		.goods-title {
			font-size: 34rpx;
			font-weight: bold;
			color: #000000;
			padding-bottom: 30rpx;
			margin-bottom: 30rpx;
			border-bottom: 1rpx solid #f1f1f1;
		}
		.goods-intro {
			font-size: 28rpx;
			font-weight: 400;
			color: #666666;
			margin-bottom: 20rpx;
		}
		.goods-coupon {
			.coupon {
				display: inline-block;
				padding: 0 10rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: $custom-theme-color;
				background: #FFFFFF;
				border: 1px solid $custom-theme-color;
				border-radius: 10rpx;
			}
		}
		.goods-price {
			display: flex;
			padding-top: 40rpx;
			justify-content: space-between;
			.price {
				font-size: 44rpx;
				color: $custom-theme-color;
				.sign {
					font-size: 24rpx;
					font-weight: 400;
				}
				.old-price {
					font-size: 24rpx;
					font-weight: 400;
					text-decoration: line-through;
					color: #888888;
					margin-left: 25rpx;
				}
			}
			.discount {
				margin-left: 20rpx;
				font-size:24rpx;
				font-weight:400;
				text-decoration:line-through;
				color:#888888;
			}
			.goods-op {
				.sku-num{
					display: inline-block;
					position: relative;
					bottom: 30rpx;
					width: 15px;
					height: 15px;
					line-height: 15px;
					background: red;
					color: #FFFFFF;
					border-radius: 15px;
					z-index: 11;
					text-align: center;
					left: 8px;
				}
				.btn-add-cart {
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 20rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #FFFFFF;
					background: #FF5D48;
					border: 2rpx solid #C73B29;
					border-radius: 30rpx;
				}
				.icon-size {
					display: inline-block;
					width: 100rpx;
					height: 50rpx;
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
						vertical-align: super;
					}
				}
				
			}
		}
	}

</style>
