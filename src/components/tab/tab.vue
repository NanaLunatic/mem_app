<template>
  <div class="tab">
    <ul class="list">
      <li class="tab-item" v-for="(tab, index) in list" :key="tab.value" :class="{active: now == index}" @click="changeTab(tab, index)">
        <i class="iconfont" :class="tab.icon"></i>
        <span class="text">{{ tab.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    list: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      now: 0,
    }
  },
  methods: {
    changeTab(tab, index) {
      this.now = index
      this.$router.push(tab.link)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/const.styl'
.tab
  width 100%
  .list
    width 100%
    display flex
    padding 5px 0
    .tab-item
      flex 1
      text-align center
      color $font-color
      &.active
        color $primary-color
      .iconfont
        display block
      .text
        font-size 12px
        color $font-color
</style>
