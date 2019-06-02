<template>
  <div class="project-form form">
    <ul class="info-wrapper">
      <li class="item">
        <span class="item-title">项目地址：</span>
        <span class="item-content">{{ info.getIfom.address }}</span>
      </li>
      <li class="item">
        <span class="item-title">项目主办部门：</span>
        <span class="item-content">{{ info.getIfom.managerDeptName }}</span>
      </li>
      <li class="item">
        <a class="tel" href="tel:075523199242"></a>
        <span class="item-title">业主部门联系人：</span>
        <span class="item-content">
          <a class="tel" :href="`tel:${user.contactPhone}`" v-for="(user, index) in info.listUser" :key="index">{{ user.contactName }}
            <span v-if="index != (info.listUser.length - 1)">  ,</span></a> 
        </span>
      </li>
      <!-- <li class="item">
        <span class="item-title">联系人电话号码：</span>
        <span class="item-content">{{ info.contactPhone }}</span>
      </li> -->
      <li class="item">
        <span class="item-title">项目计划时间：</span>
        <span class="item-content">{{ info.getIfom.planStartDate | info.getIfom.planStartDate == '' ? '' : formateDate('yyyy.MM.dd') }}~{{ info.getIfom.planEndDate | info.getIfom.planEndDate == '' ? '' :  formateDate('yyyy.MM.dd') }}</span>
      </li>
    </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:{
    info: {
      type: Object,
      default: function() {
        return {}
      }
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
