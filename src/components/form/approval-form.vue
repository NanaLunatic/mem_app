<template>
  <div class="approval-form form">
    <ul class="list">
      <!-- 历史审批节点 审批模块 >> 已完成，才显示-->
      <li class="item" v-for="(approval, index) in approvalHistoryList" :key="index" v-if="isModuleType('check', '2')">
        <!-- 发包表审批才显示审批阶段 -->
        <div class="row" v-if="approvalType == 1">
          <span class="title">审批阶段：</span>
          <span class="content">{{ approvalStage[approval.order] }}</span>
        </div>
        <div class="row">
          <span class="title">{{ approval.deptName == '承包商' ? '承包商' : '审批人' }}：</span>
          <span class="content"><a class="tel" :href="`tel:${approval.approverPhone}`">{{ approval.deptName == '承包商' ? approval.approverName : `${approval.deptName}-${approval.approverName}` }}</a></span>
        </div>
        <div class="row" v-if="approval.status != 0">
          <span class="title">{{  approval.deptName == '承包商' && approvalType == 2 ? '承包商回复意见' :'审批意见' }}：</span>
          <span class="content" :class="{green: approval.status == 2, warn: approval.status == 3}">{{ approval.status | formateApprovalStatus }}</span>
          <span class="date">{{ approval.approvalDate | formateDate('yyyy.MM.dd') }}</span>
        </div>
      </li>
      <!-- 当前审批节点 -->
      <li class="item" v-for="(approval, index) in approvalList" :key="index" >
        <!-- 发包表审批才显示审批阶段 -->
        <div class="row" v-if="approvalType == 1">
          <span class="title">审批阶段：</span>
          <span class="content">{{ approvalStage[approval.order] }}</span>
        </div>
        <div class="row">
          <span class="title">{{ approval.deptName == '承包商' ? '承包商' : '审批人' }}：</span>
          <span class="content"><a class="tel" :href="`tel:${approval.approverPhone}`">{{ approval.deptName == '承包商' ? approval.approverName : `${approval.deptName}-${approval.approverName}` }}</a></span>
        </div>
        <div class="row" v-if="approval.status != 0">
          <span class="title">{{  approval.deptName == '承包商' && approvalType == 2 ? '承包商回复意见' :'审批意见' }}：</span>
          <span class="content" :class="{green: approval.status == 2, warn: approval.status == 3}">{{ approval.status | formateApprovalStatus }}</span>
          <span class="date">{{ approval.approvalDate | formateDate('yyyy.MM.dd') }}</span>
        </div>
        <transition name="slide">
          <div class="row" v-show="approval.status == 1 && isShowOpinion">
            <span class="title">其他意见：</span>
            <span class="content">
              <input type="text" v-model.trim="opinion" maxlength="40">
            </span>
          </div>
        </transition>
        <div class="btn-group" v-if="approval.status == 1 && approval.approver == userMain.id  && !isModuleType('check', '2')">
          <X-button class="btn-item" mini type="primary" @click.native="submitApproval(approval.id, 0)">同意</X-button>
          <X-button class="btn-item" mini type="warn" @click.native="submitApproval(approval.id, 1)">不同意</X-button>
          <span class="text" @click="showOpinion" v-if="!isShowOpinion">其他意见</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import { localStorage, sessionStorage } from 'assets/js/storage'
import { XButton } from 'vux'
import { approvalAgrees, approvalRefuses } from 'api'
export default {
  props:{
    approvalList: {
      type: Array,
      default: function() {
        return []
      },
    },
    approvalHistoryList: {
      type: Array,
      default: function() {
        return []
      },
    },
    approvalType: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      isShowOpinion: false,
      opinion: '',  //审批意见
      approvalStage: ['', '城建办审核意见', '项目主管领导审批意见', '分管建设领导审批意见', '城市建设工作领导小组组长审批意见']
    }
  },
  computed: {
    userMain() {
      let userMain = localStorage.getItem('user_main')
      return userMain
    }
  },
  methods: {
    showOpinion() {
      this.isShowOpinion = true
    },
    submitApproval(nodeId, flag) {
      let content = flag ? '不同意' : '同意'
      this.$vux.confirm.show({
        title: '确认',
        content: `审批意见【${content}】`,
        onConfirm: () => {
          this.agreesOrRefuses(nodeId, flag)
        }
      })
    },
    async agreesOrRefuses(nodeId, flag) {
      let res = null
      let param = {
        id: nodeId,
        content: this.opinion,
      }
      // 同意
      if(!flag) {
        res = await approvalAgrees(param)
      } else {
        res = await approvalRefuses(param)
      }
      if(!this.checkRequest(res)) return;
      this.$vux.toast.show({
        text: '提交成功',
        onHide: () => {
          this.isShowOpinion = false
          this.$emit('reset')
        }
      })
    }
  },
  components: {
    XButton
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
.approval-form
  background $bg-color
  margin-top 10px
  .list
    .item
      border-top-bottom()
      background #fff
      margin-bottom 10px
      padding 10px 25px
      .row
        &.slide-enter-active
          transition transform .3s, opacity .5s
        &.slide-enter
          transform translateY(-20px)
          opacity 0
        .title, .content
          font-size 13px
          font-weight 700
          color #454545
          margin-right 5px
          &.green
            color #309304
          &.warn
            color $warn-color
          input
            border 1px solid #999
            height 20px
            border-radius 5px
        .date
          flex 1
          text-align right
        .tel
          font-size 13px
          font-weight 700
          color #454545
      .btn-group
        padding 10px 0
        display flex
        width 100%
        flex-direction row
        justify-content space-around
        align-items center
        .btn-item
          width 100px
          height 35px
          margin 0
        .text
          color $primary-color
</style>
