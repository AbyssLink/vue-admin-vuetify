<template>
  <v-data-table :headers="headers" :items="items" class="elevation-1">
    <template v-slot:items="props">
      <td @click="getItemDetail(props.item.id)">{{ props.item.title }}</td>
      <td class="text-xs-left">{{ props.item.price }}</td>
      <td class="text-xs-left">{{ props.item.stock }}</td>
      <td class="text-xs-left">{{ props.item.sales }}</td>
      <td class="text-xs-left">{{ props.item.description }}</td>
    </template>
  </v-data-table>
</template>

 <script>
import axios from "axios";
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

// 设置为 form-data 格式
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
      headers: [
        {
          text: "title",
          align: "left",
          sortable: false,
          value: "title"
        },
        { text: "price (rmb)", value: "price" },
        { text: "stock", value: "stock" },
        { text: "sales", value: "sales" },
        { text: "description", value: "description" }
      ],
      items: [],
      icons: {
        1: "email",
        2: "phone",
        3: "forum",
        4: "help",
        5: "share"
      },
      commonRules: [v => !!v || "This is required"]
    };
  },
  created: () => {},
  methods: {
    switchPage(page) {
      window.location.href = page + ".html";
    },
    getItemList() {
      this.$http
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
        })
        .finally(() => {
          // this.snackbar = true;
        });
    },
    getItemDetail(id) {
      window.location.href = "carousels?id=" + id;
    }
  },
  mounted() {
    this.getItemList();
  }
};
</script>