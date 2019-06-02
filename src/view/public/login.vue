<template>
  <div class="login">
    <h1 class="title">松岗建设工程</h1>
    <h1 class="title">管控系统</h1>
    <div class="form-wrapper">
      <div class="row">
        <i class="iconfont icon-yonghuming1"></i>
        <input class="text" type="text" placeholder="用户名" v-model="account" maxlength="11">
      </div>
      <div class="row">
        <i class="iconfont icon-mima"></i>
        <input class="text" type="password" placeholder="密码" v-model="password" maxlength="30">
      </div>
      <div class="row">
        <i class="iconfont icon-yanzhengma1"></i>
        <input class="text" type="text" placeholder="验证码" v-model.trim="smsCode" maxlength="6">
        <span class="btn-sms" @click="showConfirm" >{{ codeText }}</span>
      </div>
    </div>
    <div class="btn-login" @click="login">登录</div>
    <div v-transfer-dom>
      <confirm v-model="isShowConfirm"
      title="输入图片验证码"
      :close-on-confirm="closeOnConfirm"
      @on-confirm="getCode">
      <div class="check-image">
        <img :src="checkImageUrl" alt="图片验证码" @click="getImageCode">
        <input type="text" v-model="autCode" autofocus v-focus maxlength="4">
      </div>
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { localStorage, sessionStorage } from 'assets/js/storage.js'
import { Confirm, TransferDomDirective as TransferDom } from 'vux'
import { getLogin, getSmsCode, ids } from 'api'
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      account: '',
      password: '',
      smsCode: '',
      openId: '',
      codeText: '点击获取',
      isShowConfirm: false,
      checkImageUrl: '',
      autCode: '',
      flag: 1,
      closeOnConfirm: false,
    };
  },
  created() {
    let isToken = localStorage.getItem('is_token')
    if (isToken == '0') {
      //sessionStorage.setItem('is_token', '1')
      // 免输入手机号
      let userMain = localStorage.getItem('user_main')
      if (userMain && userMain.account) {
        this.account = userMain.account
      }
      return;
    }

    let userMains = localStorage.getItem('user_info')    

   if(userMains && userMains.id && userMains.token){     
      this.jumpPage(userMains.temporary) 
    } 
    
    
    // 退出登录时
    let signOut = sessionStorage.getItem('saveLoginOut')
    if(signOut == 2){
       return;
    }
    // if (this.isLoginOut == 2) {
    //   return;
    // }
    
   // let userInfo = this.GetRequest()
    //sessionStorage.setItem('url_info', userInfo)
    
   
    // if (userInfo.userId && userInfo.token) {
    //   sessionStorage.setItem('home_index', 0)
    //   this.$store.commit('saveUserInfo', userInfo)
    //   this.initUserInfo(userInfo.userId)
    //   this.jumpPage(userInfo.temporary)
    // }
    
  },
  watch: {
    account(val, oldval) {
      this.account = val.replace(/\W+/g,'')
    },
    smsCode(val, oldval) {
      this.smsCode = val.replace(/\W+/g,'')
    },
    password(val, oldval) {
      this.password = val.replace(/[\u4e00-\u9fa5]+/g,'')
      this.password = this.password.substr(0, 20)
    },
  },
  computed: {
    isLoginOut() {
      return this.$store.state.isLoginOut
    }
  },
  methods: {
    showConfirm() {
      let [regPhone, regPassword] = [/^1[34578]\d{9}$/, /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/]
      // 如果不是数字，则发送
      let time = Number(this.codeText)
      if(time) return;
      if (!this.account) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入用户名'
        })
        return
      }
      if ( !regPhone.test(this.account) ) {
        this.$vux.toast.show({
          type: 'warn',
          text: '手机号码格式不正确！'
        })
        return
      }
      this.autCode = ''
      this.getImageCode()
      this.isShowConfirm = true
    },
    getImageCode() {
      let check_img = sessionStorage.getItem('check_img');
      this.checkImageUrl = `${this.URL_HEAD}g1/files/phones/images/codes?${check_img}`
      sessionStorage.setItem('check_img', check_img+1);
      // this.checkImageUrl = `${this.URL_HEAD}g1/files/phones/images/codes?${this.flag++}`
    },
    async getCode() {
      if ( !this.autCode ) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入图片验证码！',
        })
        return
      }
      let param = {
        phoneNumber: this.account,
        autCode: this.autCode
      }
      const res = await getSmsCode(param)
      if(!this.checkRequest(res)) {
        this.getImageCode()
        return;
      }
      this.isShowConfirm = false
      this.codeText = 60
      let timer = setInterval(() => {
        this.codeText--
        if(this.codeText <= 0) {
          this.codeText = '重新发送'
          clearInterval(timer)
        }
      }, 1000)
      this.$vux.toast.show({
        text: '短信验收码已发送'
      })
    },
    async login() {
      let [regPhone, regPassword] = [/^1[34578]\d{9}$/, /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/]
      if (!this.account) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入用户名',
        })
        return
      }
      if (!this.password) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入密码'
        })
        return
      }
      if (!this.smsCode) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入验证码'
        })
        return
      }

      if ( !regPhone.test(this.account) ) {
        this.$vux.toast.show({
          type: 'warn',
          text: '手机号码格式不正确！'
        })
        return
      }
      if ( !regPassword.test(this.password) ) {
        this.$vux.toast.show({
          type: 'warn',
          text: '密码格式不正确！'
        })
        return
      }
      let userInfo = localStorage.getItem('url_info')
      this.openId = userInfo && userInfo.openId ? userInfo.openId : ''
      let param = {
        userAccout: this.account,
        userPassword: b64_md5(this.password),
        authCode: this.smsCode,
        openId: this.openId
      }
      const res = await getLogin(param)
      if(!this.checkRequest(res)) return;
      let data = res.data.data
      //alert(data.token)
      // 修改userInfo的token，userId
      // userInfo.token = data.token
      // userInfo.userId = data.id
      localStorage.setItem('is_token', '1')
      // // 保存用户信息到本地存储
      localStorage.setItem('user_info', data)
      // home_index 底部导航索引
      sessionStorage.setItem('home_index', 0)
      // 保存用户信息
      this.$store.commit('saveUserInfo', data)
      sessionStorage.setItem('select_first', 1)
      this.initUserInfo(data.id)
      this.jumpPage(data.temporary)
    },
    jumpPage(code) {
      // 松岗办公人员
      if (code == 1) {
        this.$router.push('/home/assign')
      } else if (code == 5) { // 承包方
        this.$router.push('/home/contract')
      } else {
        this.$vux.toast.show({
          type: 'warn',
          text: '您不是合法身份，无法登陆'
        })
      }
    },
    // 获取用户信息并且保存到localStroage
    async initUserInfo(userId) {
      let userInfo = localStorage.getItem('user_info')
      let param = {
        id: userId
      }
      const res = await ids(param)
      if (!this.checkRequest(res)) return;
      let userMain = res.data.data
      localStorage.setItem('user_main', userMain)
    },
  },
  components: {
    Confirm
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common.styl'
.login
  height 100%
  width 100%
  background linear-gradient(to top, #06639e, $primary-color)
  // background $primary-color
  position absolute
  top 0
  bottom 0
  overflow hidden
  .title
    color #fff
    font-size 24px
    font-weight 700
    text-align center
    padding 10px 0
    &:first-child
      margin-top 80px
  .form-wrapper
    width 70%
    margin 40px auto 30px auto
    border-radius 10px
    background rgba(255,255,255,.2)
    padding 10px 20px 25px 20px
    .row
      display flex
      padding 15px 0
      box-sizing border-box
      // border-bottom 1px solid #eee
      border-1px(rgba(255,255,255, .5))
      flex-wrap nowrap
      flex-direction row
      width 100%
      // justify-content space-between
      &:last-child
        border none
      .iconfont
        flex 0 0 40px
        font-size 24px
        color #fff
        text-align left
        border-right 1px solid #ccc
        margin-right 20px
      .text
        flex 1
        height 25px
        display inline-block
        min-width 100px
        font-size 16px
        background rgba(255,255,255,.0)
        color #eeeeee
        letter-spacing 1px
        &::-webkit-input-placeholder
          color #ccc
      .btn-sms
        flex 0 0 60px
        padding 6px
        display inline-block
        color #fff
        font-size 12px
        border 1px solid #eee
        border-radius 5px
        text-align center
  .btn-login
    width 70%
    margin 0 auto
    background rgba(255,255,255,.2)
    color #fff
    text-align center
    border-radius 10px
    padding 15px 20px
    font-size 18px
    letter-spacing  5px
.check-image
  margin-top 20px
  img
    display inline-block
    margin-right 10px
    width 100px
  input
    display inline-block
    border-bottom 1px solid #999
    width 92px
    outline none
</style>
