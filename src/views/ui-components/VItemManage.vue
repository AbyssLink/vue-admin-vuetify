<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td @click="getItemDetail(props.item.id)">{{ props.item.id }}</td>
        <td @click="getItemDetail(props.item.id)">{{ props.item.title }}</td>
        <td>
          <v-avatar size="50" tile style="margin:5px">
            <img :src="props.item.imgUrl">
          </v-avatar>
        </td>
        <td class="text-xs-left">{{ props.item.price }}</td>
        <td class="text-xs-left">{{ props.item.stock }}</td>
        <td class="text-xs-left">{{ props.item.sales }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
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
    <!-- 删除提示框 -->
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
    <!-- 创建商品表单对话框 -->
    <v-dialog v-model="dialog1" persistent max-width="600px">
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
                    :counter="25"
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
          <v-btn color="blue darken-1" flat @click="dialog1 = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="createItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 更新商品表单对话框 -->
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
                    :counter="25"
                    :rules="commonRules"
                    :value="itemInfo.title"
                    label="title"
                    required
                    v-model="itemInfo.title"
                  ></v-text-field>
                  <v-text-field
                    :rules="commonRules"
                    :value="itemInfo.description"
                    label="description"
                    required
                    v-model="itemInfo.description"
                  ></v-text-field>
                  <v-text-field
                    :rules="commonRules"
                    :value="itemInfo.price"
                    label="price"
                    required
                    v-model="itemInfo.price"
                  ></v-text-field>
                  <v-text-field
                    :rules="commonRules"
                    :value="itemInfo.stock"
                    label="stock"
                    required
                    v-model="itemInfo.stock"
                  ></v-text-field>
                  <v-text-field
                    :rules="commonRules"
                    :value="itemInfo.imgUrl"
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
          <v-btn color="blue darken-1" flat @click="dialog2 = false">Close</v-btn>
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
          text: "id",
          align: "left",
          value: "id"
        },
        { text: "title", value: "title" },
        { text: "image", value: "image" },
        { text: "price (rmb)", value: "price" },
        { text: "stock", value: "stock" },
        { text: "sales", value: "sales" },
        { text: "description", value: "description" }
      ],
      pagination: {
        rowsPerPage: 25 // -1 for All",
      },
      items: [],
      commonRules: [v => !!v || "This is required"],
      actions: {}
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
            // Snackbar.info(this.message);
          } else {
            this.message =
              "获取商品列表失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    getItemDetail(id) {
      this.$router.push({ name: "商品详情", query: { id: id } });
      // window.location.href = "detail?id=" + id;
    },
    createItem() {
      this.dialog1 = false;
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
    },
    deleteItem(item) {
      this.dialog = true;
      this.itemInfo = item;
    },
    confirmDelete() {
      this.dialog = false;

      Vue.prototype.$http
        .get("http://localhost:8088/item/delete?id=" + this.itemInfo.id)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "删除成功, id = " + this.itemInfo.id;
            this.items.splice(this.items.indexOf(this.itemInfo), 1); //删除前端数据对应项
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
      this.itemInfo = item;
    },
    confirmEdit() {
      this.dialog2 = false;

      Vue.prototype.$http
        .post("http://localhost:8088/item/edit", this.itemInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "修改商品信息成功, id=" + this.itemInfo.id;
            Snackbar.success(this.message);
          } else {
            this.message =
              "修改商品信息失败，原因为" + response.data.data.errMsg;
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