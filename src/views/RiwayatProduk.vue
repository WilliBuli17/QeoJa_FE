<template>
  <v-container
    id="riwayat-produk-view"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-archive-outline"
          icon-small
          title="Riwayat Produk"
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
            :items="dataRiwayatProduk"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataRiwayatProduk.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.amount_of_product`]="{ item }">
              {{ `${item.amount_of_product} ${item.unit}` }}
            </template>

            <template v-slot:[`item.product_price`]="{ item }">
              Rp. {{ formatExample(item.product_price) }}
            </template>

            <template v-slot:[`item.history_category`]="{ item }">
              <v-chip
                class="ma-2"
                :color="item.history_category === 'in' ? 'light-blue darken-3' : 'red accent-3'"
                text-color="white"
              >
                {{ item.history_category }}
              </v-chip>
            </template>

            <template v-slot:[`item.total_price`]="{ item }">
              Rp. {{ formatExample(item.total_price) }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <app-btn
                v-if="item.deleted_by === null"
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
                class="ma-2 white--text"
                :color="item.deleted_by === null ? 'red accent-3' : 'deep-orange accent-3'"
                rel="noopener noreferrer"
                @click="dialogOpen('Hapus', item)"
              >
                <v-icon left>
                  {{ item.deleted_by === null ? `mdi-delete-variant` : `mdi-reload` }}
                </v-icon>
                <span>{{ item.deleted_by === null ? `Hapus` : `Pulihkan` }}</span>
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
                {{ action }} Riwayat Produk
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-card-text v-if="action === 'Hapus'">
              Apakah Anda Yakin Ingin {{ form.deletedBy === null ? `Menghapus` : `Memulihkan` }} Data Riwayat Produk Ini?
            </v-card-text>

            <v-card-text v-else>
              <v-row
                justify="center"
                class="mb-5"
              >
                <v-avatar
                  v-if="form.productId != null"
                  rounded
                  size="200"
                >
                  <v-img :src="fotoPreview" />
                </v-avatar>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="6"
                >
                  <app-text-autocomplete
                    v-model="form.productId"
                    :items="dataProduk"
                    item-text="name"
                    item-value="id"
                    :rules="productIdRules"
                    label="Product"
                  />
                </v-col>

                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="6"
                >
                  <app-text-autocomplete
                    v-model="form.historyCategory"
                    :items="dataKategori"
                    item-text="name"
                    item-value="id"
                    :rules="historyCategoryRules"
                    label="Kategori"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="6"
                >
                  <v-menu
                    v-model="dateInputDate"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    v-bind="$attrs"
                    v-on="$listeners"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.historyDate"
                        color="primary"
                        label="Tanggal Riwayat"
                        :rules="historyDateRules"
                        readonly
                        dense
                        required
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>

                    <v-date-picker
                      v-model="form.historyDate"
                      @input="dateInputDate = false"
                    />
                  </v-menu>
                </v-col>

                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="6"
                >
                  <v-menu
                    v-model="dateInputExpDate"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    v-bind="$attrs"
                    v-on="$listeners"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.productExpiredDate"
                        color="primary"
                        label="Tanggal Kedaluwarsa"
                        :rules="productExpiredDateRules"
                        readonly
                        dense
                        required
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>

                    <v-date-picker
                      v-model="form.productExpiredDate"
                      @input="dateInputExpDate = false"
                    />
                  </v-menu>
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="6"
                >
                  <app-text-input
                    v-model="form.amountOfProduct"
                    :rules="amountOfProductRules"
                    label="Jumlah Produk"
                  />
                </v-col>

                <v-col
                  cols="12"
                  lg="6"
                  md="6"
                  sm="6"
                >
                  <app-text-input
                    v-model="form.productPrice"
                    :rules="productPriceRules"
                    prefix="Rp."
                    label="Harga Produk"
                  />
                </v-col>
              </v-row>

              <v-row v-if="action === 'Ubah'">
                <v-col
                  cols="12"
                  lg="4"
                  md="4"
                  sm="4"
                >
                  <app-text-input
                    v-model="form.createdByName"
                    readonly
                    label="Di Buat Oleh"
                  />
                </v-col>

                <v-col
                  cols="12"
                  lg="4"
                  md="4"
                  sm="4"
                >
                  <app-text-input
                    v-model="form.updatedByName"
                    readonly
                    label="Di Ubah Oleh"
                  />
                </v-col>

                <v-col
                  cols="12"
                  lg="4"
                  md="4"
                  sm="4"
                >
                  <app-text-input
                    v-model="form.deletedByName"
                    readonly
                    label="Di Hapus Oleh"
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
                {{ form.deletedBy === null ? action : `Pulihkan` }}
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
    name: 'RiwayatProdukView',

    data: () => ({
      dialog: false,
      action: null,
      form: {
        id: null,
        historyCategory: null,
        historyDate: null,
        amountOfProduct: null,
        productPrice: null,
        productExpiredDate: null,
        productId: null,
        createdBy: null,
        updatedBy: null,
        deletedBy: null,
        createdByName: null,
        updatedByName: null,
        deletedByName: null,
      },
      productIdRules: [(v) => !!v || 'Produk Harus Diisi'],
      historyCategoryRules: [(v) => !!v || 'Kategori Harus Diisi'],
      historyDateRules: [(v) => !!v || 'Tanggal Riwayat Harus Diisi'],
      productExpiredDateRules: [(v) => !!v || 'Tanggal Kedaluwarsa Harus Diisi'],
      amountOfProductRules: [
        (v) => !!v || 'Jumlah Produk Harus Diisi',
        (v) => !v || /^[1-9]\d*$/.test(v) || 'Jumlah Tidak Valid',
      ],
      productPriceRules: [
        (v) => !!v || 'Harga Produk Harus Diisi',
        (v) => !v || /^[1-9]\d*$/.test(v) || 'Format Harga Tidak Valid',
      ],
      dataProduk: [],
      dataKategori: [
        {
          id: 'in',
          name: 'Barang Masuk',
        },
        {
          id: 'out',
          name: 'Barang Keluar (Rusak / Kedaluwarsa)',
        },
      ],
      dateInputDate: false,
      dateInputExpDate: false,
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
          text: 'Tanggal Riwayat',
          value: 'history_date',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Produk',
          value: 'product_id',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Jumlah Stock',
          value: 'amount_of_product',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Harga Satuan',
          value: 'product_price',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Total Harga',
          value: 'total_price',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Kategori',
          value: 'history_category',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Action',
          value: 'actions',
          align: 'end',
          sortable: true,
          class: 'primary--text',
        },
      ],
      dataRiwayatProduk: [],
      search: null,
      progressLoading: false,
      loadingButton: false,
      emp: null,
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
            return '70%'
          case 'xl':
            return '60%'
          default:
            return '100%'
        }
      },

      fotoPreview () {
        let filteredArrays = this.dataProduk

        filteredArrays = filteredArrays.find((product) => {
          return product.id === this.form.productId
        })

        return this.$file + filteredArrays.picture
      },
    },

    mounted () {
      if (sessionStorage.getItem('user')) {
        this.emp = sessionStorage.getItem('emp')
      } else {
        this.emp = localStorage.getItem('emp')
      }
      this.read()
      this.readProducts()
    },

    methods: {
      dialogOpen (action, item) {
        if (action === 'Ubah' || action === 'Hapus') {
          this.form.id = item.id
          this.form.historyCategory = item.history_category
          this.form.historyDate = item.history_date
          this.form.amountOfProduct = item.amount_of_product
          this.form.productPrice = item.product_price
          this.form.productExpiredDate = item.product_expired_date
          this.form.productId = item.product_id
          this.form.createdBy = item.created_by
          this.form.updatedBy = item.updated_by
          this.form.deletedBy = item.deleted_by
          this.form.createdByName = item.created_by_name
          this.form.updatedByName = item.updated_by_name
          this.form.deletedByName = item.deleted_by_name
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
          const newData = {
            deleted_by: this.emp,
          }
          result = await this.apiService.updateData(this.$http, `productHistoryDel/${this.form.id}`, newData)

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        } else if (this.$refs.form.validate()) {
          this.loadingButton = true
          if (this.action === 'Tambah') {
            const riwayatProduk = new FormData()
            riwayatProduk.append('history_category', this.form.historyCategory)
            riwayatProduk.append('history_date', this.form.historyDate)
            riwayatProduk.append('amount_of_product', this.form.amountOfProduct)
            riwayatProduk.append('product_price', this.form.productPrice)
            riwayatProduk.append(
              'product_expired_date',
              this.form.productExpiredDate,
            )
            riwayatProduk.append('product_id', this.form.productId)
            riwayatProduk.append('created_by', this.emp)
            result = await this.apiService.storeData(this.$http, 'productHistory', riwayatProduk)
          } else if (this.action === 'Ubah') {
            const newData = {
              history_category: this.form.historyCategory,
              history_date: this.form.historyDate,
              amount_of_product: this.form.amountOfProduct,
              product_price: this.form.productPrice,
              product_expired_date: this.form.productExpiredDate,
              product_id: this.form.productId,
              updated_by: this.emp,
            }
            result = await this.apiService.updateData(this.$http, `productHistory/${this.form.id}`, newData)
          }

          console.log(result.data.message)
          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        }
      },

      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'productHistory')
        this.dataRiwayatProduk = result.data.data
        this.progressLoading = false
        this.alert(result.data.status, result.data.message)
      },

      async readProducts () {
        const result = await this.apiService.getData(this.$http, 'product')
        this.dataProduk = result.data.data
      },

      formatExample (value) {
        const val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },
    },
  }
</script>
