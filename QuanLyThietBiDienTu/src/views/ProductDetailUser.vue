<template>
  <div class="container-custom my-5" v-if="product">
    <!-- BACK -->
    <router-link to="/" class="text-decoration-none text-muted">
      ← Quay lại danh sách
    </router-link>

    <!-- MAIN INFO -->
    <div class="row mt-4">
      <!-- IMAGE -->
      <div class="col-md-5">
        <div class="card p-3">
          <img
            :src="product.image"
            class="img-fluid rounded"
            alt="product image"
          />
        </div>
      </div>

      <!-- INFO -->
      <div class="col-md-7">
        <h3 class="fw-bold">{{ product.name }}</h3>
        <p class="text-muted mb-2">{{ product.category }}</p>

        <h4 class="text-danger fw-bold">
          {{ formatPrice(product.price) }}
        </h4>

        <p class="mt-3">
          {{ product.description }}
        </p>

        <button class="btn btn-outline-fpt mt-3">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>

    <!-- DETAILS -->
    <div class="row mt-5">
      <!-- SPEC -->
      <div class="col-md-6">
        <h5 class="fw-bold mb-3">Thông số kỹ thuật</h5>
        <table class="table table-bordered">
          <tbody>
            <tr v-for="(value, key) in product.specs" :key="key">
              <th style="width: 40%">{{ key }}</th>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SUITABLE -->
      <div class="col-md-6">
        <h5 class="fw-bold mb-3">Phù hợp cho</h5>
        <ul class="list-group">
          <li
            v-for="item in product.suitable"
            :key="item"
            class="list-group-item"
          >
            ✔ {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- NOT FOUND -->
  <div v-else class="text-center py-5 text-muted">
    Không tìm thấy sản phẩm
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const id = Number(route.params.id)

const products = [
  {
    id: 1,
    name: 'CPU Intel i5',
    category: 'CPU',
    price: 4500000,
    image: '/src/assets/inteli5.png',
    description: 'CPU Intel Core i5 phù hợp cho học tập, văn phòng và lập trình cơ bản.',
    specs: {
      'Nhân / Luồng': '6 / 12',
      'Xung nhịp': '3.2GHz',
      'Socket': 'LGA 1700'
    },
    suitable: ['Học tập', 'Văn phòng']
  },
  {
    id: 2,
    name: 'CPU Intel i7',
    category: 'CPU',
    price: 6500000,
    image: '/src/assets/inteli7.png',
    description: 'CPU Intel Core i7 hiệu năng cao, phù hợp gaming và đồ họa.',
    specs: {
      'Nhân / Luồng': '8 / 16',
      'Turbo': '5.0GHz',
      'Socket': 'LGA 1700'
    },
    suitable: ['Gaming', 'Designer', 'Lập trình']
  },
  {
    id: 3,
    name: 'CPU Ryzen 5',
    category: 'CPU',
    price: 4200000,
    image: '/src/assets/ryzen5.png',
    description: 'AMD Ryzen 5 cân tốt gaming và đa nhiệm.',
    specs: {
      'Nhân / Luồng': '6 / 12',
      'Xung nhịp': '3.6GHz',
      'Socket': 'AM4'
    },
    suitable: ['Gaming', 'Đa nhiệm']
  },
  {
    id: 4,
    name: 'CPU Ryzen 7',
    category: 'CPU',
    price: 7200000,
    image: '/src/assets/ryzen7.png',
    description: 'AMD Ryzen 7 dành cho công việc nặng và render.',
    specs: {
      'Nhân / Luồng': '8 / 16',
      'Xung nhịp': '3.8GHz',
      'Socket': 'AM4'
    },
    suitable: ['Render', 'Đồ họa']
  },

  {
    id: 5,
    name: 'RAM Corsair 8GB',
    category: 'RAM',
    price: 800000,
    image: '/src/assets/corsair8.png',
    description: 'RAM Corsair 8GB ổn định cho máy văn phòng.',
    specs: {
      'Dung lượng': '8GB',
      'Bus': '3200MHz',
      'Loại': 'DDR4'
    },
    suitable: ['Văn phòng']
  },
  {
    id: 6,
    name: 'RAM Corsair 16GB',
    category: 'RAM',
    price: 1200000,
    image: '/src/assets/corsair16.png',
    description: 'RAM Corsair 16GB cho gaming và đa nhiệm.',
    specs: {
      'Dung lượng': '16GB',
      'Bus': '3200MHz',
      'Loại': 'DDR4'
    },
    suitable: ['Gaming', 'Đa nhiệm']
  },
  {
    id: 7,
    name: 'RAM Kingston 8GB',
    category: 'RAM',
    price: 750000,
    image: '/src/assets/kingston8.png',
    description: 'RAM Kingston 8GB bền bỉ, giá tốt.',
    specs: {
      'Dung lượng': '8GB',
      'Bus': '2666MHz',
      'Loại': 'DDR4'
    },
    suitable: ['Học tập']
  },
  {
    id: 8,
    name: 'RAM Kingston 16GB',
    category: 'RAM',
    price: 1300000,
    image: '/src/assets/kingston16.png',
    description: 'RAM Kingston 16GB tối ưu hiệu năng.',
    specs: {
      'Dung lượng': '16GB',
      'Bus': '3200MHz',
      'Loại': 'DDR4'
    },
    suitable: ['Gaming']
  },

  {
    id: 9,
    name: 'RTX 3050',
    category: 'GPU',
    price: 6200000,
    image: '/src/assets/rtx3050.png',
    description: 'Card đồ họa RTX 3050 chơi game Full HD.',
    specs: {
      'VRAM': '8GB',
      'Kiến trúc': 'Ampere'
    },
    suitable: ['Gaming']
  },
  {
    id: 10,
    name: 'RTX 3060',
    category: 'GPU',
    price: 7800000,
    image: '/src/assets/rtx3060.png',
    description: 'RTX 3060 mạnh mẽ cho đồ họa và game.',
    specs: {
      'VRAM': '12GB',
      'Kiến trúc': 'Ampere'
    },
    suitable: ['Gaming', 'Đồ họa']
  },
  {
    id: 11,
    name: 'RTX 4060',
    category: 'GPU',
    price: 9500000,
    image: '/src/assets/rtx4060.png',
    description: 'RTX 4060 thế hệ mới, hiệu năng cao.',
    specs: {
      'VRAM': '8GB',
      'DLSS': 'DLSS 3'
    },
    suitable: ['Gaming', 'Streamer']
  },
  {
    id: 12,
    name: 'GTX 1660',
    category: 'GPU',
    price: 4800000,
    image: '/src/assets/gtx1660.png',
    description: 'GTX 1660 giá tốt cho gaming eSports.',
    specs: {
      'VRAM': '6GB',
      'Kiến trúc': 'Turing'
    },
    suitable: ['eSports']
  },

  {
    id: 13,
    name: 'SSD Transcend 512GB',
    category: 'SSD',
    price: 1400000,
    image: '/src/assets/trans512.png',
    description: 'SSD Transcend tốc độ cao, bền bỉ.',
    specs: {
      'Dung lượng': '512GB',
      'Chuẩn': 'SATA'
    },
    suitable: ['Văn phòng']
  },
  {
    id: 14,
    name: 'SSD Kingston 1TB',
    category: 'SSD',
    price: 2200000,
    image: '/src/assets/kingston1tb.png',
    description: 'SSD Kingston 1TB lưu trữ lớn.',
    specs: {
      'Dung lượng': '1TB',
      'Chuẩn': 'NVMe'
    },
    suitable: ['Gaming']
  },
  {
    id: 15,
    name: 'HDD WD 1TB',
    category: 'HDD',
    price: 900000,
    image: '/src/assets/wd1tb.png',
    description: 'HDD WD 1TB lưu trữ dữ liệu.',
    specs: {
      'Dung lượng': '1TB',
      'Vòng quay': '7200RPM'
    },
    suitable: ['Lưu trữ']
  },
  {
    id: 16,
    name: 'HDD Seagate 2TB',
    category: 'HDD',
    price: 1600000,
    image: '/src/assets/seagate2tb.png',
    description: 'HDD Seagate dung lượng lớn.',
    specs: {
      'Dung lượng': '2TB',
      'Vòng quay': '7200RPM'
    },
    suitable: ['Lưu trữ']
  },

  {
    id: 17,
    name: 'SSD Samsung 980 500GB',
    category: 'SSD',
    price: 1800000,
    image: '/src/assets/samsung980.png',
    description: 'SSD Samsung 980 tốc độ cao.',
    specs: {
      'Dung lượng': '500GB',
      'Chuẩn': 'NVMe'
    },
    suitable: ['Gaming']
  },
  {
    id: 18,
    name: 'SSD Samsung 970 EVO 1TB',
    category: 'SSD',
    price: 2900000,
    image: '/src/assets/samsung970.png',
    description: 'SSD cao cấp cho công việc nặng.',
    specs: {
      'Dung lượng': '1TB',
      'Chuẩn': 'NVMe'
    },
    suitable: ['Designer']
  },
  {
    id: 19,
    name: 'HDD Toshiba 1TB',
    category: 'HDD',
    price: 850000,
    image: '/src/assets/toshiba1tb.png',
    description: 'HDD Toshiba ổn định, bền.',
    specs: {
      'Dung lượng': '1TB',
      'Vòng quay': '7200RPM'
    },
    suitable: ['Lưu trữ']
  },
  {
    id: 20,
    name: 'HDD Seagate 4TB',
    category: 'HDD',
    price: 2900000,
    image: '/src/assets/seagate4tb.png',
    description: 'HDD dung lượng lớn cho server cá nhân.',
    specs: {
      'Dung lượng': '4TB',
      'Vòng quay': '7200RPM'
    },
    suitable: ['Server', 'Lưu trữ']
  }
]


const product = computed(() =>
  products.find(p => p.id === id)
)

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN') + ' đ'
</script>
