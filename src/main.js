import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app';


// 插件的引入:接受我们配置的参数：基础路径的参数；
import request from './utils/request.js';

// 执行结果 plugin：函数
var plugin = request({
  baseUrl: "https://api-ugo-web.itheima.net"
});

// vue调用：plugin函数
Vue.use(plugin);



// 好处：在每个vue组件内 this.baseUrl
// Vue.prototype.baseUrl = "https://api-ugo-web.itheima.net";



const app = new Vue({
  ...App
})
app.$mount()