#  电子商城 demo

**基于 Vue 和 Vuetify 组件的一个电子商城前端 demo**,  [原始项目](https://github.com/vasttian/vue-admin-vuetify)  /  [后端项目地址](https://github.com/ShiroCheng/spikeproject) (Spring boot 实现)

### 运行截图

![商品页](/Users/chengjingze/Desktop/Screenshot 2019-06-16 at 5.18.59 PM.png)

![用户页](/Users/chengjingze/Desktop/Screenshot 2019-06-16 at 5.19.11 PM.png)

![商品列表](/Users/chengjingze/Desktop/Screenshot 2019-06-16 at 5.18.35 PM.png)

### 项目构建

#### 下载项目

```bash
git clone https://github.com/ShiroCheng/vue-admin-vuetify
cd vue-admin-vuetify
```

#### 安装依赖

```bash
npm install
```

#### 以开发模式(热加载)启动

```bash
npm run serve
```

打开 http://localhost:3000 查看 demo

如果热加载失败
更改  `vue.config.js`

```javascript
module.exports = {
  chainWebpack: config => {
    config.resolve
      .symlinks(true)
  }
}
```

#### 以生产模式启动

```bash
npm run build
```

#### 提示和修复文件

```bash
npm run lint
```



### 项目介绍

这是一个简单的电子商城 demo，可以供普通用户和和管理员使用。

**普通用户权限:**

1. 查看商品
2. 购买商品
3. 查看和删除自己的订单
4. 查看个人信息

**管理员权限：**

1. 查看商品
2. 添加、删除商品
3. 查看和删除自己的订单
4. 查看和删除所有用户的订单
5. 查看个人信息
6. 查看和删除所有用户的信息

关于订单下单、用户手机号注册等服务没有具体实现，仅做了服务的数据模拟。



### 项目实现

项目的总体实现比较简单，由于 vuetify 本身就是已经非常成熟的响应式框架，我在样式和布局上没有花费多大的功夫，主要的难点在于前后端跨域请求数据和前端的用户状态管理问题。



#### 技术栈

`Vuetify` + `Vue` + `axios` + `Springboot` + `mybatis` + `mysql` + `redis`



#### 前端用到的库

1. 组件样式: `vuetify`, `material-design-icons-iconfont`

2. 全屏幕显示: `screenfull`

3. 图表：`vue-echarts`

4. 地图: `vue-baidu-map`

5. 路由处理: `vue-router`

6. 状态保存: `vuex`

7. ajax 请求: `axios`

8. 时间处理: `moment`

   

#### 后端依赖库

1. 全栈应用程序框架和控制反转容器实现：`Spring-boot`
2. 数据库连接/连接池管理：`mysql-connector-java`
3. druid 数据源: `com.alibaba.druid`
4. Mybatis 对 Spring-boot 支持: `mybatis-spring-boot-starter`
5. Redis 对 Spring-boot 支持: `spring-boot-starter-data-redis`
6. 校验类: `hibernate-validator`
7. 时间类: `joda-time`
8. 单元测试：`junit`
9. Spring-boot 测试：`spring-boot-starter-test`
10. mybatis 映射自动生成插件: `mybatis-generator-maven-plugin`



#### 前后端跨域实现

axios 默认跨域不带 cookies, 需要更改设置以完成跨域请求:

```javascript
import Axios from 'axios';

// 设置 request 格式
Axios.defaults.withCredentials = true; //! 跨域带cookies
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

Vue.prototype.$http = Axios; // 再修改原型链，以全局使用

```

后端设置：

```java
@Configuration
public class CORSConfig {
    @Bean
    public FilterRegistrationBean corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // 设置你要允许的网站域名，如果全允许则设为 *
        config.addAllowedOrigin("*");
//        config.addAllowedOrigin("http://localhost:3000");
        // 如果要限制 HEADER 或 METHOD 请自行更改
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));

        // 这个顺序很重要哦，为避免麻烦请设置在最前
        bean.setOrder(0);
        return bean;
    }
}
```



动态路由设置:

```javascript
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { name: 'Dashboard' },	//仪表板
      meta: {
        hidden: true,
        hasMulSub: false,
      },
    },
    {
      path: '/index',
      name: 'Index',
      component: Layout,
      redirect: { name: 'Dashboard' },
      meta: {
        hidden: false,
        hasMulSub: false,
      },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/TheIndex.vue'),
          meta: {
            icon: 'dashboard',
          },
        },
        itemComponents,	// 商品管理组件的路由
        orderComponents,	// 订单管理组件的路由
        userComponents,	//用户管理组件的路由
      ],
    },
    {
      path: '*',
      redirect: '/404',
      meta: {
        hidden: true,
      },
    },
  ],
});
```



区分用户(user)和管理员(admin)，加载不同的路由:

```javascript
getFilterRouteChild: function(route) {
      let i = route.children.length;
      while (i--) {
        if (
          route.children[i].meta.auth &&
          !route.children[i].meta.auth.includes(
            JSON.parse(localStorage.getItem("LOGIN_USER")).thirdPartyId
          )
        ) {
          route.children.splice(i, 1); //删除无权限的路由项
        }
      }
      // console.log(route.children);
      return route.children;
    }
```



获取后端数据的方式: axios 进行异步请求后端定义好的接口，以 **商品页** 为例:

```javascript
<script>
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

export default {
  data() {
    return {
      ...
      items: [],
      commonRules: [v => !!v || "This is required"],	//表单校验规则
      actions: {}
    };
  },
  created: () => {},
  methods: {
    getItemList() {
      // 调用获取商品列表接口
      Vue.prototype.$http
        .get("http://localhost:8088/item/list")
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取商品列表成功";
            this.items = response.data.data;
            Snackbar.info(this.message);
          } else {
            this.message =
              "获取商品列表失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    getItemDetail(id) {
      this.$router.push({ name: "商品详情", query: { id: id } });
    },
    editItem(item) {
      Snackbar.info("开发中，请等待……");
    }
  },
  mounted() {
    this.getItemList();
  }
};
</script>
```



后端请求返回格式示例：

```json
{
  "status": "success",
  "data": {
    "id": 18,
    "title": "Apple iPad Pro",
    "price": 6280,
    "stock": 20,
    "description": "Apple iPad Pro (11-inch, Wi-Fi, 256GB) - Space Gray (Latest Model)",
    "sales": 20,
    "imgUrl": "https://images-na.ssl-images-amazon.com/images/I/61yaUxH6XsL._SL1500_.jpg",
    "promoStatus": 0,
    "promoPrice": null,
    "promoId": null,
    "startDate": null,
    "endDate": null
	}
}
```

后端表结构:

![Screenshot 2019-06-04 at 8.09.32 AM](/Users/chengjingze/Desktop/Screenshot 2019-06-04 at 8.09.32 AM.png)



#### 问题与不足

项目的实现相对比较简单，遗留下未解决的几个大问题：

1. 由于没有学习懂原项目中对的 vuex 全局管理状态及 axios 拦截器的使用，我没有对用户的路由访问做鉴权，只在动态路由生成侧边栏的操作项时根据用户类别做了分类显示，为了弥补这一缺陷，仅在后端增加了更多对操作用户的鉴权，但各个页面都可以通过 url 来访问，这是很不安全与完善的。

2. 在用户调用登陆接口登陆成功后，将用户的登录信息及权限存在 web 浏览器的 localStorage 中已到达全局共享的目的，并对用户的权限进行判断。比如在用户发出订单后调用 localStrage 获取用户的 userId, 以及获取用户的权限以渲染不同的侧边栏路由项。但由于 localStorage 可以手动修改，用户可以通过修改 role(角色) 属性来更改自己的权限，因此也存在很大的安全隐患。和同学讨论后，了解到可以将用户凭证存在 请求头 (header), 后端解析请求头来获取用户凭证和共享信息。未来计划这样更改。

3. 前端未做输入的正则匹配，后端也未做校验，这样无法避免会产生 SQL 注入与恶意脚本执行等潜在的风险，安全性不足。(永远不要相信用户输入)



#### 体会

在这个项目中充分学习基础的 vue 模版的使用，对 vue 的数据绑定和模版式渲染的强大有了更深的体会，以前只学习过使用 express 后端 渲染 ejs 这类前后端不分离的项目，使用 vue 后深刻了解到了前后端分离开发的必要和方便强大之处，以及对如何更改整合一个有基础框架的 vue 项目有了一定的经验。





### 待完成

**1. 使用 vuex 保存用户登陆凭证(token)，并做组件数据的统一管理，对路由请求进行拦截。**

**2. 将 axios 异步请求的方法封装为 API，方便并规范化与后端调用的接口的调用与处理**



### Git log

![Screenshot 2019-06-16 at 5.33.21 PM](/Users/chengjingze/Desktop/Screenshot 2019-06-16 at 5.33.21 PM.png)