<template>
  <div class="d-flex flex-column min-vh-100 font-read">
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary sticky-top shadow-sm py-2">
      <div class="container gap-lg-3">
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 flex-shrink-0">
          <span class="fs-2">🛍️</span> <span class="d-none d-sm-inline">Shop Điện Tử</span>
        </router-link>

        <div class="flex-grow-1 mx-lg-4 d-none d-lg-block">
          <div class="input-group nav-search-group shadow-sm">
            <input 
              type="text" 
              class="form-control border-0 px-3" 
              placeholder="Bạn tìm gì..." 
              v-model="navSearch"
              @input="emitFilter"
            />
            
            <select class="form-select border-0 border-start nav-select" v-model="navCategory" @change="emitFilter">
              <option value="Tất cả">Danh mục</option>
              <option>CPU</option>
              <option>RAM</option>
              <option>GPU</option>
              <option>SSD</option>
              <option>HDD</option>
            </select>

            <select class="form-select border-0 border-start nav-select" v-model="navPrice" @change="emitFilter">
              <option value="Tất cả">Giá</option>
              <option>Dưới 2 triệu</option>
              <option>2 – 5 triệu</option>
              <option>Trên 5 triệu</option>
            </select>

            <button class="btn btn-warning px-3 border-0"><i class="bi bi-search text-dark"></i></button>
          </div>
        </div>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse flex-grow-0" id="navbarNav">
          <div class="d-flex align-items-center gap-3 actions-area">
            <router-link to="/cart" class="btn btn-cart position-relative border-0 text-white text-decoration-none">
              <i class="bi bi-cart3 fs-5"></i>
              <span class="d-none d-md-inline ms-2">Giỏ hàng</span>
              <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </router-link>

            <div v-if="currentUser" class="dropdown">
              <button class="btn btn-user text-white dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                <div class="avatar-circle">{{ currentUser.name.charAt(0).toUpperCase() }}</div>
                <span class="d-none d-md-inline">{{ currentUser.name }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow animate-slide-in">
                <li v-if="currentUser.role === 'admin'"><router-link to="/admin" class="dropdown-item">Quản trị</router-link></li>
                <li><router-link to="/profile" class="dropdown-item">Hồ sơ</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger" @click="handleLogout">Đăng xuất</button></li>
              </ul>
            </div>
            <div v-else class="auth-buttons">
              <router-link to="/login" class="btn btn-outline-light me-2 btn-sm">Đăng nhập</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-fill bg-light py-4">
      <div class="container animate-fade-in">
        <slot />
      </div>
    </main>

    <footer class="bg-dark text-white text-center py-4 mt-auto">
      <div class="container">
        <p class="mb-1 fw-bold">Hệ thống Quản lý Thiết bị Điện tử</p>
        <small class="text-white-50">© 2026 SD21305. All rights reserved.</small>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const navSearch = ref('');
const navCategory = ref('Tất cả');
const navPrice = ref('Tất cả');
const currentUser = ref(null);

onMounted(() => {
  const stored = localStorage.getItem('currentUser');
  if (stored) currentUser.value = JSON.parse(stored);
});

// 🚀 Phát tín hiệu lọc toàn ứng dụng
const emitFilter = () => {
  window.dispatchEvent(new CustomEvent('nav-search-filter', {
    detail: { search: navSearch.value, category: navCategory.value, price: navPrice.value }
  }));
};

const handleLogout = () => {
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
};

</script>

<style scoped>
.bg-gradient-primary { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); }
.nav-search-group { background: white; border-radius: 8px; overflow: hidden; height: 40px; }
.nav-select { max-width: 130px; font-size: 13px; background-color: #f8f9fa; cursor: pointer; border-left: 1px solid #dee2e6 !important; }
.avatar-circle { width: 32px; height: 32px; background: white; color: #0d6efd; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
</style>