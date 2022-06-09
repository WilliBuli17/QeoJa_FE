<template>
  <v-menu
    bottom
    left
    min-width="200"
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ml-2"
        min-width="0"
        text
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>

    <v-list
      :tile="false"
      flat
      nav
    >
      <template v-for="(p, i) in profile">
        <v-divider
          v-if="p.divider"
          :key="`divider-${i}`"
          class="mb-2 mt-2"
        />

        <app-btn
          v-else-if="p.title === 'Log out'"
          :key="`check-${i}`"
          text
          block
          @click="logout"
        >
          <app-bar-item>
            <v-list-item-title v-text="p.title" />
          </app-bar-item>
        </app-btn>

        <app-btn
          v-else-if="p.title === 'Profil'"
          :key="`item-${i}`"
          text
          block
          @click="profil"
        >
          <app-bar-item>
            <v-list-item-title v-text="p.title" />
          </app-bar-item>
        </app-btn>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
  import ApiService from '../../../service/ApiService'
  export default {
    name: 'DefaultAccount',

    data: () => ({
      apiService: new ApiService(),
      profile: [
        { title: 'Profil' },
        { divider: true },
        { title: 'Log out' },
      ],
    }),

    methods: {
      async logout () {
        this.$emit('load', null)
        const result = await this.apiService.storeData(this.$http, 'logout', null)
        if (result.data.status === 'success') {
          if (sessionStorage.getItem('token')) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('emp')
            sessionStorage.removeItem('role')
          } else if (localStorage.getItem('token')) {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            localStorage.removeItem('emp')
            localStorage.removeItem('role')
          }
          this.$emit('load', null)

          if (this.$route.path !== '/login/') this.$router.push('/login/')
        }
      },

      profil () {
        if (this.$route.path !== '/') this.$router.push('/')
      },
    },
  }
</script>
