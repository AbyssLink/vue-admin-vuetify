<template>
  <v-container fluid grid-list-xl>
    <v-layout>
      <!-- 卡片-商品详情 -->
      <v-flex xs7>
        <v-hover>
          <v-card
            class="mx-auto"
            color="grey lighten-4"
            min-width="300"
            max-width="680"
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
      </v-flex>
      <v-flex xs5>
        <!-- 卡片-评论列表 -->
        <div id="e3" style="max-width: 600px; margin: auto;" class="grey lighten-3">
          <v-toolbar color="cyan" dark>
            <v-toolbar-title>Comments</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="addComment">
              <v-icon>add</v-icon>
            </v-btn>
          </v-toolbar>
          <template v-for="item in comments">
            <v-flex xs12 :key="item.id">
              <v-card class="mx-auto" max-width="550" hover>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{item.title}}</h3>
                    <div>{{ item.content }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-list-tile class="grow">
                    <v-list-tile-avatar color="grey darken-3">
                      <v-img class="elevation-6" :src="item.avatar"></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="todo">
                      <v-icon color="red">favorite</v-icon>
                    </v-btn>
                    <v-btn icon @click="todo">
                      <v-icon color="amber accent-2">bookmark</v-icon>
                    </v-btn>
                    <v-btn icon @click="todo">
                      <v-icon color="blue">share</v-icon>
                    </v-btn>
                  </v-list-tile>
                </v-card-actions>
              </v-card>
            </v-flex>
          </template>
        </div>
      </v-flex>
    </v-layout>
    <!-- 对话框-确认下单 -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline green white--text">INFOMATION</v-card-title>
        <v-card-text class="mb-1 font-weight-light subheading">
          确定下单吗？
          <br>
          订单金额 :{{this.itemInfo.price}}.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat="flat" @click="dialog = false">Cancle</v-btn>
          <v-btn color="blue darken-1" flat="flat" @click="createOrder">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 对话框-添加评论表单 -->
    <v-dialog v-model="dialog1" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create Comment</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-form ref="form">
                  <v-text-field
                    :counter="25"
                    :rules="commonRules"
                    label="title"
                    required
                    v-model="commentInfo.title"
                  ></v-text-field>
                  <v-textarea
                    :rules="commonRules"
                    label="content"
                    required
                    v-model="commentInfo.content"
                  ></v-textarea>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog1 = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="confirmCreateComment">Save</v-btn>
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
      dialog1: false,
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
      commentInfo: {
        itemId: "",
        title: "",
        content: ""
      },
      comments: {},
      commonRules: [v => !!v || "This is required"]
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
            this.message =
              "下单成功！金额: " +
              this.itemInfo.price +
              ", 可在 [我的订单] 页面中查看";
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
    },
    getComment() {
      Vue.prototype.$http
        .get(
          "http://localhost:8088/comment/listbyitem?itemid=" + this.itemInfo.id
        )
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取商品评论成功";
            this.comments = response.data.data;
            // Snackbar.info(this.message);
          } else {
            this.message =
              "获取商品评论失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    addComment() {
      this.dialog1 = true;
      this.commentInfo.itemId = this.itemInfo.id;
    },
    confirmCreateComment() {
      this.dialog1 = false;

      // console.log(this.commentInfo);

      Vue.prototype.$http
        .post("http://localhost:8088/comment/create", this.commentInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "评论成功!" + " 可在 [我的评论] 页面中查看";
            Snackbar.success(this.message);
          } else {
            this.message = "评论失败，原因为: " + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    todo() {
      Snackbar.info("开发中，请等待……");
    }
  },
  mounted() {
    this.getItemDetail();
    this.getComment();
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