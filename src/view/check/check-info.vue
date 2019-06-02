<template>
  <div class="check-info info">
    <div class="head">
      <span class="text" >{{ type | formateHeadText(check.approvalType) }}</span>
      <!-- 待审批 -->
      <span class="date" v-if="type == 1">{{ check.createTime | formateDate('yyyy.MM.dd hh:mm') }}</span>
      <!-- 已审批 -->
      <span class="date" v-else>{{ check.opDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
    </div>
    <h4 class="name">{{ projectInfo.getIfom.name }}</h4>
    <project-form :info="projectInfo"></project-form>
    <!-- 合同审批类型的才显示 1-发包表审批，2-合同审批 -->
    <contract-form v-if="check.approvalType == 2" :contract="contract" :package-id="check.packageId.toString()" :stage-list="stageList"></contract-form>
    <!-- 发包审批类型的才显示 -->
    <ul class="contract" v-else>
      <li class="contract-item">
        <ul class="info-wrapper">
          <li class="item">
            <span class="item-title">合同类型：</span>
            <span class="item-content">{{ contract.contractName }}</span>
          </li>
          <li class="item">
            <span class="item-title">资金来源：</span>
            <span class="item-content">{{ contract.capitalSource }}</span>
          </li>
          <li class="item">
            <span class="item-title">{{ contract.contractName == '施工' ? '合同造价' : '委托费用' }}：</span>
            <span class="item-content">{{ contract.commissionExpenses }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">合同承包商：</span>
            <span class="item-content">{{ contract.supplierName }}</span>
          </li>
          <li class="item">
            <span class="item-title">承包商联系人：</span>
            <span class="item-content"><a class="tel" :href="`tel:${contract.supplierContractType}`">{{ contract.supplierContractName }}</a></span>
          </li>
          <li class="item">
            <span class="item-title">是否有资质：</span>
            <!-- 是否有资质，0-无，1-有 -->
            <span class="item-content">{{ contract.isCredentials == 1 ? '有' : '无' }}</span>
          </li>
          <li class="item">
            <span class="item-title">发包表配置人：</span>
            <span class="item-content"><a class="tel" :href="`tel:${contract.packageManagerPhone}`">{{ contract.packageManagerName }}</a></span>
          </li>
          <li class="item">
            <span class="item-title">主要业务内容：</span>
            <span class="item-content">{{ contract.content }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <approval-form :approval-list="approvalList" :approval-history-list="approvalHistoryList" :approval-type="check.approvalType" @reset="resetApproval"></approval-form>
    <x-button type="primary" class="btn" @click.native="jumpPerson" v-if="check.newsType == 3">验收登记</x-button>
  </div>
</template>

<script type="text/ecmascript-6">
import { getProjects, getContract, getTaskExecutor, getApprovalNodes, getContractStage } from 'api'
import projectForm from 'components/form/project-form'
import contractForm from 'components/form/contract-form'
import approvalForm from 'components/form/approval-form'
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
      stageList: [],
      approvalList: [],
      approvalHistoryList: [],
    }
  },
  created() {
    let moduleType = sessionStorage.getItem('module_type')
    if (moduleType) {
      this.type = moduleType.type
    }
    this.initProject()
    this.initContract()
    this.initApproval()
    this.initContractStage()
  },
  filters: {
    formateHeadText(type, approvalType) {
      switch(approvalType) {
        case 1: return type == 1 ? '您有以下发包表审批任务' : '该发包表审批任务已完成';
        case 2: return type == 1 ? '您有以下合同审批任务' : '该合同审批任务已完成';
        default: return '';
      }
    }
  },
  computed: {
    // check.newsType 1-指派验收，2-发包，3-验收，4-支付，5-审批，6-审计，7-已承包合同，8-新合同消息
    check() {
      let check = localStorage.getItem('check')
      if(check) {
        this.$store.commit('saveCheck', check)
      }
      return this.$store.state.check
    },
  },
  methods: {
    // 获取项目信息
    async initProject() {
      let param = {
        projectNo: this.check.projectNo,
        noticeId: this.check.noticeId
      }
      const res = await getProjects(param)
      if (!this.checkRequest(res)) return;
      this.projectInfo = res.data.data
    },
    // 获取合同
    async initContract() {
      let param = {
        id: this.check.packageId
      }
      const res = await getContract(param)
      if (!this.checkRequest(res)) return;
      this.contract = res.data.data
    },
    // 获取验收合同阶段
    async initContractStage() {
      let param = {
        packageId: this.check.packageId
      }
      const res = await getContractStage(param)
      if (!this.checkRequest(res)) return;
      this.stageList = res.data.data.unfinish
    },
    // 获取审批节点
    async initApproval() {
      let param = {
        packageId: this.check.packageId,
        approvalType: this.check.approvalType
      }
      const res = await getApprovalNodes(param)
      if (!this.checkRequest(res)) return;
      this.approvalList = res.data.data.currentNodes
      this.approvalHistoryList = res.data.data.historyNodes
    },
    // 跳转指派验收人
    jumpPerson() {
      this.$router.push({path: '/check-person', query: query})
    },
    // 重新获取审批节点信息
    resetApproval() {
      this.initApproval()
    }
  },
  components: {
    projectForm,
    split,
    XButton,
    contractForm,
    approvalForm,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
@import '../../assets/style/info.styl'
</style>
