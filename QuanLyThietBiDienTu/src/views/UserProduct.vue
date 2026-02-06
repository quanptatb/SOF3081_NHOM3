<template>
  <div class="row mb-4">
    <div class="col-12">
      <div id="headerCarousel" class="carousel slide shadow rounded-3 overflow-hidden" data-bs-ride="carousel"
        data-bs-interval="5000">
        <div class="carousel-indicators">
          <button v-for="(banner, index) in banners" :key="banner.id" type="button" data-bs-target="#headerCarousel"
            :data-bs-slide-to="index" :class="{ active: index === 0 }" aria-current="true"></button>
        </div>

        <div class="carousel-inner">
          <div v-for="(banner, index) in banners" :key="banner.id" class="carousel-item"
            :class="{ active: index === 0 }">
            <img :src="banner.image" class="d-block w-100 banner-img" :alt="banner.alt">
          </div>
        </div>

        <button class="carousel-control-prev" type="button" data-bs-target="#headerCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon bg-dark rounded-circle bg-opacity-25 p-3" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#headerCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon bg-dark rounded-circle bg-opacity-25 p-3" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <p class="small fw-bold text-dark mb-3" v-if="search">
        Tìm thấy <span class="text-purple">{{ filteredProducts.length }}</span> sản phẩm phù hợp
      </p>

      <div class="row g-3">
        <div v-for="p in paginatedProducts" :key="p.id" class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <router-link :to="`/productuser/${p.id}`" class="text-decoration-none h-100 d-block">
            <div class="card product-card-tgdd h-100 p-2">

              <div class="product-img-wrap mb-2">
                <img :src="p.image" class="img-fluid" loading="lazy" />
              </div>

              <div class="card-body p-1 d-flex flex-column">
                <h6 class="product-name text-black mb-2">{{ p.name }}</h6>

                <div class="price-box mb-3">
                  <span class="text-purple fw-bolder d-block price-main">{{ formatPrice(p.price) }}</span>
                  <div class="d-flex align-items-center gap-2 mt-1">
                    <span class="text-secondary text-decoration-line-through x-small fw-semibold">{{ formatPrice(p.price
                      * 1.2) }}</span>
                    <span class="badge bg-danger rounded-pill x-small">-20%</span>
                  </div>
                </div>

                <div class="bank-promo-section mt-auto pt-2 border-top">
                  <div class="d-flex gap-1 mb-2 flex-nowrap overflow-hidden justify-content-start">
                    <div v-for="bank in banks" :key="bank.id" class="bank-icon-sm border rounded"
                      @mouseover="p.hoveredPromo = bank.detail" @mouseleave="p.hoveredPromo = ''">
                      <img :src="bank.logo" class="img-fluid" />
                    </div>
                  </div>
                  <div class="promo-text-holder">
                    <p class="promo-text-limit text-purple fw-bold mb-0 animate__animated animate__fadeIn">
                      {{ p.hoveredPromo || 'Rê chuột xem ưu đãi bank' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <nav class="mt-5" v-if="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link shadow-sm" @click="currentPage--">
              <i class="bi bi-chevron-left"></i> «
            </button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link shadow-sm fw-bold" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link shadow-sm" @click="currentPage++">
              » <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

// API Configuration
const PRODUCTS_API_URL = 'http://localhost:3000/products'

const search = ref('')
const category = ref('Tất cả')
const priceRange = ref('Tất cả')
const currentPage = ref(1)
const pageSize = 12
const isLoading = ref(true)

// 👂 Nhận tín hiệu từ Navbar
const handleNavbarFilter = (e) => {
  search.value = e.detail.search;
  category.value = e.detail.category;
  priceRange.value = e.detail.price;
  currentPage.value = 1;
};

onMounted(() => {
  loadProducts();
  window.addEventListener('nav-search-filter', handleNavbarFilter);
});

onUnmounted(() => {
  window.removeEventListener('nav-search-filter', handleNavbarFilter);
});

const banks = [
  { id: 'scb', logo: '/src/assets/images/scb.png', detail: 'Giảm ngay 800.000đ cho đơn từ 8 triệu khi thanh toán qua thẻ Visa SCB. (HSD: 30/06/2026)' },
  { id: 'ocb', logo: '/src/assets/images/ocb.png', detail: 'Giảm ngay 500.000đ cho đơn hàng từ 10 triệu khi thanh toán bằng thẻ OCB. (HSD: 28/02/2026)' },
  { id: 'kredivo', logo: '/src/assets/images/kredivo.png', detail: 'Giảm ngay 50% tối đa 100.000đ cho Khách hàng mới hoặc Giảm 5% tối đa 200.000đ đơn từ 700k qua Kredivo.' },
  { id: 'homepay', logo: '/src/assets/images/homepay.png', detail: 'Giảm ngay 5% tối đa 50.000đ cho Khách hàng thân thiết khi thanh toán qua HomePayLater.' }
];

// 🖼️ Dữ liệu Banner (Bạn thay link ảnh của bạn vào đây nhé)
const banners = [
  { id: 1, image: '/src/assets/images/banner1.png', alt: 'Khuyến mãi 1' },
  { id: 2, image: '/src/assets/images/banner2.png', alt: 'Khuyến mãi 2' },
  { id: 3, image: '/src/assets/images/banner3.png', alt: 'Khuyến mãi 3' },
  { id: 3, image: '/src/assets/images/banner4.png', alt: 'Khuyến mãi 4' }
];

// Products will be loaded from API
const products = ref([]);

// Load products from API
const loadProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(PRODUCTS_API_URL);
    products.value = response.data.map(p => ({ ...p, hoveredPromo: '' }));
  } catch (error) {
    console.error('Error loading products:', error);
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' đ';

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const mName = p.name.toLowerCase().includes(search.value.toLowerCase());
    const mCat = category.value === 'Tất cả' || p.category === category.value;
    const mPrice = priceRange.value === 'Tất cả' ||
      (priceRange.value === 'Dưới 2 triệu' && p.price < 2000000) ||
      (priceRange.value === '2 – 5 triệu' && p.price >= 2000000 && p.price <= 5000000) ||
      (priceRange.value === 'Trên 5 triệu' && p.price > 5000000);
    return mName && mCat && mPrice;
  });
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});
</script>

<style scoped>
/* --- TEXT & COLORS --- */
.text-purple {
  color: #6f42c1 !important;
}

.product-img-wrap {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.product-name {
  font-size: 14px;
  height: 2.8rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bank-icon-sm {
  width: 40px;
  height: 24px;
  padding: 2px;
  cursor: pointer;
}

.promo-text-limit {
  font-size: 11px;
  height: 2.4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* --- CARD SẢN PHẨM --- */
.product-card-tgdd {
  border: 1px solid #ced4da;
  /* Viền xám đậm hơn chút */
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Hover: Bóng đậm hơn & viền tím */
.product-card-tgdd:hover {
  transform: translateY(-5px);
  border-color: #6f42c1;
  box-shadow: 0 10px 30px rgba(111, 66, 193, 0.2) !important;
}

.product-img-wrap {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  /* Đường kẻ dưới ảnh */
}

.product-img-wrap img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  padding: 5px;
}

.product-card-tgdd:hover .product-img-wrap img {
  transform: scale(1.08);
}

/* --- TÊN & GIÁ --- */
.product-name {
  font-size: 15px;
  font-weight: 700;
  height: 2.8rem;
  line-height: 1.4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s;
}

.product-card-tgdd:hover .product-name {
  color: #6f42c1 !important;
}

.price-main {
  font-size: 1.2rem !important;
}

/* --- BANK ICON --- */
.bank-icon-sm {
  width: 40px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  cursor: pointer;
  padding: 3px;
  border-color: #ced4da !important;
  /* Viền icon đậm hơn */
  transition: all 0.2s;
}

.bank-icon-sm img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.bank-icon-sm:hover {
  border-color: #6f42c1 !important;
  background-color: #f3f0ff;
}

/* --- PROMO TEXT --- */
.promo-text-holder {
  min-height: 2.4rem;
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.promo-text-limit {
  font-size: 12px;
  line-height: 1.2rem;
  height: 2.4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* --- PAGINATION --- */
.page-link {
  border: 1px solid #ced4da;
  color: #333;
  margin: 0 4px;
  border-radius: 8px !important;
  font-weight: 600;
  min-width: 36px;
  text-align: center;
  transition: all 0.3s;
}

.page-link:hover {
  background-color: #e9ecef;
  color: #6f42c1;
  border-color: #6f42c1;
}

.page-item.active .page-link {
  background-color: #6f42c1;
  border-color: #6f42c1;
  color: #fff;
}

/* Sửa lại class này trong thẻ <style scoped> */
.banner-img {
  /* Giảm chiều cao xuống, bạn có thể thử 200px, 220px, 250px tùy mắt nhìn */
  height: 530px;

  /* Giữ nguyên dòng này để ảnh tự cắt bớt phần thừa trên dưới, không bị méo */
  object-fit: cover;
  object-position: center;
}

/* Ẩn nút prev/next khi chưa hover để nhìn gọn hơn (tùy chọn) */
#headerCarousel .carousel-control-prev,
#headerCarousel .carousel-control-next {
  width: 5%;
  opacity: 0;
  transition: opacity 0.3s;
}

#headerCarousel:hover .carousel-control-prev,
#headerCarousel:hover .carousel-control-next {
  opacity: 1;
}

/* --- TÙY CHỈNH DẤU GẠCH NGANG CAROUSEL --- */

/* 1. Định dạng chung cho các dấu gạch (trạng thái chưa chọn) */
#headerCarousel .carousel-indicators button {
  background-color: #690000 !important;
  /* Màu đỏ thẫm (như ảnh 2) */
  opacity: 0.6;
  /* Độ mờ vừa phải */
  height: 4px;
  /* Độ dày */
  width: 30px;
  /* Chiều dài */
  border: none;
  /* Bỏ viền trắng mặc định */
  border-radius: 2px;
  /* Bo góc nhẹ cho mềm mại */
  margin: 0 4px;
  /* Khoảng cách giữa các gạch */
  transition: all 0.3s ease;
  /* Hiệu ứng chuyển màu mượt mà */
}

/* 2. Định dạng cho dấu gạch ĐANG CHỌN (Active) */
#headerCarousel .carousel-indicators .active {
  background-color: #ff0000 !important;
  /* Màu đỏ tươi nổi bật */
  opacity: 1;
  /* Hiển thị rõ 100% */
  width: 40px;
  /* Dài hơn một chút để tạo điểm nhấn */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  /* Thêm bóng đổ nhẹ cho nổi */
}
</style>