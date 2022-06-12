// Imports
import Vue from 'vue'
import Router from 'vue-router'
import { trailingSlash } from '@/util/helpers'
import {
  layout,
  route,
} from '@/util/routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    layout('Default', [
      route('Dashboard'),
      route('Role', null, 'role', ['Super Admin', 'Owner', 'Manager']),
      route('Pegawai', null, 'pegawai', ['Super Admin', 'Owner', 'Manager']),
      route('Produk', null, 'produk', ['Super Admin', 'Manager', 'Admin Gudang']),
      route('Supplier', null, 'supplier', ['Super Admin', 'Manager', 'Admin Gudang']),
      route('Kategori', null, 'kategori', ['Super Admin', 'Manager', 'Admin Gudang']),
      route('Riwayat Produk', null, 'riwayat-produk', ['Super Admin', 'Manager', 'Admin Gudang']),
      route('Kota', null, 'kota', ['Super Admin', 'Owner', 'Manager']),
      route('Truk Ekspedisi', null, 'truk-ekspedisi', ['Super Admin', 'Manager', 'Admin Ekspedisi']),
      route('Bank', null, 'bank', ['Super Admin', 'Owner', 'Manager']),
      route('Transaksi Pelanggan', null, 'transaksi-pelanggan', ['Super Admin', 'Manager', 'Admin Ekspedisi', 'Admin Gudang', 'Admin Penjualan']),
      route('Pengiriman Transaksi', null, 'pengiriman-transaksi', ['Super Admin', 'Manager', 'Admin Ekspedisi', 'Admin Gudang', 'Admin Penjualan']),
      route('Status Transaksi', null, 'status-transaksi', ['Super Admin', 'Manager']),
      route('Pelanggan', null, 'pelanggan', ['Super Admin', 'Manager', 'Admin Penjualan']),
      route('Laporan', null, 'laporan', ['Super Admin', 'Owner', 'Manager']),
      route('Login', null, 'login'),
      route('Error', null, '*'),
    ]),
  ],
})

router.beforeEach((to, from, next) => {
  // console.log(localStorage.getItem('user'))
  // console.log(localStorage.getItem('token'))
  // console.log(localStorage.getItem('emp'))
  // console.log(localStorage.getItem('role'))
  // console.log(sessionStorage.getItem('user'))
  // console.log(sessionStorage.getItem('token'))
  // console.log(sessionStorage.getItem('emp'))
  // console.log(sessionStorage.getItem('role'))

  // localStorage.removeItem('user')
  // localStorage.removeItem('token')
  // localStorage.removeItem('emp')
  // localStorage.removeItem('role')
  // sessionStorage.removeItem('user')
  // sessionStorage.removeItem('token')
  // sessionStorage.removeItem('emp')
  // sessionStorage.removeItem('role')

  let checkers = false
  if (!sessionStorage.getItem('token') && !localStorage.getItem('token')) {
    checkers = true
  } else {
    checkers = false
  }

  let role
  if (sessionStorage.getItem('token')) {
    role = sessionStorage.getItem('role')
  } else {
    role = localStorage.getItem('role')
  }

  if (to.name !== 'Login' && checkers === true) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && checkers === false) {
    next({ name: 'Dashboard' })
  } else if (checkers === false && to.meta.roles && !to.meta.roles.includes(role)) {
    next({ name: 'Dashboard' })
  } else {
    return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
  }
})

export default router
