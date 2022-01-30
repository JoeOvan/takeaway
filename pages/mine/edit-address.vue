<template>
	<view class="wrapper">
		<view class="nav-fixed isfixed">
			<cu-custom bgColor="text-white" :isBack="true">
				<block slot="backText"><text class="logo-tips">编辑收货地址</text></block>
			</cu-custom>
		</view>

		<view class="content" :style="{'top':tabFix}">
			<view class="address-form-wrap">

				<form @submit="saveAddress" class="address-form">
					<view class="address-form-item">
						<text class="label">收货地址</text>
						<view class="form-item-wrap">

							<picker @columnchange="bindPickerChange" @change="confirmAddress" mode="multiSelector" :value="index" :range="array">
								<view class="uni-input">{{addressTxt}}</view>
							</picker>

							<image class="icon-arrows" src="../../static/icon-arrows.png"></image>
						</view>
					</view>
					<view class="address-form-item">
						<text class="label">门牌号</text>
						<view class="form-item-wrap">
							<input name="detailInfo" type="text" placeholder-style="color:#888888"
								class="address-input" placeholder="详细地址，例1层101室" :value="addressInfo.detailInfo">
						</view>
					</view>
					<view class="address-form-item">
						<text class="label">联系人</text>
						<view class="form-item-wrap">
							<input name="username" type="text" placeholder-style="color:#888888" class="address-input"
								placeholder="请填写收货人姓名" :value="addressInfo.userName">
							<view class="sex" style="display: none;">
								<label for="">
									<radio class='red radio' value="C"></radio>先生
								</label>
								<label for="">
									<radio class='red radio' value="C"></radio>小姐
								</label>
							</view>
						</view>
					</view>
					<view class="address-form-item">
						<text class="label">手机号</text>
						<view class="form-item-wrap">
							<input name="telNumber" type="text" placeholder-style="color:#888888"
								class="address-input" placeholder="请填写收货人手机号码" :value="addressInfo.telNumber">
						</view>
					</view>
					<view class="form-handle-wrap">
						<button formType="submit" class="btn-address-submit" @submit="saveAddress">保存地址</button>
						<button class="btn-address-delete" @click="delAddress">删除地址</button>
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


				//校区选择
				array: [
					[],
					[],
					[]
				],
				// index: [1, 1, 0],
				content: {
					id: 0,
					username: "",
					campus: "",
					dormitory: "",
					building: "",
					detailInfo: "",
					telNumber: 0,
					is_default: 0,
				},
				arrays: [[],[],[]],
				first:0,
				second:0,
				third:0,
				addressTxt:"",
				changeAddressTxt:"",
				test:["文光校区","北区","2号楼"],
				//地址信息
				addressInfo: null,
				addressId: '',
				index:[],
				isChange:false
			}
		},
		onLoad(options) {
			var _this = this
			uni.getSystemInfo({
			    success: function (res) {
					_this.contentHeihgt = res.windowHeight - _this.CustomBar;
			    }
			});
			
			this.addressId = options.id;
			this.editAddress(this.addressId);

			this.getAreaAddress();

		},
		methods: {
			confirmAddress(){
				if(this.isChange == true){
					this.addressTxt = this.changeAddressTxt;
					this.isChange=false;
				}
			},
			//根据ID删除地址
			delAddress(e) {
				let that=this;
				uni.showModal({
				    title: '提示',
				    content: '确定删除该地址吗？',
				    success: function (res) {
				        if (res.confirm) {
				            that.delAddressById();
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			async delAddressById(){
				let id = this.addressId;
				
				// 发起请求
				const res = await uni.$http.delete(uni.$url.deleteAddress, {id});
				
				if (res.data.errno !== 0) return uni.$showMsg();
				
				uni.$showMsg("删除成功！");
				
				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
			},
			//获取联系方式详情
			async editAddress(id) {
				// 发起请求
				const res = await uni.$http.get(uni.$url.editAddress,{id:id});

				if (res.data.errno !== 0) return uni.$showMsg();

				this.addressInfo = res.data.data.detail;

				//1.拿到校区的值
				// this.addressTxt = this.addressInfo.campus +":"+ this.addressInfo.dormitory +":"+ this.addressInfo.building;

			},
			//获取校区地址
			async getAreaAddress() {
				// 发起请求
				const res = await uni.$http.get(uni.$url.getAreaAddress);

				if (res.data.errno !== 0) return uni.$showMsg();

				this.arrays = res.data.data.address;

				//组装默认数组
				for (let i = 0, len = this.arrays.length; i < len; i++) {
					this.array[0].push(this.arrays[i]["label"]);
					if(this.addressInfo.campus==this.arrays[i]["value"]){
						this.index.push(i);
						for (let k = 0, len = this.arrays[i]["children"].length; k < len; k++) {
							//判断是否有2级，有则插入数据
							if (this.arrays[i]["children"].length > 0) {
								
								if(this.addressInfo.dormitory==this.arrays[i]["children"][k]["value"]){
										this.index.push(k);
										//默认3级数据为2级数据的第一条
										for (let t = 0, len = this.arrays[i]["children"][k]["childless"].length; t < len; t++) {
											
											if(this.addressInfo.building==this.arrays[i]["children"][k]["childless"][t]["value"]){
												this.index.push(t);
											}else{
												this.index.push(0);
											}
											this.array[2].push(this.arrays[i]["children"][k]["childless"][t].label);
										}
								}
								
								this.array[1].push(this.arrays[i]["children"][k].label);
							}else{
								this.index.push(0);
								this.index.push(0);
							}
						}
					}
				}
				
				//1.拿到校区的值
				this.addressTxt=this.arrays[this.index[0]]["label"]+":"+this.arrays[this.index[0]]["children"][this.index[1]].label+":"+this.arrays[this.index[0]]["children"][this.index[1]]["childless"][this.index[2]].label;

			},
			async saveAddress(e){
				//获取表单数据
				let data = e.detail.value;

				//正则验证手机号码
				let reg_mobile = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
				// debugger

				let valueList = {
					'detailInfo':'门牌号',
					'username':'联系人',
					'telNumber':'手机号',
				}

				//判断输入值是否为空和验证手机号码
				for (const key in valueList) {
				  if (data[key] == null || data[key] == "") {
					wx.showToast({
					  title: valueList[key]+'不能为空',
					  icon: 'none',
					  duration: 4000
					});
					return;
				  } else if (key == "telNumber") {
						if(!reg_mobile.test(data[key])) {
						  wx.showToast({
							title: '请正确填写您的手机号码',
							icon: 'none',
							duration: 4000
						  });
						  return;
						}
					}
				}
				
				let arr = this.arrays[this.first];
				if(arr["children"].length>0){
					this.content.dormitory = arr["children"][this.second].value+"_"+arr["children"][this.second].label;
					this.content.building = arr["children"][this.second]["childless"][this.third].value+"_"+arr["children"][this.second]["childless"][this.third].label;
				}

				//根据组件返回的键值组装字符串，且判断后端返回的数据是否存在
				let query = {
					id: this.addressId,
					username: data['username'],
					campus:arr["value"]+"_"+arr["label"],
					dormitory:this.content.dormitory,
					building:this.content.building,
					detailInfo: data['detailInfo'],
					telNumber: data['telNumber'],
					is_default:0
				}

				//发起请求
				const res = await uni.$http.post(uni.$url.saveAddress, query);

				if (res.data.errno !== 0) return uni.$showMsg();

				uni.$showMsg("保存成功！");

				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});

			},
			bindPickerChange: function(e) {
				this.isChange = true;
				//处理1、2级数据
				if(e.detail.column==0){
					this.first = e.detail.value;
					
					//复位
					this.second = 0;
					this.third = 0;

					this.array[1]=[];
					this.array[2]=[];
					for (let i = 0, len = this.arrays.length; i < len; i++) {
						//判断选中的1级数据
						if (e.detail.value == i) {

							for (let k = 0, len = this.arrays[i]["children"].length; k < len; k++) {
								//判断是否有2级，有则插入数据
								if (this.arrays[i]["children"].length > 0) {

									this.array[1].push(this.arrays[i]["children"][k].label);

									if(k==0){
										//默认3级数据为2级数据的第一条
										for (let t = 0, len = this.arrays[i]["children"][k]["childless"].length; t < len; t++) {

											this.array[2].push(this.arrays[i]["children"][k]["childless"][t].label);

										}
									}

								}
							}
						}
					}
				}

				//处理2级数据
				if(e.detail.column==1){
					this.second=e.detail.value;

					//复位
					this.third = 0;
					this.array[2]=[];
					this.index[2]=0;
					if (this.arrays[this.first]["children"].length > 0) {

						for (let t = 0, len = this.arrays[this.first]["children"][this.second]["childless"].length; t < len; t++) {

							this.array[2].push(this.arrays[this.first]["children"][this.second]["childless"][t].label);
						}
					}
				}

				//处理3级数据
				if(e.detail.column==2) this.third=e.detail.value;

				//根据组件返回的键值组装字符串，且判断后端返回的数据是否存在
				if(this.arrays[this.first]["children"].length == 0){

					this.changeAddressTxt=this.arrays[this.first]["label"];
				}else if(this.arrays[this.first]["children"][this.second]["childless"].length == 0){

					this.changeAddressTxt=this.arrays[this.first]["label"]+":"+this.arrays[this.first]["children"][this.second].label;
				}else if(this.arrays[this.first]["children"][this.second]["childless"].length > 0){

					this.changeAddressTxt=this.arrays[this.first]["label"]+":"+this.arrays[this.first]["children"][this.second].label+":"+this.arrays[this.first]["children"][this.second]["childless"][this.third].label;
				}

			},
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
			padding: 40rpx 5%;
			margin: 0 2%;
			border-bottom: 1rpx solid #F1F1F1;
			align-items: center;
			&:nth-last-child(1) {
				border: none;
			}
			.label {
				display: inline-block;
				flex: 1;
			}
			.form-item-wrap {
				position: relative;
				flex: 4;
				.address-input {
					display: inline-block;
					vertical-align: middle;
				}
				.icon-location {
					display: inline-block;
					width: 17rpx;
					height: 21rpx;
					vertical-align: top;
					margin-top: 15rpx;
				}
				.icon-arrows {
					position: absolute;
					right: 0;
					top: 15rpx;
					display: inline-block;
					width: 13rpx;
					height: 25rpx;
				}
				.radio {
					display: inline-block;
					transform:scale(0.7);
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
			.btn-address-delete {
				width: 100%;
				height: 68rpx;
				line-height: 68rpx;
				margin-top: 30rpx;
				font-size: 30rpx;
				color: #000;
				text-align: center;
				background: #FFFFFF;
				border: 1rpx solid #BFBFBF;
				border-radius: 10rpx;
			}
		}
	}
</style>
