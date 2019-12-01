<template>
  <v-app>
    <!-- 列表-全部用户 -->
    <v-card>
      <v-card-title>
        All Users
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :pagination.sync="pagination"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>
            <v-avatar size="40" style="margin:5px;">
              <img :src="props.item.avatar">
            </v-avatar>
          </td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.telephone }}</td>
          <td class="text-xs-left">{{ props.item.gender }}</td>
          <td class="text-xs-left">{{ props.item.age }}</td>
          <td class="text-xs-left">{{ props.item.thirdPartyId }}</td>
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
    </v-card>
    <!-- 对话框-确认删除 -->
    <v-dialog v-model="dialog" max-width="360">
      <v-card>
        <v-card-title class="headline orange white--text">WARNING</v-card-title>
        <v-card-text class="mb-2 font-weight-light">
          确认删除吗？
          <br>和用户相关的订单将全部删除(相关的评论不会删除)
          <br>该操作不可恢复
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat="flat" @click="dialog = false">Cancle</v-btn>
          <v-btn color="grey darken-1" flat="flat" @click="confirmDelete()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 对话框-添加用户 -->
    <!-- <v-dialog v-model="dialog1" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-layout row justify-center>
          <v-btn color="pink" dark v-on="on">Add</v-btn>
        </v-layout>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Item Information</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-form ref="form">
                  <v-text-field
                    v-model="userInfo.telephone"
                    prepend-icon="phone"
                    :rules="commonRules"
                    name="telephone"
                    label="telephone"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.otpCode"
                    prepend-icon="notifications_active"
                    name="otpCode"
                    :rules="commonRules"
                    label="otpCode"
                    id="otpCode"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.name"
                    prepend-icon="person"
                    name="name"
                    :rules="commonRules"
                    label="name"
                    id="name"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.password"
                    prepend-icon="lock"
                    name="password"
                    :rules="commonRules"
                    label="Password"
                    id="password"
                    type="password"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.gender"
                    prepend-icon="group"
                    name="gender"
                    :rules="commonRules"
                    label="gender"
                    id="gender"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.age"
                    prepend-icon="cake"
                    name="age"
                    :rules="commonRules"
                    label="age"
                    id="age"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.avatar"
                    prepend-icon="face"
                    name="avatar"
                    :rules="commonRules"
                    label="avatar"
                    id="avatar"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat @click="dialog1 = false">Close</v-btn>
          <v-btn color="orange darken-1" flat @click="getOtp">getOtp</v-btn>
          <v-btn color="blue darken-1" flat @click="createItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- 对话框-更新用户信息 -->
    <v-dialog v-model="dialog2" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Item Information</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-form ref="form">
                  <v-text-field
                    v-model="userInfo.name"
                    prepend-icon="person"
                    name="name"
                    :rules="commonRules"
                    label="name"
                    id="name"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.telephone"
                    prepend-icon="phone"
                    :rules="commonRules"
                    name="telephone"
                    label="telephone"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.gender"
                    prepend-icon="group"
                    name="gender"
                    :rules="commonRules"
                    label="gender"
                    id="gender"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.age"
                    prepend-icon="cake"
                    name="age"
                    :rules="commonRules"
                    label="age"
                    id="age"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.avatar"
                    prepend-icon="face"
                    name="avatar"
                    :rules="commonRules"
                    label="avatar"
                    id="avatar"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.thirdPartyId"
                    prepend-icon="accessibility"
                    name="role"
                    disabled
                    :rules="commonRules"
                    label="role"
                    id="role"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat @click="dialog2 = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="confirmEdit">Save</v-btn>
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
      dialog1: false,
      dialog2: false,
      search: "",
      message: "",
      userInfo: {
        id: "",
        name: "",
        telephone: "",
        gender: "",
        age: "",
        avatar: "",
        thirdPartyId: ""
      },
      headers: [
        {
          text: "id",
          align: "left",
          value: "id"
        },
        { text: "avatar", value: "avatar" },
        { text: "name", value: "name" },
        { text: "telephone", value: "telephone" },
        { text: "gender", value: "gender" },
        { text: "age", value: "age" },
        { text: "role", value: "role" }
      ],
      pagination: {
        rowsPerPage: 25 // -1 for All",
      },
      users: [],
      commonRules: [v => !!v || "This is required"],
      actions: {}
    };
  },
  created: () => {},
  methods: {
    getItemList() {
      Vue.prototype.$http
        .get("/user/list")
        .then(response => {
          if (response.data.ok == true) {
            this.message = "获取用户信息成功";
            this.users = response.data.data;
            // Snackbar.info(this.message);
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
        .get("/user/delete?id=" + this.userInfo.id)
        .then(response => {
          if (response.data.ok == true) {
            this.message = "删除成功, id = " + this.userInfo.id;
            this.users.splice(this.users.indexOf(this.userInfo), 1); //删除前端数据对应项
            Snackbar.warning(this.message);
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
      this.dialog2 = true;
      this.userInfo = item;
    },
    confirmEdit() {
      this.dialog2 = false;

      Vue.prototype.$http
        .post("/user/edit", this.userInfo)
        .then(response => {
          if (response.data.ok == true) {
            this.message = "修改用户信息成功, id=" + this.userInfo.id;
            Snackbar.success(this.message);
          } else {
            this.message =
              "修改用户信息失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
          console.log(error);
        });
    },
    getOtp() {
      Vue.prototype.$http
        .post("/user/getotp", this.userInfo)
        .then(response => {
          if (response.data.ok == true) {
            this.message = "otp已发送";
            Snackbar.success(this.message);
          } else {
            this.message = "验证码发送失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    createItem() {
      this.dialog1 = false;

      Vue.prototype.$http
        .post("/user/register", this.userInfo)
        .then(response => {
          if (response.data.ok == true) {
            this.message = "新增用户成功";
            Snackbar.success(this.message);
          } else {
            this.message = "新增用户失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
          Snackbar.error(error);
        })
        .finally(() => {
          //   this.snackbar = true;
        });
    }
  },
  mounted() {
    this.getItemList();
  }
};
</script>