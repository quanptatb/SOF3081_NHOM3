<template>
  <div class="container my-2" v-if="products">
    <div class="row">
      <div class="col-12">
        <p class="small text-muted mb-3" v-if="search">
          Tìm thấy <b>{{ filteredProducts.length }}</b> sản phẩm phù hợp
        </p>

        <div class="row g-3">
          <div v-for="p in paginatedProducts" :key="p.id" class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <router-link :to="`/productuser/${p.id}`" class="text-decoration-none h-100 d-block">
              <div class="card product-card-tgdd h-100 border-0 shadow-sm p-2">
                <div class="product-img-wrap mb-2">
                  <img :src="p.image" class="img-fluid" loading="lazy" />
                </div>
                <div class="card-body p-1">
                  <h6 class="product-name text-dark mb-2">{{ p.name }}</h6>
                  <div class="price-box mb-2">
                    <span class="text-dark fw-bold d-block fs-5">{{ formatPrice(p.price) }}</span>
                    <div class="d-flex align-items-center gap-2">
                      <span class="text-muted text-decoration-line-through x-small">{{ formatPrice(p.price * 1.2) }}</span>
                      <span class="text-danger fw-bold x-small">-20%</span>
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
                      <p class="promo-text-limit text-purple mb-0 animate__animated animate__fadeIn">
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
          <ul class="pagination pagination-sm justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }"><button class="page-link"
                @click="currentPage--">«</button></li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="currentPage = page">{{ page }}</button></li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }"><button class="page-link"
                @click="currentPage++">»</button></li>
          </ul>
        </nav>
      </div>
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
  { id: 'scb', logo: '/src/assets/images/scb.png', detail: 'Giảm 800k qua thẻ Visa SCB' },
  { id: 'ocb', logo: '/src/assets/images/ocb.png', detail: 'Giảm 500k qua thẻ OCB' },
  { id: 'kredivo', logo: '/src/assets/images/kredivo.png', detail: 'Giảm 5% tối đa 200k' },
  { id: 'homepay', logo: '/src/assets/images/homepay.png', detail: 'Giảm 5% qua HomePayLater' }
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
/* --- TEXT MÀU TÍM --- */
.text-purple {
  color: #6f42c1 !important;
  font-weight: 500;
}

.product-card-tgdd {
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Hover: Đổ bóng màu tím nhạt cho đồng bộ */
.product-card-tgdd:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(111, 66, 193, 0.15) !important;
}

.product-img-wrap {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: #fff;
}

.product-img-wrap img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card-tgdd:hover .product-img-wrap img {
  transform: scale(1.05);
}

/* --- THÔNG TIN TÊN & GIÁ --- */
.product-name {
  font-size: 14px;
  font-weight: 500;
  height: 2.8rem;
  line-height: 1.4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #333;
  transition: color 0.3s;
}

/* Hover vào tên sản phẩm chuyển màu tím */
.product-card-tgdd:hover .product-name {
  color: #6f42c1;
}

.price-box .fs-5 {
  font-size: 1.1rem !important;
}

/* --- BANK ICON --- */
.bank-icon-sm {
  width: 38px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  cursor: pointer;
  padding: 2px;
  overflow: hidden;
  flex-shrink: 0;
  transition: all 0.2s;
}

.bank-icon-sm img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Hover bank icon ra màu tím */
.bank-icon-sm:hover {
  border-color: #6f42c1 !important;
  background-color: #f3f0ff; /* Nền tím rất nhạt */
}

/* --- PROMO TEXT --- */
.promo-text-holder {
  min-height: 2.4rem;
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.promo-text-limit {
  font-size: 11px;
  line-height: 1.2rem;
  height: 2.4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word;
}

/* --- PAGINATION MÀU TÍM --- */
.page-link {
  border: none;
  color: #333;
  margin: 0 2px;
  border-radius: 8px !important; /* Bo góc mềm mại hơn */
  transition: all 0.3s;
}

.page-link:hover {
  background-color: #e9ecef;
  color: #6f42c1;
}

.page-item.active .page-link {
  background-color: #6f42c1; /* Nền tím */
  color: #fff;
  box-shadow: 0 2px 6px rgba(111, 66, 193, 0.4);
}
</style>