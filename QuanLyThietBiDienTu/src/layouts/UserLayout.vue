<template>
  <div class="d-flex flex-column min-vh-100 font-read">
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-purple sticky-top shadow-sm py-2">
      <div class="container gap-lg-3">
        
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 flex-shrink-0">
          <div class="logo-icon-box">
            <i class="bi bi-bag-heart-fill text-purple"></i>
          </div>
          <span class="d-none d-sm-inline tracking-tight text-white" style="text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Shop Điện Tử</span>
        </router-link>

        <div class="flex-grow-1 mx-lg-5 d-none d-lg-block">
          <div class="input-group nav-search-pill shadow-sm">
            <input 
              type="text" 
              class="form-control border-0 ps-4 bg-transparent search-input" 
              placeholder="Bạn muốn tìm gì..." 
              v-model="navSearch"
              @input="emitFilter" 
            />

            <div class="divider-vertical"></div>

            <select class="form-select border-0 nav-select" v-model="navCategory" @change="emitFilter">
              <option value="Tất cả">Danh mục</option>
              <option>CPU</option>
              <option>RAM</option>
              <option>GPU</option>
              <option>SSD</option>
              <option>HDD</option>
            </select>

            <div class="divider-vertical"></div>

            <select class="form-select border-0 nav-select" v-model="navPrice" @change="emitFilter">
              <option value="Tất cả">Giá</option>
              <option>Dưới 2 triệu</option>
              <option>2 – 5 triệu</option>
              <option>Trên 5 triệu</option>
            </select>

            <button class="btn btn-search-circle me-1 ms-2" type="button" @click="emitFilter">
              <i class="bi bi-search text-white"></i>
            </button>
          </div>
        </div>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse flex-grow-0" id="navbarNav">
          <div class="d-flex align-items-center gap-4 actions-area mt-3 mt-lg-0">
            
            <router-link to="/cart" class="btn btn-cart position-relative border-0 text-white text-decoration-none nav-icon-link p-0">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-cart3 fs-4"></i>
                <span class="d-none d-md-inline fw-medium">Giỏ hàng</span>
              </div>
              <span v-if="cartCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white shadow-sm">
                {{ cartCount }}
              </span>
            </router-link>

            <div v-if="currentUser" class="dropdown">
              <button class="btn user-menu-btn d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                <div class="avatar-circle">
                  {{ currentUser.name.charAt(0).toUpperCase() }}
                </div>
                <div class="d-none d-md-flex flex-column text-start lh-1 text-white">
                  <span class="x-small opacity-75">Xin chào,</span>
                  <span class="fw-bold">{{ currentUser.name }}</span>
                </div>
                <i class="bi bi-chevron-down text-white ms-1 x-small opacity-75"></i>
              </button>
              
              <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 animate-slide-in p-2">
                <li v-if="currentUser.role === 'admin'">
                  <router-link to="/admin" class="dropdown-item rounded-3 py-2"><i class="bi bi-speedometer2 me-2 text-purple"></i>Quản trị</router-link>
                </li>
                <li><router-link to="/profile" class="dropdown-item rounded-3 py-2"><i class="bi bi-person-gear me-2 text-purple"></i>Hồ sơ</router-link></li>
                <li><router-link to="/orders" class="dropdown-item rounded-3 py-2"><i class="bi bi-box-seam me-2 text-purple"></i>Đơn mua</router-link></li>
                <li><hr class="dropdown-divider my-1"></li>
                <li><button class="dropdown-item rounded-3 py-2 text-danger" @click="handleLogout"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</button></li>
              </ul>
            </div>

            <div v-else class="auth-buttons">
              <router-link to="/login" class="btn btn-light rounded-pill px-4 fw-bold text-purple shadow-sm hover-scale">Đăng nhập</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-fill bg-light py-4 main-bg">
      <div class="container animate-fade-in">
        <slot />
      </div>
    </main>

    <div v-if="currentUser?.role === 'admin'" class="admin-float-btn-wrapper">
      <router-link to="/admin" class="btn-admin-float shadow-lg" title="Quay lại trang quản trị">
        <div class="icon-pulse">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
        <span class="label">Quản trị viên</span>
      </router-link>
    </div>

    <footer class="bg-white border-top py-4 mt-auto">
      <div class="container text-center text-muted">
        <p class="mb-1 fw-bold text-dark">Hệ thống Quản lý Thiết bị Điện tử</p>
        <small class="text-muted">© 2026 Shop Điện Tử. All rights reserved.</small>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

// API Configuration
const CART_API_URL = 'http://localhost:3000/carts';

const navSearch = ref('');
const navCategory = ref('Tất cả');
const navPrice = ref('Tất cả');
const currentUser = ref(null);
const cartCount = ref(0);

// Load cart count from API
const loadCartCount = async () => {
  const currentUserStr = localStorage.getItem('currentUser');
  if (!currentUserStr) {
    cartCount.value = 0;
    return;
  }

  try {
    const user = JSON.parse(currentUserStr);
    const response = await axios.get(`${CART_API_URL}?userId=${user.id}`);

    if (response.data && response.data.length > 0) {
      const cart = response.data[0];
      cartCount.value = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    } else {
      cartCount.value = 0;
    }
  } catch (error) {
    console.error('Error loading cart count:', error);
    cartCount.value = 0;
  }
};

onMounted(() => {
  const stored = localStorage.getItem('currentUser');
  if (stored) currentUser.value = JSON.parse(stored);

  // Load initial cart count
  loadCartCount();

  // Listen for cart updates
  window.addEventListener('cart-updated', loadCartCount);
  window.addEventListener('storage', loadCartCount);
});

onUnmounted(() => {
  window.removeEventListener('cart-updated', loadCartCount);
  window.removeEventListener('storage', loadCartCount);
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
/* 1. HEADER GRADIENT TÍM */
.bg-gradient-purple {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  min-height: 80px; 
}

/* 2. LOGO BOX */
.logo-icon-box {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-size: 1.2rem;
}
.text-purple { color: #6f42c1 !important; }
.tracking-tight { letter-spacing: -0.5px; }

/* 3. SEARCH PILL */
.nav-search-pill {
  background: white;
  border-radius: 50px;
  padding: 4px;
  display: flex;
  align-items: center;
  height: 52px;
  transition: box-shadow 0.3s ease;
}

.nav-search-pill:focus-within {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.25) !important;
}

.search-input {
  font-size: 15px;
}
.search-input:focus, .nav-select:focus {
  box-shadow: none;
}

/* Vạch ngăn cách dọc */
.divider-vertical {
  width: 1px;
  height: 28px;
  background-color: #e9ecef;
  margin: 0 4px;
}

/* DROPDOWN */
.nav-select {
  max-width: 140px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  font-weight: 500;
  background-color: #f8f9fa; 
  border-radius: 8px;
  padding: 8px 30px 8px 12px;
  margin: 0 2px;
  height: 38px;
  transition: all 0.2s;
}

.nav-select:hover {
  background-color: #e9ecef;
}

/* NÚT TÌM KIẾM TRÒN */
.btn-search-circle {
  width: 42px !important;
  height: 42px !important;
  padding: 0 !important;
  border-radius: 50% !important;
  background: #6f42c1;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.btn-search-circle:hover {
  background: #5a32a3;
  transform: scale(1.05);
}

/* USER MENU */
.user-menu-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 5px 16px 5px 5px;
  transition: all 0.2s ease;
}
.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}
.avatar-circle {
  width: 36px;
  height: 36px;
  background: white;
  color: #6f42c1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.x-small { font-size: 11px; }

.dropdown-menu { margin-top: 12px !important; }
.dropdown-item:hover { background-color: #f3f0ff; color: #6f42c1; transform: translateX(3px); }

.nav-icon-link { transition: opacity 0.2s; }
.nav-icon-link:hover { opacity: 0.85; }
.hover-scale { transition: transform 0.2s; }
.hover-scale:hover { transform: scale(1.05); }
.main-bg { background-color: #f8f9fa; }

/* --- STYLE CHO NÚT QUAY LẠI ADMIN (FLOATING) --- */
.admin-float-btn-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1050;
  animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-admin-float {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px 10px 8px;
  border-radius: 50px;
  border: 2px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.btn-admin-float:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
  color: white;
  border-color: #6f42c1;
}

.icon-pulse {
  width: 36px;
  height: 36px;
  background: #6f42c1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 0 0 0 rgba(111, 66, 193, 0.7);
  animation: pulse-purple 2s infinite;
}

.label {
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-purple {
  0% { box-shadow: 0 0 0 0 rgba(111, 66, 193, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(111, 66, 193, 0); }
  100% { box-shadow: 0 0 0 0 rgba(111, 66, 193, 0); }
}
</style>