<template>
  <div class="container-fluid">
    <div class="container-xl px-4 mt-4">

      <h3 class="text-orange mb-3">📦 Quản lý sản phẩm (Kết nối API)</h3>

      <div class="row g-2 mb-3 align-items-center">
        <div class="col-md-6 col-12">
          <input
            v-model="keyword"
            class="form-control"
            placeholder="🔍 Tìm kiếm sản phẩm..."
          />
        </div>
        <div class="col-md-6 col-12 text-md-end">
          <button class="btn btn-orange" @click="openAdd">
            ➕ Thêm sản phẩm
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle bg-white shadow-sm w-100">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th class="text-center" width="220">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center py-4">
                <div class="spinner-border text-orange" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div>Đang tải dữ liệu từ Server...</div>
              </td>
            </tr>

            <tr v-else v-for="p in filteredProducts" :key="p.id">
              <td>{{ p.id }}</td>
              <td>
                <img
                  :src="p.image.startsWith('http') ? p.image : `/src/assets/images/${p.image}`"
                  width="60"
                  class="rounded"
                  @error="$event.target.src = 'https://via.placeholder.com/60'"
                />
              </td>
              <td>{{ p.name }}</td>
              <td>{{ p.category }}</td>
              <td class="text-orange fw-bold">
                {{ Number(p.price).toLocaleString() }} ₫
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-info me-1" @click="viewDetail(p.id)">
                  👁️
                </button>
                <button class="btn btn-sm btn-warning me-1" @click="openEdit(p)">
                  ✏️
                </button>
                <button class="btn btn-sm btn-danger" @click="remove(p.id)">
                  🗑️
                </button>
              </td>
            </tr>

            <tr v-if="!isLoading && filteredProducts.length === 0">
              <td colspan="6" class="text-center text-muted">
                Không tìm thấy sản phẩm nào
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showForm" class="modal fade show d-block bg-dark bg-opacity-50">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-orange text-white">
              <h5>{{ isEdit ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm' }}</h5>
              <button class="btn-close" @click="closeForm"></button>
            </div>

            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Tên sản phẩm</label>
                  <input v-model="form.name" class="form-control" placeholder="Nhập tên..." />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Danh mục</label>
                  <select v-model="form.category" class="form-select">
                    <option value="">-- Chọn danh mục --</option>
                    <option value="CPU">CPU</option>
                    <option value="RAM">RAM</option>
                    <option value="GPU">GPU</option>
                    <option value="SSD">SSD</option>
                    <option value="HDD">HDD</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Giá tiền (VNĐ)</label>
                  <input v-model.number="form.price" type="number" class="form-control" placeholder="Nhập giá..." />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Tên file ảnh</label>
                  <input v-model="form.image" class="form-control" placeholder="Ví dụ: inteli5.png" />
                </div>
                <div class="col-12">
                  <label class="form-label">Mô tả chi tiết</label>
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                    placeholder="Mô tả sản phẩm..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeForm">Hủy</button>
              <button class="btn btn-orange" @click="save">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
                💾 Lưu
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // ⚠️ Đừng quên cài: npm install axios

const router = useRouter()

/* ===================== CẤU HÌNH API ===================== */
// Thay đổi URL này thành URL API thật của nhóm bạn
const API_URL = 'http://localhost:3000/products';

/* ===================== STATE ===================== */
const keyword = ref('')
const showForm = ref(false)
const isEdit = ref(false)
const isLoading = ref(false) // Trạng thái đang tải danh sách
const isSaving = ref(false)  // Trạng thái đang lưu

const products = ref([])

const form = ref({
  id: null,
  name: '',
  category: '',
  price: null,
  image: '',
  description: ''
})

/* ===================== GỌI API (GET) ===================== */
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL);
    products.value = response.data;
    console.log("Đã tải xong danh sách sản phẩm!");
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    alert('Không thể kết nối đến Server! Vui lòng kiểm tra lại API.');
  } finally {
    isLoading.value = false;
  }
}

/* ===================== COMPUTED ===================== */
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(keyword.value.toLowerCase())
  )
)

/* ===================== FORM ACTIONS ===================== */
const openAdd = () => {
  isEdit.value = false
  form.value = {
    id: null, // ID sẽ do Server tự sinh
    name: '',
    category: '',
    price: null,
    image: '',
    description: ''
  }
  showForm.value = true
}

const openEdit = (p) => {
  isEdit.value = true
  // Copy dữ liệu vào form để sửa
  form.value = { ...p }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

/* ===================== SAVE (POST / PUT) ===================== */
const save = async () => {
  // Validate cơ bản
  if (!form.value.name || !form.value.category) {
    alert('⚠️ Vui lòng nhập tên và danh mục!')
    return
  }
  if (!form.value.price || form.value.price <= 0) {
    alert('⚠️ Giá phải lớn hơn 0')
    return
  }

  isSaving.value = true;
  try {
    if (isEdit.value) {
      // --- SỬA (PUT) ---
      // Gọi API: PUT http://localhost:3000/products/1
      await axios.put(`${API_URL}/${form.value.id}`, form.value);
      alert('✅ Cập nhật thành công!');
    } else {
      // --- THÊM (POST) ---
      // Gọi API: POST http://localhost:3000/products
      // Lưu ý: Không cần gửi ID, Server tự tạo
      const { id, ...productData } = form.value; 
      await axios.post(API_URL, productData);
      alert('✅ Thêm mới thành công!');
    }
    
    // Tắt form và tải lại danh sách mới nhất
    closeForm();
    await fetchProducts();

  } catch (error) {
    console.error('Lỗi khi lưu:', error);
    alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
  } finally {
    isSaving.value = false;
  }
}

/* ===================== REMOVE (DELETE) ===================== */
const remove = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
    try {
      // Gọi API: DELETE http://localhost:3000/products/1
      await axios.delete(`${API_URL}/${id}`);
      
      // Xóa thành công thì tải lại danh sách
      // (Hoặc có thể xóa luôn trên giao diện để đỡ gọi API lại)
      products.value = products.value.filter(p => p.id !== id);
      
      alert('🗑️ Đã xóa thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('❌ Không thể xóa sản phẩm này!');
    }
  }
}

/* ===================== NAVIGATE ===================== */
const viewDetail = (id) => {
  router.push(`/admin/products/${id}`)
}

/* ===================== LIFECYCLE ===================== */
onMounted(() => {
  // Gọi hàm lấy dữ liệu ngay khi vào trang
  fetchProducts();
})

</script>

<style scoped>
.text-orange { color: #ff7a00; }
.bg-orange { background-color: #ff7a00; }
.btn-orange { background-color: #ff7a00; color: #fff; }
.btn-orange:hover { background-color: #e56d00; }

table { min-width: 900px; }
</style>