<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <router-link to="/admin" class="brand-link">
          <div class="icon-box">
            <i class="bi bi-shield-lock-fill text-purple"></i>
          </div>
          <h5 class="sidebar-title">ADMIN PANEL</h5>
        </router-link>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-section-title">Quản lý</li>

          <li v-for="item in managementMenu" :key="item.to" class="nav-item">
            <router-link 
              :to="item.to" 
              class="nav-link" 
              active-class="active"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>

          <li class="nav-section-title mt-3">Lối tắt</li>

          <li v-for="item in shortcutMenu" :key="item.to" class="nav-item">
            <router-link 
              :to="item.to" 
              class="nav-link"
              :active-class="item.exact !== false ? 'active' : ''"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">
            {{ userInitial }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ userDisplayName }}</span>
            <span class="user-role">Admin</span>
          </div>
        </div>
      </div>
    </aside>

    <div class="main-container">
      <header class="main-header">
        <div class="d-flex align-items-center">
          <h5 class="header-title mb-0">Hệ thống quản trị</h5>
        </div>
        
        <button @click="handleLogout" class="btn-logout">
          <i class="bi bi-box-arrow-right"></i>
          <span>Đăng xuất</span>
        </button>
      </header>

      <main class="main-content">
        <div class="content-wrapper">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentUser = ref(null);

// Menu Configuration (LOGIC GIỮ NGUYÊN)
const managementMenu = [
  { to: "/admin/users", icon: "👥", label: "Người dùng" },
  { to: "/admin/products", icon: "💻", label: "Thiết bị" },
];

const shortcutMenu = [
  { to: "/admin/orders", icon: "📦", label: "Đơn hàng" },
  { to: "/", icon: "🛍️", label: "Xem Shop", exact: false },
];

// Computed
const userDisplayName = computed(() => currentUser.value?.name || "Administrator");
const userInitial = computed(() => userDisplayName.value.charAt(0).toUpperCase());

// Lifecycle
onMounted(() => {
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      currentUser.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
});

// Logout
const handleLogout = () => {
  try {
    localStorage.removeItem("currentUser");
    router.push("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    router.push("/login");
  }
};
</script>

<style scoped>
/* 1. SIDEBAR STYLES (Đã sửa lỗi hiển thị) */
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f3f6f9;
}

.sidebar {
  width: 260px;
  /* Ép màu nền tím gradient */
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%) !important;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  color: white !important; /* Ép màu chữ trắng */
  height: 100vh;
  position: fixed; /* Cố định sidebar */
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 4px 0 10px rgba(0,0,0,0.1);
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white !important;
}

.icon-box {
  width: 35px;
  height: 35px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-purple { 
  color: #6f42c1 !important; 
  font-size: 1.2rem;
}

.sidebar-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: white;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.nav-section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  list-style: none;
}

.nav-list {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  list-style: none;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9) !important; /* Màu chữ menu */
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white !important;
  transform: translateX(5px);
}

/* Active State */
.nav-link.active {
  background: white !important;
  color: #6f42c1 !important; /* Chữ tím khi active */
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  font-weight: 700;
}

.nav-icon {
  margin-right: 12px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.nav-text {
  font-size: 0.95rem;
}

/* Footer User */
.sidebar-footer {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 42px;
  height: 42px;
  background: white;
  color: #6f42c1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
}

.user-role {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  margin-top: 2px;
  color: white;
}

/* 2. MAIN CONTENT STYLES */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px; /* Đẩy nội dung sang phải bằng chiều rộng sidebar */
  height: 100vh;
  overflow: hidden;
}

.main-header {
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  z-index: 90;
}

.header-title {
  color: #4b5563;
  font-weight: 700;
}

.btn-logout {
  background: #fff5f5;
  color: #dc3545;
  border: 1px solid #ffcccc;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #f8f9fa;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #c4c4c4;
  border-radius: 3px;
}
</style>