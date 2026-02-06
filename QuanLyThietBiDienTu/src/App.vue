<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Import các layout
import AdminLayout from './layouts/AdminLayout.vue';
import UserLayout from './layouts/UserLayout.vue';

const route = useRoute();

/**
 * Logic xác định Layout:
 * 1. Nếu meta.layout = 'empty' -> Không dùng layout nào (Login/Register)
 * 2. Nếu đường dẫn bắt đầu bằng '/admin' -> AdminLayout
 * 3. Còn lại -> UserLayout (Trang chủ, Giỏ hàng...)
 */
const currentLayout = computed(() => {
  if (route.meta.layout === 'empty') return 'empty';
  if (route.path.startsWith('/admin')) return AdminLayout;
  return UserLayout;
});
</script>

<template>
  <div v-if="currentLayout === 'empty'">
    <router-view />
  </div>

  <component v-else :is="currentLayout">
    <router-view />
  </component>
</template>

<style>
/* CSS Reset mặc định */
body {
  background-color: #f5f5f5;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* --- ĐOẠN CODE GHI ĐÈ MÀU HEADER --- */
/* Tìm tất cả các thanh navbar hoặc nền xanh dương (bg-primary) và đổi thành Tím Gradient */
.navbar, 
header, 
.bg-primary, 
.header-wrapper { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  background-color: transparent !important; /* Xóa màu nền đơn sắc nếu có */
  border-color: transparent !important;
}

/* Đổi màu nút Tìm kiếm (nếu nó đang là màu vàng/cam) cho hợp tông tím */
.btn-warning, 
.btn-search {
  background-color: #f3f0ff !important;
  color: #6f42c1 !important;
  border: 1px solid #ffffff !important;
}

/* Chỉnh icon giỏ hàng và thông báo cho nổi bật trên nền tím */
.badge.bg-danger {
  background-color: #ff4757 !important; /* Màu đỏ tươi hơn */
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* Sửa màu logo Shop Điện Tử (nếu là text) */
.navbar-brand, .logo-text {
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>