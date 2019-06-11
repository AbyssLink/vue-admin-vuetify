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
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

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
    };
  },
  created: () => {},
  methods: {
    switchPage(page) {
      window.location.href = page + ".html";
    },
    getItemList() {
      Vue.prototype.$http
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