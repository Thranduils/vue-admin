<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none; padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入景区名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getQueryScenic">查询</el-button>
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
			<el-table-column prop="title" label="景区名称" min-width="140" >
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
				</template>
			</el-table-column>
			<el-table-column prop="ticket" label="门票" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleTicket(scope.row.id)"  v-if="scope.row.ticket === '0'">新增</el-button>
					<el-button size="small" @click="handleTicket(scope.row.id)" type="primary" v-else >查看</el-button>
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
		<el-dialog title="编辑景区" v-model="editFormVisible" :close-on-click-modal="false" width="90%">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="景区名称：" >
							<el-input v-model="editForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!--<el-form-item label="姓名" prop="name">-->
					<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
				<!--</el-form-item>-->
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="类别" prop="dCategory">
							<el-select v-model="editForm.dCategory" placeholder="请选择景区类别" @change="dCategoryChange">
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
						<el-form-item label="建议游玩时间：" >
							<el-input v-model="editForm.playTime" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="诚信商家" >
							<el-select v-model="editForm.trustId" placeholder="请选择是否是诚信商家" @change="editChange">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="门票优惠信息">
							<el-input type="textarea" v-model="editForm.ticketInfo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="开放时间">
							<el-input type="textarea" v-model="editForm.openTime"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="交通信息：">
							<el-input v-model="editForm.trafficeInfo" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="评分：">
							<el-input v-model="editForm.officialScore" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="评价等级：" >
							<el-input v-model="editForm.dGrade" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="链接地址：">
							<el-input v-model="editForm.externalUrl" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="状态标识" >
							<el-select v-model="editForm.isEnabled" placeholder="请选择状态" @change="editChange">
								<el-option label="启用" value="1"></el-option>
								<el-option label="禁用" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="景区容量：">
							<el-input v-model="editForm.capacity" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="特色">
							<el-input type="textarea" v-model="editForm.feature"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="评论标签">
							<el-input type="textarea" v-model="editForm.commentLabel"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="简介">
							<el-input type="textarea" v-model="editForm.summary"></el-input>
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
		<el-dialog title="新增景区" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="景区名称：" prop="title">
							<el-input v-model="addForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!--<el-form-item label="姓名" prop="name">-->
				<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
				<!--</el-form-item>-->
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="类别"  prop="dCategory">
							<el-select v-model="addForm.dCategory" placeholder="请选择景区类别">
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
						<el-form-item label="建议游玩时间：" >
							<el-input v-model="addForm.playTime" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="诚信商家" >
							<el-select v-model="addForm.trustId" placeholder="请选择是否是诚信商家" @change="editChange">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="门票优惠信息">
							<el-input type="textarea" v-model="addForm.ticketInfo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="开放时间">
							<el-input type="textarea" v-model="addForm.openTime"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="交通信息：">
							<el-input v-model="addForm.trafficeInfo" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="评分：">
							<el-input v-model="addForm.officialScore" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="评价等级：" >
							<el-input v-model="addForm.dGrade" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="链接地址：">
							<el-input v-model="addForm.externalUrl" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="状态标识" >
							<el-select v-model="addForm.status" placeholder="请选择诚信" @change="addChange">
								<el-option label="启用" value="1"></el-option>
								<el-option label="禁用" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="景区容量：">
							<el-input v-model="addForm.capacity" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="特色">
							<el-input type="textarea" v-model="addForm.feature"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="评论标签">
							<el-input type="textarea" v-model="addForm.commentLabel"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="简介">
							<el-input type="textarea" v-model="addForm.summary"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--门票表格-->
		<el-dialog title="景区门票" v-model="ticketVisible" :close-on-click-modal="false">
			<el-table :data="ticketForm" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="index" label="景区ID"  width="80">
				</el-table-column>
				<el-table-column prop="title" label="门票名称" min-width="140" >
				</el-table-column>
				<el-table-column prop="originalPrice" label="原价" width="100" :formatter="formatter1" >
				</el-table-column>
				<el-table-column prop="currentPrice" label="现价" width="100" :formatter="formatter2" >
				</el-table-column>
				<el-table-column prop="discountPrice" label="折扣价" width="120" :formatter="formatter3" >
				</el-table-column>
				<el-table-column prop="isEntrance" label="是否大门票" width="120"   :formatter="formatter5">
				</el-table-column>
				<el-table-column prop="isCoupon" label="是否联票" width="100"  :formatter="formatter6">
				</el-table-column>
				<el-table-column prop="isSupportQr" label="扫码入园" width="100"  :formatter="formatter7">
				</el-table-column>
				<el-table-column prop="updateTime" label="更新时间" width="180"  :formatter="formatter4">
				</el-table-column>
				<el-table-column label="操作" width="150" >
					<template slot-scope="scope">
						<el-button size="small" @click="chicketEdit(scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="chicketDel(scope.row.id,scope.row.scenicId)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 门票详情 -->
			<div class="ticketSection" style="margin-top:40px;">
				<h3>编辑门票</h3>
				<el-form :model="tdetailForm" label-width="120px" :rules="tdetailFormRules" ref="tdetailForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="门票名称：" prop="title">
								<el-input v-model="tdetailForm.title" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="链接地址：" >
								<el-input v-model="tdetailForm.externalUrl" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="原价：" >
								<el-input v-model="tdetailForm.originalPrice" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="现价：" >
								<el-input v-model="tdetailForm.currentPrice" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="折扣价：" >
								<el-input v-model="tdetailForm.discountPrice" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<!-- <el-col :span="12">
							<el-form-item label="更新时间：" >
								<el-input v-model="tdetailForm.updateTime" auto-complete="off"></el-input>
							</el-form-item>
						</el-col> -->
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="是否是联票" prop="isCoupon" >
								<el-select v-model="tdetailForm.isCoupon" placeholder="请选择是否联票" @change="tciketChange1">
									<el-option label="是" value="1"></el-option>
									<el-option label="否" value="2"></el-option>
									<el-option label="未知" value="0"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="是否是大门票" prop="isEntrance" >
								<el-select v-model="tdetailForm.isEntrance" placeholder="请选择是否大门票" @change="tciketChange2">
									<el-option label="是" value="1"></el-option>
									<el-option label="否" value="2"></el-option>
									<el-option label="未知" value="0"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="是否支持扫码" prop="isSupportQr" >
								<el-select v-model="tdetailForm.isSupportQr" placeholder="请选择诚信" @change="tciketChange3">
									<el-option label="支持" value="1"></el-option>
									<el-option label="不支持" value="2"></el-option>
									<el-option label="未知" value="0"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editTdetailForm">重置</el-button>
				<el-button type="primary" @click.native="addChicket" :loading="chicketLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util';
	import CryptoJS from 'crypto-js';
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, editAble, addUser,gethandleEdit,gethandleAdd,gethandleTicket,removeTicket,editdetailForm} from '../../api/api';
import { type } from 'os';

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
						{ required: true, message: '请输入景区名称', trigger: 'blur' }
					],
					dCategory: [
						{ required: true, message: '请选择景区类别', trigger: 'blur' }
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
				dCategoryForm: [],
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入景区名称', trigger: 'blur' }
					],
					dCategory: [
						{ required: true, message: '请选择景区类别', trigger: 'blur' }
					]
				},
				//新增界面数据
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
					// {
					// 	id: '',
					// 	scenicId:'',
					// 	title: '',
					// 	originalPrice: '',
					// 	currentPrice: '',
					// 	discountPrice: '',
					// 	isEntrance: '',
					// 	isCoupon: '',
					// 	isSupportQr: '',
					// 	updateTime: '',
					// 	externalUrl: ''
					// }
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
				var _this = this;				
				let para = {
					id: id,
					isEnabled: status,
					action: 'edit'
				};
			


				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */

				editAble(para,publicParams).then((res) => {
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
				this.editForm.status = val;
			},
			addChange: function (val) {
				this.addForm.status = val;
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
			getQueryScenic(){
				this.page = 1;
                this.getUsers();
			},
			dCategoryChange(val){
				this.editForm.dCategory = val;
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

				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */

				this.listLoading = true;

				getUserListPage(para,publicParams).then((res) => {
					if(res.code == 1000){
						if(res !== null){
							//console.log(res.result)
							_this.total = res.result.total;
							_this.users = res.result.list;
							_this.listLoading = false;
						}
					}else if(res.code == 2101){
						_this.$router.push('/login');
					}else {
						//console.log(res);
						//console.log(res.code);

						this.$message({
							message: '数据获取失败:'+res.msg,
							type: 'error'
						});
						_this.listLoading = false;
						//_this.$router.push('/login');
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

					/*设置签名参数  start  以及公共参数 */
					let obj = this.publicParams;
					let publicParams =  util.publicParam(obj,util);
					/*设置签名参数  END   以及公共参数 */
					
					removeUser(para,publicParams).then((res) => {
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
			},
			// 删除门票
			chicketDel: function (id,scenicId) {
				//console.log(id,scenicId);
				var _this = this;
				this.$confirm('确认删除该门票记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: id };
					var scenicId = scenicId;
					this.editTdetailForm();
					/*设置签名参数  start  以及公共参数 */
					let obj = this.publicParams;
					let publicParams =  util.publicParam(obj,util);
					/*设置签名参数  END   以及公共参数 */
					removeTicket(para,publicParams).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						if(res.code == 1000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.handleTicket(_this.tdetailForm.scenicId);
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
				
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */


				gethandleEdit(para,publicParams).then((res) => {
					// console.log(res)
					if(res.code == 1000){
						if(res.result !== null){
							// console.log(res);
							_this.editForm = res.result.data;
							_this.dCategoryForm = res.result.categoryList;
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
				let para = {};
				//console.log(para)

				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */


				gethandleAdd(para,publicParams).then((res) => {
					// console.log(res)
					if(res.code == 1000){
						if(res.result !== null){
							_this.dCategoryForm = res.result;
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
			// 显示门票界面
			handleTicket: function (id) {
				if(!this.ticketVisible){
					this.chicketLoading = false;
				}
				var _this = this;
				let para = {
					scenicId: id
				};
				this.tdetailForm.scenicId = id;
				
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				let publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */

				gethandleTicket(para,publicParams).then((res) => {
					
					if(res.code == 1000){
						this.ticketVisible = true;
						if(res.result !== null){
							//console.log(res.result);
							_this.ticketForm = res.result
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
			// 显示门票详情
			chicketEdit:function(row,scenicId){
				this.tdetailForm = row;
			},
			// 重置门票详情
			editTdetailForm:function(){
				this.tdetailForm = {
					id: '',
					scenicId:this.tdetailForm.scenicId,
					title: '',
					originalPrice: '',
					currentPrice: '',
					discountPrice: '',
					isEntrance: '',
					isCoupon: '',
					isSupportQr: '',
					updateTime: '',
					externalUrl: ''
				};
			},
			// 提交门票数据（增加or修改）
			addChicket:function(){
				var _this = this;
				let isEdit = this.tdetailForm.id;

				if(isEdit === '' || isEdit === null) {
					// 新增门票
					this.$refs.tdetailForm.validate((valid) => {
						if (valid) {
							this.$confirm('确认提交吗？', '提示', {}).then(() => {
								this.chicketLoading = true;
								var actions = {action:'add'};
								let para = Object.assign({}, this.tdetailForm , actions);

								/*设置签名参数  start  以及公共参数 */
								let obj = this.publicParams;
								let publicParams =  util.publicParam(obj,util);
								/*设置签名参数  END   以及公共参数 */

								editdetailForm(para,publicParams).then((res) => {
									this.chicketLoading = false;
									if(res.code == 1000) {
										//NProgress.done();
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['tdetailForm'].resetFields();
										this.editFormVisible = false;
										this.handleTicket(_this.tdetailForm.scenicId);
										this.editTdetailForm();
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
				}else {
					// 修改门票
					this.$refs.tdetailForm.validate((valid) => {
						if (valid) {
							this.$confirm('确认提交吗？', '提示', {}).then(() => {
								this.chicketLoading = true;
								var actions = {action:'edit'};
								let para =  Object.assign({}, this.tdetailForm , actions);

								/*设置签名参数  start  以及公共参数 */
								let obj = this.publicParams;
								let publicParams =  util.publicParam(obj,util);
								/*设置签名参数  END   以及公共参数 */

								editdetailForm(para,publicParams).then((res) => {
									this.chicketLoading = false;
									if(res.code == 1000) {
										//NProgress.done();
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['tdetailForm'].resetFields();
										this.editFormVisible = false;
										this.handleTicket(_this.tdetailForm.scenicId);
										this.editTdetailForm();
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
				}
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					// console.log(valid)
					// console.log(this.editForm)
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							var actions = {action:'edit'};
							let para = Object.assign({}, this.editForm , actions);
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							
							/*设置签名参数  start  以及公共参数 */
							let obj = this.publicParams;
							let publicParams =  util.publicParam(obj,util);
							/*设置签名参数  END   以及公共参数 */
							
							editUser(para,publicParams).then((res) => {
								this.editLoading = false;
								if(res.code == 1000) {
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.getUsers();
								}else if(res.code == 2101){
									_this.$router.push('/login');
								}else {
									this.$message({
										message: '提交失败:'+res.msg,
										type: 'error'
									});
								}
								this.editFormVisible = false;
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
							
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							
							/*设置签名参数  start  以及公共参数 */
							let obj = this.publicParams;
							let publicParams =  util.publicParam(obj,util);
							/*设置签名参数  END   以及公共参数 */

							addUser(para,publicParams).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								if(res.code == 1000) {
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.getUsers();
								}else {
									this.$message({
										message: '提交失败:'+res.msg,
										type: 'error'
									});
									this.addForm = '';
								}
								this.addFormVisible = false;
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
					//console.log(ids);
					let para = { ids: ids };
					
					/*设置签名参数  start  以及公共参数 */
					let obj = this.publicParams;
					let publicParams =  util.publicParam(obj,util);
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

<style>
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
	@media screen and (max-height: 720px) {
		.el-dialog__body {
			max-height: 300px;
			overflow-y: auto;
		}
	}
	
</style>
