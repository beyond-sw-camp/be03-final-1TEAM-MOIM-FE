import {loadFonts} from './plugins/webfontloader';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
// import VueSweetalert2 from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css';

loadFonts();

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(createPinia());
app.component("VueDatePicker", VueDatePicker);
app.mount("#app");
// app.use(VueSweetalert2);