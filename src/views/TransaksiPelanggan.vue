<template>
  <v-container
    id="pegawai-view"
    fluid
    tag="section"
  >
    <v-row
      class="px-3"
      justify="end"
    >
      <app-btn
        medium
        rel="noopener noreferrer"
        :to="'/status-transaksi/'"
      >
        <span>Kelola Status Transaksi</span>
      </app-btn>
    </v-row>

    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-paper-roll-outline"
          icon-small
          title="Pegawai"
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
            :items="dataPegawai"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataPegawai.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.avatar`]="{ item }">
              <v-avatar
                size="45"
              >
                <v-img
                  :src="images + item.picture"
                />
              </v-avatar>
            </template>

            <template v-slot:[`item.deleted_at`]="{ item }">
              <v-chip
                class="ma-2"
                :color="item.deleted_at === null ? 'light-blue darken-3' : 'red accent-3'"
                text-color="white"
              >
                {{ statusShow(item.deleted_at) }}
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
                :color="item.deleted_at === null ? 'red accent-3' : 'light-blue darken-3'"
                class="ma-2 white--text"
                rel="noopener noreferrer"
                @click="dialogOpen('Hapus', item)"
              >
                <v-icon
                  v-if="item.deleted_at === null"
                  left
                >
                  mdi-account-lock-outline
                </v-icon>

                <v-icon
                  v-else
                  left
                >
                  mdi-account-reactivate
                </v-icon>

                <span>
                  {{ statusShowReverse(item.deleted_at) }}kan
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
                {{ action }} Pegawai
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
              Apakah Anda Yakin Ingin {{ statusShowReverse(status) }}kan Data Pegawai {{ form.name }}?
            </v-card-text>

            <v-card-text
              v-else
            >
              <v-row
                justify="center"
                class="mb-2"
              >
                <v-avatar
                  v-if="selectedFile != null || srcImage != null"
                  size="250"
                >
                  <v-img
                    :src="fotoPreview"
                  />
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
                  <span>Upload Foto Pegawai</span>
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
                  :color="status === null ? 'light-blue darken-3' : 'red accent-3'"
                  text-color="white"
                >
                  Pegawai {{ statusShow(status) }}
                </v-chip>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-input
                    v-model="form.name"
                    :rules="nameRules"
                    label="Nama"
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-autocomplete
                    v-model="form.roleId"
                    :items="dataRole"
                    item-text="name"
                    item-value="id"
                    :rules="roleIdRules"
                    label="Role"
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
                    :rules="emailRules"
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
                    :rules="phoneRules"
                    label="No. Telp"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                  lg="3"
                >
                  <app-text-autocomplete
                    v-model="form.gander"
                    :items="dataGander"
                    item-text="name"
                    item-value="id"
                    :rules="ganderRules"
                    label="Jenis Kelamin"
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                  lg="3"
                >
                  <v-menu
                    v-model="dateInput"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    v-bind="$attrs"
                    v-on="$listeners"
                  >
                    <template
                      v-slot:activator="{ on, attrs }"
                    >
                      <v-text-field
                        v-model="form.dateJoin"
                        color="primary"
                        label="Tanggal Bergabung"
                        :rules="dateJoinRules"
                        readonly
                        dense
                        required
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>

                    <v-date-picker
                      v-model="form.dateJoin"
                      @input="dateInput = false"
                    />
                  </v-menu>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-input
                    v-model="form.address"
                    :rules="addressRules"
                    label="Alamat"
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
                color="secondary"
                text
                :loading="loadingButton"
                @click="setForm"
              >
                {{ statusShowReverse(status) }}kan
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
    name: 'PegawaiView',

    data: () => ({
      dialog: false,
      action: null,
      form: {
        email: null,
        name: null,
        gander: null,
        phone: null,
        address: null,
        dateJoin: null,
        roleId: null,
      },
      emailRules: [
        v => !!v || 'Email Harus Diisi',
        (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Format E-mail Tidak Valid',
      ],
      nameRules: [
        v => !!v || 'Nama Harus Diisi',
        v => (v && v.length <= 100) || 'Nama Tidak Boleh Lebih Dari 100 Karakter',
      ],
      ganderRules: [
        v => !!v || 'Jenis Kelamin Harus Diisi',
      ],
      phoneRules: [
        v => !!v || 'No. Telp. Harus Diisi',
        (v) => !v || /^\(?(?:\+62|62|0)(?:\d{2,3})?\)?[ .-]?\d{2,4}[ .-]?\d{2,4}[ .-]?\d{2,4}/.test(v) || 'Format No. Telp. Tidak Valid',
      ],
      addressRules: [
        v => !!v || 'Alamat Harus Diisi',
      ],
      dateJoinRules: [
        v => !!v || 'Tanggal Bergabung Harus Diisi',
      ],
      roleIdRules: [
        v => !!v || 'Role Harus Diisi',
      ],
      dataRole: [],
      dataGander: [
        {
          id: 'man',
          name: 'Pria',
        },
        {
          id: 'woman',
          name: 'Wanita',
        },
      ],
      dateInput: false,
      selectedFile: null,
      isSelecting: false,
      srcImage: null,
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
          text: 'Role',
          value: 'role',
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
          value: 'deleted_at',
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
      dataPegawai: [],
      images: null,
      search: null,
      editDeleteID: null,
      status: null,
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
      fotoPreview () {
        if (this.selectedFile === null && this.action === 'Ubah') {
          return this.images + this.srcImage
        }
        return URL.createObjectURL(this.selectedFile)
      },
    },

    mounted () {
      this.images = this.$file
      this.read()
      this.readRole()
    },

    methods: {
      dialogOpen (action, item) {
        if (action === 'Ubah' || action === 'Hapus') {
          this.editDeleteID = item.id
          this.form.email = item.email
          this.form.name = item.name
          this.form.gander = item.gander
          this.form.phone = item.phone
          this.form.address = item.address
          this.form.dateJoin = item.date_join
          this.form.roleId = item.role_id
          this.srcImage = item.picture
          this.status = item.deleted_at
        }
        this.action = action
        this.dialog = true
      },
      dialogClose () {
        this.dialog = false
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.loadingButton = false
        this.editDeleteID = null
        this.selectedFile = null
        this.srcImage = null
      },
      alert (status, message) {
        this.color = status === 'success' ? 'success' : 'error'
        this.title = status
        this.subtitle = message
        this.snackbar = true
      },
      onButtonClick () {
        this.isSelecting = true
        window.addEventListener('focus', () => {
          this.isSelecting = false
        }, { once: true })
        this.$refs.uploader.click()
      },
      onFileChanged (e) {
        this.selectedFile = e.target.files[0]
      },
      async setForm () {
        let result

        if (this.action === 'Hapus') {
          this.loadingButton = true
          result = await this.apiService.deleteData(this.$http, `employee/${this.editDeleteID}`)

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        } else if (this.$refs.form.validate()) {
          this.loadingButton = true
          const employee = new FormData()
          employee.append('email', this.form.email)
          employee.append('name', this.form.name)
          employee.append('gander', this.form.gander)
          employee.append('phone', this.form.phone)
          employee.append('address', this.form.address)
          employee.append('date_join', this.form.dateJoin)
          employee.append('role_id', this.form.roleId)
          if (this.selectedFile != null) {
            employee.append('picture', this.selectedFile)
          }

          if (this.action === 'Tambah') {
            result = await this.apiService.storeData(this.$http, 'employee', employee)
          } else if (this.action === 'Ubah') {
            result = await this.apiService.storeData(this.$http, `employee/${this.editDeleteID}`, employee)
          }

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        }
      },
      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'employee')
        this.dataPegawai = result.data.data
        this.progressLoading = false
        this.alert(result.data.status, result.data.message)
      },
      async readRole () {
        const result = await this.apiService.getData(this.$http, 'role')
        this.dataRole = result.data.data
      },
      statusShow (item) {
        if (item === null) {
          return 'Aktif'
        }

        return 'Non-Aktif'
      },
      statusShowReverse (item) {
        if (item === null) {
          return 'Non-Aktif'
        }

        return 'Aktif'
      },
    },
  }
</script>
