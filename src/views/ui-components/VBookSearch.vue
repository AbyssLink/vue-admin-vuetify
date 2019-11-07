<template>
  <v-app>
    <!-- 搜索框-搜索书本 -->
    <v-layout row justify-center>
      <v-flex xs6>
        <v-text-field
          append-icon="mic"
          class="mx-3"
          flat
          label="输入书名/ID/作者/出版社"
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
      <v-btn icon color="success" @click="changeView">
        <v-icon color="white">cached</v-icon>
      </v-btn>
    </v-layout>
    <v-container fluid grid-list-xl>
      <!-- Progress-bar -->
      <v-layout justify-space-around v-if="loading">
        <v-progress-circular
          style="marginTop:230px"
          :size="150"
          :width="10"
          color="orange"
          indeterminate
        ></v-progress-circular>
      </v-layout>
      <!-- 卡片列表-热门概览 -->
      <v-layout wrap justify-space-around v-if="gridView">
        <v-flex v-for="item in items" :key="item.id">
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
              <v-img :aspect-ratio="15/14" :src="item.img_url_l">
                <v-expand-transition>
                  <div
                    class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                    style="height: 100%;"
                    v-if="hover"
                  >{{item.year}}</div>
                </v-expand-transition>
              </v-img>
              <v-card-text style="position: relative;">
                <div class="font-weight-light grey--text mb-2">{{item.title}}</div>
                <div
                  class="display-1 font-weight-light title orange--text mb-2"
                >{{item.author}}</div>
                <div class="font-weight-light mb-2">
                  Publisher: {{item.publisher}}
                  <br />
                  year: {{item.year}}
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
      <!-- 列表-推荐结果概览 -->
      <v-card v-else>
        <v-card-title>
          All Books
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          :pagination.sync="pagination"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td @click="getItemDetail(props.item)">{{ props.item.id }}</td>
            <td @click="getItemDetail(props.item)">{{ props.item.title }}</td>
            <td>
              <v-avatar size="50" tile style="margin:5px">
                <img :src="props.item.img_url_l" />
              </v-avatar>
            </td>
            <td class="text-xs-left">{{ props.item.author }}</td>
            <td class="text-xs-left">{{ props.item.publisher }}</td>
            <td class="text-xs-left">{{ props.item.year }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
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
      search: "",
      message: "",
      item: {
        item_id: "",
        info: {
          author: "",
          img_l: "",
          publisher: "",
          recom_score: "",
          title: "",
          year: ""
        }
      },
      items: [],
      headers: [
        {
          text: "id",
          align: "left",
          value: "id"
        },
        { text: "title", value: "title" },
        { text: "image", value: "image" },
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
      this.items = [];
      this.loading = true;
      Vue.prototype.$http
        .get("/book/search/" + this.search)
        .then(response => {
          this.loading = false;
          console.log(this.search);
          this.items = response.data.data;
          this.message = "获取热门列表成功(｡ì _ í｡)";
          console.log(this.items);
          Snackbar.success(this.message);
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    getItemDetail(item) {
      this.item.item_id = item.id;
      this.item.info.title = item.title;
      this.item.info.img_l = item.img_url_l;
      this.item.info.author = item.author;
      this.item.info.publisher = item.publisher;
      this.item.info.year = item.year;
      this.$router.push({ name: "图书详情", params: { item: this.item } });
    },
    changeView() {
      Snackbar.warning("列表/网格 视图已切换");
      this.gridView = !this.gridView;
    },
    init() {
      this.$vuetify.theme.primary = "#429635";
    }
  },
  computed: {},
  mounted() {
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