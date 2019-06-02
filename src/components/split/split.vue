<template>
 <div class="split" v-bind:style="{  height: height + 'px',background:background }">
 </div>
</template>

<script type="text/ecmascript-6">
  export default { // 导出
    props:{
      height:{
        type:String,
        default: '10'
      },
      background:{
        type:String,
        default: '#F9F9F9'
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

    .split
        width 100%
        &.border
          border-top 1px solid rgba(7,17,27,0.1)
          border-bottom 1px solid rgba(7,17,27,0.1)
</style>
