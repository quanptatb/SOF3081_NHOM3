<template>
  <div class="container my-4" v-if="product">
    <div class="product-header mb-3 border-bottom pb-2">
      <ul class="breadcrumb mb-1 text-muted small">
        <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
        <li class="breadcrumb-item"><span class="text-secondary">{{ product.category }}</span></li>
        <li class="breadcrumb-item active">{{ product.name }}</li>
      </ul>
      <div class="d-flex align-items-center gap-3 flex-wrap">
        <h3 class="fw-bold mb-0 text-dark">{{ product.name }}</h3>
        <span class="text-warning small">★★★★★ (14 đánh giá)</span>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-7 col-md-12 mb-4">
        <div class="card border-0 shadow-sm mb-4 overflow-hidden">
          <div id="productGalleryCarousel" class="carousel slide">
            <div class="position-relative bg-white" style="min-height: 400px;">
                <div class="carousel-inner h-100">
                    <div v-for="(img, index) in product.images" :key="index" class="carousel-item h-100" :class="{ active: index === currentImageIndex }">
                        <div class="d-flex align-items-center justify-content-center p-3" style="height: 400px;">
                            <img :src="img" class="d-block img-fluid main-product-img" :alt="product.name">
                        </div>
                    </div>
                </div>
                <button @click="prevSlide" class="carousel-control-prev custom-control" type="button"><span class="carousel-control-prev-icon"></span></button>
                <button @click="nextSlide" class="carousel-control-next custom-control" type="button"><span class="carousel-control-next-icon"></span></button>
            </div>
            <div class="card-footer bg-white border-top">
                <div class="custom-indicators-container">
                    <button v-for="(img, index) in product.images" :key="index" type="button" class="thumb-btn" :class="{ 'active-thumb': index === currentImageIndex }" @click="currentImageIndex = index">
                        <img :src="img" class="img-fluid object-fit-contain">
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div class="border rounded p-3 mb-4 bg-white">
            <h6 class="fw-bold mb-3 text-primary">Shop NoName Cam Kết</h6>
            <div class="row g-3">
                <div class="col-md-6 d-flex gap-2"><i class="bi bi-cpu text-primary"></i> <span class="small">Hiệu năng mạnh mẽ, xử lý mượt mà.</span></div>
                <div class="col-md-6 d-flex gap-2"><i class="bi bi-shield-check text-primary"></i> <span class="small">Bảo hành 36 tháng chính hãng.</span></div>
            </div>
        </div>

        <div id="specs-section" class="card border-0 mb-4 scroll-mt">
            <h5 class="fw-bold mb-3">Thông số kỹ thuật</h5>
            <div class="table-responsive rounded border">
                <table class="table table-striped table-hover mb-0">
                  <tbody>
                    <tr v-for="(value, key) in product.specs" :key="key">
                      <td class="text-secondary ps-3 py-3" style="width: 35%;">{{ key }}</td>
                      <td class="text-dark fw-medium py-3">{{ value }}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
        </div>
      </div>

      <div class="col-lg-5 col-md-12">
        <div class="mb-3">
            <h2 class="text-danger fw-bold d-inline-block me-2">{{ formatPrice(product.price) }}</h2>
            <span class="text-decoration-line-through text-muted small">{{ formatPrice(product.price * 1.1) }}</span>
            <div class="mt-1"><a href="#specs-section" @click.prevent="scrollToSpecs" class="text-primary small text-decoration-none">Xem thông số kỹ thuật</a></div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white d-flex justify-content-between align-items-center py-2">
                <strong class="small">Ưu đãi thanh toán</strong>
                <button class="btn btn-link text-decoration-none p-0 small" data-bs-toggle="offcanvas" data-bs-target="#paymentOffcanvas">Xem tất cả</button>
            </div>
            <div class="card-body p-3">
                <div class="d-flex gap-2 mb-3 overflow-auto">
                    <div v-for="offer in paymentOffers" :key="offer.id" class="payment-logo-box border rounded p-1 cursor-pointer" :class="{ 'active': activeOffer.id === offer.id }" @mouseover="manualSetActive(offer.id, offer.detail)">
                        <img :src="offer.logo" style="width:55px;height:30px;object-fit:contain;">
                    </div>
                </div>
                <div class="alert alert-light border p-2 small mb-0">{{ activeOffer.detail }}</div>
            </div>
        </div>

        <div class="d-grid gap-2 mb-4">
          <button class="btn btn-danger btn-lg py-3 fw-bold text-uppercase shadow-sm">Mua Ngay</button>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4 bg-white p-4 mt-4">
        <h5 class="fw-bold mb-4">Đánh giá & Nhận xét {{ product.name }}</h5>
        
        <div class="row align-items-center mb-5 border-bottom pb-4">
            <div class="col-md-4 text-center border-end">
                <h1 class="text-warning fw-bold mb-0">4.9<span class="fs-4 text-muted">/5</span></h1>
                <div class="text-warning fs-5">
                    <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
                <p class="text-muted small mt-2">722 khách hàng hài lòng</p>
            </div>

            <div class="col-md-8 px-lg-5">
                <div v-for="star in [5,4,3,2,1]" :key="star" class="d-flex align-items-center mb-2">
                    <div class="small me-2" style="width: 10px;">{{ star }}</div>
                    <i class="bi bi-star-fill text-warning small me-2"></i>
                    <div class="progress flex-grow-1" style="height: 6px;">
                        <div class="progress-bar bg-primary" :style="{ width: star === 5 ? '99.5%' : (star === 4 ? '0.2%' : (star === 1 ? '0.1%' : '0%')) }"></div>
                    </div>
                    <div class="small text-muted ms-3" style="width: 40px;">{{ star === 5 ? '99.5%' : (star === 4 ? '0.2%' : '0%') }}</div>
                </div>
            </div>
        </div>

        <div class="comment-list">
            <div v-for="(comment, index) in localComments" :key="index" class="comment-item border-bottom pb-3 mb-4">
                <div class="d-flex align-items-center gap-2 mb-1">
                    <strong class="text-dark">{{ comment.user }}</strong>
                    <span class="text-success small"><i class="bi bi-check-circle-fill"></i> Đã mua tại NoName</span>
                </div>
                <div class="text-warning small mb-2">
                    <i v-for="s in comment.rating" :key="s" class="bi bi-star-fill"></i>
                </div>
                <p class="small text-dark mb-1">{{ comment.content }}</p>
                <div class="small text-muted" style="font-size: 11px;">{{ comment.date }}</div>
            </div>
        </div>

        <button class="btn btn-primary w-100 py-2 fw-bold mt-3" data-bs-toggle="modal" data-bs-target="#reviewModal">VIẾT ĐÁNH GIÁ</button>
    </div>

    <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header">
                    <h5 class="fw-bold">Gửi đánh giá sản phẩm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <p class="text-muted small mb-2">{{ product.name }}</p>
                    <div class="rating-stars mb-3 fs-2">
                        <span v-for="star in 5" :key="star" @click="newReview.rating = star" @mouseover="hoverRating = star" @mouseleave="hoverRating = 0" class="star-icon cursor-pointer">
                            <i :class="(hoverRating || newReview.rating) >= star ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"></i>
                        </span>
                        <p class="mt-2 small fw-bold text-primary">{{ getRatingText(hoverRating || newReview.rating) }}</p>
                    </div>
                    <textarea v-model="newReview.content" class="form-control mb-3" rows="4" placeholder="Mời bạn chia sẻ thêm cảm nhận..."></textarea>
                    <input v-model="newReview.user" type="text" class="form-control mb-3" placeholder="Họ và tên (Bắt buộc)">
                    <button @click="submitReview" class="btn btn-primary w-100 py-2 fw-bold shadow">GỬI ĐÁNH GIÁ NGAY</button>
                </div>
            </div>
        </div>
    </div>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="paymentOffcanvas" style="width: 400px;">
        <div class="offcanvas-header border-bottom">
            <h5 class="fw-bold m-0">Ưu đãi thanh toán</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body p-3 bg-light">
            <div v-for="offer in paymentOffers" :key="offer.id" class="card border-0 shadow-sm mb-3 p-3 rounded-3">
                <div class="d-flex align-items-center gap-3">
                    <img :src="offer.logo" style="width: 60px; height: 40px; object-fit: contain;">
                    <p class="small m-0 text-dark">{{ offer.detail }}</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'

const route = useRoute()
const id = Number(route.params.id)

// Variant selection state (was missing and caused reference errors)
const selectedStorage = ref('256GB')
const selectedColor = ref('Titan Sa Mạc')
const storageOptions = ['256GB', '512GB', '1TB']
const colorOptions = [
  { name: 'Titan Sa Mạc', img: 'https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-vang-sa-mac-200x200.jpg' },
  { name: 'Titan Trắng', img: 'https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-trang-200x200.jpg' },
  { name: 'Titan Đen', img: 'https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-den-200x200.jpg' }
]
const promotions = [
    'Tặng keo tản nhiệt cao cấp khi mua CPU',
    'Giảm ngay 500.000đ khi mua kèm Mainboard cùng hãng',
    'Giảm thêm 300.000đ khi build trọn bộ PC (CPU + RAM + SSD)',
    'Thu cũ CPU – Giảm đến 1.500.000đ khi nâng cấp đời mới'
]

// 2. DỮ LIỆU ĐÃ ĐƯỢC FIX (Xóa thuộc tính image ở cả 20 item)
const products = [
  // --- CPU ---
  {
    id: 1,
    name: 'CPU Intel Core i5 12400F (LGA 1700/6 Core-12 Thread/2.5 GHz-4.4 GHz/18 MB/65 W)',
    category: 'CPU',
    price: 4500000,
    images: [
        '/src/assets/images/inteli5.png',
        '/src/assets/images/inteli5anh2.png',
        '/src/assets/images/inteli5anh3.png',
        '/src/assets/images/inteli5anh4.png',
        '/src/assets/images/inteli5anh5.png',
        '/src/assets/images/inteli5anh6.png',
    ],
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
    name: 'CPU Intel Core i7 13700F',
    category: 'CPU',
    price: 6500000,
    images: ['/src/assets/images/inteli7.png',
    '/src/assets/images/inteli7anh2.png',
    '/src/assets/images/inteli7anh3.png',
    '/src/assets/images/inteli7anh4.png',
    '/src/assets/images/inteli7anh5.png',
    '/src/assets/images/inteli7anh6.png'],
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
    name: 'CPU AMD Ryzen 5 Pro 4650G',
    category: 'CPU',
    price: 4200000,
    images: ['/src/assets/images/ryzen5.png',
    '/src/assets/images/ryzen5anh2.png',
    '/src/assets/images/ryzen5anh3.png',
    '/src/assets/images/ryzen5anh4.png',
    '/src/assets/images/ryzen5anh5.png',
    '/src/assets/images/ryzen5anh6.png'],
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
    name: 'CPU AMD Ryzen 7 8700G',
    category: 'CPU',
    price: 7200000,
    images: ['/src/assets/images/ryzen7.png',
    '/src/assets/images/ryzen7anh2.png',
    '/src/assets/images/ryzen7anh3.png',
    '/src/assets/images/ryzen7anh3.png',
    '/src/assets/images/ryzen7anh4.png'],
    description: 'AMD Ryzen 7 dành cho công việc nặng và render.',
    specs: {
      'Nhân / Luồng': '8 / 16',
      'Xung nhịp': '3.8GHz',
      'Socket': 'AM4'
    },
    suitable: ['Render', 'Đồ họa']
  },

  // --- RAM ---
  {
    id: 5,
    name: 'Corsair Vengeance LPX 8GB (1x8GB) DDR4 3200MHz - CMK8GX4M1E3200C16',
    category: 'RAM',
    price: 800000,
    images: ['/src/assets/images/corsair8.png', '/src/assets/images/corsair8anh2.png', '/src/assets/images/corsair8anh3.png', '/src/assets/images/corsair8anh4.png'],
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
    name: 'Ram Corsair Vengeance LPX 16GB 3200MHz DDR4 (CMK16GX4M1E3200C16)',
    category: 'RAM',
    price: 1200000,
    images: ['/src/assets/images/corsair16.png', '/src/assets/images/corsair16anh2.png', '/src/assets/images/corsair16anh3.png', '/src/assets/images/corsair16anh4.png'],
    description: 'RAM Corsair 16GB cho gaming và đa nhiệm.',
    specs: {
      'Dung lượng': '16GB',
      'Bus': '3200MHz',
      'Loại': 'DDR4'
    },
    suitable: ['Gaming', 'Đa nhiệm']
  },
  {
    id: 6,
    name: 'Corsair Vengeance LPX 16GB (1x16GB) DDR4 3200MHz - CMK16GX4M1E3200C16',
    category: 'RAM',
    price: 750000,
    images: ['/src/assets/kingston8.png', '/src/assets/kingston8.png', '/src/assets/kingston8.png', '/src/assets/kingston8.png'],
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
    images: ['/src/assets/kingston16.png', '/src/assets/kingston16.png', '/src/assets/kingston16.png', '/src/assets/kingston16.png'],
    description: 'RAM Kingston 16GB tối ưu hiệu năng.',
    specs: {
      'Dung lượng': '16GB',
      'Bus': '3200MHz',
      'Loại': 'DDR4'
    },
    suitable: ['Gaming']
  },

  // --- GPU ---
  {
    id: 9,
    name: 'MSI GeForce RTX 3050 VENTUS 2X 8G OC - 8GB GDDR6',
    category: 'GPU',
    price: 6200000,
    images: ['/src/assets/images/rtx3050.png', '/src/assets/images/rtx3050anh2.png', '/src/assets/images/rtx3050anh3.png', '/src/assets/images/rtx3050anh4.png'],
    description: 'Card đồ họa RTX 3050 chơi game Full HD.',
    specs: {
      'VRAM': '8GB',
      'Kiến trúc': 'Ampere'
    },
    suitable: ['Gaming']
  },
  {
    id: 10,
    name: 'MSI GeForce RTX 3060 VENTUS 2X 12G OC - 12GB GDDR6',
    category: 'GPU',
    price: 7800000,
    images: ['/src/assets/images/rtx3060.png', '/src/assets/images/rtx3060anh2.png', '/src/assets/images/rtx3060anh3.png', '/src/assets/images/rtx3060anh4.png'],
    description: 'RTX 3060 mạnh mẽ cho đồ họa và game.',
    specs: {
      'VRAM': '12GB',
      'Kiến trúc': 'Ampere'
    },
    suitable: ['Gaming', 'Đồ họa']
  },
  {
    id: 11,
    name: 'ASUS Dual GeForce RTX 4060 V2 OC - 8GB GDDR6',
    category: 'GPU',
    price: 9500000,
    images: ['/src/assets/images/rtx4060.png', '/src/assets/images/rtx4060anh2.png', '/src/assets/images/rtx4060anh3.png', '/src/assets/images/rtx4060anh4.png'],
    description: 'RTX 4060 thế hệ mới, hiệu năng cao.',
    specs: {
      'VRAM': '8GB',
      'DLSS': 'DLSS 3'
    },
    suitable: ['Gaming', 'Streamer']
  },
  {
    id: 12,
    name: 'MSI GeForce GTX 1660 Ti ARMOR 6G OC - 6GB GDDR6',
    category: 'GPU',
    price: 4800000,
    images: ['/src/assets/images/gtx1660.png', '/src/assets/images/gtx1660anh2.png', '/src/assets/images/gtx1660anh3.png', '/src/assets/images/gtx1660anh4.png'],
    description: 'GTX 1660 giá tốt cho gaming eSports.',
    specs: {
      'VRAM': '6GB',
      'Kiến trúc': 'Turing'
    },
    suitable: ['eSports']
  },

  // --- SSD ---
  {
    id: 13,
    name: 'Transcend 512GB SATA III 2.5" SSD (Model: TS512GSSD370)',
    category: 'SSD',
    price: 1400000,
    images: ['/src/assets/images/trans512.png', '/src/assets/images/trans512anh2.png', '/src/assets/images/trans512anh3.png', '/src/assets/images/trans512anh4.png'],
    description: 'SSD Transcend tốc độ cao, bền bỉ.',
    specs: {
      'Dung lượng': '512GB',
      'Chuẩn': 'SATA'
    },
    suitable: ['Văn phòng']
  },
  {
    id: 14,
    name: 'Kingston NV1 1TB NVMe M.2 SSD',
    category: 'SSD',
    price: 2200000,
    images: ['/src/assets/images/kingston1tb.png', '/src/assets/images/kingston1tbanh2.png', '/src/assets/images/kingston1tbanh3.png', '/src/assets/images/kingston1tbanh4.png'],
    description: 'SSD Kingston 1TB lưu trữ lớn.',
    specs: {
      'Dung lượng': '1TB',
      'Chuẩn': 'NVMe'
    },
    suitable: ['Gaming']
  },

  // --- HDD ---
  {
    id: 15,
    name: 'HDD WD 1TB',
    category: 'HDD',
    price: 900000,
    images: ['/src/assets/images/wd1tb.png', '/src/assets/images/wd1tbanh2.png', '/src/assets/images/wd1tbanh3.png', '/src/assets/images/wd1tbanh4.png'],
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
    images: ['/src/assets/images/seagate2tb.png', '/src/assets/images/seagate2tbanh2.png', '/src/assets/images/seagate2tbanh3.png', '/src/assets/images/seagate2tbanh4.png'],
    description: 'HDD Seagate dung lượng lớn.',
    specs: {
      'Dung lượng': '2TB',
      'Vòng quay': '7200RPM'
    },
    suitable: ['Lưu trữ']
  },

  // --- SSD Cao cấp ---
  {
    id: 17,
    name: 'Samsung 980 500GB NVMe M.2 SSD (PCIE 3.0)',
    category: 'SSD',
    price: 1800000,
    images: ['/src/assets/images/samsung980.png', '/src/assets/images/samsung980anh2.png', '/src/assets/images/samsung980anh3.png', '/src/assets/images/samsung980anh4.png'],
    description: 'SSD Samsung 980 tốc độ cao.',
    specs: {
      'Dung lượng': '500GB',
      'Chuẩn': 'NVMe'
    },
    suitable: ['Gaming']
  },
  {
    id: 18,
    name: 'Samsung 970 EVO Plus 1TB NVMe M.2 SSD',
    category: 'SSD',
    price: 2900000,
    images: ['/src/assets/images/samsung970.png', '/src/assets/images/samsung970anh2.png', '/src/assets/images/samsung970anh3.png', '/src/assets/images/samsung970anh4.png'],
    description: 'SSD cao cấp cho công việc nặng.',
    specs: {
      'Dung lượng': '1TB',
      'Chuẩn': 'NVMe'
    },
    suitable: ['Designer']
  },
  {
    id: 19,
    name: 'Ổ cứngHDD Toshiba 1TB',
    category: 'HDD',
    price: 850000,
    images: ['/src/assets/images/toshiba1tb.png', '/src/assets/images/toshiba1tbanh2.png', '/src/assets/images/toshiba1tbanh3.png', '/src/assets/images/toshiba1tbanh4.png'],
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
    images: ['/src/assets/images/seagate4tb.png', '/src/assets/images/seagate4tbanh2.png', '/src/assets/images/seagate4tbanh3.png', '/src/assets/images/seagate4tbanh4.png'],
    description: 'HDD dung lượng lớn cho server cá nhân.',
    specs: {
      'Dung lượng': '4TB',
      'Vòng quay': '7200RPM'
    },
    suitable: ['Server', 'Lưu trữ']
  }
]

const product = computed(() => products.find(p => p.id === id) || products[0])

watch(() => route.params.id, () => {
    selectedStorage.value = '256GB'
    selectedColor.value = 'Titan Sa Mạc'
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

const paymentOffers = [
    {
        id: 'scb',
        logo: '/src/assets/images/scb.png', // Nhớ sửa đường dẫn ảnh ở đây cho khớp
        detail: 'Giảm ngay 800.000đ cho đơn từ 8 triệu khi thanh toán qua thẻ Visa SCB. (HSD: 30/06/2026)'
    },
    {
        id: 'ocb',
        logo: '/src/assets/images/ocb.png',
        detail: 'Giảm ngay 500.000đ cho đơn hàng từ 10 triệu khi thanh toán bằng thẻ OCB. (HSD: 28/02/2026)'
    },
    {
        id: 'kredivo',
        logo: '/src/assets/images/kredivo.png',
        detail: 'Giảm ngay 50% tối đa 100.000đ cho Khách hàng mới hoặc Giảm 5% tối đa 200.000đ đơn từ 700k qua Kredivo.'
    },
    {
        id: 'homepay',
        logo: '/src/assets/images/homepay.png',
        detail: 'Giảm ngay 5% tối đa 50.000đ cho Khách hàng thân thiết khi thanh toán qua HomePayLater.'
    }
]

// Trạng thái hover hiện tại (Mặc định là cái đầu tiên)
const activeOffer = ref({
    id: 'scb',
    detail: 'Giảm ngay 800.000đ cho đơn từ 8 triệu khi thanh toán qua thẻ Visa SCB. (HSD: 30/06/2026)'
}) 

// Hàm xử lý hover thủ công
const manualSetActive = (id, text) => {
    activeOffer.value = {
        id: id,
        detail: text
    }
}

// Hàm cuộn trang
const scrollToSpecs = () => {
    const element = document.getElementById('specs-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Danh sách bình luận mẫu
const localComments = ref([
    { user: 'Vinh', rating: 5, content: 'Sản phẩm rất tốt, đóng gói kỹ càng.', date: 'Đã dùng khoảng 1 tuần' },
    { user: 'Anh Sơn', rating: 5, content: 'Giao hàng nhanh, chạy được và ổn định.', date: 'Đã dùng khoảng 3 ngày' }
]);

// Dữ liệu cho bình luận mới
const newReview = ref({
    user: '',
    rating: 5,
    content: ''
});

// Hàm gửi đánh giá
const submitReview = () => {
    if (!newReview.value.user || !newReview.value.content) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    
    // Thêm vào danh sách hiện tại
    localComments.value.unshift({
        user: newReview.value.user,
        rating: newReview.value.rating,
        content: newReview.value.content,
        date: 'Vừa xong'
    });

    // Reset form
    newReview.value = { user: '', rating: 5, content: '' };
    
    // Đóng modal (sử dụng thuộc tính của Bootstrap)
    const modalElement = document.getElementById('reviewModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
};

// Biến hỗ trợ hiệu ứng hover khi chọn sao
const hoverRating = ref(0);

// Hàm trả về text mô tả mức độ hài lòng
const getRatingText = (rating) => {
    const texts = {
        1: 'Rất tệ',
        2: 'Tệ',
        3: 'Bình thường',
        4: 'Hài lòng',
        5: 'Rất hài lòng'
    };
    return texts[rating] || 'Vui lòng chọn mức độ hài lòng';
};
    
</script>

<style scoped>
/* Breadcrumb & General */
.breadcrumb-item a { text-decoration: none; color: #2f80ed; }
.x-small { font-size: 11px; }
.cursor-pointer { cursor: pointer; }

/* Buttons Customization */
.btn-danger { background: #d0021c; border: none; }
.btn-primary { background-color: #2f80ed; border: none; }
.btn-warning { background-color: #ff9f00; border: none; }

/* Active Variant Button (Nút dung lượng) */
.active-variant {
    border-color: #2f80ed !important;
    color: #2f80ed !important;
    background-color: #f6faff !important;
}

/* Color Selection Buttons */
.color-btn {
    transition: transform 0.2s;
}
.color-btn:hover {
    transform: scale(1.1);
}

/* Carousel */
.main-product-img { max-height: 380px; object-fit: contain; }
.custom-control {
    width: 40px; height: 60px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px; top: 50%; transform: translateY(-50%);
    margin: 0 10px;
}
.custom-control:hover { background: rgba(0, 0, 0, 0.3); }

/* Thumbnails */
.thumb-btn {
    width: 55px; height: 55px; cursor: pointer;
    background: white; opacity: 0.6; transition: all 0.2s;
    border: 1px solid #ddd;
}
.thumb-btn.active {
    opacity: 1; border: 1px solid #2f80ed !important;
}
.custom-indicators::-webkit-scrollbar { height: 4px; }
.custom-indicators::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }

/* Table Specs */
.table-specs tr:nth-child(odd) { background-color: #f5f5f5; }
.table-specs td { vertical-align: middle; }

.payment-logo-box {
    width: 70px;
    height: 45px;
    flex: 0 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;

    transition: all 0.2s ease;
    padding: 4px;
}

/* Logo bên trong */
.payment-logo-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

/* Hover + Active */
.payment-logo-box:hover,
.payment-logo-box.active {
    border-color: #2f80ed !important;
    background-color: #f2f7ff;
    transform: translateY(-1px);
}

/* Nút Xem tất cả */
.btn-link {
    font-size: 13px;
    color: #2f80ed;
}
.btn-link:hover {
    text-decoration: underline !important;
}

/* Offcanvas custom scrollbar */
.offcanvas-body::-webkit-scrollbar {
    width: 6px;
}
.offcanvas-body::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

/* Hiệu ứng hover cho link */
.link-specs:hover span { text-decoration: underline; }

/* Tạo khoảng cách phía trên khi cuộn tới (để không bị header che mất nếu có sticky header) */
.scroll-mt { scroll-margin-top: 100px; }

/* --- CSS FIX CAROUSEL --- */

/* Reset style mặc định của Bootstrap Indicators */
.custom-indicators-container {
    position: static; /* Đưa xuống dưới card-footer */
    margin: 0;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
}

.thumb-btn {
    width: 60px !important;  /* Độ rộng ảnh nhỏ */
    height: 60px !important; /* Độ cao ảnh nhỏ */
    text-indent: 0 !important; /* Hiện ảnh thay vì dấu gạch ngang */
    border: 1px solid #ddd !important;
    border-radius: 4px;
    overflow: hidden;
    background: #fff !important;
    opacity: 0.6; /* Mờ khi không chọn */
    transition: all 0.3s ease;
    padding: 2px !important;
}

/* Khi ảnh nhỏ được chọn (Active) */
.thumb-btn.active {
    opacity: 1 !important;
    border: 2px solid #2f80ed !important; /* Viền xanh chuẩn TGDD */
    box-shadow: 0 0 5px rgba(47, 128, 237, 0.5);
}

.thumb-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Nút mũi tên trái phải */
.custom-control {
    width: 40px;
    height: 60px;
    background: rgba(0, 0, 0, 0.1);
    top: 50%;
    transform: translateY(-50%);
    opacity: 0; /* Ẩn đi mặc định */
    transition: opacity 0.3s;
}

#productGalleryCarousel:hover .custom-control {
    opacity: 1; /* Hiện mũi tên khi rê chuột vào carousel */
}

.carousel-control-prev { left: 0; border-radius: 0 4px 4px 0; }
.carousel-control-next { right: 0; border-radius: 4px 0 0 4px; }

/* Styling cho Rating & Modal */
.cursor-pointer { cursor: pointer; }
.modal-content { border-radius: 15px; }
.progress-bar { border-radius: 10px; }
.comment-item p { line-height: 1.6; }
.border-end { border-right: 1px solid #eeeeee !important; }
.text-success { color: #2db73d !important; }
.btn-outline-primary { border-color: #2f80ed; color: #2f80ed; }
.btn-outline-primary:hover { background-color: #2f80ed; color: white; }

@media (max-width: 768px) {
    .border-end { border-right: none !important; border-bottom: 1px solid #eeeeee; padding-bottom: 20px; margin-bottom: 20px; }
}

/* Style cho Rating Stars trong Modal */
.star-icon {
    font-size: 2rem;
    cursor: pointer;
    color: #ccc;
    margin: 0 4px;
    transition: transform 0.1s ease;
}

.star-icon:hover {
    transform: scale(1.2);
}

.star-icon i.active {
    color: #ff9f00; /* Màu vàng cam chuẩn */
}

.rating-stars {
    user-select: none; /* Không cho bôi đen icon */
}

/* Hiệu ứng mờ dần cho modal */
.modal.fade .modal-dialog {
    transition: transform 0.3s ease-out;
}

/* Style cho Rating Stars trong Modal */
.star-icon {
    font-size: 2rem;
    cursor: pointer;
    color: #ccc;
    margin: 0 4px;
    transition: transform 0.1s ease;
}

.star-icon:hover {
    transform: scale(1.2);
}

.star-icon i.active {
    color: #ff9f00; /* Màu vàng cam chuẩn */
}

.rating-stars {
    user-select: none; /* Không cho bôi đen icon */
}

/* Hiệu ứng mờ dần cho modal */
.modal.fade .modal-dialog {
    transition: transform 0.3s ease-out;
}

.main-product-img { max-height: 380px; object-fit: contain; }
.thumb-btn { width: 60px; height: 60px; border: 1px solid #ddd; margin: 0 5px; opacity: 0.6; cursor: pointer; border-radius: 4px; }
.active-thumb { opacity: 1; border: 2px solid #2f80ed !important; }
.custom-indicators-container { display: flex; justify-content: center; padding: 10px 0; }
.payment-logo-box.active { border-color: #2f80ed !important; background: #f2f7ff; }
.scroll-mt { scroll-margin-top: 100px; }
.star-icon:hover { transform: scale(1.2); transition: 0.2s; }
.cursor-pointer { cursor: pointer; }

</style>


<!-- [
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
    name: 'Kingston Fury Beast 8GB DDR4 3200MHz (KF432C16BB/8)',
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
    name: 'Kingston Fury Beast 16GB DDR4 3200MHz (KF432C16BB/16)',
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
    name: 'WD Blue 1TB 7200RPM SATA HDD',
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
    name: 'Seagate Barracuda 2TB 7200RPM SATA HDD',
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
    name: 'Toshiba P300 1TB 7200RPM SATA HDD',
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
    name: 'Seagate Barracuda 4TB 7200RPM SATA HDD',
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
] -->
