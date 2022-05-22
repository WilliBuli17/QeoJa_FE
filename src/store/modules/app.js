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
      // to: '/components/profile/',
    },
    {
      title: 'Produk',
      icon: 'mdi-archive-outline',
      to: '/produk/',
    },
    {
      title: 'Kota',
      icon: 'mdi-google-maps',
      to: '/role/',
    },
    {
      title: 'Truk Ekspedisi',
      icon: 'mdi-truck-cargo-container',
      to: '/role/',
    },
    {
      title: 'Bank',
      icon: 'mdi-cash-multiple',
      to: '/role/',
    },
    {
      title: 'Transaksi Pelanggan',
      icon: 'mdi-paper-roll-outline',
      // to: '/tables/regular/',
    },
    {
      title: 'Pengiriman Transaksi',
      icon: 'mdi-shipping-pallet',
      // to: '/tables/regular/',
    },
    {
      title: 'Laporan',
      icon: 'mdi-book-open-variant',
      // to: '/tables/regular/',
    },

    // {
    //   title: 'User Profile',
    //   icon: 'mdi-account',
    //   to: '/components/profile/',
    // },
    // {
    //   title: 'Regular Tables',
    //   icon: 'mdi-clipboard-outline',
    //   to: '/tables/regular/',
    // },
    // {
    //   title: 'Typography',
    //   icon: 'mdi-format-font',
    //   to: '/components/typography/',
    // },
    // {
    //   title: 'Icons',
    //   icon: 'mdi-chart-bubble',
    //   to: '/components/icons/',
    // },
    // {
    //   title: 'Google Maps',
    //   icon: 'mdi-map-marker',
    //   to: '/maps/google/',
    // },
    // {
    //   title: 'Notifications',
    //   icon: 'mdi-bell',
    //   to: '/components/notifications/',
    // },
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
