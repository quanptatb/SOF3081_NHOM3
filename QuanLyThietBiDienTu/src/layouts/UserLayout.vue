<template>
  <div class="user-layout">
    <!-- Navigation Bar -->
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="navbar-container">
        <!-- Brand Logo -->
        <router-link to="/" class="navbar-brand" aria-label="Shop Điện Tử Home">
          <span class="brand-icon" aria-hidden="true">🛍️</span>
          <span class="brand-text">Shop Điện Tử</span>
        </router-link>

        <!-- Mobile Toggle Button -->
        <button class="navbar-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Menu -->
        <div class="navbar-collapse collapse" id="navbarNav">
          <!-- Main Navigation Links -->
          <ul class="navbar-nav" role="menubar">
            <li v-for="link in navigationLinks" :key="link.to" class="nav-item" role="none">
              <router-link :to="link.to" class="nav-link" active-class="nav-link-active" :aria-label="link.label"
                role="menuitem">
                <i :class="link.icon" aria-hidden="true"></i>
                <span>{{ link.label }}</span>
              </router-link>
            </li>
          </ul>

          <!-- Action Buttons Area -->
          <div class="navbar-actions">
            <!-- Shopping Cart -->
            <router-link to="/cart" class="btn-cart" aria-label="Giỏ hàng">
              <i class="bi bi-cart3" aria-hidden="true"></i>
              <span class="cart-text">Giỏ hàng</span>
              <span v-if="cartItemCount > 0" class="cart-badge" :aria-label="`${cartItemCount} items in cart`">
                {{ cartItemCount }}
              </span>
            </router-link>

            <!-- User Menu (Logged In) -->
            <div v-if="isLoggedIn" class="dropdown user-dropdown">
              <button class="btn-user dropdown-toggle" type="button" data-bs-toggle="dropdown"
                :aria-label="`User menu for ${userDisplayName}`" aria-expanded="false">
                <div class="user-avatar" :aria-hidden="true">
                  {{ userInitial }}
                </div>
                <span class="user-name">{{ userDisplayName }}</span>
              </button>

              <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="isAdmin">
                  <router-link to="/admin" class="dropdown-item">
                    <i class="bi bi-speedometer2" aria-hidden="true"></i>
                    <span>Trang quản trị</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/profile" class="dropdown-item">
                    <i class="bi bi-person" aria-hidden="true"></i>
                    <span>Hồ sơ</span>
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li>
                  <button class="dropdown-item dropdown-item-danger" @click="handleLogout" aria-label="Đăng xuất">
                    <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
                    <span>Đăng xuất</span>
                  </button>
                </li>
              </ul>
            </div>

            <!-- Auth Buttons (Not Logged In) -->
            <div v-else class="auth-buttons">
              <router-link to="/login" class="btn-auth btn-auth-outline" aria-label="Đăng nhập">
                Đăng nhập
              </router-link>
              <router-link to="/register" class="btn-auth btn-auth-solid" aria-label="Đăng ký">
                Đăng ký
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content" role="main">
      <div class="content-container">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer" role="contentinfo">
      <div class="footer-container">
        <p class="footer-title">Hệ thống Quản lý Thiết bị Điện tử</p>
        <small class="footer-copyright">© 2026 SD21305. All rights reserved.</small>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentUser = ref(null);
const cartItemCount = ref(0);

/**
 * Navigation links configuration
 */
const navigationLinks = [
  {
    to: '/',
    icon: 'bi bi-house-door me-1',
    label: 'Sản phẩm'
  },
  // Add more navigation links as needed
  // { to: '/about', icon: 'bi bi-info-circle me-1', label: 'Về chúng tôi' },
  // { to: '/contact', icon: 'bi bi-envelope me-1', label: 'Liên hệ' },
];

/**
 * Computed properties for better performance
 */
const isLoggedIn = computed(() => currentUser.value !== null);
const userDisplayName = computed(() => currentUser.value?.name || 'User');
const userInitial = computed(() => userDisplayName.value.charAt(0).toUpperCase());
const isAdmin = computed(() => currentUser.value?.role === 'admin');

/**
 * Load user data and cart count with error handling
 */
const loadUserData = () => {
  try {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      currentUser.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    currentUser.value = null;
  }
};

/**
 * Load cart count from localStorage
 */
const loadCartCount = () => {
  try {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const cartData = JSON.parse(cart);
      cartItemCount.value = Array.isArray(cartData) ? cartData.length : 0;
    } else {
      cartItemCount.value = 0;
    }
  } catch (error) {
    console.error('Error loading cart count:', error);
    cartItemCount.value = 0;
  }
};

/**
 * Handle user logout with error handling
 */
const handleLogout = () => {
  try {
    localStorage.removeItem('currentUser');
    currentUser.value = null;
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
    // Still attempt to redirect even if localStorage fails
    router.push('/login');
  }
};

/**
 * Watch for cart changes in localStorage
 */
watch(
  () => localStorage.getItem('cart'),
  () => {
    loadCartCount();
  }
);

/**
 * Initialize on mount
 */
onMounted(() => {
  loadUserData();
  loadCartCount();

  // Listen for storage events from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
      loadUserData();
    }
    if (e.key === 'cart') {
      loadCartCount();
    }
  });
});
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --navbar-height: 70px;
  --primary-gradient: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  --primary-color: #0d6efd;
  --danger-color: #dc3545;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  --white-color: #ffffff;
  --transition-speed: 0.2s;
  --transition-ease: ease-in-out;
  --border-radius: 8px;
  --border-radius-pill: 20px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Layout Container */
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Navigation Bar */
.navbar {
  background: var(--primary-gradient);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
  height: var(--navbar-height);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--white-color);
  text-decoration: none;
  transition: opacity var(--transition-speed) var(--transition-ease);
}

.navbar-brand:hover {
  opacity: 0.9;
  color: var(--white-color);
}

.brand-icon {
  font-size: 1.75rem;
}

.brand-text {
  display: none;
}

/* Mobile Toggle */
.navbar-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--white-color);
  cursor: pointer;
}

.navbar-toggler-icon {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

/* Navigation Collapse */
.navbar-collapse {
  display: none;
  flex-basis: 100%;
  flex-grow: 1;
  align-items: center;
}

.navbar-collapse.show {
  display: flex;
}

/* Navigation Links */
.navbar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.nav-item {
  list-style: none;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: var(--border-radius-pill);
  transition: all var(--transition-speed) var(--transition-ease);
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--white-color);
}

.nav-link-active {
  background: rgba(255, 255, 255, 0.2);
  color: var(--white-color);
  font-weight: 700;
}

/* Actions Area */
.navbar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* Cart Button */
.btn-cart {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--white-color);
  text-decoration: none;
  background: transparent;
  border: none;
  border-radius: var(--border-radius);
  transition: all var(--transition-speed) var(--transition-ease);
  font-weight: 500;
  position: relative;
}

.btn-cart:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--white-color);
}

.cart-text {
  display: none;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--danger-color);
  color: var(--white-color);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary-color);
}

/* User Dropdown */
.user-dropdown {
  position: relative;
}

.btn-user {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: transparent;
  border: none;
  color: var(--white-color);
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: background var(--transition-speed) var(--transition-ease);
  font-weight: 500;
}

.btn-user:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: var(--white-color);
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.user-name {
  display: none;
}

/* Dropdown Menu */
.dropdown-menu {
  min-width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  background: var(--white-color);
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  color: var(--dark-color);
  text-decoration: none;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  transition: background var(--transition-speed) var(--transition-ease);
  cursor: pointer;
  font-weight: 500;
}

.dropdown-item:hover {
  background: var(--light-color);
  color: var(--dark-color);
}

.dropdown-item-danger {
  color: var(--danger-color);
}

.dropdown-item-danger:hover {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger-color);
}

/* Auth Buttons */
.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-auth {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: all var(--transition-speed) var(--transition-ease);
  border: 2px solid var(--white-color);
}

.btn-auth-outline {
  background: transparent;
  color: var(--white-color);
}

.btn-auth-outline:hover {
  background: var(--white-color);
  color: var(--primary-color);
}

.btn-auth-solid {
  background: var(--white-color);
  color: var(--primary-color);
  border-color: var(--white-color);
}

.btn-auth-solid:hover {
  background: transparent;
  color: var(--white-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1.5rem 0;
  background: var(--light-color);
  animation: fadeIn 0.5s ease-out;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Footer */
.footer {
  background: var(--dark-color);
  color: var(--white-color);
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-title {
  margin: 0 0 0.5rem;
  font-weight: 700;
  font-size: 1rem;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Responsive Design */
@media (min-width: 576px) {
  .brand-text {
    display: inline;
  }

  .cart-text {
    display: inline;
  }
}

@media (min-width: 768px) {
  .user-name {
    display: inline;
  }
}

@media (min-width: 992px) {
  .navbar-toggle {
    display: none;
  }

  .navbar-collapse {
    display: flex !important;
    flex-direction: row;
  }

  .navbar-nav {
    flex-direction: row;
    margin: 0;
    margin-left: 2rem;
  }

  .navbar-actions {
    flex-direction: row;
    margin-top: 0;
    margin-left: auto;
    gap: 1rem;
  }

  .auth-buttons {
    flex-direction: row;
    gap: 0.75rem;
  }

  .cart-badge {
    top: -8px;
    right: -8px;
  }
}

@media (min-width: 1200px) {

  .content-container,
  .navbar-container,
  .footer-container {
    max-width: 1400px;
  }
}
</style>