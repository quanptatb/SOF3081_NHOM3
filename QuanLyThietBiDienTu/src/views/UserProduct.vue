<template>
  <div class="row mb-4">
    <div class="col-12">
      <div id="headerCarousel" class="carousel slide carousel-fade shadow-lg rounded-4 overflow-hidden"
        data-bs-ride="carousel" data-bs-interval="4000">

        <!-- Custom Indicators -->
        <div class="carousel-indicators-custom">
          <button v-for="(banner, index) in banners" :key="banner.id" type="button" data-bs-target="#headerCarousel"
            :data-bs-slide-to="index" :class="{ active: index === 0 }" :aria-label="`Slide ${index + 1}`"></button>
        </div>

        <div class="carousel-inner">
          <div v-for="(banner, index) in banners" :key="banner.id" class="carousel-item"
            :class="{ active: index === 0 }">
            <div class="banner-overlay"></div>
            <img :src="banner.image" class="d-block w-100 banner-img" :alt="banner.alt" loading="lazy">
          </div>
        </div>

        <!-- Custom Control Buttons -->
        <button class="carousel-control-prev custom-control" type="button" data-bs-target="#headerCarousel"
          data-bs-slide="prev">
          <div class="control-button">
            <i class="bi bi-chevron-left"></i>
          </div>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next custom-control" type="button" data-bs-target="#headerCarousel"
          data-bs-slide="next">
          <div class="control-button">
            <i class="bi bi-chevron-right"></i>
          </div>
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
          <router-link :to="`/productuser/${p.id}`" class="product-link text-decoration-none h-100 d-block">
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
.product-link {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card-tgdd {
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.product-card-tgdd::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  padding: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

/* Hover: Bóng đậm hơn & viền gradient tím */
.product-link:hover .product-card-tgdd {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(111, 66, 193, 0.25), 0 0 20px rgba(111, 66, 193, 0.1) !important;
}

.product-link:hover .product-card-tgdd::before {
  opacity: 1;
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
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 5px;
  filter: brightness(1);
}

.product-link:hover .product-img-wrap img {
  transform: scale(1.12) rotate(2deg);
  filter: brightness(1.05);
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
  transition: all 0.3s ease;
}

.product-link:hover .product-name {
  color: #6f42c1 !important;
  transform: translateX(3px);
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
  transition: all 0.3s ease;
}

.bank-icon-sm img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.bank-icon-sm:hover {
  border-color: #6f42c1 !important;
  background: linear-gradient(135deg, #f3f0ff 0%, #e8e0ff 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(111, 66, 193, 0.2);
}

.bank-icon-sm:hover img {
  transform: scale(1.1);
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
  border: 2px solid #e0e0e0;
  color: #333;
  margin: 0 4px;
  border-radius: 10px !important;
  font-weight: 600;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.page-link:hover:not(.page-item.disabled .page-link) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3);
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 12px rgba(111, 66, 193, 0.4);
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ============================================
   CAROUSEL/SLIDER OPTIMIZATION
   ============================================ */

/* Carousel Container */
#headerCarousel {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

/* Fade Effect for Smooth Transitions */
.carousel-fade .carousel-item {
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.carousel-fade .carousel-item.active {
  opacity: 1;
}

/* Banner Image Styling */
.banner-img {
  height: 450px;
  object-fit: cover;
  object-position: center;
  transition: transform 8s ease-out;
}

/* Subtle Ken Burns Effect */
.carousel-item.active .banner-img {
  animation: kenBurns 8s ease-out forwards;
}

@keyframes kenBurns {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.08);
  }
}

/* Overlay Gradient for Better Text Readability */
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
  z-index: 1;
  pointer-events: none;
}

/* ---- CUSTOM CONTROL BUTTONS ---- */
.custom-control {
  width: 60px;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

#headerCarousel:hover .custom-control {
  opacity: 1;
}

.control-button {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(111, 66, 193, 0.2);
}

.control-button i {
  font-size: 24px;
  color: #6f42c1;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.custom-control:hover .control-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.4);
  border-color: transparent;
}

.custom-control:hover .control-button i {
  color: white;
  transform: scale(1.1);
}

/* Prev button animation */
.carousel-control-prev:hover .control-button i {
  animation: slideLeft 0.6s ease-in-out infinite;
}

/* Next button animation */
.carousel-control-next:hover .control-button i {
  animation: slideRight 0.6s ease-in-out infinite;
}

@keyframes slideLeft {

  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(-4px);
  }
}

@keyframes slideRight {

  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(4px);
  }
}

/* ---- CUSTOM INDICATORS ---- */
.carousel-indicators-custom {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 50px;
}

.carousel-indicators-custom button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  padding: 0;
  margin: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.carousel-indicators-custom button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-indicators-custom button.active {
  width: 32px;
  border-radius: 10px;
  border-color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 0 15px rgba(111, 66, 193, 0.6);
}

.carousel-indicators-custom button:hover:not(.active) {
  border-color: white;
  transform: scale(1.3);
}

.carousel-indicators-custom button:hover:not(.active)::before {
  transform: translate(-50%, -50%) scale(0.6);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .banner-img {
    height: 300px;
  }

  .control-button {
    width: 40px;
    height: 40px;
  }

  .control-button i {
    font-size: 20px;
  }

  .carousel-indicators-custom {
    bottom: 15px;
    padding: 8px 16px;
  }
}
</style>