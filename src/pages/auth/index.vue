<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="btnGetInfo">微信登录</button>
  </view>
</template>

<script>
  export default {

    methods:{
      // 2 用户主动点击后：获取信息
      btnGetInfo(userInfo){
        // console.log(userInfo.detail);  // 用户信息
        
        //  用户信息：
        this.getToken(userInfo.detail);
      },


      // js 方式去获取用户的信息；
      async JsGetInfo(){
        // uni已经对wx 原生的异步方法，做promise；
        const [err,res] =  await uni.getUserInfo();

        // 看JS获取成功？
        if (!res) {
          return;
        }

        // 获取成功
        // res  用户信息；
        this.getToken(res);

      },

      // 获取token信息
      async getToken(res){
        // 1.res 用户信息
        
        // 2. code信息 : 小程序向微信服务器 项目的 appID == 服务上的appID
        const [err,codeObj] =  await uni.login();


        // 3.向公司服务器请求：返回应该给我token!!
        const {message} =  await this.request({
          url:"/api/public/v1/users/wxlogin",
          method:"POST",
          data:{
            code:codeObj.code,
            encryptedData:res.encryptedData,
            iv:res.iv,
            rawData:res.rawData,
            signature:res.signature,
          }
        });

        // 为什么错了？
        // 小程序：AppID：谁的？我的；
        // 公司服务器：里面也有AppID: 谁的？公司；
        
        // 解决：
        //   公司：IDE 里面替换为 公司的appID; wx38d8faffac4d34d2
        //   学生：你们没有权限，不是我们学校这个开发小程序的开发人员！

        // 4.token获取到：存入本地  用户信息 == token 加密字符串
        uni.setStorageSync("token",message.token);

        // 5.返回去  路由 ：上一页；
        uni.navigateBack();
      },
    },
    async onLoad(){
      // 1. JS方式获取下用户信息？为什么不用button形式获取？
      //    因为：有可能已经授权过了；
      //    如果：其他地方已经授权，还让用户点 button 获取信息；
      //    用户：很烦！！每次都这样！！
      this.JsGetInfo();

      // 2. 如果JS获取不成功！让用户主动点击按钮！！！
      //    用户：行为；事件，注册回调函数！

    }
  }
</script>

<style lang="less" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>