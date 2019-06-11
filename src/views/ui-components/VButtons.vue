<template>
  <v-form ref="form">
    <v-text-field
      :counter="11"
      :rules="commonRules"
      label="title"
      required
      v-model="itemInfo.title"
    ></v-text-field>
    <v-text-field :rules="commonRules" label="description" required v-model="itemInfo.description"></v-text-field>
    <v-text-field :rules="commonRules" label="price" required v-model="itemInfo.price"></v-text-field>
    <v-text-field :rules="commonRules" label="stock" required v-model="itemInfo.stock"></v-text-field>
    <v-text-field :rules="commonRules" label="imgUrl" required v-model="itemInfo.imgUrl"></v-text-field>
    <v-btn @click="createItem" color="success">创建商品</v-btn>
  </v-form>
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
export default {
  data() {
    return {
      drawer: true,
      message: "",
      itemInfo: {
        title: "",
        description: "",
        price: "",
        imgUrl: "",
        stock: ""
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
    switchPage(page) {
      window.location.href = page + ".html";
    },
    createItem() {
      this.$http
        .post("http://localhost:8088/item/create", this.itemInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "创建商品成功";
            Snackbar.success(this.message);
          } else {
            this.message = "创建商品失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
          console.log(error);
        })
        .finally(() => {
          // this.snackbar = true;
        });
    }
  }
};
</script>