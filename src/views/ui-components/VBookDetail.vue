<template>
  <v-app>
    <v-container fluid grid-list-xl>
      <!-- 卡片列表-热门概览 -->
      <v-layout wrap justify-space-around>
        <v-flex xs7>
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
        <v-flex xs5>
          <!-- 卡片-评论列表 -->
          <div id="e3" style="max-width: 600px; margin: auto;" class="grey lighten-3">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>评分</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <template>
              <v-flex xs12>
                <v-card class="mx-auto" max-width="550" hover>
                  <v-card-title primary-title>
                    <div>
                      <h3 class="headline mb-0">{{myRating}}</h3>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-list-tile class="grow">
                      <v-list-tile-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="avatar_url"></v-img>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{userName}}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="todo">
                        <v-icon color="red">favorite</v-icon>
                      </v-btn>
                      <v-btn icon @click="todo">
                        <v-icon color="amber accent-2">bookmark</v-icon>
                      </v-btn>
                      <v-btn icon @click="todo">
                        <v-icon color="blue">share</v-icon>
                      </v-btn>
                    </v-list-tile>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </template>
          </div>
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

export default {
  data() {
    return {
      dialog: false,
      message: "",
      rating: 4.5,
      userName: "",
      myRating: "",
      form: {
        userId: "",
        bookId: "",
        score: ""
      },
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
      this.form.userId = this.userId;
      this.form.bookId = this.item.item_id;
      this.form.score = this.rating * 2; // 0～5分制 => 0~10分制
      console.log(this.form);

      Vue.prototype.$http
        .post("/rating/add", this.form)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "评价成功";
            Snackbar.success(this.message);
            this.getRate();
          } else {
            this.message = "评价失败，原因为: " + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
      console.log(this.form);
    },
    getRate() {
      Vue.prototype.$http
        .get("/rating/user/" + this.userId + "/" + this.item.item_id)
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取评分成功";
            this.myRating = "我对这本书的评分: " + response.data.data.score / 2;
            Snackbar.success(this.message);
          } else {
            this.myRating = "还没有对它评分呢🤣, 请点击🌟按钮评分"
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    init() {
      this.$vuetify.theme.primary = "#429635";
      this.userId = JSON.parse(localStorage.getItem("LOGIN_USER")).id;
      this.avatar_url = JSON.parse(
        localStorage.getItem("LOGIN_USER")
      ).avatar_url;
      this.userName = JSON.parse(localStorage.getItem("LOGIN_USER")).id;
      this.getItemDetail();
      this.getRate();
    },
    todo() {
      Snackbar.info("开发中，请等待");
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