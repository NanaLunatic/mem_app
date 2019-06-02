<template>
  <div class="home">
    <router-view></router-view>
    <div class="bg-notice" v-show="noticeShow" @click="noticeShow = false">
      <img src="static/images/tishiu.png" alt="">
    </div>
    <div class="tab-bottom-wrapper">
    <swipeout>
      <swipeout-item transition-mode="follow">
        <div slot="right-menu">
          <swipeout-button type="primary" @click.native="jumpMine">设置</swipeout-button>
        </div>
        <div slot="content" class="demo-content vux-1px-t"  @click="noticeShow = false">
          <tabBottom :list="tabComputed"></tabBottom>
        </div>
      </swipeout-item>
     </swipeout>
    </div>
    <!-- <tabBottom :list="tabList"></tabBottom> -->
  </div>
</template>

<script type="text/ecmascript-6">
import { getTotalMap, getTotalContract } from 'api'
import tabBottom from 'components/tab/tab-bottom'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { localStorage,sessionStorage } from 'assets/js/storage.js'
export default {
  data() {
    return {
      noticeShow:false,
      tabListOfOffice: [
        {
          type: 0, // 0-松岗办公人员 1-承包方
          label: '指派任务',
          value: '0',
          icon: 'icon-renwu5',
          link: 'assign',
          description: 'assign',
        },
        {
          type: 0,
          label: '执行任务',
          value: '1',
          icon: 'icon-renwu',
          link: 'carry',
          description: 'carry',
        },
        {
          type: 0,
          label: '审批任务',
          value: '2',
          icon: 'icon-renwuguanli1',
          link: 'check',
          description: 'check',

        },
      ],
      tabListOfSupply: [
        {
          type: 1,
          isRead: '',
          label: '承包中合同',
          value: '0',
          icon: 'icon-yichengbaohetong',
          link: 'contract',
          description: 'contract',

        },
        {
          type: 1,
          label: '新合同消息',
          isRead: '',
          value: '1',
          icon: 'icon-xiaoxi2',
          link: 'news',
          description: 'news',
        },
      ]
    }
  },
  computed: {
    total() {
      return this.$store.state.total
    },
    totalContract() {
      let total = this.$store.state.totalContract
      return total
    },
    tabComputed() {
      //let userInfo = sessionStorage.getItem('user_info')
      let userInfo = localStorage.getItem('user_info')
      if (userInfo.temporary == 1) {  // 松岗办公人员
        this.tabListOfOffice[0]['count'] = this.total.assign01
        this.tabListOfOffice[1]['count'] = this.total.carry01
        this.tabListOfOffice[2]['count'] = this.total.apply01
        // this.$router.push('/home/assign')
        return this.tabListOfOffice
      } else if (userInfo.temporary == 5) { // 承包商
        this.tabListOfSupply[0]['count'] = this.totalContract.inTheContract.count
        this.tabListOfSupply[0]['isRead'] = this.totalContract.inTheContract.isRead
        this.tabListOfSupply[1]['count'] = this.totalContract.theContractor.count
        this.tabListOfSupply[1]['isRead'] = this.totalContract.theContractor.isRead
        return this.tabListOfSupply
      } else {
        return []
      }
    }
  },
  created() {
    this.initTotal()
    this.initTotalContract()

    let firstLogin = sessionStorage.getItem('select_first')
    if(firstLogin == 1){
      this.noticeShow = true
      sessionStorage.setItem('select_first', 0)
    }
  },
  methods: {
    jumpMine() {
      this.$router.push('/mine')
    },
    // 初始化松岗办公人员tab的未读数量
    async initTotal() {
      const res = await getTotalMap({})
      if(!this.checkRequest(res)) return;
      this.$store.commit('saveTotal', res.data.data)
    },
    // 初始化承包方tab的未读数量
    async initTotalContract() {
      const res = await getTotalContract({})
      if(!this.checkRequest(res)) return;
      this.$store.commit('saveTotalContract', res.data.data)
    }
  },
  components: {
    tabBottom,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
.bg-notice
  bottom: 0px;
  z-index: 10;
  margin-bottom: 50px;
  position: absolute;
  img 
    width: 100%;
.tab-bottom-wrapper
  position fixed
  left 0
  bottom 0
  width 100%
  border-top 1px solid #eee
  border-right 7px solid $primary-color
  box-sizing border-box
  z-index 10
</style>
