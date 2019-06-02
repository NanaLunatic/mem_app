<template>
  <div class="assign">
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
    <div class="assign-wrapper">
      <assign-list :type="type"></assign-list>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getAssignList } from 'api'
import assignList from 'components/list/assign-list'
import { Tab, TabItem } from 'vux'
import { sessionStorage } from 'assets/js/storage.js'

export default {
  data() {
    return {
      type: 1, // 1-未指派 2-进行中 3-已完成
      tabList: [
        {label: '未指派', count: '', isRead: 2},
        {label: '进行中', count: '', isRead: 2},
        {label: '已完成', count: '', isRead: 2},
      ],
    }
  },
  created() {
    let moduleType = sessionStorage.getItem('module_type')
    if (moduleType && moduleType.module == 'assign') {
      this.type = parseInt(moduleType.type)
    }
    this.tabList[0]['count'] = this.total.assign01
    this.tabList[1]['count'] = this.total.assign02
    this.tabList[2]['count'] = this.total.assign03
    // this.initData()
  },
  computed: {
    total() {
      return this.$store.state.total
    },
    computedtabList() {
      let read = this.$store.state.read
      this.tabList[0]['isRead'] = read.assignIsRead01
      this.tabList[1]['isRead'] = read.assignIsRead02
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
    assignList,
  }
}
</script>

<style lang="stylus" scoped>
.assign
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
  .assign-wrapper
    width 100%
</style>
