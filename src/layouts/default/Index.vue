<template>
  <v-app>
    <default-login v-if="loginView" />

    <div v-else>
      <default-bar />

      <default-drawer />

      <default-view />

      <default-footer />

      <default-settings />
    </div>
  </v-app>
</template>

<script>
  export default {
    name: 'DefaultLayout',

    components: {
      DefaultBar: () => import(
        /* webpackChunkName: "default-app-bar" */
        './AppBar'
      ),
      DefaultDrawer: () => import(
        /* webpackChunkName: "default-drawer" */
        './Drawer'
      ),
      DefaultFooter: () => import(
        /* webpackChunkName: "default-footer" */
        './Footer'
      ),
      DefaultSettings: () => import(
        /* webpackChunkName: "default-settings" */
        './Settings'
      ),
      DefaultView: () => import(
        /* webpackChunkName: "default-view" */
        './View'
      ),
      DefaultLogin: () => import(
        /* webpackChunkName: "default-login" */
        '../../views/Login.vue'
      ),
    },

    computed: {
      loginView () {
        if (this.$route.path === '/login/') {
          return true
        }
        return false
      },
    },
  }
</script>
