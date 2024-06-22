import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Common from '../views/Common.vue'
import UserInfo from '../components/person/UserInfo.vue'
import CarInfo from '../components/car/CarInfo.vue'
import Cost from '../components/money/Cost.vue'
import Mane from '../views/Manager.vue'
import Home from '../components/Home.vue'
import CarManager from '../components/car/CarManager.vue'
import CarInMane from '../components/manager/CarInMane.vue'
import Money from '../components/manager/Money.vue'
import StallMane from '../components/manager/StallMane.vue'
import UserMane from '../components/manager/UserMane.vue'
import LoginInfoMane from '../components/manager/LoginInfoMane.vue'

Vue.use(VueRouter)

const routes = [{
            path: '/',
            redirect: '/login'
        }, {
            path: '/login',
            component: Login
        },
        {
            path: '/conmen',
            component: Common,
            redirect: '/userInfo',
            children:[
                {
                    path: '/conmenHome',
                    component: Home
                },
                {
                    path: '/userInfo',
                    component: UserInfo
                },
                {
                    path: '/carInfo',
                    component: CarInfo
                },
                {
                    path: '/cost',
                    component: Cost
                },
            ]
        },
        {
            path: '/mane',
            component: Mane,
            redirect: '/maneHome',
            children:[
                {
                    path: '/maneHome',
                    component: Home
                },
                {
                    path: '/userMane',
                    component: UserMane
                },
                {
                    path: '/carmaneger',
                    component: CarManager
                },
                {
                    path: '/carInMane',
                    component: CarInMane
                },
                {
                    path: '/stallMane',
                    component: StallMane
                },
                {
                    path: '/money',
                    component: Money
                },
                {
                    path: '/loginInfoMane',
                    component: LoginInfoMane
                }
            ]
        }

    ]

const router = new VueRouter({
    routes
})

// 挂载路由导航守卫(防止没有进行验证后直接跳转到了相关页面)
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next是一个函数，表示放行
    // next() 放行  next('/login')强制性跳转到指定路由
    if (to.path === '/login') return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router
