<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>


    <!-- 商品列表 区域滚动，不是页面滚动-->
    <scroll-view class="goods" scroll-y @scrolltolower="getBottom">

      <view class="item" @click="goDetail(item.goods_id)" v-for="item in list" :key="item.goods_id">
        <!-- 商品图片 -->
        <image class="pic" :src="item.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{item.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{item.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>

    </scroll-view>


  </view>
</template>

<script>
  export default {
    data(){
      return {
        // 默认查询的字符
        query:"",
        pagenum:1,
        pagesize:5,

        // 请求状态：
        zt:"请求完",

        // 接收请求回来的数据
        list:[]
      }
    },
    // 
    methods: {
      // 详情页
      goDetail (id) {
        // 页面转跳到详情页！
        uni.navigateTo({
          url: '/pages/goods/index?id='+id
        });
      },
      // 区域滚动：触底的时候
      async getBottom(){
        
        // 
        if (this.zt=="请求完") {
          
          // 防止用户多次触底
          this.zt="请求中";

          // API ：设计的时候必须支持分页查询；
          this.pagenum++;

          // 再次请求的时候；异步；
          await this.getList();

          // 真实的请求数据回来后，状态改回来
          this.zt="请求中";
        }
        
      },

      // 数据请求
      async getList(){

        const {message} =  await this.request({
          url:"/api/public/v1/goods/search",
          data:{
            query:this.query,
            pagenum:this.pagenum,
            pagesize:this.pagesize,
          }
        });

        // 
        this.list = this.list.concat(message.goods);
      

      },
    },

    // 用于接收页面传入的参数
    onLoad(res){
      // 1.获取参数
      this.query = res.query;

      // 2.数据请求
      this.getList();
      
    }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

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
  }
</style>
