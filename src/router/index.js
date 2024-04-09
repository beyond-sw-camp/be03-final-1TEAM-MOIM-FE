import {createRouter, createWebHistory} from "vue-router";
import MainPage from "@/components/MainPage.vue";
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";
import EventCreate from "@/components/EventCreate.vue";

const routes = [
    { path: "/", redirect: '/main' },
    { path: "/main", name: "MainPage", component: MainPage },

    { path: "/event", name: "EventCreate", component: EventCreate },

    { path: "/register", name: "register", component: Register},
    { path: "/", name: "home", component: Login }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;