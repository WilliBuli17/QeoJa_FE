<template>
  <v-container
    id="kategori-view"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-archive-outline"
          icon-small
          title="Kategori"
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

            <v-col
              class="px-7 text-right"
              cols="12"
              sm="12"
              md="6"
              lg="6"
            >
              <app-btn
                small
                :class="$vuetify.breakpoint.mdAndUp ? 'mt-4' : 'mt-n10'"
                rel="noopener noreferrer"
                :width="widthBtn"
                @click="dialogOpen('Tambah', null)"
              >
                <span>Tambah Data</span>
              </app-btn>
            </v-col>
          </v-row>

          <div v-if="progressLoading">
            <app-progress-loading />
          </div>

          <v-data-table
            v-else
            :headers="headers"
            :items="dataKategori"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataKategori.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <app-btn
                small
                elevation="5"
                class="ma-2 green accent-4"
                rel="noopener noreferrer"
                @click="dialogOpen('Ubah', item)"
              >
                <v-icon left>
                  mdi-pencil-outline
                </v-icon>
                <span>Ubah</span>
              </app-btn>

              <app-btn
                small
                elevation="5"
                class="ma-2 red accent-3"
                rel="noopener noreferrer"
                @click="dialogOpen('Hapus', item)"
              >
                <v-icon left>
                  mdi-delete-variant
                </v-icon>
                <span>Hapus</span>
              </app-btn>
            </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      persistent
      :width="widthDialog"
    >
      <v-card>
        <material-card
          color="primary"
          full-header
        >
          <template #heading>
            <div class="pt-3 pb-2 px-3 white--text">
              <div class="text-h3 font-weight-normal">
                {{ action }} Kategori
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-card-text v-if="action === 'Hapus'">
              Apakah Anda Yakin Ingin Menghapus Data Kategori {{ form.name }}?
            </v-card-text>

            <v-card-text v-else>
              <app-text-input
                v-model="form.name"
                :rules="nameRules"
                label="Nama"
              />
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <app-btn
                text
                :loading="loadingButton"
                @click="dialogClose"
              >
                Batal
              </app-btn>

              <app-btn
                text
                :loading="loadingButton"
                @click="setForm"
              >
                {{ action }}
              </app-btn>
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
    name: 'KategoriView',

    data: () => ({
      dialog: false,
      action: null,
      form: {
        id: null,
        name: null,
      },
      nameRules: [
        (v) => !!v || 'Nama Harus Diisi',
        (v) => (v && v.length <= 100) || 'Nama Tidak Boleh Lebih Dari 100 Karakter',
      ],
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
          text: 'Nama',
          value: 'name',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Aksi',
          value: 'actions',
          align: 'end',
          sortable: true,
          class: 'primary--text',
        },
      ],
      dataKategori: [],
      search: null,
      progressLoading: false,
      loadingButton: false,
    }),

    computed: {
      widthBtn () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return '100%'
          case 'sm':
            return '100%'
          case 'md':
            return '50%'
          case 'lg':
            return '40%'
          case 'xl':
            return '30%'
          default:
            return '100%'
        }
      },

      widthDialog () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return '100%'
          case 'sm':
            return '100%'
          case 'md':
            return '50%'
          case 'lg':
            return '40%'
          case 'xl':
            return '30%'
          default:
            return '100%'
        }
      },
    },

    mounted () {
      this.read()
    },

    methods: {
      dialogOpen (action, item) {
        if (action === 'Ubah' || action === 'Hapus') {
          this.form.id = item.id
          this.form.name = item.name
        }
        this.action = action
        this.dialog = true
      },

      dialogClose () {
        this.dialog = false
        Object.keys(this.form).forEach((key) => {
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
        let result

        if (this.action === 'Hapus') {
          this.loadingButton = true
          result = await this.apiService.deleteData(this.$http, `category/${this.form.id}`)

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        } else if (this.$refs.form.validate()) {
          this.loadingButton = true
          if (this.action === 'Tambah') {
            const kategori = new FormData()
            kategori.append('name', this.form.name)
            result = await this.apiService.storeData(this.$http, 'category', kategori)
          } else if (this.action === 'Ubah') {
            const newData = {
              name: this.form.name,
            }
            result = await this.apiService.updateData(this.$http, `category/${this.form.id}`, newData)
          }

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        }
      },

      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'category')
        this.dataKategori = result.data.data
        this.progressLoading = false
        this.alert(result.data.status, result.data.message)
      },
    },
  }
</script>
