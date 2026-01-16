<template>
  <!-- NAVBAR
  <nav class="navbar fpt-navbar py-3">
    <div class="container d-flex align-items-center">
      <h4 class="mb-0 fw-bold text-white">Linh kiện điện tử</h4> -->

      <!-- SEARCH BAR -->
<div class="container my-4">
  <div class="search-bar">
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        placeholder="Tìm kiếm sản phẩm..."
        v-model="search"
      />
      <button class="btn btn-outline-fpt">
        Tìm
      </button>
    </div>
  </div>
</div>


  <!-- CONTENT -->
  <div class="container my-4">
    <div class="row">
      <!-- FILTER -->
      <div class="col-md-3">
        <div class="card filter-card">
          <div class="card-header">Bộ lọc</div>
          <div class="card-body">
            <label class="form-label">Danh mục</label>
            <select class="form-select mb-3" v-model="category">
              <option>Tất cả</option>
              <option>CPU</option>
              <option>RAM</option>
              <option>GPU</option>
              <option>SSD</option>
              <option>HDD</option>
            </select>

            <label class="form-label">Khoảng giá</label>
            <select class="form-select" v-model="priceRange">
              <option>Tất cả</option>
              <option>Dưới 2 triệu</option>
              <option>2 – 5 triệu</option>
              <option>Trên 5 triệu</option>
            </select>
          </div>
        </div>
      </div>

      <!-- PRODUCTS -->
      <div class="col-md-9">
        <div class="row g-4">
          <div
            v-for="p in paginatedProducts"
            :key="p.id"
            class="col-xl-4 col-lg-4 col-md-6 col-sm-12"
          >
            <div class="card product-card h-100">
              <div class="product-img-wrap">
                <img :src="p.image" class="product-img" />
              </div>

              <div class="card-body text-center">
                <h6 class="fw-bold">{{ p.name }}</h6>
                <small class="text-muted">{{ p.category }}</small>
                <p class="text-primary fw-bold mt-2">
                  {{ formatPrice(p.price) }}
                </p>
              </div>

              <div class="card-footer bg-white border-0">
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-fpt w-50">
                    Thêm giỏ
                  </button>
                  <router-link
                    :to="`/productuser/${p.id}`"
                    class="btn btn-fpt w-50"
                  >
                    Chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- KHÔNG CÓ SẢN PHẨM -->
          <div
            v-if="filteredProducts.length === 0"
            class="text-center text-muted py-5"
          >
            Không có sản phẩm phù hợp
          </div>
        </div>

        <!-- PAGINATION -->
        <nav class="mt-4" v-if="totalPages > 1">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button
                class="page-link"
                @click="currentPage--"
                :disabled="currentPage === 1"
              >
                «
              </button>
            </li>

            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button
                class="page-link"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button
                class="page-link"
                @click="currentPage++"
                :disabled="currentPage === totalPages"
              >
                »
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// STATE
const search = ref('')
const category = ref('Tất cả')
const priceRange = ref('Tất cả')

// PAGINATION
const currentPage = ref(1)
const pageSize = 10

// FORMAT PRICE
const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + ' đ'
}

// PRODUCTS (20 SP)
const products = ref([
  { id: 1, name: 'CPU Intel i5', category: 'CPU', price: 4500000, image: '/src/assets/inteli5.png' },
  { id: 2, name: 'CPU Intel i7', category: 'CPU', price: 6500000, image: '/src/assets/inteli7.png' },
  { id: 3, name: 'CPU Ryzen 5', category: 'CPU', price: 4200000, image: '/src/assets/ryzen5.png' },
  { id: 4, name: 'CPU Ryzen 7', category: 'CPU', price: 7200000, image: '/src/assets/ryzen7.png' },

  { id: 5, name: 'RAM Corsair 8GB', category: 'RAM', price: 800000, image: '/src/assets/corsair8.png' },
  { id: 6, name: 'RAM Corsair 16GB', category: 'RAM', price: 1200000, image: '/src/assets/corsair16.png' },
  { id: 7, name: 'RAM Kingston 8GB', category: 'RAM', price: 750000, image: '/src/assets/kingston8.png' },
  { id: 8, name: 'RAM Kingston 16GB', category: 'RAM', price: 1300000, image: '/src/assets/kingston16.png' },

  { id: 9, name: 'RTX 3050', category: 'GPU', price: 6200000, image: '/src/assets/rtx3050.png' },
  { id: 10, name: 'RTX 3060', category: 'GPU', price: 7800000, image: '/src/assets/rtx3060.png' },
  { id: 11, name: 'RTX 4060', category: 'GPU', price: 9500000, image: '/src/assets/rtx4060.png' },
  { id: 12, name: 'GTX 1660', category: 'GPU', price: 4800000, image: '/src/assets/gtx1660.png' },

  { id: 13, name: 'SSD Transcend 512GB', category: 'SSD', price: 1400000, image: '/src/assets/trans512.png' },
  { id: 14, name: 'SSD Kingston 1TB', category: 'SSD', price: 2200000, image: '/src/assets/kingston1tb.png' },
  { id: 15, name: 'HDD WD 1TB', category: 'HDD', price: 900000, image: '/src/assets/wd1tb.png' },
  { id: 16, name: 'HDD Seagate 2TB', category: 'HDD', price: 1600000, image: '/src/assets/seagate2tb.png' },

  { id: 17, name: 'SSD Samsung 980 500GB', category: 'SSD', price: 1800000, image: '/src/assets/samsung980.png' },
  { id: 18, name: 'SSD Samsung 970 EVO 1TB', category: 'SSD', price: 2900000, image: '/src/assets/samsung970.png' },
  { id: 19, name: 'HDD Toshiba 1TB', category: 'HDD', price: 850000, image: '/src/assets/toshiba1tb.png' },
  { id: 20, name: 'HDD Seagate 4TB', category: 'HDD', price: 2900000, image: '/src/assets/seagate4tb.png' },
])

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

// PAGINATION COMPUTED
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / pageSize)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

// RESET PAGE WHEN FILTER CHANGE
watch([search, category, priceRange], () => {
  currentPage.value = 1
})
</script>
