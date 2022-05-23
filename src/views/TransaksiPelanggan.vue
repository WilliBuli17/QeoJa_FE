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
        medium
        rel="noopener noreferrer"
        :to="'/status-transaksi/'"
      >
        <span>Kelola Status Transaksi</span>
      </app-btn>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'TransaksiPelangganView',
  }
</script>
