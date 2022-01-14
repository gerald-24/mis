<template>
  <v-app id="backgroundCover">
    <v-app-bar app color="primary" dark>
      <h1>MANAGEMENT INFORMATION SYSTEM</h1>
      <v-spacer></v-spacer>
      <v-btn target="_blank" text @click="logout">
        <span class="mr-2">Logout</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="userInfo.uid"
      class="mt-15"
      expand-on-hover
      absolute
      permanent
    >
      <v-list-item @click="gotopage('/myaccount')">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/women/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ userInfo.details.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="gotopage(item.route)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="ml-15">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      drawer: null,
      items: [
        { title: "Home", icon: "mdi-view-dashboard", route: "/" },
        { title: "About", icon: "mdi-information", route: "/about" },
        {
          title: "Residents Info",
          icon: "mdi-account-group",
          route: "/residentsinfo",
        },
        { title: "Organization", icon: "mdi-origin", route: "/organization" },
        {
          title: "Brgy. Properties",
          icon: "mdi-progress-check",
          route: "/brgyproperties",
        },
        { title: "Borrow", icon: "mdi-forum", route: "/borrow" },
        {
          title: "Daily Time Record",
          icon: "mdi-progress-check",
          route: "/dailytimerecord",
        },
        { title: "Services", icon: "mdi-toolbox-outline", route: "/services" },
        // { title: "Mapping", icon: "mdi-forum", route: "/mapping" },
        // { title: "Inventory", icon: "mdi-forum", route: "/inventory" },
        { title: "Reports", icon: "mdi-forum", route: "/reports" },
        // {
        //   title: "Maintenance",
        //   icon: "mdi-wrench-clock",
        //   route: "/maintenance",
        // },
        { title: "Accounts", icon: "mdi-wrench-clock", route: "/accounts" },
      ],
    };
  },
  methods: {
    gotopage(val) {
      //Going to selected page
      this.$router.push(val);
    },
    logout() {
      this.CHANGE_userInfo({});
      this.$router.push("/login");
    },
  },
};
</script>
<style>
#backgroundcardhover {
  background-color: white;
}
#backgroundCover {
  background-image: url("./assets/LogIn.jpg");
  background-size: cover;
  background-repeat: no-repeat !important;
}
#backgroundcardtransparent {
  background-color: transparent;
}
#backgroundcardlogin {
  background: rgba(210, 210, 210, 0.5);
}
.content {
  background: rgba(210, 210, 210, 0.5);
  font-family: Montserrat-Medium;
  width: 100%;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
  overflow-x: hidden;
}
.contentFixHeight {
  width: 100%;
  min-height: calc(100vh - 96px);
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>