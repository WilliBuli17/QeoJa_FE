<template>
  <v-container
    id="produk-view"
    fluid
    tag="section"
  >
    <v-row
      class="px-3"
      justify="end"
    >
      <app-btn
        v-for="menu in subMenu"
        :key="menu.name"
        class="ma-1"
        medium
        rel="noopener noreferrer"
        :to="menu.to"
      >
        <span>Kelola {{ menu.name }}</span>
      </app-btn>
    </v-row>

    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-archive-outline"
          icon-small
          title="Produk"
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
            :items="dataProduk"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataProduk.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.avatar`]="{ item }">
              <v-avatar size="45">
                <v-img :src="fotoPreview(item.picture)" />
              </v-avatar>
            </template>

            <template v-slot:[`item.price`]="{ item }">
              Rp. {{ formatExample(item.price) }}
            </template>

            <template v-slot:[`item.stock_quantity`]="{ item }">
              <v-chip
                class="ma-2"
                :color="colorRanges(item.stock_quantity)"
                text-color="white"
              >
                {{ item.stock_quantity }}
              </v-chip>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                class="ma-2"
                :color="item.deleted_at === null ? 'light-blue darken-3' : 'red accent-3'"
                text-color="white"
              >
                {{ statusShow("Normal", item.deleted_at) }}
              </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <app-btn
                v-if="item.deleted_at === null"
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
                <v-icon left>
                  {{ item.deleted_at === null ? "mdi-archive-cancel-outline" : "mdi-refresh" }}
                </v-icon>
                <span>
                  {{ statusShow("Reverse", item.deleted_at) }}
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
      :width="action === 'Hapus' ? widthBtn : widthDialog"
    >
      <v-card>
        <material-card
          color="primary"
          full-header
        >
          <template #heading>
            <div class="pt-3 pb-2 px-3 white--text">
              <div class="text-h3 font-weight-normal">
                {{ action === "Hapus" ? statusShow("Reverse", form.status) : action }} Produk
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-card-text v-if="action === 'Hapus'">
              Apakah Anda Yakin Ingin {{ statusShow("Reverse", form.status) }} Data Produk {{ form.name }}?
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
                  <span>Upload Foto Produk</span>
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
                  :color="form.status === null ? 'light-blue darken-3' : 'red accent-3'"
                  text-color="white"
                >
                  Produk {{ statusShow("Normal", form.status) }}
                </v-chip>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                >
                  <app-text-input
                    v-model="form.name"
                    :rules="nameRules"
                    label="Nama"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                >
                  <app-text-input
                    v-model="form.description"
                    :rules="descriptionRules"
                    label="Deskripsi"
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
                  <app-text-autocomplete
                    v-model="form.categoryId"
                    :items="dataKategori"
                    item-text="name"
                    item-value="id"
                    :rules="categoryIdRules"
                    label="Kategori"
                  />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-autocomplete
                    v-model="form.suplierId"
                    :items="dataSupplier"
                    item-text="name"
                    item-value="id"
                    :rules="suplierIdRules"
                    label="Supplier"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  :sm="action === 'Ubah' ? 3 : 4"
                  :md="action === 'Ubah' ? 3 : 4"
                  :lg="action === 'Ubah' ? 3 : 4"
                >
                  <app-text-input
                    v-model="form.volume"
                    :rules="volumeRules"
                    label="Volume"
                  />
                </v-col>

                <v-col
                  cols="12"
                  :sm="action === 'Ubah' ? 3 : 4"
                  :md="action === 'Ubah' ? 3 : 4"
                  :lg="action === 'Ubah' ? 3 : 4"
                >
                  <app-text-input
                    v-model="form.unit"
                    :rules="unitRules"
                    label="Satuan"
                  />
                </v-col>

                <v-col
                  v-if="action === 'Ubah'"
                  cols="12"
                  :sm="action === 'Ubah' ? 3 : 4"
                  :md="action === 'Ubah' ? 3 : 4"
                  :lg="action === 'Ubah' ? 3 : 4"
                >
                  <app-text-input
                    v-model="form.stockQuantity"
                    label="Stock"
                    readonly
                  />
                </v-col>

                <v-col
                  cols="12"
                  :sm="action === 'Ubah' ? 3 : 4"
                  :md="action === 'Ubah' ? 3 : 4"
                  :lg="action === 'Ubah' ? 3 : 4"
                >
                  <app-text-input
                    v-model="form.price"
                    :rules="priceules"
                    prefix="Rp."
                    label="Harga"
                  />
                </v-col>
              </v-row>
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
                {{ action === "Hapus" ? statusShow("Reverse", form.status) : action }}
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
    name: 'ProdukView',

    data: () => ({
      subMenu: [
        {
          name: 'Supplier',
          to: '/supplier/',
        },
        {
          name: 'Kategori',
          to: '/kategori/',
        },
        {
          name: 'Riwayat Produk',
          to: '/riwayat-produk/',
        },
      ],
      dialog: false,
      action: null,
      form: {
        id: null,
        name: null,
        description: null,
        unit: null,
        volume: null,
        price: null,
        stockQuantity: null,
        categoryId: null,
        suplierId: null,
        status: null,
        picture: null,
      },
      nameRules: [
        (v) => !!v || 'Nama Harus Diisi',
        (v) => (v && v.length <= 100) || 'Nama Tidak Boleh Lebih Dari 100 Karakter',
      ],
      descriptionRules: [(v) => !!v || 'Deskripsi Harus Diisi'],
      unitRules: [(v) => !!v || 'Satuan Kelamin Harus Diisi'],
      volumeRules: [
        (v) => !!v || 'Volume Harus Diisi',
        (v) => !v || /^[0-9]\d*(\.\d+)?$/.test(v) || 'Format Volume Tidak Valid',
      ],
      priceules: [
        (v) => !!v || 'Harga Harus Diisi',
        (v) => !v || /^[1-9]\d*$/.test(v) || 'Format Harga Tidak Valid',
      ],
      categoryIdRules: [(v) => !!v || 'Kategori Bergabung Harus Diisi'],
      suplierIdRules: [(v) => !!v || 'Supplier Harus Diisi'],
      dataSupplier: [],
      dataKategori: [],
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
          text: 'Nama',
          value: 'name',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Category',
          value: 'category',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Suplier',
          value: 'suplier',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Harga',
          value: 'price',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Stock',
          value: 'stock_quantity',
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
      dataProduk: [],
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
            return '40%'
          case 'lg':
            return '25%'
          case 'xl':
            return '15%'
          default:
            return '100%'
        }
      },

      widthDialog () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return '100%'
          case 'sm':
            return '90%'
          case 'md':
            return '80%'
          case 'lg':
            return '60%'
          case 'xl':
            return '40%'
          default:
            return '100%'
        }
      },
    },

    mounted () {
      this.read()
      this.readSupplier()
      this.readKategori()
    },

    methods: {
      dialogOpen (action, item) {
        if (action === 'Ubah' || action === 'Hapus') {
          this.form.id = item.id
          this.form.name = item.name
          this.form.description = item.description
          this.form.unit = item.unit
          this.form.volume = item.volume
          this.form.price = item.price
          this.form.stockQuantity = item.stock_quantity
          this.form.categoryId = item.category_id
          this.form.suplierId = item.suplier_id
          this.form.picture = item.picture
          this.form.status = item.deleted_at
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
          result = await this.apiService.deleteData(this.$http, `product/${this.form.id}`)

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        } else if (this.$refs.form.validate()) {
          this.loadingButton = true
          const product = new FormData()
          product.append('name', this.form.name)
          product.append('description', this.form.description)
          product.append('unit', this.form.unit)
          product.append('volume', this.form.volume)
          product.append('price', this.form.price)
          product.append('category_id', this.form.categoryId)
          product.append('suplier_id', this.form.suplierId)

          if (this.selectedFile != null) {
            product.append('picture', this.selectedFile)
          }

          if (this.action === 'Tambah') {
            result = await this.apiService.storeData(this.$http, 'product', product)
          } else if (this.action === 'Ubah') {
            result = await this.apiService.storeData(this.$http, `product/${this.form.id}`, product)
          }

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        }
      },

      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'product')
        this.dataProduk = result.data.data
        this.progressLoading = false
        this.alert(result.data.status, result.data.message)
      },

      async readSupplier () {
        const result = await this.apiService.getData(this.$http, 'supplier')
        this.dataSupplier = result.data.data
      },

      async readKategori () {
        const result = await this.apiService.getData(this.$http, 'category')
        this.dataKategori = result.data.data
      },

      fotoPreview (source) {
        if (this.selectedFile === null) {
          return this.$file + source
        }

        return URL.createObjectURL(this.selectedFile)
      },

      statusShow (action, item) {
        if (action === 'Normal') {
          return item ? 'Di Arsip' : 'Di Jual'
        } else {
          return item ? 'Pulihkan' : 'Arsipkan'
        }
      },

      formatExample (value) {
        const val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },

      colorRanges (value) {
        if (value <= 0) {
          return 'red accent-3'
        } else if (value > 0 && value <= 50) {
          return 'orange darken-2'
        } else if (value > 50 && value <= 75) {
          return 'yellow darken-2'
        } else if (value > 75 && value <= 100) {
          return 'green  darken-1'
        } else if (value > 100) {
          return 'light-blue darken-1'
        }
      },
    },
  }
</script>
