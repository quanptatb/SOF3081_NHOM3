<template>
  <div class="container my-3" v-if="products">
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
                      <span class="text-secondary text-decoration-line-through x-small fw-semibold">{{ formatPrice(p.price * 1.2) }}</span>
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
/* --- TEXT & COLORS --- */
.text-purple {
  color: #6f42c1 !important;
}

.text-black {
  color: #111 !important;
}

/* --- CARD SẢN PHẨM --- */
.product-card-tgdd {
  border: 1px solid #ced4da; /* Viền xám đậm hơn chút */
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
  border-bottom: 1px solid #e9ecef; /* Đường kẻ dưới ảnh */
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
  border-color: #ced4da !important; /* Viền icon đậm hơn */
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
  box-shadow: 0 4px 10px rgba(111, 66, 193, 0.3);
}
</style>

<style>
/* Làm đậm nền của các ô Dropdown (Select) */
.form-select, select.form-control {
  background-color: #f1f3f5 !important; /* Màu xám đậm hơn */
  border-color: #ced4da !important; /* Viền đậm hơn */
  color: #212529 !important; /* Chữ đen */
  font-weight: 500;
}

/* Khi bấm vào Dropdown */
.form-select:focus, select.form-control:focus {
  background-color: #fff !important;
  border-color: #6f42c1 !important;
  box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25) !important;
}
</style>