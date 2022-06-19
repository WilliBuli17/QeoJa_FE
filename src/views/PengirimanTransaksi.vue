<template>
  <v-container
    id="pengiriman-transaksi-view"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-shipping-pallet"
          icon-small
          title="Pengiriman Transaksi"
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
            :items="dataPengirimanTransaksi"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataPengirimanTransaksi.indexOf(item) + 1 }}
            </template>

            <template v-slot:[`item.delivery_date`]="{ item }">
              {{ timeConverter(item.delivery_date) }}
            </template>

            <template v-slot:[`item.arrived_date`]="{ item }">
              {{ timeConverter(item.arrived_date) }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <app-btn
                small
                elevation="5"
                class="ma-2 green accent-4"
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
                Detail Pengiriman Transaksi
              </div>
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-card-text>
              <v-row>
                <v-col
                  class="px-5"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <app-text-input
                    v-model="form.customer"
                    label="Pelanggan"
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
                  sm="4"
                  md="4"
                  lg="4"
                >
                  <app-text-input
                    v-model="form.employee"
                    label="Pegawai"
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
                    v-model="form.truck"
                    label="Truk Ekspedisi"
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
                    v-model="form.totalVolumeProduct"
                    label="Volume Produk"
                    suffix="CC"
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
                  <v-menu
                    v-model="dateInputDD"
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
                      @input="dateInputDD = false"
                    />
                  </v-menu>
                </v-col>

                <v-col
                  class="px-5"
                  cols="12"
                  sm="4"
                  md="4"
                  lg="4"
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
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.arrivedDate"
                        color="primary"
                        label="Tanggal Tiba"
                        :rules="arrivedDateRules"
                        readonly
                        required
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>

                    <v-date-picker
                      v-model="form.arrivedDate"
                      @input="dateInput = false"
                    />
                  </v-menu>
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
                <v-col cols="12">
                  <v-card
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
                          cols="2"
                        >
                          <h4 class="font-600 grey--text text--darken-2">
                            Jumlah
                          </h4>
                        </v-col>

                        <v-col
                          class="d-flex justify-center"
                          cols="2"
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

                        <v-col
                          class="d-flex justify-center"
                          cols="2"
                        >
                          <h4 class="font-600 grey--text text--darken-2">
                            Aksi
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
                            md="2"
                          >
                            <p class="f-600 mb-n3">
                              {{ index.amount_of_product }}
                            </p>
                          </v-col>

                          <v-col
                            class="d-flex justify-center"
                            cols="12"
                            md="2"
                          >
                            <v-chip
                              class="f-600"
                              :color="`${colorStatus(index.status)}`"
                              small
                              text-color="white"
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

                          <v-col
                            class="d-flex justify-center"
                            cols="12"
                            md="2"
                          >
                            <v-row justify="center">
                              <app-btn
                                small
                                elevation="5"
                                class="ma-2 red accent-4"
                                rel="noopener noreferrer"
                                @click="setFormUpdate('Batal', index.id)"
                              >
                                <span>Batal</span>
                              </app-btn>

                              <app-btn
                                small
                                elevation="5"
                                class="ma-2 green accent-4"
                                rel="noopener noreferrer"
                                @click="setFormUpdate('Sukses', index.id)"
                              >
                                <span>Sukses</span>
                              </app-btn>
                            </v-row>
                          </v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-card>
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
    name: 'PengirimanTransaksiView',

    data: () => ({
      dialog: false,
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
          text: 'Pelanggan',
          value: 'customer',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Truk',
          value: 'license_id',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Pegawai',
          value: 'employee',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Tanggal Pengiriman',
          value: 'delivery_date',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Tanggal Tiba',
          value: 'arrived_date',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Status',
          value: 'transaction_status_name',
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
      dataPengirimanTransaksi: [],
      search: null,
      progressLoading: false,
      form: {
        id: null,
        customer: null,
        city: null,
        address: null,
        employee: null,
        truck: null,
        status: null,
        transactionId: null,
        totalVolumeProduct: null,
        deliveryDate: null,
        arrivedDate: null,
      },
      dataStatusTransaksi: [],
      statusRules: [
        v => !!v || 'Status Harus Diisi',
      ],
      arrivedDateRules: [
        v => !!v || 'Tanggal Pengiriman Harus Diisi',
      ],
      deliveryDateRules: [
        v => !!v || 'Tanggal Pengiriman Harus Diisi',
      ],
      dataDetailTransaksi: [],
      loadingButton: false,
      dateInput: false,
      dateInputDD: false,
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
            return '90%'
          case 'lg':
            return '90%'
          case 'xl':
            return '90%'
          default:
            return '100%'
        }
      },
    },

    mounted () {
      this.read()
      this.readStatus()
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
        const result = await this.apiService.getData(this.$http, 'transactionShipping')
        this.dataPengirimanTransaksi = result.data.data
        this.progressLoading = false
        this.alert(result.data.status, result.data.message)
      },

      async readStatus () {
        const result = await this.apiService.getData(this.$http, 'transactionStatus')
        this.dataStatusTransaksi = result.data.data
      },

      async readDetailTransaksi () {
        this.loadingButton = true
        const result = await this.apiService.getData(this.$http, `detailTransaction/${this.form.transactionId}`)
        this.dataDetailTransaksi = result.data.data
        this.loadingButton = false
      },

      dialogOpen (item) {
        this.form.id = item.id
        this.form.customer = item.customer
        this.form.city = item.city
        this.form.address = item.address
        this.form.truck = item.license_id
        this.form.employee = item.employee
        this.form.status = Number(item.transaction_status)
        this.form.transactionId = item.transaction_id
        this.form.totalVolumeProduct = item.total_volume_product
        this.form.deliveryDate = item.delivery_date
        this.form.arrivedDate = item.arrived_date

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

      async setForm () {
        if (this.$refs.form.validate()) {
          this.loadingButton = true
          const transaction = new FormData()
          transaction.append('transaction_status_id', this.form.status)
          this.apiService.storeData(this.$http, `transaction/${this.form.transactionId}`, transaction)

          const newDataTransactionShipping = {
            delivery_date: this.form.deliveryDate,
            arrived_date: this.form.arrivedDate,
          }
          const result = await this.apiService.updateData(this.$http, `transactionShipping/${this.form.id}`, newDataTransactionShipping)

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        }
      },

      async setFormUpdate (value, id) {
        let newDataDetailTransaction
        if (value === 'Batal') {
          newDataDetailTransaction = {
            status: 'fail',
          }
        } else {
          newDataDetailTransaction = {
            status: 'success',
          }
        }

        await this.apiService.updateData(this.$http, `detailTransaction/${id}`, newDataDetailTransaction)

        this.readDetailTransaksi()
      },

      timeConverter (value) {
        if (value) {
          const a = new Date(value)
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const year = a.getFullYear()
          const month = months[a.getMonth()]
          const date = a.getDate()
          const time = date + ' ' + month + ' ' + year
          return time
        }

        return null
      },

      colorStatus (value) {
        if (value === 'pending') {
          return 'orange  accent-3'
        } else if (value === 'success') {
          return 'green  accent-4'
        } else {
          return 'red  accent-3'
        }
      },

      formatExample (value) {
        const val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },
    },
  }
</script>
