<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none; padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入新型旅游名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getQueryTravelnew">查询</el-button>
				</el-form-item>
				<el-button-group style="float: right">
					<el-button type="primary" @click="handleAdd" icon="plus"></el-button>
					<el-button type="primary" icon="delete" @click="batchRemove" :disabled="this.sels.length===0"></el-button>
				</el-button-group>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="序号"  width="80">
			</el-table-column>
			<el-table-column prop="title" label="新型旅游名称" min-width="120" >
			</el-table-column>
			<el-table-column prop="categoryName" label="类别" width="100" :formatter="getcategoryname" >
			</el-table-column>
			<el-table-column prop="officialScore" label="评分" width="80" >
			</el-table-column>
			<el-table-column prop="areaName" label="所属区域" width="100"  :formatter="getArea">
			</el-table-column>
			<el-table-column prop="isEnabled" label="状态" width="100" >
				<template slot-scope="scope">
					<el-switch v-model="scope.row.isEnabled"  on-color="#ff4949" off-color="#13ce66" on-value="0" off-value="1"  on-text="禁用" off-text="启用" @change="editEnabled(scope.row.id,scope.row.isEnabled)">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none;">
			<el-pagination @size-change ="handleSizeChange"  @current-change="handleCurrentChange" :current-page.sync="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" style="float: right">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑新型旅游" v-model="editFormVisible" :close-on-click-modal="false" width="90%">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="新型旅游名称：" prop="title" >
							<el-input v-model="editForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="类别：" >
							<el-select v-model="editForm.dCategory" placeholder="请选择类别" @change="dCategoryChange">
								<el-option v-for="item in dCategoryForm" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory" ></el-option>
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
						<el-form-item label="所属区域：" >
							<el-select v-model="editForm.areaCode" placeholder="请选择所属区域" @change="dAreaChange">
								<el-option v-for="item in dAreaForm" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" ></el-option>
							</el-select>
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
						<el-form-item label="手机号：">
							<el-input v-model="editForm.mobile" ></el-input>
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
						<el-form-item label="官方评分：">
							<el-input v-model="editForm.officialScore" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="交通信息：">
							<el-input type="textarea" v-model="editForm.trafficInfo"></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="链接地址：">
							<el-input v-model="editForm.externalUrl" ></el-input>
						</el-form-item>
					</el-col> -->
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="简介：">
							<el-input type="textarea" v-model="editForm.summary"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="特色：">
							<el-input type="textarea" v-model="editForm.feature"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="详情介绍：">
							<el-input type="textarea" v-model="editForm.content"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

			<!--新增界面-->
		<el-dialog title="新增新型旅游" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="美丽新型旅游：" prop="title" >
							<el-input v-model="addForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="类别：" >
							<el-select v-model="addForm.dCategory" placeholder="请选择类别" @change="dCategoryChange">
								<el-option v-for="item in dCategoryForm" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory" ></el-option>
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
						<el-form-item label="所属区域：" >
							<el-select v-model="addForm.areaCode" placeholder="请选择所属区域" @change="dAreaChange">
								<el-option v-for="item in dAreaForm" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" ></el-option>
							</el-select>
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
						<el-form-item label="手机号：">
							<el-input v-model="addForm.mobile" ></el-input>
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
						<el-form-item label="官方评分：">
							<el-input v-model="addForm.officialScore" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="交通信息：">
							<el-input type="textarea" v-model="addForm.trafficInfo"></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="链接地址：">
							<el-input v-model="addForm.externalUrl" ></el-input>
						</el-form-item>
					</el-col> -->
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="简介：">
							<el-input type="textarea" v-model="addForm.summary"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="特色：">
							<el-input type="textarea" v-model="addForm.feature"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="详情介绍：">
							<el-input type="textarea" v-model="addForm.content"></el-input>
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
	import util from '../../common/js/util';
	import CryptoJS from 'crypto-js';
	//import NProgress from 'nprogress'
	import { getTravelnewListPage, removeTravelnew, batchRemoveTravelnew, editTravelnew, addTravelnew, getTravelnewEdit ,editTravelnewAble} from '../../api/api';

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
					name: '',
					type: ''
				},
                isShow:true,
				users: [],//列表数据
				total: 0,
				page: 1,
                pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入商户名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					title: '',
					// openTime: '',
					dCategory: '',
					addrInfo: '',
					areaCode: '',
					longitude: '',
					latitude: '',
					mobile: '',
					telephone: '',
					// externalUrl: '',
					// dTrustStatus: '',
					content: '',
					summary: '',
					officialScore: '',
					// isParking: '',
					feature: '',
					trafficInfo : ''
				},
				// 编辑页面类别数据
				dCategoryForm: [],
				dAreaForm: [],
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入美丽乡村名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					// openTime: '',
					dCategory: '',
					addrInfo: '',
					areaCode: '',
					longitude: '',
					latitude: '',
					mobile: '',
					telephone: '',
					// externalUrl: '',
					// dTrustStatus: '',
					content: '',
					summary: '',
					officialScore: '',
					// isParking: '',
					feature: '',
					trafficInfo : ''
				}		
			}
		},
		methods: {
			//类别、诚信商家、置顶、热点、状态
			getcategoryname: function (row, column) {
				return row.categoryName ? row.categoryName : '无';
			},
            getTrust: function (row, column) {
                return row.dTrustStatus > 1 ? '是' : '否';
            },
			getArea: function (row, column) {
				return row.areaName ? row.areaName : '无';
			},
			// getOpenTime: function (row, column) {
			// 	return row.openTime ? row.openTime : '无';
			// },
            editEnabled: function (id, isShow) {
				var _this = this;				
				let para = {
					id: id,
					isEnabled: isShow == false ? '0':'1',
					action: 'edit'
				};
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				// console.log(para);
				editTravelnewAble(para,publicParams).then((res) => {
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
			getQueryTravelnew(){
				this.page = 1;
                this.getTravelnew();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getTravelnew();
			},
            handleSizeChange(val) {
				this.pageSize = val;
				this.page = 1;
                this.getTravelnew();
			},
			dCategoryChange(val){
				this.editForm.dCategory = val
			},
			dAreaChange(val){
				this.editForm.areaCode = val
			},
			dTrustChange(val){
				this.editForm.dTrustStatus = val
			},
			dParkChange(val){
				this.editForm.isParking = val
			},
			//获取用户列表
			getTravelnew() {
				var _this = this;
				let para = {
					page: this.page,
					rows: this.pageSize,
					title: this.filters.name,
				};
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				// console.log(para)
				this.listLoading = true;
				getTravelnewListPage(para,publicParams).then((res) => {
					if(res.code == 1000){
						if(res !== null){
							//console.log(res)
							_this.total = res.result.total;
							_this.users = res.result.list;
							_this.listLoading = false;	
						}
					}else {
						this.listLoading = false;
						this.$message({
								message: '数据获取失败:'+res.msg,
								type: 'error'
							});
					}
				}).catch((error) => {
					console.log(error);
                });
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					/*设置签名参数  start  以及公共参数 */
					let obj = this.publicParams;
					var publicParams =  util.publicParam(obj,util);
					/*设置签名参数  END   以及公共参数 */
					// console.log(para)
					removeTravelnew(para,publicParams).then((res) => {
						this.listLoading = false;
						if(res.code == 1000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getTravelnew();
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
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				// console.log(para)
				getTravelnewEdit(para,publicParamspara).then((res) => {
					if(res.code == 1000){
						if(res.result !== null){
							//console.log(res);
							_this.editForm = res.result.data;
							_this.dCategoryForm = res.result.categoryList;//类别
							_this.dAreaForm = res.result.areaList;//所属区域
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
				let para = {
					id: null
				};
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				getTravelnewEdit(para,publicParamspara).then((res) => {
					if(res.code == 1000){
						if(res.result !== null){
							//console.log(res);
							_this.dCategoryForm = res.result.categoryList;//类别
							_this.dAreaForm = res.result.areaList;//所属区域
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
				this.addForm = {
					title: '',
					// openTime: '',
					dCategory: '',
					addrInfo: '',
					areaCode: '',
					longitude: '',
					latitude: '',
					mobile: '',
					telephone: '',
					// externalUrl: '',
					// dTrustStatus: '',
					content: '',
					summary: '',
					officialScore: '',
					// isParking: '',
					feature: '',
					trafficInfo: ''
				};
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
							console.log(this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							/*设置签名参数  start  以及公共参数 */
							let obj = this.publicParams;
							var publicParams =  util.publicParam(obj,util);
							/*设置签名参数  END   以及公共参数 */
							editTravelnew(para,publicParams).then((res) => {
								this.editLoading = false;
								if(res.code == 1000) {
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getTravelnew();
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
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							var actions = {action:'add'};
							let para = Object.assign({}, this.addForm, actions);
							/*设置签名参数  start  以及公共参数 */
							let obj = this.publicParams;
							var publicParams =  util.publicParam(obj,util);
							/*设置签名参数  END   以及公共参数 */
							//console.log(para);
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addTravelnew(para,publicParams).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								if(res.code == 1000) {
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getTravelnew();
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
					let para = { ids : ids };
					console.log(para);
					/*设置签名参数  start  以及公共参数 */
					let obj = this.publicParams;
					var publicParams =  util.publicParam(obj,util);
					/*设置签名参数  END   以及公共参数 */
					batchRemoveTravelnew(para,publicParams).then((res) => {
						this.listLoading = false;
						if(res.code == 1000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getTravelnew();
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
			this.getTravelnew();
		}
	}

</script>


