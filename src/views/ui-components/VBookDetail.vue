<template>
  <v-app>
    <v-container fluid grid-list-xl>
      <!-- 卡片列表-热门概览 -->
      <v-layout wrap justify-space-around>
        <v-flex>
          <v-hover>
            <v-card
              class="mx-auto"
              color="grey lighten-4"
              min-width="300"
              max-width="400"
              slot-scope="{ hover }"
              hover
            >
              <v-img :aspect-ratio="9/13" :src="item.info.img_l">
                <v-expand-transition>
                  <div
                    class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                    style="height: 100%;"
                    v-if="hover"
                  >{{item.info.recom_score.toFixed(3)}}</div>
                </v-expand-transition>
              </v-img>
              <v-card-text style="position: relative;">
                <v-btn
                  @click="dialog = true"
                  absolute
                  class="white--text"
                  color="red"
                  fab
                  large
                  right
                  top
                >
                  <v-icon color="yellow">star</v-icon>
                </v-btn>
                <div class="font-weight-light title grey--text mb-2">{{item.info.title}}</div>
                <h3 class="display-3 font-weight-light title orange--text mb-2">{{item.info.author}}</h3>
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
      <!-- 评分对话框 -->
      <v-layout row justify-center>
        <v-dialog v-model="dialog" max-width="300">
          <v-card class="elevation-16 mx-auto" width="300">
            <v-card-title class="headline" primary-title>评价本书</v-card-title>
            <v-card-text>
              如果你阅读过这本书，欢迎花几秒钟评价这本书，这很有用！
              <div class="text-xs-center mt-5">
                <v-rating
                  v-model="rating"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="$vuetify.icons.ratingFull"
                  half-increments
                  hover
                ></v-rating>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-space-between">
              <v-btn flat @click="dialog = false">不，谢谢</v-btn>
              <v-btn color="primary" @click="addRate" flat>提交</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </v-app>
</template>

 <script>
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

function getParam(paramName) {
  // 解析 url 参数, 获取 qurey string
  let paramValue = "";
  let isFound = !1;
  if (
    window.location.search.indexOf("?") == 0 &&
    window.location.search.indexOf("=") > 1
  ) {
    let arrSource;
    let i;
    (arrSource = unescape(window.location.search)
      .substring(1, window.location.search.length)
      .split("&")),
      (i = 0);
    while (i < arrSource.length && !isFound)
      arrSource[i].indexOf("=") > 0 &&
        arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() &&
        ((paramValue = arrSource[i].split("=")[1]), (isFound = !0)),
        i++;
  }
  return paramValue == "" && (paramValue = null), paramValue;
}

export default {
  data() {
    return {
      dialog: false,
      message: "",
      rating: 4.5,
      item: {
        item_id: "",
        info: {
          author: "",
          img_l: "",
          publisher: "",
          recom_score: "",
          title: "",
          year: "",
          item_id: ""
        }
      },
      music: "",
      isPlaying: false
    };
  },
  created: () => {},
  methods: {
    getItemDetail() {
      this.item = this.$route.params.item;
      console.log(this.item);
    },
    addRate() {
      this.dialog = false;
      console.log(this.rating);
    },
    init() {
      this.getItemDetail();
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