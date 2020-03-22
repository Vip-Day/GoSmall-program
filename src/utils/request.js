// 1.设置导出
export default function(obj) {
  // 
  const { baseUrl } = obj;

  // 这个导出的函数：被vue.use调用  
  return function(Vue) {

    // 往vue原型对象上设置方法？为什么？
    // vue组件：都是Vue实例化，实例都可以使用设置的方法  this.request调用
    Vue.prototype.request = async function(opts) {
      // 传入参数:  请求的参数
      // console.log(opts);
      const { url, data, method, header } = opts;




      // 友好：1.showLoading()
      uni.showLoading({
        title: "数据加载中...",
        mask: true,
      });

      // 这里做请求
      const [err, res] = await uni.request({
        url: baseUrl + url,
        header: header,
        method: method,
        data: data
      });

      // 2.拿到数据后：
      uni.hideLoading();


      // 请求到数据：返回
      return res.data;
    }



  }

  // 
}




// export default function(Vue) {
//   // 把配置的基础路径：写在插件这个地方；
//   // 好处？：好像是现在这样的写法更简单，更好理解！
//   // 搞清楚：配置在插件JS文件内部！
//   const baseUrl = "https://api-ugo-web.itheima.net";

//   // 往Vue原型对象上设置方法？为什么？
//   // Vue组件：都是Vue实例化，实例都可以使用设置的方法  this.request调用
//   Vue.prototype.request = async function(opts) {
//     // 传入参数:  请求的参数
//     const { url } = opts;


//     // 友好：1.showLoading()
//     uni.showLoading({
//       title: "数据加载中..."
//     });

//     // 这里做请求
//     const [err, res] = await uni.request({
//       url: baseUrl + url,
//     });

//     // 2.拿到数据后：
//     uni.hideLoading();


//     // 请求到数据：返回
//     return res.data;
//   }


// }