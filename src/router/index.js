import { createRouter, createWebHistory } from "vue-router";
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";
import EventCreate from "@/components/EventCreate.vue";


const routes = [
    {path: "/register", name: "register", component: Register},
    {path: "/", name: "home", component: Login},
    {path: "/event", name: "EventCreate", component: EventCreate},

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;