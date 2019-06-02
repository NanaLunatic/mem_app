import Vue from 'vue'
import Router from 'vue-router'
import login from 'view/public/login'
import mine from 'view/public/mine'
import home from 'view/public/home'

// 指派任务
import assign from 'view/assign/assign'
import assignInfo from 'view/assign/assign-info'
import assignPerson from 'view/assign/assign-person'
// 执行任务
import carry from 'view/carry/carry'
import carryInfo from 'view/carry/carry-info'
import carryAccept from 'view/carry/carry-accept'
// 审批任务
import check from 'view/check/check'
import checkInfo from 'view/check/check-info'
// 承包中合同
import contract from 'view/contract/contract'
import contractInfo from 'view/contract/contract-info'
// 承包中合同
import news from 'view/news/news'
import newsInfo from 'view/news/news-info'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/mine',
      component: mine
    },
    {
      path: '/assign-info',
      component: assignInfo
    },
    {
      path: '/assign-person',
      component: assignPerson
    },
    {
      path: '/carry-info',
      component: carryInfo
    },
    {
      path: '/carry-accept',
      component: carryAccept
    },
    {
      path: '/check-info',
      component: checkInfo
    },
    {
      path: '/contract-info',
      component: contractInfo
    },
    {
      path: '/news-info',
      component: newsInfo
    },
    {
      path: '/home',
      component: home,
      redirect: '/home/assign',
      children: [
        {
          path: 'assign',
          component: assign
        },
        {
          path: 'carry',
          component: carry
        },
        {
          path: 'check',
          component: check
        },
        {
          path: 'contract',
          component: contract
        },
        {
          path: 'news',
          component: news
        },
      ]
    }
  ]
})
