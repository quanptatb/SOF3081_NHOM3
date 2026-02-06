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
                      <div v-for="bank in banks" :key="bank.id" 
                           class="bank-icon-sm border rounded"
                           @mouseover="p.hoveredPromo = bank.detail" 
                           @mouseleave="p.hoveredPromo = ''">
                        <img :src="bank.logo" class="img-fluid" />
                      </div>
                    </div>
                    <div class="promo-text-holder">
                      <p class="promo-text-limit text-primary mb-0 animate__animated animate__fadeIn">
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
            <li class="page-item" :class="{ disabled: currentPage === 1 }"><button class="page-link" @click="currentPage--">«</button></li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }"><button class="page-link" @click="currentPage = page">{{ page }}</button></li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }"><button class="page-link" @click="currentPage++">»</button></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const search = ref('')
const category = ref('Tất cả')
const priceRange = ref('Tất cả')
const currentPage = ref(1)
const pageSize = 12

// 👂 Nhận tín hiệu từ Navbar
const handleNavbarFilter = (e) => {
  search.value = e.detail.search;
  category.value = e.detail.category;
  priceRange.value = e.detail.price;
  currentPage.value = 1;
};

onMounted(() => {
  window.addEventListener('nav-search-filter', handleNavbarFilter);
});

onUnmounted(() => {
  window.removeEventListener('nav-search-filter', handleNavbarFilter);
});

// (Dữ liệu banks và products giữ nguyên như code cũ của bạn bên dưới)
const banks = [
  { id: 'scb', logo: '/src/assets/images/scb.png', detail: 'Giảm 800k qua thẻ Visa SCB' },
  { id: 'ocb', logo: '/src/assets/images/ocb.png', detail: 'Giảm 500k qua thẻ OCB' },
  { id: 'kredivo', logo: '/src/assets/images/kredivo.png', detail: 'Giảm 5% tối đa 200k' },
  { id: 'homepay', logo: '/src/assets/images/homepay.png', detail: 'Giảm 5% qua HomePayLater' }
];

const products = ref([
  { id: 1, name: 'CPU Intel i5 12400F', category: 'CPU', price: 4500000, image: '/src/assets/images/inteli5.png', hoveredPromo: '' },
  { id: 2, name: 'CPU Intel i7 13700K', category: 'CPU', price: 6500000, image: '/src/assets/images/inteli7.png', hoveredPromo: '' },
  
  { id: 3, name: 'CPU Ryzen 5 5600X', category: 'CPU', price: 4200000, image: '/src/assets/images/ryzen5.png', hoveredPromo: '' },

  { id: 4, name: 'Bộ vi xử lý AMD Ryzen 7 8700G / 4.2GHz Boost 5.1GHz / 8 nhân 16 luồng / 24MB / AM5', category: 'CPU', price: 7200000, image: '/src/assets/images/ryzen7.png', hoveredPromo: '' },

  { id: 5, name: 'Ram Corsair Vengeance LPX 8GB (1x8GB) 3200 (CMK8GX4M1E3200C16)', category: 'RAM', price: 800000, image: '/src/assets/images/corsair8.png', hoveredPromo: '' },

  { id: 6, name: 'RAM Laptop Kingston 1.2V 8GB 3200MHz KVR32S22S8/8', category: 'RAM', price: 1200000, image: '/src/assets/images/corsair16.png', hoveredPromo: '' },

  { id: 7, name: 'RAM Kingston 8GB', category: 'RAM', price: 750000, image: '/src/assets/images/kingston8.png', hoveredPromo: '' },

  { id: 8, name: 'RAM Kingston 16GB', category: 'RAM', price: 1300000, image: '/src/assets/images/kingston16.png', hoveredPromo: '' },



  { id: 9, name: 'MSI RTX 3050 VENTUS 2X 6G OC', category: 'GPU', price: 6200000, image: '/src/assets/images/rtx3050.png', hoveredPromo: '' },

  { id: 10, name: 'MSI RTX 3060 VENTUS 2X OC 12 GB (12GB GDDR6, 192-bit, HDMI +DP, 1x8-pin)', category: 'GPU', price: 7800000, image: '/src/assets/images/rtx3060.png', hoveredPromo: '' },

  { id: 11, name: 'Card màn hình ASUS Dual GeForce RTX 4060 V2 OC Edition 8GB GDDR6 (DUAL-RTX4060-O8G-V2)', category: 'GPU', price: 9500000, image: '/src/assets/images/rtx4060.png', hoveredPromo: '' },

  { id: 12, name: 'MSI GeForce GTX 1660 Ti ARMOR 6G OC', category: 'GPU', price: 4800000, image: '/src/assets/images/gtx1660.png', hoveredPromo: '' },



  { id: 13, name: 'SSD Transcend 512GB', category: 'SSD', price: 1400000, image: '/src/assets/images/trans512.png', hoveredPromo: '' },

  { id: 14, name: 'SSD Kingston 1TB', category: 'SSD', price: 2200000, image: '/src/assets/images/kingston1tb.png', hoveredPromo: '' },

  { id: 15, name: 'HDD WD 1TB', category: 'HDD', price: 900000, image: '/src/assets/images/wd1tb.png', hoveredPromo: '' },

  { id: 16, name: 'HDD Seagate 2TB', category: 'HDD', price: 1600000, image: '/src/assets/images/seagate2tb.png', hoveredPromo: '' },



  { id: 17, name: 'SSD Samsung 980 500GB', category: 'SSD', price: 1800000, image: '/src/assets/images/samsung980.png', hoveredPromo: '' },

  { id: 18, name: 'SSD Samsung 970 EVO 1TB', category: 'SSD', price: 2900000, image: '/src/assets/images/samsung970.png', hoveredPromo: '' },

  { id: 19, name: 'HDD Toshiba 1TB', category: 'HDD', price: 850000, image: '/src/assets/images/toshiba1tb.png', hoveredPromo: '' },

  { id: 20, name: 'HDD Seagate 4TB', category: 'HDD', price: 2900000, image: '/src/assets/images/seagate4tb.png', hoveredPromo: '' },
]);

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
.product-card-tgdd { border-radius: 12px; transition: 0.3s; background: #fff; }
.product-card-tgdd:hover { transform: translateY(-5px); box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important; }
.product-img-wrap { height: 160px; display: flex; align-items: center; justify-content: center; padding: 10px; }
.product-name { font-size: 14px; height: 2.8rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.bank-icon-sm { width: 40px; height: 24px; padding: 2px; cursor: pointer; }
.promo-text-limit { font-size: 11px; height: 2.4rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.promo-text-holder { min-height: 2.4rem; display: flex; align-items: center; }


.product-card-tgdd { 
  border-radius: 12px; 
  transition: all 0.3s ease; 
  background: #fff; 
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.product-card-tgdd:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important; 
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
}

.price-box .fs-5 {
  font-size: 1.1rem !important;
}

/* --- FIX LỖI BOX NGÂN HÀNG --- */
.bank-icon-sm { 
  width: 38px; /* Cố định độ rộng */
  height: 24px; /* Cố định độ cao */
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: #fff;
  cursor: pointer;
  padding: 2px;
  overflow: hidden;
  flex-shrink: 0; /* Không cho phép co lại */
}

.bank-icon-sm img { 
  width: 100%; 
  height: 100%; 
  object-fit: contain; /* Logo bank luôn nằm gọn trong ô */
}

.bank-icon-sm:hover { 
  border-color: #2f80ed !important; 
}

/* --- FIX LỖI TEXT ƯU ĐÃI (DẤU 3 CHẤM) --- */
.promo-text-holder { 
  min-height: 2.4rem; /* Giữ chỗ để card không bị nhảy khi hover */
  display: flex; 
  align-items: center; 
  margin-top: 5px;
}

.promo-text-limit { 
  font-size: 11px; 
  line-height: 1.2rem;
  height: 2.4rem; /* Đúng bằng 2 dòng */
  overflow: hidden; 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
  text-overflow: ellipsis;
  word-break: break-word;
}

/* Pagination tinh chỉnh */
.page-link {
  border: none;
  color: #333;
  margin: 0 2px;
  border-radius: 4px !important;
}

.page-item.active .page-link {
  background-color: #2f80ed;
  color: #fff;
}
</style>