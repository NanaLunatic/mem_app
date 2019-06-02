import Vue from 'vue'
import Vuex from 'vuex'
import { localStorage, sessionStorage } from 'assets/js/storage.js'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: {
      name: '',
      phone: ''
    },
    // 是否是退出登录返回首页 1-不是 2-是
    isLoginOut: 1,
    // 当前指派任务详情
    assign: {},
    // 当前指派任务详情
    carry: {},
    // 当前审批任务详情
    check: {},
    // 当前合同详情
    contract: {},
    // 当前消息详情
    news: {},
    // 松岗办公人员，列表中括号的数量
    total: {
      "assign01": 0,
      "assign02": 0,
      "assign03": 0,
      "carry01": 0,
      "carry02": 0,
      "apply01": 0,
      "apply02": 0
    },
     // 承包方，列表中括号的数量，是否存在未读
    totalContract: {
      inTheContract: {
        count: 0,
        isRead: 0
      },
      theContractor: {
        count: 0,
        isRead: 0
      },
    },
    // 头部导航 是否有未读项
    read: {
      carryIsRead01: 2,
      carryIsRead02: 2
    }
  },
  mutations: {
    saveUserInfo(state, userInfo){
      state.userInfo = userInfo
      localStorage.setItem('user_info', userInfo)
    },
    saveAssign(state, assign) {
      state.assign = assign
      sessionStorage.setItem('assign', assign)
    },
    saveCarry(state, carry) {
      state.carry = carry
      sessionStorage.setItem('carry', carry)
    },
    saveCheck(state, check) {
      state.check = check
      sessionStorage.setItem('check', check)
    },
    saveContract(state, contract) {
      state.contract = contract
      sessionStorage.setItem('contract', contract)
    },
    saveNews(state, news) {
      state.news = news
      sessionStorage.setItem('news', news)
    },
    saveTotal(state, total) {
      state.total = total
    },
    saveTotalContract(state, totalContract) {
      state.totalContract = totalContract
    },
    saveRead(state, read) {
      state.read = Object.assign(state.read, read)
    },
    saveLoginOut(state, flag) {
      state.isLoginOut = flag
    }
  }
})
