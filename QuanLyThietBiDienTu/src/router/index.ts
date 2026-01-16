// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import UserProduct from '@/views/UserProduct.vue'
import ProductDetail from '@/views/ProductDetail.vue'

const routes = [
  { path: '/', component: UserProduct },
  { path: '/product/:id', component: ProductDetail }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
