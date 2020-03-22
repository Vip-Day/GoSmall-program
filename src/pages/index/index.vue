<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">

    <search @search="disableScroll" />


    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">

      <swiper-item v-for="item in swiperData" :key="item.goods_id">
        <navigator :url="'/pages/goods/index?id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>

    </swiper>



    <!-- 导航条 -->
    <view class="navs">

      <navigator open-type="switchTab" url="/pages/category/index" v-for="item in navData" :key="item.name">
        <image :src="item.image_src"></image>
      </navigator>

    </view>



    <!-- 楼层 -->
    <view class="floors">


      <view class="floor" v-for="floor in floorsData" :key="floor.floor_title.name">
        
        <!-- 标题 -->
        <view class="title">
          <image :src="floor.floor_title.image_src"></image>
        </view>

        <!-- 细节分类 -->
        <view class="items">

          <navigator url="/pages/list/index" v-for="(product,index) in floor.product_list" :key="index">
            <image :src="product.image_src"></image>
          </navigator>

        </view>



      </view>



    </view>


    <!-- 回到顶部 -->
    <view class="goTop icon-top" @click="goTop" v-if="btnIsView"></view>


  </view>
</template>

<script>
  import search from '@/components/search';

  export default {

    data () {
      return {
        // 页面高度
        pageHeight: 'auto',
        // 默认：在顶端的时候，
        btnIsView:false,



        // 轮播图的数据
        swiperData:[],
        // 导航数据
        navData:[],
        // 楼层数据
        floorsData:[],
      }
    },

    components: {
      search
    },
    // 
    methods: {
      // 回到顶部；
      goTop(){
        // api 十有八九是api
        uni.pageScrollTo({
          scrollTop:0
        });
      },
      // 防止滚动的函数
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },
      // ------------------------------------------数据
      // 获取轮播图数据
      async getSwiperList(){
        // uni promise 封装????肯定是可以! 
        // var [err,res]  = await uni.request({
        //   url:"https://api-ugo-web.itheima.net/api/public/v1/home/swiperdata"
        // });
        // this.swiperData = res.data.message;


        // 1.优雅；
        // 2.好维护；
        const {message}  = await this.request({
          url:"/api/public/v1/home/swiperdata"
        });
        this.swiperData = message;


      },

      // 获取nav数据
      async getNavList(){

        const {message}  = await this.request({
          url:"/api/public/v1/home/catitems"
        });
        this.navData = message;
      },

      // 获取floors数据
      async getFloorsList(){

        // const {message}  = await this.request({
        //   url:"/api/public/v1/home/floordata"
        // });
        
        const {message}  = await this.request({
          url: "/api/public/v1/home/floordata"
        });
        this.floorsData = message;
      },
    },

    // 1页面加载的时候：请求
    onLoad(){

      // 轮播图
      this.getSwiperList();
      
      // nav
      this.getNavList();

      // l楼层
      this.getFloorsList();

      // 开启转发功能：
      uni.showShareMenu();


    },

    // 2.响应用户下拉的时候
    async onPullDownRefresh(){
      // 1.下拉的效果有了；

      // 2.数据请求
      // 轮播图
      await this.getSwiperList();  
      
      // nav
      await this.getNavList();

      // l楼层
      await this.getFloorsList();

      // 3.请求完成时，下拉还在！！！等待所有请求完成的时候(加上async await)，关闭下拉效果！
      // api：结束下拉效果
      uni.stopPullDownRefresh();
    },
    
    // 3.页面滚动的时候
    onPageScroll(e){

      if (e.scrollTop>200) {
        // 控制按钮 显示
        this.btnIsView = true;
      }
      else {
        // 控制按钮 隐藏
        this.btnIsView = false;
      }
    },

    onShareAppMessage(){
      return {
        title: '欢迎使用UGO!',
        imageUrl: 'http://www.999zx.cn/adm_file/fck/images/2018/4/Image/20184386447866.jpg',
        path: '/pages/index/index'
      };
    }
  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>