<template>
  <v-app>
    <!-- 搜索框-搜索商品 -->
    <v-layout row justify-center>
      <v-flex xs6>
        <v-text-field
          append-icon="mic"
          flat
          label="Search"
          prepend-inner-icon="search"
          v-model="search"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-container fluid grid-list-xl>
      <!-- 卡片列表-商品概览 -->
      <v-layout wrap justify-space-around>
        <v-flex v-for="item in searchData" :key="item.id">
          <v-hover>
            <v-card
              @click.native="getItemDetail(item.id)"
              class="mx-auto"
              color="grey lighten-4"
              min-width="300"
              max-width="380"
              slot-scope="{ hover }"
              hover
            >
              <v-img :aspect-ratio="15/14" :src="item.imgUrl">
                <v-expand-transition>
                  <div
                    class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                    style="height: 100%;"
                    v-if="hover"
                  >{{item.price}} ¥</div>
                </v-expand-transition>
              </v-img>
              <v-card-text style="position: relative;">
                <div class="title font-weight-light orange--text mb-1">{{item.title}}</div>
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
      message: "",
      search: "",
      itemInfo: {
        id: "",
        title: "",
        price: "",
        stock: "",
        description: "",
        sales: "",
        imgUrl: ""
      },
      headers: [
        {
          text: "title",
          align: "left",
          sortable: false,
          value: "title"
        },
        { text: "price (rmb)", value: "price" },
        { text: "stock", value: "stock" },
        { text: "sales", value: "sales" },
        { text: "description", value: "description" }
      ],
      pagination: {
        rowsPerPage: 25 // -1 for All",
      },
      items: [],
      commonRules: [v => !!v || "This is required"]
    };
  },
  created: () => {},
  methods: {
    getItemList() {
      Vue.prototype.$http
        .get("/item/list")
        .then(response => {
          if (response.data.status == "success") {
            this.message = "获取商品列表成功";
            this.items = response.data.data;
            // Snackbar.info(this.message);
          } else {
            this.message =
              "获取商品列表失败，原因为" + response.data.data.errMsg;
            Snackbar.error(this.message);
          }
        })
        .catch(error => {
          Snackbar.error(error);
        });
    },
    getItemDetail(id) {
      this.$router.push({ name: "商品详情", query: { id: id } });
      // window.location.href = "detail?id=" + id;
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