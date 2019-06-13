<template>
  <v-data-table :headers="headers" :items="orders" :pagination.sync="pagination" class="elevation-1">
    <template v-slot:items="props">
      <td>{{ props.item.id }}</td>
      <td class="text-xs-left">{{ props.item.itemId }}</td>
      <td class="text-xs-left">{{ props.item.itemPrice }}</td>
      <td class="text-xs-left">{{ props.item.amount }}</td>
      <td class="text-xs-left">{{ props.item.orderPrice }}</td>
    </template>
  </v-data-table>
</template>

 <script>
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

export default {
  data() {
    return {
      drawer: true,
      snackbar: false,
      message: "",
      orderInfo: {
        id: "",
        itemId: "",
        itemPrice: "",
        amount: "",
        orderPrice: ""
      },
      headers: [
        {
          text: "orderId",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "itemId", value: "itemId" },
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
        .get("http://localhost:8088/order/list")
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取订单列表成功";
            this.orders = response.data.data;
            Snackbar.info(this.message);
          } else {
            this.message =
              "获取订单列表失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        })
        .finally(() => {
          // this.snackbar = true;
        });
    }
  },
  mounted() {
    this.getOrderList();
  }
};
</script>