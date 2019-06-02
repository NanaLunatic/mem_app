<template>
  <div class="news">
    <div class="news-wrapper">
      <news-list top="0"></news-list>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getNewsList } from 'api'
import newsList from 'components/list/news-list'
// import { Tab, TabItem } from 'vux'
import { sessionStorage } from 'assets/js/storage.js'

export default {
  data() {
    return {
      // type: 1,
      // tabList: [
      //   {label: '未完成', count: '', isRead: 2},
      //   {label: '已完成', count: '', isRead: 2},
      // ],
    }
  },
  created() {
    // let moduleType = sessionStorage.getItem('module_type')
    // if (moduleType && moduleType.module == 'news') {
    //   this.type = parseInt(moduleType.type)
    // }
    // this.tabList[0]['count'] = this.total.news01
    // this.tabList[1]['count'] = this.total.news02
  },
  computed: {
    // total() {
    //   return this.$store.state.total
    // },
  },
  methods: {
    // changeType(index) {
    //   this.type = index + 1
    // },
  },
  components: {
    // Tab,
    // TabItem,
    newsList,
  }
}
</script>

<style lang="stylus" scoped>
.news
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
  .news-wrapper
    width 100%
</style>
