<template>
  <div class="assign-info info">
    <div class="head">
      <span class="text">{{ type | formateHeadText }}</span>
      <!-- <span class="date">{{ assign.createTime | formateDate('yyyy.MM.dd hh:mm') }}</span> -->
      <span class="date" v-if="type == 1">{{ assign.createTime | formateDate('yyyy.MM.dd hh:mm') }}</span>
      <span class="date" v-else-if="type == 2">{{ assign.assignDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
      <span class="date" v-else>{{ assign.checkFinishDate | formateDate('yyyy.MM.dd hh:mm') }}</span>
    </div>
    <h4 class="name">{{ projectInfo.getIfom.name }}</h4>
    <project-form :info="projectInfo"></project-form>
    <ul class="contract">
      <li class="contract-item">
        <ul class="info-wrapper">
          <li class="item">
            <span class="item-title">合同类型：</span>
            <span class="item-content">{{ contract.contractName }}</span>
          </li>
          <li class="item">
            <span class="item-title">{{ contract.contractName == '施工' ? '合同造价' : '委托费用' }}：</span>
            <span class="item-content">{{ contract.contractMoney }}万元</span>
          </li>
          <li class="item">
            <span class="item-title">合同签订日期：</span>
            <span class="item-content">{{ contract.contractSigningDate  | contract.contractSigningDate == '' ? '' :  formateDate('yyyy.MM.dd') }}</span>
          </li>
          <li class="item">
            <span class="item-title">承包商：</span>
            <span class="item-content">{{ contract.supplierName }}</span>
          </li>
          <li class="item">
            <span class="item-title">承包商联系人：</span>
            <span class="item-content"><a class="tel" :href="`tel:${contract.supplierContractType}`">{{ contract.supplierContractName }}</a></span>
          </li>
          <li class="item">
            <span class="item-title">申请验收阶段：</span>
            <span class="item-content">{{ stageList | formateStageMerge('step') }}</span>
          </li>
          <li class="item">
            <span class="item-title">验收标准：</span>
            <span class="item-content">{{ stageList | formateStageMerge('standrd') }}</span>
          </li>
          <li class="item" v-if="type == 3">
            <span class="item-title">验收结果：</span>
            <span class="item-content">{{ checkTask.status | formateStageStatus }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <task-form :info="taskInfo" v-if="type != 1"></task-form>
    <div class="date-wrapper" v-if="type == 1">
      <div class="row">
        <span class="row-left">任务开始时间<em class="required"></em>：</span>
        <span class="row-right" @click="getTime(0)">{{ startDate }}</span>
      </div>
      <div class="row">
        <span class="row-left" >任务结束时间<em class="required"></em>：</span>
        <span class="row-right" @click="getTime(1)">{{ endDate }}</span>
      </div>
      <div class="row text-box">
        <span class="row-left" >指派人备注：</span>
        <textarea class="row-right" id="" cols="30" rows="10" maxlength="100" v-model="remark"></textarea>
      </div>
    </div>
    <x-button type="primary" class="btn" @click.native="jumpPerson" v-if="type == 1">指派验收人</x-button>
  </div>
</template>

<script type="text/ecmascript-6">
import { getProjects, getContract, getTaskExecutor, getContractStage, acceptanceStage} from 'api'
import projectForm from 'components/form/project-form'
import taskForm from 'components/form/task-form'
import split from 'components/split/split'
import { XButton } from 'vux'
import { sessionStorage } from 'assets/js/storage.js'
export default {
  data() {
    return {
      type: 1,
      projectInfo: {
        getIfom: {
          name: ''
        }
      },
      contract: {},
      contractStep: {},
      taskInfo: {
        task: {
          checkStartDate: '',
          checkEndDate: '',
          checkManagerDept: '',
          checkManager: '',
          remark: '',
        },
        list: []
      },
      stageList: [],
      checkTask: {},
      startDate: '',
      endDate: '',
      remark: '',
    }
  },
  created() {
    let moduleType = sessionStorage.getItem('module_type')
    if (moduleType) {
      this.type = moduleType.type
    }
    this.initProject()
    this.initContract()
    this.initTask()
    this.initStage()
  },
  computed: {
    assign() {
      let assign = sessionStorage.getItem('assign')
      if(assign) {
        this.$store.commit('saveAssign', assign)
      }
      return this.$store.state.assign
    },
    //1-指派验收，2-发包，3-验收，4-支付，5-审批，6-审计，7-已承包合同，8-新合同消息
    newsType() {
      let newstype = this.$store.state.assign.newsType
      return newstype ? newstype : 1
    }
  },
  filters: {
    formateHeadText(type) {
      switch (type) {
        case 1: return '您有以下验收指派任务';
        case 2: return '该验收任务进行中';
        default: return '该验收任务已完成';
      }
    }
  },
  methods: {
    // 获取项目信息
    async initProject() {
      let param = {
        projectNo: this.assign.projectNo,
        noticeId: this.assign.noticeId
      }
      const res = await getProjects(param)
      if (!this.checkRequest(res)) return;
      this.projectInfo = res.data.data
    },
    // 获取合同
    async initContract() {
      let param = {
        id: this.assign.packageId
      }
      const res = await getContract(param)
      if (!this.checkRequest(res)) return;
      this.contract = res.data.data
    },
    // 获取任务执行人getTaskExecutor
    async initTask() {
      let param = {
        bizId: this.assign.bizId
      }
      const res = await getTaskExecutor(param)
      if (!this.checkRequest(res)) return;
      this.taskInfo = res.data.data
    },
    // 获取需要验收的合同阶段
    async initStage() {
      let param = {
        id: this.assign.bizId,
        packageId: this.assign.packageId,
        newsType: this.newsType,
      }
      const res = await acceptanceStage(param)
      if (!this.checkRequest(res)) return;
      this.stageList = res.data.data.list
      this.checkTask = res.data.data.checkTask
    },
    // 跳转指派验收人
    jumpPerson() {
      if (!this.startDate) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择任务开始时间',
          duration: 3000,
        })
        return
      }
      if (!this.endDate) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择任务结束时间',
          duration: 3000,
        })
        return
      }
      let query = {
        startDate: this.startDate,
        endDate: this.endDate,
        remark: this.remark,
      }
      this.$router.push({path: '/assign-person', query: query})
    },
    // 获取日期
    getTime(flag) {
      let dt = new Date()
      let today = this.formateDate(dt, 'yyyy-MM-dd')
      let minDate = flag === 0 ? '' : this.startDate
      let maxDate = flag === 0 ? this.endDate : ''
      // alert(maxDate)
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        startDate: minDate,
        endDate: maxDate,
        format: 'YYYY-MM-DD',
        value: today,
        onConfirm:(val)=> {
          if (flag === 0) {
            if (this.endDate && this.endDate < val) {
              this.$vux.toast.show({
                type: 'warn',
                text: '开始日期不能大于结束日期',
                time: 3000
              })
              return
            }
            this.startDate = val
          } else {
            this.endDate = val
          }
        },
      })
    }
  },
  components: {
    projectForm,
    split,
    XButton,
    taskForm,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
@import '../../assets/style/info.styl'
</style>
