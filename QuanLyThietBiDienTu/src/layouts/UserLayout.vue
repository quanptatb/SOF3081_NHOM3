<template>
  <div class="d-flex flex-column min-vh-100 font-read">
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary sticky-top shadow-sm py-2">
      <div class="container gap-lg-3">
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 flex-shrink-0">
          <span class="fs-2">🛍️</span> <span class="d-none d-sm-inline">Shop Điện Tử</span>
        </router-link>

        <div class="flex-grow-1 mx-lg-4 d-none d-lg-block">
          <div class="input-group nav-search-group shadow-sm">
            <input type="text" class="form-control border-0 px-3" placeholder="Bạn tìm gì..." v-model="navSearch"
              @input="emitFilter" />

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
              <span v-if="cartCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ cartCount }}
              </span>
            </router-link>

            <div v-if="currentUser" class="dropdown">
              <button class="btn btn-user text-white dropdown-toggle d-flex align-items-center gap-2" type="button"
                data-bs-toggle="dropdown">
                <div class="avatar-circle">{{ currentUser.name.charAt(0).toUpperCase() }}</div>
                <span class="d-none d-md-inline">{{ currentUser.name }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow animate-slide-in">
                <li v-if="currentUser.role === 'admin'"><router-link to="/admin" class="dropdown-item">Quản
                    trị</router-link></li>
                <li><router-link to="/profile" class="dropdown-item">Hồ sơ</router-link></li>
                <li>
                  <hr class="dropdown-divider">
                </li>
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

    <footer class="bg-dark text-white pt-4 pb-2 mt-auto" style="font-size: 13px;">
      <div class="container">
        <div class="row">
          <div class="col-md-3 mb-4">
            <h6 class="fw-bold mb-3">KẾT NỐI VỚI CHÚNG TÔI</h6>
            <div class="d-flex gap-2 mb-4">
              <a href="#" class="text-white"><i class="bi bi-facebook fs-4 text-primary"></i></a>
              <a href="#" class="text-white"><i class="bi bi-youtube fs-4 text-danger"></i></a>
              <a href="#" class="text-white"><i class="bi bi-tiktok fs-4"></i></a>
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
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Giới thiệu về công ty</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Quy chế hoạt động</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Dự án Doanh nghiệp</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Tin tức khuyến mại</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Giới thiệu máy đổi trả</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Tra cứu hóa đơn điện tử</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Tra cứu bảo hành</a></li>
            </ul>
          </div>

          <div class="col-md-3 mb-4">
            <h6 class="fw-bold mb-3">CHÍNH SÁCH</h6>
            <ul class="list-unstyled d-flex flex-column gap-2">
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách bảo hành</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách đổi trả</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách bảo mật</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách trả góp</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Quy định về hỗ trợ kỹ thuật</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách giao hàng & lắp đặt</a></li>
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
              <div class="payment-icon bg-light rounded d-flex align-items-center justify-content-center" style="width: auto; padding: 0 5px;">
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
                  <img src="https://webmedia.com.vn/images/2021/09/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png" class="img-fluid" alt="Đã thông báo BCT">
               </div>
            </div>
          </div>
        </div>

        <hr class="border-secondary">

        <div class="row align-items-center py-2">
           <div class="col-md-12 text-center text-white-50 small">
              <p class="mb-1">© 2026 Công ty Cổ phần Bán lẻ Kỹ thuật số NoName / Địa chỉ: Số 123 Đường ABC, Quận 1, TP.HCM</p>
              <p class="mb-0">GPĐKKD số 0101010101 do Sở KHĐT TP.HCM cấp ngày 01/01/2026.</p>
           </div>
        </div>
        
        <div class="row justify-content-center mt-3 bg-secondary bg-opacity-25 py-3 rounded">
           <div class="col-auto text-center">
              <small class="d-block text-white-50 mb-1">Cửa hàng ủy quyền bởi Apple:</small>
              <h5 class="fw-bold">F.Studio <span class="text-success">by NoName</span></h5>
           </div>
           <div class="col-auto text-center border-start border-secondary ps-4 ms-2">
              <small class="d-block text-white-50 mb-1">Trung tâm bảo hành Apple:</small>
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
.bg-gradient-primary {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
}

.nav-search-group {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  height: 40px;
}

.nav-select {
  max-width: 130px;
  font-size: 13px;
  background-color: #f8f9fa;
  cursor: pointer;
  border-left: 1px solid #dee2e6 !important;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  background: white;
  color: #0d6efd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.payment-icon {
  width: 40px; /* Thu nhỏ lại chút cho gọn */
  height: 25px;
  border: 1px solid #444;
}

/* CSS MỚI: Khung ảnh QR Code */
.qr-frame {
    width: 160px;  /* Chiều rộng khung */
    height: 160px; /* Chiều cao tự động theo nội dung */
    border: 1px solid #e0e0e0; /* Viền sáng màu hơn cho nổi bật trên nền tối */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff !important; /* Đảm bảo nền trắng để dễ quét mã */
}

.qr-frame img {
    width: 250px; /* Kích thước ảnh QR bên trong */
    height: 290px;
    object-fit: contain;
}


</style>