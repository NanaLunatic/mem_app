<template>
  <div class="contract-info info">
    <h4 class="name">{{ projectInfo.getIfom.name }}</h4>
    <project-form :info="projectInfo"></project-form>
    <ul class="contract">
      <li class="contract-item">
        <ul class="info-wrapper">
          <li class="item">
            <span class="item-title">合同类型：</span>
            <span class="item-content">{{ contractInfo.contractName }}</span>
          </li>
          <li class="item">
            <span class="item-title">合同金额：</span>
            <span class="item-content">{{ contractInfo.contractMoney }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">合同签订日期：</span>
            <span class="item-content">{{ contractInfo.contractSigningDate  | contractInfo.contractSigningDate == '' ? '' : formateDate('yyyy.MM.dd') }}</span>
          </li>
          <li class="item">
            <span class="item-title">合同工期：</span>
            <span class="item-content">{{ contractInfo.contractDays }}（日历天）</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 已验收合同阶段 -->
    <div class="name">合同阶段条款</div>
    <div class="stage-wrapper ">
      <ul>
        <li class="stage-item" v-for="(stage, index) in stageCheckedList" :key="index">
          <ul class="step-wrapper">
            <li clas="step-item" v-for="item in stage.contractStage" :key="item.id">
              <div class="step"><span>{{ item.step | formateCheckStep }}</span></div>
              <div class="standard">验收标准：<span>{{ item.standard }}</span></div>
              <div class="money">可请款金额：<span>{{ item.collectonMoney }}万元</span></div>
            </li>
            <li class="show-btn">
              <div class="state" :class="{green: stage.status == 2 || stage.status == 4}" v-if="!stage.isShowTotal">{{ stage.status | formateStageStatus(2) }}</div>
              <i class="iconfont icon-zhankai" :class="{'rotate': !stage.isShowTotal}"  @click="showTotal(stage)"></i>
            </li>
          </ul>
          <transition name="slide">
            <div class="total-wrapper" v-show="stage.isShowTotal">
              <div class="total-money">请款总金额：{{ stage.totalMoney }}万元</div>
              <div class="date">提交验收：{{ stage.creationTime | formateDate('yyyy.MM.dd hh:mm') }}</div>
              <div class="date" v-show="stage.checkFinishTime == '' || stage.checkFinishTime == null ? false : true">验收完成：{{ stage.checkFinishTime | formateDate('yyyy.MM.dd hh:mm') }}</div>
              <div class="date" v-show="stage.completeTime == null || stage.completeTime == '' ? false : true">支付完成：{{ stage.completeTime | formateDate('yyyy.MM.dd hh:mm') }}</div>
              <div class="state" :class="{green: stage.status == 2 || stage.status == 4}">{{ stage.status | formateStageStatus(2) }}</div>
            </div>
          </transition>
        </li>
      </ul>
    </div>
    <!-- 待验收合同阶段 -->
    <div class="stage-wrapper">
      <ul>
        <li class="stage-item" v-for="(stage, index) in stageList" :key="index" @click="selectStage(stage, index)">
          <div class="step-wrapper">
            <div class="step"><span>{{ stage.step | formateCheckStep }}</span></div>
            <div class="standard">验收标准：<span>{{ stage.standard }}</span></div>
            <div class="money">可请款金额：<span>{{ stage.collectonMoney }}万元</span></div>
            <!-- stageCheckedList.status 0-未指派，1-验收中，2-验收通过，3-验收不通过 4-已支付-->
            <div class="checkbox" v-if="showCheckBtn">
              <i class="iconfont" :class="{'icon-gou': stage.checked == 1}"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <x-button type="primary" class="btn" @click.native="showConfirm" v-show="showCheckBtn">发起验收申请</x-button>
    <div v-transfer-dom>
      <confirm v-model="isShowConfirm"
        title="发起验收内容"
        @on-confirm="submit">
          <div class="stage-wrapper">
            <ul>
              <li class="stage-item" v-for="(stage, index) in stageList" :key="index" v-if="stage.checked">
                <div class="step">{{ stage.step | formateCheckStep }}</div>
                <div class="standard">验收标准：{{ stage.standard }}</div>
                <div class="money">可请款金额：{{ stage.collectonMoney }}万元</div>
              </li>
              <li class="stage-item total">请款总金额：{{ selectStageObj.totalMoney }}万元</li>
            </ul>
          </div>
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getProjects, getContract, getTaskExecutor, getApprovalNodes, getContractStage, submitCheckApply } from 'api'
import projectForm from 'components/form/project-form'
import split from 'components/split/split'
import { Confirm, XButton, TransferDomDirective as TransferDom } from 'vux'
import { localStorage, sessionStorage } from 'assets/js/storage.js'
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      projectInfo: {
        getIfom: {
          name: ''
        }
      },
      contractInfo: {},
      contractStep: {},
      isShowOpinion: false,
      checkNode: { },
      opinion: '',
      stageCheckedList: [],  // 已验收
      stageList: [],  // 待验收
      isShowConfirm: false, // 发起验收的弹窗
    }
  },
  computed: {
    userInfo() {
      let userInfo = localStorage.getItem('user_info')
      if(userInfo) {
        this.$store.commit('saveUserInfo', userInfo)
      }
      return this.$store.state.userInfo
    },
    contract() {
      let contract = sessionStorage.getItem('contract')
      if(contract) {
        this.$store.commit('saveContract', contract)
      }
      return this.$store.state.contract
    },
    showCheckBtn() {
      if (!this.stageList || !this.stageList.length) {
        return false
      }

      if (this.stageCheckedList && this.stageCheckedList.length) { // 存在提交的
        let lastIndex = this.stageCheckedList.length - 1
         // status:0-未指派，1-验收中，2-验收通过，3-验收不通过
        if (this.stageCheckedList[lastIndex].status == 0 || this.stageCheckedList[lastIndex].status == 1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    selectStageObj() {
      let id = []
      let step = []
      let totalMoney = 0
      let standard = ''
      for(let item of this.stageList) {
        if (item.checked) {
          id.push(item.id)
          step.push(item.step)
          standard = item.standard
          totalMoney += parseFloat(item.collectonMoney)
        }
      }
      return {
        id,
        step,
        totalMoney,
        standard,
      }
    },
  },
  created() {
    this.initProject()
    this.initContract()
    this.initContractStage()
    this.initApproval()
  },

  methods: {
    // 获取项目信息
    async initProject() {
      let param = {
        projectNo: this.contract.projectNo,
        noticeId: this.contract.noticeId
      }
      const res = await getProjects(param)
      if (!this.checkRequest(res)) return;
      this.projectInfo = res.data.data
    },
    // 获取合同
    async initContract() {
      let param = {
        id: this.contract.packageId
      }
      const res = await getContract(param)
      if (!this.checkRequest(res)) return;
      this.contractInfo = res.data.data
    },
    // 获取合同阶段
    async initContractStage() {
      let param = {
        packageId: this.contract.packageId,
        id: this.contract.id
      }
      const res = await getContractStage(param)
      if (!this.checkRequest(res)) return;
      this.stageCheckedList = res.data.data.finish
      this.stageList = res.data.data.unfinish
    },
    // 获取审批节点
    async initApproval() {
      let param = {
        packageId: this.contract.packageId,
        approvalType: 2, // 1-发包 ，2-合同
      }
      const res = await getApprovalNodes(param)
      if (!this.checkRequest(res)) return;
      let approvalList = res.data.data.currentNodes
      for(let item of approvalList) {
        if(item.approval == this.userInfo.id) {
          this.checkNode = item
        }
      }
    },
    // 选择验收阶段
    selectStage(stage, index) {
      if(!stage.checked) {
        for(let i = 0; i <= index; i++) {
          this.$set(this.stageList[i], 'checked', 1)
        }
      } else {
        for(let i = index; i <= this.stageList.length - 1; i++) {
          this.$set(this.stageList[i], 'checked', 0)
        }
      }
    },
    // 显示弹窗
    showConfirm() {
      let stageObj = this.selectStageObj
      if(!stageObj.id || !stageObj.id.length) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择要验收的阶段'
        })
        return
      }
      this.isShowConfirm = true
    },
    // 发起验收
    async submit() {
      let stageObj = this.selectStageObj
      if(!stageObj.id || !stageObj.id.length) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择要验收的阶段'
        })
        return
      }
      let param = {
        projectId: this.contract.projectId,
        packageId: this.contract.packageId,
        checkStep: stageObj.step.join(','),
        standrd: stageObj.standard,
        totalMoney: stageObj.totalMoney,
        listId: stageObj.id,
        contractName: this.contract.name,
        projectName: this.contract.title,
      }
      const res = await submitCheckApply(param)
      if(!this.checkRequest(res)) return;
      this.$vux.toast.show({
        text: '提交成功',
      })
      this.initContractStage()
    },
    showTotal(stage) {
      if (stage.isShowTotal) {
        this.$set(stage, 'isShowTotal', false)
      } else {
        this.$set(stage, 'isShowTotal', true)
      }
    }
  },
  components: {
    projectForm,
    split,
    XButton,
    getApprovalNodes,
    Confirm,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
@import '../../assets/style/info.styl'
.contract-info
  .stage-wrapper
    border-top-bottom()
    margin-top 10px
    .stage-item
      position relative
      padding 10px 25px
      line-height 20px
      font-size 12px
      background #fff
      border-bottom 1px solid $border-color
      color #8b8b8b
      &:last-child
        border none
      .step-wrapper
        padding 15px 0 4px 0;
        font-size 16px
        color #8b8b8b
        position relative
        .step
          margin-bottom 5px
        .money
          margin-bottom 15px
        .show-btn
          position absolute
          bottom 16px
          right 0
          text-align right
          .iconfont
            transition transform .3s
            display inline-block
            &.rotate
              transform rotate(-180deg)
        span
          color #434343
      .total-wrapper
        text-align right
        margin-top 4px
        font-size 16px
        color #434343
        &.slide-enter-active, &.slide-leave-active
          transition transform .5s, opacity .2s
        &.slide-enter, &.slide-leave-to
          transform translateY(-50px)
          opacity 0
        .total-money
          margin-bottom 7px
      .checkbox
        position absolute
        top 50%
        right 25px
        margin-top -5px
        .iconfont
          width 12px
          height 12px
          padding 2px
          border 1px solid #ccc
          display block
          font-size 12px
          line-height 12px
          &.icon-gou
            border none
            background $primary-color
            color #fff
.state
  margin-top 7px
  color #434343
  &.green
    color $green-color
  &.red
    color $red-color
.stage-wrapper
  .stage-item
    text-align left
    margin-bottom 10px
    &.total
      color $primary-color
    .standard, .money
      padding-left 30px

</style>
