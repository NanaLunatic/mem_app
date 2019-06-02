<template>
  <div class="mine">
    <div class="user-wrapper">
      <div class="dept">{{ userMain.deptName }}</div>
      <div class="name">{{ userMain.name }}</div>
    </div>
    <x-button type="primary" class="btn first" @click.native="showConfirm">修改密码</x-button>
    <x-button type="primary" class="btn" @click.native="showExitConfirm">退出登录</x-button>
    <div class="footer">松岗建设工程管控系统</div>

    <div v-transfer-dom>
      <confirm v-model="isShowConfirm"
        title="修改密码"
        :close-on-confirm="isClose"
        @on-confirm="submitPassword">
          <div class="form-wrapper">
            <div class="block">
              <span class="block-left star">原密码：</span>
              <input type="password" class="block-right" v-model.trim="oldPassword" placeholder="请输入" maxlength="20">
            </div>
            <div class="block">
              <span class="block-left star">新密码：</span>
              <input type="password" class="block-right" v-model.trim="newPassword" placeholder="请输入" maxlength="20">
            </div>
            <div class="block">
              <span class="block-left star">确认密码：</span>
              <input type="password" class="block-right" v-model.trim="confirmPassword" placeholder="请输入" maxlength="20">
            </div>
          </div>
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { doExit, updatePassword } from "api";
import { Confirm, XButton, TransferDomDirective as TransferDom } from "vux";
import { localStorage, sessionStorage } from "assets/js/storage.js";
export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      isClose: false,
      isShowConfirm: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  },
  computed: {
    userMain() {
      let userMain = localStorage.getItem('user_main')
      return userMain
    }
  },
  methods: {
    showExitConfirm() {
      this.$vux.confirm.show({
        title: '退出登录',
        content: '退出后，再次进入需要重新登录，是否确认退出？',
        onConfirm: () => {
          this.exit()
        }
      });
    },
    async exit() {
      const res = await doExit({});
      if (!this.checkRequest(res)) return;
      // this.$store.commit('saveLoginOut', 2)
      sessionStorage.setItem('saveLoginOut', 2)
      localStorage.setItem('is_token', '0')
      let userInfo = localStorage.getItem('url_info')
      localStorage.setItem("userInfo")
      this.$router.push("/login");
    },
    showConfirm() {
      this.clear();
      this.isShowConfirm = true;
    },
    async submitPassword() {
      let [flag, message, regex] = [
        true,
        "",
        /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/
      ];
      if (this.newPassword !== this.confirmPassword) {
        flag = false;
        message = "新密码必须与确认密码一致";
      }
      if (!regex.test(this.newPassword)) {
        flag = false;
        message = "密码格式不正确，请输入含大小写字母和数字的密码，长度至少8位";
      }
      if (!this.oldPassword) {
        flag = false;
        message = "请输入确认密码";
      }
      if (!this.newPassword) {
        flag = false;
        message = "请输入新密码";
      }
      if (!this.oldPassword) {
        flag = false;
        message = "请输入原密码";
      }
      if (!flag) {
        this.$vux.toast.show({
          type: "warn",
          width: "12em",
          time: 3000,
          text: message
        });
        return;
      }
      let param = {
        oldPassword: b64_md5(this.oldPassword),
        newPassword: b64_md5(this.newPassword),
        confirmPassword: b64_md5(this.confirmPassword)
      };
      const res = await updatePassword(param);
      if (!this.checkRequest(res)) return;
      this.isShowConfirm = false;
      this.$vux.toast.show({
        text: "修改密码成功"
      });
    },
    clear() {
      this.oldPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    }
  },
  watch:{
    newPassword(val, oldval) {
      this.newPassword = val.replace(/[\u4e00-\u9fa5]+/g,'')
    },
    confirmPassword(val, oldval) {
      this.confirmPassword = val.replace(/[\u4e00-\u9fa5]+/g,'')
    }
  },
  components: {
    XButton,
    Confirm
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/style/common';

.mine {
  .user-wrapper {
    background: linear-gradient(to right, #338cc5, #08649f);
    padding: 25px;
    color: #fff;
    line-height: 40px;

    .dept {
      font-size: 18px;
    }

    .name {
      font-size: 24px;
    }
  }

  .btn {
    font-size 16px
    height 40px
    width: 160px;
    position: absolute;
    bottom: 100px;
    left: 50%;
    margin-left: -80px;

    &.first {
      bottom: 180px;
    }
  }

  .footer {
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    text-align: center;
  }
}

.form-wrapper {
  text-align: left;
  padding: 20px 0;

  // border-top-bottom()
  .block {
    display: flex;
    border-1px(rgba(7, 17, 27, 0.1));
    padding: 5px 0;
    align-items: center;

    &-left {
      width: 90px;
      text-align: right;
      margin-right: 5px;
      color: #454545;
    }

    &-right {
      padding: 8px 0;
      flex: 1;
      min-width: 110px;
    }
  }
}
</style>
