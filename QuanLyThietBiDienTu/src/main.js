import { createApp } from 'vue'
import { products } from '@/data/products'
import { computed } from 'vue'
import App from './App.vue'
import router from './router'

// CSS
import './assets/base.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

createApp(App)
  .use(router)
  .mount('#app')