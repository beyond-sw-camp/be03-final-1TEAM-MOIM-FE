import { createRouter, createWebHistory } from "vue-router";
import EventCreate from "@/components/EventCreate.vue";
// import LoginComponent from "@/components/LoginComponent";


const routes = [
    {
        path: "/",
        redirect: '/main'
    },
    {
        path: "/event",
        name: "EventCreate",
        component: EventCreate
    },
   
    // {
    //     path: "/login",
    //     name: "LoginComponent",
    //     component: LoginComponent
    // },

];

export default createRouter({
    history: createWebHistory(),
    routes,
})