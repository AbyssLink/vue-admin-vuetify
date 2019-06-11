<template>
  <v-data-table :headers="headers" :items="users" class="elevation-1">
    <template v-slot:items="props">
      <td>{{ props.item.name }}</td>
      <td class="text-xs-left">{{ props.item.telephone }}</td>
      <td class="text-xs-left">{{ props.item.gender }}</td>
      <td class="text-xs-left">{{ props.item.age }}</td>
    </template>
  </v-data-table>
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
      message: "",
      userInfo: {
        telephone: "",
        name: "",
        gender: "",
        age: ""
      },
      headers: [
        {
          text: "name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "telephone", value: "telephone" },
        { text: "gender", value: "gender" },
        { text: "age", value: "age" }
      ],
      users: [],
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
  created: () => {},
  methods: {
    switchPage(page) {
      window.location.href = page + ".html";
    },
    getItemList() {
      this.$http
        .get("http://localhost:8088/user/list")
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取用户信息成功";
            this.users = response.data.data;
            Snackbar.info(this.message);
          } else {
            this.message =
              "获取用户信息失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.snackbar = true;
        });
    }
  },
  mounted() {
    this.getItemList();
  }
};
</script>