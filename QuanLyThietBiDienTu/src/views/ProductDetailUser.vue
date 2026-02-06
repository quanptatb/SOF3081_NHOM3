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
                                <div v-for="(img, index) in product.images" :key="index" class="carousel-item h-100"
                                    :class="{ active: index === currentImageIndex }">
                                    <div class="d-flex align-items-center justify-content-center p-3"
                                        style="height: 400px;">
                                        <img :src="img" class="d-block img-fluid main-product-img" :alt="product.name">
                                    </div>
                                </div>
                            </div>
                            <button @click="prevSlide" class="carousel-control-prev custom-control" type="button"><span
                                    class="carousel-control-prev-icon"></span></button>
                            <button @click="nextSlide" class="carousel-control-next custom-control" type="button"><span
                                    class="carousel-control-next-icon"></span></button>
                        </div>
                        <div class="card-footer bg-white border-top">
                            <div class="custom-indicators-container">
                                <button v-for="(img, index) in product.images" :key="index" type="button"
                                    class="thumb-btn" :class="{ 'active-thumb': index === currentImageIndex }"
                                    @click="currentImageIndex = index">
                                    <img :src="img" class="img-fluid object-fit-contain">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border rounded p-3 mb-4 bg-white">
                    <h6 class="fw-bold mb-3 text-primary">Shop NoName Cam Kết</h6>
                    <div class="row g-3 text-dark small">
                        <div class="col-md-6 d-flex gap-2"><i class="bi bi-cpu"></i> Hiệu năng mạnh mẽ, xử lý mượt mà.
                        </div>
                        <div class="col-md-6 d-flex gap-2"><i class="bi bi-shield-check"></i> Bảo hành chính hãng 36
                            tháng.</div>
                        <div class="col-md-6 d-flex gap-2"><i class="bi bi-box-seam"></i> Tương thích nhiều dòng
                            mainboard.</div>
                        <div class="col-md-6 d-flex gap-2"><i class="bi bi-lightning-fill"></i> Đa nhiệm mượt, render
                            nhanh.</div>
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
                    <span class="text-decoration-line-through text-muted small">{{ formatPrice(product.price * 1.1)
                        }}</span>
                    <span class="badge bg-danger ms-2">-10%</span>
                    <div class="mt-1"><a href="#specs-section" @click.prevent="scrollToSpecs"
                            class="text-primary small text-decoration-none">Xem thông số kỹ thuật</a></div>
                </div>

                <div class="card mb-3 border border-secondary border-opacity-25 rounded overflow-hidden">
                    <div class="card-header bg-light border-bottom py-2"><strong class="small text-dark"><i
                                class="bi bi-gift-fill text-danger"></i> Khuyến mãi</strong></div>
                    <div class="card-body p-2 bg-white">
                        <ul class="list-unstyled mb-0 small">
                            <li v-for="(promo, i) in promotions" :key="i" class="mb-2 d-flex align-items-start">
                                <span
                                    class="badge bg-primary rounded-circle me-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style="width: 16px; height: 16px; font-size: 10px;">{{ i + 1 }}</span>
                                <span class="text-dark">{{ promo }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center py-2">
                        <strong class="small text-dark">Ưu đãi thanh toán</strong>
                        <button class="btn btn-link text-decoration-none p-0 small" data-bs-toggle="offcanvas"
                            data-bs-target="#paymentOffcanvas">Xem tất cả</button>
                    </div>
                    <div class="card-body p-3">
                        <div class="d-flex gap-2 mb-3 overflow-auto">
                            <div v-for="offer in paymentOffers" :key="offer.id"
                                class="payment-logo-box border rounded p-1 cursor-pointer"
                                :class="{ 'active': activeOffer.id === offer.id }"
                                @mouseover="manualSetActive(offer.id, offer.detail)">
                                <img :src="offer.logo">
                            </div>
                        </div>
                        <div class="alert alert-light border p-2 small mb-0 text-dark">{{ activeOffer.detail }}</div>
                    </div>
                </div>

                <div class="d-flex align-items-center mb-3">
                    <strong class="text-dark small me-3">Số lượng:</strong>
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary" type="button" @click="decreaseQuantity">
                            <i class="bi bi-dash"></i>
                        </button>
                        <input type="text" class="form-control text-center text-dark fw-bold bg-white" 
                               v-model="quantity" readonly>
                        <button class="btn btn-outline-secondary" type="button" @click="increaseQuantity">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>

                <div class="row g-2 mb-3">
                    <div class="col-12 text-center">
                        <button @click="addToCart"
                            class="btn btn-outline-primary w-100 py-2 fw-bold text-uppercase shadow-sm h-100 d-flex flex-column align-items-center justify-content-center">
                            <i class="bi bi-cart-plus fs-5 mb-1"></i>
                            <span style="font-size: 11px;">Thêm giỏ hàng</span>
                        </button>
                    </div>
                </div>

            

            <div class="card border-0 shadow-sm mb-4 bg-white p-4 mt-4">
                <h5 class="fw-bold mb-4 text-dark">Đánh giá & Nhận xét {{ product.name }}</h5>
                <div class="row align-items-center mb-5 border-bottom pb-4">
                    <div class="col-md-4 text-center border-end">
                        <h1 class="text-warning fw-bold mb-0">4.9<span class="fs-4 text-muted">/5</span></h1>
                        <div class="text-warning fs-5"><i class="bi bi-star-fill" v-for="i in 5" :key="i"></i></div>
                        <p class="text-muted small mt-2">722 khách hàng hài lòng</p>
                    </div>
                    <div class="col-md-8 px-lg-5">
                        <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="d-flex align-items-center mb-2">
                            <div class="small me-2 text-dark" style="width: 10px;">{{ star }}</div>
                            <i class="bi bi-star-fill text-warning small me-2"></i>
                            <div class="progress flex-grow-1" style="height: 6px;">
                                <div class="progress-bar bg-primary"
                                    :style="{ width: star === 5 ? '99.5%' : (star === 4 ? '0.2%' : '0%') }"></div>
                            </div>
                            <div class="small text-muted ms-3" style="width: 40px;">{{ star === 5 ? '99.5%' : (star ===
                                4 ? '0.2%' : '0%') }}</div>
                        </div>
                    </div>
                </div>
            </div>
                <div class="comment-list">
                    <div v-for="(comment, index) in localComments" :key="index"
                        class="comment-item border-bottom pb-3 mb-4">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <strong class="text-dark">{{ comment.user }}</strong>
                            <span class="text-success small"><i class="bi bi-check-circle-fill"></i> Đã mua tại
                                NoName</span>
                        </div>
                        <div class="text-warning small mb-2"><i v-for="s in comment.rating" :key="s"
                                class="bi bi-star-fill"></i></div>
                        <p class="small text-dark mb-1">{{ comment.content }}</p>
                        <div class="small text-muted" style="font-size: 11px;">{{ comment.date }}</div>
                    </div>
                </div>
                <button class="btn btn-primary w-100 py-2 fw-bold mt-3" data-bs-toggle="modal"
                    data-bs-target="#reviewModal">VIẾT ĐÁNH GIÁ</button>
            </div>

            <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true text-dark">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg">
                        <div class="modal-header border-0 pb-0">
                            <h5 class="fw-bold text-dark">Gửi đánh giá sản phẩm</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center text-dark">
                            <p class="text-muted small mb-2">{{ product.name }}</p>
                            <div class="rating-stars mb-3 fs-2">
                                <span v-for="star in 5" :key="star" @click="newReview.rating = star"
                                    @mouseover="hoverRating = star" @mouseleave="hoverRating = 0"
                                    class="star-icon cursor-pointer">
                                    <i
                                        :class="(hoverRating || newReview.rating) >= star ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"></i>
                                </span>
                                <p class="mt-2 small fw-bold text-primary">{{ getRatingText(hoverRating ||
                                    newReview.rating) }}</p>
                            </div>
                            <textarea v-model="newReview.content" class="form-control mb-3" rows="4"
                                placeholder="Mời bạn chia sẻ thêm cảm nhận..."></textarea>
                            <input v-model="newReview.user" type="text" class="form-control mb-3"
                                placeholder="Họ và tên (Bắt buộc)">
                            <button @click="submitReview" class="btn btn-primary w-100 py-2 fw-bold shadow">GỬI ĐÁNH GIÁ
                                NGAY</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="offcanvas offcanvas-end text-dark" tabindex="-1" id="paymentOffcanvas" style="width: 400px;">
                <div class="offcanvas-header border-bottom">
                    <h5 class="fw-bold m-0">Ưu đãi thanh toán</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
                </div>
                <div class="offcanvas-body p-3 bg-light">
                    <div v-for="offer in paymentOffers" :key="offer.id"
                        class="card border-0 shadow-sm mb-3 p-3 rounded-3">
                        <div class="d-flex align-items-center gap-3">
                            <img :src="offer.logo" style="width: 60px; height: 40px; object-fit: contain;">
                            <p class="small m-0">{{ offer.detail }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import axios from 'axios'

// API Configuration
const CART_API_URL = 'http://localhost:3000/carts'

const route = useRoute()
const id = Number(route.params.id)

// --- CAROUSEL LOGIC ---
const currentImageIndex = ref(0)
const nextSlide = () => {
    if (currentImageIndex.value < product.value.images.length - 1) currentImageIndex.value++
    else currentImageIndex.value = 0
}
const prevSlide = () => {
    if (currentImageIndex.value > 0) currentImageIndex.value--
    else currentImageIndex.value = product.value.images.length - 1
}

// --- REVIEW LOGIC ---
const localComments = ref([
    { user: 'Vinh', rating: 5, content: 'Sản phẩm rất tốt, đóng gói kỹ càng.', date: 'Đã dùng khoảng 1 tuần' },
    { user: 'Anh Sơn', rating: 5, content: 'Giao hàng nhanh, CPU chạy mát và ổn định.', date: 'Đã dùng khoảng 3 ngày' }
])
const newReview = ref({ user: '', rating: 5, content: '' })
const hoverRating = ref(0)
const getRatingText = (rating) => {
    const texts = { 1: 'Rất tệ', 2: 'Tệ', 3: 'Bình thường', 4: 'Hài lòng', 5: 'Rất hài lòng' }
    return texts[rating] || 'Chọn mức độ hài lòng'
}
const submitReview = () => {
    if (!newReview.value.user || !newReview.value.content) return alert("Vui lòng nhập đủ thông tin!")
    localComments.value.unshift({ ...newReview.value, date: 'Vừa xong' })
    newReview.value = { user: '', rating: 5, content: '' }
    const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'))
    modal.hide()
}

// --- PRODUCT DATA & PRICE ---
const products = [
    {
      "id": 1,
      "name": "CPU Intel i5 12400F (LGA 1700/6 Core-12 Thread)",
      "category": "CPU",
      "price": 4500000,
      "images": [
        "/src/assets/images/inteli5.png",
        "/src/assets/images/inteli5anh2.png",
        "/src/assets/images/inteli5anh3.png",
        "/src/assets/images/inteli5anh4.png",
        "/src/assets/images/inteli5anh5.png",
        "/src/assets/images/inteli5anh6.png"
      ],
      "specs": { "Nhân/Luồng": "6/12", "Xung nhịp": "2.5GHz - 4.4GHz", "Socket": "LGA 1700" }
    },
    {
      "id": 2,
      "name": "CPU Intel i7 13700K Gaming Pro",
      "category": "CPU",
      "price": 6500000,
      "images": [
        "/src/assets/images/inteli7.png",
        "/src/assets/images/inteli7anh2.png",
        "/src/assets/images/inteli7anh3.png",
        "/src/assets/images/inteli7anh4.png",
        "/src/assets/images/inteli7anh5.png",
        "/src/assets/images/inteli7anh6.png"
      ],
      "specs": { "Nhân/Luồng": "16/24", "Turbo": "5.4GHz", "Socket": "LGA 1700" }
    },
    {
      "id": 3,
      "name": "CPU Ryzen 5 5600X",
      "category": "CPU",
      "price": 4200000,
      "images": [
        "/src/assets/images/ryzen5.png",
        "/src/assets/images/ryzen5anh2.png",
        "/src/assets/images/ryzen5anh3.png",
        "/src/assets/images/ryzen5anh4.png"
      ],
      "specs": { "Nhân/Luồng": "6/12", "Xung nhịp": "3.7GHz - 4.6GHz", "Socket": "AM4" }
    },
    {
      "id": 4,
      "name": "Bộ vi xử lý AMD Ryzen 7 8700G",
      "category": "CPU",
      "price": 7200000,
      "images": [
        "/src/assets/images/ryzen7.png",
        "/src/assets/images/ryzen7anh2.png",
        "/src/assets/images/ryzen7anh3.png",
        "/src/assets/images/ryzen7anh4.png"
      ],
      "specs": { "Nhân/Luồng": "8/16", "Xung nhịp": "4.2GHz - 5.1GHz", "Socket": "AM5" }
    },
    {
      "id": 5,
      "name": "Ram Corsair Vengeance LPX 8GB (1x8GB) 3200",
      "category": "RAM",
      "price": 800000,
      "images": [
        "/src/assets/images/corsair8.png",
        "/src/assets/images/corsair8anh2.png",
        "/src/assets/images/corsair8anh3.png",
        "/src/assets/images/corsair8anh4.png"
      ],
      "specs": { "Dung lượng": "8GB", "Bus": "3200MHz", "Loại": "DDR4" }
    },
    {
      "id": 6,
      "name": "RAM Laptop Kingston 8GB 3200MHz",
      "category": "RAM",
      "price": 1200000,
      "images": [
        "/src/assets/images/corsair16.png",
        "/src/assets/images/corsair16anh2.png",
        "/src/assets/images/corsair16anh3.png",
        "/src/assets/images/corsair16anh4.png"
      ],
      "specs": { "Dung lượng": "8GB", "Bus": "3200MHz", "Loại": "DDR4 Laptop" }
    },
    {
      "id": 7,
      "name": "RAM Kingston 8GB",
      "category": "RAM",
      "price": 750000,
      "images": [
        "/src/assets/images/kingston8.png",
        "/src/assets/images/kingston8anh2.png",
        "/src/assets/images/kingston8anh3.png",
        "/src/assets/images/kingston8anh4.png"
      ],
      "specs": { "Dung lượng": "8GB", "Bus": "2666MHz", "Loại": "DDR4" }
    },
    {
      "id": 8,
      "name": "RAM Kingston 16GB",
      "category": "RAM",
      "price": 1300000,
      "images": [
        "/src/assets/images/kingston16.png",
        "/src/assets/images/kingston16anh2.png",
        "/src/assets/images/kingston16anh3.png",
        "/src/assets/images/kingston16anh4.png"
      ],
      "specs": { "Dung lượng": "16GB", "Bus": "3200MHz", "Loại": "DDR4" }
    },
    {
      "id": 9,
      "name": "MSI RTX 3050 VENTUS 2X 6G OC",
      "category": "GPU",
      "price": 6200000,
      "images": [
        "/src/assets/images/rtx3050.png",
        "/src/assets/images/rtx3050anh2.png",
        "/src/assets/images/rtx3050anh3.png",
        "/src/assets/images/rtx3050anh4.png"
      ],
      "specs": { "VRAM": "6GB GDDR6", "Bus": "96-bit", "Nguồn phụ": "Không" }
    },
    {
      "id": 10,
      "name": "MSI RTX 3060 VENTUS 2X OC 12 GB",
      "category": "GPU",
      "price": 7800000,
      "images": [
        "/src/assets/images/rtx3060.png",
        "/src/assets/images/rtx3060anh2.png",
        "/src/assets/images/rtx3060anh3.png",
        "/src/assets/images/rtx3060anh4.png"
      ],
      "specs": { "VRAM": "12GB GDDR6", "Bus": "192-bit", "Nguồn phụ": "1x8-pin" }
    },
    {
      "id": 11,
      "name": "ASUS Dual GeForce RTX 4060 V2 OC Edition 8GB",
      "category": "GPU",
      "price": 9500000,
      "images": [
        "/src/assets/images/rtx4060.png",
        "/src/assets/images/rtx4060anh2.png",
        "/src/assets/images/rtx4060anh3.png",
        "/src/assets/images/rtx4060anh4.png"
      ],
      "specs": { "VRAM": "8GB GDDR6", "Bus": "128-bit", "Kiến trúc": "Ada Lovelace" }
    },
    {
      "id": 12,
      "name": "MSI GeForce GTX 1660 Ti ARMOR 6G OC",
      "category": "GPU",
      "price": 4800000,
      "images": [
        "/src/assets/images/gtx1660.png",
        "/src/assets/images/gtx1660anh2.png",
        "/src/assets/images/gtx1660anh3.png",
        "/src/assets/images/gtx1660anh4.png"
      ],
      "specs": { "VRAM": "6GB GDDR6", "Bus": "192-bit", "Cổng": "HDMI, DP" }
    },
    {
      "id": 13,
      "name": "SSD Transcend 512GB",
      "category": "SSD",
      "price": 1400000,
      "images": [
        "/src/assets/images/trans512.png",
        "/src/assets/images/trans512anh2.png",
        "/src/assets/images/trans512anh3.png",
        "/src/assets/images/trans512anh4.png"
      ],
      "specs": { "Dung lượng": "512GB", "Chuẩn": "SATA III", "Tốc độ đọc": "560MB/s" }
    },
    {
      "id": 14,
      "name": "SSD Kingston 1TB",
      "category": "SSD",
      "price": 2200000,
      "images": [
        "/src/assets/images/kingston1tb.png",
        "/src/assets/images/kingston1tbanh2.png",
        "/src/assets/images/kingston1tbanh3.png",
        "/src/assets/images/kingston1tbanh4.png"
      ],
      "specs": { "Dung lượng": "1TB", "Chuẩn": "NVMe PCIe", "Tốc độ đọc": "3500MB/s" }
    },
    {
      "id": 15,
      "name": "HDD WD 1TB",
      "category": "HDD",
      "price": 900000,
      "images": [
        "/src/assets/images/wd1tb.png",
        "/src/assets/images/wd1tbanh2.png",
        "/src/assets/images/wd1tbanh3.png",
        "/src/assets/images/wd1tbanh4.png"
      ],
      "specs": { "Dung lượng": "1TB", "Vòng quay": "7200RPM", "Bộ đệm": "64MB" }
    },
    {
      "id": 16,
      "name": "HDD Seagate 2TB",
      "category": "HDD",
      "price": 1600000,
      "images": [
        "/src/assets/images/seagate2tb.png",
        "/src/assets/images/seagate2tbanh2.png",
        "/src/assets/images/seagate2tbanh3.png",
        "/src/assets/images/seagate2tbanh4.png"
      ],
      "specs": { "Dung lượng": "2TB", "Vòng quay": "7200RPM", "Bộ đệm": "256MB" }
    },
    {
      "id": 17,
      "name": "SSD Samsung 980 500GB",
      "category": "SSD",
      "price": 1800000,
      "images": [
        "/src/assets/images/samsung980.png",
        "/src/assets/images/samsung980anh2.png",
        "/src/assets/images/samsung980anh3.png",
        "/src/assets/images/samsung980anh4.png"
      ],
      "specs": { "Dung lượng": "500GB", "Chuẩn": "NVMe PCIe 3.0", "Tốc độ đọc": "3100MB/s" }
    },
    {
      "id": 18,
      "name": "SSD Samsung 970 EVO 1TB",
      "category": "SSD",
      "price": 2900000,
      "images": [
        "/src/assets/images/samsung970.png",
        "/src/assets/images/samsung970anh2.png",
        "/src/assets/images/samsung970anh3.png",
        "/src/assets/images/samsung970anh4.png"
      ],
      "specs": { "Dung lượng": "1TB", "Chuẩn": "NVMe PCIe 3.0", "Tốc độ đọc": "3500MB/s" }
    },
    {
      "id": 19,
      "name": "HDD Toshiba 1TB",
      "category": "HDD",
      "price": 850000,
      "images": [
        "/src/assets/images/toshiba1tb.png",
        "/src/assets/images/toshiba1tbanh2.png",
        "/src/assets/images/toshiba1tbanh3.png",
        "/src/assets/images/toshiba1tbanh4.png"
      ],
      "specs": { "Dung lượng": "1TB", "Vòng quay": "5400RPM", "Kích thước": "2.5 inch" }
    },
    {
      "id": 20,
      "name": "HDD Seagate 4TB",
      "category": "HDD",
      "price": 2900000,
      "images": [
        "/src/assets/images/seagate4tb.png",
        "/src/assets/images/seagate4tbanh2.png",
        "/src/assets/images/seagate4tbanh3.png",
        "/src/assets/images/seagate4tbanh4.png"
      ],
      "specs": { "Dung lượng": "4TB", "Vòng quay": "5900RPM", "Bộ đệm": "64MB" }
    }
]
const product = computed(() => products.find(p => p.id === id) || products[0])
const formatPrice = (price) => price.toLocaleString('vi-VN') + ' đ'
const scrollToSpecs = () => document.getElementById('specs-section').scrollIntoView({ behavior: 'smooth' })

// --- PAYMENT OFFERS ---
const paymentOffers = [
    { id: 'scb', logo: '/src/assets/images/scb.png', detail: 'Giảm ngay 800.000đ cho đơn từ 8 triệu khi thanh toán qua thẻ Visa SCB. (HSD: 30/06/2026)' },
  { id: 'ocb', logo: '/src/assets/images/ocb.png', detail: 'Giảm ngay 500.000đ cho đơn hàng từ 10 triệu khi thanh toán bằng thẻ OCB. (HSD: 28/02/2026)' },
  { id: 'kredivo', logo: '/src/assets/images/kredivo.png', detail: 'Giảm ngay 50% tối đa 100.000đ cho Khách hàng mới hoặc Giảm 5% tối đa 200.000đ đơn từ 700k qua Kredivo.' },
  { id: 'homepay', logo: '/src/assets/images/homepay.png', detail: 'Giảm ngay 5% tối đa 50.000đ cho Khách hàng thân thiết khi thanh toán qua HomePayLater.' }
]
const activeOffer = ref(paymentOffers[0])
const manualSetActive = (id, detail) => { activeOffer.value = { id, detail } }

const promotions = ['Tặng keo tản nhiệt khi mua CPU', 'Giảm 670 k khi mua kèm Mainboard', 'Giảm 360k khi build trọn bộ PC']

watch(() => route.params.id, () => { currentImageIndex.value = 0 })


const quantity = ref(1)
// --- THÊM 2 HÀM NÀY ---
const increaseQuantity = () => {
    quantity.value++
}

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--
    }
}
const isLoadingBuyNow = ref(false)

const addToCart = async () => {
    try {
        // 1. Get current user from localStorage (session)
        const currentUserStr = localStorage.getItem('currentUser')
        if (!currentUserStr) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!')
            return
        }

        const currentUser = JSON.parse(currentUserStr)
        const userId = currentUser.id

        // 2. Fetch current cart from API
        const response = await axios.get(`${CART_API_URL}?userId=${userId}`)

        let cart
        let cartId

        if (response.data && response.data.length > 0) {
            cart = response.data[0]
            cartId = cart.id
        } else {
            // No cart exists, will create new
            cart = { userId: userId, items: [] }
            cartId = null
        }

        // 3. Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item => item.productId === product.value.id)

        if (existingItemIndex !== -1) {
            // Product exists, increase quantity
            cart.items[existingItemIndex].quantity += quantity.value
        } else {
            // New product, add to cart
            cart.items.push({
                productId: product.value.id,
                name: product.value.name,
                price: product.value.price,
                image: product.value.images[0],
                quantity: quantity.value
            })
        }

        // 4. Save cart to API
        if (cartId) {
            // Update existing cart
            await axios.put(`${CART_API_URL}/${cartId}`, cart)
        } else {
            // Create new cart
            await axios.post(CART_API_URL, cart)
        }

        // 5. Dispatch event to update navbar
        window.dispatchEvent(new CustomEvent('cart-updated'))

        // 6. Notify user
        alert(`Đã thêm sản phẩm vào giỏ hàng!`)
    } catch (error) {
        console.error('Error adding to cart:', error)
        alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại!')
    }
}

const buyNow = async () => {
    try {
        isLoadingBuyNow.value = true

        // 1. Get current user from localStorage (session)
        const currentUserStr = localStorage.getItem('currentUser')
        if (!currentUserStr) {
            alert('Vui lòng đăng nhập để mua hàng!')
            // Redirect to login page
            window.location.href = '/login'
            return
        }

        const currentUser = JSON.parse(currentUserStr)
        const userId = currentUser.id

        // 2. Fetch current cart from API
        const response = await axios.get(`${CART_API_URL}?userId=${userId}`)

        let cart
        let cartId

        if (response.data && response.data.length > 0) {
            cart = response.data[0]
            cartId = cart.id
        } else {
            // No cart exists, will create new
            cart = { userId: userId, items: [] }
            cartId = null
        }

        // 3. Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item => item.productId === product.value.id)

        if (existingItemIndex !== -1) {
            // Product exists, increase quantity
            cart.items[existingItemIndex].quantity += 1
        } else {
            // New product, add to cart with quantity 1
            cart.items.push({
                productId: product.value.id,
                name: product.value.name,
                price: product.value.price,
                image: product.value.images[0],
                quantity: 1
            })
        }

        // 4. Save cart to API
        if (cartId) {
            // Update existing cart
            await axios.put(`${CART_API_URL}/${cartId}`, cart)
        } else {
            // Create new cart
            await axios.post(CART_API_URL, cart)
        }

        // 5. Dispatch event to update navbar
        window.dispatchEvent(new CustomEvent('cart-updated'))

        // 6. Navigate to checkout page
        window.location.href = '/checkout'
    } catch (error) {
        console.error('Error in buy now:', error)
        alert('Không thể thực hiện mua hàng. Vui lòng thử lại!')
        isLoadingBuyNow.value = false
    }
}
</script>

<style scoped>
.main-product-img {
    max-height: 380px;
    object-fit: contain;
}

.thumb-btn {
    width: 60px;
    height: 60px;
    border: 1px solid #ddd;
    padding: 2px;
    opacity: 0.6;
    cursor: pointer;
    border-radius: 4px;
    background: #fff;
    margin: 0 5px;
}

.active-thumb {
    opacity: 1;
    border: 2px solid #2f80ed !important;
}

.custom-indicators-container {
    display: flex;
    justify-content: center;
    padding: 10px 0;
}

.payment-logo-box {
    width: 70px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
}

.payment-logo-box.active {
    border-color: #2f80ed !important;
    background-color: #f2f7ff;
}

.payment-logo-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.scroll-mt {
    scroll-margin-top: 100px;
}

.progress-bar {
    border-radius: 10px;
}

.comment-item p {
    line-height: 1.6;
}

.border-end {
    border-right: 1px solid #eeeeee !important;
}

/* Tùy chỉnh nút thêm giỏ hàng */
.btn-outline-primary {
    color: #2f80ed;
    border-color: #2f80ed;
    background-color: #fff;
    transition: all 0.3s ease;
}

.btn-outline-primary:hover {
    background-color: #f2f7ff;
    color: #2871d1;
    border-color: #2871d1;
}

/* Hiệu ứng focus cho input số lượng */
.input-group .form-control:focus {
    box-shadow: none;
    border-color: #dee2e6;
}

.btn-danger {
    background-color: #d0021c;
    border: none;
}

.btn-danger:hover {
    background-color: #b00218;
}
</style>