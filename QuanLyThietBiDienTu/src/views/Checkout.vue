<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cart = ref([
  { id: 1, name: 'Thiết bị A', price: 150000, quantity: 1 },
  { id: 2, name: 'Thiết bị B', price: 300000, quantity: 2 }
])

const order = ref({
  name: '',
  address: '',
  phone: '',
  payment: 'COD'
})

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const formatPrice = (price) =>
  price.toLocaleString('vi-VN') + ' ₫'

const submitOrder = () => {
  alert('Thanh toán thành công!')
  router.push('/cart')
}
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">💳 Thanh toán</h2>

    <form @submit.prevent="submitOrder" class="bg-white p-4 rounded shadow">
      <div class="mb-3">
        <label class="form-label">Họ tên</label>
        <input v-model="order.name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <input v-model="order.address" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input v-model="order.phone" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Phương thức thanh toán</label>
        <select v-model="order.payment" class="form-select">
          <option value="COD">Thanh toán khi nhận hàng</option>
          <option value="BANK">Chuyển khoản</option>
        </select>
      </div>

      <div class="alert alert-info">
        Tổng tiền: <strong>{{ formatPrice(total) }}</strong>
      </div>

      <button class="btn btn-primary">Xác nhận thanh toán</button>
      <router-link to="/cart" class="btn btn-secondary ms-2">
        Quay lại
      </router-link>
    </form>
  </div>
</template>
