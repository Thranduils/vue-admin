import axios from 'axios'
import util from '../common/js/util'
let axiosInstance = axios.create()

/*静态请求数据*/
axiosInstance.defaults.timeout = 3000
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axiosInstance.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8'

/*请求数据拦截器*/
axiosInstance.requestData = function(config) {
    return config
}

/*返回数据拦截器*/
axiosInstance.responseData = function(response) {
    return response
}

/*请求异常处理*/
axiosInstance.error = function(error) {
    return error
}

// /*请求拦截器*/
// axiosInstance.interceptors.request.use(function (config) {
//     if()
// })

let $http = axios.create()

// let base = 'http://192.168.0.198:8080/manager'
let base = ''


export const getUserList = (params, publicParams) => {
    $http.defaults.headers.nonce = util.guid()
    $http.defaults.headers.timestamp = new Date() * 1
    return axios.post(`${base}/user/list`, { params: params })
}

export const setHeader = (publicParams) => {
    $http.defaults.headers.nonce = publicParams.nonce
    $http.defaults.headers.timestamp = publicParams.timestamp
    $http.defaults.headers.secretId = publicParams.secretId
    $http.defaults.headers.token = publicParams.token
    $http.defaults.headers.sign = publicParams.sign
}

/***********************************************/
// 登录获取鉴权 
export const getSecret = (params, publicParams) => {
    $http.defaults.headers.nonce = util.guid()
    $http.defaults.headers.timestamp = new Date() * 1
    return axios.post(`${base}/ajax/auth/nt/secret`, params).then(res => res.data)
}

// 登录页 
export const requestLogin = (params, publicParams) => {
    $http.defaults.headers.nonce = publicParams.nonce
    $http.defaults.headers.timestamp = publicParams.timestamp
    $http.defaults.headers.secretId = publicParams.secretId
    $http.defaults.headers.token = ''
    $http.defaults.headers.sign = publicParams.sign
    return axios.post(`${base}/ajax/auth/dologin`, params).then(res => res.data)
}

// 获取景区列表
export const getUserListPage = (params, publicParams) => {

    setHeader(publicParams)

    return axios.post(`${base}/ajax/scenic/list`, params).then(res => res.data)
}

// 获取左侧菜单栏
export const getUserBash = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/auth/menu`, params).then(res => res.data)
}

// 编辑获取数据
export const gethandleEdit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/scenic/detail`, params).then(res => res.data)
}

// 新增获取数据
export const gethandleAdd = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/scenic/category`, params).then(res => res.data)
}

// 编辑提交数据
export const editUser = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/scenic/modify`, params).then(res => res.data)
}

// 新增提交数据
export const addUser = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/scenic/modify`, params).then(res => res.data)
}

// 启用禁用
export const editAble = (params, publicParams) => {
    setHeader(publicParams)

    return axios.post(`${base}/ajax/scenic/disable`, params).then(res => res.data)
}

// 删除数据
export const removeUser = (params, publicParams) => {
    setHeader(publicParams)

    return axios.post(`${base}/ajax/scenic/delete`, params).then(res => res.data)
}

// 批量删除数据
export const batchRemoveUser = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/scenic/delete/many`, params).then(res => res.data)
}

/**************************************************************************/
// 门票获取数据
export const gethandleTicket = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/scenic/ticket`, params).then(res => res.data)
}

// 修改门票or添加门票
export const editdetailForm = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/scenic/ticket/modify`, params).then(res => res.data)
}

// 删除门票
export const removeTicket = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/scenic/ticket/delete`, params).then(res => res.data)
}

/***************************************************************************/




/***************************************************************************/
/***************                       餐馆                  ***************/
/***************************************************************************/

// 获取商户列表
export const getFoodshopListPage = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/list`, params).then(res => res.data)
    }
    // 编辑获取数据
export const getFoodshopEdit = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/detail`, params).then(res => res.data)
    }
    // 编辑提交数据
export const editFoodshop = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/modify`, params).then(res => res.data)
    }
    // 新增提交数据
export const addFoodshop = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/modify`, params).then(res => res.data)
    }
    // 删除数据
export const removeFoodshop = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/del`, params).then(res => res.data)
    }
    // 批量删除数据
export const batchRemoveFoodshop = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/food/restaurant/del/many`, params).then(res => res.data)
}

// 菜品获取数据
export const gethandleDish = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/dish/relation/list`, params).then(res => res.data)
    }
    // 获取菜品详细数据
export const gethandleDishDetail = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/dish/relation/detail`, params).then(res => res.data)
    }
    // 修改菜品or添加菜品
export const editDishDetail = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/dish/relation/modify`, params).then(res => res.data)
    }
    // 删除菜品
export const removeDish = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/dish/relation/del`, params).then(res => res.data)
    }
    // 餐馆分类ajaxajaxajax
export const getFoodshopCateList = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/food/restaurant/category/list`, params).then(res => res.data)
    }
    /***************************************************************************/

/***************************************************************************/
/***************                       酒店                  ***************/
/***************************************************************************/
// 获取酒店列表
export const getUserListPage2 = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/hotel/entity/list`, params).then(res => res.data)
}

// 酒店编辑获取数据
export const gethandleEdit2 = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/hotel/detail`, params).then(res => res.data)
}

// 酒店新增获取数据
export const gethandleAdd2 = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/hotel/category/area`, params).then(res => res.data)
}

// 酒店编辑提交数据
export const editUser2 = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/hotel/modify`, params).then(res => res.data)
}

// 启用禁用
export const editAble2 = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/hotel/disable`, params).then(res => res.data)
}

// 酒店新增提交数据
export const addUser2 = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/hotel/modify`, params).then(res => res.data)
}

// 删除酒店数据
export const removeUser2 = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/hotel/delete`, params).then(res => res.data)
    }
    /***************************************************************************/

/***************************************************************************/
/***************                      购物点               ******************/
/***************************************************************************/
// 获取列表
export const getShopPointListPage = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/shopping/mall/list`, params).then(res => res.data)
    }
    // 编辑获取数据
export const getShopPointEdit = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/shopping/mall/detail`, params).then(res => res.data)
    }
    // 编辑提交数据
export const editShopPoint = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/shopping/mall/modify`, params).then(res => res.data)
    }
    // 新增提交数据
export const addShopPoint = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/shopping/mall/modify`, params).then(res => res.data)
    }
    // 删除数据
export const removeShopPoint = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/shopping/mall/del`, params).then(res => res.data)
    }
    // 批量删除数据
export const batchRemoveShopPoint = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/shopping/mall/del/many`, params).then(res => res.data)
    }
    /*********************************购物点end**********************************/

/***************************************************************************/
/***************                      健康疗养               ******************/
/***************************************************************************/
// 获取列表
export const getHealthListPage = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/hotel/health/list`, params).then(res => res.data)
    }
    // 编辑获取数据
export const getHealthEdit = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/hotel/health/detail`, params).then(res => res.data)
    }
    // 编辑提交数据
export const editHealth = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/hotel/health/modify`, params).then(res => res.data)
    }
    // 新增提交数据
export const addHealth = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/hotel/health/modify`, params).then(res => res.data)
    }
    // 删除数据
export const removeHealth = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/hotel/health/del`, params).then(res => res.data)
    }
    // 批量删除数据
export const batchRemoveHealth = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/hotel/health/del/many`, params).then(res => res.data)
    }
    /*********************************健康疗养 end*******************************/

/***************************************************************************/
/***************                      美丽乡村               ******************/
/***************************************************************************/
// 获取列表
export const getCountrysideListPage = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/countryside/list`, params).then(res => res.data)
    }
    // 编辑获取数据
export const getCountrysideEdit = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/countryside/detail`, params).then(res => res.data)
    }
    // 编辑提交数据
export const editCountryside = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/countryside/modify`, params).then(res => res.data)
}

// 启用禁用
export const editCountryAble = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/countryside/disable`, params).then(res => res.data)
    }
    // 新增提交数据
export const addCountryside = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/countryside/modify`, params).then(res => res.data)
    }
    // 删除数据
export const removeCountryside = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/countryside/delete`, params).then(res => res.data)
    }
    // 批量删除数据
export const batchRemoveCountryside = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/countryside/delete`, params).then(res => res.data)
    }
    /*********************************美丽乡村 end*******************************/

/***************************************************************************/
/***************                      婚纱摄影               ******************/
/***************************************************************************/
// 获取列表
export const getWeddingListPage = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/wedding/list`, params).then(res => res.data)
    }
    // 编辑获取数据
export const getWeddingEdit = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/wedding/detail`, params).then(res => res.data)
    }
    // 编辑提交数据
export const editWedding = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/wedding/modify`, params).then(res => res.data)
    }
    // 启用禁用
export const editWeddingAble = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/wedding/disable`, params).then(res => res.data)
}

// 新增提交数据
export const addWedding = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/wedding/modify`, params).then(res => res.data)
    }
    // 删除数据
export const removeWedding = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/wedding/delete`, params).then(res => res.data)
    }
    // 批量删除数据
export const batchRemoveWedding = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/wedding/delete`, params).then(res => res.data)
    }
    /*********************************婚纱摄影 end*******************************/

/***************************************************************************/
/***************                      绿地公园               ******************/
/***************************************************************************/
// 获取列表
export const getParkListPage = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/park/list`, params).then(res => res.data)
    }
    // 编辑获取数据
export const getParkEdit = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/park/detail`, params).then(res => res.data)
    }
    // 编辑提交数据
export const editPark = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/park/modify`, params).then(res => res.data)
}

// 启用禁用
export const editParkAble = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/park/disable`, params).then(res => res.data)
    }
    // 新增提交数据
export const addPark = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/park/modify`, params).then(res => res.data)
    }
    // 删除数据
export const removePark = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/park/delete`, params).then(res => res.data)
    }
    // 批量删除数据
export const batchRemovePark = (params, publicParams) => {
        setHeader(publicParams)
        return axios.post(`${base}/ajax/park/delete`, params).then(res => res.data)
    }
    /*********************************婚纱摄影 end*******************************/
    /***************************************************************************/

/***************                      新型旅游               ******************/
/***************************************************************************/
// 获取列表
export const getTravelnewListPage = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/travelnew/list`, params).then(res => res.data)
}

// 编辑获取数据
export const getTravelnewEdit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/travelnew/detail`, params).then(res => res.data)
}

// 编辑提交数据
export const editTravelnew = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/travelnew/modify`, params).then(res => res.data)
}

// 启用禁用
export const editTravelnewAble = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/travelnew/disable`, params).then(res => res.data)
}

// 新增提交数据
export const addTravelnew = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/travelnew/modify`, params).then(res => res.data)
}

// 删除数据
export const removeTravelnew = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/travelnew/delete`, params).then(res => res.data)
}

// 批量删除数据
export const batchRemoveTravelnew = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/travelnew/delete`, params).then(res => res.data)
}

/*********************************新型旅游 end*******************************/

/*********************************管理员管理 start*******************************/
// 获取列表数据
export const getUsersListPage = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/user/list`, params).then(res => res.data)
}

// 获取编辑数据
export const getuserEdit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/user/detail`, params).then(res => res.data)
}

// 编辑/新增  提交数据
export const getUserEdit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/user/modify`, params).then(res => res.data)
}

// 获取新增数据
export const getUserAdd = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/role/all`, params).then(res => res.data)
}

// 编辑/新增  提交数据
export const editUserAble = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/user/disable`, params).then(res => res.data)
}

/*********************************管理员管理 end*******************************/

/********************************* 菜单管理start*******************************/
// 获取列表数据
export const getMenuListPage = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/menu/list`, params).then(res => res.data)
}

// 获取编辑数据
export const getMenuEdit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/menu/detail`, params).then(res => res.data)
}

// 提交编辑数据
export const editMenu = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/menu/modify`, params).then(res => res.data)
}

// 提交编辑数据
export const getMenuEditList = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/menu/pid`, params).then(res => res.data)
}

// 提交新增数据
export const addMenu = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/menu/modify`, params).then(res => res.data)
}

// 删除菜单
export const removeMenu = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/menu/delete`, params).then(res => res.data)
}

/*********************************菜单管理 end*******************************/

/********************************* 角色管理 start*******************************/

// 获取  角色  列表数据
export const getRoleListPage = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/role/list`, params).then(res => res.data)
}

// 获取  菜单  列表数据
export const getRoleMenuPage = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/role/menu/relation`, params).then(res => res.data)
}

// 获取  角色  列表编辑数据
export const getRoleEdit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/role/detail`, params).then(res => res.data)
}

// 提交 角色 列表编辑数据
export const getEditRoleSubmit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/role/modify`, params).then(res => res.data)
}

// 提交 角色 列表 新增数据
export const getAddRoleSubmit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/role/modify`, params).then(res => res.data)
}

// 删除 角色 列表数据
export const removeRoleList = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/admin/role/delete`, params).then(res => res.data)
}

// 删除  角色与菜单  的关联关系
export const getRemoveMenu = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/role/menu/delete`, params).then(res => res.data)
}

// 提交 菜单 列表 新增数据
export const getAddMenuSubmit = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/role/relation/add`, params).then(res => res.data)
}

// 获取 新增 菜单  列表数据
export const getMenuAdd = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/role/catalog`, params).then(res => res.data)
}

// 获取 新增 菜单  二级列表数据
export const getAddMenuSlect = (params, publicParams) => {
    setHeader(publicParams)
    return axios.post(`${base}/ajax/role/menu/select`, params).then(res => res.data)
}