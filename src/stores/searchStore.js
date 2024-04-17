import {defineStore} from "pinia";

export const useSearchStore = defineStore({
    id: 'search',
    state: () => ({
        results: []
    }),
    actions: {
        setResults(results) {
            this.results = [];
            this.results = results;
        }
    }
});