<template>
    <section>
        <div class="main">
            <div width="240px" class="el-aside">
                <h2>角色</h2>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="background: none; padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters">
                        <el-form-item style="float: right">
                            <el-button type="primary" @click="handleRoleAdd" icon="plus" round="true"></el-button>
                        </el-form-item>
                        <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                        <!--</el-form-item>-->
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="roleList" highlight-current-row v-loading="listLoading" style="width: 100%;" @row-click="getRoleMenu">
                    <el-table-column prop="name" label="角色名称" min-width="100">
                    </el-table-column>
    
                    <el-table-column label="操作" width="140">
                        <template slot-scope="scope">
                                <el-button size="small" @click="handleRoleEdit(scope.row.id)">编辑</el-button>
                                <el-button type="danger" size="small" @click="handleRoleDel(scope.$index, scope.row,scope.row.type)">删除</el-button>
</template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="el-main">
                <h2>菜单</h2>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="background: none; padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input v-model="filters.name" placeholder="请输入菜单名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getRoleMenu">查询</el-button>
                        </el-form-item>
                        <el-form-item style="float: right">
                            <el-button type="primary" @click="handleMenuAdd" icon="plus" round="true"></el-button>
                        </el-form-item>
                        <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                        <!--</el-form-item>-->
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="menuList" highlight-current-row v-loading="menuListLoading" style="width: 100%;">
                    <el-table-column type="index" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="menuId" label="菜单ID" width="80">
                    </el-table-column>
                    <el-table-column prop="menuName" label="菜单名称" min-width="100">
                    </el-table-column>
                    <el-table-column prop="typeName" label="类型" min-width="100">
                    </el-table-column>

                    <el-table-column label="操作" width="140">
<template slot-scope="scope">
    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row,scope.row.type)">
        删除</el-button>
</template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="background: none;" v-show="menuList.length != 0">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" style="float: right">
                    </el-pagination>
                </el-col>
            </div>
        </div>

        <!--角色编辑界面-->
        <el-dialog title="编辑角色" v-model="editFormVisible" :close-on-click-modal="false" class="role-dialog">
            <el-form :model="editRoleForm" :rules="editRoleFormRules" label-width="120px" ref="editRoleForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="角色名称：" prop="name">
                            <el-input v-model="editRoleForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="角色描述">
                            <el-input type="textarea" v-model="editRoleForm.description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="editRoleSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--角色新增界面-->
        <el-dialog title="编辑角色" v-model="addFormVisible" :close-on-click-modal="false" class="role-dialog">
            <el-form :model="addRoleForm" :rules="addRoleFormRules" label-width="120px" ref="addRoleForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="角色名称：" prop="name">
                            <el-input v-model="addRoleForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="角色描述">
                            <el-input type="textarea" v-model="addRoleForm.description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="addRoleSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--菜单新增界面-->
        <el-dialog title="编辑角色" v-model="addMenuFormVisible" :close-on-click-modal="false" class="role-dialog">
            <el-form :model="addForm" :rules="addMenuFormRules" label-width="200px" ref="addForm"> 
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="pid">
                            <el-select v-model="addForm.pid" clearable placeholder="请选择" @change="handleItemChange">
                                <el-option v-for="item in addMenuForm" :key="item.pid" :label="item.label" :value="item.pid">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item  prop="menuId">
                            <el-select v-model="addForm.menuId" multiple  placeholder="请选择">
                                <el-option v-for="item in addMenuFormChildren" :key="item.menuId" :label="item.label" :value="item.menuId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addMenuFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="addMenuSubmit" :loading="addMenuLoading">提交</el-button>
            </div>
        </el-dialog>
        
    </section>
</template>

<script>
    import util from "../../common/js/util";
    //import NProgress from 'nprogress'
    import {
        getRoleListPage,
        getRoleMenuPage,
        getRoleEdit,
        getEditRoleSubmit,
        getAddRoleSubmit,
        getRemoveMenu,
        getAddMenuSubmit,
        getMenuAdd,
        getAddMenuSlect,
    
        editMenu,
        getMenuEdit,
        getMenuEditList,
    
        removeRoleList
    } from "../../api/api";
    
    export default {
        data() {
            return {
                publicParams: {
                    secretKey :'',
                    secretId:'',
                    token:'',
                    sign:''
                },
                value4: [],
                value11: [],
                roleList: [], //角色数据
                menuList: [], //菜单数据
                menuPid: "",
                filters: {
                    name: "",
                    type: ""
                },
                isShow: true,
                users: [], //列表数据
                cateList: [], //
                total: 0,
                page: 1,
                pageSize: 10,
                listLoading: false,
                menuListLoading: false,
                sels: [], //列表选中列
                editFormVisible: false, //编辑界面是否显示
                editLoading: false,
    
                //编辑角色数据
                editRoleForm: {
                    description: "",
                    id: "",
                    name: ""
                },
                //验证编辑角色数据
                editRoleFormRules: {
                    name: [{
                        required: true,
                        message: "角色名称不能为空",
                        trigger: "blur"
                    }]
                },
                //新增角色数据
                addRoleForm: {
                    description: "",
                    id: "",
                    name: ""
                },
                //新增菜单 一级 目录数据
                addMenuForm: [],
                //新增菜单 二级 目录数据
                addMenuFormChildren: [],

                //验证新增角色数据
                addRoleFormRules: {
                    name: [{
                        required: true,
                        message: "角色名称不能为空",
                        trigger: "blur"
                    }]
                },
                //验证新增 菜单 数据
                addRoleFormRules: {
                    name: [{
                        required: true,
                        message: "角色名称不能为空",
                        trigger: "blur"
                    }]
                },
                typeTest: 0,
    
                addFormVisible: false, //新增 角色 界面是否显示
                addMenuFormVisible: false, //新增 菜单 界面是否显示
                addLoading: false,
                addMenuLoading: false,
                addFormRules: {
                    name: [{
                        required: true,
                        message: "请输入菜单名称",
                        trigger: "blur"
                    }],
                    sort: [{
                        required: true,
                        message: "请按照编码规则编码"
                    }],
                    type: [{
                        required: true,
                        message: "请选择类型"
                    }],
                    pid: [{
                        required: true,
                        message: "请选择目录/菜单"
                    }]
                },
                //新增 菜单 数据
                addForm: {
                    pid:'',
                    menuId:[],
                    id:''
                },
                //新增 菜单 数据验证
                addMenuFormRules: {
                    pid: [{
                        required: true,
                        message: "请选择目录/菜单"
                    }],
                    menuId: [{
                        required: true,
                        message: "请选择目录/菜单"
                    }]
                },
            };
        },
        methods: {
            //类别、诚信商家、置顶、热点、状态、门票显示转换
            getcategoryname: function(row, column) {
                return row.categoryName ? row.categoryName : "无";
            },
    
            handleCurrentChange(val) {
                this.page = val;
                this.getRoleMenuPage();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getRoleMenuPage();
            },
            menuChange(val) {
                this.editForm.pid = val;
            },
            dAreaChange(val) {
                this.editForm.areaCode = val;
            },
            dParkChange(val) {
                this.editForm.isParking = val;
            },
            dTrustChange(val) {
                this.editForm.dTrustStatus = val;
            },
            dNetChange(val) {
                this.editForm.dOnlineStatus = val;
            },
            
    
            //获取角色列表
            getRoleList() {
                var _this = this;
                let para = {};
               
                /*设置签名参数  start  以及公共参数 */
                let obj = this.publicParams;
                let publicParams =  util.publicParam(obj,util);
                /*设置签名参数  END   以及公共参数 */

                this.listLoading = true;
                getRoleListPage(para,publicParams)
                    .then(res => {
                        if (res.code == 1000) {
                            if (res !== null) {
         
                                _this.roleList = res.result;
                                _this.listLoading = false;
                                //console.log(res.list)
                            }
                        } else {
                            this.listLoading = false;
                            this.$message({
                                message: "数据获取失败:" + res.msg,
                                type: "error"
                            });
                        }
                        // NProgress.done();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            //获取菜单列表
            getRoleMenu: function(row, event, column) {
                //console.log(row.id);
                this.page = 1;
                this.pageSize = 10;
                var _this = this;
                if (row && row.id !== undefined) {
                    this.menuPid = row.id;
                }
                let para = {
                    id: this.menuPid,
                    page: 1,
                    rows: 10,
                    title: this.filters.name
                };
                
                /*设置签名参数  start  以及公共参数 */
                let obj = this.publicParams;
                let publicParams =  util.publicParam(obj,util);
                /*设置签名参数  END   以及公共参数 */

                this.menuListLoading = true;
                getRoleMenuPage(para,publicParams)
                    .then(res => {
                        if (res.code == 1000) {
                            //console.log(res);
                            _this.total = res.result.total;
                            _this.menuList = res.result.list;
                            _this.menuListLoading = false;
                            // //console.log(res.list)
                        } else {
                            this.menuListLoading = false;
                            this.$message({
                                message: "数据获取失败:" + res.msg,
                                type: "error"
                            });
                        }
                        // NProgress.done();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            //获取菜单列表(分页)
            getRoleMenuPage: function() {
                var _this = this;
    
                let para = {
                    id: this.menuPid,
                    page: this.page,
                    rows: this.pageSize,
                    title: this.filters.name
                };
                
                /*设置签名参数  start  以及公共参数 */
                let obj = this.publicParams;
                let publicParams =  util.publicParam(obj,util);
                /*设置签名参数  END   以及公共参数 */

                this.menuListLoading = true;
                getRoleMenuPage(para,publicParams)
                    .then(res => {
                        if (res.code == 1000) {
                            console.log(res);
                            _this.total = res.result.total;
                            _this.menuList = res.result.list;
                            _this.menuListLoading = false;
                            // //console.log(res.list)
                        } else {
                            this.menuListLoading = false;
                            this.$message({
                                message: "数据获取失败:" + res.msg,
                                type: "error"
                            });
                        }
                        // NProgress.done();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
    
            //显示角色编辑界面
            handleRoleEdit: function(id) {
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
    
                getRoleEdit(para,publicParams)
                    .then(res => {
                        if (res.code == 1000) {
                            console.log(res);
                            this.editRoleForm = res.result;
                        } else {
                            this.$message({
                                message: "数据获取失败:" + res.msg,
                                type: "error"
                            });
                        }
                        // NProgress.done();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
    
            //显示角色新增界面
            handleRoleAdd: function(id) {
                this.addFormVisible = true;
            },
    
            //显示菜单新增界面
            handleMenuAdd: function() {
                if(this.menuPid != ''){
                    this.addForm= {
                        pid:'',
                        menuId:[],
                        id:''
                    };
                    this.addMenuFormVisible = true;
                    var _this = this;
                    let para = {};

                    /*设置签名参数  start  以及公共参数 */
                    let obj = this.publicParams;
                    let publicParams =  util.publicParam(obj,util);
                    /*设置签名参数  END   以及公共参数 */

                    getMenuAdd(para,publicParams).then(res => {
                        console.log(res)
                        if (res.code == 1000) {
                            this.addMenuForm = res.result;
                        } else {
                            this.$message({
                                message: "加载失败" + res.msg,
                                type: "error"
                            });
                        }
                    });
                }else {
                    this.$message({
                        message: "请先选中要添加的角色",
                        type: "warning"
                    });
                }
                
                

            },
    
            //提交角色修改数据
            editRoleSubmit: function() {
                this.$refs.editRoleForm.validate(valid => {
                    if (valid) {
                        this.editLoading = true;
                        //NProgress.start();
                        var actions = {
                            action: "edit"
                        };
                        let para = Object.assign({}, this.editRoleForm, actions);
                       

                        /*设置签名参数  start  以及公共参数 */
                        let obj = this.publicParams;
                        let publicParams =  util.publicParam(obj,util);
                        /*设置签名参数  END   以及公共参数 */
                            
                        //para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        getEditRoleSubmit(para,publicParams).then(res => {
                            this.editLoading = false;
                            if (res.code == 1000) {
                                //NProgress.done();
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
                                this.$refs["editRoleForm"].resetFields();
                                this.editFormVisible = false;
                                this.getRoleList();
                            } else {
                                this.$message({
                                    message: "提交失败" + res.msg,
                                    type: "error"
                                });
                            }
                        });
                    }
                });
            },
            //提交角色新增数据
            addRoleSubmit: function() {
                this.$refs.addRoleForm.validate(valid => {
                    if (valid) {
                        this.addLoading = true;
                        //NProgress.start();
                        var actions = {
                            action: "add"
                        };
                        let para = Object.assign({}, this.addRoleForm, actions);
                        
                        /*设置签名参数  start  以及公共参数 */
                        let obj = this.publicParams;
                        let publicParams =  util.publicParam(obj,util);
                        /*设置签名参数  END   以及公共参数 */

                        //para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        getAddRoleSubmit(para,publicParams).then(res => {
                            this.addLoading = false;
                            if (res.code == 1000) {
                                //NProgress.done();
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
                                this.$refs["addRoleForm"].resetFields();
                                this.addFormVisible = false;
                                this.getRoleList();
                            } else {
                                this.$message({
                                    message: "提交失败" + res.msg,
                                    type: "error"
                                });
                            }
                        });
                    }
                });
            },
    
            //删除角色数据
            handleRoleDel: function(index, row, type) {
                console.log(type);
                this.$confirm("将会删除该目录下所有菜单，您确定这样做吗？", "提示", {
                        type: "warning"
                    })
                    .then(() => {
                        this.listLoading = true;
                        let para = {
                            id: row.id
                        };

                        /*设置签名参数  start  以及公共参数 */
                        let obj = this.publicParams;
                        let publicParams =  util.publicParam(obj,util);
                        /*设置签名参数  END   以及公共参数 */
                        
                        removeRoleList(para,publicParams).then(res => {
                            this.listLoading = false;
                            if (res.code == 1000) {
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                                this.getRoleList();
                            } else {
                                this.$message({
                                    message: "删除失败" + res.msg,
                                    type: "error"
                                });
                            }
                        });
                    })
                    .catch(() => {});
            },
    
            //删除  角色与菜单  的关联关系
            handleDel: function(index, row, type) {
                if(type == 0){
                    this.$confirm("删除目录将会删除目录下所有菜单，确定这样做吗?", "提示", {
                        type: "warning"
                    })
                    .then(() => {
                        this.menuListLoading = true;
                        let para = {
                            id: row.id
                        };

                        /*设置签名参数  start  以及公共参数 */
                        let obj = this.publicParams;
                        let publicParams =  util.publicParam(obj,util);
                        /*设置签名参数  END   以及公共参数 */
                        
                        getRemoveMenu(para,publicParams).then(res => {
                            this.menuListLoading = false;
                            if (res.code == 1000) {
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                                this.getRoleMenu();
                            } else {
                                this.$message({
                                    message: "删除失败" + res.msg,
                                    type: "error"
                                });
                            }
                        });
                    })
                    .catch(() => {});
                }else {
                    this.$confirm("确认删除该记录吗?", "提示", {
                        type: "warning"
                    })
                    .then(() => {
                        this.menuListLoading = true;
                        let para = {
                            id: row.id
                        };
                        
                        /*设置签名参数  start  以及公共参数 */
                        let obj = this.publicParams;
                        let publicParams =  util.publicParam(obj,util);
                        /*设置签名参数  END   以及公共参数 */

                        getRemoveMenu(para,publicParams).then(res => {
                            this.menuListLoading = false;
                            if (res.code == 1000) {
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                                this.getRoleMenu();
                            } else {
                                this.$message({
                                    message: "删除失败" + res.msg,
                                    type: "error"
                                });
                            }
                        });
                    })
                    .catch(() => {});
                }

            },
    
    
            // 提交新增菜单数据
            addMenuSubmit: function() {
                console.log(this.addForm)
               
               this.$refs.addForm.validate(valid => {
                    if (valid) {
                        this.addMenuLoading = true;
                        //NProgress.start();
                        var actions = {
                            id: this.menuPid
                        };
                        let para = Object.assign({}, this.addForm, actions);
                        
                        /*设置签名参数  start  以及公共参数 */
                        let obj = this.publicParams;
                        let publicParams =  util.publicParam(obj,util);
                        /*设置签名参数  END   以及公共参数 */

                        //para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        getAddMenuSubmit(para,publicParams).then(res => {
                            this.addMenuLoading = false;
                            if (res.code == 1000) {
                                //NProgress.done();
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
                                this.$refs["addForm"].resetFields();


                                this.addMenuFormVisible = false;
                                this.getRoleMenuPage();
                            } else {
                                this.$message({
                                    message: "提交失败" + res.msg,
                                    type: "error"
                                });
                            }
                        });
                    }
                });
            },

            //新增菜单 获取二级列表数据
            handleItemChange(val) {
                console.log(val);
                this.addMenuFormChildren = [];
                this.addForm.menuId = [];
                if(val){
                    var para = {
                        id: this.menuPid,
                        pid: val
                    };
                    
                    /*设置签名参数  start  以及公共参数 */
                    let obj = this.publicParams;
                    let publicParams =  util.publicParam(obj,util);
                    /*设置签名参数  END   以及公共参数 */

                    getAddMenuSlect(para,publicParams).then(res => {
                        console.log(res)
                        if (res.code == 1000) {
                            this.addMenuFormChildren = res.result;
                            
                        } else {
                            this.$message({
                                message: "加载失败" + res.msg,
                                type: "error"
                            });
                        }
                    });
                }else {

                }
                
                
            }
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
            this.getRoleList();
        }
    };
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
    
    section {
        height: 100%;
        background-color: #f0f2f5;
    }
    
    .main {
        display: flex;
        flex-direction: row;
    }
    
    .el-aside {
        /* background-color: #F0F2F5; */
        border-right: 1px solid #dfe6ec;
        padding-right: 10px;
    }
    
    .el-main {
        border-left: 1px solid #dfe6ec;
        padding-left: 10px;
        /* background-color: #F0F2F5; */
    }
    
    .el-aside>h2,
    .el-main>h2 {
        margin: 0;
        padding-bottom: 10px;
        font-size: 16px;
        color: #1f2d3d;
        border-bottom: 1px solid #dfe6ec;
    }
    
    .role-dialog {
        width: 50%;
        margin: 0 auto;
    }
    .dialog-main {
        padding-left: 20%;
    }
</style>
