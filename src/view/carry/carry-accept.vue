<template>
  <div class="carry-accept">
    <div class="title">验收图片</div>
    <div class="photo-wrapper">
      <ul>
        <!-- <li class="item" v-for="(item, index) in photoList" :key="index">
          <div class="picture-box">
            <img :src="item.src" alt="">
            <i class="iconfont icon-cha1" @click="removePhoto(index)"></i>
          </div>
          <div class="text-box">
            <input type="text" placeholder="点击添加描述（10字以内）" v-model="item.remark" maxlength="10">
          </div>
        </li> -->
        <li v-for="(img, index) in imgArr" :key="index"  class="item">
          <div class="picture-box">
            <img  :src='img.src'> 
            <i class="iconfont icon-cha1" @click="removePhoto(index)"></i>
          </div>
          <div class="text-box">
            <input type="text" placeholder="点击添加描述（10字以内）" v-model="img.remark" maxlength="10">
          </div>
        </li>
      </ul>
       <!-- <x-button type="primary" mini plain class="photo-btn" @click.native="addPhoto">添加照片</x-button> -->
      <div class="btn-box">
            添加照片
            <input type="file" class="input-img" id="img-upload" multiple accept="image/*" @change="uploadImg($event)"/>
      </div>
    </div>
    <div class="title">验收情况备注</div>
    <div class="remark-wrapper">
      <textarea name="" id="" cols="30" rows="10" v-model.trim="remark" placeholder="点击此处添加备注" maxlength="40"></textarea>
    </div>
    <div class="title">验收情况备注</div>
    <div class="btn-wrapper">
      <x-button class="btn" @click.native="showCheckConfirm">验收</x-button>
      <x-button class="btn warn" @click.native="exit">取消</x-button>
    </div>
    <div v-transfer-dom>
      <confirm v-model="isCheckConfirm"
      title="确认验收"
      confirm-text="通过"
      cancel-text="不通过"
      @on-confirm="check(2)"
      @on-cancel="check(3)">
        <div class="row">
          <span class="row-left">验收合同阶段：</span>
          <span class="row-right light">{{ stage.stepTxt.join('；') }}</span>
        </div>
        <div class="row">
          <span class="row-left">付款条件/验收标准：</span>
          <span class="row-right light">{{ stage.standard.join('；') }}</span>
        </div>
        <div class="row">
          <span class="row-left">验收情况备注：</span>
          <span class="row-right light">{{ remark }}</span>
        </div>
        <div class="row">
          <span class="row-left">验收人：</span>
          <span class="row-right light">{{  userMain.name }}</span>
        </div>
        <i class="iconfont icon-cha1" @click="colseCheckConfirm"></i>
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import wx from "weixin-js-sdk";
import { insertCheckRegister, getWxJsSdk, uploadPhoto, uploadPhotos } from "api";
import { XButton, Confirm, TransferDom } from "vux";
import { localStorage, sessionStorage } from "assets/js/storage.js";
import  exif  from 'exif-js'
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      photoList: [],
      photoIdList: [],
      localPhotoList: [],
      serverIdList: [],
      remark: "",
      checkPass: 1, // 验收是否通过 1-通过，2-不通过
      isCheckConfirm: false,
      acceptInfo: { },

imgArr:[],
      // imgArr:{
      //           // type:Array,
      //           // twoWay: true,
      //           // default:Array
      //       },
            imgNumLimit:{//一次最多可以上传多少张照片
                type:Number,
                default:9
            }
    };
  },
  computed: {
    userMain() {
      let userMain = localStorage.getItem('user_main')
      return userMain
    },
    carry() {
      let carry = sessionStorage.getItem("carry");
      if (carry) {
        this.$store.commit("saveCarry", carry);
      }
      return this.$store.state.carry;
    },
    stage() {
      if (!this.acceptInfo.stageList || !this.acceptInfo.stageList.length) {
        return {step: [], stepTxt: [], standard: []}
      }
      let [step, stepTxt, standard] = [[], [], []]
      for(let item of this.acceptInfo.stageList) {
        switch(item.checkStep) {
        case '1':
          stepTxt.push('第一阶段');
          break;
        case '2':
          stepTxt.push('第二阶段');
          break;
        case '3':
          stepTxt.push('第三阶段');
          break;
        case '4':
          stepTxt.push('第四阶段');
          break;
        case '5':
          stepTxt.push('第五阶段');
          break;
      }
        step.push(item.checkStep)
        standard.push(item.standrd)
      }
      return {
        step,
        stepTxt,
        standard
      }
    }
  },
  created() {
    let acceptInfo = sessionStorage.getItem('accept_info')
    this.acceptInfo = acceptInfo
    this.initWxJsSdk();
  },
  methods: {
    uploadImg(e){
      console.log(e)
      let tag = e.target;
                let fileList = tag.files || e.srcElement.files;
                if (!fileList.length) return;
                let imgNum = fileList.length;
                let _this = this;
                // _this.imgArr = [];//图片数据清零
                console.log(this.imgArr.length)
                if(this.imgArr.length + imgNum > this.imgNumLimit.default){
                    _this.$vux.toast.show({
                      type: 'warn',
                      text: '不能超过9张图片',
                      time: 3000,
                    })
                    return;
                }
                var Orientation;
                for(let i=0;i<imgNum;i++){
                  // alert("imgNum")
                  //去获取拍照时的信息，解决拍出来的照片旋转问题
                    exif.getData(fileList[i], function(){
                        Orientation = exif.getTag(this, 'Orientation');
                        // alert(Orientation + "Orientation")
                    });
                    // 看支持不支持FileReader
                    if (!fileList[0] || !window.FileReader) return;
                    // 创建一个reader
                    let reader = new FileReader();
                    reader.readAsDataURL(fileList[i]);
                    reader.onload = function(){
                      // alert("onload")
                        var oReader = new FileReader();
                        oReader.onload = function(e) {
                            var image = new Image();
                            image.src = e.target.result;
                            image.onload = function() {
                                var expectWidth = this.naturalWidth;
                                var expectHeight = this.naturalHeight;
                                if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                                    expectWidth = 800;
                                    expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                                } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                                    expectHeight = 1200;
                                    expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                                }
                                var canvas = document.createElement("canvas");
                                var ctx = canvas.getContext("2d");
                                canvas.width = expectWidth;
                                canvas.height = expectHeight;
                                ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
                                var base64 = null;
                                //修复ios上传图片的时候 被旋转的问题
                                if(Orientation != "" && Orientation != 1){
                                    switch(Orientation){
                                        case 6://需要顺时针（向左）90度旋转
                                            _this.rotateImg(this,'left',canvas);
                                            break;
                                        case 8://需要逆时针（向右）90度旋转
                                            _this.rotateImg(this,'right',canvas);
                                            break;
                                        case 3://需要180度旋转
                                            _this.rotateImg(this,'right',canvas);//转两次
                                            _this.rotateImg(this,'right',canvas);
                                            break;
                                    }
                                }
                                base64 = canvas.toDataURL("image/jpeg", 0.8);
                                if(fileList[i].size / 1024000 > 1){
                                    _this.imgScale(base64, 4)
                                }else{
                                    _this.imgArr.push({"src": base64,"remark": ""});
                                }
                                // console.log(JSON.stringify(_this.imgArr));
                            };
                        };
                        oReader.readAsDataURL(fileList[i]);
                    }
                }
    },
    imgScale(imgUrl,quality){
       let img = new Image();
                let _this = this;
                let canvas = document.createElement('canvas');
                let cxt = canvas.getContext('2d');
                img.src = imgUrl;
                img.onload = function(){
                    //缩放后图片的宽高
                    let width = img.naturalWidth/quality;
                    let height = img.naturalHeight/quality;
                    canvas.width = width;
                    canvas.height = height;
                    cxt.drawImage(this, 0, 0, width, height);
                    _this.imgArr.push({"src": canvas.toDataURL('image/jpeg')});
                }
    },
    rotateImg(img, direction,canvas){
       var min_step = 0;
                var max_step = 3;
                if (img == null)return;
                var height = img.height;
                var width = img.width;
                var step = 2;
                if (step == null) {
                    step = min_step;
                }
                if (direction == 'right') {
                    step++;
                    step > max_step && (step = min_step);
                } else {
                    step--;
                    step < min_step && (step = max_step);
                }
                var degree = step * 90 * Math.PI / 180;
                var ctx = canvas.getContext('2d');
                switch (step) {
                    case 0:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0);
                        break;
                    case 1:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, 0, -height);
                        break;
                    case 2:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, -height);
                        break;
                    case 3:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, 0);
                        break;
                }
    },
    // 初始化微信js-sdk配置
    async initWxJsSdk() {
      let url = window.location.href;
      if(url.indexOf('#') != -1){
          url = url.substring(0,url.indexOf('#'));
      }
      const res = await getWxJsSdk({ url });
      if (!this.checkRequest(res)) return;
      let wxConfig = res.data.data;
      // alert(JSON.stringify(wxConfig));
      wx.config({
        debug: false,
        appId: wxConfig.appId,
        timestamp: wxConfig.timestamp,
        nonceStr: wxConfig.nonceStr,
        signature: wxConfig.signature,
        jsApiList: ["chooseImage", "previewImage", "uploadImage", "getLocalImgData"]
      });
    },
    // 添加相片
    addPhoto() {
      let that = this;
      if (that.photoList && that.photoList.length > 9) {
        that.$vux.toast.show({
          type: 'warn',
          text: '不能超过9张图片',
          time: 3000,
        })
        return;
      }
      wx.ready(function() {
        wx.chooseImage({
          count: 9, // 默认9
          sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            var localIds = res.localIds;
            // if (window.__wxjs_is_wkwebview) {
            var i = 0;
            // 使用递归解决上传多张图片不显示的问题
            localImgData();
            function localImgData() {
              wx.getLocalImgData({
                localId: localIds[i],
                success: function(res) {
                  let localData = res.localData;
                  if(window.__wxjs_is_wkwebview){
                  localData = localData.replace("jgp", "jpeg");
                  }
                  // that.savePhoto(localData);
                  that.photoList.push({
                    src: window.__wxjs_is_wkwebview ? localData : localIds[i],
                    data: localData,
                    remark: ""
                  })
                  if (++i < localIds.length) {
                    localImgData();
                  }
                }
              });
            }
          }
        });
      });
    },
    // 进行验收 type 2-通过 3-不通过
    check(type) {
      this.$vux.loading.show({text: '图片上传中'})
      // 当存在上传图片时
      if (this.imgArr.length > 0) {
        for (let photo of this.imgArr) {
          console.log(photo)
          this.savePhoto(photo, type)
        }
      } else {
        this.submit(type)
      }

    },
    // 保存相片,返回图片的id
    async savePhoto(photo, type) {
      let imgName = photo.remark || '验收图片'
      // let imgStr = photo.data.indexOf("base64") != -1 ? photo.data.slice(23) : photo.data
      let imgStr = photo.src.indexOf("base64") != -1 ? photo.src.slice(23) : photo.src
      console.log(photo.src.indexOf("base64") + 'bbbbbbb')
      let param = {
        code: "YS",
        imgName: imgName + '.jpg',
        imgStr: imgStr
      };
      // alert(JSON.stringify(param))
      const res = await uploadPhoto(param);
      if (!this.checkRequest(res)) {
        this.$vux.loading.hide()
        return;
      }
      let id = res.data.data.id;
      console.log(res.data.data)
      // // alert('服务器返回的图片id:' + id)
      this.photoIdList.push(id);
      if (this.imgArr.length == this.photoIdList.length) {
        this.submit(type)
      }
    },
    // 删除相片
    removePhoto(index) {
      this.$vux.confirm.show({
        title: '提示',
        content: '是否删除该图片',
        onConfirm: () => {
          this.imgArr.splice(index, 1);
          this.photoIdList.splice(index, 1);
        }
      })
    },
    showCheckConfirm() {
      if (this.photoList && this.photoList.length > 9) {
        this.$vux.toast.show({
          type: 'warn',
          text: '不能超过9张图片',
          time: 3000,
        })
        return;
      }
      this.isCheckConfirm = true;
    },
    colseCheckConfirm() {
      this.isCheckConfirm = false;
    },
    // type 2-通过，3-不通过
    async submit(type) {
      let param = {
        isCheckPass: type,
        checkRemark: this.remark,
        checkTaskId: this.carry.bizId,
        checkStep: this.stage.step.join(','),
        checkStandard: this.stage.standard.join('/'),
        projectId: this.carry.projectId,
        packageId: this.carry.packageId,
        attachList: this.photoIdList,
        // attachList: [2517, 2518, 1519],
      };
      this.$vux.loading.hide()
      // alert('提交了'+ JSON.stringify(param))
      const res = await insertCheckRegister(param);
      if (!this.checkRequest(res)) return;
      this.$vux.toast.show({
        text: "提交成功",
        time: 2000,
        onHide: () => {
          this.$router.push('/home/carry')
        }
      });
    },
    exit() {
      this.$vux.confirm.show({
        title: "提示",
        content: "尚未保存，是否离开？",
        onConfirm: () => {
          this.$router.go(-1);
        }
      });
    },
  },
  components: {
    XButton,
    Confirm,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl';

$photo-width = 60px;

.carry-accept {
  .title {
    font-size: 16px;
    font-weight: 700;
    margin: 20px 0 5px 25px;
    color: #454545;
  }

  .photo-wrapper {
    background: #fff;
    padding: 10px 0;

    .item {
      display: flex;
      padding: 25px;

      .picture-box {
        width: $photo-width;
        height: $photo-width;
        background: #999;
        position: relative;
        margin-right: 20px;

        img {
          width: $photo-width;
          height: $photo-width;
        }

        .iconfont {
          position: absolute;
          top: -7px;
          right: -7px;
          color: #fff;
          background: $warn-color;
          border-radius: 50%;
        }
      }

      .text-box {
        flex: 1;
        border-bottom: 1px solid $border-color;
        position: relative;

        input {
          position: absolute;
          left: 0;
          bottom: 0px;
          height: 30px;
          width: 100%;
          text-indent: 20px;
        }
      }
    }

    .photo-btn {
      margin: 10px auto;
      color: $primary-color;
      border-color: $primary-color;
      display: block;
      padding: 0 50px;
    }
  }

  .remark-wrapper {
    background: #fff;
    padding: 25px;
    position: relative;

    textarea {
      width: 100%;
      resize: none;
      border: 1px solid $border-color;
      background: $bg-color;
      overflow: hidden;
      outline: none;
      -webkit-appearance: none;

      &::placeholder {
        color: #999;
        text-align: center;
        vertical-align: middle;
        line-height: 150px;
        font-size: 14px;
        text-decoration: underline;
      }
    }
  }

  .btn-wrapper {
    background: #fff;
    display: flex;
    padding: 25px;

    .btn {
      margin-top: 0;
      width: 100px;
      padding: 0px;
      height: 40px;

      &.warn {
        background: $warn-color;
      }
    }
  }
}

.row-right.light {
  font-weight: normal;
  font-size: 13px;
}

.icon-cha1 {
  padding: 5px;
  font-size: 10px;
  position: absolute;
  top: 0;
  right: 0;
}


.btn-box {
  position: relative;
  height: 30px;
  width: 154px;
  color: #358ec8;
  border: 1px solid #358ec8;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
  margin: 10px auto;

  .input-img {
    left: 0;
    bottom: 0;
    width: 154px;
    height: 30px;
    opacity: 0;
    position: absolute;
  }

  .btn {
    position: absolute;
    cursor: pointer;
    pointer-events: none;
    width: 150px;
    height: 30px;
    left: 0;
    bottom: 0;
  }
}
</style>
