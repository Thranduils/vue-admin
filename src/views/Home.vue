<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
            <el-col :span="24" class="breadcrumb-container">
                <!--<strong class="title">{{$route.name}}</strong>-->
                <el-breadcrumb separator="/" class="breadcrumb-inner">
                    <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                        {{ item.name }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
			<!--<el-col :span="10">-->
				<!--<div class="tools" @click.prevent="collapse">-->
					<!--<i class="fa fa-align-justify"></i>-->
				<!--</div>-->
			<!--</el-col>-->
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown" class="down_menu">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in datas" v-if="!item.hidden">
						<el-submenu :index="index+''" >
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<!-- <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item> -->
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<!--<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">-->
					<!--<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">-->
						<!--<template v-if="!item.leaf">-->
							<!--<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>-->
							<!--<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> -->
								<!--<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>-->
							<!--</ul>-->
						<!--</template>-->
						<!--<template v-else>-->
							<!--<li class="el-submenu">-->
								<!--<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>-->
							<!--</li>-->
						<!--</template>-->
					<!--</li>-->
				<!--</ul>-->
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<!--<el-col :span="24" class="breadcrumb-container">-->
						<!--<strong class="title">{{$route.name}}</strong>-->
                        <!--<el-breadcrumb separator="/" class="breadcrumb-inner">-->
                            <!--<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">-->
                                <!--{{ item.name }}-->
                            <!--</el-breadcrumb-item>-->
                        <!--</el-breadcrumb>-->
					<!--</el-col>-->
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import util from '../common/js/util'
	import CryptoJS from 'crypto-js';
    import { getUserBash } from '../api/api';
	export default {
		data() {
			return {
				publicParams: {
                    secretKey :'',
                    secretId:'',
                    token:'',
                    sign:''
                },
				sysName:'三亚旅游场监管平台',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				token:'',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				datas:[
                    // {
                    //     path: '/base',
                    //     name: '基础资源库',
                    //     iconCls: 'el-icon-menu',//图标样式class
                    //     children: [
                    //         { path: '/main', name: '主页' },
                    //         { path: '/scenic', name: '景区管理' },
                    //     ]
					// }
				// 	,
                //     {
                //         path: '/',
                //         name: '用户管理',
                //         iconCls: 'fa fa-id-card-o',
                //         children: [
                //             { path: '/page4', name: '页面4' },
                //             { path: '/page5',  name: '页面5' }
                //         ]
                //     },
                //     {
                //         path: '/',
                //         name: '系统管理',
                //         iconCls: 'el-icon-setting',
                //         children: [
                //             { path: '/page6',  name: '页面6' }
                //         ]
                //     },
                //     {
                //         path: '/',
                //         name: '',
                //         leaf: true,//只有一个节点
                //         iconCls: 'fa fa-bar-chart',
                //         children: [
                //             { path: '/echarts',  name: 'echarts' }
                //         ]
                //     },
                //     {
                //         path: '*',
                //         hidden: true,
                //         redirect: { path: '/404' }
                //     }
                ]
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen(key,keyPath) {
				//console.log(key, keyPath);
			},
			handleclose(key,keyPath) {
				//console.log(key, keyPath);
			},
			handleselect: function (a, b) {
			},
			//获取导航菜单
            getBase: function(){
                let paras = {};
				/*设置签名参数  start  以及公共参数 */
				let obj = Object.assign({},{secretId:this.publicParams.secretId} , {nonce:util.guid()} ,{timestamp:new Date() * 1});
				if(this.publicParams.token !== '') {
					obj = Object.assign(obj, {token:this.publicParams.token});
				}
				//console.log(obj)
				let str = util.objKeySort(obj);
				let secretKey  = this.publicParams.secretKey;
				let sign = CryptoJS.HmacSHA256(str,secretKey)+'';

				var publicParams = Object.assign(obj, {sign:sign});
				// console.log(publicParams)

				/*设置签名参数  END   以及公共参数 */



                getUserBash(paras, publicParams).then((res) => {
					if(res.code == 1000) {
						if (res!==null && res !== [] && res !== "") {
							this.datas = res.result;
						}
					}else {
						this.$message({
							message: res.msg,
							type: 'error'
						});
					}
					
                    // NProgress.done();
                }).catch((error) => {
                    console.log(error);
                });
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('result');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user!==null) {
				user = JSON.parse(user);
				//console.log(user.token)
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
				this.publicParams.token = user.token;
			}
			var secret = sessionStorage.getItem('secret');
			if(secret !== null) {
				secret = JSON.parse(secret);
				this.publicParams.secretId = secret.secretId;
				this.publicParams.secretKey = secret.secretKey;
			}
            this.getBase();
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		background: #f0f2f5;
        overflow: hidden;
		.header {
			z-index: 1;
            position: relative;
			height: 60px;
			line-height: 60px;
            background: #fff;
            -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
            box-shadow: 0 1px 4px rgba(0,21,41,.08);
			color:#000;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .breadcrumb-container {
                position: absolute;
                left: 230px;
                /*width: 200px;*/
                //margin-bottom: 15px;
                /*display: flex;*/
                /*flex-direction: row;*/
                /*justify-content: flex-start;*/
                /*.title {*/
                    /*width: 200px;*/
                    /*float: left;*/
                    /*color: #475669;*/
                /*}*/
                .breadcrumb-inner {
                    padding-left: 20px;
                    padding-top: 25px;
                }
            }
			.userinfo {
				text-align: right;
				padding-right: 35px;


				.userinfo-inner {
					cursor: pointer;
					color:#000;
					img {
						width: 30px;
						height: 30px;
						border-radius: 15px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				background: #002140;
				height:60px;
				font-size: 20px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
                color: #fff;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
                box-shadow: 4px 0px 2px rgba(0, 21, 41, 0.1);
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
                box-shadow: 4px 0px 2px rgba(0, 21, 41, 0.1);
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				background: #001529;
				overflow-y:  auto;
				.el-menu{
					height: 100%;
					background: #001529;
                    color: #A6ADB4;
                    border-radius: 0;
                    .el-menu-item {
                        color: #A6ADB4;
                    }
                    .el-menu-item:hover{ color:#fff; }

                    /*.el-submenu {*/
                        /*color: #A6ADB4;*/
                        /*.el-menu-item {*/
                            /*background-color: #000c17;*/
                        /*}*/
                        /*.is-active {*/
                            /*background: #2592FC;*/
                            /*color: #fff;*/
                        /*}*/
                        /*.el-menu-item:hover {*/
                            /*color:#fff;*/
                        /*}*/
                    /*}*/
				}
                .el-submenu {
                    color: #A6ADB4;
                    .el-menu-item {
                        background-color: #000c17;
                    }
                    .is-active {
                        background: #2592FC;
                        color: #fff;
                    }
                }
                .collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			aside {
				-ms-overflow-style:none;
				overflow:-moz-scrollbars-none;
			}
			aside::-webkit-scrollbar{width:0px}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				/*.breadcrumb-container {*/
					/*//margin-bottom: 15px;*/
					/*.title {*/
						/*width: 200px;*/
						/*float: left;*/
						/*color: #475669;*/
					/*}*/
					/*.breadcrumb-inner {*/
						/*float: left;*/
					/*}*/
				/*}*/
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
	.down_menu {
		z-index: 9999 !important;
	}
</style>
<style>
    .el-submenu__title{color:#A6ADB4;}
    .el-submenu__title:hover, .el-menu-item:hover{ background:none; color:#fff;}
</style>