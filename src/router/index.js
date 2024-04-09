import {createRouter, createWebHistory} from "vue-router";
import MainPage from "@/components/MainPage.vue";
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";
import EventCreate from "@/components/EventCreate.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import TestView from "@/views/TestView.vue";

const routes = [

    {
        path: "/main",
        name: "MainPage",
        redirect: "/calendar",
        component: MainPage
    },
    {
        path: "/",
        name: "home",
        component: Login
    },
    {
        path: "/event",
        name: "EventCreate",
        component: EventCreate
    },
    {
        path: "/register",
        name: "register",
        component: Register
    },
    {
        path: "/calendar",
        component: CalendarComponent
    },
    {
        path: "/test",
        name: "testPage",
        component: TestView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;