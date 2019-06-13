<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td @click="getItemDetail(props.item.id)">{{ props.item.title }}</td>
        <td class="text-xs-left">{{ props.item.price }}</td>
        <td class="text-xs-left">{{ props.item.stock }}</td>
        <td class="text-xs-left">{{ props.item.sales }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" persistent max-width="600px">
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
                    :counter="11"
                    :rules="commonRules"
                    label="title"
                    required
                    v-model="itemInfo.title"
                  ></v-text-field>
                  <v-text-field
                    :rules="commonRules"
                    label="description"
                    required
                    v-model="itemInfo.description"
                  ></v-text-field>
                  <v-text-field
                    :rules="commonRules"
                    label="price"
                    required
                    v-model="itemInfo.price"
                  ></v-text-field>
                  <v-text-field
                    :rules="commonRules"
                    label="stock"
                    required
                    v-model="itemInfo.stock"
                  ></v-text-field>
                  <v-text-field
                    :rules="commonRules"
                    label="imgUrl"
                    required
                    v-model="itemInfo.imgUrl"
                  ></v-text-field>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="createItem">Save</v-btn>
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
      pagination: {
        rowsPerPage: 25 // -1 for All",
      },
      items: [],
      commonRules: [v => !!v || "This is required"]
    };
  },
  created: () => {},
  methods: {
    getItemList() {
      Vue.prototype.$http
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
    },
    createItem() {
      this.dialog = false;
      Vue.prototype.$http
        .post("http://localhost:8088/item/create", this.itemInfo)
        .then(response => {
          if (response.data.status == "success") {
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
  },
  mounted() {
    this.getItemList();
  }
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
/* #v-btn-add {
  margin: 0px 0px 80px 20px;
} */
</style>