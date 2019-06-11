<template>
  <v-hover>
    <v-card class="mx-auto" color="grey lighten-4" max-width="600" slot-scope="{ hover }">
      <v-img :aspect-ratio="16/12" :src="itemInfo.imgUrl">
        <v-expand-transition>
          <div
            class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
            style="height: 100%;"
            v-if="hover"
          >{{itemInfo.price}} ¥</div>
        </v-expand-transition>
      </v-img>
      <v-card-text class="pt-4" style="position: relative;">
        <v-btn @click="createOrder" absolute class="white--text" color="orange" fab large right top>
          <v-icon>shopping_cart</v-icon>
        </v-btn>
        <div class="font-weight-light grey--text title mb-2">{{itemInfo.description}}</div>
        <h3 class="display-1 font-weight-light orange--text mb-2">{{itemInfo.title}}</h3>
        <div class="font-weight-light title mb-2">
          销量: {{itemInfo.sales}}
          <br>
          库存: {{itemInfo.stock}}
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.headers.get["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.transformRequest = [
  function(data) {
    let ret = "";
    for (let it in data) {
      ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
    }
    return ret;
  }
];
//然后再修改原型链
Vue.prototype.$http = axios;

function getParam(paramName) {
  // 解析 url 参数, 获取 qurey string
  let paramValue = "";
  let isFound = !1;
  if (
    window.location.search.indexOf("?") == 0 &&
    window.location.search.indexOf("=") > 1
  ) {
    let arrSource;
    let i;
    (arrSource = unescape(window.location.search)
      .substring(1, window.location.search.length)
      .split("&")),
      (i = 0);
    while (i < arrSource.length && !isFound)
      arrSource[i].indexOf("=") > 0 &&
        arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() &&
        ((paramValue = arrSource[i].split("=")[1]), (isFound = !0)),
        i++;
  }
  return paramValue == "" && (paramValue = null), paramValue;
}

export default {
  data() {
    return {
      drawer: true,
      snackbar: false,
      message: "",
      itemInfo: {
        id: "",
        title: "",
        price: "",
        stock: "",
        description: "",
        sales: "",
        imgUrl: ""
      },
      orderInfo: {
        itemId: "",
        amount: 1, //先写死
        promoId: ""
      },
      icons: {
        1: "email",
        2: "phone",
        3: "forum",
        4: "help",
        5: "share"
      },
      commonRules: [v => !!v || "This is required"],
      y: "top",
      x: null,
      mode: "",
      timeout: 6000
    };
  },
  methods: {
    createOrder() {
      this.orderInfo.itemId = this.itemInfo.id;
      this.$http
        .post("http://localhost:8088/order/createorder", this.orderInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "下单成功！交易金额: " + this.itemInfo.price;
            setTimeout("window.location.reload()", 3000);
            Snackbar.success(this.message);
          } else {
            this.message = "下单失败，原因为: " + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          // this.snackbar = true;
        });
    },
    getItemDetail() {
      this.itemInfo.id = getParam("id");
      this.$http
        .get("http://localhost:8088/item/get?id=" + this.itemInfo.id)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取商品信息成功";
            this.itemInfo = response.data.data;
            Snackbar.info(this.message);
          } else {
            this.message =
              "获取商品信息失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        })
        .finally(() => {
          // this.snackbar = true;
        });
    }
  },
  mounted() {
    this.getItemDetail();
  }
};
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>