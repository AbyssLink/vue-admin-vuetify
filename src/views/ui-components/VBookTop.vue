<template>
  <v-app>
    <v-container fluid grid-list-xl>
      <!-- 卡片列表-热门概览 -->
      <v-layout wrap justify-space-around>
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
    </v-container>
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
      items: [],
      music: "",
      isPlaying: false
    };
  },
  created: () => {},
  methods: {
    getItemList() {
      Vue.prototype.$http
        .get("http://127.0.0.1:5000/top")
        .then(response => {
          this.items = response.data.data.recom_result;
          this.message = "获取热门列表成功(｡ì _ í｡)";
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
    }
  },
  computed: {},
  mounted() {
    this.getItemList();
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