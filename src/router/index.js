import {createRouter, createWebHistory} from "vue-router";
import MainPage from "@/components/MainPage.vue";
import EventCreate from "@/components/EventCreate.vue";

const routes = [
    {
        path: "/",
        redirect: '/main'
    },
    {
        path: "/main",
        name: "MainPage",
        component: MainPage
    },
    {
        path: "/event",
        name: "EventCreate",
        component: EventCreate
    },

];

export default createRouter({
    history: createWebHistory(),
    routes,
})