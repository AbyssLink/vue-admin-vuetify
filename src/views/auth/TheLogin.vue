<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
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
                    prepend-icon="person"
                    :rules="commonRules"
                    name="telephone"
                    label="telephone"
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
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" class="white--text" @click="register">Register</v-btn>
                <v-btn color="primary" @click="login">Login</v-btn>
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
        password: ""
      },
      form: {
        username: "admin",
        password: "admin123"
      },
      commonRules: [v => !!v || "This is required"],
      currentYear: new Date().getFullYear(),
      showPwd: false,
      loginLoading: false,
      source: "https://github.com/ShiroCheng/spikeproject"
    };
  },
  methods: {
    switchPage(page) {
      window.location.href = page + ".html";
    },
    register() {
      window.location.href = "/register";
    },
    login() {
      Vue.prototype.$http
        .post("http://localhost:8088/user/login", this.userInfo)
        .then(response => {
          if (response.data.status == "success") {
            // 存储登陆信息
            this.loginLoading = true;
            this.$store
              .dispatch("login", this.form)
              .then(() => {
                try {
                  this.$router.push({ name: "Index" });
                } catch (err) {
                  this.$router.push({ path: "/" });
                }
              })
              .catch(res => {
                console.log("login-failed", res);
                this.$message({
                  type: "error",
                  text: this.$t("common.invalid_password_username")
                });
              })
              .finally(() => {
                this.loginLoading = false;
              });

            this.message = "登陆成功, 正在跳转页面...";
            Snackbar.success(this.message);
            // 定时跳转页面
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1500);
          } else {
            this.message = "登陆失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
          Snackbar.error(error);
        });
    }
  }
};
</script>
