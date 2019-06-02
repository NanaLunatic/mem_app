import req from './fetch.js'

/** -- publice start -- **/

/**
 * Phone登陆
 */
export const getLogin = param => {
  return req.post('g1/phoneusers/login', param)
}
/**
 * Phone登出
 */
export const doExit = param => {
  return req.post('g1/phoneusers/logout', param)
}
/**
 * 发送短信
 */
export const getSmsCode = param => {
  return req.post('g1/smsaliyun/sms/codes', param)
}
/**
 * 更改密码
 */
export const updatePassword = param => {
  return req.put('g1/phoneusers/passwords', param)
}
/**
 * 获取微信JS-SDK配置项信息
 */
export const getWxJsSdk = param => {
  return req.get('g1/wx/getJsSdk/info', param)
}
/**
 * 微信上传图片
 */
export const uploadPhoto = param => {
  return req.post('g1/attach/saveWxPic', param)
}
/**
 * 微信批量上传图片
 */
export const uploadPhotos = param => {
  return req.post('g1/attach/saveWxPics', param)
}
/**
 * 查询用户
 */
export const ids = param => {
  return req.get('g1/phoneusers/ids', param)
}
/** -- 指派任务模块 start -- **/

/**
 * 列表中括号的数量
 */
export const getTotalMap = param => {
  return req.get('g1/assignedTask/totalMap', param)
}
/**
 * 获取指派任务列表
 */
export const getAssignList = param => {
    return req.get('g1/assignedTask/assignList', param)
}
/**
 * 获取项目详情
 */
export const getProjects = param => {
  return req.get('g1/assignedTask/getProjects', param)
}
/**
 * 获取发包信息
 */
export const getContract = param => {
  return req.get('g1/assignedTask/view' ,param)
}
/**
 * 需要验收的合同阶段
 */
// export const getContractStep = param => {
//   return req.get('g1/assignedTask/acceptanceStage', param)
// }
/**
 * 任务执行人
 */
export const getTaskExecutor = param => {
  return req.get('g1/assignedTask/taskExecutor', param)
}
/**
 * 查询部门列表
 */
export const getDeptList = param => {
  return req.get('g1/assignedTask/deptList', param)
}
/**
 * 查询用户列表
 */
export const getUserList = param => {
  return req.get('g1/assignedTask/userList', param)
}

/**
 * 新增验收负责人
 */
export const insertCheck = param => {
  return req.post('g1/assignedTask/insertCheckResponsible', param)
}

/** -- 执行任务模块 start -- **/

/**
 * 获取执行任务列表
 */
export const getCarryList = param => {
  return req.get('g1/assignedTask/carryList', param)
}

/**
 * 需要验收的合同阶段
 */
export const acceptanceStage = param => {
  return req.get('g1/assignedTask/acceptanceStage', param)
}

/**
 * 新增验收合同阶段结果-验收登记
 */
export const insertCheckRegister = param => {
  return req.put('g1/assignedTask/checking', param)
}

/**
 * 请款金额，app端
 */
export const totalMoney = param => {
  return req.get('g1/assignedTask/totalMoney', param)
}

/** -- 审批任务模块 start -- **/

/**
 * 获取审批任务列表
 */
export const getCheckList = param => {
  return req.get('g1/assignedTask/applyList', param)
}
/**
 * 查询审批节点
 */
export const getApprovalNodes = param => {
  return req.get('g1/memapprovalsphone/nodes/packageId/approvalType', param)
}
/**
 * 审批操作(同意)
 */
export const approvalAgrees = param => {
  return req.put('g1/memapprovalsphone/nodes/agrees', param)
}
/**
 * 审批操作(拒绝)
 */
export const approvalRefuses = param => {
  return req.put('g1/memapprovalsphone/nodes/refuses', param)
}

/** -- 承包中合同模块 start -- **/
/**
 * 获取承包中和新合同消息总数量
 */
export const getTotalContract = param => {
  return req.get('g1/theContractorApp/getCount', param)
}
/**
 * 承包中合同列表
 */
export const getContractList = param => {
  return req.get('g1/theContractorApp/listTheContractorApp', param)
}
/**
 * 发起验收申请
 */
export const submitCheckApply = param => {
  return req.post('g1/theContractorApp/insertTheContractApp', param)
}
/**
 * 查看合同
 */
export const previewContract = param => {
  return req.get(`g1/phonePckInfo/previewContract/${param}`)
}
/**
 * 查看合同配置项
 */
export const initContract = param => {
  return req.get(`g1/assignedTask/initContract/${param}`)
}

/** -- 新合作消息模块 start -- **/

/**
 * 新合作消息列表
 */
export const getNewsList = param => {
  return req.get('g1/theContractorApp/listTheNewContractApp', param)
}
/**
 * 验收阶段信息
 */
export const getContractStage = param => {
  return req.get('g1/theContractorApp/queryTheContractApp', param)
}
/**
 * 新消息回复后修改消息已读未读
 */
export const updateReply = param => {
  return req.put('g1/theContractorApp/updateReply', param)
}
