<template>
  <v-app>
    <!-- 列表-全部待办 -->
    <v-card>
      <v-card-title>
        All Todos
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :pagination.sync="pagination"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td class="text-xs-left">
            <v-btn v-if="props.item.status === 1" icon large @click="editItem(props.item)">
              <v-icon color="orange">schedule</v-icon>
            </v-btn>
            <v-btn v-else icon large>
              <v-icon color="teal">check_circle_outline</v-icon>
            </v-btn>
          </td>
          <td>{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.userId }}</td>
          <td class="text-xs-left">{{ props.item.title }}</td>
          <td class="text-xs-left">{{ props.item.content }}</td>
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td class="justify-center layout">
            <v-btn icon large @click.stop="deleteItem(props.item)">
              <v-icon color="red">delete_outline</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <!-- 确认删除对话框 -->
    <v-dialog v-model="dialog" max-width="360">
      <v-card>
        <v-card-title class="headline orange white--text">WARNING</v-card-title>
        <v-card-text class="mb-2 font-weight-light">
          确定删除吗？
          <br />该操作不可恢复
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
      itemInfo: {
        id: "",
        userId: "",
        title: "",
        content: "",
        date: "",
        status: ""
      },
      headers: [
        { text: "status", value: "status" },
        {
          text: "todoId",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "userId", value: "userId" },
        { text: "title", value: "title" },
        { text: "content", value: "content" },
        { text: "date", value: "date" }
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
        .get("/todo/list")
        .then(response => {
          if (response.data.ok == true) {
            this.message = "获取待办列表成功";
            this.items = [];
            for (let item of response.data.data) {
              item.date = item.date.replace("T", "  ");
              item.date = item.date.replace(":00.000+0000", "");
              console.log(item.date);
              this.items.push(item);
            }
            // Snackbar.info(this.message);
          } else {
            this.message =
              "获取待办列表失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    deleteItem(item) {
      this.dialog = true;
      this.itemInfo = item;
    },
    confirmDelete() {
      this.dialog = false;
      // 提交，确认删除
      Vue.prototype.$http
        .get("/todo/delete?id=" + this.itemInfo.id)
        .then(response => {
          if (response.data.ok == true) {
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
      Snackbar.info("开发中，请等待……");
    }
  },
  mounted() {
    this.getItemList();
  }
};
</script>