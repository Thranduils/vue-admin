<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background: none; padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.type" placeholder="请选择类别">
						<el-option v-for="item in cateList" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory"></el-option>
						<!-- <el-option value="" label=""></el-option> -->
					</el-select>	
					<!-- <el-input v-model="filters.type" placeholder="请输入类别"></el-input> -->
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入商户名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getQueryFoodshop">查询</el-button>
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
			<el-table-column prop="title" label="商户名称" min-width="140" >
			</el-table-column>
			<el-table-column prop="categoryName" label="类别" width="80" :formatter="getcategoryname" >
			</el-table-column>
			<el-table-column prop="officialScore" label="评分" width="80" >
			</el-table-column>
			<el-table-column prop="dTrustStatus" label="诚信商家" width="100"  :formatter="getTrust">
			</el-table-column>
			<!-- <el-table-column prop="dOnlineStatus" label="联网商家" width="100"  :formatter="getNet">
			</el-table-column>
			<el-table-column prop="areaName" label="所属区域" width="100"  :formatter="getArea">
			</el-table-column>
			<el-table-column prop="openTime" label="开放时间" width="100"  :formatter="getOpenTime">
			</el-table-column>
			<el-table-column prop="isParking" label="有无停车场" width="120"  :formatter="getParking">
			</el-table-column> -->
			<el-table-column prop="isEnabled" label="状态" width="80" >
				<template slot-scope="scope">
					<el-switch v-model="scope.row.isEnabled"  on-color="#ff4949" off-color="#13ce66" on-value="0" off-value="1"  on-text="禁用" off-text="启用" @change="editEnabled(scope.row.id,scope.row.isEnabled)">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column prop="dish" label="菜品" width="80">
				<template slot-scope="scope">
					<el-button size="small" @click="handleDish(scope.row.id)" v-if="scope.row.dish === '0'">新增</el-button>
					<el-button size="small" @click="handleDish(scope.row.id)" type="primary" v-else >查看</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="140">
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
		<el-dialog title="编辑商户" v-model="editFormVisible" :close-on-click-modal="false" width="90%">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="商户名称：" prop="title" >
							<el-input v-model="editForm.title" auto-complete="off"></el-input>
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
						<el-form-item label="详情：">
							<el-input type="textarea" v-model="editForm.content"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!--<el-form-item label="姓名" prop="name">-->
					<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
				<!--</el-form-item>-->
				<el-row>
					<el-col :span="12">
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
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
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="所属区域：" >
							<el-select v-model="editForm.areaCode" placeholder="请选择所属区域" @change="dAreaChange">
								<el-option v-for="item in dAreaForm" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否有停车场：">
							<el-select v-model="editForm.isParking" @change="dParkChange">
								<el-option label="有" value="1" ></el-option>
								<el-option label="无" value="2"></el-option>
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
						<el-form-item label="人均消费：">
							<el-input v-model="editForm.averageSpend" ></el-input>
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
						<el-form-item label="手机号：">
							<el-input v-model="editForm.mobile" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="开放时间：">
							<el-input type="textarea" v-model="editForm.openTime"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="特色：">
							<el-input type="textarea" v-model="editForm.feature"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="链接地址：">
							<el-input v-model="editForm.externalUrl" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="官方评分：">
							<el-input v-model="editForm.officialScore" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="口味评分：">
							<el-input v-model="editForm.tasteScore" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="环境评分：">
							<el-input v-model="editForm.enviScore" ></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="服务评分：" >
							<el-input v-model="editForm.serviceScore" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="价格水平：">
							<el-input v-model="editForm.priceLevel" ></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
				<el-row>
					<el-col :span="12">
						<el-form-item label="诚信商家：">
							<el-select v-model="editForm.dTrustStatus" placeholder="请选择" @change="dTrustChange">
								<el-option label="否" value="1" ></el-option>
								<el-option label="是" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联网商家：">
							<el-select v-model="editForm.dOnlineStatus" placeholder="请选择" @change="dNetChange">
								<el-option label="否" value="0" ></el-option>
								<el-option label="是" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="封面地址：" >
							<el-input v-model="editForm.coverUrl" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="横幅地址：">
							<el-input v-model="editForm.bannerUrl" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="数据来源链接地址：">
							<el-input v-model="editForm.sourceUrl" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据来源id">
							<el-input v-model="editForm.sourceId" ></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

			<!--新增界面-->
		<el-dialog title="新增商户" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="商户名称：" prop="title">
							<el-input v-model="addForm.title" auto-complete="off"></el-input>
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
						<el-form-item label="详情：">
							<el-input type="textarea" v-model="addForm.content"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="类别：" >
							<el-select v-model="addForm.dCategory" placeholder="请选择类别" @change="dCategoryChange">
								<el-option v-for="item in dCategoryForm" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory" ></el-option>
								<!-- <el-option label="类别1" value="1"></el-option>
								<el-option label="类别2" value="2"></el-option> -->
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
						<!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
						<el-form-item label="所属区域：" >
							<el-select v-model="addForm.areaCode" placeholder="请选择所属区域" @change="dAreaChange">
								<el-option v-for="item in dAreaForm" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" ></el-option>
								<!-- <el-option label="区域1" value="1"></el-option>
								<el-option label="区域2" value="2"></el-option> -->
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否有停车场：">
							<el-select v-model="addForm.isParking" placeholder="请选择" @change="dParkChange">
								<!-- <el-option v-for="item in dParkForm" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory" ></el-option> -->
								<el-option label="无" value="2"></el-option>
								<el-option label="有" value="1"></el-option>
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
						<el-form-item label="人均消费：">
							<el-input v-model="addForm.averageSpend" ></el-input>
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
						<el-form-item label="手机号：">
							<el-input v-model="addForm.mobile" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="开放时间：">
							<el-input type="textarea" v-model="addForm.openTime"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="特色：">
							<el-input type="textarea" v-model="addForm.feature"></el-input>
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
						<el-form-item label="链接地址：">
							<el-input v-model="addForm.externalUrl" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="口味评分：">
							<el-input v-model="addForm.tasteScore" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="环境评分：">
							<el-input v-model="addForm.enviScore" ></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="服务评分：" >
							<el-input v-model="addForm.serviceScore" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="价格水平：">
							<el-input v-model="addForm.priceLevel" ></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
				<el-row>
					<el-col :span="12">
						<el-form-item label="诚信商家：">
							<el-select v-model="addForm.dTrustStatus" placeholder="请选择" @change="dTrustChange">
								<!-- <el-option v-for="item in dTrustForm" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory" ></el-option> -->
								<el-option label="否" value="1" ></el-option>
								<el-option label="是" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联网商家：">
							<el-select v-model="addForm.dOnlineStatus" placeholder="请选择" @change="dNetChange">
								<el-option label="否" value="0" ></el-option>
								<el-option label="是" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="封面地址：" >
							<el-input v-model="addForm.coverUrl" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="横幅地址：">
							<el-input v-model="addForm.bannerUrl" ></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="数据来源链接地址：">
							<el-input v-model="addForm.sourceUrl" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据来源id">
							<el-input v-model="addForm.sourceId" ></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--菜品表格-->
		<el-dialog title="餐馆菜品" v-model="dishVisible" :close-on-click-modal="false">
			<el-table :data="dishForm" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="index" label="餐馆ID"  width="80">
				</el-table-column>
				<el-table-column prop="title" label="菜品名称" min-width="140" >
				</el-table-column>
				<el-table-column prop="categoryName" label="类别" width="100" :formatter="formatterDishCategory" >
				</el-table-column>
				<el-table-column prop="originalPrice" label="单价" width="100" :formatter="formatterDishPrice" >
				</el-table-column>
				<el-table-column prop="currentPrice" label="最新价格" width="120" :formatter="formatterDishNewPrice" >
				</el-table-column>
				<el-table-column prop="unit" label="单位" width="120"   :formatter="formatterDishUnit">
				</el-table-column>
				<!-- <el-table-column prop="updateTime" label="更新时间" width="180"  :formatter="formatter4">
				</el-table-column> -->
				<el-table-column label="操作" width="150" >
					<template slot-scope="scope">
						<el-button size="small" @click="dishEdit(scope.row.restaurantId,scope.row.dishId)">编辑</el-button>
						<el-button type="danger" size="small" @click="dishDel(scope.row.restaurantId,scope.row.dishId)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--工具条-->
			<el-col :span="24" class="toolbar" style="background: none;">
				<el-pagination @size-change ="handleSizeChangeDish"  @current-change="handleCurrentChangeDish" :current-page.sync="foodPage" :page-sizes="[10, 20, 30, 40]" :page-size="foodPageSize" layout="sizes, prev, pager, next" :total="dishtotal" style="float: right">
				</el-pagination>
			</el-col>

			<!-- 菜品详情 -->
			<div class="ticketSection" style="margin-top:40px;">
				<h3>新增菜品</h3>
				<el-form :model="tdetailForm" label-width="120px" :rules="tdetailFormRules" ref="tdetailForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="菜品名称：" prop="dishId">
								
								<!-- <el-select v-model="tdetailForm.dishId" placeholder="请选择菜品名称" @change="dishIdChange" :disabled="tdetailForm.dishId != '' && tdetailForm.dCategory !=null"> 
									<el-option v-for="item in dDishIdForm" :key="item.dishId" :label="item.title" :value="item.dishId" ></el-option>
								</el-select> -->

								<el-select v-model="tdetailForm.dishId" clearable  filterable  remote  placeholder="请输入菜品名称关键词" :remote-method="remoteMethod" >
									<el-option v-for="item in dDishIdForm" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>

							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="类别：">
								<!-- <el-input v-model="tdetailForm.dCategory" auto-complete="off"></el-input> -->
								<el-select v-model="tdetailForm.dCategory" placeholder="请选择类别" @change="dishCategoryChange">
									<el-option v-for="item in dDishCategoryForm" :key="item.dCategory" :label="item.categoryName" :value="item.dCategory" ></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="口味：" >
								<el-input v-model="tdetailForm.taste" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="单价：" >
								<el-input v-model="tdetailForm.originalPrice" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="单位：" >
								<el-input v-model="tdetailForm.unit" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="最新价格：" >
								<el-input v-model="tdetailForm.currentPrice" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="优惠价：" >
								<el-input v-model="tdetailForm.discountPrice" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="价格是否随季节变动：">
								<el-select v-model="tdetailForm.isSeasonPrice" placeholder="请选择">
									<el-option label="否" value="0"></el-option>
									<el-option label="是" value="1"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="是否推荐：">
								<el-select v-model="tdetailForm.isRecommend" placeholder="请选择">
									<el-option label="否" value="0"></el-option>
									<el-option label="是" value="1"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editDishForm">重置</el-button>
				<el-button type="primary" @click.native="addDish" :loading="dishLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getFoodshopListPage, removeFoodshop, batchRemoveFoodshop, editFoodshop, addFoodshop, getFoodshopEdit, gethandleDish, editDishDetail, removeDish, gethandleDishDetail,getFoodshopCateList } from '../../api/api';

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
				cateList: [],//
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
					summary: '',
					content: '',
					dCategory: '',
					areaCode: '',
					longitude: '',
					latitude: '',
					addrInfo: '',
					mobile: '',
					telephone: '',
					openTime: '',
					isParking: '',
					dTrustStatus: '',
					dOnlineStatus: '',
					averageSpend: '',
					officialScore: '',
					externalUrl: '',
					feature: '',
					isEnabled: ''
				},
				// 编辑页面类别数据
				dCategoryForm: [],
				dAreaForm: [],
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入商户名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					summary: '',
					content: '',
					dCategory: '',
					areaCode: '',
					longitude: '',
					latitude: '',
					addrInfo: '',
					mobile: '',
					telephone: '',
					openTime: '',
					isParking: '',
					dTrustStatus: '',
					dOnlineStatus: '',
					averageSpend: '',
					officialScore: '',
					externalUrl: '',
					feature: '',
					isEnabled: ''
				},

				dDishCategoryForm: [],
				dDishIdForm: [],//菜品模糊查询显示数据
				dDishIdDataList: [],//菜品总数据整理
				dDishIdData: [],//菜品总数据

				dDishFlag: false,//菜品更新或者新增
				dishVisible: false,//菜品界面是否显示
				dishLoading: false,
				dishtotal: 0,
				foodPage: 1,
                foodPageSize: 10,
				//菜品列表
				dishForm: [],
				// 菜品详情数据
				tdetailForm: {
					restaurantId: '',
					dishId: '',
					title: '',
					dCategory: '',
					unit: '',
					taste: '',
					originalPrice: '',
					currentPrice: '',
					discountPrice: '',
					isSeasonPrice: '',
					isRecommend: ''
				},
				tdetailFormRules: {
					dishId: [
						{ required: true, message: '请选择菜品名称', trigger: 'blur' }
					]
				},
			}
		},
		methods: {
			remoteMethod(query) {
				console.log(query)
				if (query !== '') {
					this.dDishIdForm = this.dDishIdDataList.filter(item => {
						return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
					});
				} else {
					this.dDishIdForm = [];
				}
			},
			//类别、诚信商家、置顶、热点、状态、门票显示转换
			getcategoryname: function (row, column) {
				return row.categoryName ? row.categoryName : '无';
			},
            getTrust: function (row, column) {
                return row.dTrustStatus > 1 ? '是' : '否';
            },
			getNet: function (row, column) {
                return row.dOnlineStatus = 1 ? '是' : '否';
            },
			getArea: function (row, column) {
				return row.areaName ? row.areaName : '无';
			},
			getOpenTime: function (row, column) {
				return row.openTime ? row.openTime : '无';
			},
			getParking: function (row, column) {
                return row.isParking = 1 ? '有' : ( row.isParking = 2 ? '无' : '未知');
			},
			//菜品
			formatterDishCategory: function (row, column) {
				return row.categoryName ? row.categoryName : '无';
			},
			formatterDishPrice: function (row, column) {
				return row.originalPrice ? row.originalPrice : '无';
			},
			formatterDishNewPrice: function (row, column) {
				return row.currentPrice ? row.currentPrice : '无';
			},
			formatterDishUnit: function (row, column) {
				return row.unit ? row.unit : '无';
			},
            editEnabled: function (id, isShow) {
				var _this = this;				
				let para = {
					id: id,
					isEnabled: isShow == false ? '0':'1',
					action: 'edit'
				};
				// console.log(para);
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				editFoodshop(para,publicParams).then((res) => {
					console.log(res);
					if(res.code == 1000) {
						//NProgress.done();
						this.$message({
							message: '修改成功',
							type: 'success'
						});
					}else {
						this.$message({
							message: '修改失败'+res.msg,
							type: 'error'
						});
					}
					
				});
			},
			getQueryFoodshop(){
				this.page = 1;
                this.getFoodshop();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getFoodshop();
			},
            handleSizeChange(val) {
				this.pageSize = val;
				this.page = 1;
                this.getFoodshop();
			},
			dCategoryChange(val){
				this.editForm.dCategory = val
			},
			dAreaChange(val){
				this.editForm.areaCode = val
			},
			dParkChange(val){
				this.editForm.isParking = val
			},
			dTrustChange(val){
				this.editForm.dTrustStatus = val
			},
			dNetChange(val){
				this.editForm.dOnlineStatus = val
			},
			//菜品id下拉点击
			dishIdChange(val){
				this.tdetailForm.dishId = val
			},
			//菜品类型下拉点击
			dishCategoryChange(val){
				this.tdetailForm.dCategory = val
			},
			handleSizeChangeDish(val) {
				this.foodPageSize = val;
				this.foodPage = 1;
                this.handleDish();
			},
			handleCurrentChangeDish(val) {
				this.foodPage = val;
				this.handleDish();
			},
			//获取用户列表
			getFoodshop() {
				var _this = this;
				let para = {
					page: this.page,
					rows: this.pageSize,
					title: this.filters.name,
					dCategory: this.filters.type
				};
				//console.log(para)
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				
				this.listLoading = true;
				getFoodshopListPage(para,publicParams).then((res) => {
					if(res.code == 1000){
						if(res !== null){
							//console.log(res)
							// console.log(this.dishVisible)
							_this.total = res.result.total;
							_this.users = res.result.list;
						}
					}else {
						this.$message({
							message: '数据获取失败:'+res.msg,
							type: 'error'
						});
					}
					_this.listLoading = false;
                    // NProgress.done();
				}).catch((error) => {
					console.log(error);
                });
			},
			getCateList(){
				let para = {};
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				getFoodshopCateList(para,publicParams).then((res) => {
					if(res.code == 1000){
						if(res !== null){
							this.cateList = res.result.dCategoryList;
						}
					}else {
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
					// console.log(para)
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
					removeFoodshop(para,publicParamspara).then((res) => {
						this.listLoading = false;
						if(res.code == 1000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getFoodshop();
						}else {
							this.$message({
								message: '删除失败'+res.msg,
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
				getFoodshopEdit(para,publicParams).then((res) => {
					if(res.code == 1000){
						if(res.result !== null){
							//console.log(res);
							_this.editForm = res.result.data;
							_this.dCategoryForm = res.result.dCategoryList;//类别
							_this.dAreaForm = res.result.areaCodeList;//所属区域
							// _this.dParkForm = res.result.partList;//是否有停车场
							// _this.dTrustForm = res.result.partList;//诚信商家
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
				getFoodshopEdit(para,publicParams).then((res) => {
					if(res.code == 1000){
						if(res.result !== null){
							//console.log(res);
							_this.dCategoryForm = res.result.dCategoryList;//类别
							_this.dAreaForm = res.result.areaCodeList;//所属区域
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
					summary: '',
					content: '',
					dCategory: '',
					areaCode: '',
					longitude: '',
					latitude: '',
					addrInfo: '',
					mobile: '',
					telephone: '',
					openTime: '',
					isParking: '',
					dTrustStatus: '',
					dOnlineStatus: '',
					averageSpend: '',
					officialScore: '',
					externalUrl: '',
					feature: '',
					isEnabled: ''
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
							console.log(this.editForm.id);
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editFoodshop(para,publicParams).then((res) => {
								this.editLoading = false;
								if(res.code == 1000) {
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getFoodshop();
								}else {
									this.$message({
										message: '提交失败'+res.msg,
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
							//console.log(para);
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addFoodshop(para,publicParams).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								if(res.code == 1000) {
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getFoodshop();
								}else {
									this.$message({
										message: '提交失败'+res.msg,
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
					batchRemoveFoodshop(para,publicParams).then((res) => {
						this.listLoading = false;
						console.log(this.listLoadingpara);
						if(res.code == 1000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getFoodshop();
						}else {
							this.$message({
								message: '删除失败'+res.msg,
								type: 'error'
							});
						}
						
					});
				}).catch(() => {

				});
			},
			dishDel: function (restaurantId,dishId) {
				//console.log(id,scenicId);
				var _this = this;
				this.$confirm('确认删除该菜品记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { restaurantId: restaurantId ,dishId: dishId};
					console.log(para)
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
					removeDish(para,publicParams).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						if(res.code == 1000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.handleDish(_this.tdetailForm.restaurantId);
							// _this.getFoodshop();
						}else {
							this.$message({
								message: '删除失败'+res.msg,
								type: 'error'
							});
						}
					});
				}).catch(() => {

				});
			},
			// 显示菜品界面
			handleDish: function (id) {
				var _this = this;
				_this.dishForm = [];
				_this.editDishForm();
				let para = {
					page: this.foodPage,
					rows: this.foodPageSize,
					restaurantId: id
				};
				this.tdetailForm.restaurantId = id;
	
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				
				gethandleDish(para,publicParams).then((res) => {
					if(res.code == 1000){
						this.dishVisible = true;
						if(res.result !== null){
							_this.dishtotal = res.result.total;
							_this.dishForm = res.result.list
						}
					}else {
						this.$message({
							message: '数据获取失败:'+res.msg,
							type: 'error'
						});
					}
				}).catch((error) => {
					console.log(error);
				});
				//获取下拉值
				this.dishEdit(null,null);
			},
			// 显示菜品详情
			dishEdit:function(restaurantId,dishId){
				// this.tdetailForm = row;
				var _this = this;
				let para = {
					restaurantId: restaurantId,
					dishId: dishId
				};
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
				console.log(para);
				gethandleDishDetail(para,publicParams).then((res) => {
					if(res.code == 1000){
						// this.dishVisible = true;
						if(res.result !== null){
							this.dDishFlag = true;
							res.result.data?(_this.tdetailForm = res.result.data):this.editDishForm();
							_this.dDishCategoryForm = res.result.dCategoryList;

							_this.dDishIdData = res.result.dishList;//菜品id总数据
							_this.dDishIdDataList = _this.dDishIdData.map(item => {
								return { value: item.dishId, label: item.title };
							});

							//_this.dDishIdForm = res.result.dishList;//菜品id列表
						}
					}else {
						this.$message({
								message: '数据获取失败:'+res.msg,
								type: 'error'
							});
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			// 重置菜品详情
			editDishForm:function(){
				this.dDishFlag = false;
				this.tdetailForm = {
					restaurantId: this.tdetailForm.restaurantId,
					dishId: '',
					title: '',
					dCategory: '',
					unit: '',
					taste: '',
					originalPrice: '',
					currentPrice: '',
					discountPrice: '',
					isSeasonPrice: '',
					isRecommend: ''
				};
			},
			// 提交菜品数据（增加or修改）
			addDish:function(){
				var _this = this;
				if(this.dDishFlag) {
					// 修改菜品
					this.$refs.tdetailForm.validate((valid) => {
						if (valid) {
							this.$confirm('确认提交吗？', '提示', {}).then(() => {
								this.dishLoading = true;
								
								var actions = {action:'edit'};
								let para = Object.assign({}, this.tdetailForm , actions);
								console.log(para);
								/*设置签名参数  start  以及公共参数 */
								let obj = this.publicParams;
								var publicParams =  util.publicParam(obj,util);
								/*设置签名参数  END   以及公共参数 */
								editDishDetail(para,publicParams).then((res) => {
									this.dishLoading = false;
									if(res.code == 1000) {
										this.dDishFlag = false;
										//NProgress.done();
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['tdetailForm'].resetFields();
										// this.dishVisible = false;
										this.handleDish(_this.tdetailForm.restaurantId);
										this.editDishForm();
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
					// 新增菜品
					this.$refs.tdetailForm.validate((valid) => {
						if (valid) {
							this.$confirm('确认提交吗？', '提示', {}).then(() => {
								this.dishLoading = true;
								var actions = {action:'add'};
								let para = Object.assign({}, this.tdetailForm , actions);
								console.log(para);
				/*设置签名参数  start  以及公共参数 */
				let obj = this.publicParams;
				var publicParams =  util.publicParam(obj,util);
				/*设置签名参数  END   以及公共参数 */
								editDishDetail(para,publicParams).then((res) => {
									this.dishLoading = false;
									if(res.code == 1000) {
										this.dDishFlag = false;
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['tdetailForm'].resetFields();
										this.editFormVisible = false;
										this.handleDish(_this.tdetailForm.restaurantId);
										this.editDishForm();
										// this.getFoodshop();
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
			this.getCateList();
			this.getFoodshop();
		}
	}

</script>


