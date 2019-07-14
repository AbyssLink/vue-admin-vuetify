<template>
  <v-app>
   <!--  <v-layout row justify-center>
      <v-btn icon color="red darken-2" @click="helpDialog">
        <v-icon color="white">help_outline</v-icon>
      </v-btn>
    </v-layout> -->
    <v-container fluid grid-list-xl>
      <!-- Progress-bar -->
      <v-layout justify-space-around v-if="loading">
        <v-progress-circular
          style="marginTop:100px"
          :size="120"
          :width="10"
          color="orange"
          indeterminate
        ></v-progress-circular>
      </v-layout>

      <!-- 列表-推荐结果概览 -->
      <v-card>
        <v-card-title>
          我的评分
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          :pagination.sync="pagination"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-left">{{ props.item.user_id }}</td>
            <td class="text-xs-left">{{ props.item.book_id }}</td>
            <td class="text-xs-left">{{ props.item.score}}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <!-- 帮助提示框 -->
    <v-dialog v-model="dialog" max-width="360">
      <v-card>
        <v-card-title class="headline green white--text">HELP</v-card-title>
        <v-card-text class="mb-2 font-weight-light">
          输入用户 id, 获取推荐结果
          <br />示例1: 265889
          <br />示例2: 275473
          <br />示例3: 254206
          <br />示例4: 242232
          <br />示例5: 248718
          <br />示例6: 242083
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

export default {
  data() {
    return {
      dialog: false,
      loading: false,
      userId: "",
      message: "",
      search: "",
      items: [],
      headers: [
        {
          text: "id",
          align: "left",
          value: "id"
        },
        { text: "user_id", value: "user_id" },
        { text: "book_id", value: "book_id" },
        { text: "score", value: "score" },
      ],
      pagination: {
        rowsPerPage: 10 // -1 for All",
      }
    };
  },
  created: () => {},
  methods: {
    getItemList() {
      this.items = [];
      this.loading = true;
      Vue.prototype.$http
        .get("/rating/me/" + this.userId)
        .then(response => {
          this.loading = false;
          this.items = response.data.data;
          this.message = "获取我的评分列表成功(｡ì _ í｡)";
          console.log(this.items);
          Snackbar.success(this.message);
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    getItemDetail(item) {
      this.$router.push({ name: "图书详情", params: { item: item } });
    },
    init() {
      this.$vuetify.theme.primary = "#429635";
      this.userId = JSON.parse(localStorage.getItem("LOGIN_USER")).id;
      console.log(this.userId);
    },
    helpDialog() {
      this.dialog = true;
    },
    changeView() {
      Snackbar.warning("列表/网格 视图已切换");
      this.gridView = !this.gridView;
    }
  },
  computed: {},
  mounted() {
    this.init();
    this.getItemList();
  },
  destroyed: function() {
    this.$vuetify.theme.primary = "#1976D2";
  }
};
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>