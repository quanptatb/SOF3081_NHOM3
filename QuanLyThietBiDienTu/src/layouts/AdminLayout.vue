<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h5 class="sidebar-title">ADMIN PANEL</h5>
      </div>

      <nav class="sidebar-nav" aria-label="Admin navigation">
        <ul class="nav-list">
          <!-- Management Section -->
          <li class="nav-section-title" aria-label="Quản lý">Quản lý</li>

          <li v-for="item in managementMenu" :key="item.to" class="nav-item">
            <router-link 
              :to="item.to" 
              class="nav-link" 
              active-class="active"
              :aria-label="item.label"
            >
              <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>

          <!-- Shortcuts Section -->
          <li class="nav-section-title nav-section-spacing" aria-label="Lối tắt">Lối tắt</li>

          <li v-for="item in shortcutMenu" :key="item.to" class="nav-item">
            <router-link 
              :to="item.to" 
              class="nav-link"
              :active-class="item.exact ? 'active' : ''"
              :aria-label="item.label"
            >
              <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="nav-text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- User Profile -->
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar" :aria-label="`Avatar of ${userDisplayName}`">
            {{ userInitial }}
          </div>
          <div class="user-info">
            <small class="user-name">{{ userDisplayName }}</small>
            <small class="user-status">● Online</small>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-container">
      <!-- Header -->
      <header class="main-header">
        <h5 class="header-title">Hệ thống quản trị</h5>
        <button 
          @click="handleLogout"
          class="btn-logout"
          aria-label="Đăng xuất"
        >
          <span>Đăng xuất</span>
          <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
        </button>
      </header>

      <!-- Content -->
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

/**
 * Menu configuration - extracted for better maintainability
 */
const managementMenu = [
  { to: "/admin", icon: "📊", label: "Dashboard" },
  { to: "/admin/users", icon: "👤", label: "Người dùng" },
  { to: "/admin/products", icon: "💻", label: "Thiết bị" },
];

const shortcutMenu = [
  { to: "/admin/Orders", icon: "📦", label: "Order" },
  { to: "/", icon: "🛍️", label: "Xem Shop", exact: false },
];

/**
 * Computed properties for better performance
 */
const userDisplayName = computed(() => currentUser.value?.name || "Admin");
const userInitial = computed(() => userDisplayName.value.charAt(0).toUpperCase());

/**
 * Load user data with error handling
 */
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

/**
 * Handle logout with error handling
 */
const handleLogout = () => {
  try {
    localStorage.removeItem("currentUser");
    router.push("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    // Still attempt to redirect even if localStorage fails
    router.push("/login");
  }
};
</script>

<style scoped>
/* CSS Custom Properties for theming */
:root {
  --sidebar-width: 250px;
  --sidebar-bg: #1e1e2d;
  --sidebar-text: #a2a3b7;
  --sidebar-text-hover: #fff;
  --sidebar-hover-bg: rgba(255, 255, 255, 0.08);
  --sidebar-active-gradient: linear-gradient(90deg, #0d6efd 0%, #0056b3 100%);
  --sidebar-active-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
  --avatar-size: 36px;
  --transition-speed: 0.2s;
  --transition-ease: ease-in-out;
}

/* Layout Container */
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f9fa;
}

/* Sidebar Styles */
.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s var(--transition-ease);
}

.sidebar-header {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  margin: 0;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 1.1rem;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 0;
}

/* Custom scrollbar */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-list {
  list-style: none;
  padding: 0 0.5rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-section-title {
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.25rem;
}

.nav-section-spacing {
  margin-top: 1rem;
}

.nav-item {
  list-style: none;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  color: var(--sidebar-text);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all var(--transition-speed) var(--transition-ease);
  will-change: transform, background-color, color;
}

.nav-link:hover {
  background: var(--sidebar-hover-bg);
  color: var(--sidebar-text-hover);
  transform: translateX(4px);
}

.nav-link.active {
  background: var(--sidebar-active-gradient);
  color: white;
  box-shadow: var(--sidebar-active-shadow);
}

.nav-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.nav-text {
  white-space: nowrap;
}

/* Sidebar Footer - User Profile */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.user-name {
  display: block;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  color: #28a745;
  font-size: 0.6875rem;
}

/* Main Container */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Header */
.main-header {
  background: white;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.header-title {
  margin: 0;
  font-weight: 700;
  color: #6c757d;
  font-size: 1.125rem;
}

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
  border: 1px solid #dc3545;
  background: transparent;
  color: #dc3545;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-speed) var(--transition-ease);
  font-weight: 500;
}

.btn-logout:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.btn-logout:active {
  transform: translateY(0);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1.5rem;
  background: #f8f9fa;
  overflow-y: auto;
}

.content-wrapper {
  max-width: 100%;
  animation: fadeIn 0.4s ease-out;
}

/* Animations */
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

/* Responsive Design */
@media (max-width: 768px) {
  .admin-layout {
    --sidebar-width: 200px;
  }
  
  .sidebar-title {
    font-size: 0.95rem;
  }
  
  .nav-text {
    font-size: 0.875rem;
  }
  
  .main-header {
    padding: 0.75rem 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .admin-layout {
    --sidebar-width: 60px;
  }
  
  .sidebar-title,
  .nav-text,
  .user-name,
  .user-status {
    display: none;
  }
  
  .nav-link {
    justify-content: center;
    padding: 0.75rem;
  }
  
  .user-info {
    display: none;
  }
}
</style>