import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome'
import User from '../components/users/User'
import Rights from '../components/rights/Rights'
import Roles from '../components/rights/Roles'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            children: [
                { path: '/home', redirect: '/welcome' },
                { path: '/welcome', component: Welcome },
                { path: '/users', component: User },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login');
    next();

})

export default router