<template>
  <div class="task-form form">
    <ul class="info-wrapper">
      <li class="item">
        <span class="item-title">任务规定时间：</span>
        <span class="item-content">{{  info['task']['checkStartDate'] | formateDate('yyyy.MM.dd') }} ~ {{  info['task']['checkEndDate'] | formateDate('yyyy.MM.dd') }}</span>
      </li>
      <li class="item">
        <span class="item-title">任务指派人：</span>
        <!-- <span class="item-content">{{  info['task']['checkManagerDept'] + info['task']['checkManager'] }}</span> -->
        <span class="item-content"><a class="tel" :href="`tel:${info['task']['checkManagerPhone']}`">{{  info['task']['checkManagerDept'] + info['task']['checkManager'] }}</a></span>
      </li>
      <li class="item">
        <span class="item-title">指派人备注：</span>
        <span class="item-content">{{ info['task']['remark'] }}</span>
      </li>
      <li class="item">
        <span class="item-title">任务执行人：</span>
        <span class="item-content">
          <!-- <a class="tel" :href="`tel:${user.checkManagerPhone}`" v-for="(user, index) in info.list" :key="index">{{ user.checkUser }}</a> -->
        </span>
      </li>
      <li class="item task" v-for="(user, index) in info.list" :key="index">
        <span><a :href="`tel:${user.checkPhone}`">{{ user.checkUser }}</a></span>
        <span class="read" v-if="isModuleType('assign', '2')" :class="{light: user.isRead == 2}" >{{ user.isRead | formateRead }}</span>
        <span class="date" v-if="isModuleType('assign', '2')">{{ user.readDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
        <span class="status" v-if="isModuleType('assign', '3') || isModuleType('carry', '2')" :class="{'warn': user.status == 3}">{{ user.status | formateStageStatus }}</span>
        <span class="date" v-if="isModuleType('assign', '3') || isModuleType('carry', '2')">{{ user.checkDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    type: {
      type: [String, Number]
    },
    info: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl';
@import 'index.styl';
.info-wrapper
  .item.task
    display flex
    justify-content space-around
    text-align center
    flex-wrap nowrap
    span
      flex 1
      &.read
        flex-shrink 1
      &.date
        flex 0 0 140px
      &.light
        color $primary-color
      &.warn
        color $warn-color
      &.status
        color $green-color
        &.warn
          color $warn-color
</style>
