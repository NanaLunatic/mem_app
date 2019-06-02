<template>
  <div class="carry-info info">
    <div class="head">
      <span class="text">{{ type | formateHeadText(carry.newsType) }}</span>
      <!-- 未完成 -->
      <span class="date" v-if="type == 1">{{ carry.createTime | formateDate('yyyy.MM.dd hh:mm') }}</span>
      <!-- 已完成 -->
      <span class="date" v-else>{{ carry.opDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
    </div>
    <h4 class="name">{{ projectInfo.getIfom.name }}</h4>
    <project-form :info="projectInfo"></project-form>
    <ul class="contract">
      <!-- 发包 -->
      <li class="contract-item" v-if="newsType == 2">
        <ul class="info-wrapper">
          <li class="item">
            <span class="item-title">发包任务配置人：</span>
            <span class="item-content"><a class="tel" :href="`tel:${contract.packageManagerPhone}`">{{ contract.packageManagerName }}</a></span>
          </li>
          <li class="item">
            <span class="item-title">合同类型：</span>
            <span class="item-content">{{ contract.contractName }}</span>
          </li>
        </ul>
        <!-- 发包任务已完成才显示 -->
        <ul class="info-wrapper" v-if="type == 2">
          <li class="item">
            <span class="item-title">承包商：</span>
            <span class="item-content">{{ contract.supplierName }}</span>
          </li>
          <li class="item">
            <span class="item-title">承包商联系人：</span>
            <span class="item-content"><a class="tel" :href="`tel:${contract.supplierContractType}`">{{ contract.supplierContractName }}</a></span>
          </li>
          <li class="item">
            <span class="item-title">合同金额：</span>
            <span class="item-content">{{ contract.contractMoney }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">合同签订日期：</span>
            <span class="item-content">{{ contract.contractSigningDate  | contract.contractSigningDate == '' ? '' :  formateDate('yyyy.MM.dd') }}</span>
          </li>
        </ul>
      </li>
      <!-- 验收任务 -->
      <li class="contract-item" v-else-if="newsType == 3">
        <ul class="info-wrapper">
          <li class="item">
            <span class="item-title">合同类型：</span>
            <span class="item-content">{{ contract.contractName }}</span>
          </li>
          <li class="item">
            <span class="item-title">{{ contract.contractName == '施工' ? '合同造价' : '委托费用' }}：</span>
            <span class="item-content">{{ contract.commissionExpenses }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">合同签订日期：</span>
            <span class="item-content">{{ contract.contractSigningDate  | contract.contractSigningDate  == '' ? '' : formateDate('yyyy.MM.dd') }}</span>
          </li>
          <li class="item">
            <span class="item-title">承包商：</span>
            <span class="item-content">{{ contract.supplierName }}</span>
          </li>
          <li class="item">
            <span class="item-title">承包商联系人：</span>
            <span class="item-content"><a class="tel" :href="`tel:${contract.supplierContractType}`">{{ contract.supplierContractName }}</a></span>
          </li>
          <li class="item">
            <span class="item-title">申请验收阶段：</span>
            <span class="item-content">{{ stageList | formateStageMerge('step') }}</span>
          </li>
          <li class="item">
            <span class="item-title">验收标准：</span>
            <span class="item-content">{{ stageList | formateStageMerge('standrd') }}</span>
          </li>
          <li class="item" v-if="type == 2">
            <span class="item-title">验收结果：</span>
            <span class="item-content">{{ checkTask.status | formateStageStatus }}</span>
          </li>
        </ul>
      </li>
      <!-- 审计任务 -->
      <li class="contract-item" v-else-if="newsType == 6">
        <ul class="info-wrapper">
          <li class="item">
            <span class="item-title">合同类型：</span>
            <span class="item-content">{{ contract.contractName }}</span>
          </li>
          <li class="item">
            <span class="item-title">合同金额：</span>
            <span class="item-content">{{ contract.contractMoney }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">合同签订日期：</span>
            <span class="item-content">{{ contract.contractSigningDate  | contract.contractSigningDate == '' ? '' :  formateDate('yyyy.MM.dd') }}</span>
          </li>
          <li class="item">
            <span class="item-title">合同工期：</span>
            <span class="item-content">{{ contract.contractDays }}（日历天）</span>
          </li>
        </ul>
        <!-- 审计任务完成时才显示 -->
        <ul class="info-wrapper" v-if="type == 2">
          <li class="item">
            <span class="item-title">提交结算审计时间：</span>
            <span class="item-content">{{ contract.projectAudit.auditSubmitTime | formateDate('yyyy.MM.dd') }}</span>
          </li>
          <li class="item">
            <span class="item-title">审计完成时间：</span>
            <span class="item-content">{{ contract.projectAudit.auditFinishDate | formateDate('yyyy.MM.dd') }}</span>
          </li>
          <li class="item">
            <span class="item-title">送审价格：</span>
            <span class="item-content">{{ contract.projectAudit.auditPrice }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">审计价格：</span>
            <span class="item-content">{{ contract.projectAudit.auditConfirmPrice }}万元</span>
          </li>
        </ul>
      </li>
      <!-- 支付任务 -->
      <li class="contract-item" v-else-if="newsType == 4">
        <ul class="info-wrapper">
          <li class="item">
            <span class="item-title">合同类型：</span>
            <span class="item-content">{{ contract.contractName }}</span>
          </li>
          <li class="item">
            <span class="item-title">{{ contract.contractName == '施工' ? '合同造价' : '委托费用' }}：</span>
            <span class="item-content">{{ contract.commissionExpenses }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">合同签订日期：</span>
            <span class="item-content">{{ contract.contractSigningDate  | contract.contractSigningDate == '' ? '' :  formateDate('yyyy.MM.dd') }}</span>
          </li>
          <li class="item">
            <span class="item-title">承包商：</span>
            <span class="item-content">{{ contract.supplierName }}</span>
          </li>
          <li class="item">
            <span class="item-title">承包商联系人：</span>
            <span class="item-content"><a class="tel" :href="`tel:${contract.supplierContractType}`">{{ contract.supplierContractName }}</a></span>
          </li>
          <li class="item">
            <span class="item-title">申请验收阶段：</span>
            <span class="item-content">{{ stageList | formateStageMerge('step') }}</span>
          </li>
          <li class="item">
            <span class="item-title">验收标准：</span>
            <span class="item-content">{{ stageList | formateStageMerge('standrd') }}</span>
          </li>
          <li class="item">
            <span class="item-title">验收结果：</span>
            <span class="item-content">验收通过</span>
          </li>
          <li class="item">
            <span class="item-title">请款总金额：</span>
            <span class="item-content">{{ payInfo.payMoney }}万元</span>
          </li>
        </ul>
        <!-- 支付任务完成时才显示 -->
        <ul class="info-wrapper" v-if="type == 2">
          <li class="item">
            <span class="item-title">实际支付金额：</span>
            <span class="item-content">{{ payInfo.realPayMoney }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">支付人：</span>
            <span class="item-content">{{ payInfo.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <task-form :info="taskInfo" v-if="newsType == 3"></task-form>
    <x-button type="primary" class="btn" @click.native="jumpCheck" v-if="newsType == 3 && type == 1">验收登记</x-button>
  </div>
</template>

<script type="text/ecmascript-6">
import { getProjects, getContract, acceptanceStage, getTaskExecutor, getContractStage, totalMoney } from 'api'
import projectForm from 'components/form/project-form'
import taskForm from 'components/form/task-form'
import split from 'components/split/split'
import { XButton } from 'vux'
import { localStorage, sessionStorage } from 'assets/js/storage.js'
export default {
  data() {
    return {
      type: 1,
      projectInfo: {
        getIfom: {
          name: ''
        }
      },
      contract: {},
      contractStep: {},
      taskInfo: { // 任务信息
        task: {
          checkStartDate: '',
          checkEndDate: '',
          checkManagerDept: '',
          checkManager: '',
          remark: '',
        },
        list: []
      },
      stageList: [],
      checkTask: {},
      payInfo:{}
    }
  },
  created() {
    let moduleType = sessionStorage.getItem('module_type')
    if (moduleType) {
      this.type = moduleType.type
    }
    this.initProject()
    this.initContract()
    this.initStage()
    this.initTask()
    // this.initContractStage()
  },
  filters: {
     // newsType 1-指派验收，2-发包，3-验收，4-支付，5-审批，6-审计，7-已承包合同，8-新合同消息
    formateHeadText(type, newsType) {
      let typeList = ['', '指派验收', '发包', '验收', '支付', '审批', '审计', '已承包合同', '新合同消息']
      let task = typeList[newsType]
      return type == 1 ? `您有以下${task}任务` : `该${task}任务已完成`;
    }
  },
  computed: {
    carry() {
      let carry = sessionStorage.getItem('carry')
      if(carry) {
        this.$store.commit('saveCarry', carry)
      }
      return this.$store.state.carry
    },
    //1-指派验收，2-发包，3-验收，4-支付，5-审批，6-审计，7-已承包合同，8-新合同消息
    newsType() {
      let newstype = this.$store.state.carry.newsType
      return newstype ? newstype : 1
    }
  },
  methods: {
    // 获取项目信息
    async initProject() {
      let param = {
        projectNo: this.carry.projectNo,
        noticeId: this.carry.noticeId
      }
      const res = await getProjects(param)
      if (!this.checkRequest(res)) return;
      this.projectInfo = res.data.data
    },
    // 获取合同
    async initContract() {
      let param = {
        id: this.carry.packageId
      }
      const res = await getContract(param)
      if (!this.checkRequest(res)) return;
      this.contract = res.data.data
    },
    // 获取需要验收的合同阶段
    async initStage() {
      let param = {
        id: this.carry.bizId,
        packageId: this.carry.packageId,
        newsType: this.newsType,
      }
      const res = await acceptanceStage(param)
      if (!this.checkRequest(res)) return;
      this.stageList = res.data.data.list
      this.checkTask = res.data.data.checkTask
      // 获取支付信息需要验收的合同阶段
      if (this.newsType == 4) {
        this.initPay()
      }
    },
    // 获取任务执行人getTaskExecutor
    async initTask() {
      let param = {
        bizId: this.carry.bizId
      }
      const res = await getTaskExecutor(param)
      if (!this.checkRequest(res)) return;
      this.taskInfo = res.data.data
    },
    // 获取支付信息
    async initPay() {
      let param = {
        id: this.carry.packageId,
        phase: this.checkTask.checkStep
      }
      const res = await totalMoney(param)
      if (!this.checkRequest(res)) return;
      this.payInfo = res.data.data
    },
    // 跳转指派验收人
    jumpCheck() {
      let acceptInfo = {
        stageList: this.stageList,
        // checkInfoId: this.taskInfo.task.checkInfoId
      }
      sessionStorage.setItem('accept_info', acceptInfo)
      this.$router.push({path: '/carry-accept'})
    },
  },
  components: {
    projectForm,
    split,
    XButton,
    taskForm,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
@import '../../assets/style/info.styl'
</style>
