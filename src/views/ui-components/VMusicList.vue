<template>
  <v-app>
    <!-- 搜索框-搜索歌单 -->
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
    <v-container fluid grid-list-xl>
      <!-- 卡片列表-歌单概览 -->
      <v-layout wrap justify-space-around>
        <v-flex v-for="item in items" :key="item.id">
          <v-hover>
            <v-card
              @click.native="getItemDownloadLink(item.id)"
              class="mx-auto"
              color="grey lighten-4"
              min-width="310"
              max-width="390"
              slot-scope="{ hover }"
              hover
            >
              <v-img :aspect-ratio="15/14" :src="item.al.picUrl">
                <v-expand-transition>
                  <div
                    class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-1 white--text"
                    style="height: 100%;"
                    v-if="hover"
                  >{{item.ar[0].name}}</div>
                </v-expand-transition>
              </v-img>
              <v-card-text style="position: relative;">
                <div class="title font-weight-light orange--text mb-1">{{item.name}}</div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
      <!-- 背景音播放 -->
      <div>
        <audio ref="bgm" :src="music" controls hidden="true"></audio>
      </div>
    </v-container>
    <!-- 帮助提示框 -->
    <v-dialog v-model="dialog" max-width="360">
      <v-card>
        <v-card-title class="headline green white--text">HELP</v-card-title>
        <v-card-text class="mb-2 font-weight-light">
          在网易云音乐的歌单上按右键，复制链接，
          <br />拿去浏览器里打开，地址栏里面可以看到这个歌单的id┌( ಠ_ಠ)┘
          <br />示例1：527370988
          <br />示例2：2866207397
          <br />示例3：522247094
          <br />示例4：2788619489
          <br />示例5：587184039
          <br />示例6：2731351855
          <br />示例7：306397077
          <br />示例8：2550658823
          <br />示例9：2101596106
          <br />示例10：524892096
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
import { setInterval, setTimeout } from "timers";

export default {
  data() {
    return {
      dialog: false,
      message: "",
      search: "",
      items: [],
      music: "",
      isPlaying: false
    };
  },
  created: () => {},
  methods: {
    searchItemList() {
      Vue.prototype.$http
        .get(
          "https://api.imjad.cn/cloudmusic/?type=playlist&id=" + this.search,
          { withCredentials: false }
        )
        .then(response => {
          /*           this.message = "努力获取歌单中，请稍候(｡ì _ í｡)";
          Snackbar.info(this.message); */

          if (Object.keys(response.data.playlist).length != 0) {
            let trackIds = response.data.playlist.trackIds;
            console.log(trackIds);
            for (let i = 0; i < trackIds.length; i++) {
              setTimeout(this.getItemDetail(trackIds[i].id), 1000);
            }
            this.message =
              "获取歌单列表成功(｡ì _ í｡), 点击歌曲卡片就可以获取下载链接啦";
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
      this.items = [];
      Vue.prototype.$http
        .get("https://api.imjad.cn/cloudmusic/?type=detail&id=" + id, {
          withCredentials: false
        })
        .then(response => {
          this.items.push(response.data.songs[0]);
        });
    },
    getItemDownloadLink(id) {
      // Snackbar.info("开发中，请等待");
      Vue.prototype.$http
        .get("https://api.imjad.cn/cloudmusic/?type=song&id=" + id, {
          withCredentials: false
        })
        .then(response => {
          let data = response.data.data;
          console.log(data);
          this.music = data[0].url;
          // this.play();
          window.open(this.music);
        });
    },
    init() {
      this.$vuetify.theme.primary = "#DE2727";
    },
    helpDialog() {
      this.dialog = true;
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