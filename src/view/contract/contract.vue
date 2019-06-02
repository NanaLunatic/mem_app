<template>
  <div class="contract">
    <div class="contract-wrapper">
      <contract-list top="0"></contract-list>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getContractList } from 'api'
import contractList from 'components/list/contract-list'
// import { Tab, TabItem } from 'vux'
import { sessionStorage } from 'assets/js/storage.js'

export default {
  data() {
    return {
      // type: 1, // 1-未指派 2-进行中 3-已完成
      // tabList: [
      //   {label: '未完成', count: '', isRead: 2},
      //   {label: '已完成', count: '', isRead: 2},
      // ],
    }
  },
  // created() {
  //   let moduleType = sessionStorage.getItem('module_type')
  //   if (moduleType && moduleType.module == 'contract') {
  //     this.type = parseInt(moduleType.type)
  //   }
  //   this.tabList[0]['count'] = this.total.contract01
  //   this.tabList[1]['count'] = this.total.contract02
  //   // this.initData()
  // },
  // computed: {
    // total() {
    //   return this.$store.state.total
    // },
    // computedtabList() {
    //   let read = this.$store.state.read
    //   this.tabList[0]['isRead'] = read.contractIsRead01
    //   this.tabList[1]['isRead'] = read.contractIsRead02
    //   return this.tabList
    // }
  // },
  // methods: {
  //   changeType(index) {
  //     this.type = index + 1
  //   },
  // },
  components: {
    // Tab,
    // TabItem,
    contractList,
  }
}
</script>

<style lang="stylus" scoped>
.contract
  .tab-wrapper
    position fixed
    top 0
    left 0
    width 100%
    .tab-item
      position relative
    .dot
      position absolute
      top 18px
      left 20px
      display inline-block
      width 8px
      height 8px
      border-radius 50%
      background red
      margin-right 10px
  .contract-wrapper
    width 100%
</style>
