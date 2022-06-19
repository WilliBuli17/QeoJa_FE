<template>
  <v-container
    id="transaksi-pelanggan-view"
    fluid
    tag="section"
  >
    <v-row
      class="px-3"
      justify="end"
    >
      <app-btn
        small
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
          title="Transaksi Pelanggan"
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
            :items="filters"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ filters.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.created_at`]="{ item }">
              {{ timeConverter(item.created_at) }}
            </template>

            <template v-slot:[`item.grand_total_price`]="{ item }">
              Rp. {{ formatExample(item.grand_total_price) }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    small
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-vertical-circle-outline</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-for="index in checkStatus(item.status)"
                    :key="index"
                  >
                    <v-list-item-title>
                      <app-btn
                        v-if="index === 1"
                        small
                        blok
                        elevation="5"
                        class="ma-2 green accent-4"
                        rel="noopener noreferrer"
                        @click="dialogOpen('Detail',item)"
                      >
                        <v-icon left>
                          mdi-open-in-new
                        </v-icon>
                        <span>Detail</span>
                      </app-btn>

                      <app-btn
                        v-if="item.status === 'Menunggu Konfirmasi' && index === 2"
                        small
                        blok
                        elevation="5"
                        class="ma-2 red accent-3"
                        rel="noopener noreferrer"
                        @click="dialogOpen('Batalkan',item)"
                      >
                        <v-icon left>
                          mdi-close
                        </v-icon>
                        <span>Batal</span>
                      </app-btn>

                      <app-btn
                        v-if="item.status === 'Menunggu Konfirmasi' && index === 3"
                        small
                        blok
                        elevation="5"
                        class="ma-2 blue accent-4"
                        rel="noopener noreferrer"
                        @click="dialogOpen('Konfirmasi Telah Lunas',item)"
                      >
                        <v-icon left>
                          mdi-check
                        </v-icon>
                        <span>Lunas</span>
                      </app-btn>

                      <app-btn
                        v-if="item.status === 'Sedang Dikemas' && index === 2"
                        small
                        blok
                        elevation="5"
                        class="ma-2 blue accent-4"
                        rel="noopener noreferrer"
                        @click="dialogOpen('Konfirmasi Pesanan Siap Dikirm',item)"
                      >
                        <v-icon left>
                          mdi-cube-send
                        </v-icon>
                        <span>Siap Dikirim</span>
                      </app-btn>

                      <app-btn
                        v-if="item.status === 'Dalam Antrian Pengiriman' && index === 2"
                        small
                        blok
                        elevation="5"
                        class="ma-2 blue accent-4"
                        rel="noopener noreferrer"
                        @click="dialogOpen('Kirim',item)"
                      >
                        <v-icon left>
                          mdi-cube-send
                        </v-icon>
                        <span>Kirim</span>
                      </app-btn>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      persistent
      :width="action === 'Detail' ? widthDialog : widthBtn"
    >
      <v-card>
        <material-card
          color="primary"
          full-header
        >
          <template #heading>
            <div class="pt-3 pb-2 px-3 white--text">
              <div class="text-h3 font-weight-normal">
                {{ action }}
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-card-text v-if="action === 'Detail'">
              <v-row>
                <v-col
                  class="px-5"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-input
                    v-model="form.name"
                    label="Nama"
                    readonly
                  />
                </v-col>

                <v-col
                  class="px-5"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-input
                    v-model="form.city"
                    label="Kota"
                    readonly
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  class="px-5"
                  cols="12"
                >
                  <v-textarea
                    v-model="form.address"
                    rows="1"
                    auto-grow
                    label="Alamat"
                    readonly
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  class="px-5"
                  cols="12"
                >
                  <v-textarea
                    v-model="form.message"
                    rows="1"
                    auto-grow
                    label="Pesan Khusus Dari Pelanggan"
                    readonly
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  class="px-5"
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                >
                  <app-text-input
                    v-model="form.subTotal"
                    label="Sub Total"
                    prefix="Rp."
                    readonly
                  />
                </v-col>

                <v-col
                  class="px-5"
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                >
                  <app-text-input
                    v-model="form.tax"
                    label="Pajak"
                    prefix="Rp."
                    readonly
                  />
                </v-col>

                <v-col
                  class="px-5"
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                >
                  <app-text-input
                    v-model="form.shippingCost"
                    label="Biaya Pengiriman"
                    prefix="Rp."
                    readonly
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  class="px-5"
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                >
                  <app-text-input
                    v-model="form.grandTotalPrice"
                    label="Total Biaya"
                    prefix="Rp."
                    readonly
                  />
                </v-col>

                <v-col
                  class="px-5"
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                >
                  <app-text-input
                    v-model="form.totalVolume"
                    label="Total Volume Pengiriman"
                    suffix="CC"
                    readonly
                  />
                </v-col>

                <v-col
                  class="px-5"
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
                >
                  <app-text-autocomplete
                    v-model="form.status"
                    :items="dataStatusTransaksi"
                    item-text="name"
                    item-value="id"
                    :rules="statusRules"
                    label="Status"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  class="px-5"
                  cols="12"
                >
                  <app-btn
                    small
                    block
                    dense
                    target="_blank"
                    :loading="loadingButton"
                    :href="$file + form.receipt"
                  >
                    Resi
                  </app-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <div v-if="progressLoadingDetail">
                    <app-progress-loading />
                  </div>

                  <v-card
                    v-else
                    class="overflow-y-auto pa-2"
                    max-height="400"
                  >
                    <div
                      v-if="$vuetify.breakpoint.mdAndUp"
                      class="px-4"
                    >
                      <v-row>
                        <v-col
                          class="d-flex justify-center"
                          cols="3"
                        >
                          <h4 class="font-600 grey--text text--darken-2">
                            Produk
                          </h4>
                        </v-col>

                        <v-col
                          class="d-flex justify-center"
                          cols="3"
                        >
                          <h4 class="font-600 grey--text text--darken-2">
                            Jumlah
                          </h4>
                        </v-col>

                        <v-col
                          class="d-flex justify-center"
                          cols="3"
                        >
                          <h4 class="font-600 grey--text text--darken-2">
                            Status
                          </h4>
                        </v-col>

                        <v-col
                          class="d-flex justify-center"
                          cols="3"
                        >
                          <h4 class="font-600 grey--text text--darken-2">
                            Total
                          </h4>
                        </v-col>
                      </v-row>
                    </div>

                    <v-card
                      v-for="index in dataDetailTransaksi"
                      :key="index.id"
                      elevation="0"
                      class="border br-10 mb-4"
                    >
                      <div class="px-4">
                        <v-row class="align-center">
                          <v-col
                            class="d-flex justify-center"
                            cols="12"
                            md="3"
                          >
                            <h4 class="font-600">
                              <v-avatar
                                rounded
                                size="60"
                              >
                                <img :src="$file + index.picture">
                              </v-avatar>

                              {{ index.name }}
                            </h4>
                          </v-col>

                          <v-col
                            class="d-flex justify-center"
                            cols="12"
                            md="3"
                          >
                            <p class="f-600 mb-n3">
                              {{ index.amount_of_product }}
                            </p>
                          </v-col>

                          <v-col
                            class="d-flex justify-center"
                            cols="12"
                            md="3"
                          >
                            <v-chip
                              class="f-600"
                              :color="`${colorStatus(index.status)} accent-1`"
                              small
                              :text-color="`${colorStatus(index.status)} accent-4`"
                            >
                              {{ index.status.toUpperCase() }}
                            </v-chip>
                          </v-col>

                          <v-col
                            class="d-flex justify-center"
                            cols="12"
                            md="3"
                          >
                            <p class="f-600">
                              Rp. {{ formatExample(index.total_price) }}
                            </p>
                          </v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text v-else-if="action === 'Kirim'">
              <app-text-autocomplete
                v-model="form.employeeId"
                class="mb-5"
                :items="dataPegawai"
                item-text="name"
                item-value="id"
                :rules="statusRules"
                label="Pegawai Pengirim"
              />

              <app-text-autocomplete
                v-model="form.trukEkspedisiId"
                class="mt-5"
                :items="dataTrukEkspedisi"
                item-text="license_id"
                item-value="id"
                :rules="trukEkspedisiIdRules"
                label="Truk Ekspedisi Pengirim"
              />

              <v-menu
                v-model="dateInput"
                class="mt-5"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
                v-bind="$attrs"
                v-on="$listeners"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.deliveryDate"
                    color="primary"
                    label="Tanggal Pengiriman"
                    :rules="deliveryDateRules"
                    readonly
                    required
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>

                <v-date-picker
                  v-model="form.deliveryDate"
                  @input="dateInput = false"
                />
              </v-menu>

              <v-row>
                <v-col
                  cols="12"
                >
                  <v-checkbox
                    v-model="checkbox"
                    label="Ubah Status ?"
                    color="primary"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text v-else>
              Apakah Anda Yakin Ingin Transaksi Pelanggan Ini Akan Di {{ action }}?
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
                Simpan
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
    name: 'TransaksiPelangganView',

    data: () => ({
      dialog: false,
      apiService: new ApiService(),
      color: null,
      title: null,
      subtitle: null,
      snackbar: false,
      multiLine: true,
      form: {
        id: null,
        name: null,
        city: null,
        address: null,
        message: null,
        subTotal: null,
        tax: null,
        shippingCost: null,
        grandTotalPrice: null,
        status: null,
        totalVolume: null,
        trukEkspedisiId: null,
        employeeId: null,
        deliveryDate: null,
        receipt: null,
      },
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
          text: 'Tanggal',
          value: 'created_at',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Nominal',
          value: 'grand_total_price',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Kota',
          value: 'city',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Volume (CC)',
          value: 'total_volume_product',
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
          text: 'Aksi',
          value: 'actions',
          align: 'end',
          sortable: false,
          class: 'primary--text',
        },
      ],
      dataTransaksi: [],
      search: null,
      progressLoading: false,
      progressLoadingDetail: false,
      loadingButton: false,
      dataStatusTransaksi: [],
      dataDetailTransaksi: [],
      statusRules: [
        v => !!v || 'Status Harus Diisi',
      ],
      deliveryDateRules: [
        v => !!v || 'Tanggal Pengiriman Harus Diisi',
      ],
      employeeIdRules: [
        v => !!v || 'Pegawai Pengirim Harus Diisi',
      ],
      trukEkspedisiIdRules: [
        v => !!v || 'Truk Ekspedisi Harus Diisi',
      ],
      action: null,
      dateInput: false,
      dataPegawai: [],
      dataTrukEkspedisi: [],
      checkbox: false,
    }),

    computed: {
      widthBtn () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return '100%'
          case 'sm':
            return '100%'
          case 'md':
            return '55%'
          case 'lg':
            return '45%'
          case 'xl':
            return '35%'
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
            return '90%'
          case 'lg':
            return '90%'
          case 'xl':
            return '90%'
          default:
            return '100%'
        }
      },

      filters () {
        let filteredArrays = this.dataTransaksi
        let role
        const rolesPakem = [
          'Menunggu Konfirmasi',
          'Sedang Dikemas',
          'Dalam Antrian Pengiriman',
          'Dalam Pengiriman',
          'Pengiriman Selesai',
          'Pengiriman Selesai - Konfirmasi Pengguna',
          'Transaksi Dibatalkan',
        ]

        if (sessionStorage.getItem('user')) {
          role = sessionStorage.getItem('role')
        } else {
          role = localStorage.getItem('role')
        }

        if (role === 'Admin Penjualan') {
          filteredArrays = filteredArrays.filter(transaction => {
            return transaction.status.toLowerCase().includes(rolesPakem[0].toLowerCase()) ||
              transaction.status.toLowerCase().includes(rolesPakem[6].toLowerCase())
          })
        } else if (role === 'Admin Gudang') {
          filteredArrays = filteredArrays.filter(transaction => {
            return transaction.status.toLowerCase().includes(rolesPakem[1].toLowerCase())
          })
        } else if (role === 'Admin Ekspedisi') {
          filteredArrays = filteredArrays.filter(transaction => {
            return transaction.status.toLowerCase().includes(rolesPakem[2].toLowerCase()) ||
              transaction.status.toLowerCase().includes(rolesPakem[3].toLowerCase())
          })
        }

        return filteredArrays
      },
    },

    mounted () {
      this.read()
      this.readStatus()
      this.readPegawai()
      this.readTrukEkspedisi()
    },

    methods: {
      alert (status, message) {
        this.color = status === 'success' ? 'success' : 'error'
        this.title = status
        this.subtitle = message
        this.snackbar = true
      },

      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'transaction')
        this.dataTransaksi = result.data.data
        this.progressLoading = false

        this.alert(result.data.status, result.data.message)
      },

      async readStatus () {
        const result = await this.apiService.getData(this.$http, 'transactionStatus')
        this.dataStatusTransaksi = result.data.data
      },

      async readDetailTransaksi () {
        this.progressLoadingDetail = true
        this.loadingButton = true
        const result = await this.apiService.getData(this.$http, `detailTransaction/${this.form.id}`)
        this.dataDetailTransaksi = result.data.data
        this.progressLoadingDetail = false
        this.loadingButton = false
      },

      async readPegawai () {
        const result = await this.apiService.getData(this.$http, 'employee')
        this.dataPegawai = result.data.data
      },

      async readTrukEkspedisi () {
        const result = await this.apiService.getData(this.$http, 'expeditionTruck')
        this.dataTrukEkspedisi = result.data.data
      },

      dialogOpen (action, item) {
        this.form.id = item.id
        this.form.name = item.name
        this.form.city = item.city
        this.form.address = item.address
        this.form.message = item.message
        this.form.subTotal = item.subtotal_price
        this.form.tax = item.tax
        this.form.shippingCost = item.shipping_cost
        this.form.grandTotalPrice = item.grand_total_price
        this.form.status = Number(item.transaction_status_id)
        this.form.totalVolume = item.total_volume_product
        this.form.receipt = item.receipt_of_payment

        this.action = action
        this.dialog = true
        this.readDetailTransaksi()
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

      timeConverter (value) {
        const a = new Date(value)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const year = a.getFullYear()
        const month = months[a.getMonth()]
        const date = a.getDate()
        const hour = a.getHours()
        const min = a.getMinutes()
        const sec = a.getSeconds()
        const time = date + ' ' + month + ' ' + year + ' (' + hour + ':' + min + ':' + sec + ') '
        return time
      },

      formatExample (value) {
        const val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },

      async setForm () {
        if (this.$refs.form.validate()) {
          this.loadingButton = true
          let tsd = null
          const transaction = new FormData()

          if (this.action === 'Batalkan') {
            tsd = 7
          } else if (this.action === 'Konfirmasi Telah Lunas') {
            tsd = 2
          } else if (this.action === 'Konfirmasi Pesanan Siap Dikirm') {
            tsd = 3
          } else if (this.action === 'Kirim') {
            if (this.checkbox === true) {
              tsd = 4
            }
            const transactionShipping = new FormData()
            transactionShipping.append('transaction_id', this.form.id)
            transactionShipping.append('employee_id', this.form.employeeId)
            transactionShipping.append('expedition_truck_id', this.form.trukEkspedisiId)
            transactionShipping.append('delivery_date', this.form.deliveryDate)
            this.apiService.storeData(this.$http, 'transactionShipping', transactionShipping)
          }

          if (tsd !== null) {
            transaction.append('transaction_status_id', tsd)
          } else {
            transaction.append('transaction_status_id', this.form.status)
          }

          const result = await this.apiService.storeData(this.$http, `transaction/${this.form.id}`, transaction)

          this.alert(result.data.status, result.data.message)

          this.read()
          this.dialogClose()
        }
      },

      checkStatus (value) {
        if (value === 'Menunggu Konfirmasi') {
          return 3
        } else if (value === 'Sedang Dikemas' || value === 'Dalam Antrian Pengiriman') {
          return 2
        } else {
          return 1
        }
      },

      colorStatus (value) {
        if (value === 'pending') {
          return 'orange'
        } else if (value === 'success') {
          return 'green'
        } else {
          return 'red'
        }
      },
    },
  }
</script>
