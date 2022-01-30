<template>
	<view class="wrapper" :class="isWrapperFixed? 'fixed':''">
		<view class="nav-fixed" :class="isfixed?'isfixed':''">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">商家主页</text></block>
			</cu-custom>
		</view>

		<view class="shop-wrap" :style="{'padding-top':tabFix}">
			<view class="cover-wrap">
				<!-- <image class="cover" :src="shops.brandAvatarImg" mode="aspectFill"></image> -->
				<fr-image class="cover" :src="shops.brandImg" mode="aspectFill" />
			</view>
			<view class="shop-intro">
				<!-- <image class="avatar" :src="shops.brandImg"></image> -->
				<fr-image class="avatar" :src="shops.brandAvatarImg" mode="aspectFill" />
				<text class="name">{{shops.name}}</text>
			</view>
		</view>

		<!-- 头部 -->
		<scroll-view scroll-x="true" class="bg-white nav top-menu-view" :style="{'top':tabFix}" scroll-with-animation
			:scroll-left="scrollLeft">
			<view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in goodsData"
				:key="index" @click="tabSelect" :data-cid="item.value" :data-id="index">
				{{item.label}}
			</view>
		</scroll-view>

		<!-- 显示区域 -->
		<swiper class="swiper-box-list" duration="300" @change="swiperChange" :current="currentIndex"
			:style="{'height': swiperHeight +'px'}">
			<!-- <swiper class="swiper-box-list" duration="300" @change="swiperChange" :current="currentIndex" :style="{'height': swiperHeight +'px'}" :style="{'padding-bottom': swiperPaddingBottom +'px'}"> -->
			<!-- <block :slot="item.slot" v-for="(item,index) in goodsData" :key="index" :data-id="index"> -->
			<block v-for="(item,index) in goodsData" :key="index" :data-id="index">
				<swiper-item>
					<view class="swiper-topic-list">
						<view :class="'tab-content tabContent_'+index">

							<block v-if="item.list.length !== 0">
								<block v-for="(item1,index1) in item.list" :key="index1">
										<view class="goods-item" >
											<view class="cover-wrap" @click="toPage(item1.id)">
												<!-- <image class="cover" :src="item1.imgUrl" mode="aspectFill"></image> -->
												<fr-image class="cover" :src="item1.imgUrl" mode="aspectFill" />
											</view>
											<view class="title-wrap" @click="toPage(item1.id)">
												<view class="icon-hot"></view><text
													class="title">{{item1.name}}</text>
											</view>
											<view class="tool-wrap">
												<!-- 判断是否---有折扣 -->
												<block v-if="item1.isDiscount">
													<view class="price-wrap"><text class="price"><text
																class="sign">￥</text>{{item1.discountPrice}}</text><text
															class="discount">￥{{item1.originalPrice}}</text></view>
												</block>
												<!-- 没折扣 -->
												<block v-else>
													<view class="price-wrap">
														<text class="price">
															<text class="sign">￥</text>{{item1.originalPrice}}
														</text>
													</view>
												</block>
										
												<view class="btn-add-cart" @tap="showModal" v-if="item1.isSpecification"
													data-target="DialogModal" :data-goodsid="item1.id" :data-goodsimg="item1.imgUrl" :data-goodsname="item1.name">
													<text v-if="item1.cartNum>0" class="sku-num">{{item1.cartNum}}</text>
													<image class="icon-size" src="../../static/icon-size.png">
													</image>
												</view>
												
												<view class="btn-add-cart" @click="clickAddToCart" v-else
													:data-goods="item1" :data-goodsType="0" data-target="DialogModal">
													<text v-if="item1.cartNum>0" class="sku-num">{{item1.cartNum}}</text>
													<image class="icon-add" src="../../static/icon-add.png"></image>
												</view>
											</view>
										</view>
									</block>
								</block>
							<block v-else>
								<view style="text-align: center;padding: 60px 0 80px 0;">暂时没有商品</view>
							</block>
						</view>
					</view>
				</swiper-item>
			</block>
		</swiper>


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
					<!-- <view class="action margin-0 flex-sub text-green solid-left count-wrap">
						<view class="subtract" @click="reduce()">
							<image class="icon-subtract" src="../../static/icon-subtract.png"></image>
						</view>
						<view class="num">{{goodsNum}}</view>
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

		<cart :cartData="cartData" @goodsListNums="goodsListNums" @goodsNums="goodsNums"></cart>
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
				shops: {},
				goodsCart: {},
				goodsCategory: [],
				goodsData: [],
				currentIndex: 0,
				goodsRecommendList: [],
				
				//购物车
				cartTotal: 0, //购物车总数量
				priceTotal: 0, //购物车总价格 
				goodsType: 0,
				cartData:{
					goodsCount:0,
					goodsPrice:0,
				},
				
				//Sku
				skuData: {},
				checkedSku: null,
				
				//商品规格模块
				goodsNum:1,
				goodsId:0,
				goodsImg:"",
				goodsName:"",
				goodsSpecification:"",
				price:0.00,
				numPrice:0.00
			}
		},
		components: {
			// tab
		},
		onShow() {
			this.getCartData()
			this.getGoodsCategory()
		},
		onLoad(options) {
			this.shopId=options.id; 
			this.getShops();
			// this.getGoodsCategory();
			//分类内容
			this.goodsCategoryContent(0, 0);
			
			
			//获取购物车
			// this.getCartData();

			// // 监听筛选组件距离顶部的距离
			// const query = uni.createSelectorQuery().in(this);
			// query.select('.top-menu-view').boundingClientRect(data => {
			// 	// console.log("得到布局位置信息" + JSON.stringify(data));
			// 	// console.log("节点离页面顶部的距离为" + data.top);

			// 	// console.log(data);
			// 	this.topRange = data.top;
			// 	this.tabHeight = data.height;

			// }).exec();

		},
		onReady() {

		},
		mounted() {

		},

		computed() {
			//swiper自适应高度
			// let info = uni.createSelectorQuery().in(this).selectAll('.tabContent').boundingClientRect()
			// info.exec(res => {
			// 	console.log(res);
			// 	this.swiperheight = res[0][this.TabCur].height
			// 	console.log(this.swiperheight)
			// })
		},
		updated() {
			this.initSwiperHeight('.tabContent_' + this.TabCur);
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
			//动态获取高度
			initSwiperHeight(element) {
				uni.createSelectorQuery().in(this).select(element).boundingClientRect(result => {
					if (result) {
						this.swiperHeight = result.height+50;
					} else {
						this.initSwiperHeight(element);
					}
				}).exec();
			},
			//计算购物车组件添加或删减商品个数赋值到商品列表
			goodsListNums(e){
				for(var i=0;i<this.goodsData.length;i++){
					for(var k=0;k<this.goodsData[i].list.length;k++){
						if(this.goodsData[i].list[k].id==e.id){
							if(e.type==0){
								this.goodsData[i].list[k].cartNum++;
							}else{
								if(this.goodsData[i].list[k].cartNum==0){
									break;
								}
								this.goodsData[i].list[k].cartNum--;
							}
						}
					}
				}
			},
			//购物车组件清空购物车后商品列表个数回0
			goodsNums(e){
				if(e.length==0){
					for(var i=0;i<this.goodsData.length;i++){
						for(var k=0;k<this.goodsData[i].list.length;k++){
							this.goodsData[i].list[k].cartNum=0;
						}
					}
				}
			},
			// 获取商店基础信息
			async getShops() {
				const res = await uni.$http.get(uni.$url.getBrandDetail+this.shopId)
				if (res.data.errno == 0) {
					this.shops = res.data.data.brand
				}
			},
			toPage(id){
				uni.navigateTo({
				  url: '../shop/goods?id='+id+"&shopId="+this.shopId//实际路径要写全
				})
			},
			async getGoodsCategory() {
				const goodsCategory = await uni.$http.get(uni.$url.getCategoryGoods+this.shopId)
			
				if (goodsCategory.data.errno == 0) {
					this.goodsData=goodsCategory.data.data.category;
				}
			},
			//分类内容
			async goodsCategoryContent(index, id) {
				//首次进入
				if (this.firstLoading) {
					this.firstLoading = false;
				}

				this.$forceUpdate();
				this.initSwiperHeight('.tabContent_' + this.TabCur);
			},
			// 获取商品列表数据的方法
			async getGoodsData(index, id) {

				// let pageNum = this.goodsData[index]['pageNum'];
				// let pageSize = this.goodsData[index]['pageSize'];
				// let total = this.goodsData[index]['total'];
				
				// console.log("页码============", pageNum, pageSize, total);
				
				// // 判断是否还有下一页数据
				// if (pageNum * pageSize >= total) return uni.$showMsg('到底了，没有了！');
				// // ** 打开节流阀
				// this.isloading = true


				// let query = {
				// 	id: id,
				// 	offset: ++this.goodsData[index]['pageNum'],
				// 	limit: 3
				// }
				// // 发起请求
				// const res = await uni.$http.get(uni.$url.goodsCategoryListUrl, query)

				// if (res.data.errno !== 0) return uni.$showMsg();

				// // ** 关闭节流阀
				// this.isloading = false

				// // console.log("555555555",res); //return

				// // console.log(this.goodsData[index]['data']);
				// // console.log(res.data.data.recommendGoodsOrBrand);

				// // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				// this.goodsData[index]['data'] = [...this.goodsData[index]['data'], ...res.data.data.recommendGoodsOrBrand.data
				// ]

				// // this.total = res.message.total
				// this.$forceUpdate();

				// this.initSwiperHeight('.tabContent_' + this.TabCur);

			},
			// 触底的事件
			onReachBottom() {

				// 判断是否正在请求其它数据，如果是，则不发起额外的请求
				if (this.isloading) return
				// 让页码值自增 +1
				// this.queryObj.pagenum += 1
				// 重新获取列表数据
				let catId = this.getCatId();

				this.getGoodsData(this.TabCur, catId);
			},
			//根据索引（this.TabCur）获取catId
			getCatId() {
				let catId = '';

				for (var i = 0; i < this.goodsCategory.length; i++) {

					if (this.goodsCategory[i].value == this.TabCur) {
						catId = this.goodsCategory[i].value;
					}
				}

				return catId;
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
			// 右侧按钮的点击事件处理函数
			async clickAddToCart(e) {
				// console.log(e);
				let goodsInfo = {};
				let skuName = [];
				// 1. 判断是否点击了 加入购物车按钮（0：非规格选中；1：规格选中）
				if(e.currentTarget.dataset.goodstype==0){
					goodsInfo = e.currentTarget.dataset.goods;
					this.goodsNum = 1;
				}else{
					goodsInfo = {
						id:this.goodsId,
						name:this.goodsName,
						discountPrice:this.price,
						originalPrice:this.price,
						imgUrl:this.goodsImg,
					};
					skuName = this.goodsSpecification.split("_");
				}
				
				// 2. 组织一个商品的信息对象
				const goods = {
					goods_id: goodsInfo.id, // 商品的Id
					goods_name: goodsInfo.name, // 商品的名称
					goods_price: goodsInfo.isDiscount ? goodsInfo.discountPrice : goodsInfo.originalPrice, // 商品的价格
					goods_count: this.goodsNum, // 商品的数量
					goods_logo: goodsInfo.imgUrl, // 商品的图片
					goods_state: true // 商品的勾选状态
				}
				
				// 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
				this.addToCart(goods)
			
				//添加商品到购物车（服务器）
				let query = {
					goodsId: goodsInfo.id,
					number:this.goodsNum,
					skuName:skuName
				}
				let res = await uni.$http.post(uni.$url.addBySkuUrl,query);
				
				// 请求成功赋值给页面
				if (res.data.errno == 0) {
					let cartInfo = res.data.data
					let num = 0;
					this.getCartData();
					this.cartTotal = cartInfo.goodsPrice
					this.priceTotal = cartInfo.goodsPrice
					this.goodsNum = 1;
					
					//计算添加购物车后返回的商品个数
					for(var i=0;i<cartInfo.list.length;i++){
						for(var k=0;k<cartInfo.list[i].goods.length;k++){
							if(cartInfo.list[i].goods[k].goods_id==goodsInfo.id){
								num += cartInfo.list[i].goods[k].number;
							}
						}
					}
					
					//计算的商品个数赋值到商品列表
					for(var i=0;i<this.goodsData.length;i++){
						for(var k=0;k<this.goodsData[i].list.length;k++){
							if(this.goodsData[i].list[k].id==goodsInfo.id){
								this.goodsData[i].list[k].cartNum=num;
							}
						}
					}
				}
			
			},
			//根据ID获取商品规格
			async getSku(id) {
				
				// 发起请求
				// const res = await uni.$http.get(uni.$url.getSkuUrl, {id:id})
				
				// if (res.data.errno !== 0) return uni.$showMsg();
				
				// this.skuData = res.data.data.getSku;
				// this.price = this.skuData.price;
				
				// let Count = this.skuData['specList'].length;
				
				// //sku初始化checked为0
				// for (let i = 0; i < Count; i++) {
					
				// 	this.skuData['specList'][i]['checked'] = 0;
					
				// }
				// console.log(this.skuData);
				let skuDatas = {
					price:0,
					skuList:[],
					specList:[],
					name:"",
				};
				for(let i=0;i<this.goodsData.length;i++){
					for(let k=0;k<this.goodsData[i].list.length;k++){
						if(this.goodsData[i].list[k].id==id){
							if(this.goodsData[i].list[k].discountPrice!=null){
								skuDatas.price=this.goodsData[i].list[k].discountPrice;
							}else{
								skuDatas.price=this.goodsData[i].list[k].originalPrice;
							}
							
							skuDatas.skuList=this.goodsData[i].list[k].skuList;
							skuDatas.specList=this.goodsData[i].list[k].specList;
							skuDatas.name=this.goodsData[i].list[k].name; 
						}
					}
				}
				
				
				let Count = skuDatas.specList.length;
				
				//sku初始化checked为0
				for (let i = 0; i < Count; i++) {
					
					skuDatas.specList[i]['checked'] = 0;
					
				}
				this.skuData = skuDatas;
				this.chooseSku(0,0);
				
			},
			//选择规格
			chooseSku(index,index1) {
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
				
				//统计选中规格后的商品价格
				for(let i=0; i < this.skuData['skuList'].length; i++){
					let checkdPrice = 0
					if(this.skuData['skuList'][i]["title"]==this.goodsSpecification){
						checkdPrice=this.skuData.price+this.skuData['skuList'][i]["skuInfo"]["price"];
						this.numPrice=checkdPrice;
						this.price=checkdPrice;
						this.sumGoodsPrice(this.goodsNum);
					}
				}
			},
			sumGoodsPrice(num){
				this.price = num*this.numPrice;
			},
			//商品规格数量增加
			add(){
				this.goodsNum++;
				this.sumGoodsPrice(this.goodsNum);
				
			},
			//商品规格数量减少
			reduce(){
				if(this.goodsNum==1) return false;
				this.goodsNum--;
				this.sumGoodsPrice(this.goodsNum);
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
			//展示模态框
			showCustormModal(e) {
				// this.modalName = e.currentTarget.dataset.target;
				this.custormModalName = !this.custormModalName;
				//防止与弹出层同步滚动
				// this.isWrapperFixed = true;
				this.getCartData();
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.currentIndex = e.currentTarget.dataset.id;

				// this.getElementHeight('.tabContent_' + this.TabCur);

				// let catId = e.currentTarget.dataset.id;

				// this.goodsCategoryContent(this.TabCur, catId);
			},
			swiperChange(e) {
				// console.log(e);
				// let index = e.index;
				let index = e.detail.current;
				// let type = e.item.slot;
				this.TabCur = index;
				this.scrollLeft = (index - 1) * 60;
				this.currentIndex = index;
				//请相应的数据
				// this.getCurrentContent(type, index);

				let catId = this.getCatId();

				// let catId =e.currentTarget.dataset.id;

				this.goodsCategoryContent(this.TabCur, catId);


				// this.initSwiperHeight('.tabContent_' + this.TabCur);


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


	/*商家简介*/
	.shop-wrap {
		// padding-top: 140rpx;
		.cover-wrap {
			width: 100%;
			height: 330rpx;
			.cover {
				display: inline-block;
				width: 100%;
				height: 100%;
			}
		}
		.shop-intro {
			width: 100%;
			margin: -130rpx 20rpx 44rpx 60rpx;
			.avatar {
				display: inline-block;
				width: 80rpx;
				height: 80rpx;
				margin-right: 25rpx;
				
				vertical-align: middle;
				image{
					border-radius: 50%;
				}
			}
			.name {
				position: relative;
				font-size: 34rpx;
				font-weight: bold;
				color: #FFFFFF;
				text-shadow: 0px 0px 5px rgba(125, 14, 0, 0.3);
				z-index: 111;
				vertical-align: middle;
			}
		}
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
			// width: 320rpx;
			// height: 420rpx;
			// padding: 20rpx;
			// margin: 18rpx;
			width: 45%;
			height: 420rpx;
			padding: 3%;
			margin: 2%;
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
					.sku-num{
						display: inline-block;
						position: absolute;
						bottom: 30rpx;
						width: 15px;
						height: 15px;
						line-height: 15px;
						background: red;
						color: #FFFFFF;
						border-radius: 15px;
						z-index: 11;
						text-align: center;
						left: -4px;
					}
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
