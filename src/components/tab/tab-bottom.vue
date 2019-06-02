<template>
  <div class="tab-bottom">
    <ul class="list" v-if="isShow">
      <li class="tab-item" v-for="(tab, index) in list" :key="tab.value" :class="{active: now === index}" @click="changeTab(tab, index)">
        <span class="dot" v-if="tab.type && tab.isRead > 0"></span>
        <i class="iconfont" :class="tab.icon"></i>
        <span class="text">{{ tab | formateTabBottomCount }}</span>
        <badge :text="tab.count" v-show="now !== index && tab.count > 0" v-if="!tab.type"></badge>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import { getTotalMap } from 'api'
import { sessionStorage } from 'assets/js/storage'
import { Badge } from 'vux'
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      now: 0,
      isShow: true
    }
  },
  created() {
    let homeIndex = sessionStorage.getItem('home_index')
    if(homeIndex) {
      this.now = parseInt(homeIndex)
    }
    setTimeout(() => {
      this.isShow = false
      this.isShow = true
    }, 1000)
  },
  methods: {
    changeTab(tab, index) {
      this.now = index
      sessionStorage.setItem('home_index', this.now)
      // sessionStorage.setItem(`${tab.description}_type`, 1)
      sessionStorage.setItem('module_type', {
        module: tab.description,
        type: 1
      })
      this.$router.push(tab.link)
    }
  },
  components: {
    Badge
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/const.styl'
.tab-bottom
  height 50px
  width 100%
  background #fff
  .list
    width 100%
    display flex
    padding 5px 0
    justify-content space-around
    .tab-item
      flex 0 0 100px
      text-align center
      color $font-color
      position relative
      top 2px
      text-align center
      &.active
        color $primary-color
      .dot
        position absolute
        bottom 2px
        left -10px
        width 10px
        height 10px
        display inline-block
        background $warn-color
        border-radius 50%
      .iconfont
        display block
        font-size 20px
        text-align center
        margin-bottom 5px
      .text
        text-align center
        display block
        font-size 12px
      .vux-badge
        position absolute
        top -2px
        right 0px
</style>
