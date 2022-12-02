import {
    createApp
} from 'vue'
import App from './App.vue'
//router路由
import router from './router/index'
//状态管理
import store from './store/index'
//cookie
import cookies from 'vue-cookies'
//element配置
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)

//使用组件
app.use(router);
app.use(store);
//cookie配置
app.config.globalProperties.$cookies = cookies

//element配置
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')