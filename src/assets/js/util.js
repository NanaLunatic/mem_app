export default {
  install(Vue, options) {
    // const URL_HEAD = "http://192.168.1.156:8080/"  //廖武
    // const URL_HEAD = 'http://192.168.1.131:8080/' //谷文海
    const URL_HEAD = 'http://192.168.1.130:8080/' //卿旺
    // const URL_HEAD = 'http://192.168.1.136:8080/'  //莫晓露
    // const URL_HEAD = 'http://192.168.1.136:8080/'  //莫晓露
    // const URL_HEAD = 'http://119.23.130.85:10080/'   //测试服务器
    // const URL_HEAD = 'http://192.168.1.11:10080/' //巫宇杰
    // const URL_HEAD = ''   // 生产环境
    Vue.prototype.URL_HEAD = URL_HEAD // 设置公用请求头
    /**
     * 功能：将时间戳按照给定的 时间/日期 格式进行处理
     * param {Number} date 时间戳
     * param {String} fmtExp 时间格式 'yyyy-MM-dd hh:mm'
     * returns {String} 规范后的 时间/日期 字符串
     */
    Vue.prototype.formateDate = function (date, fmtExp) {
      var date = new Date(date)
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmtExp))
        fmtExp = fmtExp.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmtExp))
          fmtExp = fmtExp.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmtExp;
    }
    Vue.prototype.checkRequest = function (res) {
      // console.log(res)
      let flag = true
      let message = ''
      if (!res || !res.data) return false;
      // if (res.data.code !== 'gl000') {
      //   flag = false
      //   message = res.data.msg
      // }
      // status为200则服务器正常请求
      if (res.status !== 200) {
        flag = false
        message = res.status === 400 ? `${res.data.msg}` : `${res.msg}`
      } else {
        // code不为gl000，传递参数不正常
        if (res.data.code !== 'gl000') {
          flag = false
          message = res.data.msg
        }
      }
      if (!flag) {
        this.$vux.toast.show({
          type: 'warn',
          text: message,
          time: 3000
        })
      }
      return flag
    }

    /* 获取当前页面的href后面的参数,返回一个json对象
     */
    Vue.prototype.GetRequest = function() {
      var url = location.href;
      var theRequest = new Object();
      let index = url.indexOf("?");
      if (index != -1) {
        var str = url.substr(index + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].substring(
            strs[i].indexOf("=") + 1
          );
        }
      }
      return theRequest;
    };

    // 判断当前模块，类型
    Vue.prototype.isModuleType = function (module, type) {
      let moduleType= JSON.parse(sessionStorage.getItem('module_type'))
      if (moduleType && moduleType.module == module && type.indexOf(moduleType['type'].toString()) != -1) {
        return true
      } else {
        return false
      }
    }

    /* 添加聚焦指令 */
    Vue.directive('focus', {
      inserted(el) {
        el.focus()
      }
    })
  }
}
