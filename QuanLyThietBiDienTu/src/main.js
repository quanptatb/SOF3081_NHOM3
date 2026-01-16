import { createApp } from 'vue'
import { products } from '@/data/products'
import { computed } from 'vue'
import App from './App.vue'
import router from './router'

// CSS
import './assets/main.css'
import './assets/base.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App)
  .use(router)
  .mount('#app')

