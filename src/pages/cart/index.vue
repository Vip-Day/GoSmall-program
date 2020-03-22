<template>
  <view class="wrapper">


    <!-- 收货信息 -->
    <view class="shipment">

      <!-- 判断有没有收货地址？没有地址，下面信息框 不显示 -->
      <block v-if="addr">
        <view class="dt">收货人: </view>
        <view class="dd meta">
          <text class="name">{{addr.userName}}</text>
          <text class="phone">{{addr.telNumber}}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{addr.detail}}</view>
      </block>


      <!-- 按钮：点击获取地址 -->
      <button v-else type="primary" @click="getAddr">收货地址</button>
      



    </view>


    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>

        <view class="goods" v-for="(item,index) in carts" :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{item.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @click="changeNum(-1,index)">-</text>
              <input type="number" :value="item.goods_number" class="number">
              <text class="plus" @click="changeNum(1,index)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon 
              type="success" 
              size="20" 
              :color="item.goods_buy?'#ea4451':'#ccc'"
              @click="changeBuy(index)"></icon>
          </view>
        </view>

      </view>
    </view>

    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon 
          type="success" 
          :color="is?'#ea4451':'#ccc'" 
          size="20" 
          @click="changeAll"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{sum}}</label><text>.00</text>
      </view>
      <view class="pay" @click="goCreatOrder">结算({{buy_carts.length}})</view>
    </view>


  </view>
</template>

<script>
  export default {
    data(){
      return {
        // 默认值：null
        carts:[],
        // 收货地址：
        addr:null,
      }
    },  
    computed:{
      // 把选中的商品 筛选出来
      buy_carts(){

        var arr = [];
        this.carts.forEach(function (item,index) { 
          // 商品要buy 状态
          if (item.goods_buy) {
            arr.push(item);
          }
        });
        return arr;
      },
      // 全选是否选中
      is(){
        return this.buy_carts.length==this.carts.length;
      },
      // 选中的商品总价
      sum(){
        var zong = 0;
        this.buy_carts.forEach(function (item) {
          zong += item.goods_number * item.goods_price;
        });

        return zong;
      }
    },
    methods:{
      //点击 + - 
      changeNum(step,index){

        // ------------------------2.页面数据改变
        // step
        // -1 ：点击是-
        // 1 ：点击是+

        // - :至少有一件商品
        if (step==-1&&this.carts[index].goods_number==1) {
          return;
        }
        // +: 按照道理和库存量对比
        if (step==1&&this.carts[index].goods_number>=15) {
          return;
        }

        // +
        // if (step==1) {
        //   this.carts[index].goods_number += 1;
        // }

        // - 
        // if (step==-1) {
        //   this.carts[index].goods_number += -1;
        // }
        // 讨巧的抒写方式
        this.carts[index].goods_number += step;


        // ------------------------3.存回本地
        uni.setStorageSync("carts",this.carts);
        
      },
      // 点击单选：买 或者不买！
      changeBuy(index){
        // 数据改变：买 或者不买
        this.carts[index].goods_buy = !this.carts[index].goods_buy;

        // 存回去：
        uni.setStorageSync("carts",this.carts);
      },
      // 点击全选
      changeAll(){
        // 1.拿到当前 全选的状态 is 
        // 即将要变成的状态
        var ck = !this.is;

        // 2.把所有的商品的状态进行改变！
        this.carts.forEach(function (item) { 
          item.goods_buy = ck;
        });

        // 3.把数据存回去
        uni.setStorageSync("carts",this.carts);

      },
      // 获取地址
      getAddr(){
        uni.chooseAddress({
          success:(res)=>{
            this.addr = res;
            this.addr.detail = res.provinceName+res.cityName+res.countyName+res.detailInfo;
          }
        })
      },
      // 当前用户要形成订单
      async goCreatOrder(){
        // 1.收货地址  没有
        if (!this.addr) {
          uni.showToast({title:"无收货地址",icon:"none"});
          return;
        }

        // 2.选择商品  
        if (!this.buy_carts.length) {
          uni.showToast({title:"没有选择商品",icon:"none"});
          return;
        }

        // 3.看当前用户是否已经登录：token 
        if (!uni.getStorageSync("token")) {
          // 没有登录 让用户登录 : 专门页  
          // 课堂问题：如何去专门登录页？
          uni.navigateTo({
              url:"/pages/auth/index"
          });

          // tabBar页？switchTab
          return;
        }

        // 校验成功：request 我们自己封装
        const {message,meta} = await this.request({
          url:"/api/public/v1/my/orders/create",
          method:"POST",
          header:{
            "Authorization":uni.getStorageSync("token")
          },
          data:{
            order_price:this.sum,
            consignee_addr:this.addr.detail,
            goods:this.buy_carts
          }
        });

        // console.log(message);
        
        // 创建订单成功
        if (meta.status==200) {

          // 1.清除购物车
          uni.removeStorageSync("carts");
  
          // 2.去订单页  非tabBar
          uni.navigateTo({
            url:"/pages/order/index"
          });
        }
        // 
        else {
          uni.showToast({title:"创建订单不成功",icon:"none"});
        }


      }
    },
    // 页面声明周期：本页面A进入新的页面B,从B页面回到A页面的时候，A的onLoad();
    onLoad(){

    },
    // 重新显示的话，重新执行；
    onShow(){
      // 1.读取数据完成
      this.carts = uni.getStorageSync("carts")||[];
    }

  }
</script>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        position: absolute;
        bottom: 0;

        color: #ea4451;
        font-size: 33rpx;

        text {
          font-size: 22rpx;
        }
      }

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

