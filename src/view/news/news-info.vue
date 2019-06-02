<template>
  <div class="news-info info">
    <div class="head">
      <span class="text">您有以下新合同消息</span>
      <span class="date">{{ news.createTime | formateDate('yyyy.MM.dd hh:mm') }}</span>
    </div>
    <h4 class="name">{{ projectInfo.getIfom.name }}</h4>
    <project-form :info="projectInfo"></project-form>
    <contract-form :contract="contract" :package-id="news.packageId.toString()" :stage-list="stageList"></contract-form>
    <div class="form-wrapper">
      <div class="reply-head">回复意见</div>
      <transition name="slide">
        <div class="row" v-if="isShowOpinion">
          <span class="title">其他意见：</span>
          <span class="content">
            <input type="text" name="" id="" v-model.trim="opinion" maxlength="40">
          </span>
        </div>
      </transition>
      <div class="btn-group" v-if="checkNode.status == 1">
        <X-button class="btn-item" mini type="primary" @click.native="submitApproval(0)">同意</X-button>
        <X-button class="btn-item" mini type="warn" @click.native="submitApproval(1)">不同意</X-button>
        <span class="text" @click="showOpinion" v-if="!isShowOpinion">其他意见</span>
      </div>
      <div class="wrapper-notice"><p>*回复后，该消息将不做保留</p></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getProjects, getContract, getTaskExecutor, getApprovalNodes, getContractStage, approvalRefuses, approvalAgrees, updateReply } from 'api'
import projectForm from 'components/form/project-form'
import contractForm from 'components/form/contract-form'
import split from 'components/split/split'
import { XButton } from 'vux'
import { localStorage, sessionStorage } from 'assets/js/storage.js'
export default {
  data() {
    return {
      projectInfo: {
        getIfom: {
          name: ''
        }
      },
      contract: {},
      isShowOpinion: false,
      checkNode: { },
      opinion: '',
      stageCheckedList: [],
      stageList: [],
    }
  },
  created() {
    this.initProject()
    this.initContract()
    this.initContractStage()
    this.initApproval()
  },
  computed: {
    // userInfo() {
    //   let userInfo = sessionStorage.getItem('user_info')
    //   if(userInfo) {
    //     this.$store.commit('saveUserInfo', userInfo)
    //   }
    //   return this.$store.state.userInfo
    // },
    news() {
      let news = localStorage.getItem('news')
      if(news) {
        this.$store.commit('saveNews', news)
      }
      return this.$store.state.news
    },
    userMain() {
      let userMain = localStorage.getItem('user_main')
      return userMain
    }
  },
  methods: {
    // 获取项目信息
    async initProject() {
      let param = {
        projectNo: this.news.projectNo,
        noticeId: this.news.noticeId
      }
      const res = await getProjects(param)
      if (!this.checkRequest(res)) return;
      this.projectInfo = res.data.data
    },
    // 获取合同
    async initContract() {
      let param = {
        id: this.news.packageId
      }
      const res = await getContract(param)
      if (!this.checkRequest(res)) return;
      this.contract = res.data.data
    },
    async initContractStage() {
      let param = {
        packageId: this.news.packageId,
        id: this.news.id,
      }
      const res = await getContractStage(param)
      if (!this.checkRequest(res)) return;
      this.stageList = res.data.data.unfinish
    },
    // 获取审批节点
    async initApproval() {
      let param = {
        packageId: this.news.packageId,
        approvalType: 2, // 1-发包 ，2-合同，此处都是合同审批类型
      }
      const res = await getApprovalNodes(param)
      if (!this.checkRequest(res)) return;
      let approvalList = res.data.data.currentNodes
      for(let item of approvalList) {
        if(item.approver == this.userMain.id) {
          this.checkNode = item
        }
      }
    },
    // 显示审批弹窗
    submitApproval(flag) {
      let content = flag ? '不同意' : '同意'
      console.log(content)
      this.$vux.confirm.show({
        title: '确认',
        content: `回复意见【${content}】`,
        onConfirm: () => {
          this.agreesOrRefuses(flag)
        }
      })
    },
    // 提交审批
    async agreesOrRefuses(flag) {
      let res = null
      let param = {
        id: this.checkNode.id,
        content: this.opinion,
      }
      // 同意
      if(!flag) {
        res = await approvalAgrees(param)
      } else {
        res = await approvalRefuses(param)
      }
      if(!this.checkRequest(res)) return;
      this.changeReadStatus()
      this.$vux.toast.show({
        text: '提交成功',
        onHide: () => {
          this.$router.push('/home/news')
        }
      })
    },
    // 新消息回复后修改消息已读未读
    async changeReadStatus() {
      let param = {
        id: this.news.id
      }
      const res = await updateReply(param)
      if(!this.checkRequest(res)) return;
    },
    reset() {
      this.initApproval()
    },
    // 显示其他意见输入框
    showOpinion() {
      this.isShowOpinion = true
    },
  },
  components: {
    projectForm,
    split,
    XButton,
    contractForm,
    getApprovalNodes,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
@import '../../assets/style/info.styl'
@import '../../components/form/index.styl'
.news-info
  .form-wrapper, .reply-wrapper
    border-top-bottom()
    margin-top 10px
    background #fff
    padding 10px
    .reply-head
      font-size 15px
      padding 15px 25px
      font-weight 500
      color #333
  	.row
      padding 0 25px
      &.slide-enter-active, &.slide-leave-active
        transition transform .3s, opacity .5s
      &.slide-enter, &.slide-leave-to
        transform translateY(-20px)
        opacity 0
      .title, .content
        font-size 13px
        font-weight 700
        color #454545
        margin-right 5px
        padding 5px
        input
          border 1px solid #999
          height 20px
          border-radius 5px
        &.light
          color #309304
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
    .wrapper-notice
        margin-top: 10px
        p
          padding-left: 17px
          font-size: 12px
          color: #999
  .reply-wrapper
    width 100%
</style>
