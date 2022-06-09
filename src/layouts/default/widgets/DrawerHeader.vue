<template>
  <v-list-item class="mb-0 justify-space-between pl-3">
    <v-list-item-avatar>
      <v-avatar
        color="grey lighten-3"
        size="40"
      >
        <img
          src="../../../assets/logo.png"
          alt=""
        >
      </v-avatar>
    </v-list-item-avatar>

    <v-list-item-content class="pl-10">
      <v-list-item-title class="text-h3">
        <strong class="mr-1 font-weight-black">Qeo</strong>

        <span class="primary--text">Ja</span>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  // Utilities
  import { get } from 'vuex-pathify'

  export default {
    name: 'DefaultDrawerHeader',

    computed: { version: get('app/version') },
  }
</script>
