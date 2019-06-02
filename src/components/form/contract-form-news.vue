<template>
  <div class="contract-form form">
    <ul class="info-wrapper">
      <li class="item">
        <span class="item-title">合同类型：</span>
        <span class="item-content">{{ contract.contractName }}</span>
      </li>
      <li class="item">
        <span class="item-title">承包商公司名称：</span>
        <span class="item-content">{{ contract.supplierName }}</span>
      </li>
      <li class="item" v-if="contract.supplierContractName">
        <span class="item-title">承包商联系人：</span>
        <span class="item-content"><a class="tel" :href="`tel:${contract.supplierContractType}`">{{ contract.supplierContractName }}</a></span>
      </li>
      <li class="item">
        <span class="item-title">特殊条款备注：</span>
        <span class="item-content">{{ contract.specialRemark }}</span>
      </li>
      <li class="item">
        <span class="item-title">合同阶段条款：</span>
      </li>
    </ul>
    <ul class="info-wrapper" v-for="(stage, index) in stageList" :key="index">
      <li class="item">
        <span class="item-title">{{ formateStep(stage.step) }}</span>
      </li>
      <li class="item">
        <span class="item-title">验收标准：</span>
        <span class="item-content">{{ stage.standard }}</span>
      </li>
      <li class="item">
        <span class="item-title">可请款金额：</span>
        <span class="item-content">{{ stage.collectonMoney }}万元</span>
      </li>
    </ul>
    <span class="btn plian" @click="showPopup">查看合同</span>
    <div v-transfer-dom>
      <popup v-model="isShowPopup" position="right" style="width: calc(100% - 40px);">
        <div class="contract-html" ref="contractHtml" id="contractHtml">
        </div>
      </popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { localStorage, sessionStorage } from "assets/js/storage.js";
import { previewContract, initContract } from "api";
import { TransferDom, Popup, XButton } from "vux";
export default {
  directives: {
    TransferDom
  },
  props: {
    // 发包表基本信息
    contract: {
      type: Object,
      default: function() {
        return {};
      }
    },
    stageList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 包Id
    packageId: {
      type: String,
      default: ""
    },
    // 1-发包审批，2-合同审批
    approvalType: {
      type: [String, Number],
      default: ""
    },
  },
  data() {
    return {
      isShowPopup: false,
      contractHtml: "",
    };
  },
  computed: {
    stage() {
      let stepArr = [];
      let standardArr = [];
      if (!this.stageList || !this.stageList.length) {
        return {
          step: "",
          standard: "",
          status: ""
        };
      }
      for (let item of this.stageList[0].contractStage) {
        stepArr.push(this.formateStep(item.step));
        standardArr.push(item.standard);
      }
      return {
        step: stepArr.join("；"),
        standard: standardArr.join("；"),
        status: this.stageList[0].status
      };
    }
  },
  methods: {
    showPopup() {
      this.isShowPopup = true;
      this.getPreviewContract();
    },
    formateStep(step) {
      switch (step) {
        case 1:
          return "第一阶段";
        case 2:
          return "第二阶段";
        case 3:
          return "第三阶段";
        case 4:
          return "第四阶段";
        case 5:
          return "第五阶段";
      }
    },
    //
    async getPreviewContract() {
      let param = this.packageId;
      const res = await previewContract(param);
      if (!this.checkRequest(res)) return;
      let contractHtml = document.getElementById("contractHtml");
      // console.log(res.data.data)
      contractHtml.innerHTML = res.data.data;
      this.getInitContract()
    },
    async getInitContract() {
      let param = this.packageId
      const res = await initContract(param)
      if (!this.checkRequest(res)) return;
      let vals = res.data.data
      let data = JSON.parse(vals['data'])
      console.log(11111111)
      let contractHtml = document.getElementById("contractHtml");
      let projectInputList = contractHtml.querySelectorAll('.yellow')
      let contractorInputList = contractHtml.querySelectorAll('.init-red')
      let blueInputList = contractHtml.querySelectorAll('.blue:not(.blueTable)')
      let tableInputList = contractHtml.querySelectorAll('.blueTable tr:not(.tr-head)')
      console.log(tableInputList)
      for (let input of projectInputList) {
        if (input.tagName === 'INPUT') {
          input.value = vals.projectName
        } else {
           input.innerHTML = vals.projectName
        }
      }
      for (let input of contractorInputList) {
        if (input.tagName === 'INPUT') {
          input.value = vals.supplierName
        } else {
           input.innerHTML = vals.supplierName
        }
      }
      console.log(blueInputList)
      for (let input of blueInputList) {
        let inputName = input.name
        if (input.tagName === 'INPUT') {
          input.value = data[inputName]
        } else {
           input.innerHTML = data[inputName]
        }
      }
      if(tableInputList.length > 0){
        for (let ii = 0; ii < data.users.length; ii++) {
          let inputs = tableInputList[ii].querySelectorAll('input')

          for (let input of inputs) {
            let inputName = input.name
            if (input.tagName === 'INPUT') {
              input.value = data.users[ii][inputName]
            } else {
              input.innerHTML = data.users[ii][inputName] || ''
            }
          }
        }
      }
      // 处理合同dom元素，将input替换成span
      let inputList = contractHtml.getElementsByTagName("input");
      inputList = Array.from(inputList);
      for (let input of inputList) {
        let val = input.value;
        let newNode = document.createElement("span");
        newNode.innerHTML = val;
        input.parentNode.replaceChild(newNode, input);
      }
    }
  },
  components: {
    Popup,
    XButton
  }
};
</script>
<style lang="stylus" scoped>
@import '../../assets/style/common.styl';
@import 'index.styl';
</style>


