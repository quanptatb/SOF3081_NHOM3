<template>
  <div class="d-flex flex-column min-vh-100 font-read">
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-purple sticky-top shadow-sm py-2">
      <div class="container gap-lg-3">

        <router-link to="/" class="navbar-brand-custom d-flex align-items-center gap-2 fw-bold fs-4 flex-shrink-0">
          <div class="logo-icon-box">
            <i class="bi bi-bag-heart-fill text-purple"></i>
          </div>
          <span class="d-none d-sm-inline tracking-tight text-white"
            style="text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Shop Điện Tử</span>
        </router-link>

        <div class="flex-grow-1 mx-lg-5 d-none d-lg-block">
          <div class="input-group nav-search-pill shadow-sm">
            <input type="text" class="form-control border-0 ps-4 bg-transparent search-input"
              placeholder="Bạn muốn tìm gì..." v-model="navSearch" @input="emitFilter" />

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

            <router-link to="/cart"
              class="cart-button-custom position-relative border-0 text-white text-decoration-none p-0">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-cart3 fs-4"></i>
                <span class="d-none d-md-inline fw-medium">Giỏ hàng</span>
              </div>
              <span v-if="cartCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white shadow-sm cart-badge">
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
                  <router-link to="/admin" class="dropdown-item-custom rounded-3 py-2 px-3"><i
                      class="bi bi-speedometer2 me-2 text-purple"></i>Quản trị</router-link>
                </li>
                <li><router-link to="/profile" class="dropdown-item-custom rounded-3 py-2 px-3"><i
                      class="bi bi-person-gear me-2 text-purple"></i>Hồ sơ</router-link></li>
                <li><router-link to="/orders" class="dropdown-item-custom rounded-3 py-2 px-3"><i
                      class="bi bi-box-seam me-2 text-purple"></i>Đơn mua</router-link></li>
                <li>
                  <hr class="dropdown-divider my-1">
                </li>
                <li><button class="dropdown-item-custom logout-item rounded-3 py-2 px-3 text-danger"
                    @click="handleLogout"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</button></li>
              </ul>
            </div>

            <div v-else class="auth-buttons">
              <router-link to="/login" class="btn-login-custom rounded-pill px-4 py-2 fw-bold shadow-sm">Đăng
                nhập</router-link>
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

    <footer class="bg-dark text-white pt-4 pb-2 mt-auto" style="font-size: 13px;">
      <div class="container">
        <div class="row">
          <div class="col-md-3 mb-4">
            <h6 class="fw-bold mb-3">KẾT NỐI VỚI CHÚNG TÔI</h6>
            <div class="d-flex gap-2 mb-4">
              <a href="#" class="social-link"><i class="bi bi-facebook fs-4 text-primary"></i></a>
              <a href="#" class="social-link"><i class="bi bi-youtube fs-4 text-danger"></i></a>
              <a href="#" class="social-link"><i class="bi bi-tiktok fs-4"></i></a>
            </div>

            <h6 class="fw-bold mb-2">TỔNG ĐÀI</h6>
            <strong class="fs-5">0385 574 498</strong>

            <p class="mb-1 mt-2">(Gọi khiếu nại - 8:00 - 21:30)</p>
            <strong class="fs-5">0989 569 612</strong>

            <p class="mb-1 mt-2">(Gọi bảo hành - 8:00 - 21:00)</p>

          </div>

          <div class="col-md-3 mb-4">
            <h6 class="fw-bold mb-3">VỀ CHÚNG TÔI</h6>
            <ul class="list-unstyled d-flex flex-column gap-2">
              <li><a href="#" class="footer-link">Giới thiệu về công ty</a></li>
              <li><a href="#" class="footer-link">Quy chế hoạt động</a></li>
              <li><a href="#" class="footer-link">Dự án Doanh nghiệp</a></li>
              <li><a href="#" class="footer-link">Tin tức khuyến mại</a></li>
              <li><a href="#" class="footer-link">Giới thiệu máy đổi trả</a></li>
              <li><a href="#" class="footer-link">Tra cứu hóa đơn điện tử</a></li>
              <li><a href="#" class="footer-link">Tra cứu bảo hành</a></li>
            </ul>
          </div>

          <div class="col-md-3 mb-4">
            <h6 class="fw-bold mb-3">CHÍNH SÁCH</h6>
            <ul class="list-unstyled d-flex flex-column gap-2">
              <li><a href="#" class="footer-link">Chính sách bảo hành</a></li>
              <li><a href="#" class="footer-link">Chính sách đổi trả</a></li>
              <li><a href="#" class="footer-link">Chính sách bảo mật</a></li>
              <li><a href="#" class="footer-link">Chính sách trả góp</a></li>
              <li><a href="#" class="footer-link">Quy định về hỗ trợ kỹ thuật</a></li>
              <li><a href="#" class="footer-link">Chính sách giao hàng & lắp đặt</a></li>
            </ul>
          </div>

          <div class="col-md-3 mb-4">
            <h6 class="fw-bold mb-3">HỖ TRỢ THANH TOÁN</h6>

            <div class="d-flex flex-wrap gap-2 mb-3">
              <div class="payment-icon bg-light rounded d-flex align-items-center justify-content-center">
                <span class="text-dark fw-bold small" style="font-size: 10px;">VISA</span>
              </div>
              <div class="payment-icon bg-light rounded d-flex align-items-center justify-content-center">
                <span class="text-dark fw-bold small" style="font-size: 10px;">Master</span>
              </div>
              <div class="payment-icon bg-light rounded d-flex align-items-center justify-content-center">
                <span class="text-warning fw-bold small" style="font-size: 10px;">JCB</span>
              </div>
              <div class="payment-icon bg-light rounded d-flex align-items-center justify-content-center"
                style="width: auto; padding: 0 5px;">
                <span class="text-primary fw-bold small" style="font-size: 10px;">VNPAY-QR</span>
              </div>
            </div>

            <h6 class="fw-bold mb-2" style="font-size: 12px;">QUÉT MÃ QR</h6>
            <div class="d-flex gap-3 mb-4">
              <div class="qr-frame bg-white rounded p-1 shadow-sm">
                <img src="/src/assets/images/rickrollqr.png" alt="QR Thanh toán" class="img-fluid">
                <div class="text-dark text-center fw-bold mt-1" style="font-size: 10px;">Ngân hàng</div>
              </div>

              <div class="qr-frame bg-white rounded p-1 shadow-sm">
                <img src="/src/assets/images/rickrollqr2.png" alt="QR Zalo" class="img-fluid p-2">
                <div class="text-dark text-center fw-bold mt-1" style="font-size: 10px;">Zalo OA</div>
              </div>
            </div>
            <h6 class="fw-bold mb-3">CHỨNG NHẬN</h6>
            <div class="d-flex gap-2">
              <div class="bg-white rounded p-1" style="width: 120px;">
                <img src="https://webmedia.com.vn/images/2021/09/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png"
                  class="img-fluid" alt="Đã thông báo BCT">
              </div>
            </div>
          </div>
        </div>

        <hr class="border-secondary">

        <div class="row align-items-center py-2">
          <div class="col-md-12 text-center text-white-50 small">
            <p class="mb-1">© 2026 Công ty Cổ phần Bán lẻ Kỹ thuật số NoName / Địa chỉ: Số 123 Đường ABC, Quận 1, TP.HCM
            </p>
            <p class="mb-0">GPĐKKD số 0101010101 do Sở KHĐT TP.HCM cấp ngày 01/01/2026.</p>
          </div>
        </div>

        <div class="row justify-content-center mt-3 bg-secondary bg-opacity-25 py-3 rounded">
          <div class="col-auto text-center">
            <small class="d-block text-white-50 mb-1">Cửa hàng ủy quyền bởi PineApple:</small>
            <h5 class="fw-bold">F.Studio <span class="text-success">by NoName</span></h5>
          </div>
          <div class="col-auto text-center border-start border-secondary ps-4 ms-2">
            <small class="d-block text-white-50 mb-1">Trung tâm bảo hành PineApple:</small>
            <h5 class="fw-bold">F.Care <span class="text-success">by NoName</span></h5>
          </div>
        </div>

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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

/* NAVBAR BRAND HOVER */
.navbar-brand-custom {
  text-decoration: none;
  transition: all 0.3s ease;
}

.navbar-brand-custom:hover .logo-icon-box {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 6px 12px rgba(111, 66, 193, 0.4);
}

.navbar-brand-custom:hover {
  opacity: 0.9;
}

.text-purple {
  color: #6f42c1 !important;
}

.tracking-tight {
  letter-spacing: -0.5px;
}

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

.search-input:focus,
.nav-select:focus {
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
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-search-circle:hover {
  background: #5a32a3;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(111, 66, 193, 0.4);
}

/* CART BUTTON */
.cart-button-custom {
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
}

.cart-button-custom:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.cart-button-custom:hover .cart-badge {
  animation: bounce 0.5s ease;
}

@keyframes bounce {

  0%,
  100% {
    transform: scale(1) translate(-50%, -50%);
  }

  50% {
    transform: scale(1.2) translate(-50%, -50%);
  }
}

/* LOGIN BUTTON */
.btn-login-custom {
  background: white;
  color: #6f42c1;
  border: 2px solid white;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  font-weight: 700;
}

.btn-login-custom:hover {
  background: transparent;
  color: white;
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* USER MENU */
.user-menu-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 5px 16px 5px 5px;
  transition: all 0.3s ease;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.x-small {
  font-size: 11px;
}

/* DROPDOWN ITEMS */
.dropdown-menu {
  margin-top: 12px !important;
  border: none;
  padding: 8px;
}

.dropdown-item-custom {
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  color: #333;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}

.dropdown-item-custom:hover {
  background: linear-gradient(135deg, #f3f0ff 0%, #e8e0ff 100%);
  color: #6f42c1;
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(111, 66, 193, 0.15);
}

.dropdown-item-custom i {
  transition: transform 0.3s ease;
}

.dropdown-item-custom:hover i {
  transform: scale(1.2);
}

.logout-item:hover {
  background: linear-gradient(135deg, #ffe5e5 0%, #ffd0d0 100%);
  color: #dc3545 !important;
}

/* FOOTER LINKS */
.footer-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
  padding-left: 0;
}

.footer-link::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: white;
  padding-left: 8px;
}

.footer-link:hover::before {
  width: 30px;
}

/* SOCIAL LINKS */
.social-link {
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.social-link:hover {
  transform: translateY(-4px) scale(1.1);
}

.social-link:hover i {
  filter: brightness(1.2);
}

.main-bg {
  background-color: #f8f9fa;
}

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
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.btn-admin-float:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
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

.payment-icon {
  width: 40px;
  /* Thu nhỏ lại chút cho gọn */
  height: 25px;
  border: 1px solid #444;
}

/* CSS MỚI: Khung ảnh QR Code */
.qr-frame {
  width: 160px;
  /* Chiều rộng khung */
  height: 160px;
  /* Chiều cao tự động theo nội dung */
  border: 1px solid #e0e0e0;
  /* Viền sáng màu hơn cho nổi bật trên nền tối */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff !important;
  /* Đảm bảo nền trắng để dễ quét mã */
}

.qr-frame img {
  width: 250px;
  /* Kích thước ảnh QR bên trong */
  height: 290px;
  object-fit: contain;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-purple {
  0% {
    box-shadow: 0 0 0 0 rgba(111, 66, 193, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(111, 66, 193, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(111, 66, 193, 0);
  }
}
</style>