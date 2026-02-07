import { createRouter, createWebHistory } from "vue-router";

// --- Admin Views ---
import ProductAdmin from "@/views/admin/ProductAdmin.vue";
import ProductDetail from "@/views/admin/ProductDetail.vue";
import UserAdmin from "@/views/admin/UserAdmin.vue";
import OrderAdmin from "@/views/admin/OrderAdmin.vue";

// --- User Views ---
import UserProduct from "@/views/UserProduct.vue";
import ProductDetailUser from "@/views/ProductDetailUser.vue";
import Cart from "../views/Cart.vue";
import Checkout from "../views/Checkout.vue";
import Profile from "../views/Profile.vue";
import UserOrders from "../views/UserOrders.vue";

// --- Auth Views ---
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";

const routes = [
  // --- Auth Routes ---
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
    meta: { requiresAuth: true, role: 'admin' } // Yêu cầu đăng nhập & quyền Admin
  },
  {
    path: '/admin/products/:id',
    component: ProductDetail,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    component: UserAdmin,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/orders',
    component: OrderAdmin,
    meta: { requiresAuth: true, role: 'admin' }
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
    meta: { requiresAuth: true } // User thường phải đăng nhập mới xem được giỏ hàng
  },
  {
    path: "/checkout",
    component: Checkout,
    meta: { requiresAuth: true } // Bắt buộc đăng nhập để thanh toán
  },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true } // Bắt buộc đăng nhập để xem profile
  },
  {
    path: "/orders",
    component: UserOrders,
    meta: { requiresAuth: true } // Bắt buộc đăng nhập để xem đơn mua
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// --- PHÂN QUYỀN & BẢO VỆ ROUTE (NAVIGATION GUARD) ---
router.beforeEach((to, from, next) => {
  // 1. Lấy thông tin user an toàn (tránh lỗi nếu localStorage rỗng)
  const userString = localStorage.getItem('currentUser');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Kiểm tra Route có yêu cầu đăng nhập không (requiresAuth)
  if (to.meta.requiresAuth) {
    // Nếu chưa đăng nhập -> Đá về Login
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      return next('/login');
    }

    // 3. Kiểm tra quyền (Role) nếu Route có yêu cầu role cụ thể
    if (to.meta.role && to.meta.role !== user.role) {
      alert("Bạn không có quyền truy cập trang này!");
      // Nếu là admin cố vào trang user thì ok, nhưng user thường vào trang admin thì đá về Home
      return next('/');
    }
  }

  // 4. Nếu mọi thứ hợp lệ -> Cho qua
  next();
});

export default router;