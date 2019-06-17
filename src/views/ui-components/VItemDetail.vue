<template>
  <v-container fluid grid-list-xl>
    <v-hover>
      <v-card
        class="mx-auto"
        color="grey lighten-4"
        min-width="300"
        max-width="650"
        slot-scope="{ hover }"
        hover
      >
        <v-img :aspect-ratio="16/14" :src="itemInfo.imgUrl">
          <v-expand-transition>
            <div
              class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
              style="height: 100%;"
              v-if="hover"
            >{{itemInfo.price}} ¥</div>
          </v-expand-transition>
        </v-img>
        <v-card-text class="pt-4" style="position: relative;">
          <v-btn
            @click="dialog = true"
            absolute
            class="white--text"
            color="orange"
            fab
            large
            right
            top
          >
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
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline green white--text">INFOMATION</v-card-title>
        <v-card-text class="mb-1 font-weight-light subheading">
          Confirm to buy?
          <br>
          Order price :{{this.itemInfo.price}}.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat="flat" @click="dialog = false">Cancle</v-btn>
          <v-btn color="blue darken-1" flat="flat" @click="createOrder">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

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
      dialog: false,
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
      }
    };
  },
  methods: {
    createOrder() {
      this.dialog = false;

      this.orderInfo.itemId = this.itemInfo.id;
      Vue.prototype.$http
        .post("http://localhost:8088/order/createorder", this.orderInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "下单成功！交易金额: " + this.itemInfo.price;
            Snackbar.success(this.message);
          } else {
            this.message = "下单失败，原因为: " + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getItemDetail() {
      this.itemInfo.id = getParam("id");
      Vue.prototype.$http
        .get("http://localhost:8088/item/get?id=" + this.itemInfo.id)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取商品信息成功";
            this.itemInfo = response.data.data;
            // Snackbar.info(this.message);
          } else {
            this.message =
              "获取商品信息失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
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