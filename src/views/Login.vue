<template>
  <v-container
    class="fill-height hero-section"
    fluid
  >
    <v-row
      class="fill-height"
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
      >
        <v-card class="elevation-6">
          <v-row
            class="fill-height px-3"
            align="center"
            justify="center"
          >
            <v-col
              cols="12"
              md="6"
            >
              <v-card-text class="mt-12">
                <h1 class="text-center">
                  Log in
                </h1>

                <v-row
                  align="center"
                  justify="center"
                >
                  <v-col
                    class="mt-16"
                    cols="12"
                    sm="8"
                  >
                    <v-form
                      ref="form"
                      lazy-validation
                    >
                      <app-text-input
                        v-model="form.email"
                        class="my-5"
                        :rules="emailRules"
                        label="Email"
                      />

                      <app-text-input
                        v-model="form.password"
                        class="my-5"
                        :rules="passwordRules"
                        label="Password"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                      />

                      <v-row class="my-5">
                        <v-col cols="12">
                          <v-checkbox
                            v-model="checkbox"
                            label="Selalu Log In"
                            class="mt-n1"
                            color="primary"
                          />
                        </v-col>
                      </v-row>

                      <v-btn
                        class="my-5"
                        color="primary"
                        dark
                        block
                        :loading="loadingButton"
                        @click="setForm()"
                      >
                        Log in
                      </v-btn>
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-col>

            <v-col
              cols="12"
              md="6"
              class="primary"
            >
              <div style="text-align: center; padding: 165px 0">
                <v-card-text class="white--text">
                  <v-avatar
                    class="mb-6"
                    color="grey lighten-3"
                    size="250"
                  >
                    <img
                      src="../assets/logo.png"
                      alt=""
                    >
                  </v-avatar>

                  <h1 class="text-center">
                    Selamat Datang di QeoJa
                  </h1>

                  <h4 class="text-center mt-3 font-weight-light">
                    Layanan Distibutor Barang Kelontong<br>
                    Terpercaya di NTT
                  </h4>
                </v-card-text>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <app-snackalertbar
      v-model="snackbar"
      :color="color"
      :title="title"
      :subtitle="subtitle"
      :multi-line="multiLine"
    />
  </v-container>
</template>

<script>
  import ApiService from '../service/ApiService'

  export default {
    name: 'LoginView',

    data: () => ({
      form: {
        email: null,
        password: null,
      },
      emailRules: [
        (v) => !!v || 'Email Harus Diisi',
        (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Format E-mail Tidak Valid',
      ],
      passwordRules: [
        (v) => !!v || 'Password Harus Diisi',
        (v) => (v && v.length >= 8) || 'Password Minimal 8 Karakter',
      ],
      show: false,
      apiService: new ApiService(),
      color: null,
      title: null,
      subtitle: null,
      snackbar: false,
      multiLine: true,
      loadingButton: false,
      checkbox: false,
    }),

    methods: {
      alert (status, message) {
        this.color = status === 'success' ? 'success' : 'error'
        this.title = status
        this.subtitle = message
        this.snackbar = true
      },

      async setForm () {
        if (this.$refs.form.validate()) {
          this.loadingButton = true

          const user = new FormData()
          user.append('reference', 'employee')
          user.append('email', this.form.email)
          user.append('password', this.form.password)

          const result = await this.apiService.storeData(this.$http, 'login', user)

          if (result.data.status === 'success') {
            if (this.checkbox === true) {
              localStorage.setItem('user', result.data.data)
              localStorage.setItem('token', result.data.access_token)
            } else {
              sessionStorage.setItem('user', result.data.data)
              sessionStorage.setItem('token', result.data.access_token)
            }

            this.$router.push('/')
          }

          this.alert(result.data.status, result.data.message)
          this.refreshForm()
        }
      },

      refreshForm () {
        Object.keys(this.form).forEach((key) => {
          this.form[key] = null
        })
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.loadingButton = false
      },
    },
  }
</script>

<style scoped>
.hero-section {
  background-image: url("../assets/header-bg.png");
  background-size: cover;
}
</style>
