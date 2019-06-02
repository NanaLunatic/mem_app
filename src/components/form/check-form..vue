<template>
  <div class="task-form form">
    <ul class="info-wrapper">
      <li class="item">
        <span class="item-title">任务执行人：</span>
        <span class="item-content">{{ taskList | formateTaskPerson('checkUser') }}</span>
      </li>
      <li class="item">
        <span class="item-title">任务规定时间：</span>
        <span class="item-content" v-if="taskList.length">{{  taskList[0]['checkStartDate'] | formateDate('yyyy.MM.dd') }} ~ {{  taskList[0]['checkEndDate'] | formateDate('yyyy.MM.dd') }}</span>
      </li>
    </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:{
    taskList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
@import 'index.styl'
</style>
