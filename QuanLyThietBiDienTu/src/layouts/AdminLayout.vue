<template>
  <div class="d-flex h-100vh overflow-hidden bg-light">
    <aside class="sidebar d-flex flex-column flex-shrink-0 text-white bg-dark shadow">
      <div class="p-3 text-center border-bottom border-secondary">
        <h5 class="fw-bold m-0 tracking-wide">ADMIN PANEL</h5>
      </div>

      <div class="flex-fill overflow-auto py-3 custom-scrollbar">
        <ul class="nav flex-column gap-2 px-2">
          <li class="nav-item">
            <span class="text-uppercase text-white-50 fs-xs px-3 fw-bold mb-1 d-block">Quản lý</span>
          </li>

          <li class="nav-item">
            <router-link to="/admin" class="nav-link d-flex align-items-center gap-2" active-class="active">
              <span>📊</span> Dashboard
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/admin/users" class="nav-link d-flex align-items-center gap-2" active-class="active">
              <span>👤</span> Người dùng
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/admin/products" class="nav-link d-flex align-items-center gap-2" active-class="active">
              <span>💻</span> Thiết bị
            </router-link>
          </li>

          <li class="nav-item mt-3">
            <span class="text-uppercase text-white-50 fs-xs px-3 fw-bold mb-1 d-block">Lối tắt</span>
          </li>
          <li class="nav-item">
            <router-link to="/admin/Orders" class="nav-link d-flex align-items-center gap-2" active-class="active">
              <span>📦</span> Order
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" class="nav-link d-flex align-items-center gap-2">
              <span>🛍️</span> Xem Shop
            </router-link>
          </li>
        </ul>
      </div>

      <div class="p-3 border-top border-secondary bg-dark-lighter">
        <div class="d-flex align-items-center gap-2">
          <div
            class="avatar-admin rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
            {{ currentUser?.name?.charAt(0) || 'A' }}
          </div>
          <div class="flex-fill overflow-hidden">
            <small class="d-block fw-bold text-truncate">{{ currentUser?.name || "Admin" }}</small>
            <small class="text-success" style="font-size: 11px;">● Online</small>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-fill d-flex flex-column h-100 overflow-hidden">
      <header
        class="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm z-index-1">
        <h5 class="m-0 fw-bold text-secondary">Hệ thống quản trị</h5>
        <button @click="handleLogout"
          class="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 transition-btn">
          <span>Đăng xuất</span>
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </header>

      <main class="p-4 flex-fill bg-light overflow-auto">
        <div class="container-fluid animate-fade-in">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentUser = ref(null);

onMounted(() => {
  const stored = localStorage.getItem("currentUser");
  if (stored) currentUser.value = JSON.parse(stored);
});

const handleLogout = () => {
  localStorage.removeItem("currentUser");
  router.push("/login");
};
</script>

<style scoped>
.h-100vh {
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: #1e1e2d !important;
  /* Màu dark modern */
  transition: all 0.3s;
}

.bg-dark-lighter {
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-link {
  color: #a2a3b7;
  border-radius: 8px;
  padding: 10px 16px;
  transition: 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transform: translateX(4px);
}

.nav-link.active {
  background: linear-gradient(90deg, #0d6efd 0%, #0056b3 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.fs-xs {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.avatar-admin {
  width: 36px;
  height: 36px;
  font-weight: bold;
}

.transition-btn {
  transition: all 0.2s;
}

.transition-btn:hover {
  transform: translateY(-2px);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>