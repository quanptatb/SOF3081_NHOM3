import { createRouter, createWebHistory } from "vue-router";

import ProductAdmin from "@/views/admin/ProductAdmin.vue";
import ProductDetail from "@/views/admin/ProductDetail.vue";

import UserProduct from "@/views/UserProduct.vue";
import ProductDetailUser from "@/views/ProductDetailUser.vue";

import Cart from "../views/Cart.vue";
import Checkout from "../views/Checkout.vue";

const routes = [
  {
    path: '/admin/products',
    component: ProductAdmin,
  },
  {
    path: '/admin/products/:id',
    component: ProductDetail,
  },
  {
    path: "/",
    component: UserProduct,
  },
  {
    path: "/productuser/:id",
    component: ProductDetailUser,
  },
  {
    path: "/",
    redirect: "/cart",
  },
  {
    path: "/cart",
    component: Cart,
  },
  {
    path: "/checkout",
    component: Checkout,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
