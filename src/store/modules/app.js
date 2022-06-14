// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  items: [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      to: '/',
    },
    {
      title: 'Pegawai',
      icon: 'mdi-badge-account',
      to: '/pegawai/',
    },
    {
      title: 'Pelanggan',
      icon: 'mdi-account',
      to: '/pelanggan/',
    },
    {
      title: 'Produk',
      icon: 'mdi-archive-outline',
      to: '/produk/',
    },
    {
      title: 'Kota',
      icon: 'mdi-google-maps',
      to: '/kota/',
    },
    {
      title: 'Truk Ekspedisi',
      icon: 'mdi-truck-cargo-container',
      to: '/truk-ekspedisi/',
    },
    {
      title: 'Bank',
      icon: 'mdi-cash-multiple',
      to: '/bank/',
    },
    {
      title: 'Transaksi Pelanggan',
      icon: 'mdi-paper-roll-outline',
      to: '/transaksi-pelanggan/',
    },
    {
      title: 'Pengiriman Transaksi',
      icon: 'mdi-shipping-pallet',
      to: '/pengiriman-transaksi/',
    },
    {
      title: 'Laporan',
      icon: 'mdi-book-open-variant',
      to: '/laporan/',
    },
  ],
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
