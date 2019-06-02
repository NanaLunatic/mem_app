<template>
  <div class="check-list list" ref="checkList" :style="{top: top + 'px', bottom: bottom + 'px'}">
    <ul>
      <li class="check-item item" v-for="(check, index) in checkData" :key="index" @click="jumpInfo(check)">
        <div class="head">
          <span class="dot" v-show="check.isRead == 1"></span>
          <span class="title">{{ check.projectName }}</span>
          <!-- 未完成 -->
          <span class="date" v-if="type == 1">{{ check.createTime | formateDate('yyyy.MM.dd hh:mm') }}</span>
          <!-- 已完成 -->
          <span class="date" v-else>{{ check.opDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
        </div>
        <div class="type">{{ check.contractName  }}</div>
        <div class="content" v-if='type === 1'>您好，有新的<i class="light">{{ check.approvalType | formateCheckType }}</i>审批任务</div>
        <ul class="check" v-else>
          <li class="check-item">已完成：</li>
          <li class="check-item"><i class="light">{{ check.approvalType | formateCheckType }}</i>审批任务</li>
        </ul>
      </li>
      <li v-show="noMore">
        <load-more :show-loading="false" tip="没有更多数据了" background-color="#fbf9fe"></load-more>
      </li>
      <li class="no-data" v-if="!checkData.length">
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
      </li>
    </ul>

  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { LoadMore } from 'vux'
import { getCheckList } from 'api'
import { sessionStorage } from 'assets/js/storage.js'

export default {
  props: {
    top: {
      type: String,
      default: '44'
    },
    bottom: {
      type: String,
      default: '42'
    },
    type: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      noMore: false,
      totalPageNo: 1,
      pageSize: 10,
      pageNo: 1,
      checkData: [],
    }
  },
  created() {
    this.initData()
    this.$nextTick(() => {
      this.initScroll()
    })
  },
  watch:{
    type() {
      this.resetPage()
    }
  },
  methods: {
    async initData(flag) {
      let param =  {
          type: this.type,
          pageSize: this.pageSize,
          pageNo: this.pageNo
      }
      if(flag) {
        this.$vux.loading.show({
          text: '数据加载中',
        })
      }
      const res = await getCheckList(param)
      setTimeout(() => {
        this.$vux.loading.hide()
        this.scroll.finishPullUp()
      }, 800)

      if(!this.checkRequest(res)) return;
      this.checkData = flag ? [...this.checkData, ...res.data.data.list] : res.data.data.list
      this.scroll.refresh()
      this.totalPageNo = res.data.data.totalPageNo
      let checkIsRead01 = res.data.data.checkIsRead01
      let checkIsRead02 = res.data.data.checkIsRead02
      this.$store.commit('saveRead', {checkIsRead01})
      this.$store.commit('saveRead', {checkIsRead02})
    },
    // 初始化滚动条
    initScroll() {
      let options = {
        click: true,
        probeType: 2,
        scrollbar: true,
        pullUpLoad:true
      }
      this.scroll = new BScroll(this.$refs.checkList, options)
      this.scroll.on('pullingUp',() => {
        this.getMore()
      })
    },
    // 获取更多列表
    getMore() {
      if ( ++this.pageNo  > this.totalPageNo) {
        this.pageNo--
        this.noMore = true
        return
      }
      this.initData(1)
    },
    resetPage() {
      this.pageNo = 1
      this.noMore = false
      this.initData()
    },
    // 跳转详情页
    jumpInfo(check) {
      sessionStorage.setItem('module_type', {module: 'check', type: this.type})
      this.$store.commit('saveCheck', check)
      this.$router.push('/check-info')
    }
  },
  components: {
    LoadMore
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
@import './index.styl'
</style>
