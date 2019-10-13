<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none; padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入酒店名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getQueryUsers">查询</el-button>
				</el-form-item>
				<el-button-group style="float: right">
					<el-button type="primary" @click="handleAdd" icon="plus"></el-button>
					<el-button type="primary" icon="delete" @click="batchRemove" :disabled="this.sels.length===0"></el-button>
				</el-button-group>
				<!--<el-form-item>-->
					<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
				<!--</el-form-item>-->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="序号"  width="80">
			</el-table-column>
			<el-table-column prop="title" label="酒店名称" min-width="140" >
			</el-table-column>
			<el-table-column prop="categoryName" label="类别" width="120" :formatter="getcategoryname" >
			</el-table-column>
			<el-table-column prop="score" label="评分" width="120" >
			</el-table-column>
			<el-table-column prop="trustId" label="诚信商家" width="120"  :formatter="getTrust">
			</el-table-column>
			<el-table-column prop="state" label="状态" width="120" >
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status"  on-color="#ff4949" off-color="#13ce66" on-value="0" off-value="1" on-text="禁用" off-text="启用"  @change="editEnabled(scope.row.id,scope.row.status)">
					</el-switch>
					<!--<el-switch v-model="scope.row.isShow"  active-color="#13ce66" inactive-color="#ff4949" active-value="0" inactive-value="100"  active-text="启用" inactive-text="禁用">-->
					<!--</el-switch>-->
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150" >
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none;">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination @size-change ="handleSizeChange"  @current-change="handleCurrentChange" :current-page.sync="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" style="float: right">
			</el-pagination>
			<!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">-->
		<!--</el-pagination>-->
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑酒店" v-model="editFormVisible" :close-on-click-modal="false" width="90%">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="酒店名称：" prop="title">
							<el-input v-model="editForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="诚信商家：" >
							<el-select v-model="editForm.trustId" placeholder="请选择是否是诚信商家" @change="editChange">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="简介：">
							<el-input type="textarea" v-model="editForm.summary"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="详细内容：">
							<el-input type="textarea" v-model="editForm.content"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="类别：" prop="dCategory">
							<el-select v-model="editForm.dCategory" placeholder="请选择类别" @change="dCategoryChange">
								<el-option v-for="item in categoryForm" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="地点：">
							<el-input v-model="editForm.addrInfo" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="所属区域：" >
							<el-select v-model="editForm.areaCode" placeholder="请选择所属区域" @change="areaChange">
								<el-option v-for="item in areaForm" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="固定电话：">
							<el-input v-model="editForm.telephone" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="经度：">
							<el-input v-model="editForm.longitude" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="纬度：">
							<el-input v-model="editForm.latitude" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="酒店星级：" >
							<el-input v-model="editForm.dStar" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="官方评分：" >
							<el-input v-model="editForm.score" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="特色：">
							<el-input type="textarea" v-model="editForm.feature"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增酒店" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="酒店名称：" prop="title">
							<el-input v-model="addForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="诚信商家：" >
							<el-select v-model="addForm.trustId" placeholder="请选择是否是诚信商家" @change="addChange">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="简介：">
							<el-input type="textarea" v-model="addForm.summary"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="详细内容：">
							<el-input type="textarea" v-model="addForm.content"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="addForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="类别：" prop="dCategory">
							<el-select v-model="addForm.dCategory" placeholder="请选择酒店类别" @change="dCategoryChange">
								<el-option v-for="item in categoryFormAdd" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="地点：">
							<el-input v-model="addForm.addrInfo" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="addForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="所属区域：" >
							<el-select v-model="addForm.areaCode" placeholder="请选择酒店区域" @change="areaChange">
								<el-option v-for="item in areaFormAdd" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="固定电话：">
							<el-input v-model="addForm.telephone" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="经度：">
							<el-input v-model="addForm.longitude" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="纬度：">
							<el-input v-model="addForm.latitude" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="酒店星级：" >
							<el-input v-model="addForm.dStar" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="官方评分：" >
							<el-input v-model="addForm.score" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="特色：">
							<el-input type="textarea" v-model="addForm.feature"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage2, removeUser2, batchRemoveUser, editUser2, editAble2 ,addUser2,gethandleEdit2,gethandleAdd2,gethandleTicket,removeTicket,editdetailForm} from '../../api/api';

	export default {
		data() {
			return {
				publicParams: {
                    secretKey :'',
                    secretId:'',
                    token:'',
                    sign:''
                },
				filters: {
					name: ''
				},
                isShow:true,
				users: [],
				total: 0,
				page: 1,
                pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入酒店名称', trigger: 'blur' }
					],
					dCategory: [
						{ required: true, message: '请选择酒店类别', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					title: '',
					summary: '',
                    content: '',
                    dCategory: '',
                    categoryName: '',
                    dGrade: '',
                    areaCode:'',
					
					longitude: '',
                    latitude: '',
                    addrInfo: '',
                    mobile: '',
                    telephone: '',
					ticketInfo:'',
					
					openTime: '',
                    playTime: '',
                    trafficeInfo: '',
                    capacity: '',
                    officialScore: '',
					externalUrl: '',
					
					feature: '',
                    commentLabel: '',
                    isEnabled: ''
				},
				// 编辑页面类别数据
				categoryForm: [],
				areaForm:[],
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入酒店名称', trigger: 'blur' }
					],
					dCategory: [
						{ required: true, message: '请选择酒店类别', trigger: 'blur' }
					]
				},
				//新增界面数据
				categoryFormAdd: [],
				areaFormAdd:[],
				addForm: {
					title: '',
					summary: '',
                    content: '',
                    dCategory: '',
                    categoryName: '',
                    dGrade: '',
                    areaCode:'',
					
					longitude: '',
                    latitude: '',
                    addrInfo: '',
                    mobile: '',
                    telephone: '',
					ticketInfo:'',
					
					openTime: '',
                    playTime: '',
                    trafficeInfo: '',
                    capacity: '',
                    officialScore: '',
					externalUrl: '',
					
					feature: '',
                    commentLabel: '',
                    isEnabled: ''
				},
				/*$$$$$$$$$$$$$%%%%%%%%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$$$$$$$$*/
				ticketVisible: false,//门票界面是否显示
				chicketLoading: false,
				ticketForm: [
					{
						id: '',
						scenicId:'',
						title: '',
						originalPrice: '',
						currentPrice: '',
						discountPrice: '',
						isEntrance: '',
						isCoupon: '',
						isSupportQr: '',
						updateTime: '',
						externalUrl: ''
					},
					{
						id: '',
						scenicId:'',
						title: '',
						originalPrice: '',
						currentPrice: '',
						discountPrice: '',
						isEntrance: '',
						isCoupon: '',
						isSupportQr: '',
						updateTime: '',
						externalUrl: ''
					}
				],
				// 门票详情数据
				tdetailForm: {
					id: '',
					scenicId:'',
					title: '',
					originalPrice: '',
					currentPrice: '',
					discountPrice: '',
					isEntrance: '',
					isCoupon: '',
					isSupportQr: '',
					updateTime: '',
					externalUrl: ''
				},
				tdetailFormRules: {
					title: [
						{ required: true, message: '请输入门票名称', trigger: 'blur' }
					],
					isCoupon: [
						{ required: true, message: '请选择是否是联票', trigger: 'blur' }
					],
					isEntrance: [
						{ required: true, message: '请选择是否是大门票', trigger: 'blur' }
					],
					isSupportQr: [
						{ required: true, message: '请选择是否支持扫码', trigger: 'blur' }
					]
				},
			}
		},
		methods: {
			//类别、诚信商家、置顶、热点、状态、门票显示转换
			getcategoryname: function (row, column) {
				return row.categoryName ? row.categoryName : '无';
			},
            getTrust: function (row, column) {
                return row.trustId > 0 ? '是' : '否';
            },
            editEnabled: function (id, status) {
				console.log(id,status)
				var _this = this;				
				let para = {
					id: id,
					isEnabled: status,
					action: 'edit'
				};
				// console.log(para);
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				editAble2(para,publicParams).then((res) => {
					console.log(res);
					if(res.code == 1000) {
						//NProgress.done();
						this.$message({
							message: '修改成功',
							type: 'success'
						});
					}else {
						this.$message({
							message: '修改失败:'+res.msg,
							type: 'error'
						});
					}
					
				});
			},
			formatter1: function (row) {
				return row.originalPrice ? row.originalPrice : '无';
			},
			formatter2: function (row) {
				return row.currentPrice ? row.currentPrice : '无';
			},
			formatter3: function (row) {
				return row.discountPrice ? row.discountPrice : '无';
			},
			formatter4: function (row) {
				return row.updateTime ? row.updateTime : '无';
			},
			formatter5: function (row) {
				return row.isEntrance == 1 ? '是': row.isEntrance== 2 ? '否': '未知';
			},
			formatter6: function (row) {
				return row.isCoupon == 1 ? '是': row.isCoupon == 2 ?'否': '未知';
			},
			formatter7: function (row) {
				return row.isSupportQr == 1 ? '支持' : row.isSupportQr == 2 ? '不支持': '未知';
			},
            formatOff8: function (row, column) {
                return row.ticket ? '启用' : '禁用';
			},
			editChange: function (val) {
				this.editForm.trustId = val;
			},
			addChange: function (val) {
				this.addForm.trustId = val;
			},
			getQueryUsers(){
				this.page = 1;
				this.getUsers();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
            handleSizeChange(val) {
				this.pageSize = val;
				this.page = 1;
                this.getUsers();
			},
			dCategoryChange(val){
				this.editForm.dCategory = val;
			},
			areaChange(val){
				this.editForm.areaCode = val;
			},
			tciketChange1(val){
				// 是否联票
				this.tdetailForm.isCoupon = val;
			},
			tciketChange2(val){
				// 是否大门票
				this.tdetailForm.isEntrance = val;
			},
			tciketChange3(val){
				// 是否支持扫码
				this.tdetailForm.isSupportQr = val;
			},
			//获取用户列表
			getUsers() {
				var _this = this;
				let para = {
					page: this.page,
					rows: this.pageSize,
					title: this.filters.name
				};
				//console.log(para)
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				this.listLoading = true;
				// //NProgress.start();
				getUserListPage2(para,publicParams).then((res) => {
					//console.log(res);
					if(res.code == 1000){
						if(res !== null){
							//console.log(res.result.list)
							_this.total = res.result.total;
							_this.users = res.result.list;
							_this.listLoading = false;
						}
					}else {
						this.$message({
							message: '没有数据:'+res.msg,
							type: 'error'
						});
						_this.listLoading = false;
						//console.log(res.code);
					}
                    // NProgress.done();
				}).catch((error) => {
					console.log(error);
                });
			},
			//删除景区
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					console.log(para)
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
					removeUser2(para,publicParams).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						console.log(res)
						if(res.code == 1000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getUsers();
						}else {
							this.$message({
								message: '删除失败:'+res.msg,
								type: 'error'
							});
						}
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (id) {
				this.editFormVisible = true;
				var _this = this;
				let para = {
					id: id
				};
				console.log(para)
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				gethandleEdit2(para,publicParams).then((res) => {
					console.log(res)
					if(res.code == 1000){
						if(res.result !== null){
							//console.log(res);
							_this.editForm = res.result.data;
							_this.categoryForm = res.result.categoryList;
							_this.areaForm = res.result.areaList;
						}
					}else {
						this.$message({
							message: '数据获取失败:'+res.msg,
							type: 'error'
						});
					}
                    // NProgress.done();
				}).catch((error) => {
					console.log(error);
                });
				
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				var _this = this;
				let para = {};
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				gethandleAdd2(para,publicParams).then((res) => {
					//console.log(res)
					if(res.code == 1000){
						//console.log(res.result.areaList);
						_this.addForm = {}
						_this.categoryFormAdd = res.result.categoryList;
						_this.areaFormAdd = res.result.areaList;
					}else {
						this.$message({
							message: '数据获取失败:'+res.msg,
							type: 'error'
						});
					}
                    // NProgress.done();
				}).catch((error) => {
					console.log(error);
                });
			},
			
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							var actions = {action:'edit'};
							let para = Object.assign({}, this.editForm , actions);
							console.log(para);
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser2(para,publicParams).then((res) => {
								this.editLoading = false;
								if(res.code == 1000) {
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getUsers();
								}else {
									this.$message({
										message: '提交失败:'+res.msg,
										type: 'error'
									});
								}
								
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					console.log(valid)
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							var actions = {action:'add'};
							let para = Object.assign({}, this.addForm, actions);
							//console.log(para);
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser2(para,publicParams).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								if(res.code == 1000) {
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getUsers();
								}else {
									this.$message({
										message: '提交失败:'+res.msg,
										type: 'error'
									});
								}
								
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					//console.log(para);
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
					batchRemoveUser(para,publicParams).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						if(res.code == 1000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getUsers();
						}else {
							this.$message({
								message: '删除失败:'+res.msg,
								type: 'error'
							});
						}
						
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			var secret = JSON.parse(sessionStorage.getItem('secret'));
			if (user!==null) {
				user = JSON.parse(user);
				//console.log(user.token)
				this.publicParams.token = user.token;
			}
			if(secret !== null) {
				this.publicParams.secretId = secret.secretId;
				this.publicParams.secretKey = secret.secretKey;
			}
			this.getUsers();
		}
	}

</script>


