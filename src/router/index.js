import {createRouter, createWebHistory} from "vue-router";
import MainPage from "@/components/MainPage.vue";
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";
import EventCreate from "@/components/EventCreate.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import EisenhowerMatrix from "@/views/EisenhowerMatrix.vue";


const routes = [
    
    {path: "/login",name: "login",component: Login},
    {path: "/register", name: "register", component: Register},
    {  
      path: "/",
      redirect: "/main",
      component: MainPage, // MainPage를 부모 컴포넌트로 사용
      children: [ // MainPage 안에 렌더링 될 자식 라우트들
        { path: "main", name: "MainPage", component: {} }, // MainPage의 기본 화면
        { path: "event", name: "EventCreate", component: EventCreate },
        { path: "calendar", name: "calendar", component: CalendarComponent },
        { path: "EisenhowerMatrix", name: "EisenhowerMatrix", component: EisenhowerMatrix },
      ]
    },

    
  ];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;