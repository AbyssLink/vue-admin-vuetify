<template>
  <v-app>
    <!-- 搜索框-搜索歌单 -->
    <v-container fluid>
      <v-layout row justify-center>
        <v-flex xs6>
          <v-text-field
            append-icon="mic"
            class="mx-3"
            flat
            label="输入歌单id (如何获取请点 ? 按钮)"
            prepend-inner-icon="search"
            solo-inverted
            v-model="search"
          ></v-text-field>
        </v-flex>
        <v-btn icon color="red" @click="searchItemList">
          <v-icon color="white">search</v-icon>
        </v-btn>
        <v-btn icon color="grey darken-2" @click="helpDialog">
          <v-icon color="white">help_outline</v-icon>
        </v-btn>
      </v-layout>
      <!-- 列表-歌单列表 -->
      <v-card>
        <v-data-table
          :headers="headers"
          :items="items"
          :pagination.sync="pagination"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>
              <v-avatar size="50" tile style="margin:5px">
                <img :src="props.item.al.picUrl">
              </v-avatar>
            </td>
            <td class="text-xs-left">{{ props.item.ar[0].id }}</td>
            <td class="text-xs-left">{{ props.item.pop }}</td>
            <td class="text-xs-left">{{ props.item.publishTime }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <!-- 帮助提示框 -->
    <v-dialog v-model="dialog" max-width="360">
      <v-card>
        <v-card-title class="headline green white--text">HELP</v-card-title>
        <v-card-text class="mb-2 font-weight-light">
          在网易云音乐的歌单上按右键，复制链接，
          <br>拿去浏览器里打开，地址栏里面可以看到这个歌单的id┌( ಠ_ಠ)┘
          <br>示例1：527370988
          <br>示例2：2774387110
          <br>示例3：522247094
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat="flat" @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

 <script>
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";
import Axios from "axios";
import { setInterval, setTimeout } from "timers";

Axios.defaults.withCredentials = false; //! 跨域不带cookies
Axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
Axios.defaults.headers.get["Content-Type"] =
  "application/x-www-form-urlencoded";

export default {
  data() {
    return {
      dialog: false,
      search: "",
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
        { text: "title", value: "name" },
        { text: "image", value: "image" },
        { text: "price (rmb)", value: "singer" },
        { text: "stock", value: "pop" },
        { text: "sales", value: "publishTime" }
      ],
      pagination: {
        rowsPerPage: 10 // -1 for All",
      },
      items: [],
      commonRules: [v => !!v || "This is required"],
      actions: {}
    };
  },
  created: () => {},
  methods: {
    searchItemList() {
      Axios.get(
        "https://api.imjad.cn/cloudmusic/?type=playlist&id=" + this.search
      )
        .then(response => {
          if (Object.keys(response.data.playlist).length != 0) {
            let trackIds = response.data.playlist.trackIds;
            console.log(trackIds);
            for (let i = 0; i < trackIds.length; i++) {
              setTimeout(this.getItemDetail(trackIds[i].id), 1000);
            }
            this.message = "获取歌单列表成功(｡ì _ í｡)";
            console.log(this.items);
            Snackbar.success(this.message);
          } else {
            this.message =
              "获取歌单列表失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    getItemDetail(id) {
      Axios.get("https://api.imjad.cn/cloudmusic/?type=detail&id=" + id).then(
        response => {
          this.items.push(response.data.songs[0]);
        }
      );
    },
    init() {
      this.$vuetify.theme.primary = "#DE2727";
    },
    helpDialog() {
      this.dialog = true;
    }
  },
  mounted() {
    this.init();
  },
  destroyed: function() {
    this.$vuetify.theme.primary = "#1976D2";
  }
};
</script>