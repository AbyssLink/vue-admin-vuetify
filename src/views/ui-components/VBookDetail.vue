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
      item: {},
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
    init() {
      this.$vuetify.theme.primary = "#429635";
    }
  },
  computed: {},
  mounted() {
    this.getItemDetail();
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