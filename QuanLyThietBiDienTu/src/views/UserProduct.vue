<template>
  <div class="container my-4" v-if="products">
    <div class="container my-4">
      <div class="search-bar">
        <div class="input-group shadow-sm">
          <input type="text" class="form-control border-end-0" placeholder="Bạn tìm gì..." v-model="search" />
          <button class="btn btn-warning px-4"><i class="bi bi-search"></i> Tìm</button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3">
        <div class="card filter-card border-0 shadow-sm">
          <div class="card-header bg-white fw-bold">Bộ lọc</div>
          <div class="card-body">
            <label class="form-label small fw-bold">Danh mục</label>
            <select class="form-select mb-3 shadow-none" v-model="category">
              <option>Tất cả</option>
              <option>CPU</option>
              <option>RAM</option>
              <option>GPU</option>
              <option>SSD</option>
              <option>HDD</option>
            </select>

            <label class="form-label small fw-bold">Khoảng giá</label>
            <select class="form-select shadow-none" v-model="priceRange">
              <option>Tất cả</option>
              <option>Dưới 2 triệu</option>
              <option>2 – 5 triệu</option>
              <option>Trên 5 triệu</option>
            </select>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row g-3">
          <div v-for="p in paginatedProducts" :key="p.id" class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <router-link :to="`/productuser/${p.id}`" class="text-decoration-none h-100 d-block">
              <div class="card product-card-tgdd h-100 border-0 shadow-sm p-2">
                
                <div class="product-img-wrap mb-2">
                  <img :src="p.image" class="img-fluid" alt="product" loading="lazy" />
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

                  <div class="small text-muted mb-2">
                     <i class="bi bi-star-fill text-warning"></i> 4.9 • Đã bán 500+
                  </div>

                  <div class="bank-promo-section mt-auto pt-2 border-top">
                    <div class="d-flex gap-1 mb-2">
                      <div 
                        v-for="bank in banks" :key="bank.id"
                        class="bank-icon-sm border rounded"
                        @mouseover="p.hoveredPromo = bank.detail"
                        @mouseleave="p.hoveredPromo = ''"
                      >
                        <img :src="bank.logo" :alt="bank.id">
                      </div>
                    </div>
                    <div class="promo-text-holder">
                    <p v-if="p.hoveredPromo" class="promo-text-limit text-primary mb-0 animate__animated animate__fadeIn">
                      {{ p.hoveredPromo }}
                    </p>
                    <p v-else class="promo-text-limit text-muted mb-0">Rê chuột xem ưu đãi bank</p>
                  </div>
                  </div>
                </div>

              </div>
            </router-link>
          </div>

          <div v-if="filteredProducts.length === 0" class="text-center text-muted py-5">
            Không có sản phẩm phù hợp
          </div>
        </div>

        <nav class="mt-4" v-if="totalPages > 1">
          <ul class="pagination pagination-sm justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage--">«</button>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="currentPage = page">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="currentPage++">»</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

// STATE
const search = ref('')
const category = ref('Tất cả')
const priceRange = ref('Tất cả')
const currentPage = ref(1)
const pageSize = 12 // Tăng lên 12 cho đẹp grid 4 cột

// BANK DATA (Dán link ảnh logo thực tế hoặc local)
const banks = [
  { id: 'scb', logo: '/src/assets/images/scb.png', detail: 'Giảm ngay 800.000đ cho đơn từ 8 triệu khi thanh toán qua thẻ Visa SCB. (HSD: 30/06/2026)' },
  { id: 'ocb', logo: '/src/assets/images/ocb.png', detail: 'Giảm ngay 500.000đ cho đơn hàng từ 10 triệu khi thanh toán bằng thẻ OCB. (HSD: 28/02/2026)' },
  { id: 'kredivo', logo: '/src/assets/images/kredivo.png', detail: 'Giảm ngay 50% tối đa 100.000đ cho Khách hàng mới hoặc Giảm 5% tối đa 200.000đ đơn từ 700k qua Kredivo.' },
  { id: 'homepay', logo: '/src/assets/images/homepay.png', detail: 'Giảm ngay 5% tối đa 50.000đ cho Khách hàng thân thiết khi thanh toán qua HomePayLater.' }
]

// PRODUCTS DATA
const products = ref([
  { id: 1, name: 'CPU Intel i5 12400F (LGA 1700/6 Core-12 Thread)', category: 'CPU', price: 4500000, image: '/src/assets/images/inteli5.png', hoveredPromo: '' },
  { id: 2, name: 'CPU Intel i7 13700K Gaming Pro', category: 'CPU', price: 6500000, image: '/src/assets/images/inteli7.png', hoveredPromo: '' },
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
])

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + ' đ'
}

// FILTER + SEARCH
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchName = p.name.toLowerCase().includes(search.value.toLowerCase())
    const matchCategory = category.value === 'Tất cả' || p.category === category.value
    const matchPrice =
      priceRange.value === 'Tất cả' ||
      (priceRange.value === 'Dưới 2 triệu' && p.price < 2000000) ||
      (priceRange.value === '2 – 5 triệu' && p.price >= 2000000 && p.price <= 5000000) ||
      (priceRange.value === 'Trên 5 triệu' && p.price > 5000000)

    return matchName && matchCategory && matchPrice
  })
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

watch([search, category, priceRange], () => { currentPage.value = 1 })
</script>
<style scoped>
/* --- CSS NÂNG CẤP THEO PHONG CÁCH TGDD --- */

.product-card-tgdd {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  background-color: #fff;
}

.product-card-tgdd:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
  transform: translateY(-5px);
}

.product-img-wrap {
  height: 160px; /* Thu nhỏ ảnh lại một chút cho đẹp */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.product-img-wrap img {
  max-height: 100%;
  object-fit: contain;
}

.product-name {
  font-size: 14px;
  line-height: 1.4;
  height: 2.8rem; /* Giữ tối đa 2 dòng tên */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.x-small {
  font-size: 11px;
}

/* --- PHẦN NGÂN HÀNG (TO RÕ HƠN) --- */
.bank-icon-sm {
  width: 42px; /* Tăng kích thước logo bank */
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.bank-icon-sm img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.bank-icon-sm:hover {
  border-color: #2f80ed !important;
}

.promo-text-holder {
  height: 2.2rem; /* Cố định chiều cao để card không bị nhảy khi hover */
  display: flex;
  align-items: center;
}

.promo-hint {
  font-size: 12px;
  line-height: 1.2;
}

/* Tùy chỉnh Badge giảm giá */
.badge.bg-danger {
  font-weight: 500;
  border-radius: 4px;
}
/* --- CSS CẮT CHỮ 2 DÒNG --- */
.promo-text-limit {
    display: -webkit-box;
    -webkit-line-clamp: 2;    /* Số dòng muốn hiển thị tối đa */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;   /* Ngắt từ để không bị tràn khung */
    
    /* Cố định chiều cao dòng để các card luôn bằng nhau */
    line-height: 1.2rem; 
    height: 2.4rem;           /* = line-height * 2 */
    font-size: 12px;
}

/* Đảm bảo khung chứa không bị nhảy khi có nội dung */
.promo-text-holder {
    min-height: 2.4rem;
    display: flex;
    align-items: center;
}
</style>