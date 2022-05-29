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
      route('Role', null, 'role'),
      route('Pegawai', null, 'pegawai'),
      route('Produk', null, 'produk'),
      route('Supplier', null, 'supplier'),
      route('Kategori', null, 'kategori'),
      route('Kota', null, 'kota'),
      route('Truk Ekspedisi', null, 'truk-ekspedisi'),
      route('Bank', null, 'bank'),
      route('Transaksi Pelanggan', null, 'transaksi-pelanggan'),
      route('Status Transaksi', null, 'status-transaksi'),
      route('Pelanggan', null, 'pelanggan'),
      // route('Error', null, '*'),

      // Pages
      route('UserProfile', null, 'components/profile'),
      // Components
      route('Notifications', null, 'components/notifications'),
      route('Icons', null, 'components/icons'),
      route('Typography', null, 'components/typography'),
      // Tables
      route('Regular Tables', null, 'tables/regular'),
      // Maps
      route('Google Maps', null, 'maps/google'),
    ]),
  ],
})

router.beforeEach((to, from, next) => {
  return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
})

export default router
