<template>
  <div class="check">
    <div class="tab-wrapper">
      <tab>
        <tab-item
          class="tab-item"
          @on-item-click="changeType"
          v-for="(item, index) in computedtabList"
          :selected="type == index + 1"
          :key="index">
          <i class="dot" v-show="item.isRead == 1"></i>{{ item.label }}{{ item.count | formateTabCount }}
        </tab-item>
      </tab>
    </div>
    <div class="check-wrapper">
      <check-list :type="type"></check-list>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import checkList from 'components/list/check-list'
import { Tab, TabItem } from 'vux'
import { sessionStorage } from 'assets/js/storage.js'
export default {
  data() {
    return {
      type: 1, // 1-待审批 2-已审批
      tabList: [
        {label: '待审批', count: '', isRead: 2},
        {label: '已审批', count: '', isRead: 2},
      ],
    }
  },
  created() {
    let moduleType = sessionStorage.getItem('module_type')
    if (moduleType && moduleType.module == 'check') {
      this.type = parseInt(moduleType.type)
    }
    this.tabList[0]['count'] = this.total.apply01
    this.tabList[1]['count'] = this.total.apply02
    // this.initData()
  },
  computed: {
    total() {
      return this.$store.state.total
    },
    computedtabList() {
      let read = this.$store.state.read
      this.tabList[0]['isRead'] = read.checkIsRead01
      this.tabList[1]['isRead'] = read.checkIsRead02
      return this.tabList
    }
  },
  methods: {
    changeType(index) {
      this.type = index + 1
    },
  },
  components: {
    Tab,
    TabItem,
    checkList,
  }
}
</script>

<style lang="stylus" scoped>
.check
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
  .check-wrapper
    width 100%
</style>
