<template>
  <v-container
    id="  truk-ekspedisi-view"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-truck-cargo-container"
          icon-small
          title="Truk Ekspedisi"
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
                medium
                :class="$vuetify.breakpoint.mdAndUp ? 'mt-4' : 'mt-n10'"
                rel="noopener noreferrer"
                :width="width"
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
            :items="dataTrukEkspedisi"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataTrukEkspedisi.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.avatar`]="{ item }">
              <v-avatar size="45">
                <v-img :src="fotoPreview(item.picture)" />
              </v-avatar>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                class="ma-2"
                :color="item.status === 'available' ? 'light-blue darken-3' : 'red accent-3'"
                text-color="white"
              >
                {{ statusShow(item.status) }}
              </v-chip>
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
      :width="width"
    >
      <v-card>
        <material-card
          color="primary"
          full-header
        >
          <template #heading>
            <div class="pt-3 pb-2 px-3 white--text">
              <div class="text-h3 font-weight-normal">
                {{ action }} Truk Ekspedisi
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-card-text v-if="action === 'Hapus'">
              Apakah Anda Yakin Ingin Menghapus Data Truk Ekspedisi {{ form.licenseId }}?
            </v-card-text>

            <v-card-text v-else>
              <v-row
                justify="center"
                class="mb-2"
              >
                <v-avatar
                  v-if="selectedFile != null || form.picture != null"
                  size="250"
                >
                  <v-img :src="fotoPreview(form.picture)" />
                </v-avatar>
              </v-row>

              <v-row
                justify="center"
                class="mb-5"
              >
                <app-btn
                  small
                  rel="noopener noreferrer"
                  width="auto"
                  :loading="isSelecting"
                  @click="onButtonClick"
                >
                  <v-icon left>
                    mdi-image-edit-outline
                  </v-icon>
                  <span>Upload Foto Truk Ekspedisi</span>
                </app-btn>

                <input
                  ref="uploader"
                  class="d-none"
                  type="file"
                  accept="image/*"
                  @change="onFileChanged"
                >
              </v-row>

              <v-row
                v-if="action === 'Ubah'"
                justify="center"
                class="mb-5"
              >
                <v-chip
                  class="ma-2"
                  :color="form.status === 'available' ? 'light-blue darken-3' : 'red accent-3'"
                  text-color="white"
                >
                  Truk Ekspedisi {{ statusShow(form.status) }}
                </v-chip>
              </v-row>

              <app-text-input
                v-model="form.licenseId"
                :rules="licenseIdRules"
                label="No. Plat"
              />

              <app-text-input
                v-model="form.minVolume"
                :rules="minVolumeRules"
                label="Min. Volume"
              />

              <app-text-input
                v-model="form.maxVolume"
                :rules="maxVolumeRules"
                label="Maks. Volume"
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
    name: 'TrukEkspedisiView',

    data: () => ({
      dialog: false,
      action: null,
      form: {
        id: null,
        licenseId: null,
        minVolume: null,
        maxVolume: null,
        status: null,
        picture: null,
      },
      licenseIdRules: [(v) => !!v || 'No. Plat Harus Diisi'],
      minVolumeRules: [
        (v) => !!v || 'Minimal Volume Harus Diisi',
        (v) => (v && v > 0) || 'Minimal Volume Tidak Boleh Lebih Kecil Dari 0',
        (v) => !v || /^[1-9]\d*$/.test(v) || 'Format Minimal Volume  Tidak Valid',
      ],
      maxVolumeRules: [
        (v) => !!v || 'Maksimal Volume Harus Diisi',
        (v) => !v || /^[1-9]\d*$/.test(v) || 'Format Maksimal Volume  Tidak Valid',
      ],
      dateInput: false,
      selectedFile: null,
      isSelecting: false,
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
          text: 'No. Plat',
          value: 'license_id',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Min. Volume',
          value: 'min_volume',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Maks. Volume',
          value: 'max_volume',
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
      dataTrukEkspedisi: [],
      search: null,
      progressLoading: false,
      loadingButton: false,
    }),

    computed: {
      width () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return '100%'
          case 'sm':
            return '100%'
          case 'md':
            return '40%'
          case 'lg':
            return '25%'
          case 'xl':
            return '15%'
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
          this.form.licenseId = item.license_id
          this.form.minVolume = item.min_volume
          this.form.maxVolume = item.max_volume
          this.form.picture = item.picture
          this.form.status = item.status
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
        this.selectedFile = null
      },

      alert (status, message) {
        this.color = status === 'success' ? 'success' : 'error'
        this.title = status
        this.subtitle = message
        this.snackbar = true
      },

      onButtonClick () {
        this.isSelecting = true
        window.addEventListener(
          'focus',
          () => {
            this.isSelecting = false
          },
          { once: true },
        )
        this.$refs.uploader.click()
      },

      onFileChanged (e) {
        this.selectedFile = e.target.files[0]
      },

      async setForm () {
        let result

        if (this.action === 'Hapus') {
          this.loadingButton = true
          result = await this.apiService.deleteData(this.$http, `expeditionTruck/${this.form.id}`)

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        } else if (this.$refs.form.validate()) {
          this.loadingButton = true
          const expeditionTruck = new FormData()
          expeditionTruck.append('license_id', this.form.licenseId)
          expeditionTruck.append('min_volume', this.form.minVolume)
          expeditionTruck.append('max_volume', this.form.maxVolume)
          if (this.selectedFile != null) {
            expeditionTruck.append('picture', this.selectedFile)
          }

          if (this.action === 'Tambah') {
            result = await this.apiService.storeData(this.$http, 'expeditionTruck', expeditionTruck)
          } else if (this.action === 'Ubah') {
            result = await this.apiService.storeData(this.$http, `expeditionTruck/${this.form.id}`, expeditionTruck)
          }

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        }
      },

      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'expeditionTruck')
        this.dataTrukEkspedisi = result.data.data
        this.progressLoading = false
        this.alert(result.data.status, result.data.message)
      },

      fotoPreview (source) {
        if (this.selectedFile === null) {
          return this.$file + source
        }

        return URL.createObjectURL(this.selectedFile)
      },

      statusShow (item) {
        return item === 'available' ? 'Aktif' : 'Non-Aktif'
      },
    },
  }
</script>
