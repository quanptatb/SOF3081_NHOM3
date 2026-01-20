<template>
  <div class="d-flex flex-column min-vh-100 font-read">
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary sticky-top shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4">
          <span class="fs-2">🛍️</span> Shop Điện Tử
        </router-link>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li class="nav-item">
              <router-link to="/" class="nav-link px-3" active-class="active fw-bold">
                <i class="bi bi-house-door me-1"></i> Sản phẩm
              </router-link>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-3 actions-area">
            <router-link to="/cart" class="btn btn-cart position-relative border-0 text-white">
              <i class="bi bi-cart3 fs-5"></i>
              <span class="d-none d-md-inline ms-2">Giỏ hàng</span>
              <span
                class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span class="visually-hidden">New alerts</span>
              </span>
            </router-link>

            <div v-if="currentUser" class="dropdown">
              <button class="btn btn-user text-white dropdown-toggle d-flex align-items-center gap-2" type="button"
                data-bs-toggle="dropdown">
                <div class="avatar-circle">{{ currentUser.name.charAt(0).toUpperCase() }}</div>
                <span class="d-none d-md-inline">{{ currentUser.name }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow animate-slide-in">
                <li v-if="currentUser.role === 'admin'">
                  <router-link to="/admin" class="dropdown-item">
                    <i class="bi bi-speedometer2 me-2"></i>Trang quản trị
                  </router-link>
                </li>
                <li><router-link to="/profile" class="dropdown-item"><i class="bi bi-person me-2"></i>Hồ
                    sơ</router-link></li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li><button class="dropdown-item text-danger" @click="handleLogout"><i
                      class="bi bi-box-arrow-right me-2"></i>Đăng xuất</button></li>
              </ul>
            </div>

            <div v-else class="auth-buttons">
              <router-link to="/login" class="btn btn-outline-light me-2 fw-semibold">Đăng nhập</router-link>
              <router-link to="/register" class="btn btn-light text-primary fw-bold">Đăng ký</router-link>
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
import { useRouter } from 'vue-router';

const router = useRouter();
const currentUser = ref(null);

onMounted(() => {
  const stored = localStorage.getItem('currentUser');
  if (stored) currentUser.value = JSON.parse(stored);
});

const handleLogout = () => {
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
};
</script>

<style scoped>
/* Gradient Background đẹp hơn màu primary thường */
.bg-gradient-primary {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
}

.nav-link {
  border-radius: 20px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-cart:hover {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  background-color: white;
  color: #0d6efd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Animation nhẹ cho menu */
.animate-slide-in {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>