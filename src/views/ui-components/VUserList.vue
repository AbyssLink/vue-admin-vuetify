<template>
  <v-app>
    <!-- 搜索框-搜索用户 -->
    <v-layout row justify-center>
      <v-flex xs6>
        <v-text-field
          append-icon="mic"
          class="mx-3"
          flat
          label="Search"
          prepend-inner-icon="search"
          v-model="search"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <!-- 卡片列表-用户概览 -->
    <v-container fluid grid-list-xl>
      <v-layout row wrap justify-space-around>
        <v-flex v-for="item in searchData" :key="item.id">
          <v-hover>
            <v-card
              dark
              tile
              flat
              class="mx-auto"
              :color="chosedColor"
              hover
              min-width="240"
              max-width="260"
              slot-scope="{ hover }"
            >
              <v-layout column align-center>
                <v-avatar size="120" class="my-3 center">
                  <img :src="item.avatar">
                  <v-expand-transition>
                    <div
                      class="d-flex fade-transition orange darken-2 v-card--reveal headline white--text"
                      style="height: 100%;"
                      v-if="hover"
                    >{{item.thirdPartyId}}</div>
                  </v-expand-transition>
                </v-avatar>
              </v-layout>
              <v-card-text class="headline text-md-center py-0">{{item.name}}</v-card-text>
              <v-card-text class="title font-weight-light text-md-center py-0">{{item.age}}岁</v-card-text>
              <v-card-text class="text-md-center pt-1 pb-4">{{item.telephone}}</v-card-text>
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
      dialog1: false,
      search: "",
      message: "",
      userInfo: {
        name: "",
        telephone: "",
        gender: "",
        age: "",
        avatar: "",
        color: ""
      },
      items: [],
      randomColorItems: [],
      commonRules: [v => !!v || "This is required"],
      actions: {},
      randomColor: [
        "green darken-1",
        "yellow darken-2",
        "cyan darken-3",
        "blue-grey darken-1"
      ],
      chosedColor: ""
    };
  },
  created: () => {},
  methods: {
    getItemList() {
      Vue.prototype.$http
        .get("/user/list")
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取用户信息成功";
            this.items = response.data.data;
            // Snackbar.info(this.message);
          } else {
            this.message =
              "获取用户信息失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.snackbar = true;
        });
    },
    getRandomColor() {
      var index = Math.floor(Math.random() * this.randomColor.length);
      this.chosedColor = this.randomColor[index];
      // this.randomColor.splice(index, 1);
      return this.chosedColor;
    }
  },
  computed: {
    searchData: function() {
      let search = this.search;

      if (search) {
        return this.items.filter(function(item) {
          return Object.keys(item).some(function(key) {
            return (
              String(item[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      }
      return this.items;
    }
  },
  mounted() {
    this.getItemList();
    this.getRandomColor();
  }
};
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  border-radius: 50%;
  bottom: 0;
  justify-content: center;
  opacity: 0.6;
  position: absolute;
  width: 100%;
}
</style>