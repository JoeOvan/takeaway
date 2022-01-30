<template>
	<view class="page" style="margin-top: 100rpx;">
		<view class="uni-title">多列选择器</view>
		<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray" style="margin-bottom: 50rpx;">
			<view class="uni-input">{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}</view>
		</picker>
	</view>
</template>
<script>
export default {
	data() {
		return {
			// multiArray 为初始化数据，不管以后用户是否已有数据，再进行初始化，都以该初始化数据为准，这样逻辑实现才会更清晰
			// 默认让服务端提供 第1列的数据，然后根据第1列数据的第1条数据，再次请求第2列、第3列的数据列表
			multiArray: [
				['亚洲', '欧洲'],
				['中国', '日本'],
				['北京', '上海', '广州']
			],
			multiIndex: [0, 0, 0]
		}
	},
	onLoad() {
		this.initMultiPickerData();
	},
	methods: {
		async initMultiPickerData() {
			
			// 发起请求
			const res = await uni.$http.get(uni.$url.getAreaAddress);
			
			console.log(res);
			
			if (res.data.errno !== 0) return uni.$showMsg();
			
			// this.array = res.data.address;
			
			this.arrays = res.data.data.address;
			
			console.log(this.arrays);
			
			
		},
		bindMultiPickerColumnChange: function(e) {
			console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
			this.multiIndex[e.detail.column] = e.detail.value;
			let firstIndex = this.multiIndex[0];
			if (e.detail.column == 0) {	//拖动第1列
				if (firstIndex == 0) {	// 第1列如果是“亚洲”，后续的数据初始化
					// 选中第1列的第1条数据，则需将第2列以及第3列数据进行初始化，一般都是通过请求服务端数据，这里写静态数据仅供参考
					this.multiArray[1] = ['中国', '日本']
					this.multiArray[2] = ['北京', '上海', '广州']
				}else if (firstIndex == 1) {	// 第1列如果是“欧洲”，后续的数据初始化
					// 选中第1列的第2条数据，则需将第2列以及第3列数据进行初始化，一般都是通过请求服务端数据，这里写静态数据仅供参考
					this.multiArray[1] = ['英国', '法国']
					this.multiArray[2] = ['伦敦', '曼彻斯特']
				}
				this.multiIndex.splice(1, 1, 0);	//将multiIndex数据中的第2列初始化
				this.multiIndex.splice(2, 1, 0);	//将multiIndex数据中第3列初始化
			}else if (e.detail.column == 1){	//拖动第2列
				let secondIndex = this.multiIndex[1]
				if (firstIndex == 0) {	// 第1列如果是“亚洲”，后续的数据初始化
					if (secondIndex == 0) {	// 第2列是“中国”，后续的数据初始化
						this.multiArray[2] = ['北京', '上海', '广州']
					}else if (secondIndex == 1) {	// 第2列是“日本”，后续的数据初始化
						this.multiArray[2] = ['东京','北海道']
					}
				}else if (firstIndex == 1) {
					if (secondIndex == 0) {
						this.multiArray[2] = ['伦敦', '曼彻斯特']
					}else if (secondIndex == 1) {
						this.multiArray[2] = ['巴黎', '马赛']
					}
				}
				this.multiIndex.splice(2, 1, 0)
			}
			// 有时候你会碰到数据已经更新了但是组件还是没有刷新，这个时候需要调用$forceUpdate()强制刷新
			this.$forceUpdate();
		},
		    pickerColumnchange(e) {
		        // 第几列滑动
		        // console.log(e.detail.column);
		        // 第几列滑动的下标
		        // console.log(e.detail.value)
		        // 第一列滑动
		        if (e.detail.column === 0) {
		            this.multiIndex[0] = e.detail.value
		            // console.log('第一列滑动');
		            // this.newCategotyDataList[1] = [];
		            this.newCategotyDataList[1] = this.categoryArr[this.multiIndex[0]].child.map((item, index) => {
		                // console.log(item)
		                return item.name
		            })
		            // console.log(this.multiIndex)
		            if (this.categoryArr[this.multiIndex[0]].child.length === 1) {
		                this.newCategotyDataList[2] = this.categoryArr[this.multiIndex[0]].child[0].child.map((item, index) => {
		                    // console.log(item)
		                    return item
		                })
		            } else {
		                this.newCategotyDataList[2] = this.categoryArr[this.multiIndex[0]].child[this.multiIndex[1]].child.map((item, index) => {
		                    // console.log(item)
		                    return item
		                })
		            }
		            // 第一列滑动  第二列 和第三列 都变为第一个
		            this.multiIndex.splice(1, 1, 0)
		            this.multiIndex.splice(2, 1, 0)
		        }
		        // 第二列滑动
		        if (e.detail.column === 1) {
		            this.multiIndex[1] = e.detail.value
		            // console.log('第二列滑动');
		            // console.log(this.multiIndex)
		            this.newCategotyDataList[2] = this.categoryArr[this.multiIndex[0]].child[this.multiIndex[1]].child.map((item, index) => {
		                // console.log(item)
		                return item
		            })
		            // 第二列 滑动 第三列 变成第一个
		            this.multiIndex.splice(2, 1, 0)
		        }
		        // 第三列滑动
		        if (e.detail.column === 2) {
		            this.multiIndex[2] = e.detail.value
		            // console.log('第三列滑动')
		            // console.log(this.multiIndex)
		        }
		    },
		    bindPickerChange(e) {
		        this.multiIndex = e.detail.value;
		        // 数组内的下标
		        // console.log(this.multiIndex);
		        // 获取一级类目
		        // console.log(this.newCategotyDataList[0][this.multiIndex[0]])
		        // 获取二级类目
		        // console.log(this.newCategotyDataList[1][this.multiIndex[1]])
		        // 获取三级类目
		        // console.log(this.newCategotyDataList[2][this.multiIndex[2]])
		        this.select = `${this.newCategotyDataList[2][this.multiIndex[2]].name}`;
		        this.selectObj = this.newCategotyDataList[2][this.multiIndex[2]];
		    },
	}
}
</script>