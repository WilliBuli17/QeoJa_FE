<template>
  <v-container
    id="laporan-view"
    fluid
    tag="section"
  >
    <v-overlay :value="overlay">
      <app-progress-loading />
    </v-overlay>

    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-book-open-variant"
          icon-small
          title="Laporan"
          color="primary"
        >
          <div v-if="progressLoading">
            <app-progress-loading />
          </div>

          <v-data-table
            v-else
            :headers="headers"
            :items="dataLaporan"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataLaporan.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <app-btn
                small
                elevation="5"
                class="ma-2 light-blue accent-4"
                rel="noopener noreferrer"
                @click="dialogOpen(item)"
              >
                <v-icon left>
                  mdi-open-in-new
                </v-icon>
                <span>Detail</span>
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
                {{ `${action} - ${tipe}` }}
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-card-text>
              <app-text-autocomplete
                v-if="action !== 'Laporan Transaksi (Pendapatan)'"
                v-model="form.productId"
                class="my-5"
                :items="dataProduk"
                item-text="name"
                item-value="id"
                :rules="productIdRules"
                label="Product"
              />

              <app-text-autocomplete
                v-if="tipe === 'Bulanan'"
                v-model="form.yearOnly"
                class="my-5"
                :items="years"
                :rules="yearOnlyRules"
                label="Tahun"
              />

              <div v-else>
                <app-text-autocomplete
                  v-model="form.startYear"
                  class="my-5"
                  :items="years"
                  :rules="startYearRules"
                  label="Tahun Mulai"
                />

                <app-text-autocomplete
                  v-model="form.endYear"
                  class="my-5"
                  :items="years"
                  :rules="[
                    endYearRules.min(form.startYear, form.endYear),
                  ]"
                  label="Tahunn Selesai"
                />
              </div>
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
                Cari
              </app-btn>
            </v-card-actions>
          </v-form>
        </material-card>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogBig"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      style="overflow: hidden;"
    >
      <v-card>
        <v-toolbar
          id="hidden-print"
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialogBigClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-toolbar-title>{{ `${action} - ${tipe}` }}</v-toolbar-title>

          <v-spacer />

          <vue-excel-xlsx
            :data="dataShow"
            :columns="returnColumns"
            :file-name="`${timeNow}_${action}_${tipe}_${tahun}`"
            :file-type="'xlsx'"
            :sheet-name="tipe"
          >
            Download
          </vue-excel-xlsx>
        </v-toolbar>

        <v-card-text
          class="mt-16 pt-16 text-center"
        >
          <span class="text-h2 font-weight-medium">{{ `${action} - ${tipe}` }}</span>
        </v-card-text>

        <v-card-text
          v-if="form.productId"
          class="mt-8"
        >
          <span class="text-h4">Nama Produk : {{ produkPreview.name }}</span>
        </v-card-text>

        <v-card-text
          v-if="form.productId"
          class="mt-n3"
        >
          <span class="text-h4">Unit : {{ produkPreview.unit }}</span>
        </v-card-text>

        <v-card-text
          v-if="tahun"
          class="mt-n3"
        >
          <span class="text-h4">Tahun : {{ tahun }}</span>
        </v-card-text>

        <v-data-table
          v-if="action === 'Laporan Stock (Pengeluaran)'"
          :headers="headersShow"
          :items="dataShow"
          class="mt-10"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:[`item.index`]="{ item }">
            {{ dataShow.indexOf(item) + 1 }}
          </template>

          <template v-slot:[`item.harga_barang_masuk`]="{ item }">
            Rp. {{ formatExample(item.harga_barang_masuk) }}
          </template>

          <template v-slot:[`item.harga_barang_keluar`]="{ item }">
            Rp. {{ formatExample(item.harga_barang_keluar) }}
          </template>

          <template v-slot:[`item.total_harga_barang`]="{ item }">
            Rp. {{ formatExample(item.total_harga_barang) }}
          </template>
        </v-data-table>

        <v-data-table
          v-if="action === 'Laporan Transaksi (Pendapatan)'"
          :headers="headersShow"
          :items="dataShow"
          class="mt-10"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:[`item.index`]="{ item }">
            {{ dataShow.indexOf(item) + 1 }}
          </template>

          <template v-slot:[`item.subtotal_price`]="{ item }">
            Rp. {{ formatExample(item.subtotal_price) }}
          </template>

          <template v-slot:[`item.tax`]="{ item }">
            Rp. {{ formatExample(item.tax) }}
          </template>

          <template v-slot:[`item.shipping_cost`]="{ item }">
            Rp. {{ formatExample(item.shipping_cost) }}
          </template>

          <template v-slot:[`item.grand_total_price`]="{ item }">
            Rp. {{ formatExample(item.grand_total_price) }}
          </template>
        </v-data-table>

        <v-data-table
          v-if="action === 'Laporan Penjualan Produk'"
          :headers="headersShow"
          :items="dataShow"
          class="mt-10"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:[`item.index`]="{ item }">
            {{ dataShow.indexOf(item) + 1 }}
          </template>

          <template v-slot:[`item.success_price`]="{ item }">
            Rp. {{ formatExample(item.success_price) }}
          </template>

          <template v-slot:[`item.fails_price`]="{ item }">
            Rp. {{ formatExample(item.fails_price) }}
          </template>
        </v-data-table>
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
    name: 'LaporanView',

    data: () => ({
      loadingButton: false,
      overlay: false,
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
          text: 'Nama Laporan',
          value: 'name',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Tipe Laporan',
          value: 'tipe',
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
      dataLaporan: [
        {
          id: 1,
          name: 'Laporan Stock (Pengeluaran)',
          tipe: 'Bulanan',
        },
        {
          id: 2,
          name: 'Laporan Stock (Pengeluaran)',
          tipe: 'Tahunan',
        },
        {
          id: 3,
          name: 'Laporan Penjualan Produk',
          tipe: 'Bulanan',
        },
        {
          id: 4,
          name: 'Laporan Penjualan Produk',
          tipe: 'Tahunan',
        },
        {
          id: 5,
          name: 'Laporan Transaksi (Pendapatan)',
          tipe: 'Bulanan',
        },
        {
          id: 6,
          name: 'Laporan Transaksi (Pendapatan)',
          tipe: 'Tahunan',
        },
      ],
      dialog: false,
      dialogBig: false,
      action: null,
      tipe: null,
      form: {
        productId: null,
        yearOnly: null,
        startYear: null,
        endYear: null,
      },
      productIdRules: [(v) => !!v || 'Produk Harus Diisi'],
      yearOnlyRules: [(v) => !!v || 'Tahun Harus Diisi'],
      startYearRules: [(v) => !!v || 'Tahun Mulai Harus Diisi'],
      endYearRules: {
        min (startYear, v) {
          return (v && v >= startYear) || 'Tahun Selesai Harus Diisi Dan Harus Lebih Besar Dari Tahun Mulai'
        },
      },
      progressLoading: false,
      dataProduk: [],
      years: [],
      dataShow: [],
      tahun: null,
    }),

    computed: {
      timeNow () {
        const current = new Date()
        return `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}_${current.getHours()}-${current.getMinutes()}-${current.getSeconds()}`
      },
      headersShow () {
        let objectHeader

        if (this.action === 'Laporan Stock (Pengeluaran)') {
          if (this.tipe === 'Bulanan') {
            objectHeader = [
              {
                text: 'No',
                value: 'index',
                align: 'start',
                sortable: false,
                class: 'primary--text',
              },
              {
                text: 'Bulan',
                value: 'bulan',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Barang Masuk',
                value: 'barang_masuk',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Harga Barang Masuk',
                value: 'harga_barang_masuk',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Barang Keluar',
                value: 'barang_keluar',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Harga Barang Keluar',
                value: 'harga_barang_keluar',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Total Barang',
                value: 'total_barang',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Total Harga Barang',
                value: 'total_harga_barang',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
            ]
          } else if (this.tipe === 'Tahunan') {
            objectHeader = [
              {
                text: 'No',
                value: 'index',
                align: 'start',
                sortable: false,
                class: 'primary--text',
              },
              {
                text: 'Tahun',
                value: 'tahun',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Barang Masuk',
                value: 'barang_masuk',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Harga Barang Masuk',
                value: 'harga_barang_masuk',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Barang Keluar',
                value: 'barang_keluar',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Harga Barang Keluar',
                value: 'harga_barang_keluar',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Total Barang',
                value: 'total_barang',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Total Harga Barang',
                value: 'total_harga_barang',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
            ]
          }
        } else if (this.action === 'Laporan Transaksi (Pendapatan)') {
          if (this.tipe === 'Bulanan') {
            objectHeader = [
              {
                text: 'No',
                value: 'index',
                align: 'start',
                sortable: false,
                class: 'primary--text',
              },
              {
                text: 'Bulan',
                value: 'bulan',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Penjualan Produk',
                value: 'subtotal_price',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Pajak',
                value: 'tax',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Biaya Pengiriman',
                value: 'shipping_cost',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Total',
                value: 'grand_total_price',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
            ]
          } else if (this.tipe === 'Tahunan') {
            objectHeader = [
              {
                text: 'No',
                value: 'index',
                align: 'start',
                sortable: false,
                class: 'primary--text',
              },
              {
                text: 'Tahun',
                value: 'tahun',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Penjualan Produk',
                value: 'subtotal_price',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Pajak',
                value: 'tax',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Biaya Pengiriman',
                value: 'shipping_cost',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Total',
                value: 'grand_total_price',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
            ]
          }
        } else if (this.action === 'Laporan Penjualan Produk') {
          if (this.tipe === 'Bulanan') {
            objectHeader = [
              {
                text: 'No',
                value: 'index',
                align: 'start',
                sortable: false,
                class: 'primary--text',
              },
              {
                text: 'Bulan',
                value: 'bulan',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Jumlah Sukses',
                value: 'success',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Rerata Harga Sukses',
                value: 'success_price',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Jumlah Gagal',
                value: 'fails',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Rerata Harga Gagal',
                value: 'fails_price',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
            ]
          } else if (this.tipe === 'Tahunan') {
            objectHeader = [
              {
                text: 'No',
                value: 'index',
                align: 'start',
                sortable: false,
                class: 'primary--text',
              },
              {
                text: 'Tahun',
                value: 'tahun',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Jumlah Sukses',
                value: 'success',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Rerata Harga Sukses',
                value: 'success_price',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Jumlah Gagal',
                value: 'fails',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
              {
                text: 'Rerata Harga Gagal',
                value: 'fails_price',
                align: 'start',
                sortable: true,
                class: 'primary--text',
              },
            ]
          }
        }

        return objectHeader
      },

      returnColumns () {
        let objectColumns

        if (this.action === 'Laporan Stock (Pengeluaran)') {
          if (this.tipe === 'Bulanan') {
            objectColumns = [
              {
                label: 'Bulan',
                field: 'bulan',
              },
              {
                label: 'Barang Masuk',
                field: 'barang_masuk',
              },
              {
                label: 'Harga Barang Masuk',
                field: 'harga_barang_masuk',
              },
              {
                label: 'Barang Keluar',
                field: 'barang_keluar',
              },
              {
                label: 'Harga Barang Keluar',
                field: 'harga_barang_keluar',
              },
              {
                label: 'Total Barang',
                field: 'total_barang',
              },
              {
                label: 'Total Harga Barang',
                field: 'total_harga_barang',
              },
            ]
          } else if (this.tipe === 'Tahunan') {
            objectColumns = [
              {
                label: 'Tahun',
                field: 'tahun',
              },
              {
                label: 'Barang Masuk',
                field: 'barang_masuk',
              },
              {
                label: 'Harga Barang Masuk',
                field: 'harga_barang_masuk',
              },
              {
                label: 'Barang Keluar',
                field: 'barang_keluar',
              },
              {
                label: 'Harga Barang Keluar',
                field: 'harga_barang_keluar',
              },
              {
                label: 'Total Barang',
                field: 'total_barang',
              },
              {
                label: 'Total Harga Barang',
                field: 'total_harga_barang',
              },
            ]
          }
        } else if (this.action === 'Laporan Transaksi (Pendapatan)') {
          if (this.tipe === 'Bulanan') {
            objectColumns = [
              {
                label: 'Bulanan',
                field: 'bulan',
              },
              {
                label: 'Penjualan Produk',
                field: 'subtotal_price',
              },
              {
                label: 'Pajak',
                field: 'tax',
              },
              {
                label: 'Biaya Pengiriman',
                field: 'shipping_cost',
              },
              {
                label: 'Total',
                field: 'grand_total_price',
              },
            ]
          } else if (this.tipe === 'Tahunan') {
            objectColumns = [
              {
                label: 'Tahun',
                field: 'tahun',
              },
              {
                label: 'Penjualan Produk',
                field: 'subtotal_price',
              },
              {
                label: 'Pajak',
                field: 'tax',
              },
              {
                label: 'Biaya Pengiriman',
                field: 'shipping_cost',
              },
              {
                label: 'Total',
                field: 'grand_total_price',
              },
            ]
          }
        } else if (this.action === 'Laporan Penjualan Produk') {
          if (this.tipe === 'Bulanan') {
            objectColumns = [
              {
                label: 'Bulan',
                field: 'bulan',
              },
              {
                label: 'Jumlah Sukses',
                field: 'success',
              },
              {
                label: 'Rerata Harga Sukses',
                field: 'success_price',
              },
              {
                label: 'Jumlah Gagal',
                field: 'fails',
              },
              {
                label: 'Rerata Harga Gagal',
                field: 'fails_price',
              },
            ]
          } else if (this.tipe === 'Tahunan') {
            objectColumns = [
              {
                label: 'Tahun',
                field: 'tahun',
                align: 'start',
                sortable: true,
                class: 'primary--label',
              },
              {
                label: 'Jumlah Sukses',
                field: 'success',
              },
              {
                label: 'Rerata Harga Sukses',
                field: 'success_price',
              },
              {
                label: 'Jumlah Gagal',
                field: 'fails',
              },
              {
                label: 'Rerata Harga Gagal',
                field: 'fails_price',
              },
            ]
          }
        }

        return objectColumns
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

      produkPreview () {
        let filteredArrays = this.dataProduk

        filteredArrays = filteredArrays.find((product) => {
          return product.id === this.form.productId
        })

        return filteredArrays
      },
    },

    mounted () {
      this.read()
      this.generateYears()
    },

    methods: {
      dialogOpen (item) {
        this.action = item.name
        this.tipe = item.tipe
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
        this.action = null
        this.tipe = null
        this.tahun = null
        this.read()
      },

      dialogBigClose () {
        this.dataShow = []
        this.dialogBig = false
      },

      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'product')
        this.dataProduk = result.data.data
        this.progressLoading = false
      },

      generateYears () {
        const year = new Date().getFullYear()
        const result = Array.from({ length: year - 1900 }, (value, index) => 1901 + index)
        this.years = result.reverse()
      },

      async setForm () {
        if (this.$refs.form.validate()) {
          let result
          this.overlay = true

          if (this.action === 'Laporan Stock (Pengeluaran)' && this.tipe === 'Bulanan') {
            result = await this.apiService.getData(this.$http, `laporanStockBulanan/${this.form.productId}/${this.form.yearOnly}`)
          } else if (this.action === 'Laporan Penjualan Produk' && this.tipe === 'Bulanan') {
            result = await this.apiService.getData(this.$http, `laporanPenjualanBulanan/${this.form.productId}/${this.form.yearOnly}`)
          } else if (this.action === 'Laporan Transaksi (Pendapatan)' && this.tipe === 'Bulanan') {
            result = await this.apiService.getData(this.$http, `laporanPendapatanBulanan/${this.form.yearOnly}`)
          } else if (this.action === 'Laporan Stock (Pengeluaran)' && this.tipe === 'Tahunan') {
            result = await this.apiService.getData(this.$http, `laporanStockTahunan/${this.form.productId}/${this.form.startYear}/${this.form.endYear}`)
          } else if (this.action === 'Laporan Penjualan Produk' && this.tipe === 'Tahunan') {
            result = await this.apiService.getData(this.$http, `laporanPenjualanTahunan/${this.form.productId}/${this.form.startYear}/${this.form.endYear}`)
          } else if (this.action === 'Laporan Transaksi (Pendapatan)' && this.tipe === 'Tahunan') {
            result = await this.apiService.getData(this.$http, `laporanPendapatanTahunan/${this.form.startYear}/${this.form.endYear}`)
          }

          if (this.form.startYear) {
            this.tahun = `${this.form.startYear} - ${this.form.endYear}`
          } else if (this.form.yearOnly) {
            this.tahun = this.form.yearOnly
          }

          this.overlay = false
          this.dialogBig = true
          this.dataShow = result.data.data
        }
      },

      cetak () {
        window.print()
      },

      formatExample (value) {
        const val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },
    },
  }
</script>

<style scoped>
    @media print {
      #hidden-print {
        margin-top: -100px !important;
      }
    }
</style>
