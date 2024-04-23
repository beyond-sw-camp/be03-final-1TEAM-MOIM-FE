import {loadFonts} from './plugins/webfontloader';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import token from './plugins/tokenPlugin';
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
// import VueSweetalert2 from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css';

loadFonts()

const app = createApp(App);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401){
            this.$token("/api/auth/reissue");
        }
        return Promise.reject(error);
    }
);

app.use(router);
app.use(vuetify);
app.use(token);
// app.use(VueSweetalert2);
app.use(createPinia())
app.component('VueDatePicker', VueDatePicker);
app.mount('#app');