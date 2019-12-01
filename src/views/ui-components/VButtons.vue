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
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

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
      }
    };
  },
  methods: {
    createItem() {
      Vue.prototype.$http
        .post("/item/create", this.itemInfo)
        .then(response => {
          if (response.data.ok == true) {
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
        });
    }
  }
};
</script>