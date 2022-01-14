import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('../views/Accounts.vue')
  },
  {
    path: '/myaccount',
    name: 'My Account',
    component: () => import('../views/myAccount.vue')
  },
  {
    path: '/residentsinfo',
    name: 'Residents Info',
    component: () => import('../views/ResidentsInfo.vue')
  },
  {
    path: '/brgyproperties',
    name: 'brgy Properties',
    component: () => import('../views/brgyProperties.vue')
  },
  {
    path: '/borrow',
    name: 'Borrow',
    component: () => import('../views/borrow.vue')
  },
  {
    path: '/organization',
    name: 'Organization',
    component: () => import('../views/Organization.vue')
  },
  {
    path: '/dailytimerecord',
    name: 'Daily Time Record',
    component: () => import('../views/DailyTimeRecord.vue')
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/Services.vue')
  },
  {
    path: '/mapping',
    name: 'Mapping',
    component: () => import('../views/Mapping.vue')
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/Inventory.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue')
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../views/Maintenance.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
