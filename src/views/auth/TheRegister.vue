<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn icon large :href="source" target="_blank" slot="activator">
                    <v-icon large>code</v-icon>
                  </v-btn>
                  <span>Source</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="userInfo.telephone"
                    prepend-icon="phone"
                    :rules="commonRules"
                    name="telephone"
                    label="手机号(不需要填真实的手机号！)"
                    type="text"
                  ></v-text-field>
                  <v-layout>
                    <v-flex xs9>
                      <v-text-field
                        v-model="userInfo.otpCode"
                        prepend-icon="notifications_active"
                        name="otpCode"
                        :rules="commonRules"
                        label="验证码"
                        id="otpCode"
                        type="text"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2 align-content-center>
                      <v-btn color="warning" class="white--text" @click="getOtp">获取验证码</v-btn>
                    </v-flex>
                  </v-layout>
                  <v-text-field
                    v-model="userInfo.name"
                    prepend-icon="person"
                    name="name"
                    :rules="commonRules"
                    label="昵称"
                    id="name"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.password"
                    prepend-icon="lock"
                    name="password"
                    :rules="commonRules"
                    label="密码"
                    id="password"
                    type="password"
                  ></v-text-field>
                  <v-select prepend-icon="group" :items="genders" label="性别" v-model="gender"></v-select>
                  <v-text-field
                    v-model="userInfo.age"
                    prepend-icon="cake"
                    name="age"
                    :rules="commonRules"
                    label="年龄"
                    id="age"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.avatar"
                    prepend-icon="face"
                    name="avatar"
                    :rules="commonRules"
                    label="头像(请填入网络图片的 URL 地址)"
                    id="avatar"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="userInfo.invite"
                    prepend-icon="school"
                    name="invite"
                    label="邀请码(如果有你就可以超越人类啦)"
                    id="invite"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="register">注册</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
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
        otpCode: "",
        name: "",
        password: "",
        age: "",
        gender: "",
        avatar: "",
        invite: ""
      },
      genders: ["male", "female"],
      gender: "",
      commonRules: [v => !!v || "This is required"],
      source: "https://github.com/ShiroCheng/spikeproject"
    };
  },
  methods: {
    getOtp() {
      Vue.prototype.$http
        .post("/user/getotp", this.userInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "验证码为: " + response.data.data.message;
            Snackbar.success(this.message);
          } else {
            this.message = "验证码发送失败，原因为" + response.data.data.errMsg;
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
    register() {
      if (this.gender == "male") {
        this.userInfo.gender = 1;
      } else {
        this.userInfo.gender = 2;
      }
      Vue.prototype.$http
        .post("/user/register", this.userInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "注册成功, 正在跳转登陆界面...";
            Snackbar.success(this.message);
            this.$router.push({ name: "Login" });
          } else {
            this.message = "注册失败，原因为" + response.data.data.errMsg;
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
  }
};
</script>