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
        <!-- <v-col
          class="order-last order-lg-first"
          cols="12"
          lg="8"
        >
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col
                  v-for="(chart, i) in charts"
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
                  >
                    <template #subtitle>
                      <div class="font-weight-light text--secondary">
                        <div v-html="chart.subtitle" />
                      </div>
                    </template>

                    <template #actions>
                      <v-icon
                        class="mr-1"
                        small
                      >
                        mdi-clock-outline
                      </v-icon>

                      <span
                        class="text-caption grey--text font-weight-light"
                        v-text="chart.time"
                      />
                    </template>
                  </material-chart-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col
                  v-for="({ actionIcon, actionText, ...attrs }, i) in stats"
                  :key="i"
                  cols="12"
                  lg="6"
                >
                  <material-stat-card v-bind="attrs">
                    <template #actions>
                      <v-icon
                        class="mr-2"
                        small
                        v-text="actionIcon"
                      />
                      <div class="text-truncate">
                        {{ actionText }}
                      </div>
                    </template>
                  </material-stat-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col cols="12">
                  <material-card
                    color="accent"
                    full-header
                  >
                    <template #heading>
                      <v-tabs
                        v-model="tabs"
                        background-color="transparent"
                        slider-color="white"
                        class="pa-8"
                      >
                        <span
                          class="subheading font-weight-light mx-3"
                          style="align-self: center"
                        >Tasks:</span>
                        <v-tab class="mr-3">
                          <v-icon class="mr-2">
                            mdi-bug
                          </v-icon>
                          Bugs
                        </v-tab>
                        <v-tab class="mr-3">
                          <v-icon class="mr-2">
                            mdi-code-tags
                          </v-icon>
                          Website
                        </v-tab>
                        <v-tab>
                          <v-icon class="mr-2">
                            mdi-cloud
                          </v-icon>
                          Server
                        </v-tab>
                      </v-tabs>
                    </template>
                    <v-tabs-items
                      v-model="tabs"
                      background-color="transparent"
                    >
                      <v-tab-item
                        v-for="n in 3"
                        :key="n"
                      >
                        <v-card-text>
                          <template v-for="(task, i) in tasks[tabs]">
                            <v-row
                              :key="i"
                              align="center"
                              class="flex-nowrap"
                            >
                              <v-col cols="1">
                                <v-list-item-action>
                                  <v-simple-checkbox
                                    v-model="task.value"
                                    color="secondary"
                                  />
                                </v-list-item-action>
                              </v-col>

                              <v-col
                                class="font-weight-light"
                                cols="8"
                                v-text="task.text"
                              />

                              <v-col
                                cols="auto"
                                class="text-right"
                              >
                                <v-icon class="mx-1">
                                  mdi-pencil
                                </v-icon>

                                <v-icon
                                  class="mx-1"
                                  color="error"
                                >
                                  mdi-close
                                </v-icon>
                              </v-col>
                            </v-row>
                          </template>
                        </v-card-text>
                      </v-tab-item>
                    </v-tabs-items>
                  </material-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col> -->

        <v-col
          cols="12"
          lg="4"
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

      charts: [{
        type: 'Bar',
        color: 'primary',
        title: 'Website Views',
        subtitle: 'Last Campaign Performance',
        time: 'updated 10 minutes ago',
        data: {
          labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
          ],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 1000,
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
      }, {
        type: 'Line',
        color: 'success',
        title: 'Daily Sales',
        subtitle: '<i class="mdi mdi-arrow-up green--text"></i><span class="green--text">55%</span>&nbsp;increase in today\'s sales',
        time: 'updated 4 minutes ago',
        data: {
          labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
          series: [
            [230, 750, 450, 300, 280, 240, 200, 190],
          ],
        },
        options: {
          lineSmooth,
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      }],
      headers: [
        {
          sortable: false,
          text: 'ID',
          value: 'id',
        },
        {
          sortable: false,
          text: 'Name',
          value: 'name',
        },
        {
          sortable: false,
          text: 'Salary',
          value: 'salary',
          align: 'right',
        },
        {
          sortable: false,
          text: 'Country',
          value: 'country',
          align: 'right',
        },
        {
          sortable: false,
          text: 'City',
          value: 'city',
          align: 'right',
        },
      ],
      items: [
        {
          id: 1,
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738',
        },
        {
          id: 2,
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738',
        },
        {
          id: 3,
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142',
        },
        {
          id: 4,
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735',
        },
        {
          id: 5,
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542',
        },
      ],
      stats: [
        {
          actionIcon: 'mdi-alert',
          actionText: 'Get More Space...',
          color: '#FD9A13',
          icon: 'mdi-sofa-single',
          title: 'Bookings',
          value: '184',
        },
        {
          actionIcon: 'mdi-tag',
          actionText: 'Tracked from Google Analytics',
          color: 'primary',
          icon: 'mdi-chart-bar',
          title: 'Website Visits',
          value: '75.521',
        },
      ],
      tabs: 0,
      tasks: {
        0: [
          {
            text: 'Sign contract for "What are conference organizers afraid of?"',
            value: true,
          },
          {
            text: 'Lines From Great Russian Literature? Or E-mails From My Boss?',
            value: false,
          },
          {
            text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
            value: false,
          },
          {
            text: 'Create 4 Invisible User Experiences you Never Knew About',
            value: true,
          },
        ],
        1: [
          {
            text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
            value: true,
          },
          {
            text: 'Sign contract for "What are conference organizers afraid of?"',
            value: false,
          },
        ],
        2: [
          {
            text: 'Lines From Great Russian Literature? Or E-mails From My Boss?',
            value: false,
          },
          {
            text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
            value: true,
          },
          {
            text: 'Sign contract for "What are conference organizers afraid of?"',
            value: true,
          },
        ],
      },
    }),

    computed: {
      sales: get('sales/sales'),
      totalSales () {
        return this.sales.reduce((acc, val) => acc + val.salesInM, 0)
      },
    },

    mounted () {
      this.readUser()
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
    },
  }
</script>
