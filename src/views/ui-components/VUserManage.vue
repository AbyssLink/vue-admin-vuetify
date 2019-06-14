<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="users"
      :pagination.sync="pagination"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.telephone }}</td>
        <td class="text-xs-left">{{ props.item.gender }}</td>
        <td class="text-xs-left">{{ props.item.age }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="360">
      <v-card>
        <v-card-title class="headline orange white--text">WARNING</v-card-title>
        <v-card-text class="mb-2 font-weight-light">
          Confirm to delete?
          <br>The related ORDERS will also be deleted.
          <br>Deleted item CANNOT be recovered.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat="flat" @click="dialog = false">Cancle</v-btn>
          <v-btn color="grey darken-1" flat="flat" @click="confirmDelete()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

 <script>
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

export default {
  data() {
    return {
      dialog: false,
      message: "",
      userInfo: {
        name: "",
        telephone: "",
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
      pagination: {
        rowsPerPage: 25 // -1 for All",
      },
      users: []
    };
  },
  created: () => {},
  methods: {
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
    },
    deleteItem(item) {
      this.dialog = true;
      this.userInfo = item;
    },
    confirmDelete() {
      this.dialog = false;

      Vue.prototype.$http
        .get("http://localhost:8088/user/delete?id=" + this.userInfo.id)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "删除成功, id = " + this.userInfo.id;
            this.users.splice(this.users.indexOf(this.userInfo), 1); //删除前端数据对应项
            Snackbar.info(this.message);
          } else {
            this.message = "删除失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        });
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