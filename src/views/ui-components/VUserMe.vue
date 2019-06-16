<template>
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
            <img :src="user.avatar">
          </v-avatar>
          <v-text-field class="mt-4" label="USERNAME" :placeholder="user.name"></v-text-field>
          <v-layout>
            <v-flex xs6>
              <v-text-field label="AGE" :placeholder="getString(user.age)"></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field label="GENDER" :placeholder="getString(user.gender)"></v-text-field>
            </v-flex>
          </v-layout>
          <v-text-field label="TELEPHONE" :placeholder="user.telephone"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="white">Cancle</v-btn>
          <v-btn flat color="white">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      display: true,
      user: {}
    };
  },
  methods: {
    getUserInfo() {
      this.user = JSON.parse(localStorage.getItem("LOGIN_USER"));
      console.log(this.user);
    },
    getString(value) {
      return value + "";
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>
