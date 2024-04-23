import { defineStore } from "pinia";

// dialog가 열려 있는지 여부를 관리한다.
export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
        isDialogOpen: false,
        dialogType: null // 'event' 또는 'moim' 값을 가질 수 있음
    }),
    actions: {
        openDialog(type) {
            this.isDialogOpen = true;
            this.dialogType = type;
        },
        closeDialog() {
            this.isDialogOpen = false;
            this.dialogType = null;
        }
    }
})