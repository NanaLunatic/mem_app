<template>
  <div class="news-list list" ref="newsList" id="newsList" :style="{top: top + 'px', bottom: bottom + 'px'}">
    <ul>
      <li class="news-item item" v-for="(news, index) in newsData" :key="index" @click="jumpInfo(news)">
        <div class="head">
          <span class="dot" v-show="news.isRead == 1"></span>
          <span class="title">{{ news.title }}</span>
          <span class="date">{{ news.createTime | formateDate('yyyy.MM.dd hh:mm') }}</span>
        </div>
        <div class="type">{{ news.name  }}</div>
        <div class="content">您好，有新的合同消息</div>
      </li>
      <li v-show="noMore">
        <load-more :show-loading="false" tip="没有更多数据了" background-color="#fbf9fe"></load-more>
      </li>
      <li class="no-data" v-if="!newsData.length">
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { LoadMore } from 'vux'
import { getNewsList } from 'api'
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
      newsData: [],
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
      const res = await getNewsList(param)
      setTimeout(() => {
        this.$vux.loading.hide()
        this.scroll.finishPullUp()
      }, 800)

      if(!this.checkRequest(res)) return;
      this.newsData = flag ? [...this.newsData, ...res.data.data.list] : res.data.data.list
      this.scroll.refresh()
      this.totalPageNo = res.data.data.totalPageNo
      let newsIsRead01 = res.data.data.newsIsRead01
      let newsIsRead02 = res.data.data.newsIsRead02
      this.$store.commit('saveRead', {newsIsRead01})
      this.$store.commit('saveRead', {newsIsRead02})
    },
    // 初始化滚动条
    initScroll() {
      let options = {
        click: true,
        probeType: 2,
        scrollbar: true,
        pullUpLoad:true
      }
      this.scroll = new BScroll(this.$refs.newsList, options)
      // this.scroll = new BScroll(domNews, options)
      this.scroll.on('pullingUp',() => {
        this.getMore()
      })
    },
    // 获取更多列表
    getMore() {
      if ( ++this.pageNo > this.totalPageNo ) {
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
    jumpInfo(news) {
      sessionStorage.setItem('module_type', {module: 'news', type: this.type})
      this.$store.commit('saveNews', news)
      this.$router.push('/news-info')
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
