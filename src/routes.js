import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/nav/Main.vue'
import Scenic from './views/nav1/Scenic.vue'
import Foodshop from './views/nav1/Foodshop.vue'
import ShopPoint from './views/nav1/ShopPoint.vue'
import Health from './views/nav1/Health.vue'
import Wedding from './views/nav1/Wedding.vue'
import Travelnew from './views/nav1/Travelnew.vue'
import Countryside from './views/nav1/Countryside.vue'
import Park from './views/nav1/Park.vue'
import Hotel from './views/nav1/hotel.vue'
import User from './views/nav2/User.vue'
import Role from './views/nav2/Role.vue'
import Menu from './views/nav2/Menu.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [{
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: '',
        children: [{
            path: '/main',
            component: Main,
            name: 'index'
        }]
    },
    {
        path: '/base',
        component: Home,
        name: '信息管理',
        iconCls: 'el-icon-message', // 图标样式class
        children: [
            { path: '/scenic', component: Scenic, name: '景区管理' },
            { path: '/foodshop', component: Foodshop, name: '餐馆管理' },
            { path: '/hotel', component: Hotel, name: '酒店管理' },
            { path: '/shoppoint', component: ShopPoint, name: '购物店管理' },
            { path: '/health', component: Health, name: '健康疗养管理' },
            { path: '/wedding', component: Wedding, name: '婚纱摄影' },
            { path: '/countryside', component: Countryside, name: '美丽乡村' },
            { path: '/park', component: Park, name: '绿地公园' },
            { path: '/travelnew', component: Travelnew, name: '新型旅游' }
        ]
    },
    {
        path: '/admin',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/user', component: User, name: '管理员管理' },
            { path: '/role', component: Role, name: '角色管理' },
            { path: '/menu', component: Menu, name: '菜单管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/page6', component: Page6, name: '页面6' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true, // 只有一个节点
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
]

export default routes