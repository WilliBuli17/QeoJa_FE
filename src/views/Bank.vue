<template>
  <v-container
    id="bank-view"
    fluid
    tag="section"
  >
    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-cash-multiple"
          icon-small
          title="Bank"
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
            :items="dataBank"
            :search="search"
          >
            <template v-slot:[`item.index`]="{ item }">
              {{ dataBank.indexOf(item) + 1 }}
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
                {{ action }} Bank
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
              Apakah Anda Yakin Ingin Menghapus Data Bank {{ form.bankName }} - {{ form.accountName }}?
            </v-card-text>

            <v-card-text
              v-else
            >
              <app-text-input
                v-model="form.bankName"
                :rules="bankNameRules"
                label="Nama Bank"
              />

              <app-text-input
                v-model="form.accountName"
                :rules="accountNameRules"
                label="Nama Akun"
              />

              <app-text-input
                v-model="form.accountNumber"
                :rules="accountNumberRules"
                label="No. Rek."
              />
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
                {{ action }}
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
    name: 'BankView',

    data: () => ({
      dialog: false,
      action: null,
      form: {
        bankName: null,
        accountName: null,
        accountNumber: null,
      },
      bankNameRules: [
        v => !!v || 'Nama Bank Harus Diisi',
        v => (v && v.length <= 100) || 'Nama Bank Tidak Boleh Lebih Dari 100 Karakter',
      ],
      accountNameRules: [
        v => !!v || 'Nama Akun Harus Diisi',
        v => (v && v.length <= 100) || 'Nama Akun Tidak Boleh Lebih Dari 100 Karakter',
      ],
      accountNumberRules: [
        v => !!v || 'No. Rek. Harus Diisi',
        (v) => !v || /^[1-9]\d*$/.test(v) || 'Format No. Rek. Tidak Valid',
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
          text: 'Nama Bank',
          value: 'bank_name',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Nama Akun',
          value: 'account_name',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'No. Rek.',
          value: 'account_number',
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
      dataBank: [],
      search: null,
      editDeleteID: null,
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
          case 'sm': return '60%'
          case 'md': return '40%'
          case 'lg': return '25%'
          case 'xl': return '15%'
          default : return '100%'
        }
      },
    },

    mounted () {
      this.read()
    },

    methods: {
      dialogOpen (action, item) {
        if (action === 'Ubah' || action === 'Hapus') {
          this.editDeleteID = item.id
          this.form.bankName = item.bank_name
          this.form.accountName = item.account_name
          this.form.accountNumber = item.account_number
        }
        this.action = action
        this.dialog = true
      },
      dialogClose () {
        this.dialog = false
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
          result = await this.apiService.deleteData(this.$http, `bankPayment/${this.editDeleteID}`)

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        } else if (this.$refs.form.validate()) {
          this.loadingButton = true
          if (this.action === 'Tambah') {
            const bank = new FormData()
            bank.append('bank_name', this.form.bankName)
            bank.append('account_name', this.form.accountName)
            bank.append('account_number', this.form.accountNumber)
            result = await this.apiService.storeData(this.$http, 'bankPayment', bank)
          } else if (this.action === 'Ubah') {
            const newData = {
              bank_name: this.form.bankName,
              account_name: this.form.accountName,
              account_number: this.form.accountNumber,
            }
            result = await this.apiService.updateData(this.$http, `bankPayment/${this.editDeleteID}`, newData)
          }

          this.alert(result.data.status, result.data.message)
          this.read()
          this.dialogClose()
        }
      },
      async read () {
        this.progressLoading = true
        const result = await this.apiService.getData(this.$http, 'bankPayment')
        this.dataBank = result.data.data
        this.progressLoading = false
        this.alert(result.data.status, result.data.message)
      },
    },
  }
</script>
