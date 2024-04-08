import { createRouter, createWebHistory } from "vue-router";
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";


const routes = [
    {path: "/register", name: "register", component: Register},
    {path: "/", name: "home", component: Login},
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;