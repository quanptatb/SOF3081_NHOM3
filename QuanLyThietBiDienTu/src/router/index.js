import { createRouter, createWebHistory } from "vue-router";

import ProductAdmin from "@/views/admin/ProductAdmin.vue";
import ProductDetail from "@/views/admin/ProductDetail.vue";

import UserProduct from "@/views/UserProduct.vue";
import ProductDetailUser from "@/views/ProductDetailUser.vue";

import Cart from "../views/Cart.vue";
import Checkout from "../views/Checkout.vue";

import UserAdmin from "@/views/admin/UserAdmin.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import OrderAdmin from "@/views/admin/OrderAdmin.vue";

const routes = [
  // --- Auth Routes (Không dùng AdminLayout) ---
  {
    path: '/login',
    component: Login,
    meta: { layout: 'empty' } 
  },
  {
    path: '/register',
    component: Register,
    meta: { layout: 'empty' }
  },

  // --- Admin Routes ---
  {
    path: '/admin/products',
    component: ProductAdmin,
  },
  {
    path: '/admin/products/:id',
    component: ProductDetail,
  },
  {
    path: '/admin/users', // Route mới cho User
    component: UserAdmin,
  },
    {
    path: '/admin/Orders',
    component: OrderAdmin,
  },


  // --- User Routes ---
  {
    path: "/",
    component: UserProduct,
  },
  {
    path: "/productuser/:id",
    component: ProductDetailUser,
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

// Kiểm tra đăng nhập đơn giản (Navigation Guard)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('currentUser');
  if (to.path.startsWith('/admin') && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
