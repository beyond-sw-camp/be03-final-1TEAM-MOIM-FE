import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "@/components/LoginComponent";

const routes = [
    {
        path: "/",
        redirect: '/main'
    },
    {
        path: "/login",
        name: "LoginComponent",
        component: LoginComponent
    },
];

export default createRouter({
    history: createWebHistory(),
    routes,
})