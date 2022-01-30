<template>
	<view style="margin-top: 100rpx;">
<!-- 		<picker name="create_id" mode="multiSelector" @change="bindMultiPickerChange" @columnchange="bindGradeChange"
			::value="multiIndex" :range="multiArray">
			<view class='pick-content'>
				<text>{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}</text>
			</view>
		</picker> -->
		
		
		<view class="input" type="text" placeholder="请选择职业类别">
			<picker class="pickerList" mode="multiSelector" 
			:range="newCategotyDataList" 
			:value="multiIndex" 
			@change="bindPickerChange" 
			@columnchange="pickerColumnchange">
				<!-- <view>{{newCategotyDataList[0]}}--{{newCategotyDataList[0].child[0]}}--{{newCategotyDataList[0].child[0].child[0]}}</view> -->
				<text>{{newCategotyDataList[0][multiIndex[0]]}}，{{newCategotyDataList[1][multiIndex[1]]}}，{{newCategotyDataList[2][multiIndex[2]]}}</text>
				<view class="">{{select}}</view>
			</picker>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {},
				multiArray: [
					['一般行业', '农牧业', '渔业'],
					['机关团体公司行号'],
					['内勤人员（不参与生产作业）']
				],
				// multiIndex: [0, 0, 0],
				arrays: [{
						name: "一般行业",
						value: "1",
						child: [{
								name: "1机关团体公司行号",
								value: "4",
								child: [{
									value: "6",
									name: "111内勤人员（不参与生产作业）",
									flag: '1'
								},{
									value: "6",
									name: "122内勤人员（不参与生产作业）",
									flag: '1'
								},{
									value: "6",
									name: "133内勤人员（不参与生产作业）",
									flag: '1'
								}]
							},{
								name: "2机关团体公司行号1",
								value: "4",
								child: [{
									value: "6",
									name: "211内勤人员（不参与生产作业）",
									flag: '1'
								},{
									value: "6",
									name: "222内勤人员（不参与生产作业）",
									flag: '1'
								},{
									value: "6",
									name: "233内勤人员（不参与生产作业）",
									flag: '1'
								}]
							},{
								name: "03机关团体公司行号2",
								value: "4",
								child: [{
									value: "6",
									name: "311内勤人员（不参与生产作业）",
									flag: '1'
								},{
									value: "10",
									name: "322内勤人员2",
									flag: '1'
								},{
									value: "11",
									name: "333内勤人员3",
									flag: '1'
								}]
							}
						]
					},
					{
						name: "农牧业",
						value: "2",
						child: [{
								name: "农业",
								value: "5",
								child: [{
									name: "农场经营者/负责人（不亲自作业）",
									value: "7",
									flag: "拒保"
								}]
							},{
								name: "畜牧业",
								value: "8",
								child: [{
									name: "畜牧场经营者（不亲自作业）",
									value: "10",
									flag: "2"
								},{
									name: "畜牧场经营者11",
									value: "11",
									flag: "2"
								}]
							}
						]
					},
					{
						name: "渔业",
						value: "3",
						child: []
					}
				],
			
				multiIndex:[0,0,0],
				newCategotyDataList:[[],[],[]],
				categoryArr:[],
				select:"请选择职业类别",
				selectObj:{}
			}
		},
		onLoad() {
			
			this.initMultiPicker();
			
		},
		methods: {
			initMultiPicker() {
				
				this.categoryArr = this.arrays;
				// debugger
				if(this.categoryArr.length > 0) {
					
					for(let i=0; i<this.categoryArr.length; i++){
						this.newCategotyDataList[0].push(this.categoryArr[i].name);
					}
				}
				if(this.categoryArr[0].child.length > 0) {
					
					for(let i=0; i<this.categoryArr[0].child.length; i++){
						this.newCategotyDataList[1].push(this.categoryArr[0].child[i].name);
					}
				}
				
				if(this.categoryArr[0].child[0].child.length > 0) {
					
					for(let i=0; i<this.categoryArr[0].child[0].child.length; i++){
						this.newCategotyDataList[2].push(this.categoryArr[0].child[0].child[i].name);
					}
				}
				
				// this.multiIndex = [0,0,0];
				
				// 有时候你会碰到数据已经更新了但是组件还是没有刷新，这个时候需要调用$forceUpdate()强制刷新
				this.$forceUpdate();


				// this.multiArray = [[],[],[]];
				
				//组装默认数组
				// for (let i = 0, len = this.arrays.length; i < len; i++) {
				// 	this.multiArray[0].push(this.arrays[i]["label"]);

				// 	if (i == 0) {
				// 		for (let k = 0, len = this.arrays[i]["children"].length; k < len; k++) {
				// 			//判断是否有2级，有则插入数据
				// 			if (this.arrays[0]["children"].length > 0) {
				// 				this.multiArray[1].push(this.arrays[i]["children"][k].label);
				// 				//默认3级数据为2级数据的第一条
				// 				if(k==0){
				// 					for (let t = 0, len = this.arrays[i]["children"][k]["children"].length; t < len; t++) {

				// 						this.multiArray[2].push(this.arrays[i]["children"][k]["children"][t].label);

				// 					}
				// 				}

				// 			}
				// 		}
				// 	}
				// }

				// console.log(this.multiArray);
				
			},
			
			pickerColumnchange(e) {
				console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
				// debugger
				// 第几列滑动
				// console.log(e.detail.column);
				// 第几列滑动的下标
				// console.log(e.detail.value)
				// 第一列滑动
				if (e.detail.column === 0) {
					this.multiIndex[0] = e.detail.value
					// console.log('第一列滑动');
					// this.newCategotyDataList[1] = [];
					// console.log(this.categoryArr[this.multiIndex[0]]);
					if(this.categoryArr[this.multiIndex[0]].child.length > 0) {
						
						this.newCategotyDataList[1] = this.categoryArr[this.multiIndex[0]].child.map((item, index) => {
							// console.log(item.name)
							return item.name
						});
						
						
						this.multiIndex[1] = 0;
						if(this.categoryArr[this.multiIndex[0]].child[this.multiIndex[1]].child.length > 0) {
							
							this.newCategotyDataList[2] = this.categoryArr[this.multiIndex[0]].child[this.multiIndex[1]].child.map((item, index) => {
								return item.name
							})
						
						} else if (this.categoryArr[this.multiIndex[0]].child[this.multiIndex[1]].child.length == 0) {
							
							this.newCategotyDataList[2] = this.categoryArr[this.multiIndex[0]].child.map((item, index) => {
								return item.name
							});
							
						}
						
					} else if (this.categoryArr[this.multiIndex[0]].child.length === 0) {  // console.log(this.multiIndex)

						this.newCategotyDataList[1] = this.categoryArr[this.multiIndex[0]].child.map((item, index) => {
							return item.name
						});
						
						
						this.newCategotyDataList[2] = this.categoryArr[this.multiIndex[0]].child.map((item, index) => {
							return item.name
						});
							
					}
					
					// 第一列滑动  第二列 和第三列 都变为第一个
					this.multiIndex.splice(1, 1, 0)
					this.multiIndex.splice(2, 1, 0)
				}
				// 第二列滑动
				if (e.detail.column === 1) {
					this.multiIndex[1] = e.detail.value
					this.newCategotyDataList[2] = this.categoryArr[this.multiIndex[0]].child[this.multiIndex[1]].child.map((item, index) => {
						// console.log(item.name)
						return item.name
					})
					// 第二列 滑动 第三列 变成第一个
					this.multiIndex.splice(2, 1, 0)
				}
				// 第三列滑动
				if (e.detail.column === 2) {
					this.multiIndex[2] = e.detail.value
				}
			},
			bindPickerChange(e) {
				// debugger
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
			
			bindMultiPickerChange: function(e) {
				this.multiIndex = e.detail.value;
			},
			bindGradeChange(e) {

				this.multiIndex[e.detail.column] = e.detail.value
				if (e.detail.column == 0) {
					var grade = this.multiArray[0][this.multiIndex[0]];

					this.multiArray[1] = this.multiArray[grade.id]
					this.multiIndex[1] = 0;
					var classes = this.multiArray[1][0];
					let arr = this.multiArray[classes.id] ? this.multiArray[classes.id] : [];
					this.multiArray[2] = arr
					this.multiIndex[2] = 0
				} else if (e.detail.column == 1) {
					var classes = this.multiArray[1][this.multiIndex[1]];
					let arr = this.multiArray[classes.id] ? this.multiArray[classes.id] : [];
					this.multiArray[2] = arr
					this.multiIndex[2] = 0
				}

			},
		}
	}
</script>

<style>

</style>
