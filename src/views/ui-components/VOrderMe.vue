<template>
  <v-app>
    <!-- 列表-个人订单 -->
    <v-card>
      <v-card-title>
        My Orders
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="orders"
        :search="search"
        :pagination.sync="pagination"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.item.itemName }}</td>
          <td>
            <v-avatar size="50" tile style="margin:5px">
              <img :src="props.item.itemUrl">
            </v-avatar>
          </td>
          <td class="text-xs-left">{{ props.item.itemPrice }}</td>
          <td class="text-xs-left">{{ props.item.amount }}</td>
          <td class="text-xs-left">{{ props.item.orderPrice }}</td>
          <td class="justify-center layout">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click.stop="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <!-- 对话框-确定删除 -->
    <v-dialog v-model="dialog" max-width="360">
      <v-card>
        <v-card-title class="headline orange white--text">WARNING</v-card-title>
        <v-card-text class="mb-2 font-weight-light">
          确定删除吗？
          <br>该操作不可恢复
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
      search: "",
      orderInfo: {
        id: "",
        itemId: "",
        itemPrice: "",
        amount: "",
        orderPrice: ""
      },
      headers: [
        {
          text: "itemImage",
          align: "left",
          value: "itemUrl"
        },
        { text: "itemName", value: "itemName" },
        { text: "item price (rmb)", value: "itemPrice" },
        { text: "amount", value: "amount" },
        { text: "order price (rmb)", value: "orderPrice" }
      ],
      pagination: {
        rowsPerPage: 25 // -1 for All",
      },
      orders: [],
      commonRules: [v => !!v || "This is required"]
    };
  },
  created: () => {},
  methods: {
    getOrderList() {
      Vue.prototype.$http
        .get(
          "/order/listbyuser?id=" +
            JSON.parse(localStorage.getItem("LOGIN_USER")).id
        )
        .then(response => {
          if (response.data.ok == true) {
            this.message = "获取订单列表成功";
            this.orders = response.data.data;
            // Snackbar.info(this.message);
          } else {
            this.message =
              "获取订单列表失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    deleteItem(item) {
      this.dialog = true;
      this.orderInfo = item;
    },
    confirmDelete() {
      this.dialog = false;
      // 提交，确认删除
      Vue.prototype.$http
        .get("/order/delete?id=" + this.orderInfo.id)
        .then(response => {
          if (response.data.ok == true) {
            this.message = "删除成功, id = " + this.orderInfo.id;
            this.orders.splice(this.orders.indexOf(this.orderInfo), 1); //删除前端数据对应项
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
      Snackbar.info("开发中，请等待……");
    }
  },
  mounted() {
    this.getOrderList();
  }
};
</script>