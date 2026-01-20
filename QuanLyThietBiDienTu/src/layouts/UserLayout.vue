<template>
  <div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold">
          🛍️ Shop Điện Tử
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active">Sản phẩm</router-link>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-3">
            <router-link to="/cart" class="btn btn-light position-relative text-primary border-0">
              🛒 <span class="d-none d-md-inline">Giỏ hàng</span>
            </router-link>

            <div v-if="currentUser" class="dropdown">
              <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                👤 {{ currentUser.name }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="currentUser.role === 'admin'">
                  <router-link to="/admin" class="dropdown-item">Trang quản trị</router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger" @click="handleLogout">Đăng xuất</button></li>
              </ul>
            </div>

            <div v-else>
              <router-link to="/login" class="btn btn-outline-light me-2">Đăng nhập</router-link>
              <router-link to="/register" class="btn btn-light text-primary">Đăng ký</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-fill bg-light py-4">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="bg-white text-center py-3 border-top mt-auto">
      <small class="text-muted">© 2026 SD21305 - Quản lý thiết bị điện tử</small>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentUser = ref(null);

onMounted(() => {
  const stored = localStorage.getItem('currentUser');
  if (stored) currentUser.value = JSON.parse(stored);
});

const handleLogout = () => {
  localStorage.removeItem('currentUser');
  // Reload lại trang để reset state hoặc push về login
  window.location.href = '/login'; 
};
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}
</style>