<template>
  <div class="container mt-4">

    <!-- BREADCRUMB -->
    <nav class="mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/admin/products">Quản lý sản phẩm</router-link>
        </li>
        <li class="breadcrumb-item active">Chi tiết</li>
      </ol>
    </nav>

    <!-- BACK -->
    <button class="btn btn-outline-secondary mb-3" @click="$router.back()">
      ⬅ Quay lại
    </button>

    <!-- PRODUCT DETAIL -->
    <div v-if="product" class="card shadow border-0">
      <div class="row g-0">

        <!-- IMAGE -->
        <div class="col-md-5 p-4 text-center bg-light">
          <img
            :src="`/src/assets/images/${product.image}`"
            class="img-fluid rounded product-img"
          />
        </div>

        <!-- INFO -->
        <div class="col-md-7">
          <div class="card-body p-4">

            <span class="badge bg-secondary mb-2">
              {{ product.category }}
            </span>

            <h3 class="text-orange fw-bold">
              {{ product.name }}
            </h3>

            <h4 class="price mt-2">
              {{ product.price.toLocaleString() }} ₫
            </h4>

            <hr />

            <p class="text-muted">
              {{ product.description }}
            </p>

            <!-- QUICK INFO -->
            <div class="row mt-4">
              <div class="col-6">
                <small class="text-muted">Mã sản phẩm</small>
                <p class="fw-semibold">#{{ product.id }}</p>
              </div>
              <div class="col-6">
                <small class="text-muted">Tình trạng</small>
                <p class="text-success fw-semibold">Còn hàng</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- NOT FOUND -->
    <div v-else class="text-center text-muted mt-5">
      ❌ Không tìm thấy sản phẩm
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)

onMounted(() => {
  const id = Number(route.params.id)
  const data = localStorage.getItem('products')

  if (data) {
    const products = JSON.parse(data)
    product.value = products.find(p => p.id === id) || null
  }
})
</script>

<style scoped>
.text-orange {
  color: #ff7a00;
}

.price {
  color: #ff7a00;
  font-weight: bold;
}

.product-img {
  max-height: 300px;
  object-fit: contain;
}

.breadcrumb a {
  text-decoration: none;
}
</style>
