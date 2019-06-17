<template>
  <!-- 卡片-用户个人信息 -->
  <v-container>
    <v-layout align-center justify-center>
      <v-card class="elevation-24" v-if="display" max-width="474" color="primary">
        <v-card-title class="headline pl-5 pt-4 white--text">个人信息</v-card-title>
        <v-card-text></v-card-text>
        <v-card-text
          class="elevation-24"
          style="background:white;width:456px;margin-left:56px;padding:34px;"
        >
          <v-avatar size="85" class="mb-3" style="margin-top:-60px">
            <img :src="userInfo.avatar">
          </v-avatar>
          <v-text-field
            class="mt-4"
            label="USERNAME"
            :value="userInfo.name"
            v-model="userInfo.name"
          ></v-text-field>
          <v-layout>
            <v-flex xs6>
              <v-text-field label="AGE" :value="userInfo.age" v-model="userInfo.age"></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field label="GENDER" :value="userInfo.gender" v-model="userInfo.gender"></v-text-field>
            </v-flex>
          </v-layout>
          <v-text-field label="TELEPHONE" :value="userInfo.telephone" v-model="userInfo.telephone"></v-text-field>
          <v-text-field label="AVATAR" :value="userInfo.avatar" v-model="userInfo.avatar"></v-text-field>
          <v-text-field
            label="ROLE"
            disabled
            :value="user.thirdPartyId"
            v-model="userInfo.thirdPartyId"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="white">Cancle</v-btn>
          <v-btn flat color="white" @click="editUserInfo">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

export default {
  data() {
    return {
      display: true,
      user: {},
      userInfo: {
        id: "",
        name: "",
        age: "",
        gender: "",
        telephone: "",
        avatar: ""
      }
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = JSON.parse(localStorage.getItem("LOGIN_USER"));
      console.log(this.user);
    },
    editUserInfo() {
      Vue.prototype.$http
        .post("http://localhost:8088/user/edit", this.userInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "保存个人信息成功";
            Snackbar.success(this.message);
          } else {
            this.message =
              "保存个人信息失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
          console.log(error);
        });
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>
