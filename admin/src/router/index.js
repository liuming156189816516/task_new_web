import Vue from 'vue'
import i18n from '@/locale'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

/* Router Modules */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/dashboard/index'),
        name: 'index',
        meta: { title: i18n.t('sys_m016'), icon: 'el-icon-odometer', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        hidden: true,
        path: '/change-password',
        component: () => import('@/views/user/change-password'),
        name: 'change-password',
        meta: { title: i18n.t('sys_m021'), icon: 'dashboard' }
      }
    ]
  }
]
export const asyncRoutes = [
  // App配置
  {
    path: '/appConfig',
    component: Layout,
    name: 'appConfig',
    meta: { title: 'App配置', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/appConfigPage',
        component: () => import('@/views/appConfig/appConfigPage'),
        name: 'appConfigPage',
        meta: {
          title: 'App配置',
        }
      },
      {
        path: '/staticResources',
        component: () => import('@/views/appConfig/staticResources'),
        name: 'staticResources',
        meta: {
          title: '静态资源',
        }
      },
      {
        path: '/appTheme',
        component: () => import('@/views/appConfig/appTheme'),
        name: 'appTheme',
        meta: {
          title: 'App主题',
        }
      },
      {
        path: '/internationalize',
        component: () => import('@/views/appConfig/internationalize'),
        name: 'internationalize',
        meta: {
          title: '国际化',
        }
      },
      {
        path: '/layoutConfig',
        component: () => import('@/views/appConfig/layoutConfig'),
        name: 'layoutConfig',
        meta: {
          title: '布局配置',
        }
      },

    ]
  },
  // 轮播图
  {
    path: '/carousel',
    component: Layout,
    name: 'carousel',
    meta: { title: '轮播图', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/carouselPage',
        component: () => import('@/views/carousel/carouselPage'),
        name: 'carouselPage',
        meta: {
          title: '轮播图',
        }
      },
    ]
  },
  // 任务
  {
    path: '/taskGroup',
    component: Layout,
    name: 'taskGroup',
    meta: { title: '任务管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/taskType',
        component: () => import('@/views/taskGroup/taskType'),
        name: 'taskType',
        meta: {
          title: '任务类型',
        }
      },
      {
        path: '/taskList',
        component: () => import('@/views/taskGroup/taskList'),
        name: 'taskList',
        meta: {
          title: '任务列表',
        }
      },
    ]
  },
  // 活动管理
  {
    path: '/activityGroup',
    component: Layout,
    name: 'taskGroup',
    meta: { title: '活动管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/activityType',
        component: () => import('@/views/activityGroup/activityType'),
        name: 'ActivityType',
        meta: {
          title: '活动类型',
        }
      },
      {
        path: '/activityList',
        component: () => import('@/views/activityGroup/activityList'),
        name: 'ActivityList',
        meta: {
          title: '活动列表',
        }
      },
    ]
  },
  // 徽章管理
  {
    path: '/badgeGroup',
    component: Layout,
    name: 'badgeGroup',
    meta: { title: '徽章管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/badgePage',
        component: () => import('@/views/badgeGroup/badgePage'),
        name: 'BadgePage',
        meta: {
          title: '徽章管理',
        }
      },
    ]
  },
  // 用户管理
  {
    path: '/userManage',
    component: Layout,
    name: 'userManage',
    meta: { title: '用户管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/registerUser',
        component: () => import('@/views/userManage/registerUser'),
        name: 'registerUser',
        meta: {
          title: '注册用户',
        }
      },
    ]
  },
  // 权限配置
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    meta: {
      title: '权限配置',
      icon: 'lock',
    },
    children: [
      {
        path: '/userManage',
        component: () => import('@/views/permission/userManage'),
        name: 'userManage',
        meta: {
          title: '用户管理',
        }
      },
      {
        path: '/roleManage',
        component: () => import('@/views/permission/roleManage'),
        name: 'roleManage',
        meta: {
          title: '角色管理',
        }
      },
      {
        path: '/menuManage',
        component: () => import('@/views/permission/menuManage'),
        name: 'menuManage',
        meta: {
          title: '菜单管理'
        }
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
