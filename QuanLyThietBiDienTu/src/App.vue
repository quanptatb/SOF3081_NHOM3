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
body {
  background-color: #f5f5f5;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>