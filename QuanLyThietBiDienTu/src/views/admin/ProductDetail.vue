<template>
  <div class="container mt-4">

    <nav class="mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/admin/products" class="text-decoration-none">Quản lý sản phẩm</router-link>
        </li>
        <li class="breadcrumb-item active">Chi tiết</li>
      </ol>
    </nav>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-orange" role="status"></div>
      <p class="mt-2 text-muted">Đang tải thông tin...</p>
    </div>

    <div v-else-if="product" class="card shadow border-0">
      <div class="row g-0">
        <div class="col-md-5 p-4 text-center bg-light d-flex align-items-center justify-content-center">
          <img
            :src="getImageUrl(product.image)"
            class="img-fluid rounded product-img"
            @error="$event.target.src = 'https://via.placeholder.com/400x400?text=No+Image'"
          />
        </div>

        <div class="col-md-7">
          <div class="card-body p-4">
            <span class="badge bg-secondary mb-2">{{ product.category }}</span>
            <h3 class="text-orange fw-bold">{{ product.name }}</h3>
            <h4 class="price mt-2">{{ Number(product.price).toLocaleString() }} ₫</h4>
            <hr />
            
            <p class="text-muted" v-if="product.description">
              {{ product.description }}
            </p>
            <p class="text-muted fst-italic" v-else>
              Chưa có mô tả cho sản phẩm này.
            </p>

            <div class="row mt-4 bg-light p-3 rounded">
              <div class="col-6 border-end">
                <small class="text-muted d-block">Mã sản phẩm</small>
                <span class="fw-bold fs-5">#{{ product.id }}</span>
              </div>
              <div class="col-6">
                <small class="text-muted d-block">Tên file ảnh</small>
                <span class="text-break">{{ product.image }}</span>
              </div>
            </div>

            <div class="mt-4">
              <button class="btn btn-outline-secondary me-2" @click="$router.back()">
                ⬅ Quay lại
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted mt-5">
      <h3>❌ Không tìm thấy sản phẩm</h3>
      <p>Sản phẩm có thể đã bị xóa hoặc đường dẫn không đúng.</p>
      <button class="btn btn-primary" @click="$router.push('/admin/products')">
        Về danh sách
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const product = ref(null)
const isLoading = ref(true)

// Hàm xử lý ảnh giống bên trang danh sách
const getImageUrl = (imageName) => {
  if (!imageName) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (imageName.startsWith('http')) return imageName;
  if (imageName.startsWith('/')) return imageName;
  return `/src/assets/images/${imageName}`;
}

const fetchProductDetail = async () => {
  const id = route.params.id;
  isLoading.value = true;
  try {
    // Gọi API lấy chi tiết: http://localhost:3000/products/1
    const response = await axios.get(`http://localhost:3000/products/${id}`);
    product.value = response.data;
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
    product.value = null;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchProductDetail();
})
</script>

<style scoped>
.text-orange { color: #ff7a00; }
.price { color: #ff7a00; font-weight: bold; font-size: 1.5rem; }
.product-img { max-height: 400px; object-fit: contain; }
</style>