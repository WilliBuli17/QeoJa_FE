<template>
  <div>
    <v-overlay :value="overlay">
      <app-progress-loading />
    </v-overlay>

    <v-container
      id="dashboard-view"
      fluid
      tag="section"
    >
      <v-row justify="center">
        <v-col
          class="order-last order-lg-first"
          cols="12"
          lg="9"
        >
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col
                  v-for="(chart, i) in returnCarts"
                  :key="`chart-${i}`"
                  cols="12"
                  lg="6"
                >
                  <material-chart-card
                    :color="chart.color"
                    :data="chart.data"
                    :options="chart.options"
                    :responsive-options="chart.responsiveOptions"
                    :title="chart.title"
                    :type="chart.type"
                    class="pb-2"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col
                  v-for="({...attrs }, i) in returnStates"
                  :key="i"
                  cols="12"
                  lg="6"
                >
                  <material-stat-card v-bind="attrs" />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col cols="12">
                  <material-card
                    color="#FF5252"
                    full-header
                  >
                    <template #heading>
                      <div class="pa-8 white--text">
                        <div class="text-h3 font-weight-light">
                          Transaksi Terbaru
                        </div>
                      </div>
                    </template>
                    <v-card-text>
                      <div v-if="progressLoading">
                        <app-progress-loading />
                      </div>

                      <v-data-table
                        v-else
                        :headers="headers"
                        :items="returnItems"
                        hide-default-footer
                        disable-pagination
                      >
                        <template v-slot:[`item.index`]="{ item }">
                          {{ returnItems.indexOf(item) + 1 }}
                        </template>

                        <template v-slot:[`item.total_volume_product`]="{ item }">
                          {{ formatExample(item.total_volume_product) }}
                        </template>

                        <template v-slot:[`item.grand_total_price`]="{ item }">
                          Rp. {{ formatExample(item.grand_total_price) }}
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </material-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          lg="3"
        >
          <app-card class="mt-4 text-center">
            <label
              v-if="form.role"
              for="avatarUpload"
            >
              <div class="avatar-upload mr-8">
                <v-img
                  class="rounded-circle elevation-6 mt-n16 d-inline-block"
                  :src="fotoPreview()"
                  width="200"
                  height="200"
                />

                <app-btn
                  class="avatar-upload-btn ml-n16 mt-n1"
                  fab
                  small
                >
                  <v-icon
                    size="20"
                  >
                    mdi-pencil-outline
                  </v-icon>
                </app-btn>

                <input
                  id="avatarUpload"
                  class="d-none"
                  type="file"
                  accept="image/*"
                  @change="onFileChanged"
                >
              </div>
            </label>

            <v-card-text class="text-center">
              <h6 class="text-h6 mb-2 text--secondary">
                {{ form.role }}
              </h6>

              <h4 class="text-h4 mb-16 text--primary">
                {{ form.name }}
              </h4>

              <v-form
                ref="form"
                lazy-validation
              >
                <v-container class="py-0">
                  <app-text-input
                    v-model="form.email"
                    class="mt-5"
                    :rules="emailRules"
                    label="Email"
                  />

                  <app-text-input
                    v-model="form.phone"
                    class="mt-5"
                    :rules="phoneRules"
                    label="No. Telp"
                  />

                  <app-text-input
                    v-model="form.address"
                    class="mt-5"
                    :rules="addressRules"
                    label="Alamat"
                  />

                  <v-checkbox
                    v-model="checkbox"
                    label="Ubah Password"
                    class="my-8"
                    color="primary"
                    @change="check($event)"
                  />

                  <div v-if="checkbox === true">
                    <app-text-input
                      v-model="form.password"
                      class="mt-5"
                      :rules="passwordRules"
                      label="Password"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                    />

                    <app-text-input
                      v-model="form.confirmPassword"
                      class="mt-5"
                      :rules="[
                        confirmPasswordRules.match(form.password, form.confirmPassword),
                      ]"
                      label="Konfirmasi Password"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                    />
                  </div>

                  <v-btn
                    small
                    width="100"
                    class="mt-10"
                    color="primary"
                    :loading="loadingButton"
                    @click="setForm"
                  >
                    Simpan
                  </v-btn>
                </v-container>
              </v-form>
            </v-card-text>
          </app-card>
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
  </div>
</template>

<script>
  import ApiService from '../service/ApiService'
  import { get } from 'vuex-pathify'
  import Vue from 'vue'

  const lineSmooth = Vue.chartist.Interpolation.cardinal({
    tension: 0,
  })

  export default {
    name: 'DashboardView',

    data: () => ({
      overlay: false,
      apiService: new ApiService(),
      color: null,
      title: null,
      subtitle: null,
      snackbar: false,
      multiLine: true,
      checkbox: false,
      selectedFile: null,
      form: {
        name: null,
        role: null,
        email: null,
        phone: null,
        address: null,
        picture: null,
        password: null,
        confirmPassword: null,
        gander: null,
        dateJoin: null,
        roleId: null,
      },
      show: false,
      loadingButton: false,
      emailRules: [
        v => !!v || 'Email Harus Diisi',
        (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Format E-mail Tidak Valid',
      ],
      phoneRules: [
        v => !!v || 'No. Telp. Harus Diisi',
        (v) => !v || /^\(?(?:\+62|62|0)(?:\d{2,3})?\)?[ .-]?\d{2,4}[ .-]?\d{2,4}[ .-]?\d{2,4}/.test(v) || 'Format No. Telp. Tidak Valid',
      ],
      addressRules: [
        v => !!v || 'Alamat Harus Diisi',
      ],
      passwordRules: [
        v => (v && v.length >= 8) || 'Password Minimal 8 Karakter',
      ],
      confirmPasswordRules: {
        match (pass, v) {
          return (v && v === pass) || 'Konfirmasi Password Tidak Sama'
        },
      },
      headers: [
        {
          sortable: false,
          text: 'No.',
          value: 'index',
        },
        {
          sortable: false,
          text: 'Name',
          value: 'name',
        },
        {
          sortable: false,
          text: 'Kota',
          value: 'city',
          align: 'right',
        },
        {
          sortable: false,
          text: 'Volume (CC)',
          value: 'total_volume_product',
          align: 'right',
        },
        {
          sortable: false,
          text: 'Total Harga',
          value: 'grand_total_price',
          align: 'right',
        },
      ],
      dataTransaksi: [],
      progressLoading: false,
      dataPelanggan: [],
      dataCartBar: [],
      datasetBar: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      hightBar: 1000,
      dataCartLine: [],
      datasetLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      hightLine: 1000,
      valueStateTransaction: 0,
      valueStateCustomer: 0,
    }),

    computed: {
      sales: get('sales/sales'),
      totalSales () {
        return this.sales.reduce((acc, val) => acc + val.salesInM, 0)
      },

      returnItems () {
        const filteredArrays = this.dataTransaksi
        filteredArrays.sort((a, b) => b.id - a.id)

        const item = filteredArrays.slice(0, 5)
        return item
      },

      returnStates () {
        const stats = [
          {
            color: '#FD9A13',
            icon: 'mdi-paper-roll-outline',
            title: 'Total Transaksi Yang Telah Dilakukan',
            value: this.formatDigit(this.valueStateTransaction.toString()),
          },
          {
            color: '#E91E63',
            icon: 'mdi-account',
            title: 'Total Pelanggan Yang Telah Terdaftar',
            value: this.valueStateCustomer.toString(),
          },
        ]

        return stats
      },

      returnCarts () {
        const charts = [
          {
            type: 'Bar',
            color: '#00CAE3',
            title: 'Jumlah Produk Terjual',
            data: {
              labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mey', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
              series: [
                this.datasetBar,
              ],
            },
            options: {
              axisX: {
                showGrid: false,
              },
              low: 0,
              high: this.hightBar,
              chartPadding: {
                top: 0,
                right: 5,
                bottom: 0,
                left: 0,
              },
            },
            responsiveOptions: [
              ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                  labelInterpolationFnc: function (value) {
                    return value[0]
                  },
                },
              }],
            ],
          },
          {
            type: 'Line',
            color: '#4CAF50',
            title: 'Jumlah Transaksi',
            data: {
              labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mey', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
              series: [
                this.datasetLine,
              ],
            },
            options: {
              lineSmooth,
              low: 0,
              high: this.hightLine,
              chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              },
            },
          },
        ]

        return charts
      },
    },

    mounted () {
      this.readUser()
      this.readCustomer()
      this.readTransactions()
      this.dashboardCartBar()
      this.dashboardCartLine()
    },

    methods: {
      alert (status, message) {
        this.color = status === 'success' ? 'success' : 'error'
        this.title = status
        this.subtitle = message
        this.snackbar = true
      },

      async readUser () {
        this.overlay = true
        let result

        if (sessionStorage.getItem('user')) {
          result = await this.apiService.getData(this.$http, `employee/${sessionStorage.getItem('user')}`)
        } else {
          result = await this.apiService.getData(this.$http, `employee/${localStorage.getItem('user')}`)
        }

        if (result.data.data) {
          if (sessionStorage.getItem('user')) {
            sessionStorage.setItem('emp', result.data.data[0].id)
            sessionStorage.setItem('role', result.data.data[0].role)
          } else {
            localStorage.setItem('emp', result.data.data[0].id)
            localStorage.setItem('role', result.data.data[0].role)
          }

          this.form.name = result.data.data[0].name
          this.form.role = result.data.data[0].role
          this.form.email = result.data.data[0].email
          this.form.phone = result.data.data[0].phone
          this.form.address = result.data.data[0].address
          this.form.picture = result.data.data[0].picture
          this.form.gander = result.data.data[0].gander
          this.form.dateJoin = result.data.data[0].date_join
          this.form.roleId = result.data.data[0].role_id
        }
        this.overlay = false
      },

      async setForm () {
        if (this.$refs.form.validate()) {
          let result
          this.loadingButton = true

          const employee = new FormData()
          employee.append('email', this.form.email)
          employee.append('name', this.form.name)
          employee.append('phone', this.form.phone)
          employee.append('address', this.form.address)
          employee.append('gander', this.form.gander)
          employee.append('date_join', this.form.dateJoin)
          employee.append('role_id', this.form.roleId)

          if (this.form.password) {
            employee.append('password', this.form.password)
          }

          if (this.selectedFile) {
            employee.append('picture', this.selectedFile)
          }

          if (sessionStorage.getItem('user')) {
            result = await this.apiService.storeData(this.$http, `employee/${sessionStorage.getItem('emp')}`, employee)
          } else {
            result = await this.apiService.storeData(this.$http, `employee/${localStorage.getItem('emp')}`, employee)
          }

          this.alert(result.data.status, result.data.message)
          this.reset()
          this.readUser()
        }
      },

      reset () {
        Object.keys(this.form).forEach((key) => {
          this.form[key] = null
        })
        this.selectedFile = null
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.loadingButton = false
      },

      fotoPreview () {
        if (this.selectedFile === null && this.form.picture) {
          return this.$file + this.form.picture
        } else if (this.selectedFile !== null) {
          return URL.createObjectURL(this.selectedFile)
        }

        return null
      },

      onFileChanged (e) {
        this.selectedFile = e.target.files[0]
      },

      check (e) {
        if (e !== true) {
          this.form.password = null
          this.form.confirmPassword = null
        }
      },

      formatDigit (value) {
        const val = (value / 1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },

      formatExample (value) {
        const val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },

      async readTransactions () {
        // this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'transaction')
        this.dataTransaksi = result.data.data
        if (result.data.status === 'success') {
          this.valueStateTransaction = (this.dataTransaksi.length)
        }
        // this.progressLoading = false
      },

      async readCustomer () {
        // this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'customer')
        this.dataPelanggan = result.data.data
        if (result.data.status === 'success') {
          this.valueStateCustomer = this.dataPelanggan.length
        }
        // this.progressLoading = false
      },

      async dashboardCartBar () {
        // this.progressLoading = true
        const d = new Date()
        const result = await this.apiService.getData(this.$http, `dashboardProdukTerjual/${d.getFullYear()}`)
        this.dataCartBar = result.data.data

        for (let i = 0; i < this.dataCartBar.length; i++) {
          const bln = this.dataCartBar[i].bln
          this.datasetBar[bln - 1] = Math.floor(this.dataCartBar[i].success)
        }
        this.hightBar = Math.max(...this.dataCartBar.map(({ success }) => success))
        this.hightBar = this.hightBar + Math.ceil(this.hightBar * 0.25)
        // this.progressLoading = false
      },

      async dashboardCartLine () {
        // this.progressLoading = true
        const d = new Date()
        const result = await this.apiService.getData(this.$http, `dashboardJumlahTransaksi/${d.getFullYear()}`)
        this.dataCartLine = result.data.data

        for (let i = 0; i < this.dataCartLine.length; i++) {
          const bln = this.dataCartLine[i].bln
          this.datasetLine[bln - 1] = Math.floor(this.dataCartLine[i].success)
        }
        this.hightLine = Math.max(...this.dataCartLine.map(({ success }) => success))
        this.hightLine = this.hightLine + Math.ceil(this.hightLine * 0.25)
        // this.progressLoading = false
      },
    },
  }
</script>
