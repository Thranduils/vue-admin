<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none; padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.type" placeholder="请选择类别">
						<!-- <el-option v-for="item in cateList" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory"></el-option> -->
						<el-option value="0" label="目录"></el-option>
						<el-option value="1" label="菜单"></el-option>
						<el-option value="2" label="按钮"></el-option>
					</el-select>
					<!-- <el-input v-model="filters.type" placeholder="请输入类别"></el-input> -->
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入菜单名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getReset">重置</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getQueryMenu">查询</el-button>
				</el-form-item>
				<el-button-group style="float: right">
					<el-button type="primary" @click="handleAdd" icon="plus" round="true"></el-button>
				</el-button-group>
				<!--<el-form-item>-->
				<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
				<!--</el-form-item>-->
			</el-form>
		</el-col>
	
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" label="序号" width="80">
			</el-table-column>
			<el-table-column prop="name" label="菜单名称" min-width="100">
			</el-table-column>
			<el-table-column prop="url" label="菜单路径" min-width="100">
			</el-table-column>
			<el-table-column prop="typeName" label="类型" width="80">
			</el-table-column>
			<el-table-column prop="perms" label="授权" min-width="100">
			</el-table-column>
			<el-table-column prop="sort" label="编码" min-width="100">
			</el-table-column>
	
	
			<el-table-column label="操作" width="140">
				<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row,scope.row.type)">删除</el-button>
</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none;">
			<el-pagination @size-change ="handleSizeChange"  @current-change="handleCurrentChange" :current-page.sync="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" style="float: right">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑菜单" v-model="editFormVisible" :close-on-click-modal="false" width="90%">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="菜单名称：" prop="name" >
							<el-input v-model="editForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="菜单类型：" prop="type">
							<el-radio-group v-model.number="editForm.type" @change="testChange" >
                                <el-radio :label="0" :key="0" >目录</el-radio>
                                <el-radio :label="1" :key="1" >菜单</el-radio>
                                <el-radio :label="2" :key="2" >按钮</el-radio>
                            </el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="选择目录：" v-show="editForm.type == 1" prop="pid">
							<el-select v-model="editForm.pid" placeholder="请选择目录" @change="menuChange">
								<el-option v-for="item in menuForm" :key="item.pid" :label="item.name" :value="item.pid" ></el-option>
							</el-select>
						</el-form-item>
                        <el-form-item label="选择菜单：" v-show="editForm.type == 2" prop="pid">
							<el-select v-model="editForm.pid" placeholder="请选择菜单" @change="menuChange">
								<el-option v-for="item in menuForm" :key="item.pid" :label="item.name" :value="item.pid" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="菜单路径：">
							<el-input v-model="editForm.url" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="12">
						<el-form-item label="授权：">
							<el-input v-model="editForm.perms" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="12">
						<el-form-item label="图标：">
							<el-input v-model="editForm.icon" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="编码：" prop="sort">
							<el-input v-model.number="editForm.sort" ></el-input>
						</el-form-item>
					</el-col>
                    <el-col :span="12">
						<p class="prompt">编码规则：100101 前两位-目录，中间两位-菜单，后两位-按钮</p>
					</el-col>
				</el-row>	
				
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

			<!--新增界面-->
		<el-dialog title="新增菜单" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="菜单名称：" prop="name" >
							<el-input v-model="addForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="addForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="菜单类型：" prop="type">
							<el-radio-group v-model.number="addForm.type" @change="testChange" >
                                <el-radio :label="0" :key="0" >目录</el-radio>
                                <el-radio :label="1" :key="1" >菜单</el-radio>
                                <el-radio :label="2" :key="2" >按钮</el-radio>
                            </el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="12">
						<!--<el-input v-model="addForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="选择目录：" v-show="addForm.type == 1" prop="pid">
							<el-select v-model="addForm.pid" placeholder="请选择目录" @change="menuChange">
								<el-option v-for="item in menuForm" :key="item.pid" :label="item.name" :value="item.pid" ></el-option>
							</el-select>
						</el-form-item>
                        <el-form-item label="选择菜单：" v-show="addForm.type == 2" prop="pid">
							<el-select v-model="addForm.pid" placeholder="请选择菜单" @change="menuChange">
								<el-option v-for="item in menuForm" :key="item.pid" :label="item.name" :value="item.pid" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="菜单路径：">
							<el-input v-model="addForm.url" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="12">
						<el-form-item label="授权：">
							<el-input v-model="addForm.perms" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="12">
						<el-form-item label="图标：">
							<el-input v-model="addForm.icon" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="编码：" prop="sort">
							<el-input v-model.number="addForm.sort" ></el-input>
						</el-form-item>
					</el-col>
                    <el-col :span="12">
						<p class="prompt">编码规则：100101 前两位-目录，中间两位-菜单，后两位-按钮</p>
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
	import {
		getMenuListPage,
		editMenu,
		getMenuEdit,
		getMenuEditList,
		addMenu,
		removeMenu
	} from '../../api/api';
	
	export default {
		data() {
			return {
				publicParams: {
                    secretKey :'',
                    secretId:'',
                    token:'',
                    sign:''
                },
				isfirst: true,
				addfirst: true,
				test: '',
				filters: {
					name: '',
					type: ''
				},
				isShow: true,
				users: [], //列表数据
				cateList: [], //
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				sels: [], //列表选中列
				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}],
					sort: [{
						required: true,
						message: '请按照编码规则编码'
					}],
					type: [{
						required: true,
						message: '请选择类型'
					}],
					pid: [{
						required: true,
						message: '请选择目录/菜单'
					}],
				},
				//编辑界面数据
				editForm: {
					type: -1,
					id: '',
					name: '',
					type: '',
					pid: '',
					url: '',
					perms: '',
					icon: '',
					sort: ''
				},
				typeTest: 0,
				// 编辑页面类别数据
				menuForm: [],
				dAreaForm: [],
				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}],
					sort: [{
						required: true,
						message: '请按照编码规则编码'
					}],
					type: [{
						required: true,
						message: '请选择类型'
					}],
					pid: [{
						required: true,
						message: '请选择目录/菜单'
					}],
				},
				//新增界面数据
				addForm: {
					type: -1,
					id: '',
					name: '',
					type: '',
					pid: '',
					url: '',
					perms: '',
					icon: '',
					sort: ''
				},
	
			}
		},
		methods: {
	
			testChange: function(val) {
				//console.log(val)
				var that = this;
				if (val != 0) {
					let para = {
						type: val
					}
					/*设置签名参数  start  以及公共参数 */
					let obj = this.publicParams;
					let publicParams =  util.publicParam(obj,util);
					/*设置签名参数  END   以及公共参数 */
					getMenuEditList(para,publicParams).then((res) => {
						if (res.code == 1000) {
							if (!that.isfirst) {
								that.editForm.pid = 0;
								that.addForm.pid = 0;
							}
							//NProgress.done();
							console.log(res)
							// 获取下拉框的内容
							that.menuForm = res.result;
	
							// todo :给下拉框赋值
	
							// 1. 新增；
							if (that.editForm.pid == 0 || that.addForm.pid) {
								that.editForm.pid = that.menuForm[0].pid;
								that.addForm.pid = that.menuForm[0].pid;
							}
	
							// 2. 修改；
							//this.editForm.pid = "";
	
	
	
							that.isfirst = false;
						} else {
							if (that.addfirst) {
								this.$message({
									message: '获取失败' + res.msg,
									type: 'error'
								});
							}
						}
					});
				} else {
	
					if (this.addfirst) {
						this.editForm.pid = '0';
					} else {
						this.addForm.pid = '0';
					}
				}
			},
			//类别、诚信商家、置顶、热点、状态、门票显示转换
			getcategoryname: function(row, column) {
				return row.categoryName ? row.categoryName : '无';
			},
			getQueryMenu(){
				this.page = 1;
				this.getMenu();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getMenu();
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.page = 1;
				this.getMenu();
			},
			menuChange(val) {
				this.editForm.pid = val
			},
			dAreaChange(val) {
				this.editForm.areaCode = val
			},
			dParkChange(val) {
				this.editForm.isParking = val
			},
			dTrustChange(val) {
				this.editForm.dTrustStatus = val
			},
			dNetChange(val) {
				this.editForm.dOnlineStatus = val
			},
			//菜品id下拉点击
			dishIdChange(val) {
				this.tdetailForm.dishId = val
			},
			//菜品类型下拉点击
			dishCategoryChange(val) {
				this.tdetailForm.dCategory = val
			},
			handleSizeChangeDish(val) {
				this.pageSize = val;
				this.handleDish();
			},
			handleCurrentChangeDish(val) {
				this.page = val;
				this.handleDish();
			},
			getReset() {
				this.filters.name = "";
				this.filters.type = "";
			},
			//获取用户列表
			getMenu() {
				var _this = this;
				let para = {
					page: this.page,
					rows: this.pageSize,
					title: this.filters.name,
					type: this.filters.type
				};

				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */

				//console.log(para)
				this.listLoading = true;
				getMenuListPage(para,publicParams).then((res) => {
					if (res.code == 1000) {
						if (res !== null) {
							//console.log(res)
							_this.total = res.result.total;
							_this.users = res.result.list;
							_this.listLoading = false;
							//console.log(res.list)
						}
					} else {
						this.listLoading = false;
						this.$message({
							message: '数据获取失败:' + res.msg,
							type: 'error'
						});
					}
					// NProgress.done();
				}).catch((error) => {
					console.log(error);
				});
			},
	
	
			//删除
			handleDel: function(index, row, type) {
				console.log(type)
				if (type == 0) {
					this.$confirm('将会删除该目录下所有菜单，您确定这样做吗？', '提示', {
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						let para = {
							id: row.id
						};
						//console.log(para)
						
						/*设置签名参数  start  以及公共参数 */
						let obj = this.publicParams;
						let publicParams =  util.publicParam(obj,util);
						/*设置签名参数  END   以及公共参数 */

						removeMenu(para,publicParams).then((res) => {
							this.listLoading = false;
							if (res.code == 1000) {
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.getMenu();
							} else {
								this.$message({
									message: '删除失败' + res.msg,
									type: 'error'
								});
							}
						});
					}).catch(() => {
	
					});
				} else {
					this.$confirm('确认删除该记录吗?', '提示', {
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						let para = {
							id: row.id
						};
						/*设置签名参数  start  以及公共参数 */
						let obj = this.publicParams;
						let publicParams =  util.publicParam(obj,util);
						/*设置签名参数  END   以及公共参数 */
	
						removeMenu(para,publicParams).then((res) => {
							this.listLoading = false;
							if (res.code == 1000) {
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.getMenu();
							} else {
								this.$message({
									message: '删除失败' + res.msg,
									type: 'error'
								});
							}
						});
					}).catch(() => {
	
					});
				}
	
			},
			//显示编辑界面
			handleEdit: function(id) {
				this.isfirst = true;
				this.editFormVisible = true;
				var _this = this;
				let para = {
					id: id
				};
				
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
	
				getMenuEdit(para,publicParams).then((res) => {
					if (res.code == 1000) {
						if (res.result !== null) {
							console.log(res);
							_this.editForm = res.result.menu;
							_this.menuForm = res.result.menuList; //类别
							console.log(this.editForm.type)
						}
					} else {
						this.$message({
							message: '数据获取失败:' + res.msg,
							type: 'error'
						});
					}
					// NProgress.done();
				}).catch((error) => {
					console.log(error);
				});
	
			},
			//显示新增界面
			handleAdd: function() {
				this.isfirst = true;
				this.addfirst = false;
				this.addFormVisible = true;
				var _this = this;
				let para = {
					id: null
				};
				this.addForm = {};
			},
			//编辑
			editSubmit: function() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							var actions = {
								action: 'edit'
							};
							let para = Object.assign({}, this.editForm, actions);
							
							/*设置签名参数  start  以及公共参数 */
							let obj = this.publicParams;
							let publicParams =  util.publicParam(obj,util);
							/*设置签名参数  END   以及公共参数 */

							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							
							
							editMenu(para,publicParams).then((res) => {
								this.editLoading = false;
								if (res.code == 1000) {
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getMenu();
								} else {
									this.$message({
										message: '提交失败' + res.msg,
										type: 'error'
									});
								}
							});
						});
					}
				});
			},
			//新增
			addSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							var actions = {
								action: 'add'
							};
							let para = Object.assign({}, this.addForm, actions);
							

							/*设置签名参数  start  以及公共参数 */
							let obj = this.publicParams;
							let publicParams =  util.publicParam(obj,util);
							/*设置签名参数  END   以及公共参数 */

							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addMenu(para,publicParams).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								if (res.code == 1000) {
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getMenu();
								} else {
									this.$message({
										message: '提交失败' + res.msg,
										type: 'error'
									});
								}
	
							});
						});
					}
				});
			},
			selsChange: function(sels) {
				this.sels = sels;
			},
	
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			
			var secret = JSON.parse(sessionStorage.getItem('secret'));

			if (user!==null) {
				user = JSON.parse(user);
				this.publicParams.token = user.token;
			}
			if(secret !== null) {
				this.publicParams.secretId = secret.secretId;
				this.publicParams.secretKey = secret.secretKey;
			}
			this.getMenu();
		}
	}
</script>

<style scoped>
	.el-dialog__wrapper {
		overflow-y: hidden;
	}
	
	.el-dialog {
		width: 80%;
		overflow: hidden;
	}
	
	.el-dialog__body {
		max-height: 450px;
		overflow-y: auto;
	}
	
	.prompt {
		margin: 0;
		margin-left: 20px;
		line-height: 36px;
		color: #e04b4b;
	}
</style>
