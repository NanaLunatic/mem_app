<template>
  <div class="assign-person">
    <ul class="query-wrapper">
      <li class="query-item">
        <span class="text">部门</span>
        <select v-model="deptId" >
            <option :value="dept.id" v-for="dept in deptList" :key="dept.id" >{{ dept.name }}</option>
        </select>
      </li>
      <li class="query-item">
        <span class="text">姓名</span>
        <input type="text" v-model.trim="userName">
      </li>
    </ul>
    <split></split>
    <div class="table-wrapper">
      <table class="fixed">
        <tr>
          <td>所属部门</td>
          <td>姓名</td>
          <td>电话号码</td>
        </tr>
      </table>
      <table>
        <tr>
          <td>所属部门</td>
          <td>姓名</td>
          <td>电话号码</td>
        </tr>
        <tr :class="{active: user.selected === 1}" v-for="user in userList" :key="user.id" @click="selectUser(user)">
          <td>{{ user.deptName }}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.phone }}</td>
        </tr>
      </table>
    </div>
    <div class="selected-wrapper">
      <div class="head">
        <span class="text">已选择：</span>
        <span class="btn" @click="showConfirm">指派</span>
      </div>
      <div class="content">
        <ul>
          <li class="selected-item" v-for="(select, index)  in selectedList" :key="select.id">
            <div class="box">
              <span class="text">{{ select.deptName }}&nbsp;&nbsp;{{ select.userName }}</span>
              <i class="iconfont icon-cha1" @click="removeSelected(select, index)"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-transfer-dom class="confirm-wrapper">
      <confirm v-model="isShowConfirm"
       title="指派详情确认"
      @on-confirm="submitCheck">
       <div class="row">任务开始时间： <span class="light">{{ startDate }}</span></div>
       <div class="row">任务结束时间： <span class="light">{{ endDate }}</span></div>
       <!-- <div class="row">验收人：<span v-for="select in selectedList" :key="select.id">{{ select.userName }}</span></div> -->
       <div class="row">验收人：<span class="light">{{ selectedList | formateTaskPerson('userName') }}</span></div>
       <div class="row">备注：<span class="light">{{ remark }}</span></div>
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDeptList, getUserList, insertCheck } from 'api'
import { Confirm, XDialog, TransferDomDirective as TransferDom } from 'vux'
import split from 'components/split/split'
import { setTimeout } from 'timers';
import { localStorage, sessionStorage } from 'assets/js/storage.js'
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      deptId: '',
      deptList: [],
      userName: '',
      selectedList: [],
      userList: [],
      isShowConfirm: false,
      isShowSuccess: true,
      startDate: '',
      endDate: '',
      remark: '',
      isShowSucceed: false,
      info: {
      }
    }
  },
  created() {
    let query = this.$route.query
    this.startDate = query.startDate
    this.endDate = query.endDate
    this.remark = query.remark
    this.initDept()
    this.initUser()
  },
  watch: {
    deptId(newValue, oldValue) {
      this.initUser()
    },
    userName(newValue, oldValue) {
      this.initUser()
    }
  },
  computed: {
    assign() {
      let assign = localStorage.getItem('assign')
      if(assign) {
        this.$store.commit('assign', assign)
      }
      return this.$store.state.assign
    },
    selectedIdList() {
      let arr = []
      for (let select of this.selectedList) {
        let obj = {}
        obj.checkUserId = select.id
        obj.checkPhone = select.phone
        arr.push(obj)
      }
      return arr
    }
  },
  methods: {
    // 获取部门列表
    async initDept() {
      const res = await getDeptList({})
      if(!this.checkRequest(res)) return;
      this.deptList = res.data.data
    },
    // 获取用户列表
    async initUser() {
      let param = {
        deptId: this.deptId,
        userName: this.userName
      }
      const res = await getUserList(param)
      if(!this.checkRequest(res)) return;
      this.userList = res.data.data
      let selectedId = []
      for (let select of this.selectedList) {
        selectedId.push(select.id)
      }
      if (selectedId && this.selectedId.length) {
        for(let user of this.userList) {
          if(this.selectedId.indexOf(user.id) > -1) {
            user.selected = 1
          } else {
            user.selected = 0
          }
        }
      }
    },
    showConfirm() {
      this.isShowConfirm = true
    },
    // 提交验收人
    async submitCheck() {
      if (!this.selectedIdList || !this.selectedIdList.length) {
        this.$vux.toast.show({
          type:'warn',
          text: '请选择验收人',
          duration: 3000
        })
        return
      }
      if( !this.startDate || !this.endDate) {
        this.$vux.toast.show({
          type:'warn',
          text: '请选择任务开始时间或结束时间',
          duration: 3000
        })
        return
      }
      // 参数
      let param = {
        projectId: this.assign.projectId,
        packageId: this.assign.packageId,
        checkTaskId: this.$store.state.assign.bizId,
        checkStartDate: this.startDate,
        checkEndDate: this.endDate,
        remark: this.remark,
        checkUserList: this.selectedIdList,
        projectName: this.assign.projectName,
        contractName: this.assign.contractName,
      }
      const res = await insertCheck(param)
      if(!this.checkRequest(res)) return;
      let time = 2000
      this.$vux.toast.show({
        text: '提交成功',
        duration: time
      })
      setTimeout(() => {
        sessionStorage.setItem('module_type', {
          module: 'assign',
          type: 2
        })
        this.$router.push('/home/assign') // 为了点击后退时，返回列表页
        this.$router.push('/assign-info')
      }, time)
    },
    // 选择验收人
    selectUser(user) {
      if(!user.selected) {
        // 最多指派4人
        if (this.selectedList.length >= 4) {
          this.$vux.toast.show({
            type: 'warn',
            text: '最多指派4人！',
            duration: 3000
          })
          return
        }
        this.$set(user, 'selected', 1)
        this.selectedList.push(user)
      } else {
        let index = this.selectedList.indexOf(user)
        this.selectedList.splice(index,1)
        this.$set(user, 'selected', 0)
      }
    },
    removeSelected(select, index) {
      for(let user of this.userList) {
        if( user.id === select.id ) {
          user.selected = 0
        }
      }
      this.selectedList.splice(index, 1)
    }
  },
  components: {
    split,
    Confirm,
    XDialog,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
.assign-person
    width 100%
    height 100%
    background $bg-color
    .query-wrapper
      background #fff
      font-size 0
      width 100%
      padding  15px 0px
      .query-item
        width 50%
        font-size 13px
        display flex
        align-items center
        display inline-block
        flex-wrap nowrap
        span
          flex 0 0 30px
          width 30px
          text-align right
          display inline-block
          margin 0 5px
        input, select
          flex 1
          width 110px
          display inline-block
          border-radius 5px
          border 1px solid $primary-color
          height 30px
    .table-wrapper
      position absolute
      top 72px
      bottom 170px
      width 100%
      background $bg-color
      padding-bottom 10px
      overflow auto
      table
        width 100%
        background #fff
        &.fixed
          position fixed
          top 72px
          left 0
          width 100%
        tr
          color #333
          &:first-child
            background $primary-color
            color #fff
          &.active
            background #ddf1ff
            td
              font-family "微软雅黑"
              font-family "Microsoft YaHei"
          td
            font-size 14px
            text-align center
            padding 10px
            border 1px solid $border-color
            width 30%
            // box-sizing border-box
            &:first-child
              width 40%

    .selected-wrapper
      position fixed
      bottom 0
      height 170px
      width 100%
      border-top 1px solid $border-color-input
      overflow: hidden
      overflow-y: auto
      .head
        display flex
        font-size 14px
        .text
          flex 1
          padding 10px 20px
          color $primary-color
          font-weight 600
        .btn
          flex 0 0 100px
          width 100px
          padding 10px 0
          text-align center
      .content
        .selected-item
          padding 5px
          text-align left
          display inline-block
          font-size 14px
          margin-top 15px
          margin-right 5px
          // width 50%
          // box-sizing border-box
          .box
            padding 8px 30px 8px 8px
            border-radius 5px
            display inline-block
            border 1px solid $border-color-input
            // min-width 150px
            position relative
            .iconfont
              position absolute
              top 6px
              right 7px
              color $primary-color
              font-weight 600
              font-size 16px
.confirm-wrapper
  .row
    width 85%
    margin 0 auto
    .light
      color $primary-color
</style>
