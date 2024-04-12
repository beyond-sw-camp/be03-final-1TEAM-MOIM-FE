<template>
	<!-- <MainPage></MainPage> -->
	<!-- App.vue 파일에서 <MainPage></MainPage>를 직접 렌더링하는 방식을 사용하고 있으면, 항상 MainPage 컴포넌트만 보이게 됨-->
	<!-- 원하는 대로 라우터를 사용하여 다른 페이지로 이동하려면,
		vue-router가 관리하는 라우트에 따라 컴포넌트를 동적으로 렌더링할 수 있도록 <router-view></router-view>를 사용해야 함-->
	<router-view></router-view>
  <v-app>
    <v-dialog v-model="mainStore.isDialogOpen" max-width="600px">
      <EventDialog/>
    </v-dialog>
  </v-app>
</template>

<script setup>
import EventDialog from "@/pages/event/EventDialog.vue";
import {useMainStore} from "@/stores";

const mainStore = useMainStore();
</script>

<style>

</style>