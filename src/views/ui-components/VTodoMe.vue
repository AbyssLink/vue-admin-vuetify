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
            <v-btn v-else icon large @click="editItem(props.item)">
              <v-icon color="teal">check_circle_outline</v-icon>
            </v-btn>
          </td>
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

    <!-- 创建表单对话框 -->
    <v-dialog v-model="dialog1" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-layout row justify-center>
          <v-btn color="pink" dark v-on="on">Add</v-btn>
        </v-layout>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Todo</span>
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
                  <v-textarea
                    :rules="commonRules"
                    label="content"
                    required
                    v-model="itemInfo.content"
                  ></v-textarea>
                  <v-layout>
                    <v-flex xs12 lg6>
                      <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        full-width
                        max-width="290"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :value="computedDateFormattedMomentjs"
                            clearable
                            label="Formatted with Moment.js"
                            prepend-icon="date_range"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs12 lg6>
                      <v-menu
                        ref="menu"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="time"
                            label="Picker in menu"
                            prepend-icon="access_time"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu2"
                          v-model="time"
                          full-width
                          @click:minute="$refs.menu.save(time)"
                        ></v-time-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
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
  </v-app>
</template>

 <script>
import Vue from "vue";
import moment from "moment";
import Snackbar from "../../components/snackbar/index";
import { userInfo } from "os";

export default {
  data() {
    return {
      dialog: false,
      dialog1: false,
      time: null,
      menu1: false,
      menu2: false,
      message: "",
      search: "",
      date: new Date().toISOString().substr(0, 10),
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
        .get("/todo/listbyuser")
        .then(response => {
          if (response.data.status == "success") {
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
      Vue.prototype.$http
        .get("/todo/changebyid?id=" + item.id)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "更改成功, id = " + item.id;
            if (item.status == 1) {
              item.status = 2;
            } else {
              item.status = 1;
            }
            Snackbar.warning(this.message);
          } else {
            this.message = "更改失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        });
    },
    createItem() {
      this.itemInfo.userId = JSON.parse(localStorage.getItem("LOGIN_USER")).id;
      this.itemInfo.date = this.date + " " + this.time;
      console.log(this.itemInfo);
      this.dialog1 = false;
      Vue.prototype.$http
        .post("/todo/create", this.itemInfo)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "创建待办成功";
            Snackbar.success(this.message);
            this.getItemList();
          } else {
            this.message = "创建待办失败，原因为" + response.data.data.errMsg;
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
  },
  computed: {
    computedDateFormattedMomentjs() {
      return this.date ? moment(this.date).format("dddd, MMMM Do YYYY") : "";
    }
  }
};
</script>