<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none; padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-button-group style="float: right">
					<el-button type="primary" @click="handleAdd" icon="plus"></el-button>
				</el-button-group>
				<!--<el-form-item>-->
					<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
				<!--</el-form-item>-->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" label="序号"  width="120" >
			</el-table-column>
			<el-table-column prop="userName" label="用户名称" min-width="100" >
			</el-table-column>
			<el-table-column prop="name" label="真实姓名" min-width="100"  :formatter="getname" >
			</el-table-column>
            <el-table-column prop="mobile" label="手机号码" width="160" :formatter="getphonenum" >
			</el-table-column>
			<el-table-column prop="status" label="状态" width="160" >
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status"  on-color="#ff4949" off-color="#13ce66" on-value="0" off-value="1" on-text="禁用" off-text="启用"  @change="editEnabled(scope.row.id,scope.row.status)">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150" >
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row.id)" :disabled="scope.row.id===1">编辑</el-button>
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
		<el-dialog title="编辑用户" v-model="editFormVisible" :close-on-click-modal="false" width="50%">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户名：" prop="userName" >
							<el-input v-model="editForm.userName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="12">
						<el-form-item label="真实姓名：" >
							<el-input v-model="editForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="选择角色：" >
                            <el-checkbox-group v-model="editUserRole" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="item in editAllRole" :label="item.roleId"  :key="item.roleName">{{item.roleName}}</el-checkbox>   
                            </el-checkbox-group>
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
		<el-dialog title="新增管理员" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户名：" prop="userName" >
							<el-input v-model="addForm.userName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="12">
						<el-form-item label="真实姓名：" >
							<el-input v-model="addForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">

						<el-form-item label="密码：" prop="password">
							<el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						
						<el-form-item label="确认密码" prop="checkPassword">
							<el-input type="password" v-model="addForm.checkPassword" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="选择角色：" >
                            <el-checkbox-group v-model="addUserRole" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="item in addAllRole" :label="item.roleId"  :key="item.roleName">{{item.roleName}}</el-checkbox>   
                            </el-checkbox-group>
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
	import { getUsersListPage, getUserEdit, editUserAble,getuserEdit,getUserAdd } from '../../api/api';
	import { type, constants } from 'os';
	import CryptoJS from 'crypto-js/core';
	import MD5 from 'crypto-js/md5';

    // const cityOptions = [
    //         {
    //             "roleId": "1",
    //             "roleName": "上海"
    //         },
    //         {
    //             "roleId": "2",
    //             "roleName": "北京"
    //         },
    //         {
    //             "roleId": "3",
    //             "roleName": "场馆院所"
    //         },
    //         {
    //             "roleId": "4",
    //             "roleName": "建筑人文"
    //         }
    //     ];
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
				callback(new Error('请输入密码'));
				} else {
				if (this.addForm.checkPassword !== '') {
					this.$refs.addForm.validateField('checkPassword');
				}
				callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
				callback(new Error('请再次输入密码'));
				} else if (value !== this.addForm.password) {
				callback(new Error('两次输入密码不一致!'));
				} else {
				callback();
				}
			};
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
					userName: [
						{ required: true, message: '请输入用户名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
                    id: '',
                    userName: '',
                    name: '',
                    mobile: '',
                    email: ''
                },
                editUserRole: [],
                editAllRole: [],
				// 编辑页面类别数据
				dCategoryForm: [],
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					userName: [
						{ required: true, message: '请输入用户名称', trigger: 'blur' }
					],
					password: [
						{ validator: validatePass, trigger: 'blur' }
					],
					checkPassword: [
						{ validator: validatePass2, trigger: 'blur' }
					]
				},
				addUserRole: [],
                addAllRole: [],
				//新增界面数据
				addForm: {
					id: '',
                    userName: '',
                    name: '',
                    mobile: '',
					email: '',
					password:'',
					checkPassword:''
				}
			}
		},
		methods: {
            // 修改选择角色
            handleCheckedCitiesChange(value) {
                console.log(value)
                
			},

			

			//类别、诚信商家、置顶、热点、状态、门票显示转换
			getname: function (row, column) {
				return row.name ? row.name : '无';
			},
			getphonenum: function (row) {  
				return row.mobile ? row.mobile : '无';
			},
            editEnabled: function (id, status) {
				//console.log(id,status)
				var _this = this;				
				let para = {
					id: id,
					status: status,
				};	
				
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */

				editUserAble(para,publicParams).then((res) => {
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
						this.getUsers();
					}
					
				});
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
            handleSizeChange(val) {
			    this.pageSize = val;
                this.getUsers();
			},
			//获取用户列表
			getUsers() {
				var _this = this;
				let para = {
					page: this.page,
					rows: this.pageSize,
					title: this.filters.name
				};
				
				// /*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				// /*设置签名参数  END   以及公共参数 */
				
				this.listLoading = true;
				// //NProgress.start();
				getUsersListPage(para,publicParams).then((res) => {
                    //console.log(res)
					if(res.code == 1000){
						if(res !== null){
							//console.log(res.result)
							_this.total = res.result.total;
							_this.users = res.result.list;
							_this.listLoading = false;
						}
					}else {
						//console.log(res);
						//console.log(res.code);

						this.$message({
							message: '数据获取失败:'+res.msg,
							type: 'error'
						});
						_this.listLoading = false;
					}
                    // NProgress.done();
				}).catch((error) => {
					console.log(error);
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
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */

				getuserEdit(para,publicParams).then((res) => {
					if(res.code == 1000){

						if(res.result !== null){
							// console.log(res.result.allRole);
							// console.log(res.result.userRole);
							console.log(res.result.user);
                            _this.editAllRole = res.result.allRole;
                            _this.editUserRole = res.result.userRole;
							_this.editForm = res.result.user;
						}
					}else {
						console.log(res.code);
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
				this.addForm = {};
				let para = {};
				
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */

				getUserAdd(para,publicParams).then((res) => {
					console.log(res)
					if(res.code == 1000){
						if(res.result !== null){
							_this.addAllRole = res.result;
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
			
						
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					console.log(valid)
					console.log(this.editForm)
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							var actions = {action:'edit'};
							var roleIds = {roleIds:this.editUserRole}
							let para = Object.assign({}, this.editForm , actions,roleIds);
							
							/*设置签名参数  start  以及公共参数 */
							let obj = this.publicParams;
							let publicParams =  util.publicParam(obj,util);
							/*设置签名参数  END   以及公共参数 */

							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							getUserEdit(para,publicParams).then((res) => {
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
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							var _this = this;
							//var pass = this.getAES(_this.addForm.password);
							//var passwords = {password: pass};
							var actions = {action:'add'};
							var roleIds = {roleIds:this.addUserRole}
							let para = Object.assign({}, this.addForm, actions,roleIds);
							

							/*设置签名参数  start  以及公共参数 */
							let obj = this.publicParams;
							let publicParams =  util.publicParam(obj,util);
							/*设置签名参数  END   以及公共参数 */

							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							getUserEdit(para,publicParams).then((res) => {
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
			
			this.getUsers();
		}
	}

</script>

<style scoped>
	.el-dialog__wrapper {
		overflow-y: hidden;
	}
	.el-dialog {
		width: 40%;
		overflow: hidden;
	}
	.el-dialog__body {
		max-height: 450px;
        padding-right: 50px;
		overflow-y: auto;
	}
</style>
