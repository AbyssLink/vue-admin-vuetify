<template>
  <v-app>
    <!-- 搜索框-搜索用户 -->
    <v-layout row justify-center>
      <v-flex xs6>
        <v-text-field
          append-icon="mic"
          class="mx-3"
          flat
          label="请输入用户id"
          prepend-inner-icon="search"
          solo-inverted
          v-model="userId"
        ></v-text-field>
      </v-flex>
      <v-btn @click="searchItemList" color="info">使用物品协同过滤推荐</v-btn>
      <v-btn @click="searchUserCFItemList" color="warning">使用用户协同过滤推荐</v-btn>
      <v-btn icon color="red darken-2" @click="helpDialog">
        <v-icon color="white">help_outline</v-icon>
      </v-btn>
      <v-btn icon color="success" @click="changeView">
        <v-icon color="white">cached</v-icon>
      </v-btn>
    </v-layout>
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
      <!-- 卡片页-推荐结果概览 -->
      <v-layout wrap justify-space-around v-if="gridView">
        <v-flex v-for="item in items" :key="item.item_id">
          <v-hover>
            <v-card
              @click.native="getItemDetail(item)"
              class="mx-auto"
              color="grey lighten-4"
              min-width="260"
              max-width="300"
              slot-scope="{ hover }"
              hover
            >
              <v-img :aspect-ratio="15/14" :src="item.info.img_l">
                <v-expand-transition>
                  <div
                    class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                    style="height: 100%;"
                    v-if="hover"
                  >{{item.info.recom_score.toFixed(3)}}</div>
                </v-expand-transition>
              </v-img>
              <v-card-text style="position: relative;">
                <div class="font-weight-light grey--text mb-2">{{item.info.title}}</div>
                <div
                  class="display-1 font-weight-light title orange--text mb-2"
                >{{item.info.author}}</div>
                <div class="font-weight-light mb-2">
                  Publisher: {{item.info.publisher}}
                  <br />
                  year: {{item.info.year}}
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>

      <!-- 列表-推荐结果概览 -->
      <v-card v-else>
        <v-card-title>
          All Recoms
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          :pagination.sync="pagination"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td @click="getItemDetail(props.item)">{{ props.item.item_id }}</td>
            <td @click="getItemDetail(props.item)">{{ props.item.info.title }}</td>
            <td>
              <v-avatar size="50" tile style="margin:5px">
                <img :src="props.item.info.img_l" />
              </v-avatar>
            </td>
            <td class="text-xs-left">{{ props.item.info.recom_score.toFixed(3)}}</td>
            <td class="text-xs-left">{{ props.item.info.author }}</td>
            <td class="text-xs-left">{{ props.item.info.publisher }}</td>
            <td class="text-xs-left">{{ props.item.info.year }}</td>
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
      gridView: true,
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
        { text: "title", value: "title" },
        { text: "image", value: "image" },
        { text: "recom_score", value: "recom_score" },
        { text: "author", value: "author" },
        { text: "publisher", value: "publisher" },
        { text: "year", value: "year" }
      ],
      pagination: {
        rowsPerPage: 10 // -1 for All",
      }
    };
  },
  created: () => {},
  methods: {
    searchItemList() {
      if (this.userId === "") {
        Snackbar.warning("请输入用户 id ");
        return null;
      }
      this.items = [];
      this.loading = true;
      Vue.prototype.$http
        .get("http://127.0.0.1:5000/itemcf/recoms/" + this.userId)
        .then(response => {
          this.loading = false;
          this.items = response.data.data.recom_result;
          this.message = "获取推荐列表成功(｡ì _ í｡)";
          console.log(this.items);
          Snackbar.success(this.message);
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    searchUserCFItemList() {
      if (this.userId === "") {
        Snackbar.warning("请输入用户 id ");
        return null;
      }
      this.items = [];
      this.loading = true;
      Vue.prototype.$http
        .get("http://127.0.0.1:5000/usercf/recoms/" + this.userId)
        .then(response => {
          this.loading = false;
          this.items = response.data.data.recom_result;
          this.message = "获取推荐列表成功(｡ì _ í｡)";
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
    // this.getItemList();
    this.init();
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