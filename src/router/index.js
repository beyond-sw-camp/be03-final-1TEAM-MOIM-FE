import {createRouter, createWebHistory} from "vue-router";
import MainPage from "@/components/MainPage.vue";
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";
import Oauth2Redirect from "@/components/Oauth2Redirect.vue";
import EventCreate from "@/components/EventCreate.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import EisenhowerMatrix from "@/views/EisenhowerMatrix.vue";


const routes = [
    
    {path: "/login",name: "login", component: Login, beforeEnter: (to, from, next) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken){
        next('/main'); // accessToken이 있으면 /main으로 redirect
      } else {
        next(); // accessToken이 없으면 로그인 페이지로 진입
      }
    }},
    {path: "/register", name: "register", component: Register},
    {path: "/oauth2/redirect", component: Oauth2Redirect},
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