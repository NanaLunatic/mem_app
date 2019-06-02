<template>
  <div class="carry">
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
    <div class="carry-wrapper">
      <carry-list :type="type"></carry-list>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getCarryList } from 'api'
import carryList from 'components/list/carry-list'
import { Tab, TabItem } from 'vux'
import { sessionStorage } from 'assets/js/storage.js'

export default {
  data() {
    return {
      type: 1, // 1-未指派 2-进行中 3-已完成
      tabList: [
        {label: '未完成', count: '', isRead: 2},
        {label: '已完成', count: '', isRead: 2},
      ],
    }
  },
  created() {
    let moduleType = sessionStorage.getItem('module_type')
    if (moduleType && moduleType.module == 'carry') {
      this.type = parseInt(moduleType.type)
    }
    this.tabList[0]['count'] = this.total.carry01
    this.tabList[1]['count'] = this.total.carry02
    // this.initData()
  },
  computed: {
    total() {
      return this.$store.state.total
    },
    computedtabList() {
      let read = this.$store.state.read
      this.tabList[0]['isRead'] = read.carryIsRead01
      this.tabList[1]['isRead'] = read.carryIsRead02
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
    carryList,
  }
}
</script>

<style lang="stylus" scoped>
.carry
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
  .carry-wrapper
    width 100%
</style>
