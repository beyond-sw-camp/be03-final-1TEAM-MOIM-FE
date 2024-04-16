import {createRouter, createWebHistory} from "vue-router";
import MainPage from "@/components/MainPage.vue";
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";
import CalendarComponent from "@/views/CalendarComponent.vue";
import TestView from "@/views/TestView.vue";
import EventDialog from "@/pages/event/EventDialog.vue";
import EisenhowerMatrix from "@/views/EisenhowerMatrix.vue";

const routes = [

    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/register",
        name: "register",
        component: Register
    },
    {
        path: "/",
        redirect: '/main',
        component: MainPage,
        children: [
            {
                path: "main",
                name: "MainPage",
                component: {}
            },
            {
                path: "calendar",
                name: "calendar",
                component: CalendarComponent
            },
            {
                path: "test",
                name: "testPage",
                component: TestView
            },
            {
                path: "event",
                name: "EventDialog",
                component: EventDialog
            },
            {
                path: "EisenhowerMatrix",
                name: "EisenhowerMatrix",
                component: EisenhowerMatrix
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;