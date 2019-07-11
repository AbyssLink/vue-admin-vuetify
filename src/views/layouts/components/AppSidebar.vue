<template>
  <v-navigation-drawer
    id="sidebar"
    class="blue-grey lighten-5"
    app
    fixed
    width="232"
    v-model="drawer"
    clipped="clipped"
    :temporary="temporary"
    mobile-break-point="400"
    :mini-variant="miniVariant"
  >
    <v-list expand dense>
      <template v-for="(route, index) in routes">
        <template v-if="route.meta && route.meta.hasMulSub">
          <v-list-group
            v-if="roleShow(route)"
            value="true"
            :prepend-icon="route.meta && route.meta.icon"
            :key="index"
          >
            <v-list-tile slot="activator" ripple>
              <v-list-tile-content>
                <v-list-tile-title>{{ generateTitle(route.name) }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              ripple
              v-for="(cRoute, idx) in getFilterRouteChild(route)"
              :to="{ name: cRoute.name }"
              :key="idx"
            >
              <v-list-tile-action>
                <v-icon>{{ cRoute.meta && cRoute.meta.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ generateTitle(cRoute.name, route) }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-else>
          <v-list-tile v-if="roleShow(route)" ripple :to="{ name: route.name }" :key="index">
            <v-list-tile-action>
              <v-icon>{{ route.meta && route.meta.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ generateTitle(route.name) }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from "perfect-scrollbar";
import { fistLowerUpper } from "@/utils/util";

export default {
  name: "AppSidebar",
  // props: [
  //   'drawer',
  // ],
  data() {
    return {
      drawer: this.$vuetify && this.$vuetify.breakpoint.mdAndUp,
      miniVariant: false,
      // miniVariant: true,
      ps: null,
      clipped: true,
      temporary: false
    };
  },
  watch: {
    // eslint-disable-next-line
    "$vuetify.breakpoint"(newVal) {
      this.$emit("changeTemporary", newVal.smAndDown);
      this.temporary = newVal.smAndDown;
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.me
    }),
    routes() {
      const routeName = this.$route.name;
      const { routes } = this.$router.options;

      console.log("---route", routes);

      try {
        for (let i = 0, len = routes.length; i < len; i += 1) {
          if (routes[i].children) {
            let j = routes[i].children.length;
            while (j--) {
              const child = routes[i].children[j];
              console.log("---child", child);
              if (child.children) {
                let k = child.children.length;
                while (k--) {
                  const subChild = child.children[k];
                  if (subChild.meta.hidden === true) {
                    child.children.splice(k, 1); //删除不显示的路由项
                  }
                }
              }
              if (child.name === routeName) {
                return routes[i].children;
              }
            }
          } else if (routes[i].name === routeName) {
            return routes[i];
          }
        }
      } catch (err) {
        console.log(">>>sidebar", err);
      }

      return routes[3].children;
    }
  },
  methods: {
    roleShow(route) {
      // console.log("---route", route);

      // hack, there is no user when logout
      if (!route.meta) {
        return true;
      }

      if (!this.user || route.meta.hidden) {
        return false;
      }
      console.log("route----->role", route);
      const { auth } = route.meta;
      console.log(auth);
      return auth
        ? (!auth.length &&
            !JSON.parse(localStorage.getItem("LOGIN_USER")).thirdPartyId) ||
            auth.includes(
              JSON.parse(localStorage.getItem("LOGIN_USER")).thirdPartyId
            )
        : !auth;
    },
    toggleSidebar() {
      this.drawer = !this.drawer;
    },
    toggleTemporary(val) {
      this.temporary = val;
    },
    generateTitle(title, route) {
      if (
        route &&
        (route.name === "Item" ||
          route.name === "Order" ||
          route.name === "User" ||
          route.name === "Comment" ||
          route.name === "Music" ||
          route.name === "Book")
      ) {
        return title;
      }

      return title ? this.$t(`sidebar.${fistLowerUpper(title)}`) : "";
    },
    getFilterRouteChild: function(route) {
      let i = route.children.length;
      while (i--) {
        if (
          route.children[i].meta.auth &&
          !route.children[i].meta.auth.includes(
            JSON.parse(localStorage.getItem("LOGIN_USER")).thirdPartyId
          )
        ) {
          route.children.splice(i, 1); //删除无权限的路由项
        }
      }
      // console.log(route.children);
      return route.children;
    }
  },
  created() {
    this.$nextTick(() => {
      this.ps = new PerfectScrollbar("#sidebar", {
        suppressScrollX: true
      });
      this.$emit("changeTemporary", this.temporary);
    });
    this.temporary = this.$vuetify && this.$vuetify.breakpoint.smAndDown;
  },
  beforeDestroy() {
    this.ps.destroy();
    this.ps = null;
  },
  mounted() {}
};
</script>
