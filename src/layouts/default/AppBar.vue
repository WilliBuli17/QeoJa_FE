<template>
  <div>
    <v-overlay :value="overlay">
      <app-progress-loading />
    </v-overlay>

    <v-app-bar
      id="default-app-bar"
      app
      absolute
      class="v-bar--underline"
      color="transparent"
      :clipped-left="$vuetify.rtl"
      :clipped-right="!$vuetify.rtl"
      height="70"
      flat
    >
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      />

      <default-drawer-toggle class="hidden-sm-and-down" />

      <v-toolbar-title
        class="font-weight-light text-h5"
        v-text="name"
      />

      <v-spacer />

      <default-account @load="loadOverlay" />
    </v-app-bar>
  </div>
</template>

<script>
  // Utilities
  import { get, sync } from 'vuex-pathify'

  export default {
    name: 'DefaultBar',

    components: {
      DefaultAccount: () => import(
        /* webpackChunkName: "default-account" */
        './widgets/Account'
      ),
      DefaultDrawerToggle: () => import(
        /* webpackChunkName: "default-drawer-toggle" */
        './widgets/DrawerToggle'
      ),
    },

    data: () => ({
      overlay: false,
    }),

    computed: {
      ...sync('app', [
        'drawer',
        'mini',
      ]),
      name: get('route/name'),
    },

    methods: {
      loadOverlay () {
        this.overlay = !this.overlay
      },
    },
  }
</script>
