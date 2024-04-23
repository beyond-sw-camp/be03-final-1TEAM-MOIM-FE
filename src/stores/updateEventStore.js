import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', {
    state: () => ({
        currentEvent: {}
    }),
    actions: {
        setCurrentEvent(event) {
            this.currentEvent = event;
        },
        clearCurrentEvent() {
            this.currentEvent = {};
        }
    }
});