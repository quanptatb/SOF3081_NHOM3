<script setup>
import { ref, computed } from 'vue'

const cart = ref([
  { id: 1, name: 'Thiết bị A', price: 150000, quantity: 1 },
  { id: 2, name: 'Thiết bị B', price: 300000, quantity: 2 }
])

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const removeItem = (id) => {
  cart.value = cart.value.filter(item => item.id !== id)
}

const formatPrice = (price) =>
  price.toLocaleString('vi-VN') + ' ₫'
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">🛒 Giỏ hàng</h2>

    <table class="table table-bordered bg-white">
      <thead class="table-dark">
        <tr>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in cart" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ formatPrice(item.price) }}</td>
          <td>
            <input
              type="number"
              min="1"
              v-model="item.quantity"
              class="form-control w-50"
            />
          </td>
          <td>{{ formatPrice(item.price * item.quantity) }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeItem(item.id)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="text-end">
      <h4>
        Tổng tiền:
        <span class="text-danger">{{ formatPrice(total) }}</span>
      </h4>

      <router-link to="/checkout" class="btn btn-success mt-2">
        Thanh toán
      </router-link>
    </div>
  </div>
</template>
