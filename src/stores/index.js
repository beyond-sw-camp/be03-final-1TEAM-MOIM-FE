import { defineStore } from "pinia";

// dialog가 열려 있는지 여부를 관리한다.
export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
        isDialogOpen: false
    }),
    actions: {
        openDialog() {
            this.isDialogOpen = true;
        },
        closeDialog() {
            this.isDialogOpen = false;
        }
    }
})