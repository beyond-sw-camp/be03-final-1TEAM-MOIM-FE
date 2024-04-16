<template>
  <div>
    <CommonDialog
        ref="dialog"
        title="예시 타이틀"
        message="이 곳에 메시지를 커스텀해서 넣으면 됩니다."
        @confirm="performAction"
    />
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-btn @click="showDialog">공통 다이얼로그 테스트</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CommonDialog from "@/components/CommonDialog.vue";

export default{
  components: {
    CommonDialog,
  },
  methods: {
    showDialog() {
      this.$refs.dialog.openDialog();
    },
    performAction() {
      console.log("작업을 수행합니다.");
    },
  },
};
</script>

<style scoped>

</style>