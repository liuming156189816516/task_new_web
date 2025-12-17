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
      {
        path: '/reactDist',
        component: () => import('@/views/appConfig/reactDist'),
        name: 'reactDist',
        meta: {
          title: 'React资源包',
        }
      },
      {
        path: '/pluginPage',
        component: () => import('@/views/appConfig/pluginPage'),
        name: 'pluginPage',
        meta: {
          title: '插件',
        }
      },
      {
        path: '/scriptPage',
        component: () => import('@/views/appConfig/scriptPage'),
        name: 'scriptPage',
        meta: {
          title: '脚本',
        }
      },
      {
        path: '/noticeTemplate',
        component: () => import('@/views/appConfig/noticeTemplate'),
        name: 'noticeTemplate',
        meta: {
          title: '通知模板',
        }
      },
      {
        path: '/languagePage',
        component: () => import('@/views/appConfig/languagePage'),
        name: 'languagePage',
        meta: {
          title: '语言包',
        }
      },
      {
        path: '/tutorialManage',
        component: () => import('@/views/appConfig/tutorialManage'),
        name: 'tutorialManage',
        meta: {
          title: '教程管理',
        }
      },
      {
        path: '/generalConf',
        component: () => import('@/views/appConfig/generalConf'),
        name: 'generalConf',
        meta: {
          title: '通用配置',
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
          title: '任务分类',
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
          title: '活动分类',
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
    path: '/userManageGroup',
    component: Layout,
    name: 'userManageGroup',
    meta: { title: '注册用户', icon: 'el-icon-office-building' },
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
  // 财务管理
  {
    path: '/financeManage',
    component: Layout,
    name: 'financeManage',
    meta: { title: '财务管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/taskDetails',
        component: () => import('@/views/financeManage/taskDetails'),
        name: 'taskDetails',
        meta: {
          title: '任务明细',
        }
      },
      {
        path: '/billDetails',
        component: () => import('@/views/financeManage/billDetails'),
        name: 'billDetails',
        meta: {
          title: '账单明细',
        }
      },
      {
        path: '/withdrawApproval',
        component: () => import('@/views/financeManage/withdrawApproval'),
        name: 'withdrawApproval',
        meta: {
          title: '提现审批',
        }
      },
      {
        path: '/manualCorrection',
        component: () => import('@/views/financeManage/manualCorrection'),
        name: 'manualCorrection',
        meta: {
          title: '人工修正',
        }
      },
      {
        path: '/executeLog',
        component: () => import('@/views/financeManage/executeLog'),
        name: 'executeLog',
        meta: {
          title: '执行日志',
        }
      },
      {
        path: '/reportLog',
        component: () => import('@/views/financeManage/reportLog'),
        name: 'reportLog',
        meta: {
          title: '上报日志',
        }
      },
    ]
  },
  // 发布任务
  {
    path: '/releaseTask',
    component: Layout,
    name: 'financeManage',
    meta: { title: '发布任务', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/platform',
        component: () => import('@/views/releaseTask/platform'),
        name: 'platform',
        meta: {
          title: '发布平台',
        }
      },
    ]
  },
  // 数据管理
  {
    path: '/dataManagement',
    component: Layout,
    name: 'dataManagement',
    meta: { title: '数据管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/dataManagementPage',
        component: () => import('@/views/dataManagement/dataManagementPage'),
        name: 'dataManagementPage',
        meta: {
          title: '数据管理',
        }
      },
    ]
  },
  // 问题反馈
  {
    path: '/feedback',
    component: Layout,
    name: 'feedback',
    meta: { title: '问题反馈', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/feedbackPage',
        component: () => import('@/views/feedback/feedbackPage'),
        name: 'feedbackPage',
        meta: {
          title: '问题反馈',
        }
      },
    ]
  },
  // 规则配置
  {
    path: '/ruleConfig',
    component: Layout,
    name: 'ruleConfig',
    meta: { title: '规则配置', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/rulePage',
        component: () => import('@/views/ruleConfig/rulePage'),
        name: 'rulePage',
        meta: {
          title: '规则配置',
        }
      },
    ]
  },
  // IP管理
  {
    path: '/ipManage',
    component: Layout,
    name: 'ipManage',
    meta: { title: 'IP管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: '/ipPage',
        component: () => import('@/views/ipManage/ipPage'),
        name: 'ipPage',
        meta: {
          title: 'IP管理',
        }
      },
    ]
  },

  // 账号管理
  {
    path: '/storeroom',
    component: Layout,
    name: 'storeroom',
    meta: { title: '账号管理',icon: 'el-icon-user' },
    children: [
      {
        path: '/warehouse',
        component: () => import('@/views/storeroom/warehouse'),
        name: 'warehouse',
        meta: {
          title: '账号入库',
        }
      },
      {
        path: '/whats-app-list',
        component: () => import('@/views/storeroom/whatsAppList'),
        name: 'whats-app-list',
        meta: {
          title: '账号列表(安卓终端)',
        }
      }
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
      {
        path: '/bugManage',
        component: () => import('@/views/permission/bugManage'),
        name: 'bugManage',
        meta: {
          title: 'bug管理'
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
