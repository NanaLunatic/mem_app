const filters = {
  /**
   * 功能：将时间戳按照给定的 时间/日期 格式进行处理
   * @param {Number} date 时间戳
   * @param {String} fmtExp 时间格式 'yyyy-MM-dd hh:mm'
   * @returns {String} 规范后的 时间/日期 字符串
   */
  formateDate(date, fmtExp) {
    if (!date) {
      return ''
    }
    // 兼容ios new Date()
    var date = date.replace(/\-/g, "/").substr(0, 19)
    date = new Date(date)
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmtExp))
      fmtExp = fmtExp.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmtExp))
        fmtExp = fmtExp.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmtExp;
  },
  /**
   * 功能：格式化任务类型
   * @param {Number} index 1-指派验收，2-发包，3-验收，4-支付，5-审批，6-审计，7-已承包合同，8-新合同消息
   */
  formateNewsType(index) {
    let typeList = ['', '指派', '发包', '验收', '支付', '审批', '审计', '已承包合同', '新合同消息']
    return typeList[index] || ''
  },
  /**
   * 功能：格式化审批状态
   * @param {Number} status 0-未审核，1-待审核，2-同意 3-不同意 5-退回
   */
  formateApprovalStatus(status) {
    let approvalList = ['未审核', '待审核', '同意', '不同意', '退回']
    return approvalList[status] || ''
  },
  /**
   * 功能：格式化审批任务的任务类型
   * @param {Number} checkType 1-发包审批，2-合同审批
   */
  formateCheckType(checkType) {
    let typeList = ['', '发包表审批', '合同审批']
    return typeList[checkType] || ''
  },
  /**
   * 功能：格式化头部tab的数量，为0不显示
   * @param {Number} count 数量
   */
  formateTabCount(count) {
    if (!count) {
      return ''
    }
    if (count === '0') {
      return ''
    } else {
      return `(${count})`
    }
  },
  /**
   * 功能：格式化已读未读状态
   * @param {Number} status 1-未读，2-已读
   */
  formateRead(status) {
    let statusList = ['', '未读', '已读']
    return statusList[status] || ''
  },
  /**
   * 功能：格式化底部导航
   */
  formateTabBottomCount(tab) {
    // 松岗办公人员
    if (!tab.type) {
      return tab.label
    } else {
      return `${tab.label}(${tab.count})`
    }
  },
  /**
   * 功能：格式化申请验收合同阶段
   * @param {Array} stageList 需要被格式化的验收合同阶段
   * @param {String} key 返回的属性
   */
  formateStageMerge(stagelist, key) {
    let [step, standrd, obj] = [[], [], {}]
    let stepList = ['', '第一阶段', '第二阶段', '第三阶段', '第四阶段', '第五阶段',]
    for (let stage of stagelist) {
      let tempStep = stepList[stage.checkStep] || ''
      step.push(tempStep)
      standrd.push(stage.standrd)
    }
    obj.step = step.join('；')
    obj.standrd = standrd.join('；')
    return obj[key]
  },
  /**
   * 功能：格式化任务执行人
   * @param {Array} userlist 需要被格式化的任务执行人列表
   * @param {String} key 返回的属性
   */
  formateTaskPerson(userlist, key) {
    let arr = []
    for (let user of userlist) {
      arr.push(user[key])
    }
    return arr.join('，')
  },
  /**
   * 功能：格式化用户的部门信息
   * @param {Array} deptList 需要被格式化的部门列表
   */
  formateDept(deptList) {
    let str = ''
    if (!deptList || !deptList.length) return;
    for (let dept of deptList) {
      str += dept.deptName
    }
    return str
  },
  formateCheckStep(step) {
    let res = []
    if (!step) return '';
    let stepList = ['', '第一阶段', '第二阶段', '第三阶段', '第四阶段', '第五阶段',]
    let list = step.toString().split(',')
    for (let item of list) {
      let tempStep = stepList[item] || ''
      res.push(tempStep)
    }
    return res.join('；')
  },
   /**
   * 功能：格式化验收状态
   * @param {Number} status 0-未指派，1-验收中，2-验收通过，3-验收不通过 4-已支付 4-补录（显示成通过）
   *  @param {Number} identity 用户身份 1-松岗办公人员，1-承包方
   */
  formateStageStatus(status, identity) {
    // let statusList = ['未指派', '中', '通过', '不通过', '已支付', '补录']
    // if (identity == 2) {
    //   statusList[0] = '中'
    // }
    let statusList = identity == 2 ? ['验收中', '验收中', '支付中', '验收未通过', '已支付', '补录'] : ['验收未指派', '验收中', '验收通过', '验收不通过', '已支付', '补录']
    let result = statusList[status] ? statusList[status] : ''
    return result
  }
}

export default (Vue) => {
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}
