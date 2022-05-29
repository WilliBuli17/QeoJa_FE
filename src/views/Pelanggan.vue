<template>
  <v-container
    id="pelanggan-view"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-account"
          icon-small
          title="Pelanggan"
          color="primary"
        >
          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="6"
            >
              <app-search v-model="search" />
            </v-col>
          </v-row>

          <div v-if="progressLoading">
            <app-progress-loading />
          </div>

          <v-data-table
            v-else
            :headers="headers"
            :items="dataPelanggan"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataPelanggan.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.avatar`]="{ item }">
              <v-avatar
                size="45"
              >
                <v-img
                  :src="fotoPreview(item.picture)"
                />
              </v-avatar>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                class="ma-2"
                :color="item.deleted_at === null ? 'light-blue darken-3' : 'red accent-3'"
                text-color="white"
              >
                {{ statusShow('Normal', item.deleted_at) }}
              </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <app-btn
                small
                elevation="5"
                class="ma-2 green accent-4"
                rel="noopener noreferrer"
                @click="dialogOpen('Detail', item)"
              >
                <v-icon left>
                  mdi-open-in-new
                </v-icon>
                <span>Detail</span>
              </app-btn>

              <app-btn
                small
                elevation="5"
                :color="item.deleted_at === null ? 'red accent-3' : 'light-blue darken-3'"
                class="ma-2 white--text"
                rel="noopener noreferrer"
                @click="dialogOpen('Hapus', item)"
              >
                <v-icon
                  left
                >
                  {{ item.deleted_at === null ? 'mdi-account-lock-outline' : 'mdi-account-reactivate' }}
                </v-icon>

                <span>
                  {{ statusShow('Reverse', item.deleted_at) }}kan
                </span>
              </app-btn>
            </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      persistent
      :width="action === 'Hapus'? widthBtn : widthDialog"
    >
      <v-card>
        <material-card
          color="primary"
          full-header
        >
          <template #heading>
            <div class="pt-3 pb-2 px-3 white--text">
              <div class="text-h3 font-weight-normal">
                {{ action === 'Hapus'? `${statusShow('Reverse', form.status)}kan` : action }} Pelanggan
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-card-text
              v-if="action === 'Hapus'"
            >
              Apakah Anda Yakin Ingin {{ statusShow('Reverse', form.status) }}kan Data Pelanggan {{ form.name }}?
            </v-card-text>

            <v-card-text
              v-else
            >
              <v-row
                justify="center"
                class="mb-2"
              >
                <v-avatar
                  v-if="form.picture != null"
                  size="250"
                >
                  <v-img
                    :src="fotoPreview(form.picture)"
                  />
                </v-avatar>
              </v-row>

              <v-row
                justify="center"
                class="mb-5"
              >
                <v-chip
                  class="ma-2"
                  :color="form.status === null ? 'light-blue darken-3' : 'red accent-3'"
                  text-color="white"
                >
                  Pelanggan {{ statusShow('Normal', form.status) }}
                </v-chip>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                >
                  <app-text-input
                    v-model="form.name"
                    label="Nama"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-input
                    v-model="form.email"
                    label="Email"
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-input
                    v-model="form.phone"
                    label="No. Telp"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="secondary"
                text
                :loading="loadingButton"
                @click="dialogClose"
              >
                Batal
              </v-btn>

              <v-btn
                v-if="action === 'Hapus'"
                color="secondary"
                text
                :loading="loadingButton"
                @click="setForm"
              >
                {{ `${statusShow('Reverse', form.status)}kan` }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </material-card>
      </v-card>
    </v-dialog>

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
    name: 'PelangganView',

    data: () => ({
      dialog: false,
      action: null,
      form: {
        id: null,
        email: null,
        name: null,
        phone: null,
        picture: null,
        verified: null,
        status: null,
      },
      apiService: new ApiService(),
      color: null,
      title: null,
      subtitle: null,
      snackbar: false,
      multiLine: true,
      headers: [
        {
          text: 'No',
          value: 'index',
          align: 'start',
          sortable: false,
          class: 'primary--text',
        },
        {
          text: 'Avatar',
          value: 'avatar',
          align: 'start',
          sortable: false,
          class: 'primary--text',
        },
        {
          text: 'Nama',
          value: 'name',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Email',
          value: 'email',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Phone',
          value: 'phone',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Status',
          value: 'status',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Action',
          value: 'actions',
          align: 'end',
          sortable: false,
          class: 'primary--text',
        },
      ],
      dataPelanggan: [],
      search: null,
      progressLoading: false,
      loadingButton: false,
    }),

    computed: {
      widthBtn () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '100%'
          case 'sm': return '100%'
          case 'md': return '40%'
          case 'lg': return '25%'
          case 'xl': return '15%'
          default : return '100%'
        }
      },

      widthDialog () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '100%'
          case 'sm': return '90%'
          case 'md': return '80%'
          case 'lg': return '60%'
          case 'xl': return '40%'
          default : return '100%'
        }
      },
    },

    mounted () {
      this.read()
    },

    methods: {
      dialogOpen (action, item) {
        this.form.id = item.id
        this.form.name = item.name
        this.form.email = item.email
        this.form.phone = item.phone
        this.form.picture = item.picture
        this.form.verified = item.email_verified_at
        this.form.status = item.deleted_at
        this.action = action
        this.dialog = true
      },

      dialogClose () {
        this.dialog = false
        Object.keys(this.form).forEach(key => {
          this.form[key] = null
        })
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.loadingButton = false
      },

      alert (status, message) {
        this.color = status === 'success' ? 'success' : 'error'
        this.title = status
        this.subtitle = message
        this.snackbar = true
      },

      async setForm () {
        this.loadingButton = true
        const result = await this.apiService.deleteData(this.$http, `customer/${this.form.id}`)
        this.alert(result.data.status, result.data.message)
        this.read()
        this.dialogClose()
      },

      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'customer')
        this.dataPelanggan = result.data.data
        this.progressLoading = false
        this.alert(result.data.status, result.data.message)
      },

      fotoPreview (source) {
        return this.$file + source
      },

      statusShow (action, item) {
        if (action === 'Normal') {
          return item ? 'Non-Aktif' : 'Aktif'
        } else {
          return item ? 'Aktif' : 'Non-Aktif'
        }
      },
    },
  }
</script>
