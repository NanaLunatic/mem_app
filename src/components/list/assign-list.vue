<template>
  <div class="assign-list list" ref="assignList" :style="{top: top + 'px', bottom: bottom + 'px'}">
    <ul>
      <li class="assign-item item" v-for="(assign, index) in assignData" :key="index" @click="jumpInfo(assign)">
        <div class="head">
          <span class="dot" v-show="assign.isRead == 1"></span>
          <span class="title">{{ assign.projectName }}</span>
          <span class="date" v-if="type == 1">{{ assign.createTime | formateDate('yyyy.MM.dd hh:mm') }}</span>
          <span class="date" v-else-if="type == 2">{{ assign.assignDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
          <span class="date" v-else>{{ assign.checkFinishDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
        </div>
        <div class="type">{{ assign.contractName  }}</div>
        <div class="content" v-if='type === 1'>您好，有新的验收指派任务</div>
        <ul class="check" v-else-if="type === 2">
          <li class="check-item">已指派</li>
          <li class="check-item" :class="{read: check.isRead === 2}" v-for="(check, index) in assign.checkUserList" :key="index">{{ check.checkUser }}</li>
          <li class="check-item">负责此验收任务</li>
        </ul>
        <ul class="check" v-else>
          <li class="check-item" :class="{primary: check.status === 2, warn: check.status === 3 }" v-for="(check, index) in assign.checkUserList" :key="index">{{ check.checkUser }}</li>
          <li class="check-item">已完成：</li>
          <li class="check-item">负责此验收任务</li>
        </ul>
      </li>
      <li v-show="noMore">
        <load-more :show-loading="false" tip="没有更多数据了" background-color="#fbf9fe"></load-more>
      </li>
      <li class="no-data" v-if="!assignData.length">
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { LoadMore } from 'vux'
import { getAssignList } from 'api'
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
      assignData: [],
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
      const res = await getAssignList(param)
      setTimeout(() => {
        this.$vux.loading.hide()
        this.scroll.finishPullUp()
      }, 800)

      if(!this.checkRequest(res)) return;
      this.assignData = flag ? [...this.assignData, ...res.data.data.list] : res.data.data.list
      this.scroll.refresh()
      this.totalPageNo = res.data.data.totalPageNo
      let assignIsRead01 = res.data.data.assignIsRead01
      let assignIsRead02 = res.data.data.assignIsRead02
      this.$store.commit('saveRead', {assignIsRead01})
      this.$store.commit('saveRead', {assignIsRead02})
    },
    // 初始化滚动条
    initScroll() {
      let options = {
        click: true,
        probeType: 2,
        scrollbar: true,
        pullUpLoad:true
      }
      this.scroll = new BScroll(this.$refs.assignList, options)
      this.scroll.on('pullingUp',() => {
        this.getMore()
      })
    },
    // 获取更多列表
    getMore() {
      if ( ++this.pageNo > this.totalPageNo) {
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
    jumpInfo(assign) {
      sessionStorage.setItem('module_type', {'module': 'assign', 'type': this.type})
      this.$store.commit('saveAssign', assign)
      this.$router.push('/assign-info')
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
