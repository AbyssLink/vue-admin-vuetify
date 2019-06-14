<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap justify-space-around>
      <v-flex v-for="item in items" :key="item.id">
        <v-hover>
          <v-card
            @click.native="getItemDetail(item.id)"
            class="mx-auto"
            color="grey lighten-4"
            min-width="160"
            max-width="250"
            slot-scope="{ hover }"
            hover
          >
            <v-img :aspect-ratio="15/14" :src="item.avatar">
              <v-expand-transition>
                <div
                  class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-1 white--text"
                  style="height: 100%;"
                  v-if="hover"
                >{{item.name}}</div>
              </v-expand-transition>
            </v-img>
            <v-card-text style="position: relative;">
              <div class="title font-weight-light orange--text mb-1">{{item.telephone}}</div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

 <script>
import Vue from "vue";
import Snackbar from "../../components/snackbar/index";

export default {
  data() {
    return {
      dialog: false,
      dialog1: false,
      message: "",
      userInfo: {
        name: "",
        telephone: "",
        gender: "",
        age: "",
        avatar: ""
      },
      headers: [
        {
          text: "name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "telephone", value: "telephone" },
        { text: "gender", value: "gender" },
        { text: "age", value: "age" }
      ],
      pagination: {
        rowsPerPage: 25 // -1 for All",
      },
      items: [],
      commonRules: [v => !!v || "This is required"],
      actions: {}
    };
  },
  created: () => {},
  methods: {
    getItemList() {
      Vue.prototype.$http
        .get("http://localhost:8088/user/list")
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取用户信息成功";
            this.items = response.data.data;
            Snackbar.info(this.message);
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
    }
  },
  mounted() {
    this.getItemList();
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