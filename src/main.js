import {loadFonts} from './plugins/webfontloader';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.css'


loadFonts();

const app = createApp(App);
// 401응답의 경우 inteceptor를 통해 공통적으로 토큰 제거 후 로그아웃처리
axios.interceptors.response.use(response => response, error =>{
    if(error.response && error.response.status === 401){
        localStorage.removeItem('accessToken');
    }
    return Promise.reject(error)
})

app.use(router);
app.use(vuetify);
app.use(createPinia());
app.component("VueDatePicker", VueDatePicker);
app.mount("#app");