<template>
  <view class="wrapper" v-if="data">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">


      <swiper-item v-for="(item,index) in data.pics" :key="index">
        <image :src="item.pics_big"></image>
      </swiper-item>

    </swiper>


    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{data.goods_price}}</view>
      <view class="name">{{data.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>
    <!-- 商品详情 -->
    <view class="detail">
      <rich-text :nodes="data.goods_introduce"></rich-text>
    </view>
    <!-- 操作 -->
    <view class="action">
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @click="goCart">购物车</text>
      <text class="add" @click="addCarts">加入购物车</text>
      <text class="buy" @click="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        id:"",
        // 
        data:null,

        // 1.获取本地数据,防止没有没有数据
        carts:uni.getStorageSync("carts")||[]
      }
    },
    methods: {
      // 去购物车页面
      goCart () {
        uni.switchTab({
          url: '/pages/cart/index'
        })
      },
      // 添加到购物车里
      addCarts(){
        // 2.要添加的数据
        var one = {};
        one.goods_id = this.data.goods_id;
        one.goods_name = this.data.goods_name;
        one.goods_price = this.data.goods_price;
        one.goods_small_logo = this.data.goods_small_logo;
        one.goods_small_logo = this.data.goods_small_logo;
        one.goods_number = 1;
        // 要购买的状态:
        one.goods_buy = true;


        // 3.添加到数组  this.carts:看商品是否重复
        //   3.1 Yes 数量加1；
        // 假设该one 商品没有重复
        var key = "未重复";

        // 验证：key 可能会发生
        for (var i = 0; i < this.carts.length; i++) {
          // 商品重复，数量加1；
          if (this.carts[i].goods_id == one.goods_id) {
            this.carts[i].goods_number++;
            key = "已重复";
            break;
          }
        }

        // 3.2 key：还是 "未重复"：真的没有重复商品,追加新的商品
        if (key=="未重复") {
          this.carts.push(one);
        }
        

        // 4.记得存回去：本地缓存
        uni.setStorageSync("carts",this.carts);


        // 5.优化：添加成功；
        uni.showToast({title:"添加成功",icon:"none"})
      },



      // createOrder () {
      //   uni.navigateTo({
      //     url: '/pages/order/index'
      //   })
      // },

      // 请求商品的详情数据
      async getData(){
        
        const {message} =  await this.request({
          url:"/api/public/v1/goods/detail",
          data:{
            goods_id:this.id
          }
        });

        // console.log(message);
        this.data = message;
        
      }
    },
    onLoad(res){
      // 1.拿到id
      this.id = res.id;

      // 2.请求数据
      this.getData();
    }
  }
</script>

<style scoped lang="less">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 640rpx;
  }
  
  .meta {
    height: 250rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 20rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 24rpx;
      color: #999;

      position: absolute;
      right: 10rpx;
      top: 91rpx;
    }

    [class*="icon-"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 10rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    text {
      display: block;
    }

    .add, .buy {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 210rpx;
      text-align: center;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      text-align: center;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
    }

    [class*="icon"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 2rpx;
    }
  }
</style>
