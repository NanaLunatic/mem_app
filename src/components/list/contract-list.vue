<template>
  <div class="contract-list list" ref="contractList" :style="{top: top + 'px', bottom: bottom + 'px'}">
    <ul>
      <li class="contract-item item" v-for="(contract, index) in contractData" :key="index" @click="jumpInfo(contract)">
        <div class="head">
          <span class="dot" v-show="contract.isRead == 1"></span>
          <span class="title">{{ contract.title }}</span>
        </div>
        <div class="type">合同类型：<i class="weight">{{ contract.name  }}</i></div>
        <div class="signing-date">合同签订日期：{{ contract.contractSigningDate | contract.contractSigningDate == '' ? '' : formateDate('yyyy.MM.dd') }}</div>
        <div class="check-box">
          <p class="text">验收至</p>
          <p class="stage"><i class="digit">{{ contract.acceptanceAnd }}/{{ contract.acceptance }}</i>阶段</p>
        </div>
      </li>
      <li v-show="noMore">
        <load-more :show-loading="false" tip="没有更多数据了" background-color="#fbf9fe"></load-more>
      </li>
      <li class="no-data" v-if="!contractData.length">
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
      </li>
    </ul>

  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import { LoadMore } from "vux";
import { getContractList } from "api";
import { sessionStorage } from 'assets/js/storage.js'

export default {
  props: {
    top: {
      type: String,
      default: "44"
    },
    bottom: {
      type: String,
      default: "42"
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      noMore: false,
      totalPageNo: 1,
      pageSize: 10,
      pageNo: 1,
      contractData: []
    };
  },
  created() {
    this.initData();
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  watch: {
    type() {
      this.resetPage();
    }
  },
  methods: {
    async initData(flag) {
      let param = {
        type: this.type,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      };
      if (flag) {
        this.$vux.loading.show({
          text: "数据加载中"
        });
      }
      const res = await getContractList(param);
      setTimeout(() => {
        this.$vux.loading.hide();
        this.scroll.finishPullUp();
      }, 800);

      if (!this.checkRequest(res)) return;
      this.contractData = flag
        ? [...this.contractData, ...res.data.data.list]
        : res.data.data.list;
      this.scroll.refresh();
      this.totalPageNo = res.data.data.totalPageNo;
      let contractIsRead01 = res.data.data.contractIsRead01;
      let contractIsRead02 = res.data.data.contractIsRead02;
      this.$store.commit("saveRead", { contractIsRead01 });
      this.$store.commit("saveRead", { contractIsRead02 });
    },
    // 初始化滚动条
    initScroll() {
      let options = {
        click: true,
        probeType: 2,
        scrollbar: true,
        pullUpLoad: true
      };
      this.scroll = new BScroll(this.$refs.contractList, options);
      this.scroll.on("pullingUp", () => {
        this.getMore();
      });
    },
    // 获取更多列表
    getMore() {
      if ( ++this.pageNo > this.totalPageNo ) {
        this.pageNo--;
        this.noMore = true;
        return;
      }
      this.initData(1);
    },
    resetPage() {
      this.pageNo = 1;
      this.noMore = false;
      this.initData();
    },
    // 跳转详情页
    jumpInfo(contract) {
      sessionStorage.setItem('module_type', {module: 'contract', type: this.type})
      this.$store.commit("saveContract", contract);
      this.$router.push("/contract-info");
    }
  },
  components: {
    LoadMore
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl';
@import './index.styl';
.list
  ul
    .item
      .type
        font-size 12px
        font-weight normal
      .weight
        color #313131
        font-style normal
      .signing-date
        font-size 12px
      .check-box
        position absolute
        bottom 15px
        right 15px
        text-align left
        font-size 12px
        font-weight normal
        background #eef9ff
        padding 3px 5px
        .stage
          .digit
            margin-right 3px
            font-size 21px
            font-weight 600
            font-style normal
</style>
