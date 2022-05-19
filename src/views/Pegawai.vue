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
        width="100"
        :to="'/role/'"
      >
        <span>Kelola Role</span>
      </app-btn>
    </v-row>

    <v-row>
      <v-col cols="12">
        <material-card
          icon="mdi-badge-account"
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
                target="_blank"
                :width="width"
              >
                <span>Tambah Data</span>
              </app-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
          >
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PegawaiView',

    data: () => ({
      headers: [
        {
          text: 'No',
          value: 'no',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Avatar',
          value: 'avatar',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Nama',
          value: 'nama',
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
          value: 'status',
          align: 'start',
          sortable: true,
          class: 'primary--text',
        },
        {
          text: 'Action',
          value: 'action',
          align: 'end',
          sortable: true,
          class: 'primary--text',
        },
      ],
    }),
    computed: {
      width () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '100%'
          case 'sm': return '100%'
          case 'md': return '40%'
          case 'lg': return '25%'
          case 'xl': return '15%'
          default : return '100%'
        }
      },
    },
  }
</script>
