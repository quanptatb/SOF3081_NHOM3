<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Quản Lý Đơn Hàng</h1>
        <p class="text-sm text-gray-500">Theo dõi và cập nhật trạng thái đơn hàng</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Tìm mã đơn, tên, sđt..." 
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
          >
        </div>

        <select 
          v-model="filterStatus" 
          class="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Chờ xử lý</option>
          <option value="Confirmed">Đã xác nhận</option>
          <option value="Shipping">Đang vận chuyển</option>
          <option value="Delivered">Đã giao hàng</option>
          <option value="Cancelled">Đã hủy</option>
        </select>
        
        <button @click="resetData" class="text-xs text-red-500 underline whitespace-nowrap self-center hover:text-red-700">
          Reset dữ liệu
        </button>
      </div>
    </div>

    <div class="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 border-b">
            <tr>
              <th scope="col" class="px-6 py-4 font-bold">Mã Đơn</th>
              <th scope="col" class="px-6 py-4">Khách Hàng</th>
              <th scope="col" class="px-6 py-4">Tổng Tiền</th>
              <th scope="col" class="px-6 py-4">Ngày Đặt</th>
              <th scope="col" class="px-6 py-4 text-center">Trạng Thái (Sửa)</th>
              <th scope="col" class="px-6 py-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-blue-50 transition-colors duration-150">
              <td class="px-6 py-4 font-bold text-gray-900">
                #{{ order.id }}
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ order.customerName }}</div>
                <div class="text-xs text-gray-500">{{ order.phone }}</div>
                <div class="text-xs text-gray-400 truncate w-40">{{ order.address }}</div>
              </td>
              <td class="px-6 py-4 font-bold text-red-600">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="px-6 py-4 text-gray-500">
                {{ formatDate(order.date) }}
              </td>
              <td class="px-6 py-4 text-center">
                <select 
                  v-model="order.status" 
                  @change="updateOrderStatus(order)"
                  :class="getStatusClass(order.status)"
                  class="text-xs font-semibold py-1 px-2 rounded border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 transition-all shadow-sm"
                >
                  <option value="Pending" class="bg-white text-gray-800">⏳ Chờ xử lý</option>
                  <option value="Confirmed" class="bg-white text-gray-800">✅ Đã xác nhận</option>
                  <option value="Shipping" class="bg-white text-gray-800">🚚 Đang vận chuyển</option>
                  <option value="Delivered" class="bg-white text-gray-800">🎉 Đã giao hàng</option>
                  <option value="Cancelled" class="bg-white text-gray-800">❌ Đã hủy</option>
                </select>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="deleteOrder(order.id)"
                  class="text-gray-400 hover:text-red-600 transition-colors p-2"
                  title="Xóa đơn hàng"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <div class="text-4xl mb-2">🔍</div>
        <p class="text-gray-500">Không tìm thấy đơn hàng nào phù hợp.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// --- DATA ---
const orders = ref([]);
const searchQuery = ref('');
const filterStatus = ref(''); 

// --- COMPUTED: Xử lý tìm kiếm và lọc ---
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // 1. Lọc theo trạng thái
    if (filterStatus.value && order.status !== filterStatus.value) {
      return false;
    }

    // 2. Tìm kiếm theo từ khóa
    const query = searchQuery.value.toLowerCase();
    const matchesSearch = 
      order.id.toString().toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query);

    return matchesSearch;
  });
});

// --- METHODS ---
const loadOrders = () => {
  const data = localStorage.getItem('site_orders');
  orders.value = data ? JSON.parse(data) : [];
};

const updateOrderStatus = (order) => {
  saveData();
};

const deleteOrder = (id) => {
  if(confirm('Bạn có chắc muốn xóa vĩnh viễn đơn hàng này?')) {
    orders.value = orders.value.filter(o => o.id !== id);
    saveData();
  }
};

const saveData = () => {
  localStorage.setItem('site_orders', JSON.stringify(orders.value));
};

const resetData = () => {
  if(confirm('Xóa sạch dữ liệu cũ để test lại?')) {
    localStorage.removeItem('site_orders');
    orders.value = [];
  }
};

// --- HELPERS ---
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' });
  } catch { return dateStr; }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-700 ring-yellow-200';
    case 'Confirmed': return 'bg-blue-100 text-blue-700 ring-blue-200';
    case 'Shipping': return 'bg-purple-100 text-purple-700 ring-purple-200';
    case 'Delivered': return 'bg-green-100 text-green-700 ring-green-200';
    case 'Cancelled': return 'bg-gray-100 text-gray-500 ring-gray-200 line-through';
    default: return 'bg-white border-gray-300';
  }
};

onMounted(() => {
  loadOrders();
});
</script>